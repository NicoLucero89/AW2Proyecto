import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import { get_user_byId } from "../utils/usuario.js";
import { createSale,findById,findAll } from "../db/actions/venta.actions.js";// agregado al ultimo

import connection from "../connection.js"// Mysql
import { generate_id } from "../utils/ventas.js";//Mysql

const router = Router();
const filePath = './data/ventas.json';

/* RUTAS DE VENTAS */
const loadSalesData = async () => {
    const fileSales = await readFile(filePath, 'utf-8');
    return JSON.parse(fileSales);
};

/*router.get('/all', async (req, res) => {
    const salesData = await loadSalesData();

    if(salesData.length) {
        res.status(200).json(salesData);
    } else {
        res.status(400).json(`No hay ventas`);
    }
});*/

router.get('/all',async(req,res)=>{
    try{
        const result = await findAll()
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})



router.post('/create', async (req, res) => {
    const { productos, total, usuario } = req.body;
  
    try {
        const result = await createSale({ productos, total, usuario });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/*
router.post('/create',async(req,res)=>{
    const {productos, total, usuario} = req.body
    try{
        const result = await createSale({productos, total, usuario})
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})*/

router.get('/byId/:id',async(req,res)=>{// agregado al ultimo 
    const id = req.params.id
    try{
        const result = await findById(id)
        res.status(200).json(result)
    }catch(error){
        res.status(400).json()
    }
})

router.get('/byDate/:from/:to', async (req, res) => {
    const salesData = await loadSalesData();
    const from = req.params.from;
    const to = req.params.to;

    const result = salesData.filter(e => e.fecha >= from && e.fecha <= to);

    if(result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(400).json(`No hay ventas entre ${from} y ${to}`);
    }
});

router.post('/detail', async (req, res) => {
    const salesData = await loadSalesData();
    const from = req.body.from;
    const to = req.body.to;
    let aux_name = '';
    try {
        const arr = salesData.filter(e => e.fecha >= from && e.fecha <= to);

        const result = arr.map(e => {
            aux_name = get_user_byId(e.id_usuario);
            aux_name = aux_name.nombre + ' ' + aux_name.apellido;

            return {
                id: e.id_venta,
                id_item: e.id_producto,
                total: e.total,
                fecha: e.fecha,
                seller: aux_name
            };
        });

        if(result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(`No hay ventas entre ${from} y ${to}`);
        }
    } catch(error) {
        res.status(500).json('Error al buscar...');
    }
});

router.post('/add', async (req, res) => {
    const salesData = await loadSalesData();
    const newSale = req.body;
    salesData.push(newSale);

    await writeFile(filePath, JSON.stringify(salesData, null, 2));
    res.status(201).json('Venta agregada');
});
// agregado al final revisarlo back-end maneje correctamente la creación de una orden de compra.
router.post('/add', async (req, res) => {
    const salesData = await loadSalesData();
    const newSale = req.body;

    //  creado para Validar datos
    if (!newSale.id_usuario || !newSale.productos || !newSale.total || !newSale.fecha) {
        return res.status(400).json('Datos de venta incompletos');
    }

    // Asignar un nuevo ID de venta
    newSale.id_venta = salesData.length > 0 ? salesData[salesData.length - 1].id_venta + 1 : 1;

    salesData.push(newSale);

    try {
        await writeFile(filePath, JSON.stringify(salesData, null, 2));
        res.status(201).json('Venta agregada');
    } catch (error) {
        console.error(error);
        res.status(500).json('Error al agregar la venta');
    }
});

router.delete('/delete/:id', async (req, res) => {
    const salesData = await loadSalesData();
    const id = parseInt(req.params.id);

    const newSalesData = salesData.filter(e => e.id_venta !== id);

    if (salesData.length !== newSalesData.length) {
        await writeFile(filePath, JSON.stringify(newSalesData, null, 2));
        res.status(200).json('Venta eliminada');
    } else {
        res.status(400).json('Venta no encontrada');
    }
});

// utilizado para Mysql

router.post('/add',(req, res)=>{

    const producto = parseInt(req.body.producto)
    const total = parseFloat(req.body.total)
    const vendedor = parseInt(req.body.vendedor)

    const id = generate_id(item, vendedor)

    try {
        const query = `INSERT INTO sales (id, producto, total, vendedor) VALUES (?,?,?,?)`

        connection.query(query, [id,producto,total, vendedor], (error, results) =>{
           if(error){
                console.log('Error al ejecutar la query', error)
                res.send(500).json('Error al ejecutar la consulta')
           }else{
                res.status(200).json(results)
           }
        })
    } catch (error) {
        res.send(500).json('Error al ejecutar la consulta', error)
    }

})

export default router;
