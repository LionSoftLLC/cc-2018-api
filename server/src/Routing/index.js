//Dependencies
import express from 'express';
import bodyParser from 'body-parser';

//Local Dependencies
import ErrorHandler from './../Middleware/ErrorHandler';
import KeyValue from './KeyValue';

const Routes = express.Router();

Routes.use(bodyParser.urlencoded({ extended: true }));
Routes.use(bodyParser.json());

Routes.use(`/keyvalue`, KeyValue);

Routes.use(ErrorHandler);

export { Routes };
export default Routes;
