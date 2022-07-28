import React from 'react'
import Footer from './Footer'
import HeaderWelcome from './HeaderWelcome'

export default function Welcome() {
    return (
        <div>
            <HeaderWelcome />
            <div className='bodyContainer'>
                <h2 className="my-4 text-center">Welcome to Dominion Books Rental Services<sup>&reg;</sup></h2>
                <hr></hr>
                <img id="banner" src={require("../images/banner_gold.jpeg")} alt="DominionBooks" />
                <div className="mt-3">
                    <p>
                        We are a top flight, fully-digital Book Shop. Find out more about us and learn how we can
                        serve you with a widest variety of books and lots of other digital content, all for your education
                        as well as your entertainment. You can also browse our <a>List</a>, of books and be amazed at
                        all that we have in stock for you, your family and friends!!!!!
                    </p>
                    <p>
                        We are a top flight, fully-digital Book Shop. Find out more about us and learn how we can
                        serve you with a widest variety of books and lots of other digital content, all for your education
                        as well as your entertainment. You can also browse our <a>List</a>, of books and be amazed at
                        all that we have in stock for you, your family and friends!!!!!
                    </p>
                    <p>
                        We are a top flight, fully-digital Book Shop. Find out more about us and learn how we can
                        serve you with a widest variety of books and lots of other digital content, all for your education
                        as well as your entertainment. You can also browse our <a>List</a>, of books and be amazed at
                        all that we have in stock for you, your family and friends!!!!!
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
