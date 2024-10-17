const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  static delete(productId) {
    getProductsFromFile(products => {
      if (productId) {
        const product = products.find(prod => prod.id === productId);
        const updatedProducts = products.filter(prod => prod.id !== productId);
        // const updatedProducts = [...products];
        // updatedProducts.splice(prodIdx, 1);

        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          if (!err) {
            Cart.deleteProduct(productId, product.price);
          }
          console.log(err);
        });
      }
    })
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const prodIdx = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[prodIdx] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = (Math.floor(10000 * Math.random()) + 1).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id);
      cb(product);
    })
  }
};
