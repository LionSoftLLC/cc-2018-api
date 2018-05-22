//Dependencies
import express from 'express';
import bodyParser from 'body-parser';

//Local Dependencies
import RequestError from './../Errors/RequestError';
import ErrorHandler from './../Middleware/ErrorHandler';
import KeyValue from './KeyValue';
import Authentication from './Authentication';
import Content from './Content';
import User from './User';
import { ReadToken, GetUserFromToken } from '../Middleware/Authentication';

const Routes = express.Router();

Routes.use(bodyParser.urlencoded({ extended: true }));
Routes.use(bodyParser.json());

Routes.use(`/keyvalue`, KeyValue);
//Create req.returnJson property
Routes.use((req, res, next) => {
	req.returnJson = {
		success: true,
		msg: `Default response`,
		data: {}
	};
	next();
});

Routes.use(`/auth`, Authentication);

//Apply token middleware; all routes below may need authentication
Routes.use(ReadToken, GetUserFromToken);

Routes.use(`/user`, User);
Routes.use(`/content`, Content);

Routes.use(ErrorHandler);

export { Routes };
export default Routes;
