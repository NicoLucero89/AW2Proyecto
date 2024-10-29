import mongoose from 'mongoose';
//import Categoria from './categorias.schema.js'; // Asegúrate de importar el modelo Categoria
const { Schema, models, model, ObjectId } = mongoose;

const ProductSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    categoria: { type: ObjectId, required: true,ref:"categoria" } 
});


const Product = models.Product || model('Product', ProductSchema);

export default Product;
