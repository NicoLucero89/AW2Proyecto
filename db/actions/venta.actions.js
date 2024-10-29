import { connectToDatabase } from "../connection.js"
import Sales from "../schemas/ventas.schema.js"// ver si es Sales o Sale ,ante cualquier error revisar esta linea


export const createSale = async({productos, total, usuario})=>{
    try{
        await connectToDatabase()

        const res = await Sales.create({productos, total, usuario})

        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}
export const findById = async(id)=>{
    try{
        await connectToDatabase()
        const res = await Sales.findById(id).populate({path:"productos"})

        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}

export const findAll = async()=>{
    try{
        await connectToDatabase()
        const res = await Sales.find().populate({path:"productos"})

        return JSON.parse(JSON.stringify(res))
    }catch(error){
        console.log(error)
    }
}