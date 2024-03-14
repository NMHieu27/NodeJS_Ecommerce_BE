const mongoose = require('mongoose');
async function connect(){
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
        });
        console.log('Connect successful');
    }catch (error){
        console.log('Error connecting:' + error);
    }
}
module.exports = {connect};