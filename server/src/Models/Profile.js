//Dependencies
import _ from 'lodash';
import mongoose from 'mongoose';
import Logger from 'winston';
import Promise from 'bluebird';

//Local dependencies
import BaseModel from './_base/Model';

import { MediaModel } from './Media';

//Instantiated
const ObjectId = mongoose.SchemaTypes.ObjectId;

const returnProperties = [
	`_id`,
	`userId`,
	`firstName`,
	`middleName`,
	`lastName`,
	`bio`,
];

const schema = {
	userId: {
		type: ObjectId,
		required: true,
		index: {
			unique: true
		},
	},
	firstName: {
		type: String,
		required: true,
	},
	middleName: String,
	lastName: {
		type: String,
		required: true,
	},
	bio: String,
	image: ObjectId,
	gallery: [ObjectId],
	friends: {
		type: {
			accepted: [ObjectId],
			outgoing: [ObjectId],
			incoming: [ObjectId],
		},
		default: {
			accepted: [],
			outgoing: [],
			incoming: [],
		}
	},
};

const Profile = class Profile extends BaseModel {
	constructor(modelName = `Profile`, childSchema = {}) {
		super(modelName, Object.assign({}, schema, childSchema));
	}

	////////////////////////
	// INHEREITED METHODS //
	////////////////////////

	_createMongooseFunctionHooks() {
		super._createMongooseFunctionHooks();
		// preserve context
		const _this = this;

		_this._mongooseSchema.statics.findByUserId = _this._findByUserId;

		_this._mongooseSchema.methods.fillProfileImage = _this._fillProfileImage;

		_this._mongooseSchema.methods.toReturnable = _this._toReturnable;
		_this._mongooseSchema.methods.getProfileImage = _this._getProfileImage;
		_this._mongooseSchema.methods.getGalleryMedia = _this._getGalleryMedia;
	}

	////////////////////////////
	// MODEL INSTANCE METHODS //
	////////////////////////////

	_fillProfileImage() {
		// preserve context
		const _this = this;

		return Promise.all([
			_this.toReturnable(),
			_this.getProfileImage()
		])
			.then((results) => {
				const [
					returnableProfile,
					profileImage,
				] = results;

				returnableProfile.image = profileImage;
				return returnableProfile;
			});
	}

	_toReturnable() {
		// preserve context
		const _this = this;

		return _.pick(_this.toObject(), returnProperties);
	}

	_getProfileImage() {
		// preserve context
		const _this = this;

		if (_this.image == null) {
			return Promise.resolve(null);
		}

		return MediaModel.findById(_this.image)
			.then((foundMedia) => {
				if (foundMedia == null) {
					return Promise.reject(`Image ${_this.image} is referenced in profile ${_this._id} but could not be found`);
				}
				if (foundMedia.getMediaType() !== `image`) {
					return Promise.reject(`Profile ${_this._id} references media ${_this.image} as the profile image, but the media record is not an image`);
				}

				return foundMedia.getUris();
			})
			.catch((err) => {
				Logger.error(`Encountered an error while trying to get profile image for user ${_this.userId}`);
				return Promise.reject(err);
			});
	}

	_getGalleryMedia() {
		// preserve context
		const _this = this;

		return MediaModel.find({
			_id: {
				$in: _this.gallery
			}
		})
			.then((foundMedia) => {
				if (foundMedia.length !== _this.gallery.length) {
					const missingIds = _.difference(_this.gallery, foundMedia.map((reaction) => reaction._id));
					Logger.error(`Found media IDs for gallery in profile ${_this._id} with no corresponding record:\n${missingIds.join(`\n`)}`);
				}

				return foundMedia.map((media) => media.getUris());
			})
			.catch((err) => {
				Logger.error(`Encountered an error while trying to get gallery media for user ${_this.userId}`);
				return Promise.reject(err);
			});
	}

	//////////////////////////
	// MODEL STATIC METHODS //
	//////////////////////////

	_findByUserId(userId) {
		// preserve context
		const _this = this;

		return _this.findOne({ userId });
	}
};

const ProfileInstance = new Profile();
const ProfileModel = ProfileInstance.Model;

export { ProfileModel, Profile };
export default ProfileModel;
