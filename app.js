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

// db.connect();
// db.execute('SELECT * FROM products')
// .then((result) => {
//     console.log(result[0]);
// })
// .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize.sync({ force: true }).then(result => {
    console.log(result);
    app.listen(3000);
}).catch(err => console.log(err))

