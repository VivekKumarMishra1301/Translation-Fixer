const mongoose = require('mongoose');
const connectDB = async () => {

    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
           
        });
        console.log(`DB connected ${con.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}
module.exports = connectDB;