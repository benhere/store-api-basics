require('dotenv').config()

const connectDB = require('./db/connectDB');
const Product = require('./models/productsModel');

const jsonProducts = require('./products.json');

const start = async () => {
    try {
        await connectDB(process.env.mongoURL);
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log('Data populated sucessfully!!');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();