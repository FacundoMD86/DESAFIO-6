function updateProductList(productos) {
  let div = document.getElementById("list-products");
  let productsHTML = "";

  productos.forEach((product) => {
    productsHTML += `
      <article class="container">
        <div class="card">
          <div class="imgBx">
            <img src="${product.thumbnail}" width="150" />
          </div>
          <div class="contentBx">
            <h2>${product.title}</h2>
            <div class="size">
              <h3>${product.description}</h3>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
            <div class="color">
              <h3>${product.price}</h3>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <a href="#">Buy Now</a>
          </div>
        </div>
      </article>
    `;
  });

  div.innerHTML = productsHTML;
}
const socketCliente = io();

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let code = form.elements.code.value;
  let price = form.elements.price.value;
  let stock = form.elements.stock.value;
  let category = form.elements.category.value;
  let thumbnail = form.elements.thumbnail.value;
  
  socketCliente.emit("addProduct", {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = parseInt(deleteidinput.value);
    socketCliente.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  });
socketCliente.on("productosupdated", (obj) => {
  updateProductList(obj);
});