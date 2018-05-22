//Local dependencies
import RequestSchema from './../_base/RequestSchema';

//Instantiated
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
		},
	},
};

const LoginRequest = class LoginRequest extends RequestSchema {
	constructor(requestBody) {
		super(requestBody, sanitizationSchema, validationSchema);
	}
};

export { LoginRequest };
export default LoginRequest;
