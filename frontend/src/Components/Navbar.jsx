import React from "react" 
export default function Navbar(){
  function logout(){
    localStorage.removeItem("UserData")
    window.location="/signin"
  }
  return(
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top">
      <div className="container"> 
        <a href="/" className="navbar-brand d-flex align-items-center"><img width="35" height="35" className="mr-2" src="image/logo_light.svg" alt="logo"/>Railway</a> 
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
          <span className="navbar-toggler-icon"></span>
        </button> 
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a href="/" className="nav-link">Search Train</a>
            </li>
            <li className="nav-item">
              <a href="/bookedtickets" className="nav-link">Booked Tickets</a>
            </li>
            <li className="nav-item">
              <a href="#logout" onClick={logout} className="nav-link">Signout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}