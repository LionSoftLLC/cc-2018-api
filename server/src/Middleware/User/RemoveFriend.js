//Dependencies
import _ from 'lodash';
import Logger from 'winston';

//Local dependencies
import { ProfileModel } from './../../Models/Profile';
import { RequestError } from '../../Errors/RequestError';
import { GeneralFriendRequest } from './../../RequestSchemas/User/GeneralFriendRequest';

const RemoveFriend = function(req, res, next) {
	const requestReport = new GeneralFriendRequest(req.body);
	if (requestReport.Valid === false) {
		return next(new RequestError(`Invalid registration information provided:\n${requestReport.ErrorReport}`, RequestError.Codes.badRequest, true));
	}
	
	//Ensure the user making the remove request is not the user being removed
	if (req.user._id.toString() === requestReport.SanitizedData.user.toString()) {
		return next(new RequestError(`Failed to remove friend: you are not friends with yourself`, RequestError.Codes.badRequest, true));
	}
	
	Promise.all([
		ProfileModel.findByUserId(req.user._id),
		ProfileModel.findByUserId(requestReport.SanitizedData.user)
	])
		.then((results) => {
			const [
				removerProfile,
				targetProfile,
			] = results;
			
			//Ensure profiles exist
			if (removerProfile == null) {
				return Promise.reject(new RequestError(`Profile does not exist for user ${req.user._id}`));
			} else if (targetProfile == null) {
				return Promise.reject(new RequestError(`The specified user could not be found.`, RequestError.Codes.notFound, true));
			}

			//TODO Check that the two users are already friends

			//Remove target's user id from all remover's lists
			_.pull(removerProfile.friends.accepted, targetProfile.userId);
			_.pull(removerProfile.friends.incoming, targetProfile.userId);
			_.pull(removerProfile.friends.outgoing, targetProfile.userId);

			//Remove remover's user id from all target's lists
			_.pull(targetProfile.friends.accepted, removerProfile.userId);
			_.pull(targetProfile.friends.incoming, removerProfile.userId);
			_.pull(targetProfile.friends.outgoing, removerProfile.userId);

			//Save the changes
			return Promise.all([
				removerProfile.save(),
				targetProfile.save(),
			]);
		})
		.then((results) => {
			const [
				savedRequesterProfile,
				savedTargetProfile,
			] = results;

			req.returnJson = {
				success: true,
				msg: `Removed ${savedTargetProfile.firstName} ${savedTargetProfile.lastName} from your friends`,
				data: {},
			};

			next();
		})
		.catch((err) => {
			next(err);
		});
};

export { RemoveFriend };
export default RemoveFriend;
