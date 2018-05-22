//Dependencies
import Logger from 'winston';

//Local dependencies
import { PostModel } from './../../Models/Post';
import { RequestError } from '../../Errors/RequestError';

const UpdateProfile = function(req, res, next) {
	next(new Error(`UpdateProfile not implemented!`));
};

export { UpdateProfile };
export default UpdateProfile;
