//Dependencies
import _ from 'lodash';
import Logger from 'winston';

//Local dependencies
import { ProfileModel } from './../../Models/Profile';
import { RequestError } from '../../Errors/RequestError';
import { GeneralFriendRequest } from './../../RequestSchemas/User/GeneralFriendRequest';

const AcceptFriend = function (req, res, next) {
	//Sanitize and validate the request
	const requestReport = new GeneralFriendRequest(req.body);
	if (requestReport.Valid === false) {
		return next(new RequestError(`Invalid information provided:\n${requestReport.ErrorReport}`, RequestError.Codes.badRequest, true));
	}

	//Ensure the accepting user is not the requesting user
	if (req.user._id.toString() === requestReport.SanitizedData.user.toString()) {
		return next(new RequestError(`Failed to accept friend request: you cannot be friends with yourself`, RequestError.Codes.badRequest, true));
	}

	//Get the profiles for both the user accepting the request and the user who made the request
	Promise.all([
		ProfileModel.findByUserId(req.user._id),
		ProfileModel.findByUserId(requestReport.SanitizedData.user)
	])
		.then((results) => {
			const [
				acceptorProfile,
				requesterProfile,
			] = results;

			//Ensure profiles exist
			if (acceptorProfile == null) {
				return Promise.reject(new RequestError(`Profile does not exist for user ${req.user._id}`));
			} else if (requesterProfile == null) {
				return Promise.reject(new RequestError(`The specified user could not be found.`, RequestError.Codes.notFound, true));
			}

			//Ensure the friend request exists for both the acceptor and requester
			if (!_.includes(acceptorProfile.friends.incoming(requestReport.SanitizedData.user))
				|| !_.includes(requesterProfile.friends.outgoing(req.user._id))) {
				return Promise.reject(new RequestError(`The specified user has no open friend request with you`));
			}

			//Remove the incoming request from the accepting user and the outgoing request from the requesting user
			acceptorProfile.friends.incoming = acceptorProfile.friends.incoming.filter((userId) => { return userId.toString() !== requesterProfile.userId.toString(); });
			requesterProfile.friends.outgoing = requesterProfile.friends.outgoing.filter((userId) => { return userId.toString() !== acceptorProfile.userId.toString(); });

			//Add the users to each other's accepted friends list
			acceptorProfile.friends.accepted.push(requesterProfile.userId);
			requesterProfile.friends.accepted.push(acceptorProfile.userId);

			//Save the updated profiles
			return Promise.all([
				acceptorProfile.save(),
				requesterProfile.save(),
			]);
		})
		.then((results) => {
			const [
				savedRequesterProfile,
				savedTargetProfile,
			] = results;

			req.returnJson = {
				success: true,
				msg: `Added ${savedTargetProfile.firstName} ${savedTargetProfile.lastName} to your friends`,
				data: {},
			};

			next();
		})
		.catch((err) => {
			next(err);
		});
};

export { AcceptFriend };
export default AcceptFriend;
