import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signupUserThunk({
          email,
          username,
          firstName,
          lastName,
          password,
        }),
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
      ).then(closeModal())
        ;
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 className="signup-modal-h1">Sign Up</h1>
      <form className="signup-modal-form" onSubmit={handleSubmit}>
        <div className="signup-modal-content">

          <label className="signup-modal-labels">
            <div>Email</div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-modal-inputs signup-modal-inputs-pairs"
            />
          </label>
          {errors.email && <p>{errors.email}</p>}

          <label className="signup-modal-labels">
            <div>Username</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-modal-inputs"
            />
          </label>
          {errors.username && <p>{errors.username}</p>}

          <label className="signup-modal-labels">
            <div>First Name</div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="signup-modal-inputs signup-modal-inputs-pairs"
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}

          <label className="signup-modal-labels">
            <div>Last Name</div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="signup-modal-inputs"
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}

          <label className="signup-modal-labels">
            <div>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-modal-inputs signup-modal-inputs-pairs"
            />
          </label>
          {errors.password && <p>{errors.password}</p>}

          <label className="signup-modal-labels">
            <div>Confirm Password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-modal-inputs"
              size={40}
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>

        <div className="signup-modal-button-div">

        <button className="signup-modal-button"disabled={!email || !username || username.length < 4 || !firstName || !lastName || !password || password.length < 6 || !confirmPassword || confirmPassword.length < 6} type="submit">Sign Up</button>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
