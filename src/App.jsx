import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenre] = useState([]);
  const [books, setBooks] = useState([]);
  const [authorId, setAuthorId] = useState(null);
  const [genreId, setGenreId] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/refresh", {
        headers: {
          Authorization: localStorage.getItem("refresh-token"),
        },
      });
      const data = resp.data;
      localStorage.setItem("token", data);
    } catch (err) {
      if (err.response.status === 504) {
        navigate("/login");
      }
    }
  };

  const handleAddAuthorSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8080/api/author",
        { name: e.target[0].value },
        {
          headers: {
            Authorization: localStorage.getItem("refresh-token"),
          },
        }
      )
      .then((resp) => {
        fetchAuthors();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAddGenreSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8080/api/genre",
        { name: e.target[0].value },
        {
          headers: {
            Authorization: localStorage.getItem("refresh-token"),
          },
        }
      )
      .then((resp) => {
        fetchGenres();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchAuthors = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/author", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await resp.data;
      setAuthors(data);
    } catch (err) {
      if (err.response.status === 504) {
        refreshToken();
      }
    }
  };
  const fetchGenres = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/genre", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await resp.data;
      setGenre(data);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchBooks = async () => {
    try {
      const resp = await axios.get("http://localhost:8080/api/book", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await resp.data;
      setBooks(data);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchBooksByAuthor = async (id) => {
    setAuthorId(id);
    try {
      const resp = await axios.get("http://localhost:8080/api/book/author/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = resp.data;
      setBooks(data);
      const temp = data.map((item) => item.genre);
      let uniqueGenres = Array.from(
        new Map(temp.map((item) => [item.id, item])).values()
      );
      uniqueGenres.sort((a, b) => a.name.localeCompare(b.name));
      setGenre(uniqueGenres);
      setGenreId(null);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchBooksByGenreId = async (genreId) => {
    setGenreId(genreId);
    try {
      const resp = await axios.get(
        "http://localhost:8080/api/book/genre/" + genreId + "," + authorId,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await resp.data;
      setBooks(data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/book/export", {
        responseType: "blob", // Important to specify response type as blob
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      // Create a link element
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "books.xlsx"); // Specify the filename
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleImportSubmit = () => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:8080/api/book/import", formData, {
        headers: {
          contentType: "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
      .catch((err) => console.log(err));
  };

  const resetAuthor = () => {
    setAuthorId(null);
    fetchBooks();
    fetchGenres();
  };

  const resetGenres = () => {
    setGenreId(null);
    console.log(authorId);
    if (authorId === null) {
      fetchBooks();
    } else {
      fetchBooksByAuthor(authorId);
    }
    fetchGenres();
  };

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    fetchBooks();
  }, []);

  return (
    <main>
      <div className="bg-light m-4 position-relative">
        <h1 className="text-center mt-4">Authors</h1>
        <div className="card-container">
          <ul className="card-container">
            <li
              className={`card px-4 py-2 ${authorId == null && "bg-dark text-white"}`}
              onClick={() => resetAuthor()}
            >
              All
            </li>
            {authors.map((author) => (
              <li
                className={`card px-4 py-2 ${
                  author.id === authorId && "bg-dark text-white"
                }`}
                key={author.id}
                onClick={() => fetchBooksByAuthor(author.id)}
              >
                {author.name}
              </li>
            ))}
            <li>
              <form onSubmit={(e) => handleAddAuthorSubmit(e)}>
                <div className="d-flex">
                  <input type="text" name="name" />
                  <button className="btn btn-primary">add author</button>
                </div>
              </form>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-light m-4 position-relative">
        <h1 className="text-center mt-4">Genres</h1>
        <div className="card-container">
          <ul className="card-container">
            <li
              className={`card px-4 py-2 ${genreId == null && "bg-dark text-white"}`}
              onClick={() => resetGenres()}
            >
              All
            </li>

            {genres.map((genre) => (
              <li
                className={`card px-4 py-2 ${
                  genre.id === genreId && "bg-dark text-white"
                }`}
                key={genre.id}
                onClick={() => fetchBooksByGenreId(genre.id)}
              >
                {genre.name}
              </li>
            ))}
            <li>
              <form onSubmit={(e) => handleAddGenreSubmit(e)}>
                <div className="d-flex">
                  <input type="text" name="name" />
                  <button className="btn btn-primary">add genre</button>
                </div>
              </form>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-light m-4 position-relative">
        <h1 className="text-center m-4">Books</h1>
        <div className="d-flex">
          <Link to="addBook" className="addBtn btn btn-info ml-5 mb-3">
            Add Book +
          </Link>
          <button onClick={handleExport} className="exportBtn btn btn-dark">
            export as excel
          </button>

          <form className="importForm" onSubmit={handleImportSubmit}>
            <input
              type="file"
              style={{ width: "100px" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button className="btn btn-dark">import to db</button>
          </form>
        </div>
        <ul className="book-card-container">
          {books.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id}>
              <li className="book-card text-dark ">
                <img
                  src={`http://localhost:8080/api/book/attachment/` + book.id}
                  alt="Card Image"
                />
                <div className="book-card-content">
                  <div className="book-card-title">{book.title}</div>
                  <div className="book-card-text">
                    Fusce auctor maximus augue, sit amet mattis purus vestibulum eget.
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default App;
