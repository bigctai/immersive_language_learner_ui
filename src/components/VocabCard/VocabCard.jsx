import "./VocabCard.css";

import { useState } from "react";

export default function VocabCard({
  phrase,
  translation,
  difficulty,
  pronunciation,
  priority,
}) {
  const [flipped, setFlipped] = useState(false);
  function flipCard() {
    setFlipped(!flipped);
  }
  return (
    <button className="vocab-card" onClick={flipCard}>
      <div className="card-header">
        <p>Difficulty: {difficulty}</p>
        <p>Priority: {priority}</p>
      </div>
      <div
        id="phrase"
        className={`card-text ${flipped ? "hidden" : "displayed"}`}
      >
        <h2>{phrase}</h2>
      </div>
      <div
        id="translation"
        className={`card-text ${flipped ? "displayed" : "hidden"}`}
      >
        <h2>{translation}</h2>
        <p>{pronunciation}</p>
      </div>
    </button>
  );
}
