// create author api app
const exp = require("express");
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../Middlewares/verifyToken");
require("dotenv").config();

// get authorsCollection app
let authorsCollection;
authorApp.use((req, res, next) => {
  authorsCollection = req.app.get("authorsCollection");
  articlesCollection = req.app.get("articlesCollection");
  next();
});

// Author registration
authorApp.post(
  "/author",
  expressAsyncHandler(async (req, res) => {
    const newAuthor = req.body;
    const dbUser = await authorsCollection.findOne({
      username: newAuthor.username,
    });
    if (dbUser != null) {
      res.send({ message: "AuthorName already exists!" });
    } else {
      const hashedPw = await bcryptjs.hash(newAuthor.password, 6);
      newAuthor.password = hashedPw;
      await authorsCollection.insertOne(newAuthor);
      const articleDocument = {
        username: newAuthor.username, // Changed from userrname to username
        articles: newAuthor.articles,
      };
      await articlesCollection.insertOne(articleDocument);
      res.send({ message: "Author Created!" });
    }
  }),
);

// Author Login
authorApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const authorCred = req.body;
    const dbUser = await authorsCollection.findOne({
      username: authorCred.username,
    });
    if (dbUser === null) {
      res.send({ message: "Invalid Username!" });
    } else {
      const status = await bcryptjs.compare(
        authorCred.password,
        dbUser.password,
      );
      if (status === false) {
        res.send({ message: "Invalid password!" });
      } else {
        const signedToken = jwt.sign(
          { username: dbUser.username },
          process.env.SECRET_KEY,
          { expiresIn: "1d" },
        );
        res.send({
          message: "Login successful",
          token: signedToken,
          user: dbUser,
        });
      }
    }
  }),
);

// View articles written by the authors
authorApp.get(
  "/my-articles/:username",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const author = req.params.username;
    const articlesList = await articlesCollection
      .find({ username: author }) // Changed from authorname to username
      .toArray();
    if (articlesList === null) {
      res.send({ message: "No articles published!" });
    } else {
      res.send({ message: "My Articles", payload: articlesList });
    }
  }),
);

// Adding new articles
authorApp.post(
  "/article",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const newArticle = req.body;
    // Post to articles collection
    const articleResponse = await articlesCollection.insertOne(newArticle);
    res.send({ message: "New articles published", payload: newArticle });
  }),
);

// Updating articles by author
authorApp.put(
  "/article",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    // update by article ID
    let result = await articlesCollection.updateOne(
      { articleId: modifiedArticle.articleId },
      { $set: { ...modifiedArticle } },
    );
    let latestArticle = await articlesCollection.findOne({
      articleId: modifiedArticle.articleId,
    });
    console.log(result);
    res.send({ message: "Article modified", article: latestArticle });
  }),
);

// Deleting an article (Soft delete)
authorApp.put(
  "/article/:articleId",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const articleIdFromUrl = +req.params.articleId;
    const articleToDelete = req.body;
    // update status of article to false
    if (articleToDelete.status === true) {
      let modifiedArt = await articlesCollection.findOneAndUpdate(
        { articleId: articleIdFromUrl },
        { $set: { ...articleToDelete, status: false } },
        { returnDocument: "after" },
      );
      res.send({ message: "Article Deleted!", payload: modifiedArt.status });
    } else if (articleToDelete.status === false) {
      let modifiedArt = await articlesCollection.findOneAndUpdate(
        { articleId: articleIdFromUrl },
        { $set: { ...articleToDelete, status: true } },
        { returnDocument: "after" },
      );
      res.send({ message: "Article Restored!", payload: modifiedArt.status });
    }
  }),
);

// export authorApp
module.exports = authorApp;
