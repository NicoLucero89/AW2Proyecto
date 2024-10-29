import mongoose from 'mongoose';

const { Schema, models, model, ObjectId } = mongoose;

const SalesSchema = new Schema({
    productos: [{type:ObjectId, required: true, ref:"producto"}],
    total : {type: Number, required: true},
    usuario: {type:String, required: true},
},{ timestamps: true })// timestamps fecha de creacion y de actualizacion


const Sales = models.sales || model('sales',SalesSchema)

export default Sales