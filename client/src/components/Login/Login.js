import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userAuthorLoginThunk } from "../../redux/slices/userAuthorSlice.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  let { register, handleSubmit } = useForm();
  let { loginUserStatus, errorOccured, errMsg, currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );
  let navigate = useNavigate();
  let dispatch = useDispatch();

  function handleFormSubmit(userObj) {
    console.log(userObj);
    dispatch(userAuthorLoginThunk(userObj));
  }

  useEffect(() => {
    if (loginUserStatus === true) {
      if (currentUser.usertype === "author") {
        navigate("/author-profile");
      } else {
        navigate("/user-profile");
      }
    }
  }, [loginUserStatus, currentUser]);

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-center display-1 text-light bg-dark mt-3 homeHeader d-block mx-auto w-25 rounded">
        Login
      </h1>
      {/* Form */}
      <form
        className="border border-dark rounded bg-light d-block mx-auto m-5 p-5 w-50 text-center"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* Usertype */}
        <div className="mb-3 d-flex justify-content-center">
          <div className="mb-4">
            <label
              htmlFor="user"
              className="form-check-label me-3"
              style={{
                fontSize: "1.2rem",
                color: "var(--light-dark-grey)",
              }}
            >
              Login as
            </label>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                id="author"
                value="author"
                {...register("usertype")}
              />
              <label htmlFor="author" className="form-check-label">
                Author
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
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
        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            {...register("username", { required: true })}
            autoComplete="username"
          />
        </div>
        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            {...register("password", { required: true })}
            autoComplete="current-password"
          />
        </div>
        {/* Submit Button */}
        <div className="mb-3">
          <button type="submit" className="btn btn-success">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
