import VocabCard from "../../components/VocabCard/VocabCard.jsx";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useId from "../../hooks/useId.js";
import "./Flashcards.css";

export default function Flashcards() {
  const id = useId();
  const nav = useNavigate();

  useEffect(() => {
    if (id === "no_id") {
      nav("/login");
    }
  }, [id, nav]);

  async function get_user_data(id) {
    const resp = await axios.get(
      "http://localhost:8080/user/get_user_data/" + id,
    );
    console.log(resp.data.vocab);
    return resp.data.vocab;
  }

  const { data: vocab, status } = useQuery({
    queryKey: ["vocab", id],
    queryFn: () => get_user_data(id),
  });

  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [order, setOrder] = useState([]);

  const filteredVocab = useMemo(() => {
    if (!vocab) return [];
    return vocab.filter((item) => {
      if (priorityFilter === "all") return true;
      return String(item.priority) === priorityFilter;
    });
  }, [vocab, priorityFilter]);

  useEffect(() => {
    if (!filteredVocab.length) {
      setOrder([]);
      setCurrentIndex(0);
      return;
    }
    const indices = filteredVocab.map((_, idx) => idx);
    setOrder(indices);
    setCurrentIndex(0);
  }, [filteredVocab]);

  const hasCards = order.length > 0 && filteredVocab.length > 0;
  const safeIndex =
    order.length === 0 ? 0 : Math.min(currentIndex, order.length - 1);
  const currentWord =
    hasCards && filteredVocab.length > 0 ? filteredVocab[order[safeIndex]] : null;

  function handleNext() {
    if (!hasCards) return;
    setCurrentIndex((prev) => (prev + 1) % order.length);
  }

  function handlePrev() {
    if (!hasCards) return;
    setCurrentIndex((prev) => (prev - 1 + order.length) % order.length);
  }

  function handleShuffle() {
    if (!hasCards) return;
    const shuffled = [...order];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
    setCurrentIndex(0);
  }

  return (
    <div className="flashcards-page">
      <div className="flashcards-controls">
        <div className="flashcards-filter">
          <label htmlFor="flashcards-priority">Priority:</label>
          <select
            id="flashcards-priority"
            value={priorityFilter}
            className="priority-filter"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button
          type="button"
          className="flashcards-shuffle"
          onClick={handleShuffle}
          disabled={!hasCards}
        >
          Shuffle
        </button>
      </div>

      <div className="flashcards-viewer">
        <button
          type="button"
          className="flashcards-arrow"
          onClick={handlePrev}
          disabled={!hasCards}
        >
          ‹
        </button>

        <div className="flashcards-card-area">
          {status === "pending" && <p>Loading your flashcards...</p>}
          {status === "error" && <p>Error loading flashcards.</p>}
          {status === "success" && !filteredVocab.length && (
            <p>No cards match this priority filter.</p>
          )}
          {status === "success" && currentWord && (
            <VocabCard
              phrase={currentWord.phrase}
              translation={currentWord.translation}
              difficulty={currentWord.difficulty}
              priority={currentWord.priority}
              pronunciation={currentWord.pronunciation}
            />
          )}
          {status === "success" && filteredVocab.length > 0 && (
            <p className="flashcards-position">
              {safeIndex + 1} / {filteredVocab.length}
            </p>
          )}
        </div>

        <button
          type="button"
          className="flashcards-arrow"
          onClick={handleNext}
          disabled={!hasCards}
        >
          ›
        </button>
      </div>
    </div>
  );
}
