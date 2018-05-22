//Local dependencies
import RequestSchema from './../_base/RequestSchema';

//Instantiated
const MIN_PASSWORD_LENGTH = 12;

const sanitizationSchema = {
	type: `object`,
	properties: {
		email: {
			type: `string`,
			rules: [`trim`, `lower`],
		},
		password: {
			type: `string`,
		},
		firstName: {
			type: `string`,
			rules: [`trim`],
		},
		middleName: {
			type: `string`,
			rules: [`trim`],
			optional: true,
		},
		lastName: {
			type: `string`,
			rules: [`trim`],
		}
	},
};

const validationSchema = {
	type: `object`,
	properties: {
		email: {
			type: `string`,
			pattern: `email`,
		},
		password: {
			type: `string`,
			minLength: MIN_PASSWORD_LENGTH,
		},
		firstName: {
			type: `string`,
			minLength: 1,
		},
		middleName: {
			type: `string`,
			optional: true
		},
		lastName: {
			type: `string`,
			minLength: 1,
		}
	},
};

const RegisterRequest = class RegisterRequest extends RequestSchema {
	constructor(requestBody) {
		super(requestBody, sanitizationSchema, validationSchema);
	}
};

export { RegisterRequest };
export default RegisterRequest;
