// frontend/public/utils/cart.controller.js
import { API } from '../pages/home/api.js';

// Función para obtener el carrito desde localStorage
export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Función para guardar el carrito en localStorage
export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Función para añadir un producto al carrito
export const addToCart = async (productId) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Obtener detalles del producto
        try {
            const res = await fetch(`${API}/productos/byId/${productId}`);
            const producto = await res.json();
            cart.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            alert('Error al añadir el producto al carrito.');
            return;
        }
    }

    saveCart(cart);
    alert('Producto añadido al carrito');
};
