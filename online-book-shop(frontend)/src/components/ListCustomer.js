import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import HeaderHome from './HeaderHome'
import axios from 'axios'
import BookCustomer from './BookCustomer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import Cart from './Cart'
import { useNavigate } from 'react-router-dom'

export const CartContext = React.createContext();

export default function ListCustomer() {
    const [books, setBooks] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [searchedBooks, setSearchedBooks] = useState([])
    const [showAllBooks, setShowAllBooks] = useState(true)
    const [showSearchedBooks, setShowSearchedBooks] = useState(false)
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)
    const [showList, setShowList] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            let booksInCache = localStorage.getItem("books")
            if (!booksInCache) {
                console.log("Pulling books from server");
                const books = (await axios.get('http://localhost:8080/books')).data;
                localStorage.setItem("books", JSON.stringify(books));
            } else {
                console.log("Reading books from local storage");
            }
            setBooks(JSON.parse(localStorage.getItem("books")));
        })();
    }, [])

    const searchChanged = (event) => {
        setSearchKey(event.target.value)
        const booksCpy = [...books];
        const searchResult = booksCpy.filter(book =>
            book.BookTitle?.toLowerCase().includes(event.target.value.toLowerCase())
            || book.ISBN?.toLowerCase().includes(event.target.value.toLowerCase())
            || book.Publisher?.toLowerCase().includes(event.target.value.toLowerCase()))
        setSearchedBooks(searchResult)
        setShowAllBooks(false)
        setShowSearchedBooks(true)
    }

    const goToCart = () => {
        setShowCart(true)
        setShowList(false)
    }

    const addToCart = (item) => {
        if (cart.indexOf(item) !== -1) return;
        setCart([...cart, item])
    }

    const handleChange = (item, d) => {
        const ind = cart.indexOf(item);
        const arr = cart;
        arr[ind].amount += d;
        if (arr[ind].amount === 0) arr[ind].amount = 1;
        setCart([...arr])
    }

    const goToOrders = () => {
        navigate("/orders")
    }

    return (
        <CartContext.Provider value={{
            state:
                { cart, setCart, handleChange, setShowCart, setShowList }
        }}>

            {showList && <div>
                <div className='sticky-top bg-secondary'>
                    <HeaderHome />
                    <div className="row my-4 mx-5">
                        <div className="col-md-4">
                            <span className='sub-header' style={{ fontSize: "1.7em" }}>Books in our Collection</span>
                        </div>
                        <div className="col-md-4" >
                            <input
                                className='form-control'
                                placeholder='🔎 Search book'
                                onChange={searchChanged}
                                value={searchKey} />
                        </div>
                        <div className="col-md-1">
                            <span onClick={goToOrders} className='sub-header' style={{ fontSize: "1em", cursor: "pointer" }}>My Orders</span>
                        </div>
                        <div className="col-md-3">
                            <span id="viewCartSpan" style={{ float: "right" }}>
                                <span onClick={goToCart}>
                                    <label className='sub-header pb-2' style={{ fontSize: "1.2em", cursor: "pointer" }}>View Cart</label>
                                    <span className='mx-3 cart'>
                                        <span><FontAwesomeIcon icon={faCartPlus} /></span>
                                        <span>{cart.length}</span>
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className='container' style={{ marginBottom: "1000px" }}>
                    <div className='d-flex gap-5 flex-wrap'>
                        {showAllBooks && books.filter(book => book.isDeleted === 0 || book.isDeleted === "0").map((book, index) =>
                            <BookCustomer
                                key={index}
                                book={book}
                                index={index}
                                addToCart={addToCart}
                            />
                        )}
                        {showSearchedBooks && searchedBooks.filter(book => book.isDeleted === 0 || book.isDeleted === "0").map((book, index) =>
                            <BookCustomer
                                key={index}
                                book={book}
                                index={index}
                                addToCart={addToCart}
                            />
                        )}
                    </div>
                </div>
                <Footer />
            </div>}
            {showCart && <div>
                <Cart />
            </div>}

        </CartContext.Provider>
    )
}