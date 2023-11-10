import fs from 'fs';

const path = "./src/files/Productos.json"

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    
    readProduct = async () =>{
      let respuesta = await fs.promises.readFile(this.path, "utf-8");    
      return JSON.parse(respuesta);
    }
    exist = async (id) => {
      let products = await this.readProduct();
      return products.find(product => product.id === id);
    }  
    
    getProduct = async () => {
        try {
            if (fs.existsSync(this.path)) {                                     
                const data = await this.readProduct(); 
                //console.log(data);                            
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    createProduct = async (producto) => {
      try {
        let products = await this.getProduct();
        if (products.length === 0) {
          producto.id = 1;
          products = [producto];
        } else {
          producto.id = products[products.length - 1].id + 1;
          products.push(producto);
        }
        console.log(producto);
    
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return producto;
      } catch (error) {
        console.log(error);
      }
    }; 
    
    getProductById = async (id) => {
      const products = await this.readProduct();
      const filter = products.find((producto) => producto.id === id);
      console.log(filter);
      return filter;
    };

    updateProduct = async (id, updatedProduct) => {
          try {
        const products = await this.getProduct();
        const index = products.findIndex((product) => product.id === id);
          if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products[index];
        } else {
        console.log('Producto no encontrado.');
        return null;
        }
      } catch (error) {
        console.log(error);
      }
    };
    deleteProduct = async (id) => {
    try {
        const products = await this.getProduct(); 
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
            const [deletedProduct] = products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return deletedProduct;
        } else {
            console.log('Producto no encontrado');
            return null;
        }
    } catch (error) {
        console.log(error);
    }
  };
  
};

export default ProductManager

