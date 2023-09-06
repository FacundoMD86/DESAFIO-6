import ProductsManager from '../productos/ProductsManager.js';
import CartManager from '../productos/CartManager.js';

const deposito = new ProductsManager('./files/Productos.json');
const cartDepo = new CartManager('./files/carts.json');

const socketClient=io()

const formulario =document.getElementById("formulario")
const usuario =document.getElementById("usuario")
const mensaje =document.getElementById("mensaje")
const chat =document.getElementById("chat")


formulario.onsubmit=(e)=>{
    e.preventDefault()
    const user=usuario.value
    const message=mensaje.value
    const obj={
        user,message
    }

    socketClient.emit("chatear",obj)
}

socketClient.on("chatupdate",(obj)=>{
   
    const chatrender=obj.map(e=>
        {return `<p>${e.user} dice : ${e.message}</p>`}).join(" ")
        chat.innerHTML=chatrender

})

const env = async () => {
    try {
        const productos = await deposito.getProduct();
        console.log(productos);
        
        const carts = await cartDepo.getCarts();
        console.log(carts);

        const producto = {
            id: '1',
            title: 'sigas 32',
            description: 'fusion',
            code: '10',
            price: '10000',
            status: true,
            stock: '100',
            category: 'caños',
            thumbnail:[], 
        };

    await deposito.createProduct(producto);
    const depositoResult = await deposito.getProduct();
    console.log(depositoResult);

    await cartDepo.createCarts(producto);
    const cartDepoResult = await cartDepo.getCarts();
    console.log(cartDepoResult);
    }catch (error){
        console.log(error);
    }
};
env();

const socket = io();
socket.on('actualizacion', data => {
    console.log(data);
});
let user;
const chatbox = document.getElementById('chatBox');

Swal.fire({
    title: 'Identifiquesé',
    input: 'text',
    text: 'Ingrese su nombre de usuario para ingresar en la sala de chat',
    inputValidator: (value) =>{
        return !(value) && "Necesitas ingresar un nombre de usuario para acceder al chat"
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then (result =>{
    user= result.value;
    socket.emit ('authenticated', user);
});

chatbox.addEventListener( 'keyup', evt =>{
    if (evt.key === 'Enter'){
        if(chatbox.value.trim().length > 0){
            socket.emit('message', {user, message: chatbox.value});
            chatbox.value = '';
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById ('messageLogs');
    let messages = '';
    data.forEach (message => {
        messages += `${message.user} dice: ${message.message}<br/>`
    });
    log.innerHTML = messages;
});

//cada vez que se conecta un nuevo usuario, que muestre un modal
socket.on('newUserConnected', data => {
    Swal.fire({
        toast:true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: 'success'
    })
})