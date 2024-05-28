// Create express app
const exp = require("express");
const app = exp();
require("dotenv").config(); //Process-global object in nodejs; config adds .env property to the Process
const mongoClient = require("mongodb").MongoClient;

const path = require("path");
// deploy react build in this server
app.use(exp.static(path.join(__dirname, "../client/build")));

// Parse the body of request object
app.use(exp.json());
// Connect to db
mongoClient
  .connect(process.env.DB_URL)
  .then((client) => {
    // get database object
    const blogdb = client.db("blogdb");
    // get collection object
    const usersCollection = blogdb.collection("usersCollection");
    const articlesCollection = blogdb.collection("articlesCollection");
    const authorsCollection = blogdb.collection("authorsCollection");
    const adminCollection = blogdb.collection("adminCollection");
    // share collection object with express app
    app.set("usersCollection", usersCollection);
    app.set("articlesCollection", articlesCollection);
    app.set("authorsCollection", authorsCollection);
    app.set("adminCollection", adminCollection);
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("Error in Database Connection", err);
  });

// import API routes
const userApp = require("./APIS/user-api");
const authorApp = require("./APIS/author-api");
const adminApp = require("./APIS/admin-api");

// If path starts with user-api,send req to userApp
app.use("/user-api", userApp);
// If path starts with author-api,send req to authorApp
app.use("/author-api", authorApp);
// If path starts with admin-api,send req to adminApp
app.use("/admin-api", adminApp);

// Deals with page refresh
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// express error handler
app.use((err, req, res, next) => {
  res.send({ message: "Error!", payload: err.message });
});

// Assign port number
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Web server on port ${port}`));
