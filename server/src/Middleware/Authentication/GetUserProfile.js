//Dependencies
import Logger from 'winston';

//Local dependencies
import { UserModel } from './../../Models/User';
import { RequestError } from './../../Errors/RequestError';

import { Security } from './../../Utilities/Security';

//Instantiated
const GetUserProfile = function (req, res, next) {
	req.user.getProfile()
		.then((foundProfile) => {
			if (foundProfile == null) {
				return Promise.reject(new Error(`User ${req.user.email} does not have an associated Profile record!`));
			} else {
				req.userProfile = foundProfile;
				next();
			}
		})
		.catch((err) => {
			next(err);
		});
};

export { GetUserProfile };
export default GetUserProfile;
