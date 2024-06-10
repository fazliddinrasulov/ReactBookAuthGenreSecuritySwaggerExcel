import { Link, useNavigate, useParams } from "react-router-dom";
import "./book.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  const fetchBookDetails = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/book/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await resp.data;
      console.log(resp.data);
      setBook(data);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteBook = async (id) => {
    console.log(id);
    try {
      axios
        .delete(`http://localhost:8080/api/book/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then(() => navigate("/"));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, []);

  return (
    <div className="book-main">
      <div className="book-card1 position-relative">
        <Link to="/" className="backBtn btn btn-info position-absolute ">
          back
        </Link>
        <div className="book-details1">
          <div className="book-title1">{book?.title}</div>
          <div className="book-info1">Author: {book?.author.name}</div>
          <div className="book-info1">Genre: {book?.genre.name}</div>
          <div className="book-description1">
            Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            euismod tincidunt ex, nec vehicula ex cursus et.
          </div>
          <div>
            <button
              onClick={() => {
                deleteBook(book.id);
              }}
              className="btn btn-danger mx-3"
            >
              delete
            </button>
          </div>
        </div>
        <div className="book-image1">
          <img
            src={`http://localhost:8080/api/book/attachment/` + book?.id}
            alt="Book Cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Book;
