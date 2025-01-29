const mongoose = require('mongoose');

const connectDatabase = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected to MongoDB Name: ${connect.connection.name} Host: ${connect.connection.port}`);
    }
    catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDatabase;