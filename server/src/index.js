//Dependencies
import _ from 'lodash';
import Logger from 'winston';
import dotenv from 'dotenv';
import moment from 'moment';
import mongoose from 'mongoose';
import path from 'path';

//Local Dependencies
import App from './app';

//Instantiated
const logFileTimeFormat = `YYYYMMDD-hh:mm:ss.SSa`;
const logFileTimestamp = moment().format(logFileTimeFormat);

//Initialization
//Read in env variables
dotenv.config();

//Set project root path
process.env.PROJECT_ROOT = path.normalize(`${__dirname}/../../`);

const app = new App();

if (process.env.LOG_TO_FILE === `true`) {
	Logger.add(Logger.transports.File, { filename: `api-server.${logFileTimestamp}.log` });
}

const mongoConnectionString = `mongodb://${process.env.DB_SERVER}:${process.env.DB_PORT}`;
const mongoConnectionOptions = {
	dbName: process.env.DB_NAME,
};

//If we have a db user and password provided, use them to authenticate
if (_.trim(process.env.DB_USER) !== `` && _.trim(process.env.DB_USER_PASS) !== ``) {
	mongoConnectionOptions.user = process.env.DB_USER;
	mongoConnectionOptions.pass = process.env.DB_USER_PASS;
}

mongoose.connect(mongoConnectionString, mongoConnectionOptions);
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
