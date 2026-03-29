import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useId from "../../hooks/useId.js";
import Button from "../../components/Button/Button.jsx";
import "./Conversation.css";

const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8080";


export default function Conversation() {
  const id = useId();
  const nav = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (id === "no_id") {
      nav("/login");
    }
  }, [id, nav]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function beginConversation() {
    const response = await axios.get(
      `${backendUrl}/conversation/begin_conversation`,
      {
        params:
          id && id !== "no_id" ? { user_id: id } : undefined,
      },
    );
    return response.data;
  }

  const {
    data: beginData,
    status: beginStatus,
    error: beginError,
    isError: beginIsError,
  } = useQuery({
    queryKey: ["conversation", "begin", id],
    queryFn: beginConversation,
    enabled: Boolean(id && id !== "no_id"),
  });

  useEffect(() => {
    if (!beginData || beginStatus !== "success") return;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{ role: "assistant", beginData }];
    });
  }, [beginData, beginStatus]);

  async function sendMessage(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !id || id === "no_id" || sending) return;

    setSendError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setSending(true);

    try {
      const body = {
        user_id: parseInt(id, 10),
        message: trimmed,
      };

      const response = await axios.post(
        `${backendUrl}/conversation/send_message`,
        body,
      );

      const reply = response.data;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply || "…" },
      ]);
    } catch (err) {
      setSendError(
        err.response?.data?.message ||
          err.message ||
          "Could not reach the server.",
      );
      setMessages((prev) => prev.slice(0, -1));
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  return (
    <div className="conversation-page">
      <div className="conversation-panel">
        <header className="conversation-header">
          <h1 className="conversation-title">Conversation</h1>
          <p className="conversation-subtitle">
            Practice with our specialized assistant!
          </p>
        </header>

        <div className="conversation-messages" role="log" aria-live="polite">
          {beginStatus === "pending" && (
            <p className="conversation-status">Starting conversation…</p>
          )}
          {beginIsError && (
            <p className="conversation-error">
              Could not start conversation:{" "}
              {beginError?.message || "Unknown error"}
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`conversation-bubble conversation-bubble--${m.role}`}
            >
              <span className="conversation-bubble-label">
                {m.role === "user" ? "You" : "Assistant"}
              </span>
              <p className="conversation-bubble-text">{m.text}</p>
            </div>
          ))}
          {sending && (
            <div className="conversation-bubble conversation-bubble--assistant conversation-bubble--typing">
              <span className="conversation-bubble-label">Assistant</span>
              <p className="conversation-bubble-text">…</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {sendError && (
          <p className="conversation-inline-error">{sendError}</p>
        )}

        <form className="conversation-form" onSubmit={sendMessage}>
          <textarea
            className="conversation-input"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            disabled={sending || beginStatus !== "success"}
            aria-label="Message"
          />
          <Button type="submit" style="primary">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
