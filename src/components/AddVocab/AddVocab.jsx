import { useState, useEffect } from "react";
import axios from "axios";
import useId from "../../hooks/useId.js";
import Login from "../../pages/Login/Login.jsx";
import { useNavigate } from "react-router-dom";
import "./AddVocab.css";
import Button from "../Button/Button.jsx";
import Form from "../Form/Form.jsx";

export function AddVocab({ id, children }) {
  const [phrase, setPhrase] = useState("");
  const [translation, setTranslation] = useState("");
  const [priority, setPriority] = useState("1");
  const [difficulty, setDifficulty] = useState("1");

  async function handleSubmit(e) {
    e.preventDefault();
    await axios
      .post("http://localhost:8080/user/add_vocab", {
        user_id: parseInt(id),
        phrase: phrase.toString(),
        translation: translation.toString(),
        priority: parseInt(priority),
        difficulty: parseInt(difficulty),
      })
      .then((resp) => console.log(resp))
      .catch((e) => console.log(e));
  }

  async function translatePhrase(e) {
    e.preventDefault();
    let resp = await axios.get("http://localhost:8080/translate/phrase", {
      params: { phrase: phrase.toString() },
    });
    resp = resp.data;
    console.log(resp);
    setTranslation(resp.translatedText);
  }
  return (
    <div className="add-vocab-container">
      {id && (
        <div className="popup-container">
          <div className="exit-popup">{children}</div>
          <Form onSubmit={handleSubmit}>
            <div className="form-element">
              <label for="phrase">Phrase</label>
              <input
                type="text"
                className="form-input"
                name="phrase"
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="add vocab"
                required
              ></input>
            </div>
            <button onClick={translatePhrase}> Translate</button>
            <div className="form-element">
              <div>Translation: {translation}</div>
            </div>
            <div className="form-element">
              <label for="priority">Priority</label>
              <select
                name="priority"
                value={priority}
                className="form-input"
                id="priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="form-element">
              <label for="difficulty">Difficulty</label>
              <select
                className="form-input"
                name="difficulty"
                value={difficulty}
                id="difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
