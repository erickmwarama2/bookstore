// const Product = require("../models/product");
// const Product = require('../models/productModel');
const Product = require("../models/productSequelize");
// const Cart = require("../models/cart");
// const Order = require("../models/order");

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

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where : { id: prodId }});
    let product = products.length > 0 ? products[0] : undefined;
    let newQty = 1;
    if (product) {
      newQty = product.cartItem.quantity + 1;
    } else {
      product = await Product.findByPk(prodId);
    }
    cart.addProduct(product, { through: { quantity: newQty }});
    return res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    const result = await order.addProducts(products.map(p => {
      p.orderItem = { quantity: p.cartItem.quantity };
      return p;
    }));
    cart.setProducts(null);
    return res.redirect('/orders');
  } catch (error) {
    console.log(error);
  }
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

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    // console.log(cart);
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (error) {
    console.log(error);
  }

};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ['products']});
    // console.log(orders);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
