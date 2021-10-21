import React from "react";
export default function signup() {
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center h-100 form-container copy-text" id="signup">
        <form className="form-signup justify-content-center">
          <img className="mb-4" src="image/logo.svg" alt="logo.png" width="72" height="72" draggable="false" />
          <h1 className="h3 mb-3 font-weight-normal">Reset password</h1>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control mt-1" placeholder="Email address" required />
          <button className="btn btn-lg btn-primary btn-block mt-1" type="submit">Get OTP</button>
          <div className="d-flex flex-column mt-3 align-items-center copy-text"><a href="/signup" className="">Sign up</a><a href="/signin" className="mt-1">Sign in</a></div>
          <p className="mt-3 mb-2 text-muted copy-text">&copy; 2021</p>
        </form>
      </div>
    </>
  )
}