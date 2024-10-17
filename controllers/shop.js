// const Product = require("../models/product");
// const Product = require('../models/productModel');
const Product = require("../models/productSequelize");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/product-list", {
  //     prods: products,
  //     pageTitle: "All Products",
  //     path: "/products",
  //   });
  // });

  // const [rows, _metaData] = await Product.fetchAll();
  // res.render("shop/product-list", {
  //   prods: rows,
  //   pageTitle: "All Products",
  //   path: "/products",
  // });

  try {
    const products = await Product.findAll();
    // const [rows, _metaData] = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findById(prodId, (product) => {
  //   res.render("shop/product-detail", {
  //     product,
  //     pageTitle: product.title,
  //     path: "/products",
  //   });
  // });

  // const [rows] = await Product.findById(prodId);
  // const product = rows[0];
  // res.render("shop/product-detail", {
  //   product,
  //   pageTitle: product.title,
  //   path: "/products",
  // });

  try {
    const product = await Product.findByPk(prodId);
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(`Add to cart product id: ${prodId}`);
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/");
};

exports.getIndex = async (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/index", {
  //     prods: products,
  //     pageTitle: "Shop",
  //     path: "/",
  //   });
  // });
  try {
    const products = await Product.findAll();
    // const [rows, _metaData] = await Product.fetchAll();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
