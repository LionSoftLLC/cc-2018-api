//Dependencies
import _ from 'lodash';

//Instantiated
const codes = {
	ok: 200,
	badRequest: 400,
	unauthorized: 401,
	notFound: 404,
	conflict: 409,
	internal: 500,
};

const RequestError = class RequestError {
	constructor(error, status = codes.internal, expected = false) {
		this._error = error;
		this._status = status;
		this._expected = expected;

		if (typeof error === `string`) {
			//The passed error was just the error message, create a new error from it
			this._error = new Error(error);
		}
	}

	////////////////////
	// STATIC GETTERS //
	////////////////////

	static get Codes() {
		//Create a clone to prevent modification
		return _.clone(codes);
	}

	////////////////////////
	// GETTERS AND SETTERS//
	////////////////////////

	get Status() {
		return this._status;
	}

	get Error() {
		return this._error;
	}

	get Expected() {
		return this._expected;
	}
};

export { RequestError };
export default RequestError;
