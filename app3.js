const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

const User = require("./models/mongoose/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("671f33423aff1b343809e861");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://erickmwarama:mutwiriEM1992@max-nodejs-cluster.s8ko4.mongodb.net/shop?retryWrites=true&w=majority&appName=max-nodejs-cluster"
  )
  .then(async (result) => {
    let user = await User.findOne();
    if (!user) {
      let user = new User({
        name: "Erick",
        email: "erick@gmail.com",
        cart: {
          items: [],
        },
      });

      user.save();
    }
    app.listen(3003);
  })
  .catch((err) => console.error(err));
