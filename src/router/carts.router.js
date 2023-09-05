import Router from "express";
import CartManager from "../productos/CartManager.js";
import uploader from "../services/uploader.js";

const CartRouter = Router();

const cartManager = new CartManager('./src/files/carts.json');
const readCarts = cartManager.readCart();


CartRouter.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(await readCarts);
    let allCarts = await readCarts;
    let cartLimit = allCarts.slice(limit);
    res.send(cartLimit);
    res.render("home",{
        title:"Express avanzado | handlebars ",
        products: allCarts
    });
});

CartRouter.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allCarts = await readCarts;
    let CartById = allCarts.find(cart => `${cart.id}` === `${id}`);
    res.send(CartById);

});

CartRouter.post("/", uploader.single("image"), async (req, res) => {
    let newCart = req.body;
    res.send(await cartManager.createCarts(newCart));
});

CartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    res.send(await cartManager.addProductInCart(cartId, productId));
});


CartRouter.put("/:id", async (req, res) => {
    let id = req.params.id;
    let updateCart = req.body;
    res.send(await cartManager.updateCarts(id, updateCart));
});

CartRouter.delete("/:id", async (req, res) => {
    let id = req.params.id;
    res.send(await cartManager.deleteCarts(id));
});

export default CartRouter