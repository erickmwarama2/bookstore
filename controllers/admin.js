// const Product = require("../models/product");
// const Product = require("../models/productModel");
const Product = require("../models/productSequelize");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(null, title, imageUrl, description, price);
  // const result = await product.save();
  try {
    const result = await req.user.createProduct({
      title,
      price,
      imageUrl,
      description
    });

    // const result = await Product.create({
    //   title,
    //   price,
    //   imageUrl,
    //   description,
    //   userId: req.user.id
    // });

    console.log("Product created");
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const productId = req.body.productId;
  // const product = new Product(productId, title, imageUrl, description, price);
  // product.save();
  let product;
  try {
    product = await Product.findByPk(productId);
  } catch (error) {
    console.log(error);
  }

  if (product) {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;

    try {
      await product.save();
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  // Product.findById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }

  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     formsCSS: true,
  //     productCSS: true,
  //     activeAddProduct: true,
  //     editing: editMode,
  //     product,
  //   });
  // });
  // const [rows] = await Product.findById(prodId);
  // const product = rows[0];
  try {
    // const product = await Product.findByPk(prodId);

    const products = await req.user.getProducts({ where: { id: prodId }});
    const product = products[0];

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("admin/products", {
  //     prods: products,
  //     pageTitle: "Admin Products",
  //     path: "/admin/products",
  //   });
  // });
  try {
    // const products = await Product.findAll();
    const products = await req.user.getProducts();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }

  // const [rows] = await Product.fetchAll();
  // res.render("admin/products", {
  //   prods: rows,
  //   pageTitle: "Admin Products",
  //   path: "/admin/products",
  // });
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  // Product.delete(productId);
  try {
    const product = await Product.findByPk(productId);
    await product.destroy();
  } catch (error) {
    console.log(error);
  }
  res.redirect("/admin/products");
};
