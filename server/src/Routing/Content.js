//Dependencies
import express from 'express';

//Local dependencies
import { CreateMedia, HandleMediaUpload, CreatePost, CreateReaction, GetPosts } from './../Middleware/Content';
import { RequireLogin, GetUserProfile } from '../Middleware/Authentication';

//Instantiated
const Routes = express.Router();

//Require login for all sub-routes
Routes.use(RequireLogin);

Routes.get(`/post`,
	GetUserProfile,
	GetPosts,
	(req, res, next) => {
		res.json(req.returnJson);
	});

Routes.post(`/post/:postId`,
	HandleMediaUpload,
	CreateMedia,
	CreateReaction,
	(req, res, next) => {
		res.json(req.returnJson);
	});

Routes.post(`/post`,
	HandleMediaUpload,
	CreateMedia,
	CreatePost,
	(req, res, next) => {
		res.json(req.returnJson);
	});

export { Routes };
export default Routes;
