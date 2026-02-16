import mongoose from 'mongoose'

export const connectionMongodb = async (connectionURL)=>{
    const connection = await mongoose.connect(connectionURL)
    return connection;
}