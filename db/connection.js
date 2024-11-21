import mongoose from 'mongoose'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || {conn: null, promise:null}

export const connectToDatabase = async ()=>{
    if(cached.conn) return cached.conn//verifica la conexion si existe y sino la crea

    if(!MONGODB_URI) throw new Error('MONGODB_URI is missing')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'MongoDB1',//sino existe la base de datos la vuelve a crear con ese nombre
        bufferCommands: false
    })

    cached.conn = await cached.promise;

    return cached.conn
}



