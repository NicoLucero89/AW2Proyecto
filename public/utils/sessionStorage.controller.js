// Función para añadir la sesión del usuario
export const addSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
};

// Función para obtener la sesión del usuario
export const getSession = () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Función para eliminar la sesión del usuario
export const removeSession = () => {
    sessionStorage.removeItem('user');
};
