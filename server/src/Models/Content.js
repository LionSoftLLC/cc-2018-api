//Dependencies
import _ from 'lodash';
import mongoose from 'mongoose';
import Logger from 'winston';
import Promise from 'bluebird';

//Local dependencies
import BaseModel from './_base/Model';

import ProfileModel from './Profile';
import MediaModel from './Media';

//Instantiated
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = {
	author: {
		type: ObjectId,
		required: true,
	},
	comment: String,
	media: ObjectId,
	likedBy: {
		type: [ObjectId],
		default: [],
	},
	dislikedBy: {
		type: [ObjectId],
		default: [],
	},
};

const Content = class Content extends BaseModel {
	constructor(modelName = `Content`, childSchema = {}) {
		super(modelName, Object.assign({}, schema, childSchema));
	}

	////////////////////////
	// INHEREITED METHODS //
	////////////////////////

	_createMongooseFunctionHooks() {
		super._createMongooseFunctionHooks();
		// preserve context
		const _this = this;

		_this._mongooseSchema.methods.fillAll = _this._fillAll;

		_this._mongooseSchema.methods.getAuthor = _this._getAuthor;
		_this._mongooseSchema.methods.getMedia = _this._getMedia;
		_this._mongooseSchema.methods.getLikeCount = _this._getLikeCount;
	}

	////////////////////////////
	// MODEL INSTANCE METHODS //
	////////////////////////////

	_fillAll() {
		// preserve context
		const _this = this;

		return Promise.all([
			_this.getAuthor(),
			_this.getMedia(),
			_this.getLikeCount(),
		])
			.then((results) => {
				const [
					author,
					media,
					likeCount,
				] = results;

				const contentObj = {
					_id: _this._id,
					createdDate: _this.createdDate,
					author,
					comment: _this.comment,
					media,
					likeCount,
				};

				return Promise.resolve(contentObj);
			})
			.catch((err) => {
				Logger.error(`Encountered an error while filling Content information`);
				return Promise.reject(err);
			});
	}

	_getAuthor() {
		// preserve context
		const _this = this;

		return ProfileModel.findByUserId(_this.author)
			.then((foundProfile) => {
				if (foundProfile == null) {
					return Promise.reject(new Error(`Profile (userId:${_this.author}) is referenced in Content ${_this._id} but does not exist`));
				}

				return foundProfile.fillProfileImage();
			})
			.catch((err) => {
				Logger.error(`Encountered an error while getting content author`);
				return Promise.reject(err);
			});
	}

	_getMedia() {
		// preserve context
		const _this = this;

		if (_this.media == null) {
			return Promise.resolve(null);
		}

		return MediaModel.findById(_this.media)
			.then((foundMedia) => {
				if (foundMedia == null) {
					return Promise.reject(new Error(`Media ${_this.media} is referenced in Content ${_this._id} but does not exist`));
				}

				return foundMedia.getUris();
			})
			.catch((err) => {
				Logger.error(`Encountered an error while getting content media`);
				return Promise.reject(err);
			});
	}

	_getLikeCount() {
		// preserve context
		const _this = this;

		return {
			likes: _this.likedBy.length,
			dislikes: _this.dislikedBy.length,
		};
	}
};

const ContentInstance = new Content();
const ContentModel = ContentInstance.Model;

export { ContentModel, Content };
export default ContentModel;
