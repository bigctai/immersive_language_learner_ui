import { useEffect, useState } from "react";
import axios from "axios";
import useId from "../hooks/useId";
import VocabCard from "../components/VocabCard/VocabCard.jsx";
import VocabTable from "../components/VocabTable/VocabTable.jsx";
import { AddVocab } from "../components/AddVocab/AddVocab.jsx";
import Button from "../components/Button/Button.jsx";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./VocabBank.css";

export default function VocabBank() {
  const id = useId();
  const nav = useNavigate();
  const [addVocab, setAddVocab] = useState(false);

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

  function displayAddVocab() {
    setAddVocab(!addVocab);
  }

  return (
    <div className="vocab-bank-page">
      <img className="wallpaper" src="/taipei.jpg" alt="background"></img>

      <div className="vocab-bank-content">
        <h1 className="vocab-title">Your Vocabulary Bank</h1>

        <VocabTable vocab={vocab} onAddVocab={displayAddVocab} />

        {addVocab && (
          <AddVocab id={id}>
            <Button style="x-button" onclick={() => setAddVocab(false)}>
              X
            </Button>
          </AddVocab>
        )}

        <div className="vocab-status">
          {status === "pending" && <p>Loading your vocabulary...</p>}
          {status === "error" && <p>Error loading vocabulary</p>}
        </div>
      </div>
    </div>
  );
}
