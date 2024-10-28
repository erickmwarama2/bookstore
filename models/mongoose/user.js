const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = async function(product) {
    let newQty = 1;
    const updatedCartItems = [...this.cart.items];

    const cartProductIdx = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    if (cartProductIdx >= 0) {
      newQty = this.cart.items[cartProductIdx].quantity + 1;

      updatedCartItems[cartProductIdx].quantity = newQty;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: 1,
      });
    }

    this.cart.items = updatedCartItems;

    return this.save();
};

userSchema.methods.getCart = async function() {
    try {
        const user = await this.populate('cart.items.productId');
        return user.cart.items;
    } catch (error) {
      console.log(error);
    }
    return this.cart;
};

module.exports = mongoose.model('User', userSchema);