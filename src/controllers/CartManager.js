import fs from 'fs';
import ProductsManager from './ProductsManager.js';

const productAll = new ProductsManager
const path = './src/files/carts.json'

class CartManager {
    constructor(path) {
        this.path = path;
    }
    
    readCart = async () =>{
      let respuesta = await fs.promises.readFile(this.path, "utf-8");    
      return JSON.parse(respuesta);
    }
    
    exist = async (id) => {
        let carts = await this.readCart();
        return carts.find(cart => cart.id === id);
    }
    
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {                                     
                const data = await this.readCart(); 
                console.log(data);                            
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    createCarts = async (cart) => {
      try {
        let carts = await this.getCarts();   
        if (carts.length === 0) {
          cart.id = 1;
          carts = [cart]; 
        } else {
          cart.id = carts[carts.length - 1].id + 1;
          carts.push(cart); 
        };
        console.log(cart);
    
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return cart;
      } catch (error) {
        console.log(error);
      }
    }
    getCartsById = async (id) => {
      const carts = await this.readCart();
      const filter = carts.find((cart) => cart.id === id);
      console.log(filter);
      return filter;
    };

    updateCarts = async (id, updatedCarts) => {
          try {
        const carts = await this.getCarts();
        const index = carts.findIndex((cart) => cart.id === id);
          if (index !== -1) {
        carts[index] = { ...carts[index], ...updatedCarts };
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return carts[index];
        } else {
        console.log('Carrito no encontrado.');
        return null;
        }
      } catch (error) {
        console.log(error);
      }
    };
    deleteCarts = async (id) => {
    try {
        const carts = await this.getCarts(); 
        const index = carts.findIndex((p) => p.id === id);
        if (index !== -1) {
            const [deletedCarts] = carts.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return deletedCarts;
        } else {
            console.log('Carrito no encontrado');
            return null;
        }
    } catch (error) {
        console.log(error);
    }
  };

  addProductInCart = async (cartId, productId) =>{
    let cartById = await this.exist(cartId);
    if(!cartById) return "Carrito no encontrado";
    let productById = await productAll.exist(productId);
    if(!productById) return "Producto no encontrado";

    let cartAll = await this.readCart();
    let cartFilter = cartAll.filter((cart) => cart.id != cartId);

    if (cartById.products.some((prod) => prod.id === productId)) {
      let moreProductInCart = cartById.products.find(
        (prod) => prod.id === productId
      );
      moreProductInCart.cantidad++;
      console.log(moreProductInCart.cantidad);
      let cartsConcat = [cartById, ...cartFilter];
      await this.writeCarts(cartsConcat);
      return "Producto sumado al Carrito"
    };
    cartById.prducts.push({ id: productById.id, cantidad: 1})
    let cartsConcat = [cartById, ...cartFilter];
    await this.writeCarts(cartsConcat);
    return "Producto Agregado al Carrito"
  }


};

export default CartManager