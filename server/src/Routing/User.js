//Dependencies
import express from 'express';

//Local dependencies
import { RequireLogin } from './../Middleware/Authentication';
import {
	AddFriend,
	RemoveFriend,
	AcceptFriend,
	UpdateProfile,
	UploadProfileImage,
} from './../Middleware/User';

//Instantiated
const Routes = express.Router();

//Require login for all sub-routes
Routes.use(RequireLogin);

//friend/accept
Routes.post(`/friend/accept`, AcceptFriend, (req, res, next) => {
	res.json(req.returnJson);
});

//friend
Routes.post(`/friend`, AddFriend, (req, res, next) => {
	res.json(req.returnJson);
});

Routes.delete(`/friend`, RemoveFriend, (req, res, next) => {
	res.json(req.returnJson);
});

//profile/image
Routes.post(`/profile/image`, UploadProfileImage, (req, res, next) => {
	res.json(req.returnJson);
});

//profile
Routes.put(`/profile`, UpdateProfile, (req, res, next) => {
	res.json(req.returnJson);
});

export { Routes };
export default Routes;
