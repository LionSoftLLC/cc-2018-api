//Dependencies
import Logger from 'winston';

//Local dependencies
import { PostModel } from './../../Models/Post';
import { ReactionModel } from './../../Models/Reaction';
import { RequestError } from '../../Errors/RequestError';

const CreateReaction = function(req, res, next) {
	const postId = req.params.postId || req.body.postId;
	if (postId == null) {
		return next(new RequestError(`No postId specified for reaction.`, RequestError.Codes.badRequest, true));
	}

	const reactionData = {
		author: req.user._id,
		comment: req.body.comment,
	};

	if (req.media != null) {
		reactionData.media = req.media._id;
	} else if (reactionData.comment == null) {
		return next(new RequestError(`No content provided with reaction; please provide media or a comment.`, RequestError.Codes.badRequest, true));
	}

	const reactionRecord = new ReactionModel(reactionData);

	PostModel.findById(postId)
		.then((foundPost) => {
			if (foundPost == null) {
				return Promise.reject(new RequestError(`Could not find the specified post, please try again.`, RequestError.Codes.notFound, true));
			}

			foundPost.reactions.push(reactionRecord._id);

			return Promise.all([
				foundPost.save(),
				reactionRecord.save(),
			]);
		})
		.then((results) => {
			const [
				savedPost,
				savedReaction
			] = results;

			return savedPost.fillAll();
		})
		.then((filledPost) => {
			req.returnJson.success = true;
			req.returnJson.msg = `Successfully created reaction for post.`;
			req.returnJson.data.post = filledPost;
			next();
		})
		.catch((err) => {
			next(err);
		});
};

export { CreateReaction };
export default CreateReaction;
