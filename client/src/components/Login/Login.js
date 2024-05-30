import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userAuthorLoginThunk } from "../../redux/slices/userAuthorSlice.js";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { loginUserStatus, currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = (userObj) => {
    dispatch(userAuthorLoginThunk(userObj));
  };

  useEffect(() => {
    if (loginUserStatus) {
      if (currentUser.usertype === "author") {
        navigate("/author-profile");
      } else {
        navigate("/user-profile");
      }
    }
  }, [loginUserStatus, currentUser, navigate]);

  return (
    <div className={styles.login}>
      <form
        className={`${styles.loginForm} bg-light d-block mx-auto m-5 p-5 w-50 text-center`}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="mb-3 d-flex justify-content-center">
          <div className="mb-4">
            <label htmlFor="user" className={`${styles.loginFormLabel} me-3`}>
              Login as
            </label>
            <div className={`${styles.formCheck} form-check form-check-inline`}>
              <input
                type="radio"
                className={`${styles.formCheckInput} form-check-input`}
                id="author"
                value="author"
                {...register("usertype")}
              />
              <label htmlFor="author" className="form-check-label">
                Author
              </label>
            </div>
            <div className={`${styles.formCheck} form-check form-check-inline`}>
              <input
                type="radio"
                className={`${styles.formCheckInput} form-check-input`}
                id="user"
                value="user"
                {...register("usertype")}
              />
              <label htmlFor="user" className="form-check-label">
                User
              </label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className={styles.loginFormLabel}>
            Username
          </label>
          <input
            type="text"
            id="username"
            className={styles.inputText}
            {...register("username", { required: "Username is required" })}
            autoComplete="username"
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className={styles.loginFormLabel}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={styles.inputText}
            {...register("password", { required: "Password is required" })}
            autoComplete="current-password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className="mb-3">
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
