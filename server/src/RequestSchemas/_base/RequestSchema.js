//Dependencies
import { Types } from 'mongoose';
import inspector from 'schema-inspector';

//Instantiated
const RequestSchema = class RequestSchema {
	constructor(requestBody, sanitizationSchema, validationSchema) {
		if (requestBody == null) {
			throw new Error(`Cannot create a request schema without providing a request body!`);
		}
		if (sanitizationSchema == null) {
			throw new Error(`Cannot create a request schema without providing a sanitization schema!`);
		}
		if (validationSchema == null) {
			throw new Error(`Cannot create a request schema without providing a validation schema!`);
		}

		this._requestBody = requestBody;
		this._sanitizationSchema = sanitizationSchema;
		this._validationSchema = validationSchema;

		this._run();
	}

	////////////////////////
	// GETTERS AND SETTERS//
	////////////////////////

	get Valid() {
		return this._valid;
	}

	get RawData() {
		return this._requestBody;
	}

	get SanitizedData() {
		return this._sanitizedData;
	}

	get ErrorReport() {
		return this._errorReport;
	}

	////////////////////
	// PRIVATE METHODS//
	////////////////////

	_run() {
		// preserve context
		const _this = this;

		const sanitizedBody = _this._sanitize(_this._requestBody);
		const validation = _this._validate(sanitizedBody);

		_this._valid = validation.valid;
		_this._sanitizedData = sanitizedBody.data;
		_this._errorReport = validation.format();
	}

	_sanitize() {
		// preserve context
		const _this = this;

		return inspector.sanitize(_this._sanitizationSchema, _this._requestBody);
	}

	_validate() {
		// preserve context
		const _this = this;

		return inspector.validate(_this._validationSchema, _this._requestBody);
	}

	////////////////////
	// UTILITY METHODS//
	////////////////////

	static ValidateObjectId(schema, data) {
		// preserve context
		const _this = this;

		if (Types.ObjectId.isValid(data) === false) {
			_this.report(`must be a valid user ID`);
		}
	}
};

export { RequestSchema };
export default RequestSchema;
