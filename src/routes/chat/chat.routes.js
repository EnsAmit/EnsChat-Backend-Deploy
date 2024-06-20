import { Router } from 'express';
import * as appChatDetailsController from '../../controllers/chat/chat.controller.js'
import { verifyToken } from '../../middlewares/files/verifyToken.js';
import upload from '../../middlewares/files/upload_file.middleware.js';

const appChatDetailsRouterV1 = Router();

appChatDetailsRouterV1.route('/addChat').post(verifyToken,appChatDetailsController.addChat)
appChatDetailsRouterV1.route('/getChat').post(appChatDetailsController.getChat)
appChatDetailsRouterV1.route('/searchChat').post(verifyToken,appChatDetailsController.searchChat)
appChatDetailsRouterV1.route('/addGroup').post(verifyToken,appChatDetailsController.addGroup)
appChatDetailsRouterV1.route('/getgroup').post(appChatDetailsController.getAllGroup)
appChatDetailsRouterV1.route('/getMembers').post(appChatDetailsController.getGroupMember)
appChatDetailsRouterV1.route('/userWithChatId').post(appChatDetailsController.getUserWithChatId)
appChatDetailsRouterV1.route('/groupUpdate').post(appChatDetailsController.updateGroup)
appChatDetailsRouterV1.route('/getGroupInfo').post(appChatDetailsController.getGroupInfo)
appChatDetailsRouterV1.route('/updateGroupProfile').post(upload(),appChatDetailsController.updateGroupPic)
appChatDetailsRouterV1.route('/resetUnseenMessage').post(appChatDetailsController.resetUnseenMessages)
appChatDetailsRouterV1.route('/searchUser').post(verifyToken,appChatDetailsController.searchUser)



export { appChatDetailsRouterV1 };