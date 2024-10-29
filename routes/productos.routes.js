import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import { createProd, findAll, findById, findByCategory, updateNameById, deleteById } from "../db/actions/producto.actions.js";

const router = Router();
const filePath = './data/productos.json';

const loadItemsData = async () => {
    const fileItems = await readFile(filePath, 'utf-8');
    return JSON.parse(fileItems);
};

router.get('/all',async(req,res)=>{
    try{
        const result = await findAll()
        
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

/*router.get('/byId/:id', async (req, res) => {
    try {
        const itemsData = await loadItemsData();
        const id = parseInt(req.params.id);
        const product = itemsData.find(item => item.id === id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ status: false, message: `Producto con ID ${id} no encontrado` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Error al obtener el producto' });
    }
});*/ // asi estaba antes,del mongodb


router.get('/byId/:id',async(req,res)=>{// agregado al ultimo ,probado ocn postman
    const id = req.params.id
    try{
        const result = await findById(id)
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

router.get('/byCategory/:category',async(req,res)=>{
    const category = req.params.category
    
    try{
        const result = await findByCategory(category)
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

router.get('/categories', async (req, res) => {
    try {
        const itemsData = await loadItemsData();
        const categories = [...new Set(itemsData.map(product => product.categoria))];
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Error al obtener las categorías' });
    }
});

router.post('/add', async (req, res) => {
    const itemsData = await loadItemsData();
    const newItem = req.body;
    itemsData.push(newItem);

    await writeFile(filePath, JSON.stringify(itemsData, null, 2));
    res.status(201).json('Producto agregado');
});

router.post('/create', async (req, res) => {
    const { nombre, descripcion, stock, precio, categoria } = req.body;

    try {
        const result = await createProd({ nombre, descripcion, stock, precio, categoria });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message }); // Incluye el mensaje de error para más información
    }
});

router.patch('/updateByName/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    try {
        const result = await updateNameById(nombre, id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json();
    }
});

router.put('/changePrice', async (req, res) => {
    const itemsData = await loadItemsData();
    const id = req.body.id;
    const newPrice = req.body.new_price;
    const priceType = req.body.type_price;

    const index = itemsData.findIndex(e => e.id === id);
    if (index !== -1) {
        if (priceType == 1) {
            itemsData[index].precio = newPrice;
        } else {
            itemsData[index]["precio venta"] = newPrice;
        }

        await writeFile(filePath, JSON.stringify(itemsData, null, 2));
        res.status(200).json('Producto modificado');
    } else {
        res.status(500).json('Error al actualizar el producto');
    }
});

router.patch('/updateByName/:id',async(req,res)=>{
    const id = req.params.id
    const {nombre} = req.body
  
    try{
        const result = await updateNameById(nombre, id)
       
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

router.delete('/delete/:id', async (req, res) => {
    const itemsData = await loadItemsData();
    const id = parseInt(req.params.id);

    const newItemsData = itemsData.filter(e => e.id !== id);

    if (itemsData.length !== newItemsData.length) {
        await writeFile(filePath, JSON.stringify(newItemsData, null, 2));
        res.status(200).json('Producto eliminado');
    } else {
        res.status(400).json('Producto no encontrado');
    }
});

router.delete('/deleteById/:id',async(req,res)=>{
    const id = req.params.id
  
    try{
        const result = await deleteById(id)
       
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})
export default router;


