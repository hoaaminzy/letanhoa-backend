const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const PORT_URL = process.env.PORT_URL
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

mongoose
  .connect(
    process.env.MONGODB_URL,
    console.log("thanh cong")
  )
  .catch((err) => console.log(err));

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  {
    timeStamp: true,
  }
);
const Users = mongoose.model("users", userSchema);

const productSchema = mongoose.Schema(
  {
    name: String,
    category: String,
    image: String,
    price: String,
    quantity: String,
    description: String,
  },
  {
    timeStamp: true,
  }
);
const Products = mongoose.model("products", productSchema);

const orderSchema = mongoose.Schema({
  id:String,
  fullName: String,
  address: String,
  phone: String,
  products: [
    {
      type: mongoose.ObjectId,
      ref: "products",
    },
  ],
  // totalPrice: String,
});

const Oders = mongoose.model('orders', orderSchema)
// app.post("/create", (req, res) => {
//   Bill.create({
//     title: req.body.title,
//     name:req.body.name,
//     price:req.body.price,
//     address:req.body.press,
//     phone:req.body.phone,
//     quantity:req.body.quantity
//   })
//     .then((doc) => console.log(doc))
//     .catch((err) => console.log(err));
// });

//admin
app.post("/signup", async (req, res) => {
  const dataUser = await Users(req.body);
  const saveData = await dataUser.save();
  res.send({ message: "Users successfully" });
});

app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    const checkUser = await Users.findOne({ email: email });
    if (checkUser.password === req.body.password) {
      const dataSend = {
        email: req.body.email,
      };
      res.send({
        message: "login is succesffuly",
        data: dataSend,
        alert: true,
      });
    } else {
      res.send({ message: "wrong password" });
    }
  } catch (error) {}
});


//orders
app.post("/create-orders", async (req, res) => {
  const data = await Oders(req.body);
  const saveData = await data.save();
  res.send({ message: "Order successfully" });
});

//products
app.post("/create", async (req, res) => {
  const data = await Products(req.body);
  const saveData = await data.save();
  res.send({ message: "Upload successfully" });
});

app.get("/products", (req, res) => {
  Products.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

app.delete("/delete/:id", (req, res) => {
  Products.findByIdAndDelete({ _id: req.params.id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.put("/update/:id", (req, res) => {
  Products.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      name: req.body.name,
      price: req.body.price,
      address: req.body.press,
      phone: req.body.phone,
      quantity: req.body.quantity,
    }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

//payment

app.post("/payment", async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Viet Nam",
      payment_method: id,
      confirm: true,
    });
    console.log("Payment", payment);
    res.json({
      message: "Payment successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "payment failed",
      success: false,
    });
  }
});

app.listen(PORT_URL || 3001, () => {
  console.log("server start");
});
