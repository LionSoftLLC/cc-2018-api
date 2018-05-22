//Dependencies
import _ from 'lodash';
import mongoose from 'mongoose';
import Logger from 'winston';
import Promise from 'bluebird';

//Local dependencies
import BaseModel from './_base/Model';

//Instantiated
const ObjectId = mongoose.SchemaTypes.ObjectId;

const imageTypes = [
	`jpg`,
	`png`,
];
const videoTypes = [
	`mov`,
	`mp3`,
];
const allowedFileTypes = imageTypes.concat(videoTypes);

const schema = {
	baseName: {
		type: String,
		required: true,
	},
	extention: {
		type: String,
		required: true,
		enum: allowedFileTypes
	}
};

const Media = class Media extends BaseModel {
	constructor(modelName = `Media`, childSchema = {}) {
		super(modelName, Object.assign({}, schema, childSchema));
	}

	////////////////////////
	// INHEREITED METHODS //
	////////////////////////

	_createMongooseFunctionHooks() {
		super._createMongooseFunctionHooks();
		// preserve context
		const _this = this;

		_this._mongooseSchema.methods.getUris = _this._getUris;
		_this._mongooseSchema.methods.getMediaType = _this._getMediaType;
	}

	////////////////////////////
	// MODEL INSTANCE METHODS //
	////////////////////////////

	_getUris() {
		// preserve context
		const _this = this;
		
		const mediaType = _this.getMediaType();
		const basePath = `${process.env.HOST_PROTOCOL}://${process.env.HOST_NAME}:${process.env.HOST_PORT}/static/media/${mediaType}s/${_this.baseName}`;

		return {
			_id: _this._id,
			createdDate: _this.createdDate,
			thumbUri: `${basePath}_thumb.${_this.extention}`,
			fullUri: `${basePath}.${_this.extention}`,
		};
	}

	_getMediaType() {
		// preserve context
		const _this = this;
		
		return Media.getMediaType(_this.extention);
	}

	////////////////////
	// STATIC METHODS //
	////////////////////

	static getMediaType(extention) {
		// preserve context
		const _this = this;
		
		if (imageTypes.includes(extention)) {
			return `image`;
		} else if (videoTypes.includes(extention)) {
			return `video`;
		} else {
			throw new Error(`Unknown file extention ${extention} found in media record!`);
		}
	}
};

const MediaInstance = new Media();
const MediaModel = MediaInstance.Model;

export { MediaModel, Media };
export default MediaModel;
