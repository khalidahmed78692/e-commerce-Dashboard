const express = require("express");
require("./db/config");
// const mongoose = require("mongoose");
const Product = require("./db/Product");
const User = require("./db/User");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("App is working...");
// });

// mongoose.connect("mongodb://0.0.0.0:27017/e-comm");

// const productSchema = new mongoose.Schema({});

// const product = mongoose.model("products", productSchema);

// product.find().then(function (found) {
//   console.log(found);
// });

app.post("/register", function (req, res) {
  const user = new User(req.body);
  user.save().then(function (result) {
    result = result.toObject();
    delete result.password;
    res.send(result);
  });
});

app.post("/login", function (req, res) {
  if (req.body.email && req.body.password) {
    User.findOne(req.body)
      .select("-password")
      .then(function (user) {
        if (user) res.send(user);
        else res.send({ result: "no user found" });
      });
  } else {
    res.send({ result: "No user found" });
  }
});

app.post("/add-product", function (req, res) {
  const product = new Product(req.body);
  product.save().then(function (result) {
    res.send(result);
  });
});

app.get("/products", (req, res) => {
  Product.find().then((products) => {
    if (products.length > 0) res.send(products);
    else res.send({ result: "No Products found" });
  });
});

app.delete("/product/:id", (req, res) => {
  Product.deleteOne({ _id: req.params.id }).then((result) => {
    res.send(result);
  });
});

app.get("/product/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }).then((result) => {
    if (result) res.send(result);
    else res.send("Not found");
  });
});

app.put("/product/:id", (req, res) => {
  Product.updateOne({ _id: req.params.id }, { $set: req.body }).then(
    (result) => {
      if (result) res.send(result);
      else res.send("Error");
    }
  );
});

app.get("/search/:key", (req, res) => {
  Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  }).then((result) => {
    if (result) res.send(result);
    else res.send("No result found");
  });
});

app.listen(5000, (req, res) => {
  console.log("Successfully server running on port 5000");
});
