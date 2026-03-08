import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../Button/Button.jsx";
import "./BatchAddVocab.css";

const ADD_VOCAB_URL = "http://localhost:8080/user/add_vocab";

/**
 * Parse CSV text into rows. Format per line: phrase,translation[,pronunciation,priority,difficulty]
 * Optional header row (line starting with "phrase" or "word") is skipped.
 */
function parseBatchInput(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith("phrase") || lower.startsWith("word")) continue;
    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 2) continue;
    rows.push({
      phrase: parts[0] || "",
      translation: parts[1] || "",
      pronunciation: parts[2] ?? "",
      priority: Math.min(5, Math.max(1, parseInt(parts[3], 10) || 1)),
      difficulty: Math.min(5, Math.max(1, parseInt(parts[4], 10) || 1)),
    });
  }
  return rows;
}

export function BatchAddVocab({ id, onClose }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setInput(ev.target?.result ?? "");
    reader.readAsText(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) {
      setStatus({ error: "Paste CSV text or choose a file." });
      return;
    }

    const rows = parseBatchInput(text);
    if (rows.length === 0) {
      setStatus({ error: "No valid rows. Use format: phrase,translation (one per line)." });
      return;
    }

    setUploading(true);
    setStatus(null);

    let added = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await axios.post(ADD_VOCAB_URL, {
          user_id: parseInt(id),
          phrase: String(row.phrase),
          translation: String(row.translation),
          priority: row.priority,
          pronunciation: String(row.pronunciation),
          difficulty: row.difficulty,
        });
        added++;
      } catch (err) {
        errors.push(`Row ${i + 1}: ${row.phrase} – ${err.message || "Failed"}`);
      }
    }

    setUploading(false);
    setStatus({
      added,
      total: rows.length,
      errors: errors.length > 0 ? errors.slice(0, 5) : null,
    });

    if (added > 0) {
      queryClient.invalidateQueries({ queryKey: ["vocab", id] });
    }
  }

  return (
    <div className="batch-add-vocab-container">
      <div className="batch-add-vocab-popup">
        <div className="batch-add-vocab-exit">{onClose}</div>
        <h3 className="batch-add-vocab-title">Batch upload</h3>
        <p className="batch-add-vocab-hint">
          One entry per line: <code>phrase,translation</code> or{" "}
          <code>phrase,translation,pronunciation,priority,difficulty</code>
        </p>

        <form onSubmit={handleSubmit} className="batch-add-vocab-form">
          <div className="batch-add-vocab-field">
            <label htmlFor="batch-csv">Paste CSV or upload file</label>
            <textarea
              id="batch-csv"
              className="batch-add-vocab-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"你好,hello\n謝謝,thank you"}
              rows={8}
              disabled={uploading}
            />
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="batch-add-vocab-file"
            />
          </div>

          {status?.error && (
            <p className="batch-add-vocab-message batch-add-vocab-error">{status.error}</p>
          )}
          {status?.added != null && (
            <div className="batch-add-vocab-message batch-add-vocab-success">
              <p>Added {status.added} of {status.total} entries.</p>
              {status.errors?.length > 0 && (
                <ul className="batch-add-vocab-errors">
                  {status.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                  {status.errors.length >= 5 && <li>…and more</li>}
                </ul>
              )}
            </div>
          )}

          <div className="batch-add-vocab-actions">
            <Button type="submit" style="primary" disabled={uploading}>
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
