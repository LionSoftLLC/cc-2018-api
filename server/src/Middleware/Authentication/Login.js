//Local dependencies
import { UserModel } from './../../Models/User';
import { LoginRequest } from './../../RequestSchemas/Authentication/LoginRequest';
import { RequestError } from './../../Errors/RequestError';

import { Security } from './../../Utilities/Security';

//Instantiated
const Login = function (req, res, next) {
	const requestReport = new LoginRequest(req.body);
	if (requestReport.Valid === false) {
		return next(new RequestError(`Invalid login information provided:\n${requestReport.ErrorReport}`, RequestError.Codes.badRequest, true));
	}

	let user;
	UserModel.findByEmail(requestReport.SanitizedData.email)
		.then((foundUser) => {
			if (foundUser == null) {
				return Promise.reject(new RequestError(`Login failed, please try again.`, RequestError.Codes.unauthorized, true));
			}
			user = foundUser;

			return Security.VerifyPassword(requestReport.SanitizedData.password, foundUser.credentials);
		})
		.then((passwordMatch) => {
			if (passwordMatch !== true) {
				return Promise.reject(new RequestError(`Login failed, please try again.`, RequestError.Codes.unauthorized, true));
			}

			return Security.GenerateToken(user);
		})
		.then((token) => {
			req.returnJson = {
				msg: `Successfully logged in`,
				success: true,
				data: token,
			};

			res.json(req.returnJson);
		})
		.catch((err) => {
			next(err);
		});
};

export { Login };
export default Login;
