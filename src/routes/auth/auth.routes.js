import { Router } from 'express';
import * as appUserDetailsController from '../../controllers/auth/auth.controller.js';
import upload from '../../middlewares/files/upload_file.middleware.js'
import {verifyToken} from '../../middlewares/files/verifyToken.js'

const appUserDetailsRouterV1 = Router();

appUserDetailsRouterV1.route('/register').post(appUserDetailsController.registerUser);
appUserDetailsRouterV1.route('/login').post(appUserDetailsController.loginUser);
appUserDetailsRouterV1.route('/update').post(verifyToken,appUserDetailsController.updateUser);
appUserDetailsRouterV1.route('/updatePic').post(upload(), appUserDetailsController.updatePic);
appUserDetailsRouterV1.route('/profileData').post(appUserDetailsController.getProfileData);

export { appUserDetailsRouterV1 };
