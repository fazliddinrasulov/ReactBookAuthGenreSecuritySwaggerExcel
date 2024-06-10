import {Link} from "react-router-dom";

const genres = ['Name 1', 'Author Name 2', 'Author Name 3', 'Author Name 4', 'Author Name 5', 'Author Name 6', 'Author Name 7', 'Author Name 8', 'Author Name 9', 'Author Name 10']
const books = ['Name 1', 'Author Name 2', 'Author Name 3', 'Author Name 4', 'Author Name 5', 'Author Name 6', 'Author Name 7', 'Author Name 8', 'Author Name 9', 'Author Name 10']


const Author = () => {
    return <main>
        <div className="bg-light m-4 position-relative">
            <h1 className="text-center mt-4">Genres</h1>
            <button className="addBtn btn btn-info ml-5 mb-3">Add</button>
            <div className="card-container">
                <ul className="card-container">
                    {genres.map((genre, index) => (
                        <Link to="genre" key={index}>
                            <li className="card px-4 py-2 bg-dark text-white">
                                {genre}
                            </li>
                        </Link>
                    ))
                    }
                </ul>
            </div>
        </div>

        <div className="bg-light m-4 position-relative">
            <h1 className="text-center mt-4">Books</h1>
            <button className="addBtn btn btn-info ml-5 mb-3">Add</button>
            <div className="book-container">
                <ul className="book-container">
                    {books.map((book, index) => (
                        <Link to="book" key={index}>
                            <li className="book-card px-4 py-2 bg-dark text-white">
                                {book}
                            </li>
                        </Link>
                    ))
                    }
                </ul>
            </div>
        </div>
    </main>
}

export default Author