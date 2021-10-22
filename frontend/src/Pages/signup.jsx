import React, { useState } from "react";
import Axios from "axios"
export default function Signup() {
  const [error, setError] = useState(false);
  const userDetailsInitial = { userName: false, email: false, password: false, confirmPassword: false }
  const [userDetails, setUserDetails] = useState(userDetailsInitial)
  const [timer, setTimer] = useState(false);
  const [verificationUI, setVerificationUI] = useState(false)
  const [otp, setOtp] = useState(false)
  function validEmail(e) {
    if (e.target.length === 0) {
      setUserDetails({ ...userDetails, email: false })
      return
    }
    if (e.target.length !== 0 && e.target.value.includes("@")) {
      if (timer) {
        clearTimeout(timer);
        setTimer(false)
        validate(process.env.REACT_APP_API + "/validate", { mail: e.target.value })
      } else {
        validate(process.env.REACT_APP_API + "/validate", { mail: e.target.value })
      }
    }
    setUserDetails({ ...userDetails, email: e.target.value })
  }
  function validate(link, value) {
    setTimer(setTimeout(() => {
      Axios
        .post(link, value)
        .then(res => {
          if (res.data.error) {
            setError(res.data.error)
          } else {
            console.log(res.data)
            setError(false)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setTimer(false)
        })
    }, 1000));
  }
  function validPassword(e) {
    if (e.target.length === 0) {
      setUserDetails({ ...userDetails, password: false })
      return
    }
    if (e.target.value.length < 8) {
      setError("The password should be minimum of 8 characters.")
    } else {
      setError(false);
    }
    setUserDetails({ ...userDetails, password: e.target.value })
  }
  function validUserName(e) {
    if (e.target.length === 0) {
      setUserDetails({ ...userDetails, userName: false })
      return
    }
    setUserDetails({ ...userDetails, userName: e.target.value })
  }
  function validConfirmPassword(e) {
    if (e.target.length === 0) {
      setUserDetails({ ...userDetails, confirmPassword: false })
      return
    }
    setUserDetails({ ...userDetails, confirmPassword: e.target.value })
  }
  function signUpOnClick() {
    if (!(userDetails.email && userDetails.userName && userDetails.password && userDetails.confirmPassword)) {
      setError("Values should not be empty.\n Please Enter again.")
      setUserDetails(userDetailsInitial)
      return
    }
    setError(false)
    if (timer) {
      clearTimeout(timer);
      setTimer(false)
      // validate(process.env.REACT_APP_API + "/sign-up", userDetails)
      setTimer(setTimeout(() => {
        Axios
          .post(process.env.REACT_APP_API + "/sign-up", userDetails)
          .then(res => {
            if (res.data.error) {
              setError(res.data.error)
            } else {
              setError(false)
              setVerificationUI(true)
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setTimer(false)
          })
      }, 1000));
    } else {
      // validate(process.env.REACT_APP_API + "/sign-up", userDetails)
      setTimer(setTimeout(() => {
        Axios
          .post(process.env.REACT_APP_API + "/sign-up", userDetails)
          .then(res => {
            if (res.data.error) {
              setError(res.data.error)
            } else {
              setError(false)
              setVerificationUI(true)
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setTimer(false)
          })
      }, 1000));
    }
  }
  function verifyOtp() {
    if (!otp) {
      setError("Enter valid otp")
      return
    }
    setError(false)
    if (timer) {
      clearTimeout(timer);
      setTimer(false)
      // validate(process.env.REACT_APP_API + "/sign-up", userDetails)
      setTimer(setTimeout(() => {
        Axios
          .post(process.env.REACT_APP_API + "/verify-otp", { otp: otp })
          .then(res => {
            if (res.data.error) {
              setError(res.data.error)
            } else {
              window.location = "/sign-in"
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setTimer(false)
          })
      }, 1000));
    } else {
      // validate(process.env.REACT_APP_API + "/sign-up", userDetails)
      setTimer(setTimeout(() => {
        Axios
          .post(process.env.REACT_APP_API + "/verify-otp", { otp: otp })
          .then(res => {
            if (res.data.error) {
              setError(res.data.error)
            } else {
              window.location = "/sign-in"
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            setTimer(false)
          })
      }, 1000));
    }
  }
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center h-100 form-container copy-text" id="signup">
        <form className="form-signup justify-content-center">
          <img className="mb-4" src="image/logo.svg" alt="logo.png" width="72" height="72" draggable="false" />
          {
            verificationUI
              ?
              <>
                <h1 className="h3 mb-3 font-weight-normal">Verification</h1>
                {error ? <p className="error-text">{error}</p> : ""}
                <label htmlFor="inputOTP" className="sr-only">OTP</label>
                <input type="text" value={otp ? otp : ""} onChange={(e) => { if (e.target.length === 0) { setOtp(false); return; } setOtp(e.target.value) }} id="inputOTP" className="form-control mt-2" placeholder="OTP" required autoFocus />
                <button className="btn btn-lg btn-primary btn-block mt-1" onClick={verifyOtp} type="button">Verify</button>
              </>
              :
              <>
                <h1 className="h3 mb-3 font-weight-normal">Sign up</h1>
                {error ? <p className="error-text">{error}</p> : ""}
                <label htmlFor="inputUserNamme" className="sr-only">User name</label>
                <input type="text" value={userDetails.userName ? userDetails.userName : ""} onChange={validUserName} id="inputUserName" className="form-control mt-2" placeholder="User name" required autoFocus />
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" value={userDetails.email ? userDetails.email : ""} onChange={validEmail} className="form-control mt-1" placeholder="Email address" required />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" value={userDetails.password ? userDetails.password : ""} onChange={validPassword} className="form-control mt-1" placeholder="Password" required />
                <label htmlFor="inputPassword2" className="sr-only">Confirm Password</label>
                <input type="password" id="inputPassword2" value={userDetails.confirmPassword ? userDetails.confirmPassword : ""} onChange={validConfirmPassword} className="form-control mt-1" placeholder="Confirm Password" required />
                <button className="btn btn-lg btn-primary btn-block mt-1" onClick={signUpOnClick} type="button">Sign up</button>
                <div className="d-flex flex-column mt-3 align-items-center copy-text"><a href="/signin" className="">Sign-in</a><a href="/reset" className="">Reset-password</a></div>
              </>
          }
          <p className="mt-3 mb-2 text-muted copy-text">&copy; 2021</p>
        </form>
      </div>
    </>
  )
}