//Dependencies
import Logger from 'winston';

//Local dependencies
import { RequestError } from '../../Errors/RequestError';

const UploadProfileImage = function(req, res, next) {
	next(new Error(`UploadProfileImage not implemented!`));
};

export { UploadProfileImage };
export default UploadProfileImage;
