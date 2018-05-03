//Dependencies
import express from 'express';

//Local Dependencies
import { GetKeyValue, CreateKeyValue, UpdateKeyValue } from './../../Middleware/KeyValue';

const Routes = express.Router();

Routes.get(`/`, GetKeyValue);
Routes.get(`/:key`, GetKeyValue);
Routes.post(`/`, CreateKeyValue);
Routes.put(`/`, UpdateKeyValue);

export { Routes };
export default Routes;
