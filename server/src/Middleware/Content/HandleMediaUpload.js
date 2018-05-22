//Dependencies
import multer from 'multer';
import Uuid from 'uuid';
import moment from 'moment';
import mime from 'mime';

//Instantiated
/* eslint-disable no-magic-numbers */
const multerConfig = {
	maxFileSize: 5 * 1024 * 1024, // no larger than 5mb,
	fileField: `file`,
};
/* eslint-enable no-magic-numbers */

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const mediaType = file.mimetype.split(`/`)[0];

			cb(null, `${process.env.PROJECT_ROOT}/server/static/media/${mediaType}s`);
		},
		filename: (req, file, cb) => {
			const fileId = `${Uuid.v4()}-${moment.now()}`;
			let fileExtention = mime.getExtension(file.mimetype);

			const originalNameSegments = file.originalname.split(`.`);
			if (originalNameSegments.length > 1) {
				fileExtention = originalNameSegments[originalNameSegments.length - 1];
			}

			cb(null, `${fileId}.${fileExtention}`);
		},
	}),
	limits: {
		fileSize: multerConfig.maxFileSize,
	},
});

const HandleMediaUpload = upload.single(multerConfig.fileField);

export { HandleMediaUpload };
export default HandleMediaUpload;
