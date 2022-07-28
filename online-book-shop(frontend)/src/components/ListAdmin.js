import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import HeaderHome from './HeaderHome'
import axios from 'axios'
import BookAdmin from './BookAdmin'


export default class ListAdmin extends Component {
    state = {
        books: [],
        searchKey: "",
        searchedBooks: [],
        showAllBooks: true,
        showSearchedBooks: false
    }

    async componentDidMount() {
        let booksInCache = localStorage.getItem("books")
        if (!booksInCache) {
            console.log("Pulling from server");
            const books = (await axios.get('http://localhost:8080/books')).data;
            localStorage.setItem("books", JSON.stringify(books));
        } else {
            console.log("Reading from local storage");
        }
        this.setState({ books: JSON.parse(localStorage.getItem("books")) });
    }

    searchChanged = (event) => {
        this.setState({ searchKey: event.target.value })
        const booksCpy = [...this.state.books];
        const searchResult = booksCpy.filter(book =>
            book.BookTitle?.toLowerCase().includes(event.target.value.toLowerCase())
            || book.ISBN?.toLowerCase().includes(event.target.value.toLowerCase())
            || book.Publisher?.toLowerCase().includes(event.target.value.toLowerCase()))
        this.setState({ searchedBooks: searchResult })
        this.setState({ showAllBooks: false })
        this.setState({ showSearchedBooks: true })
    }

    saveBook = (book, bookId) => {
        (async function () {
            await axios.put(`http://localhost:8080/books/update/${bookId}`, book)
        })();

        const booksCpy = [...this.state.books];
        const bookToUpdate = booksCpy.find(book => book.id === bookId)
        bookToUpdate.ISBN = book.ISBN;
        bookToUpdate.BookTitle = book.BookTitle;
        bookToUpdate.Publisher = book.Publisher;
        bookToUpdate.DatePublished = book.DatePublished;
        bookToUpdate.Price = book.Price;
        bookToUpdate.Quantity = book.Quantity;
        this.setState({ books: booksCpy })

        localStorage.removeItem("books");

    }
    deleteBook = (bookId) => {
        (async function () {
            await axios.put(`http://localhost:8080/books/delete/${bookId}`, { isDeleted: 1 })
        })();

        const booksCpy = [...this.state.books];
        const bookToDelete = booksCpy.find(book => book.id === bookId);
        bookToDelete.isDeleted = 1;
        this.setState({ books: booksCpy });

        localStorage.removeItem("books");
    }

    render() {
        return (
            <div>
                <HeaderHome />
                <div className='container' style={{ marginBottom: "1000px" }}>
                    <div className="row my-4">
                        <div className="col-md-4">
                            <span style={{ fontSize: "1.7em" }}>Books in our Collection</span>
                        </div>
                        <div className="col-md-5" >
                            <input
                                className='form-control'
                                placeholder='🔎 Search book'
                                onChange={this.searchChanged}
                                value={this.state.searchKey} />
                        </div>
                        <div className="col-md-3">
                            <span id="addBookSpan" style={{ float: "right" }}>
                                <Link to="/newbook">
                                    <button className="btn btn-outline-warning btn-lg">Add New Book</button>
                                </Link>
                            </span>
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ISBN</th>
                                <th scope="col">Book Title</th>
                                <th scope="col">Publisher</th>
                                <th scope="col">Date Published</th>
                                <th scope="col">Price (USD)</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.showAllBooks && this.state.books.filter(book => book.isDeleted === 0 || book.isDeleted === "0").map((book, index) =>
                                <BookAdmin
                                    key={index}
                                    book={book}
                                    index={index}
                                    saveBook={this.saveBook}
                                    deleteBook={this.deleteBook}
                                />
                            )}
                            {this.state.showSearchedBooks && this.state.searchedBooks.filter(book => book.isDeleted === 0 || book.isDeleted === "0").map((book, index) =>
                                <BookAdmin
                                    key={index}
                                    book={book}
                                    index={index}
                                    saveBook={this.saveBook}
                                    deleteBook={this.deleteBook}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
                <Footer />
            </div>
        )
    }
}

