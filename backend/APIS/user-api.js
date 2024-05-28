// Create user api app
const exp = require("express");
const userApp = exp.Router();
const commonApp = require("./common-api");
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../Middlewares/verifyToken");
require("dotenv").config();

let usersCollection;
// get userCollection app
userApp.use((req, res, next) => {
  usersCollection = req.app.get("usersCollection");
  articlesCollection = req.app.get("articlesCollection");
  next();
});

// User registration route
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    // Get user resource from client
    const newUser = req.body;
    //   Check for duplicate user based on username
    const dbUser = await usersCollection.findOne({
      username: newUser.username,
    });
    if (dbUser != null) {
      res.send({ message: "Username already exists!" });
    } else {
      const hashedPw = await bcryptjs.hash(newUser.password, 6);
      newUser.password = hashedPw;
      await usersCollection.insertOne(newUser);
      res.send({ message: "User created!" });
    }
  })
);

// User login route
userApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    // get credentials from client
    const userCred = req.body;
    // check for username
    const dbUser = await usersCollection.findOne({
      username: userCred.username,
    });
    if (dbUser === null) {
      res.send({ message: "Invalid username" });
    } else {
      const status = await bcryptjs.compare(userCred.password, dbUser.password);
      if (status === false) {
        res.send({ message: "Invalid password!" });
      } else {
        const signedToken = jwt.sign(
          { username: dbUser.username },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.send({
          message: "Login successful",
          token: signedToken,
          user: dbUser,
        });
      }
    }
  })
);

// Get articles of all authors
userApp.get(
  "/articles",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const articlesCollection = req.app.get("articlesCollection");
    const articlesList = await articlesCollection
      .find({ status: true })
      .toArray();
    res.send({ message: "Articles", payload: articlesList });
  })
);

// Post comments for an article by article id
userApp.post(
  "/comment/:articleId",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    // get articleId
    const articleId = +req.params.articleId;
    // get user comment
    const userComment = req.body;
    // insert userComment object to comments array of article by id
    let result = await articlesCollection.updateOne(
      { articleId: articleId },
      { $addToSet: { comments: userComment } }
    );
    console.log(result);
    res.send({ message: "Comment posted" });
  })
);
// export userApp
module.exports = userApp;
