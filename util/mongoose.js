const mongoose = require('mongoose');
const user = require('../models/mongoose/user');

mongoose.connect('mongodb+srv://erickmwarama:mutwiriEM1992@max-nodejs-cluster.s8ko4.mongodb.net/?retryWrites=true&w=majority&appName=max-nodejs-cluster').then(result => {
    const user = new user({
        name: 'Erick',
        email: 'erick@gmail.com',
        cart: {
            items: []
        }
    });

    user.save();
    app.listen(3000);
})