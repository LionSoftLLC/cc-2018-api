//Dependencies
import { KeyValueModel } from './../../Models';

//Instantiated
const validateRequest = function(req, next) {
	const body = req.body;

	const errs = [];

	if (body.key == null || typeof body.key !== `string` || body.key.length < 1) {
		errs.push(`Invalid key supplied`);
	}
	if (body.value == null) {
		errs.push(`No value data supplied`);
	}

	if (errs.length > 0) {
		const errMessage = `Encountered the following errors attempting to create a key-value pair:\n${errs.join(`\n`)}`;
		next(new Error(errMessage));
		return false;
	}

	return true;
};

const UpdateKeyValue = function (req, res, next) {
	if (!validateRequest(req, next)) {
		return;
	}

	KeyValueModel.findOne({ key: req.body.key })
		.then((foundKeyValue) => {
			if (foundKeyValue != null) {
				foundKeyValue.value = req.body.value;
				return foundKeyValue.save();
			} else {
				return Promise.reject(new Error(`Failed to update Key-Value record because no record exists for key ${req.body.key}!`));
			}
		})
		.then((savedKeyValue) => {
			req.returnJson = {
				msg: `Updated KeyValue data`,
				success: true,
				data: savedKeyValue,
			};

			res.json(req.returnJson);
		})
		.catch((err) => {
			next(err);
		});
};

export { UpdateKeyValue };
export default UpdateKeyValue;
