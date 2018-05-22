//Dependencies
import Logger from 'winston';

//Local dependencies
import { UserModel } from './../../Models/User';
import { RequestError } from './../../Errors/RequestError';

import { Security } from './../../Utilities/Security';

//Instantiated
const GetUserFromToken = function (req, res, next) {
	if (req.tokenData == null) {
		return next();
	}

	UserModel.findByEmail(req.tokenData.user)
		.then((foundUser) => {
			if (foundUser == null) {
				Logger.warn(`User ${req.tokenData.user} had a valid token but has no matching record in the database.`);

				next(new RequestError(`Encountered an error servicing your request, please try logging in again.`, RequestError.Codes.unauthorized, true));
			}

			req.user = foundUser;
			next();
		})
		.catch((err) => {
			next(err);
		});
};

export { GetUserFromToken };
export default GetUserFromToken;
