const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = {...cart };
      const product = cart.products.find(prod => prod.id === id);
      const productQty = product.qty;
      updatedCart.totalPrice -= (price * productQty);
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
            console.log(err);
        }
    });
    });
  }

  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0};
        if (!err) {
            cart = JSON.parse(fileContent);
        }

        const existingProductIdx = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIdx];
        let updatedProduct;
        if (existingProduct) {
            updatedProduct = {...existingProduct, qty: existingProduct.qty + 1 };
            cart.products = [...cart.products];
            cart.products[existingProductIdx] = updatedProduct;
        } else {
            updatedProduct = { id, qty: 1 };
            cart.products = [...cart.products, updatedProduct];
        }

        cart.totalPrice += +productPrice;
        fs.writeFile(p, JSON.stringify(cart), (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
  }
};
