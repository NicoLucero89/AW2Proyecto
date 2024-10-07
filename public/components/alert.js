export const handleAlert = (text)=>{
    const alert = document.getElementById('alert') /*Para poder mostrar la alerta */
    const txtAlert = document.getElementById('txtAlert') /*Cambiar el texto de la alerta */

    alert.classList.remove('hidden') /*Se muestra la alerta quitando el hidden */
    txtAlert.textContent = text
}

export const handleCloseAlert = ()=>{
    const alert = document.getElementById('alert')
    alert.classList.add('hidden')
}

export const alert = (color)=>{
    return `
    <div class="${color} mt-5 rounded-2xl p-4 hidden" id="alert">
        <div class="flex justify-between items-center">
            <p class="text-sm font-semibold" id="txtAlert"></p>
            <button class="bg-rose-700 p-2 w-1/12 rounded-full hover:bg-rose-600" id="btnCloseAlert">
                X
            </button>
        </div>
    </div>
    `
}