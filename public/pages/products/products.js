// funciones de manejo de sesión
import { getSession, removeSession } from "../../utils/sessionStorage.controller.js";


const API_URL = "/item/getAll"; // Ruta al servidor Express

// Función para obtener todos los productos desde la API
const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener los productos: ${response.statusText}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error(error);
        alert("Hubo un problema al cargar los productos. Por favor, intenta nuevamente más tarde.");
        return [];
    }
};


const renderProducts = (products) => {
    const container = document.getElementById('productsContainer');
    container.innerHTML = ''; // Limpiar contenido previo

    if (products.length === 0) {
        container.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    products.forEach(product => {
        // para crear una tarjeta para cada producto
        const productCard = document.createElement('div');
        productCard.className = "bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col";

        productCard.innerHTML = `
            <img src="/assets/${product.imagen}" alt="${product.nombre}" class="w-full h-48 object-cover rounded-t-lg">
            <h2 class="text-2xl mt-3">${product.nombre}</h2>
            <p class="mt-2 flex-grow">${product.desc}</p>
            <p class="mt-2 font-bold">$${product.precio.toFixed(2)}</p>
            <button data-id="${product.id}" class="mt-4 bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded">Añadir al Carrito</button>
        `;

        container.appendChild(productCard);
    });
};

// para añadir al carrito
const addToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    //para  Verificar si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1; // Incremento cantidad
    } else {
        cart.push({ id: productId, quantity: 1 }); // añado producto nuevo
    }

    // guardo carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto añadido al carrito');
};

// Función para manejar los clics en los botones de añadir al carrito
const handleAddToCart = () => {
    const container = document.getElementById('productsContainer');
    container.addEventListener('click', (event) => {
        // Verificar si el clic fue en un botón
        if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
            const button = event.target.tagName === 'BUTTON' ? event.target : event.target.closest('button');
            const productId = parseInt(button.getAttribute('data-id'));
            if (!isNaN(productId)) {
                addToCart(productId);
            }
        }
    });
};

// filtros de productos
const filterProducts = (allProducts) => {
    const filterValue = document.getElementById('categoryFilter').value;
    let filteredProducts = allProducts;

    if (filterValue !== "") {
        filteredProducts = allProducts.filter(product => product.categoria === filterValue);
    }

    renderProducts(filteredProducts);
};

// cambios de filtros 
const handleFilterChange = (allProducts) => {
    const filterSelect = document.getElementById('categoryFilter');
    filterSelect.addEventListener('change', () => filterProducts(allProducts));
};

// cierre de sesión
const logout = () => {
    removeSession(); // Eliminar la sesión del usuario
    window.location.href = "/index.html"; // Redirige a la página de login
};

// manejo de el botón de cerrar sesión
const handleLogout = () => {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
};

// inicializo la página de productos
const initializePage = async () => {
    const user = getSession();
    if (!user) {
        // Si no hay sesión activa, redirigir al login
        window.location.href = "/index.html";
        return;
    }

    // Obtengo todos los productos desde la API
    const products = await fetchProducts();

    // Renderizar los productos en la página
    renderProducts(products);

    // para manejar el carrito,filtros y logout
    handleAddToCart();
    handleFilterChange(products);
    handleLogout();
};


document.addEventListener('DOMContentLoaded', initializePage);

