import Message from '../../models/message/message.model.js'
import Chat from '../../models/chat/chat.model.js';
import {createError} from '../../helpers/common/backend.functions.js'

const addMessage = async (req, res, next) => {
    const { sender, content, chat } = req.body;
    // if (!sender || !chat || sender == '' || chat == '') {
    //     return next(createError(400, "plz provide the required feild"))
    // }
    try {
        const newMessage = await Message.create(req.body);
        const result = await newMessage.save()
        if (!result) {
            return next(createError(500, 'Internal server error: Failed to save data'))
        }
        return res.status(201).json({
            message: "message save successfully"
        })
    }
    catch (error) {
        return next(error)
    }
}

// const getMessage = async (req, res, next) => {
//     const { chat } = req.body;
//     const userId = req.user.id;
//     if (!chat || !userId) {
//         return next(createError(403, "plz provide the required feild"))
//     }
//     const formatDate = (dateString,flag) => {
//         const date = new Date(dateString);
//         // console.log(date)
//         if(flag){
//             const hours = String(date.getHours()).padStart(2, '0');
//             const minutes = String(date.getMinutes()).padStart(2, '0');
//             if(hours>12){
//                 return `${hours-12}:${minutes} PM`;

//             }
//             else{
//                 return `${hours}:${minutes} AM`;
//             }
            
//         }
//         else{
//             const day = String(date.getDate()).padStart(2, '0');
//             const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//             const year = date.getFullYear();
//             return `${day}-${month}-${year}`;
//         }
       
//       };
//     try {
//         const messagesResponse = await Message.find(req.body)
//         .populate({
//             path: 'sender',
//             select: 'firstName lastName picture'
//         })
//         .exec();
       
//         const transformedMessages = messagesResponse.map(message => {
//             return {
//               _id: message._id,
//               chat: message.chat,
//               content: message.content,
//               fileName: message.fileName,
//               messageType: message.messageType,
//               createdAt : formatDate(message.createdAt,false),
//               messageDate : formatDate(message.createdAt,true),
//               sender: message.sender._id,
//               memberName: userId === message.sender._id.toString() ? null : `${message.sender.firstName} ${message.sender.lastName}`,
//               picture: userId === message.sender._id.toString() ? null : message.sender.picture
//             };
//           });
//         // console.log("messages====>",transformedMessages)
//         if (!messagesResponse) {
//             return next(createError(500, 'Internal server error: Failed to save data'))
//         }
      
//         return res.status(200).json({ data: transformedMessages })
//     }
//     catch (error) {
//         return next(error)
//     }

// }
const getMessageAndResetUnseen = async (req, res, next) => {
    const { chat } = req.body;
    const userId = req.user.id;

    if (!chat || !userId) {
        return next(createError(403, "Please provide the required fields"));
    }

    const formatDate = (dateString, flag) => {
        const date = new Date(dateString);
        if (flag) {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;
        } else {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    };

    try {
        // Reset unseen messages
        const chatUpdate = await Chat.findOneAndUpdate(
            { _id: chat, 'members.userId': userId },
            { $set: { 'members.$.unseenMessage': 0 } },
            { new: true }
        );

        if (!chatUpdate) {
            return next(createError(404, 'Chat or user not found'));
        }

        // Fetch messages
        const messagesResponse = await Message.find({ chat })
            .populate({
                path: 'sender',
                select: 'firstName lastName picture'
            })
            .exec();

        if (!messagesResponse) {
            return next(createError(500, 'Internal server error: Failed to fetch messages'));
        }

        // Transform messages
        const transformedMessages = messagesResponse.map(message => ({
            _id: message._id,
            chat: message.chat,
            content: message.content,
            fileName: message.fileName,
            messageType: message.messageType,
            createdAt: formatDate(message.createdAt, false),
            messageDate: formatDate(message.createdAt, true),
            sender: message.sender._id,
            memberName: userId === message.sender._id.toString() ? null : `${message.sender.firstName} ${message.sender.lastName}`,
            picture: userId === message.sender._id.toString() ? null : message.sender.picture
        }));

        return res.status(200).json({ data: transformedMessages });
    } catch (error) {
        return next(error);
    }
};
const updateChatInfoMedia = async (req,res,next)=>{
    const {chatId, messageType} = req.body;
    if(!chatId || !messageType){
        return next(createError(403,"Required feild are missing"));
    }
    try{
        const groupExist = await Message.find({chat:chatId, messageType:messageType});
        if(!groupExist){
            return next(createError(404,"group not found"))
        }
       
        const groupMedia = groupExist.map((index)=>{
            return {
                fileName: index.fileName
            }
        })
        // console.log(groupMedia)
        return res.status(200).json({data:groupMedia})
    }
    catch(error){
        console.log(error)
        return next(error);

    }
}

const uploadFile = async (req, res, next) => {
    const file = req.file;
    let messageType = ""

    // Get the mimetype of the uploaded file
    const mimeType = file.mimetype;

    // Check the mimetype to determine the type of file
    if (mimeType.startsWith('image')) {
        // console.log('Uploaded file is an image.');
        messageType = 'image'
        // Handle image file
    } else if (mimeType.startsWith('audio')) {
        // console.log('Uploaded file is an audio file.');
        messageType = 'audio'
        // Handle audio file
    } else if (mimeType.startsWith('video')) {
        // console.log('Uploaded file is a video file.');
        messageType = 'video'
        // Handle video file
    } else if (mimeType === 'application/pdf') {
        console.log('Uploaded file is a PDF file.');
        messageType = 'application/pdf'
        // Handle PDF file
    } else {
        console.log('Uploaded file is of an unsupported type.');
        messageType = 'none'
        // Handle unsupported file type
    }

    // console.log(req.file, "fileName")
    try {
       
        return res.status(200).json({ fileName: req.file.filename, messageType: messageType })
    }
    catch (error) {
        return next(error)
    }

}

export { addMessage, getMessageAndResetUnseen, uploadFile,updateChatInfoMedia }
