import ReactDOM from "react-dom/client";
import "./bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Book from "./Book.jsx";
import AddBook from "./AddBook.jsx";
import Login from "./Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/addBook" element={<AddBook />} />
      </Routes>
    </BrowserRouter>
  </div>
);
