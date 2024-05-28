import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register, handleSubmit } = useForm();
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleRegisterSubmit(registerUserObj) {
    try {
      const res = await axios.post(
        `http://localhost:4000/${registerUserObj.usertype}-api/${registerUserObj.usertype}`,
        registerUserObj,
      );
      console.log(res);
      if (
        res.data.message === "User created!" ||
        res.data.message === "Author Created!"
      ) {
        navigate("/login");
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErr(error.message);
    }
  }

  return (
    <div>
      <h1 className="text-center display-1 text-light bg-dark mt-3 homeHeader d-block mx-auto w-50 rounded">
        Registration
      </h1>
      {err && <p className="text-danger fs-3 text-center">{err}</p>}
      <form
        className="border border-dark rounded bg-light d-block mx-auto m-5 p-5 w-50 text-center"
        onSubmit={handleSubmit(handleRegisterSubmit)}
      >
        <div className="m-3 d-flex">
          <label htmlFor="user" className="form-label">
            User Type
          </label>
          <div className="form-check mx-2">
            <input
              type="radio"
              id="author"
              value="author"
              {...register("usertype", { required: true })}
              className="form-check-input"
            />
            <label htmlFor="author" className="form-check-label">
              Author
            </label>
          </div>
          <div className="form-check mx-2">
            <input
              type="radio"
              id="user"
              value="user"
              {...register("usertype", { required: true })}
              className="form-check-input"
            />
            <label htmlFor="user" className="form-check-label">
              User
            </label>
          </div>
        </div>

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
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            {...register("password", { required: true })}
            autoComplete="new-password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            {...register("email", { required: true })}
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-success">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
