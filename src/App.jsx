import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import Login from "./pages/Login/Login.jsx";
import VocabBank from "./pages/VocabBank/VocabBank.jsx";
import Home from "./pages/HomePage/HomePage.jsx";
import Flashcards from "./pages/Flashcards/Flashcards.jsx";

function App() {
  let routes = [
    { path: "/", name: "Home" },
    { path: "/vocab_bank", name: "Vocab Bank" },
    { path: "/flashcards", name: "Flashcards" },
    { path: "/login", name: "Login" },
  ];

  return (
    <div className="app">
      <BrowserRouter>
        <NavBar routes={routes}></NavBar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/vocab_bank" element={<VocabBank />}></Route>
          <Route path="/flashcards" element={<Flashcards />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
