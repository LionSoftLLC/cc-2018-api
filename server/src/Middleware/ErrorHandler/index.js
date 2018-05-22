//Dependencies
import Logger from 'winston';

//Local dependencies
import RequestError from './../../Errors/RequestError';

//Instantiated
const DEFAULT_ERR_MESSAGE = `Encountered an error servicing your request. Please try again or contact support if the problem persists.`;

/* eslint-disable max-params */
/* eslint-disable max-statements */
const ErrorHandler = function (err, req, res, next) {
	let requestError = err;
	let returnJson;
	//Check whether the error is generic or one a defined RequestError
	if (!(requestError instanceof RequestError)) {
		//It's a generic error, create a request error from it
		requestError = new RequestError(err);
	}

	//Check if we're in development; if not, check if the error is expected
	if (process.env.NODE_ENV === `development` || requestError.Expected === true) {
		//set locals
		res.locals.message = requestError.Error.message;
		res.locals.error = requestError.Error;

		//Define the return object, include the error
		returnJson = { error: requestError.Status, msg: requestError.Error.message, success: false };
	} else {
		//We're not in development, and the error was unexpected
		//If we don't log the error, the server will never know the problem
		Logger.warn(`Encountered an unexpected error handling a request:`);
		Logger.warn(requestError.Error);

		//set locals
		res.locals.message = DEFAULT_ERR_MESSAGE;
		res.locals.error = {};

		//Define the return object, give a generic error message
		returnJson = { error: requestError.Status, msg: DEFAULT_ERR_MESSAGE, success: false };
	}

	//Set the error status
	res.status(requestError.Status);

	//send back the error
	res.json(returnJson);
};
/* eslint-enable max-statements */
/* eslint-enable max-params */

export { ErrorHandler };
export default ErrorHandler;
