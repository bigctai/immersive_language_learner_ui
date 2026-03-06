import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="landing-container">
      <img className="wallpaper" src="/taipei.jpg" alt="Taiwan backdrop"></img>

      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">ㄈㄢtasㄊㄧc Chinese</h1>
          <p className="hero-subtitle">
            Master the language of Taiwan by building a vocabulary catered to
            you!
          </p>

          <button className="cta-button" onClick={() => nav("/vocab-bank")}>
            Start Learning
          </button>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>Build Vocabulary</h3>
            <p>
              Create and organize your personal vocabulary bank with
              translations and difficulty levels
            </p>
          </div>

          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>
              Monitor your learning with priority levels and difficulty ratings
            </p>
          </div>

          <div className="feature-card">
            <h3>Immersive Learning</h3>
            <p>
              Hold realistic conversations that utilize the vocabulary you are
              targeting
            </p>
          </div>
        </div>

        {/* <div className="cta-section">
          <h2>Ready to Begin Your Journey?</h2>
          <button
            className="secondary-cta-button"
            onClick={() => nav("/vocab-bank")}
          >
            Open Vocabulary Bank
          </button>
        </div> */}
      </div>
    </div>
  );
}
