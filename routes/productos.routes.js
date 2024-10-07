import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();
const filePath = './data/productos.json';

/* RUTAS DE ITEMS */
const loadItemsData = async () => {
    const fileItems = await readFile(filePath, 'utf-8');
    return JSON.parse(fileItems);
};

// agregado al crear la pagina revisar si funciona
router.get('/getAll', async (req, res) => {
    try {
        const itemsData = await loadItemsData();
        res.status(200).json(itemsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Error al obtener los productos' });
    }
});
router.get('/byId/:id', async (req, res) => {
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
});

// Ruta para obtener todas las categorías
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
