import "./Button.css";

export default function Button({ children, onclick, type, style }) {
  return (
    <button className={`btn btn-${style}`} type={type} onClick={onclick}>
      {children}
    </button>
  );
}
