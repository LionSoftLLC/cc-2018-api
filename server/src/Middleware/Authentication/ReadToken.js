//Dependencies

//Local dependencies
import Security from './../../Utilities/Security';
import { RequestError } from './../../Errors/RequestError';

//Instantiated

const ReadToken = function (req, res, next) {
	let token = req.get(`Authorization`);
	if (token != null) {
		if (token.startsWith(`Bearer `)) {
			token = token.replace(`Bearer `, ``);
		} else {
			next(new RequestError(`Invalid token provided`, RequestError.Codes.badRequest, true));
		}
	} else if (req.query.t != null) {
		token = req.query.t;
	} else {
		token = null;
	}

	req.token = token;
	if (token != null) {
		Security.ReadToken(token)
			.then((tokenData) => {
				req.tokenData = tokenData;
				next();
			})
			.catch((err) => {
				switch (err.name) {
					case `JsonWebTokenError`:
						next(new RequestError(`Encountered an error servicing your request, please try logging in again.`, RequestError.Codes.unauthorized, true));
						break;
					case `TokenExpiredError`:
						next(new RequestError(`Session expired. Please log in again.`, RequestError.Codes.unauthorized, true));
						break;
					default:
						next(new RequestError(err));
						break;
				}
			});
	} else {
		next();
	}
};

export { ReadToken };
export default ReadToken;
