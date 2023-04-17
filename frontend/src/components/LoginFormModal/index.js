import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.loginUserThunk({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoClick = () => {
    dispatch(sessionActions.loginUserThunk({ credential: 'Demo-lition', password: 'password' }))
    closeModal()
  }

  return (
    <>
      <h1 className="login-modal-h1" >Log In</h1>
      <form className="login-modal-form" onSubmit={handleSubmit}>
        <div className="login-modal-content">
          <label className="login-modal-labels" >
            <div>Username or Email </div>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              // placeholder="Username or Email"
              className="login-modal-inputs"
            />
          </label>

          <label className="login-modal-labels">
            <div>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // placeholder="Password"
              className="login-modal-inputs"
            />
          </label>
          {errors.credential && (
            <p>{errors.credential}</p>
          )}
        </div>


        <div className="login-modal-button-div">
          <button className="login-modal-button" disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>

        </div>
        <div className="login-modal-demo">
          <div onClick={() => demoClick()}>Demo User</div>

        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
