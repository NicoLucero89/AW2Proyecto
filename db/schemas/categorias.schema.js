import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const CategorySchema = new Schema({
    nombre: {type:String, required: true, unique: true, uppercase: true}
})

const Categoria = models.category || model('categoria',CategorySchema)

export default Categoria

