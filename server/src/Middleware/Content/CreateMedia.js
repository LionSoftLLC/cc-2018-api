//Dependencies
import Logger from 'winston';
import mime from 'mime';

//Local dependencies
import { MediaModel } from './../../Models/Media';

const CreateMedia = function(req, res, next) {
	if (req.file == null) {
		return next();
	}

	const fileNameSegments = req.file.filename.split(`.`);

	let extention = mime.getExtension(req.file.mimetype);
	if (fileNameSegments.length > 1) {
		extention = fileNameSegments.pop();
	}

	const baseName = fileNameSegments.join(`.`);

	const mediaData = {
		baseName,
		extention
	};

	const mediaRecord = new MediaModel(mediaData);

	mediaRecord.save()
		.then((savedMedia) => {
			req.media = savedMedia;
			req.returnJson.data.media = savedMedia.getUris();
			next();
		})
		.catch((err) => {
			next(err);
		});
};

export { CreateMedia };
export default CreateMedia;
