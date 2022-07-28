import React from 'react'
import { Link } from 'react-router-dom';

export default function HeaderWelcome() {
  return (
    <nav className="p-3 header navbar navbar-expand-sm sticky-top">
      <div className="headerFlex container-fluid">
        <label className="link1 navbar-brand"><b>Dominion Book Shop®</b></label>
        <Link to="/" className="link2 navbar-brand"><b>Welcome</b></Link>
      </div>
      <div className='header1-right'>
        <span className="navbar-brand" href="#"><b>Welcome, Guest</b></span>
        <div>
          Have an Account?
          <Link className='text-light navbar-brand' to="/login"><b>Login</b></Link>
        </div>
        <div>
          Not Registered?
          <Link className='text-light navbar-brand' to="/signup"><b>Signup</b></Link>
        </div>
      </div>
    </nav>
  )
}