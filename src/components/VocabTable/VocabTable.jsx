import Button from "../Button/Button.jsx";
import "./VocabTable.css";

export default function VocabTable({ vocab, onAddVocab }) {
  return (
    <table className="vocab-table">
      <thead>
        <tr>
          <th className="word">Word</th>
          <th className="translation">Translation</th>
          <th>Priority</th>
          <th>Difficulty</th>
        </tr>
      </thead>
      <tbody>
        {vocab &&
          vocab.map((word, index) => (
            <tr key={index}>
              <td>{word.phrase}</td>
              <td>{word.translation}</td>
              <td>{word.priority}</td>
              <td>{word.difficulty}</td>
            </tr>
          ))}
        <tr>
          <td colSpan="4">
            <Button onclick={onAddVocab} style="primary">
              Add New Word
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
