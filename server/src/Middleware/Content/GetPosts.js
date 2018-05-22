//Dependencies
import _ from 'lodash';
import Logger from 'winston';

//Local dependencies
import { PostModel } from './../../Models/Post';
import { RequestError } from '../../Errors/RequestError';

//Instantiated
const POST_LIMIT = 100;

const GetPosts = function(req, res, next) {
	if (req.userProfile == null) {
		return next(new Error(`GetPosts middleware requires req.userProfile to be defined before running!`));
	}

	if (req.query == null || _.isEmpty(req.query)) {
		//Get all posts made by this user and their friends, sorted by creation date
		PostModel.find({
			author: {
				$in: [
					req.user._id,
					...req.userProfile.friends
				]
			}
		})
			.sort({ createdDate: -1 })
			.limit(POST_LIMIT)
			.then((foundPosts) => {
				return Promise.all(foundPosts.map((post) => { return post.fillAll(); }));
			})
			.then((filledPosts) => {
				req.returnJson = {
					success: true,
					msg: `Got recent posts`,
					data: filledPosts,
				};
				
				next();
			});
	} else {
		next(new RequestError(`Post query not yet supported`, RequestError.Codes.internal, true));
	}
};

export { GetPosts };
export default GetPosts;
