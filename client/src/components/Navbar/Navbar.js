import React from "react";
import { Link } from "react-router-dom";
import "../Navbar/Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userAuthorSlice";

function Navbar() {
  let { loginUserStatus, errorOccured, errMsg, currentUser } = useSelector(
    (state) => state.userAuthorLoginReducer,
  );

  let dispatch = useDispatch();
  function logOut() {
    // Remove token from local storage
    localStorage.removeItem("token");
    dispatch(resetState());
  }
  return (
    <ul className="nav bg-dark text-primary justify-content-end navbar">
      {loginUserStatus === false ? (
        <>
          <li className="nav-item">
            <Link to="" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item active">
            <Link to="register" className="nav-link">
              Register
            </Link>
          </li>
          <li className="nav-item active">
            <Link to="login" className="nav-link">
              Login
            </Link>
          </li>
        </>
      ) : (
        <li className="nav-item active">
          <Link to="login" className="nav-link" onClick={logOut}>
            <p className="fs-3">Welcome {currentUser.username},</p>
            LogOut
          </Link>
        </li>
      )}
    </ul>
  );
}

export default Navbar;
