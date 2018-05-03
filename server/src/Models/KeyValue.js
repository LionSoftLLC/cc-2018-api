//Dependencies
import mongoose from 'mongoose';
import Logger from 'winston';
//Instantiated
const Schema = mongoose.Schema;

const KeyValueSchema = new Schema({
	key: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
	},
	value: {
		type: Object,
		required: true,
	}
});

const KeyValueModel = mongoose.model(`KeyValue`, KeyValueSchema);

export { KeyValueModel, KeyValueSchema };
export default KeyValueModel;
