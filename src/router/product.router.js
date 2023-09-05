import Router from "express";
import ProductManager from "../productos/ProductsManager.js";
import uploader from "../services/uploader.js";

const ProductRouter = Router();

const productManager = new ProductManager("./src/files/Productos.json");
const readProducts = await productManager.getProduct();

ProductRouter.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(await readProducts);
    let allProducts = await readProducts;
    let productLimit = allProducts.slice(limit);
    res.send(productLimit);
    res.render("home",{
        title:"Express avanzado | handlebars ",
        products: allProducts
    });
});

ProductRouter.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allProducts = await readProducts;
    let ProductById = allProducts.find(product => `${product.id}` === `${id}`);
    res.send(ProductById);

});

ProductRouter.post("/", uploader.single("image"), async (req, res) => {
    let newProduct = req.body;
    res.send(await productManager.createProduct(newProduct));
});

ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id;
    let updateProduct = req.body;
    res.send(await productManager.updateProduct(id, updateProduct));
});

ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id;
    res.send(await productManager.deleteProduct(id));
});

export default ProductRouter