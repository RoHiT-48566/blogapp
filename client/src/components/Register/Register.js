import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
  const { register, handleSubmit } = useForm();
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleRegisterSubmit(registerUserObj) {
    try {
      const res = await axios.post(
        `http://localhost:4000/${registerUserObj.usertype}-api/${registerUserObj.usertype}`,
        registerUserObj
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
    <div className={styles.registration}>
      {err && <p className={`${styles.textDanger} fs-3 text-center`}>{err}</p>}
      <form
        className={`${styles.registrationForm} bg-light d-block mx-auto m-5 p-5 w-50 text-center`}
        onSubmit={handleSubmit(handleRegisterSubmit)}
      >
        <div className="m-3 text-center">
          <label htmlFor="user" className={styles.registrationFormLabel}>
            User Type
          </label>
          <div
            className={`${styles.formCheck} form-check form-check-inline mx-2`}
          >
            <input
              type="radio"
              id="author"
              value="author"
              {...register("usertype", { required: true })}
              className={`${styles.formCheckInput} form-check-input`}
            />
            <label htmlFor="author" className="form-check-label">
              Author
            </label>
          </div>
          <div
            className={`${styles.formCheck} form-check form-check-inline mx-2`}
          >
            <input
              type="radio"
              id="user"
              value="user"
              {...register("usertype", { required: true })}
              className={`${styles.formCheckInput} form-check-input`}
            />
            <label htmlFor="user" className="form-check-label">
              User
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="username" className={styles.registrationFormLabel}>
            Username
          </label>
          <input
            type="text"
            id="username"
            className={styles.inputText}
            {...register("username", { required: true })}
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className={styles.registrationFormLabel}>
            Password
          </label>
          <input
            type="password"
            id="password"
            className={styles.inputText}
            {...register("password", { required: true })}
            autoComplete="new-password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className={styles.registrationFormLabel}>
            Email
          </label>
          <input
            type="email"
            id="email"
            className={styles.inputText}
            {...register("email", { required: true })}
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
