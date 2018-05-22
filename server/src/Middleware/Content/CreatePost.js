//Dependencies
import Logger from 'winston';

//Local dependencies
import { PostModel } from './../../Models/Post';
import { RequestError } from '../../Errors/RequestError';

const CreatePost = function(req, res, next) {
	const postData = {
		author: req.user._id,
		comment: req.body.comment,
	};

	if (req.media != null) {
		postData.media = req.media._id;
	} else if (postData.comment == null) {
		return next(new RequestError(`No content provided with post; please provide media or a comment.`, RequestError.Codes.badRequest, true));
	}

	const postRecord = new PostModel(postData);
	postRecord.save()
		.then((savedPost) => {
			return savedPost.fillAll();
		})
		.then((filledPost) => {
			req.returnJson.success = true;
			req.returnJson.msg = `Successfully created new post.`;
			req.returnJson.data.post = filledPost;
			next();
		})
		.catch((err) => {
			next(err);
		});
};

export { CreatePost };
export default CreatePost;
