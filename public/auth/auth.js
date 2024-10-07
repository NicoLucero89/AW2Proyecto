import { addSession } from "../utils/sessionStorage.controller.js";
import { alert, handleAlert, handleCloseAlert } from "../components/alert.js";

const btnLogin = document.getElementById('btnLogin');
const alertContainer = document.getElementById('alert_container');

alertContainer.innerHTML = alert('bg-rose-500');

const btnCloseAlert = document.getElementById('btnCloseAlert');

/*
input = lo que ingresa el usuario por medio de los txt
output = la info de los json en base al usuario ingresado
*/
const auth = async({email, contraseña}) => {
    const user = await fetch('/user/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            "email": email,          // Cambiado de "userName" a "email"
            "contraseña": contraseña // Cambiado de "pass" a "contraseña"
        })
    }).then((res) => {
        if(!res.ok){
            throw new Error("Error en la petición");
        }
        return res.json();
    }).catch(error => {
        console.error("Error:", error);
        throw new Error("Error en la petición");
    });

    return user;
};

btnCloseAlert.addEventListener('click', () => {
    handleCloseAlert();
});

btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('txtEmail').value// iba ;
    const contraseña = document.getElementById('txtPass').value;

    if(email !== '' && contraseña !== ''){
        /* Se hace la búsqueda */
        try{
            const user = await auth({email, contraseña});
            addSession(user);
            window.location.href="/pages/products/index.html";// contenia esto antes ../pages/home/
        } catch(error){
            handleAlert('Hubo un problema para iniciar sesión: ' + error.message);
        }
    } else {
        handleAlert('Hay campos incompletos');
    }
});

