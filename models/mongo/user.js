const getDb = require("../../util/mongodb").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  async save() {
    const db = getDb();

    try {
      await db.collection("users").insertOne(this);
    } catch (error) {
      console.log(error);
    }
  }

  async addToCart(product) {
    let newQty = 1;
    const updatedCartItems = [...this.cart];

    const cartProductIdx = this.cart.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    if (cartProductIdx >= 0) {
      newQty = this.cart[cartProductIdx].quantity + 1;

      updatedCartItems[cartProductIdx].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: 1,
      });
    }

    const db = getDb();
    await db.collection("users").updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      {
        $set: {
          cart: updatedCartItems,
        },
      }
    );
  }

  async getOrders() {
    const db = getDb();

    try {
      return await db
        .collection("orders")
        .find({ "user._id": new mongodb.ObjectId(this._id) })
        .toArray();
    } catch (error) {
      console.log(error);
    }
  }

  async addOrder() {
    const db = getDb();
    try {
      const cartProducts = await this.getCart();
      const order = {
        items: cartProducts,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name,
          email: this.email,
        },
      };
      await db.collection("orders").insertOne(order);
      this.cart = [];
      return await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: [] } }
        );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItemFromCart(productId) {
    const updatedCart = this.cart.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    const db = getDb();

    try {
      await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: updatedCart } }
        );
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async getCart() {
    const db = getDb();
    try {
      const productIds = this.cart.map((i) => i.productId);
      const products = await db
        .collection("products")
        .find({
          _id: {
            $in: productIds,
          },
        })
        .toArray();
      const cart = products.map((p) => ({
        ...p,
        quantity: this.cart.find(
          (i) => i.productId.toString() === p._id.toString()
        ).quantity,
      }));
      return cart;
    } catch (error) {
      console.log(error);
    }
    return this.cart;
  }

  static async findById(id) {
    const db = getDb();

    try {
      return await db
        .collection("users")
        .find({ _id: new mongodb.ObjectId(id) })
        .next();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = User;
