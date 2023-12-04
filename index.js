require('dotenv').config();
require('express-async-errors')

const express = require('express')
const server = express();
const dbConnect = require('./db/connectDB');
const productsRouter = require('./routes/productsRoute');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware setup
server.use(express.json())

// routes
server.get('/', (req,res) => {
    res.send(`<h1>Store API Home page</h1><a href="/api/v1/products">products route</a>`)
})

// using product router
server.use('/api/v1/products',productsRouter)

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

const portNo = process.env.PORT || 6161;
const mongoURI = process.env.mongoURL

const start = async () => {
    try {
        // connect to DB
        await dbConnect(mongoURI)
        .then(() => console.log('Connected to DB'))
        server.listen(portNo, () => {
            console.log(`Server running on port: ${portNo}...`);
        }) 
    } catch (error) {
        console.log('Error connecting DB!!');
        console.log(error);
    }
}

start();



