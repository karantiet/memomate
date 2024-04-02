const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect("mongodb+srv://chhabrakaran299:UkqQsUubwIl0gpdp@cluster0.lcft9dg.mongodb.net/notes",{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Database connected ${conn.connect.host}`);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = connectDB;
