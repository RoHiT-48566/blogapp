import { useState, useEffect } from "react";
import { axiosWithToken } from "../../axiosWithToken";
import { useNavigate, Outlet } from "react-router-dom";
import styles from "./Articles.module.css";

function Articles() {
  const [articlesList, setArticlesList] = useState([]);
  const navigate = useNavigate();

  const getArticlesOfCurrentAuthor = async () => {
    try {
      let res = await axiosWithToken.get(
        "http://localhost:4000/user-api/articles"
      );
      console.log(res);
      setArticlesList(res.data.payload);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const readArticleByArticleId = (articleObj) => {
    navigate(`../article/${articleObj.articleId}`, { state: articleObj });
  };

  useEffect(() => {
    getArticlesOfCurrentAuthor();
  }, []);

  return (
    <div className={styles.articles}>
      <div
        className={`row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5 ${styles.articleList}`}
      >
        {articlesList.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articlesList.map((article) => (
            <div className="col" key={article.articleId}>
              <div className={`card h-100 ${styles.articleCard}`}>
                <div className="card-body">
                  <h5 className={`card-title ${styles.articleTitle}`}>
                    {article.title}
                  </h5>
                  <p className={`card-text ${styles.articleContent}`}>
                    {article.content.substring(0, 80) + "...."}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className={`custom-btn btn-4 ${styles.readMoreButton}`}
                    onClick={() => readArticleByArticleId(article)}
                  >
                    <span>Read More</span>
                  </button>
                  <small
                    className={`text-body-secondary ${styles.articleDate}`}
                  >
                    Last updated on {article.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Articles;
