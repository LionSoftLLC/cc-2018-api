//Dependencies
import mongoose from 'mongoose';

//Instantiated
const baseSchema = {
	createdDate: Date,
	updatedDate: Date,
};

/**
* @classdesc The abstract model class used to extend all mongoose models made for the 2018 Code Camp
* @author tsmith
* @since 2018-05-10
* @public
*/
const Model = class Model {
	constructor(modelName, modelSchema) {
		this._modelName = modelName;
		this._schema = Object.assign({}, baseSchema, modelSchema);

		this._buildMongooseSchema();
		this._buildModel();
	}

	////////////////////////
	// GETTERS AND SETTERS//
	////////////////////////

	get Schema() {
		return this._schema;
	}
	
	get MongooseSchema() {
		return this._mongooseSchema;
	}

	get Model() {
		return this._model;
	}

	////////////////////
	// PRIVATE METHODS//
	////////////////////

	/**
	* @desc Builds the mongoose schema from the passed schema and stores it on this class' _mongooseSchema property
	* @author tsmith
	* @private
	* @returns null
	* @since 2018-05-10
	* @instance
	*/
	_buildMongooseSchema() {
		// preserve context
		const _this = this;

		_this._mongooseSchema = new mongoose.Schema(_this._schema);
		_this._createMongooseFunctionHooks();
	}

	/**
	* @desc Builds the mongoose model from the mongoose schema and stores it on this class' _model property
	* @author tsmith
	* @private
	* @returns null
	* @since 2018-05-10
	* @instance
	*/
	_buildModel() {
		// preserve context
		const _this = this;
		
		_this._model = mongoose.model(_this._modelName, _this._mongooseSchema);
	}

	/**
	* @desc An extendable method that adds static and instance methods to this mongoose schema and its dervied model(s)
	* @author tsmith
	* @protected
	* @returns null
	* @since 2017-11-17
	* @instance
	*/
	_createMongooseFunctionHooks() {
		// preserve context
		const _this = this;

		_this._mongooseSchema.pre(`save`, _this._preSaveHook);
	}

	////////////////////
	// MONGOOSE HOOKS //
	////////////////////

	/**
	* @desc The function to be run before saving the model. Sets the updated date to the current time, as well as the created date if it does not already exist. 
	* @author tsmith
	* @param  next:function   |Passed in by mongoose, called to progress through the model's save process
	* @private
	* @returns undefined
	* @since 03/29/2017
	* @instance
	*/
	_preSaveHook(next) {
		// preserve context
		const _this = this;

		const now = new Date();

		//Set the created date to now if none exists
		if (!_this.createdDate) {
			_this.createdDate = now;
		}
		
		//Set the updated date to now
		_this.updatedDate = now;

		next();
	}
};

export { Model };
export default Model;
