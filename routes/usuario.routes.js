import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import bcrypt from 'bcryptjs' // agregado ultimo
import jwt from 'jsonwebtoken'// agregado ultimo
import { decodeToken } from "../utils/middleware.js";

const router = Router();
const filePath = './data/usuarios.json';

const SECRET = "BmGgwl2fIR99Wd0o0Ov76YSyOlCGbjAtF2Mp8DWuKyMp9ajo8UQbL5GX2tya_h9k"//agregado ultimo ,deberia estar en variable de entorno

/* RUTAS DE USUARIOS funcion para cargarlos */
const loadUserData = async () => {
    const fileUsers = await readFile(filePath, 'utf-8');
    return JSON.parse(fileUsers);
};

/* Función para guardar datos de usuarios */
const saveUserData = async (userData) => {
    try {
        await writeFile(filePath, JSON.stringify(userData, null, 2));
    } catch (error) {
        throw new Error('Error guardando los datos de usuarios');
    }
};

router.get('/byId/:id', async (req, res) => {
    const userData = await loadUserData();
    const id = parseInt(req.params.id);
    const result = userData.find(e => e.id === id);

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400).json(`${id} no se encuentra`);
    }
});
 
router.post('/login', async (req, res) => {
    const userData = await loadUserData();
    const { email, contraseña } = req.body;
    const result = userData.find(e => e.email === email);

    if (result && bcrypt.compareSync(contraseña, result.contraseña)) {
        const token = jwt.sign({ email: result.email }, SECRET, { expiresIn: 86400 });
        const data = {
            nombre: result.nombre,
            apellido: result.apellido,
            email: result.email,
            status: true,
            token
        };
        res.status(200).json(data);
    } else {
        res.status(400).json({ status: false });
    }
});
//agregado al ultimo
router.post('/create', async (req, res) => {
    const { nombre, apellido, email, contraseña } = req.body;

    try {
        const userData = await loadUserData();
        const hashedPass = bcrypt.hashSync(contraseña, 8);
        const id = userData.length > 0 ? userData[userData.length - 1].id + 1 : 1;

        userData.push({ nombre, apellido, email, id, contraseña: hashedPass });
        await saveUserData(userData);

        res.status(200).json({ status: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false });
    }
});
//
router.post('/register', async (req, res) => {
    const userData = await loadUserData();
    const newUser = req.body;
    userData.push(newUser);

    await writeFile(filePath, JSON.stringify(userData, null, 2));
    res.status(201).json('Usuario registrado');
});

router.put('/update/:id', async (req, res) => {
    const userData = await loadUserData();
    const id = parseInt(req.params.id);
    const updatedUser = req.body;

    const index = userData.findIndex(e => e.id === id);
    if (index !== -1) {
        userData[index] = { ...userData[index], ...updatedUser };
        await writeFile(filePath, JSON.stringify(userData, null, 2));
        res.status(200).json('Usuario actualizado');
    } else {
        res.status(400).json('Usuario no encontrado');
    }
});

router.delete('/delete/:id', async (req, res) => {
    const userData = await loadUserData();
    const id = parseInt(req.params.id);

    const newUserData = userData.filter(e => e.id !== id);

    if (userData.length !== newUserData.length) {
        await writeFile(filePath, JSON.stringify(newUserData, null, 2));
        res.status(200).json('Usuario eliminado');
    } else {
        res.status(400).json('Usuario no encontrado');
    }
});
//agregado al ultimo
router.post('/decodeToken',async (req,res)=>{
    const token = req.body.token

    const result = await decodeToken(token)
    console.log(result)
    res.status(200).json(result)
})

export default router;
