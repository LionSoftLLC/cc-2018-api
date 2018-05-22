//Dependencies
import express from 'express';

//Local dependencies
import { Register, Login } from './../Middleware/Authentication';

//Instantiated
const Routes = express.Router();

Routes.post(`/register`, Register, (req, res, next) => {
	res.json(req.returnJson);
});

Routes.post(`/login`, Login, (req, res, next) => {
	res.json(req.returnJson);
});

export { Routes };
export default Routes;
