import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import useId from "../../hooks/useId.js";
import VocabCard from "../../components/VocabCard/VocabCard.jsx";
import VocabTable from "../../components/VocabTable/VocabTable.jsx";
import { AddVocab } from "../../components/AddVocab/AddVocab.jsx";
import Button from "../../components/Button/Button.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./VocabBank.css";

export default function VocabBank() {
  const id = useId();
  const nav = useNavigate();
  const [addVocab, setAddVocab] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("phrase");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (id === "no_id") {
      nav("/login");
    }
  }, [id, nav]);

  async function get_user_data(id) {
    const resp = await axios.get(
      "http://localhost:8080/user/get_user_data/" + id,
    );
    return resp.data.vocab;
  }

  const { data: vocab, status } = useQuery({
    queryKey: ["vocab", id],
    queryFn: () => get_user_data(id),
  });

  // Filter and sort vocab
  const filteredAndSortedVocab = useMemo(() => {
    if (!vocab) return [];

    let filtered = vocab.filter((item) => {
      const priorityMatch =
        priorityFilter === "all" || item.priority.toString() === priorityFilter;
      const difficultyMatch =
        difficultyFilter === "all" ||
        item.difficulty.toString() === difficultyFilter;
      return priorityMatch && difficultyMatch;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "phrase":
          aVal = a.phrase.toLowerCase();
          bVal = b.phrase.toLowerCase();
          break;
        case "translation":
          aVal = a.translation.toLowerCase();
          bVal = b.translation.toLowerCase();
          break;
        case "priority":
          aVal = parseInt(a.priority);
          bVal = parseInt(b.priority);
          break;
        case "difficulty":
          aVal = parseInt(a.difficulty);
          bVal = parseInt(b.difficulty);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [vocab, priorityFilter, difficultyFilter, sortBy, sortOrder]);

  function displayAddVocab() {
    setAddVocab(!addVocab);
  }

  function handleSort(column) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  return (
    <div className="vocab-bank-page">
      <img className="wallpaper" src="/taiwan_mountains.jpg" alt="Taiwan mountains"></img>
      <div className="vocab-bank-content">
        {/* Filters and Sort Controls */}
        <div className="vocab-controls">
          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="priority-filter">Priority:</label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="difficulty-filter">Difficulty:</label>
              <select
                id="difficulty-filter"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          <div className="sort-section">
            <span className="sort-label">Sort by:</span>
            <button
              className={`sort-button ${sortBy === "phrase" ? "active" : ""}`}
              onClick={() => handleSort("phrase")}
            >
              Phrase {sortBy === "phrase" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`sort-button ${sortBy === "translation" ? "active" : ""}`}
              onClick={() => handleSort("translation")}
            >
              Translation{" "}
              {sortBy === "translation" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`sort-button ${sortBy === "priority" ? "active" : ""}`}
              onClick={() => handleSort("priority")}
            >
              Priority{" "}
              {sortBy === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`sort-button ${sortBy === "difficulty" ? "active" : ""}`}
              onClick={() => handleSort("difficulty")}
            >
              Difficulty{" "}
              {sortBy === "difficulty" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        <VocabTable
          vocab={filteredAndSortedVocab}
          status={status}
          onAddVocab={displayAddVocab}
        />
      </div>

      {addVocab && (
        <div className="modal-overlay">
          <AddVocab id={id}>
            <Button style="x-button" onclick={() => setAddVocab(false)}>
              X
            </Button>
          </AddVocab>
        </div>
      )}
    </div>
  );
}
