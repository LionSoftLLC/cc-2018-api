//Local dependencies
import { UserModel } from './../../Models/User';
import { ProfileModel } from './../../Models/Profile';
import { RegisterRequest } from './../../RequestSchemas/Authentication/RegisterRequest';
import { RequestError } from './../../Errors/RequestError';

import { Security } from './../../Utilities/Security';

//Instantiated
const Register = function (req, res, next) {
	const requestReport = new RegisterRequest(req.body);
	if (requestReport.Valid === false) {
		return next(new RequestError(`Invalid registration information provided:\n${requestReport.ErrorReport}`, RequestError.Codes.badRequest, true));
	}

	UserModel.findByEmail(requestReport.SanitizedData.email)
		.then((foundUser) => {
			if (foundUser != null) {
				return Promise.reject(new RequestError(`Registration failed: user already exists.`, RequestError.Codes.conflict, true));
			}

			//All request validation complete, generate the user's login information
			return Security.CreateCredentials(requestReport.SanitizedData.password);
		})
		.then((credentials) => {
			//Create a new user, assigning the sanitized request data to the model followed by the generated credentials
			const userData = {
				...requestReport.SanitizedData,
				credentials
			};
			const userRecord = new UserModel(userData);

			const profileData = {
				userId: userRecord._id,
				...requestReport.SanitizedData,
			};
			const profileRecord = new ProfileModel(profileData);

			return Promise.all([
				userRecord.save(),
				profileRecord.save(),
			]);
		})
		.then((results) => {
			const [
				savedUser,
				savedProfile
			] = results;

			req.returnJson = {
				msg: `Successfully registered`,
				success: true,
				data: {
					user: savedUser.toReturnable(),
					profile: savedProfile,
				},
			};

			res.json(req.returnJson);
		})
		.catch((err) => {
			next(err);
		});
};

export { Register };
export default Register;
