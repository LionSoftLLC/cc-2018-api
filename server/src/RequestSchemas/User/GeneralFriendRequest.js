//Dependencies
import { Types } from 'mongoose';

//Local dependencies
import RequestSchema from './../_base/RequestSchema';

//Instantiated

const sanitizationSchema = {
	type: `object`,
	properties: {
		user: {
			type: `string`,
			rules: [`trim`],
		},
	},
};

const validationSchema = {
	type: `object`,
	properties: {
		user: {
			type: `string`,
			exec: RequestSchema.ValidateObjectId,
		},
	},
};

const GeneralFriendRequest = class GeneralFriendRequest extends RequestSchema {
	constructor(requestBody) {
		super(requestBody, sanitizationSchema, validationSchema);
	}
};

export { GeneralFriendRequest };
export default GeneralFriendRequest;
