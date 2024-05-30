import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddArticle.module.css";

function AddArticle() {
  let { register, handleSubmit } = useForm();
  let { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  let [err, setErr] = useState("");
  let navigate = useNavigate();
  let token = localStorage.getItem("token");

  // Create axios with token
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const postNewArticle = async (article) => {
    article.dateOfCreation = new Date();
    article.dateOfModification = new Date();
    article.articleId = Date.now();
    article.username = currentUser.username;
    article.comments = [];
    article.status = true;
    console.log(article);
    // Make http  post request
    let res = await axiosWithToken.post(
      "http://localhost:4000/author-api/article",
      article
    );
    if (res.data.message === "New articles published") {
      navigate(`/author-profile/my-articles/${currentUser.username}`);
    } else {
      setErr(res.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={`${styles.card}`}>
          <div className={`${styles.cardTitle}`}>
            <h2 className={`${styles.head}`}>Write an Article</h2>
          </div>
          <div className={`${styles.cardBody}`}>
            {/* {err.length!==0&&<p className='text-danger fs-5'>{err}</p>} */}
            <form onSubmit={handleSubmit(postNewArticle)}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>
                  Title
                </label>
                <input
                  type="text"
                  className={styles.formControl}
                  id="title"
                  {...register("title")}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.formLabel}>
                  Select a category
                </label>
                <select
                  {...register("category")}
                  id="category"
                  className={styles.formSelect}
                >
                  <option value="programming">Programming</option>
                  <option value="AI&ML">AI&ML</option>
                  <option value="database">Database</option>
                  <option value="webdevelopment">Web Development</option>
                  <option value="blockchain">Block Chain</option>
                  <option value="datascience">Data Science</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.formLabel}>
                  Content
                </label>
                <textarea
                  {...register("content")}
                  className={styles.formControl}
                  id="content"
                  rows="10"
                ></textarea>
              </div>

              <div className={styles.textEnd}>
                <button type="submit" className={`${styles.submitButton}`}>
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddArticle;
