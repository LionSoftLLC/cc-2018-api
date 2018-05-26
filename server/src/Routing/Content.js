//Dependencies
import express from 'express';

//Local dependencies
import {
	CreateMedia,
	CreateVideoStream,
	CreateImageThumbnail,
	HandleMediaUpload,
	CreatePost,
	CreateReaction,
	GetPosts
} from './../Middleware/Content';
import { RequireLogin, GetUserProfile } from '../Middleware/Authentication';

//Instantiated
const Routes = express.Router();

//Require login for all sub-routes
Routes.use(RequireLogin);

//Process media for all post requests to content/post
Routes.post(`/post`,
	HandleMediaUpload,
	CreateMedia,
	CreateVideoStream,
	CreateImageThumbnail,
);

Routes.post(`/post/:postId`,
	CreateReaction,
	(req, res, next) => {
		res.json(req.returnJson);
	});

Routes.post(`/post`,
	CreatePost,
	(req, res, next) => {
		res.json(req.returnJson);
	});

Routes.get(`/post`,
	GetUserProfile,
	GetPosts,
	(req, res, next) => {
		res.json(req.returnJson);
	});

export { Routes };
export default Routes;
