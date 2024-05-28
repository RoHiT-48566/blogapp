import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { lazy } from "react";
import RootLayout from "./components/RootLayout/RootLayout";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import UserProfile from "./components/user-profile/UserProfile";
import AuthorProfile from "./components/author-profile/AuthorProfile";
import AddArticle from "./components/AddArticle/AddArticle";
import ArticlesByAuthor from "./components/ArticlesbyAuthor/ArticlesByAuthor";
import Article from "./components/Article/Article";
import Articles from "./components/Articles/Articles";
import ErrorPage from "./components/ErrorPage";
// Lazy loading
// Dynamic import of Articles
// const Articles = lazy(() => import("./components/Articles/Articles"));
// In routing component it should be kept in Suspense
// Eg :
// path : "articles",
// element : <Suspense fallback="loading..."><Articles/></Suspense>

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "/user-profile",
          element: <UserProfile />,
          children: [
            {
              path: "articles",
              element: <Articles />,
            },
            {
              path: "article/:articleId",
              element: <Article />,
            },
            {
              path: "",
              element: <Navigate to="articles" />,
            },
          ],
        },
        {
          path: "/author-profile",
          element: <AuthorProfile />,
          children: [
            {
              path: "new-article",
              element: <AddArticle />,
            },
            {
              path: "my-articles/:username",
              element: <ArticlesByAuthor />,
            },
            {
              path: "article/:articleId",
              element: <Article />,
            },
            {
              path: "",
              element: <Navigate to="my-articles/:username" />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
