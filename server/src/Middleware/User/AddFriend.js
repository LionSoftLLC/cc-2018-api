//Dependencies
import _ from 'lodash';
import Logger from 'winston';

//Local dependencies
import { ProfileModel } from './../../Models/Profile';
import { RequestError } from '../../Errors/RequestError';
import { GeneralFriendRequest } from './../../RequestSchemas/User/GeneralFriendRequest';

const AddFriend = function (req, res, next) {
	//Sanitize and validate the request
	const requestReport = new GeneralFriendRequest(req.body);
	if (requestReport.Valid === false) {
		return next(new RequestError(`Invalid information provided:\n${requestReport.ErrorReport}`, RequestError.Codes.badRequest, true));
	}

	//Ensure the request is not made to the user making the request
	if (req.user._id.toString() === requestReport.SanitizedData.user.toString()) {
		return next(new RequestError(`Failed to make friend request: you cannot make a friend request to yourself`, RequestError.Codes.badRequest, true));
	}

	//Get the profiles for both the user making the request and the "target" user
	Promise.all([
		ProfileModel.findByUserId(req.user._id),
		ProfileModel.findByUserId(requestReport.SanitizedData.user)
	])
		.then((results) => {
			const [
				requesterProfile,
				targetProfile,
			] = results;

			//Ensure profiles exist
			if (requesterProfile == null) {
				return Promise.reject(new RequestError(`Profile does not exist for user ${req.user._id}`));
			} else if (targetProfile == null) {
				return Promise.reject(new RequestError(`The specified user could not be found.`, RequestError.Codes.notFound, true));
			}

			//Ensure this will not create a duplicate request
			const checkFriendsResult = _checkFriends(requesterProfile, targetProfile);
			if (checkFriendsResult !== true) {
				//The check friends function did not return true, throw the result as an error
				return Promise.reject(checkFriendsResult);
			}

			//Add an outgoing request record to the profile for the user making the request
			requesterProfile.friends.outgoing.push(targetProfile.userId);
			//Add an incoming request record to the profile for the target user receiving the request
			targetProfile.friends.incoming.push(requesterProfile.userId);

			//Save the updated profiles
			return Promise.all([
				requesterProfile.save(),
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
				msg: `Sent friend request to ${savedTargetProfile.firstName} ${savedTargetProfile.lastName}`,
				data: {},
			};

			next();
		})
		.catch((err) => {
			next(err);
		});
};

const _checkFriends = function _checkFriends(requesterProfile, targetProfile) {
	//Ensure the users aren't aleady friends or awaiting a response between each other
	//Let's merge friend arrays for each user into a single array and ensure the values are strings
	const requesterFriendData = _.flatten(_.values(requesterProfile.friends)).map((userId) => { return userId.toString(); });
	const targetFriendData = _.flatten(_.values(targetProfile.friends)).map((userId) => { return userId.toString(); });

	//Create a counter to detect desynchronization
	let alreadyExistsCount = 0;
	if (_.includes(requesterFriendData, targetProfile.userId.toString())) {
		//The requesting user is either already friends with the target user, or has an outgoing/incoming friend request with the target user
		alreadyExistsCount += 1;
	}
	if (_.includes(targetFriendData, requesterProfile.userId.toString())) {
		//The target user is either already friends with the requesting user, or has an outgoing/incoming friend request with the requesting user
		alreadyExistsCount += 1;
	}

	if (alreadyExistsCount === 2) { //eslint-disable-line no-magic-numbers
		//An expected error: both users have a reference to each other
		return new RequestError(`You are already friends with this user or have an open friend request`, RequestError.Codes.conflict, true);
	} else if (alreadyExistsCount === 1) {
		//The database is desynchronized: only one of the users has a reference to the other
		//TODO Remove the reference, and maybe write a better error message
		return new Error(`Database error: user ${requesterProfile.userId} tried to add friend ${targetProfile.userId} but a friend reference existed on only one of them`);
	} else {
		//No errors encountered; evaluate to true
		return true;
	}
};

export { AddFriend };
export default AddFriend;
