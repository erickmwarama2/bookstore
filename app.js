const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// const db = require('./util/database');
const sequelize = require('./util/database');
const Product = require('./models/productSequelize');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Cart = require('./models/cartSequelize');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// db.connect();
// db.execute('SELECT * FROM products')
// .then((result) => {
//     console.log(result[0]);
// })
// .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    try {
        const user = await User.findByPk(1);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });

sequelize
// .sync({force: true})
.sync()
.then(result => {
    return User.findByPk(1);
})
.then(user => {
    if (!user) {
        return User.create({ name: 'Erick', email: 'erick@gmail.com'});
    }
    return Promise.resolve(user);
})
.then(user => {
    // console.log(user);
    user.createCart();
    app.listen(3000);
})
.catch(err => console.log(err))

