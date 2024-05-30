import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userAuthorSlice";
import styles from "./Navbar.module.css"; // Import CSS module

function Navbar() {
  let { loginUserStatus, currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer
  );

  let dispatch = useDispatch();
  function logOut() {
    localStorage.removeItem("token");
    dispatch(resetState());
  }

  return (
    <ul className={`${styles.navbar} nav justify-content-end`}>
      {loginUserStatus === false ? (
        <>
          <li className={`${styles.navbarItem} nav-item`}>
            <Link to="" className={`${styles.navbarLink} nav-link`}>
              Home
            </Link>
          </li>
          <li className={`${styles.navbarItem} nav-item active`}>
            <Link to="register" className={`${styles.navbarLink} nav-link`}>
              Register
            </Link>
          </li>
          <li className={`${styles.navbarItem} nav-item active`}>
            <Link to="login" className={`${styles.navbarLink} nav-link`}>
              Login
            </Link>
          </li>
        </>
      ) : (
        <li className={`${styles.navbarItem} nav-item active`}>
          <Link
            to="login"
            className={`${styles.navbarLink} nav-link`}
            onClick={logOut}
          >
            <p className={`${styles.userName}`}>
              Welcome {currentUser.username}
            </p>
            LogOut
          </Link>
        </li>
      )}
    </ul>
  );
}

export default Navbar;
