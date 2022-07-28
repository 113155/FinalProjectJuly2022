import { React } from 'react'
import { Link } from 'react-router-dom';
import { logoutCognitoUser } from '../UserPool';

export default function HeaderHome() {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  const signOut = () => {
    if (localStorage.getItem("currentUser")) {
      localStorage.removeItem("currentUser")
    }
    logoutCognitoUser()
    window.location = "/"
  }

  return (
    <nav className="p-3 header navbar navbar-expand-sm sticky-top">
      <div className="headerFlex container-fluid">
        <label className="link1 navbar-brand"><b>Dominion Book Shop®</b></label>
        <Link to="/home" className="link2 navbar-brand"><b>Home</b></Link>
        <Link to="/list" className="link2 navbar-brand"><b>Book List</b></Link>
      </div>
      <div className='header1-right'>
        <span className="navbar-brand link3"><b>Welcome, {currentUser ? currentUser.given_name : "Guest"}</b></span>
        <Link to="/">
          <button
            className='btn btn-warning' onClick={signOut} style={{ color: "rgb(148, 85, 2)" }}><b>SIGN OUT</b>
          </button>
        </Link>
      </div>
    </nav>
  )
}
