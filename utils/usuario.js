// utils/usuario.js
import { readFile } from 'fs/promises';

let userData;

const loadUserData = async () => {
    const fileUsers = await readFile('./data/usuarios.json', 'utf-8');
    userData = JSON.parse(fileUsers);
};

export const get_user_byId = (id) => {
    return userData.find(e => e.id === id);
};

await loadUserData();



