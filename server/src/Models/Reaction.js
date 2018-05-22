//Dependencies
import _ from 'lodash';
import mongoose from 'mongoose';
import Logger from 'winston';
import Promise from 'bluebird';

//Local dependencies
import { Content } from './Content';

//Instantiated
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = {
};

const Reaction = class Reaction extends Content {
	constructor(modelName = `Reaction`, childSchema = {}) {
		super(modelName, Object.assign({}, schema, childSchema));
	}

	////////////////////////
	// INHEREITED METHODS //
	////////////////////////

	_createMongooseFunctionHooks() {
		super._createMongooseFunctionHooks();
		// preserve context
		const _this = this;
	}

	////////////////////////////
	// MODEL INSTANCE METHODS //
	////////////////////////////
	
};

const ReactionInstance = new Reaction();
const ReactionModel = ReactionInstance.Model;

export { ReactionModel, Reaction };
export default ReactionModel;
