import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddBook() {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [selectedGenreId, setSelectedGenreId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("authorId", selectedAuthorId);
    formData.append("genreId", selectedGenreId);
    formData.append("file", file);
    axios
      .post("http://localhost:8080/api/book", formData, {
        headers: {
          contentType: "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((resp) => {
        console.log(resp.data);
        navigate("/");
      })
      .catch((err) => console.log(err));
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
      console.log(err);
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
      setGenres(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center">Add Book</h2>
      <div className="d-flex justify-content-center align-items-center">
        <form className="w-50" onSubmit={handleSubmit}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className="form-group">
            <label className="form-row" htmlFor="title">
              Title:
            </label>
            <input
              className="form-control"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <select
              className="form-control"
              id="author"
              value={selectedAuthorId}
              onChange={(e) => setSelectedAuthorId(e.target.value)}
              required
            >
              <option value="" defaultValue disabled>
                Select Author
              </option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select
              className="form-control"
              id="genre"
              value={selectedGenreId}
              onChange={(e) => setSelectedGenreId(e.target.value)}
              required
            >
              <option value="" defaultValue disabled>
                Select Genre
              </option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-info btn-block " type="submit">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
