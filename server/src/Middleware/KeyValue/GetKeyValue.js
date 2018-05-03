//Dependencies
import { KeyValueModel } from './../../Models';
import Logger from 'winston';

//Instantiated
const GetKeyValue = function (req, res, next) {
	let getterPromise;
	if (req.params.key != null) {
		getterPromise = KeyValueModel.find({ key: req.params.key }).exec();
	} else {
		getterPromise = KeyValueModel.find({}).exec();
	}

	getterPromise
		.then((foundKeyValues) => {
			req.returnJson = {
				msg: `Found KeyValue data`,
				success: true,
				data: foundKeyValues,
			};

			res.json(req.returnJson);
		})
		.catch((err) => {
			Logger.error(err);
			next(err);
		});
};

export { GetKeyValue };
export default GetKeyValue;
