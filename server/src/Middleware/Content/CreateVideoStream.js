//Dependencies
import Logger from 'winston';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';

//Local dependencies
import { Media } from './../../Models/Media';

//Instantiated
const streamConfigs = require(`./../../../config/stream-outputs.json`);
const STREAM_FPS = 24;
const HLS_SEGMENT_DURATION = 5;

const CreateVideoStream = function (req, res, next) {
	if (req.media == null) {
		return next();
	} else if (req.media.getMediaType() !== `video`) {
		return next();
	}

	const streamDirectory = `${req.file.destination}/${req.media.baseName}`;

	fs.ensureDir(streamDirectory)
		.then(() => {
			const promiseChain = streamConfigs.reduce((lastPromise, outputConfig) => {
				return lastPromise.then(() => {
					return _createStreamOutputProcess(req.file, req.media, outputConfig);
				});
			}, Promise.resolve());

			return promiseChain;
		})
		.then(() => {
			return _generateMasterPlaylist(req.file, req.media);
		})
		.then(() => {
			Logger.info(`Finished creating stream content for upload.`);
			next();
		})
		.catch((err) => {
			next(err);
		});
};

const _createStreamOutputProcess = function _createStreamOutputProcess(fileInfo, mediaInfo, outputConfig) {
	Logger.info(`Beginning encoding for stream config "${outputConfig.name}"`);

	const imageFolder = `${process.env.PROJECT_ROOT}/server/static/media/images`;
	const videoSource = `${fileInfo.destination}/${fileInfo.filename}`;
	const outputDir = `${fileInfo.destination}/${mediaInfo.baseName}`;

	const outputProcess = ffmpeg(videoSource, { timeout: 432000 })
		.size(`${outputConfig.resolution.w}x${outputConfig.resolution.h}`)
		.autoPad()
		.fps(STREAM_FPS)
		.addOptions([
			`-c:a aac`,
			`-ar 48000`,
			`-b:a ${outputConfig.audioBitrate}`,
			`-c:v h264`,
			`-profile:v main`,
			`-crf 20`,
			`-g 48`,
			`-keyint_min 48`,
			`-sc_threshold 0`,
			`-b:v ${outputConfig.videoBitrate}`,
			`-maxrate ${outputConfig.videoMaxrate}`,
			`-bufsize ${outputConfig.videoBufsize}`,
			`-hls_time ${HLS_SEGMENT_DURATION}`,
			`-hls_playlist_type vod`,
			`-hls_segment_filename ${outputDir}/${outputConfig.name}_%03d.ts`
		])
		.output(`${outputDir}/${outputConfig.name}.m3u8`)
		.on(`stderr`, (stdoutLine) => {
			Logger.log(`FFMpeg out: ${stdoutLine}`);
		});

	if (outputConfig.screenshot === true) {
		outputProcess.screenshots({
			timestamps: [`50%`],
			filename: `${mediaInfo.baseName}.jpg`,
			folder: imageFolder,
		});
	}

	return new Promise((resolve, reject) => {
		outputProcess
			.on(`end`, (stdout, stderr) => {
				resolve();
			})
			.on(`error`, (err) => {
				reject(err);
			})
			.run();
	});
};

const _generateMasterPlaylist = function _generateMasterPlaylist(fileInfo, mediaInfo) {
	const masterPlaylistPath = `${fileInfo.destination}/${mediaInfo.baseName}/index.m3u8`;

	return fs.ensureFile(masterPlaylistPath)
		.then(() => {
			const file = fs.createWriteStream(masterPlaylistPath);

			return new Promise((resolve, reject) => {
				file.on(`close`, () => { resolve(); });

				file.write(`#EXTM3U\n`);
				file.write(`#EXT-X-VERSION:3\n`);
				streamConfigs.forEach((outputConfig) => {
					file.write(`#EXT-X-STREAM-INF:BANDWIDTH=${outputConfig.bandwidth},RESOLUTION=${outputConfig.resolution.w}x${outputConfig.resolution.h}\n`);
					file.write(`${outputConfig.name}.m3u8\n`);
				});

				file.end();
			});
		});
};

export { CreateVideoStream };
export default CreateVideoStream;
