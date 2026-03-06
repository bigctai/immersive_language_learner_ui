import axios from "axios";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import Form from "../../components/Form/Form.jsx";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    let id = "";
    e.preventDefault();
    try {
      let resp = await axios.get("http://localhost:8080/user/get/" + username);
      id = resp.data;
    } catch (e) {
      console.error(e);
    }
    if (!id) {
      setLoginStatus(false);
      console.error("No id found");
      return;
    }
    console.log(id);
    localStorage.setItem("id", id);
    navigate("/");
  }
  return (
    <div className="nav-page">
      <div className="login-form">
        <h1> Login </h1>
        <Form onsubmit={handleSubmit}>
          <div>
            <label for="username">Username: </label>
            <input
              id="username"
              className={
                "form-input " + (!loginStatus ? "login-error" : "login-safe")
              }
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          {!loginStatus && <p className="no-username">Invalid username</p>}
        </Form>
      </div>
    </div>
  );
}
