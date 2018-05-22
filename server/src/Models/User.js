//Dependencies
import _ from 'lodash';
import mongoose from 'mongoose';
import Logger from 'winston';
import Promise from 'bluebird';

//Local dependencies
import BaseModel from './_base/Model';
import { ProfileModel } from './Profile';

//Instantiated
const ObjectId = mongoose.SchemaTypes.ObjectId;

const returnProperties = [
	`_id`,
	`email`,
	`phone`,
];

const schema = {
	email: {
		type: String,
		required: true,
		index: {
			unique: true,
		}
	},
	phone: String,
	credentials: {
		type: {
			salt: {
				type: String,
				required: true,
			},
			hash: {
				type: String,
				required: true,
			}
		},
		required: true
	},
	active: {
		type: Boolean,
		default: true,
	},
};

const User = class User extends BaseModel {
	constructor(modelName = `User`, childSchema = {}) {
		super(modelName, Object.assign({}, schema, childSchema));
	}

	////////////////////////
	// INHEREITED METHODS //
	////////////////////////

	_createMongooseFunctionHooks() {
		super._createMongooseFunctionHooks();
		// preserve context
		const _this = this;

		_this._mongooseSchema.statics.findByEmail = _this._findByEmail;

		_this._mongooseSchema.methods.getProfile = _this._getProfile;
		_this._mongooseSchema.methods.toReturnable = _this._toReturnable;
	}

	//////////////////////////
	// MODEL STATIC METHODS //
	//////////////////////////

	_findByEmail(email) {
		// preserve context
		const _this = this;
		
		return _this.findOne({ email });
	}

	////////////////////////////
	// MODEL INSTANCE METHODS //
	////////////////////////////

	_getProfile() {
		// preserve context
		const _this = this;

		return ProfileModel.findOne({ userId: _this._id });
	}

	_toReturnable() {
		// preserve context
		const _this = this;
		
		return _.pick(_this.toObject(), returnProperties);
	}
};

const UserInstance = new User();
const UserModel = UserInstance.Model;

export { UserModel, User };
export default UserModel;
