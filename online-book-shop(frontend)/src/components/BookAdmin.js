import React, { Component } from 'react'

export default class BookAdmin extends Component {
    state = {
        showEditInputs: false,
        isbn: "",
        title: "",
        publisher: "",
        datePublished: "",
        price: 0.00,
        quantity: 0,
    }

    inputChanged = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    editBook = () => {
        this.setState({ showEditInputs: !this.state.showEditInputs })
    }
    save = () => {
        let { isbn, title, publisher, datePublished, price, quantity } = this.state;
        let { ISBN, BookTitle, Publisher, DatePublished, Price, Quantity, id, isDeleted } = this.props.book;
        this.setState({ showEditInputs: false })

        let book = {}
        isbn ? book.ISBN = isbn : book.ISBN = ISBN;
        title ? book.BookTitle = title : book.BookTitle = BookTitle;
        publisher ? book.Publisher = publisher : book.Publisher = Publisher;
        datePublished ? book.DatePublished = datePublished : book.DatePublished = DatePublished;
        price ? book.Price = price : book.Price = Price;
        quantity ? book.Quantity = quantity : book.Quantity = Quantity;
        book.isDeleted = isDeleted;
        book.id = id;

        this.props.saveBook(book, id)
    }
    render() {
        const { book, index, deleteBook } = this.props;
        return (
            <>
                <tr>
                    <th scope="row">{index + 1}.</th>
                    <td>{book.ISBN}</td>
                    <td>{book.BookTitle}</td>
                    <td>{book.Publisher}</td>
                    <td>{book.DatePublished}</td>
                    <td>{book.Price}</td>
                    <td>{book.Quantity}</td>
                    <td><button className='btn btn-outline-secondary btn-sm' onClick={this.editBook}>EDIT</button></td>
                    <td><button className='btn btn-outline-secondary btn-sm' onClick={() => deleteBook(book.id)}>DELETE</button></td>
                </tr>
                {this.state.showEditInputs && <tr>
                    <th scope="row"></th>
                    <td><input
                        className='form-control form-control-sm'
                        type="text"
                        name='isbn'
                        onChange={(event) => this.inputChanged(event)}
                        value={this.state.isbn}
                        placeholder="ISBN" /></td>
                    <td><input
                        className='form-control form-control-sm'
                        type="text"
                        name='title'
                        onChange={(event) => this.inputChanged(event)}
                        value={this.state.title}
                        placeholder="Book Title" /></td>
                    <td><input
                        className='form-control form-control-sm'
                        type="text"
                        name='publisher'
                        onChange={(event) => this.inputChanged(event)}
                        value={this.state.publisher}
                        placeholder="Publisher" /></td>
                    <td><input
                        className='form-control form-control-sm'
                        type="date"
                        name='datePublished'
                        onChange={(event) => this.inputChanged(event)}
                        value={this.state.datePublished}
                        placeholder="Date Published" /></td>
                    <td><input
                        className='form-control form-control-sm'
                        type="number"
                        name='price'
                        onChange={(event) => this.inputChanged(event)}
                        value={this.state.price} step=".01" min="0" /></td>
                    <td><input
                        className='form-control form-control-sm'
                        type="number"
                        name='quantity'
                        onChange={(event) => this.inputChanged(event)}
                        value={this.state.quantity} step="1" min="0" /></td>
                    <td><button className='btn btn-outline-secondary btn-sm' onClick={this.save}>SAVE</button></td>
                </tr>}
            </>
        )
    }
}

