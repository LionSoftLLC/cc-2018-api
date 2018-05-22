//Dependencies
import Logger from 'winston';

//Local dependencies
import { RequestError } from './../../Errors/RequestError';

//Instantiated
const RequireLogin = function (req, res, next) {
	if (req.user == null) {
		return next(new RequestError(`You must be logged in to perform this action`, RequestError.Codes.unauthorized, true));
	}

	next();
};

export { RequireLogin };
export default RequireLogin;
