
import "./VocabTable.css";

export default function VocabTable({ vocab, rowClick, status }) {

  return (
    <table className="vocab-table">
      <thead>
        <tr>
          <th className="word">Word</th>
          <th className="translation">Translation</th>
          <th className="pronunciation">Pronunciation</th>
          <th>Priority</th>
          <th>Difficulty</th>
        </tr>
      </thead>
      <tbody>
      {(status === "pending") &&
        <td colSpan="5">Loading your vocabulary...</td>}
      {(status === "error") &&
        <td colSpan="5">Error loading vocabulary</td>
      }
      {(status === "success" && vocab.length === 0) &&
        <td colSpan="5">No vocabulary found</td>
      }
      {(status === "success" && vocab.length > 0) &&
          vocab.map((word, index) => (
            <tr onClick={() => rowClick(word)} key={index}>
              <td>{word.phrase}</td>
              <td>{word.translation}</td>
              <td>{word.pronunciation}</td>
              <td>{word.priority}</td>
              <td>{word.difficulty}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
