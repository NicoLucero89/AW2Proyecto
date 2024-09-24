import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();
const filePath = './data/productos.json';

/* RUTAS DE ITEMS */
const loadItemsData = async () => {
    const fileItems = await readFile(filePath, 'utf-8');
    return JSON.parse(fileItems);
};

router.get('/byId/:id', async (req, res) => {
    const itemsData = await loadItemsData();
    const id = parseInt(req.params.id);
    const result = itemsData.find(e => e.id === id);

    if(result) {
        res.status(200).json(result);
    } else {
        res.status(400).json(`${id} no se encuentra`);
    }
});

router.get('/byCategory/:category', async (req, res) => {
    const itemsData = await loadItemsData();
    const category = req.params.category;
    const result = itemsData.filter(e => e.categoria === category);

    if(result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(400).json(`${category} no se encuentra, intente con su ID`);
    }
});

router.post('/add', async (req, res) => {
    const itemsData = await loadItemsData();
    const newItem = req.body;
    itemsData.push(newItem);

    await writeFile(filePath, JSON.stringify(itemsData, null, 2));
    res.status(201).json('Producto agregado');
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

export default router;
