// create admin api app
const exp = require("express");
const adminApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let adminCollection;
adminApp.use((req, res, next) => {
  adminCollection = req.app.get("adminCollection");
  next();
});

// Admin registration
adminApp.post(
  "/admin",
  expressAsyncHandler(async (req, res) => {
    const admin = req.body;
    const dbAdmin = await adminCollection.findOne({
      adminname: admin.adminname,
    });
    if (dbAdmin != null) {
      res.send({ message: "Admin name already registered!" });
    } else {
      const hashedPw = await bcryptjs.hash(admin.password, 6);
      admin.password = hashedPw;
      await adminCollection.insertOne(admin);
      res.send({ message: "Admin registration successful!" });
    }
  })
);

// Admin login
adminApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const adminCred = req.body;
    const dbAdmin = await adminCollection.findOne({
      adminname: adminCred.adminname,
    });
    if (dbAdmin === null) {
      res.send({ message: "Invalid Admin name!" });
    } else {
      const status = await bcryptjs.compare(
        adminCred.password,
        dbAdmin.password
      );
      if (status === false) {
        res.send({ message: "Invalid password!" });
      } else {
        const signedToken = jwt.sign(
          { adminname: adminCred.adminname },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.send({
          message: "Login successful",
          token: signedToken,
          payload: dbAdmin,
        });
      }
    }
  })
);

// Get all articles
adminApp.get(
  "/articles",
  expressAsyncHandler(async (req, res) => {
    const articlesCollection = req.app.get("articlesCollection");
    const articlesList = await articlesCollection.find().toArray();
    res.send({ message: "Articles", payload: articlesList });
  })
);

// export adminApp
module.exports = adminApp;
