import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { axiosWithToken } from "../../axiosWithToken";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FcClock } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import { FcComments } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdRestore } from "react-icons/md";
import styles from "./Article.module.css";

function Article() {
  const { state } = useLocation();
  const { currentUser } = useSelector((state) => state.userAuthorLoginReducer);
  const { register, handleSubmit } = useForm();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [articleEditStatus, setArticleEditStatus] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(state);

  const deleteArticle = async () => {
    let art = { ...currentArticle };
    delete art._id;
    let res = await axiosWithToken.put(
      `http://localhost:4000/author-api/article/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === "Article Deleted!") {
      setCurrentArticle({ ...currentArticle, state: res.data.payload });
    }
  };

  const restoreArticle = async () => {
    let art = { ...currentArticle };
    delete art._id;
    let res = await axiosWithToken.put(
      `http://localhost:4000/author-api/article/${currentArticle.articleId}`,
      art
    );
    if (res.data.message === "Article Restored!") {
      setCurrentArticle({ ...currentArticle, status: res.data.payload });
    }
  };

  // Add comment to an article by user
  const writeComment = async (commentObj) => {
    commentObj.username = currentUser.username;
    let res = await axiosWithToken.post(
      `http://localhost:4000/user-api/comment/${state.articleId}`,
      commentObj
    );
    if (res.data.message === "Comment posted") {
      setComment(res.data.message);
    }
  };

  // Enable edit state
  const enableEditState = () => {
    setArticleEditStatus(true);
  };

  // Save modified article
  const saveModifiedArticle = async (editedArticle) => {
    let modifiedArticle = { ...state, ...editedArticle };
    // Change date of modification
    modifiedArticle.dateOfModification = new Date();
    // Remove _id
    delete modifiedArticle._id;

    // Make HTTP PUT request to save modified article in db
    let res = await axiosWithToken.put(
      "http://localhost:4000/author-api/article",
      modifiedArticle
    );
    if (res.data.message === "Article modified") {
      setArticleEditStatus(false);
      navigate(`/author-profile/my-articles/${modifiedArticle.articleId}`, {
        state: res.data.article,
      });
    }
  };

  // Convert ISO date to UTC data
  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let day = new Date(iso).getUTCDay();
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  return (
    <div className={styles.article}>
      {articleEditStatus === false ? (
        <>
          <div className={styles.articleDetails}>
            <div>
              <span>
                <small className={styles.date}>
                  <FcCalendar className="fs-4" />
                  Created on: {ISOtoUTC(state.dateOfCreation)}
                </small>
                <small className={styles.date}>
                  <FcClock className="fs-4" />
                  Modified on: {ISOtoUTC(state.dateOfModification)}
                </small>
              </span>
              <p className={styles.articleTitle}>{state.title}</p>
            </div>
            <div>
              {currentUser.usertype === "author" && (
                <>
                  <button
                    className="me-2 btn btn-warning"
                    onClick={enableEditState}
                  >
                    <CiEdit className="fs-2" />
                  </button>
                  {currentArticle.status === true ? (
                    <button
                      className="me-2 btn btn-danger"
                      onClick={deleteArticle}
                    >
                      <MdDelete className="fs-2" />
                    </button>
                  ) : (
                    <button
                      className="me-2 btn btn-info"
                      onClick={restoreArticle}
                    >
                      <MdRestore className="fs-2" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <p className={styles.articleContent}>{state.content}</p>
          <div className={styles.comments}>
            {state.comments.length === 0 ? (
              <p>No comments yet...</p>
            ) : (
              state.comments.map((commentObj, ind) => {
                return (
                  <div key={ind} className={styles.commentItem}>
                    <p className={styles.commentUsername}>
                      <FcPortraitMode className="fs-2 me-2" />
                      {commentObj.username}
                    </p>
                    <p className={styles.commentText}>
                      <FcComments className="me-2" />
                      {commentObj.comment}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <h1>{comment}</h1>
          {currentUser.usertype === "user" && (
            <form onSubmit={handleSubmit(writeComment)}>
              <input
                type="text"
                {...register("comment")}
                className={`form-control mb-4 ${styles.editInput}`}
                placeholder="Write comment here...."
              />
              <button type="submit" className="btn btn-success">
                Add a Comment <BiCommentAdd className="fs-3" />
              </button>
            </form>
          )}
        </>
      ) : (
        <form
          className={styles.editForm}
          onSubmit={handleSubmit(saveModifiedArticle)}
        >
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              {...register("title")}
              defaultValue={state.title}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-select"
              defaultValue={state.category}
            >
              <option value="programming">Programming</option>
              <option value="AI&ML">AI&ML</option>
              <option value="database">Database</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              {...register("content")}
              className={`form-control ${styles.editInput}`}
              id="content"
              rows="10"
              defaultValue={state.content}
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Article;
