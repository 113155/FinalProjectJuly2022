import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer'
import HeaderHome from './HeaderHome'

export default function Orders() {
    const [orders, setOrders] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let ordersInCache = localStorage.getItem("orders")
            if (!ordersInCache) {
                console.log("Pulling orders from server");
                const orders = (await axios.get('http://localhost:8080/orders')).data;
                localStorage.setItem("orders", JSON.stringify(orders));
            } else {
                console.log("Reading orders from local storage");
            }
            console.log(JSON.parse(localStorage.getItem("orders")));
            setOrders(JSON.parse(localStorage.getItem("orders")));
        })();
    }, [])

    const backToShop = () => {
        navigate("/list");
    }

    return (
        <div>
            <div className='sticky-top bg-secondary'>
                <HeaderHome />
                <div className="row my-4 mx-5">
                    <div className="col-md-6">
                        <span className='sub-header' style={{ fontSize: "1.7em" }}>Your Orders</span>
                    </div>
                    <div className="col-md-6">
                        <span style={{ float: "right" }}>
                            <label className='sub-header' onClick={backToShop} style={{ cursor: "pointer" }}> ⬅ Back to shopping</label>
                        </span>
                    </div>
                </div>
            </div>

            <div className='container' style={{ marginBottom: "1000px" }}>
                {orders && orders.length > 0 && orders.map((order, index) =>
                    <div key={index} className="mb-5">
                        <h5>{index + 1}. <b>Order Id:</b> {order.id}</h5>
                        <ul>
                            <li><b>Order Date:</b> {order.date}</li>
                            <li><b>User Id:</b> {order.userId}</li>
                            <li><b>Email:</b> {order.email}</li>
                            <b>Payment</b>
                            <li><b>Card No:</b> ends with {order.payment.cardNo}</li>
                            <li><b>Expiration:</b> {order.payment.exp_month}/{order.payment.exp_year}</li>
                            <b>Items</b>
                            {order.booksBought.map((book, index) => 
                                <ul key={index}>
                                    <li><b>{book.BookTitle}</b> - ${book.Price} </li>
                                </ul>
                            )}
                        </ul>
                        <h4>Total: <b> ${order.amountPaid}</b></h4>
                    </div>
                )}
                {orders && orders.length === 0  && <label style={{ fontSize: "2.5em", fontFamily:"sans-serif" }} className="text-secondary" ><b>Your orders will appear here!</b></label>}
            </div>
            <Footer />
        </div>
    )
}
