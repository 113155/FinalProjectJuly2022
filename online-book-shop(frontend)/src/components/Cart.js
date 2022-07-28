import React, { useContext, useEffect, useState } from 'react'
import Footer from './Footer'
import HeaderHome from './HeaderHome'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { CartContext } from './ListCustomer';
import StripeCheckout from "react-stripe-checkout";
import axios from 'axios';


export default function Cart() {
  const { state } = useContext(CartContext);
  const { cart, setCart, handleChange, setShowCart, setShowList } = state;
  const [price, setPrice] = useState();

  useEffect(() => {
    handlePrice()
  })

  const handleRemove = (id) => {
    const arr = cart.filter((item) => item.id !== id);
    setCart(arr)
    handlePrice();
  }

  const handlePrice = () => {
    let result = 0;
    cart.map((item) => (result += item.amount * parseFloat(item.Price)));
    setPrice(result.toFixed(2))
  }

  const backToShop = () => {
    setShowCart(false)
    setShowList(true)
  }

  const checkout = (token) => {
    console.log(token);
    const order = {
      id: token.id,
      userId: JSON.parse(localStorage.getItem('currentUser')).sub,
      date: new Date(),
      booksBought: cart,
      payment: {
        cardNo: token.card.last4,
        exp_month: token.card.exp_month,
        exp_year: token.card.exp_year,
      },
      amountPaid: price,
      email: token.email,
      method: token.type
    }
    axios
      .post("http://localhost:8080/orders", order)
      .then(response => {
        alert("Order successfully submitted!!")
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })

    setCart([])
    localStorage.removeItem("orders")

  }

  return (
    <div>
      <div className='sticky-top bg-secondary'>
        <HeaderHome />
        <div className="row my-4 mx-5">
          <div className="col-md-5">
            <span className='sub-header' style={{ fontSize: "1.7em" }}>Your Cart</span>
          </div>
          <div className="col-md-2" >
            <span className='sub-header'>TOTAL: ${price}</span>
          </div>
          <div className="col-md-2" >
            {/* <span className='sub-header' onClick={checkout} style={{cursor: "pointer"}}>CHECKOUT</span> */}
            <StripeCheckout
              stripeKey='pk_test_51LQLrgHqRBdj0ufapyyXOwZDmAULmxixvbGDT8qf7RfLrUNsQFdgWD4UgRa11fTKgpplZxuLPEvyHchs2tpe7WP700lqSFrMR1'
              token={(token) => checkout(token)}
              amount={price * 100}
              name="Confirm total"
            >
              <span className='sub-header' style={{ cursor: "pointer" }}>CHECKOUT</span>
            </StripeCheckout>

          </div>
          <div className="col-md-3">
            <span style={{ float: "right" }}>
              <label className='sub-header' onClick={backToShop} style={{ cursor: "pointer" }}> ⬅ Back to shopping</label>
            </span>
          </div>
        </div>
      </div>

      <div className='container' style={{ marginBottom: "1000px" }}>
        <div className='d-flex gap-5 flex-wrap'>
          {cart && cart.filter(book => book.isDeleted === 0 || book.isDeleted === "0").map((book, index) =>
            <Card style={{ width: '21rem' }} key={index} >
              <Card.Img style={{ width: '21rem', height: '15rem' }} variant="top" src={require(`../images/${book.BookTitle}.jpeg`)} />
              <Card.Body>
                <Card.Title>{index + 1}. {book.BookTitle} <b className='text-success mx-3'>${book.Price}</b></Card.Title>
                <Card.Text>
                  <ul>
                    <li><b>Publisher</b>: <em>{book.Publisher}</em></li>
                    <li><b>Date Published</b>: <em>{book.DatePublished}</em></li>
                    <li><b>ISBN</b>: {book.ISBN}</li>
                  </ul>
                </Card.Text>
                <div className='row'>
                  <div className='col'>
                    <Button onClick={() => handleRemove(book.id)} variant="secondary">Remove</Button>
                  </div>
                  <div className='col'>
                    <button className='btn btn-outline-secondary' onClick={() => handleChange(book, -1)}>-</button>
                    <button className='btn btn-outline-secondary'>{book.amount}</button>
                    <button className='btn btn-outline-secondary' onClick={() => handleChange(book, 1)}>+</button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
