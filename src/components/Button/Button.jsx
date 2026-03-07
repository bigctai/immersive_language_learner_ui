import "./Button.css";

export default function Button({ children, onclick, type, style, size = "" }) {
  return (
    <button
      className={`btn btn-${style} ${size}`}
      type={type}
      onClick={onclick}
    >
      {children}
    </button>
  );
}
