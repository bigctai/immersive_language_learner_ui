import Button from "../Button/Button.jsx";

export default function Form({ onSubmit, children }) {
  return (
    <form className="form-container" onSubmit={onSubmit}>
      {children}
      <Button style="primary" children="Submit"></Button>
    </form>
  );
}
