// Importar funciones de manejo de sesión
import { getSession, removeSession } from "../../utils/sessionStorage.controller.js";

// Definir la URL de la API (ajustar si es necesario)
const API_URL_BASE = "/item"; // Ruta relativa al servidor Express

// Función de busqueda del producto por id
const getProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL_BASE}/byId/${id}`);
        if (!response.ok) throw new Error(`Producto con ID ${id} no encontrado.`);
        return await response.json();
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
        return null;
    }
};

// Función para visualizar el carrito
const renderCart = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cartContainer');
    container.innerHTML = ''; // Limpiar contenido previo

    if (cart.length === 0) {
        container.innerHTML = '<p>Tu carrito está vacío.</p>';
        document.getElementById('totalPrice').textContent = '0.00';
        return;
    }

    let total = 0;

    for (const item of cart) {
        const product = await getProductById(item.id);
        if (product) {
            const itemTotal = product.precio * item.quantity;
            total += itemTotal;

            // tarjetas para cada producto en el carrito
            const cartItem = document.createElement('div');
            cartItem.className = "bg-gray-800 p-5 rounded-lg shadow-lg flex justify-between items-center";

            cartItem.innerHTML = `
                <div>
                    <h2 class="text-2xl">${product.nombre}</h2>
                    <p>${product.desc}</p>
                    <p class="font-bold">$${product.precio.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                </div>
                <button data-id="${product.id}" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Eliminar</button>
            `;

            container.appendChild(cartItem);
        }
    }

    document.getElementById('totalPrice').textContent = total.toFixed(2);
};

// esto es para eliminar un producto del carrito
const removeFromCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

// para manejar los clics en los botones de eliminar
const handleRemoveFromCart = () => {
    const container = document.getElementById('cartContainer');
    container.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
            const button = event.target.tagName === 'BUTTON' ? event.target : event.target.closest('button');
            const productId = parseInt(button.getAttribute('data-id'));
            if (!isNaN(productId)) {
                removeFromCart(productId);
            }
        }
    });
};

// funcion para realizar las comprass
const checkout = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = getSession();

    if (!user) {
        alert('Debes iniciar sesión para realizar una compra.');
        window.location.href = "/index.html";
        return;
    }

    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    // creo orden de compra
    const order = {
        id_usuario: user.id, 
        productos: cart.map(item => ({
            id_producto: item.id,
            cantidad: item.quantity
        })),
        total: cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0),
        fecha: new Date().toISOString()
    };

    try {
        const response = await fetch(`/sale/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al realizar la compra.');
        }

        // para remover items deel carrito
        localStorage.removeItem('cart');
        alert('Compra realizada con éxito');
        window.location.href = "/pages/products/index.html";
    } catch (error) {
        console.error(error);
        alert(`Hubo un problema al realizar la compra: ${error.message}`);
    }
};

// el botón de compra se maneja de aca
const handleCheckout = () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', checkout);
};

// cerrar sesión
const logout = () => {
    removeSession(); // Eliminar la sesión del usuario
    window.location.href = "/index.html"; // redirigir a la página de login
};

// Función para manejar el botón de cerrar sesión
const handleLogout = () => {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
};

// Función principal para inicializar la página del carrito
const initializeCart = async () => {
    const user = getSession();
    if (!user) {
        // Si no hay sesión activa, redirigir al login
        window.location.href = "/index.html";
        return;
    }

    
    await renderCart();
 
    handleRemoveFromCart();
    handleCheckout();
    handleLogout();
};

document.addEventListener('DOMContentLoaded', initializeCart);
