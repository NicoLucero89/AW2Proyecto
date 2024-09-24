import { readFile } from 'fs/promises';
import { calcular_promedio_ventas } from './utils/funciones.js';

async function readJSONFiles() {
  try {
    
    const [usuariosFile, productosFile, ventasFile] = await Promise.all([
      readFile('./Data/usuarios.json', 'utf-8'),
      readFile('./Data/productos.json', 'utf-8'),
      readFile('./Data/ventas.json', 'utf-8')
    ]);

   
    const usuarios = JSON.parse(usuariosFile);
    const productos = JSON.parse(productosFile);
    const ventas = JSON.parse(ventasFile);

    
    console.log('Usuarios:', usuarios);
    console.log('Productos:', productos);
    console.log('Ventas:', ventas);

    
    const promedioVentas = calcular_promedio_ventas(ventas);
    console.log(`El promedio de ventas es: ${promedioVentas.toFixed(2)}`);
  } catch (error) {
    console.error('Error al leer los archivos JSON:', error);
  }
}


readJSONFiles();








