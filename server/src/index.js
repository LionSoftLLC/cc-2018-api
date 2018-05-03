//Dependencies
import Logger from 'winston';
import dotenv from 'dotenv';
import moment from 'moment';
import mongoose from 'mongoose';

//Local Dependencies
import App from './app';

//Instantiated
const logFileTimeFormat = `YYYYMMDD-hh:mm:ss.SSa`;
const logFileTimestamp = moment().format(logFileTimeFormat);

//Initialization
dotenv.config();

const app = new App();

if (process.env.LOG_TO_FILE === `true`) {
	Logger.add(Logger.transports.File, { filename: `api-server.${logFileTimestamp}.log` });
}

const mongoConnectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_USER_PASS}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_AUTH_DB || `admin`}`;
mongoose.connect(mongoConnectionString);
const db = mongoose.connection;

/* check to see if we`re connected */
db.once(`open`, () => {
	Logger.info(`Connected to mongo database`);
	app.start();
});

/* catch any error */
db.on(`error`, (err) => {
	Logger.error(err);
});
