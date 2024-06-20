import { Router } from 'express';
import { appUserDetailsRouterV1 } from '../../../routes/auth/auth.routes.js';
import { appChatDetailsRouterV1 } from '../../../routes/chat/chat.routes.js';
import { appMessageDetailsRouterV1 } from '../../../routes/message/message.routes.js';

const v1 = Router();

// Admin Endpoint Api's
v1.use('/auth', appUserDetailsRouterV1);
v1.use('/chat',appChatDetailsRouterV1);
v1.use('/message',appMessageDetailsRouterV1)

export { v1 };
