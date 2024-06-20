import express from 'express'
import { v1 } from './src/helpers/common/route_versions/v1.js';
import {dbConnect} from './src/helpers/common/init_mongodb.js'
import { ensModuleBackendApp, httpServer } from './src/helpers/common/init_socket.js'
import cors from 'cors'
import { fileURLToPath } from 'url';
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 4500;

dbConnect()
ensModuleBackendApp.use(express.json())
ensModuleBackendApp.use('/images', express.static(path.join(__dirname, './src/public/profile_images')));
ensModuleBackendApp.use(cors());

//error middleware
ensModuleBackendApp.use((error, req, res, next) => {
    //here we set the default statusCode and message so if we dont send it then default one will send to user
    const errorStatus = error.status || 500;
    const errorMessage = error.message || "something went wrong";
    res.status(errorStatus).json(
        {
            error: true,
            success: false,
            status: errorStatus,
            message: errorMessage,
            stack: error.stack
        }
    )

})
// Define a route handler for the root URL
ensModuleBackendApp.use('/v1', v1);

ensModuleBackendApp.get('/', (req, res) => {
    res.send('hiiii')
})


// Start the server on port 3000
httpServer.listen(PORT, () => {
    console.log(`Server is runnning at Port : ${PORT}`);
});
