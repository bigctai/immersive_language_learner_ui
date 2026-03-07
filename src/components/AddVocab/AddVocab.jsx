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
  const [pronunciation, setPronunciation] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await axios
      .post("http://localhost:8080/user/add_vocab", {
        user_id: parseInt(id),
        phrase: phrase.toString(),
        translation: translation.toString(),
        priority: parseInt(priority),
        pronunciation: pronunciation.toString(),
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
    setTranslation(resp.chinese);
    setPronunciation(resp.pinyin);
  }
  return (
    <div className="add-vocab-container">
      {id && (
        <div className="popup-container">
          <div className="exit-popup">{children}</div>
          <Form onSubmit={handleSubmit}>
            <div className="phrase-container">
              <div className="phrase-component">
                <label htmlFor="phrase">Phrase</label>
                <textarea
                  type="text"
                  className="translation-text-area"
                  name="phrase"
                  id="phrase"
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="add vocab"
                  required
                />
              </div>
              {/* use styled button and show translation next to it */}
              <Button
                type="button"
                style="secondary"
                size="small"
                onclick={translatePhrase}
              >
                go!
              </Button>
              <div className="translation-component">
                <div>Translation</div>
                <div className="translated">
                  <div className="translation-text">{translation}</div>
                  <div className="pronunciation">{pronunciation}</div>
                </div>
              </div>
            </div>
            <div className="form-element">
              <label htmlFor="priority">Priority: {priority}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={priority}
                className="slider"
                id="priority"
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
            <div className="form-element">
              <label htmlFor="difficulty">Difficulty: {difficulty}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={difficulty}
                className="slider"
                id="difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              />
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
