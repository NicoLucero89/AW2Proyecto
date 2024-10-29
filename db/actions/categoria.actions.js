import { connectToDatabase } from "../connection.js";
import Product from "../schemas/productos.schema.js"
import Categoria from "../schemas/categorias.schema.js";

export const createCategory = async (nombre) => {
    try {
        await connectToDatabase();
        const res = await Categoria.create({ nombre });
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};

export const findAllCategories = async () => {
    try {
        await connectToDatabase();
        const res = await Categoria.find();
        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
