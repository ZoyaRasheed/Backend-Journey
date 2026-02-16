import { Schema ,model } from "mongoose";

// Mongoose give the schema definition at the application level , otherwise we can dump anything to the mongodb
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type : String,
        required: true,
        unique : true
    },
    password :{
        type : String,
        required: true
    },
    salt :{
        type : String,
        required: true
    },
},{timestamps : true} )
// timestamps gives you automatically the created AT and updated AT in the end.

const User = model('user',userSchema)
export default User;

// I can do all the CRUD operations using this "User"