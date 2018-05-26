//Dependencies
import Logger from 'winston';
import sharp from 'sharp';

//Local dependencies
import { Media } from './../../Models/Media';

//Instantiated
const MAX_THUMB_DIMENSIONS_PX = 128;

const CreateImageThumbnail = function(req, res, next) {
	if (req.media == null) {
		return next();
	}

	const imageFolder = `${process.env.PROJECT_ROOT}/server/static/media/images`;

	let imageSource;
	let thumbDestination;
	if (req.media.getMediaType() === `image`) {
		imageSource = `${imageFolder}/${req.file.filename}`;
		thumbDestination = `${imageFolder}/${req.media.baseName}_thumb.${req.media.extention}`;
	} else {
		//The base media file is a video; get it's associated image
		imageSource = `${imageFolder}/${req.media.baseName}.jpg`;
		thumbDestination = `${imageFolder}/${req.media.baseName}_thumb.jpg`;
	}
	
	sharp(imageSource)
		.resize(MAX_THUMB_DIMENSIONS_PX, MAX_THUMB_DIMENSIONS_PX, { kernel: sharp.kernel.lanczos3 })
		.max()
		.toFile(thumbDestination)
		.then((outputInfo) => {
			next();
		})
		.catch((err) => {
			Logger.error(`Encountered an error attempting to resize image`);
			next(err);
		});
};

export { CreateImageThumbnail };
export default CreateImageThumbnail;
