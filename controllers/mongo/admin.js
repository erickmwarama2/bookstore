const Product = require("../../models/mongo/product");
const mongodb = require('mongodb');

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

  try {

    const product = new Product(title, price, description, imageUrl);
    await product.save();
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
  const product = new Product(title, price, description, imageUrl, new mongodb.ObjectId(productId));

    try {
      await product.save();
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

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

  try {
    const products = await Product.fetchAll();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }

};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  // Product.delete(productId);
  try {
    const product = await Product.deleteById(productId);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/admin/products");
};
