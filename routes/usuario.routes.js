import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();
const filePath = './data/usuarios.json';

/* RUTAS DE USUARIOS */
const loadUserData = async () => {
    const fileUsers = await readFile(filePath, 'utf-8');
    return JSON.parse(fileUsers);
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
    const result = userData.find(e => e.email === email && e.contraseña === contraseña);

    if (result) {
        res.status(200).json(`Bienvenido ${result.nombre}`);
           

    } 
    else {
        res.status(400).json(`${email} no se encuentra`);
    }
});

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

export default router;
