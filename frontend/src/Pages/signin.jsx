import React,{useState,useEffect} from "react";
import Axios from "axios"
import Verify from "../verify";
import Loader from "../Components/Loader";
export default function Signup() {
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(false);
  const userDetailsInitial = {email: false, password: false}
  const [userDetails, setUserDetails] = useState(userDetailsInitial)
  const [loader,setLoader]=useState(true)
  useEffect(()=>{
    setLoader(true)
    async function tempVerify(){
      const verify=new Verify();  
      setLoader(await verify.unProtectedVerification())
    }
    tempVerify()
  },[])  
  function validEmail(e) {
    if (e.target.length === 0) {
      setUserDetails({ ...userDetails, email: false })
      return
    }
    if (e.target.length !== 0 && e.target.value.includes("@")) {
      const tempFunction=(res)=>{
        if (res.data.error) {
          if(res.data.error==="Mail is not avaiable..."){
            setError(false)
            return
          }
          setError(res.data.error)
        } else { 
          setError("Invalid Mail id")
        }
      }
      if (timer) {
        clearTimeout(timer);
        setTimer(false)
        validate(process.env.REACT_APP_API + "/validate", { mail: e.target.value },tempFunction)
      } else {
        validate(process.env.REACT_APP_API + "/validate", { mail: e.target.value },tempFunction)
      }
    }
    setUserDetails({ ...userDetails, email: e.target.value })
  }
  function validate(link, value, callBack) {
    setTimer(setTimeout(() => {
      Axios
        .post(link, value)
        .then(res => {
          callBack(res)
        })
        .catch(err => {
          console.log(err)
        }) 
        .finally(()=>{
          setLoader(false)
        })
    }, 1000));
  }
  function validPassword(e) {
    if (e.target.length === 0) {
      setUserDetails({ ...userDetails, password: false })
      return
    } 
    setUserDetails({ ...userDetails, password: e.target.value })
  }
  function signInOnClick(){ 
    setLoader(true)
    if (!(userDetails.email && userDetails.password)) {
      setError("Values should not be empty.\n Please Enter again.") 
      return
    } 
    setError(false)
    const tempFunction=(res)=>{
      if (res.data.error) { 
        setError(res.data.error)
      } else { 
        localStorage.setItem("UserData",JSON.stringify(res.data))
        window.location="/"
      }
    }
    if (timer) {
      clearTimeout(timer);
      setTimer(false)
      validate(process.env.REACT_APP_API + "/sign-in", userDetails,tempFunction)
    } else {
      validate(process.env.REACT_APP_API + "/sign-in", userDetails,tempFunction)
    }
  }
  return ( 
    (loader===false)
    ?
      <>
        <div className="container d-flex justify-content-center align-items-center h-100 form-container copy-text" id="signup">
          <form className="form-signup justify-content-center">
            <img className="mb-4" src="image/logo.svg" alt="logo.png" width="72" height="72" draggable="false" />
            <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
            {error ? <p className="error-text">{error}</p> : ""}
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" value={userDetails.email ? userDetails.email : ""} onChange={validEmail} className="form-control mt-1" placeholder="Email address" required />
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" value={userDetails.password ? userDetails.password : ""} onChange={validPassword} className="form-control mt-1" placeholder="Password" required />
            <button className="btn btn-lg btn-primary btn-block mt-1" onClick={signInOnClick} type="button">Sign up</button>
            <div className="d-flex flex-column mt-3 align-items-center copy-text"><a href="/signup" className="">Sign-up</a><a href="/reset" className="">Reset-password</a></div>
            <p className="mt-3 mb-2 text-muted copy-text">&copy; 2021</p>
          </form>
        </div>
      </>
    :
      <Loader/>
  )
}