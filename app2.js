const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// const User = require('./models/user');
const mongoConnect = require('./util/mongodb').mongoConnect;
const User = require('./models/mongo/user');
const mongodb = require('mongodb');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    try {
        const user = await User.findById(new mongodb.ObjectId("671b4744b5c46872920e0ab0"));
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect().then(client => {

    app.listen(3001);
}).catch(err => console.log(`Error occured connecting to mongodb: ${err}`));


