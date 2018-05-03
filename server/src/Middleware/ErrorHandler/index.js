//Instantiated
const ERROR_STATUS = 202;
const MAX_ERROR_MSG_LENGTH = 250;

/* eslint-disable max-params */
const ErrorHandler = function (err, req, res, next) {
	/* send error information to client DEVELOPMENT ENV only! */
	res.status(ERROR_STATUS);
	
	res.json({ success: false, msg: err.toString().substring(0, MAX_ERROR_MSG_LENGTH) });
};

export { ErrorHandler };
export default ErrorHandler;
