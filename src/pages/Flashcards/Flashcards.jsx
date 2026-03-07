import VocabCard from "../../components/VocabCard/VocabCard.jsx";
import { useEffect } from "react";
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
    console.log(resp.data.vocab)
    return resp.data.vocab;
  }

  const { data: vocab, status } = useQuery({
    queryKey: ["vocab", id],
    queryFn: () => get_user_data(id),
  });
  return (
    <div className="flashcards-container">
      {vocab && vocab.map((phrase) => (
        <VocabCard phrase={phrase.phrase} translation={phrase.translation} difficulty={phrase.difficulty} priority={phrase.priority} pronunciation={phrase.pronunciation}></VocabCard>
      ))}
    </div>
  );
}
