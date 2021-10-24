import React,{useState,useEffect} from "react";
import Axios from "axios"
import Verify from "../verify";
import Loader from "../Components/Loader";
export default function Reset() {
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(false);
  const userDetailsInitial = {email: false, otp: false, newPassword:false,confirmNewPassword:false}
  const [userDetails, setUserDetails] = useState(userDetailsInitial)
  const [verificationUI,setVerificationUI]=useState(false)
  const [loader,setLoader]=useState(true)
  const [verificationTimeout,setVerificationTimeout]=useState(60*3)
  const [userId,setUserId]=useState(false)
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
        console.log(res.data)
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
        validate(process.env.REACT_APP_API + "/validate", { mail: e.target.value },tempFunction,"post")
      } else {
        validate(process.env.REACT_APP_API + "/validate", { mail: e.target.value },tempFunction,"post")
      }
    }
    setUserDetails({ ...userDetails, email: e.target.value })
  }
  function validate(link, value, callBack,type) {
    if(type==="post"){
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
    }else{
      setTimer(setTimeout(() => {
        Axios
          .get(link+value)
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
  }
  function getOTP(){
    if (!(userDetails.email)) {
      setError("Values should not be empty.\n Please Enter again.")
      setUserDetails(userDetailsInitial) 
      return
    }
    const tempFunction=(res)=>{
      if(res.data.error){
        setError(res.data.error)
      }else{
        setTimer(setInterval(()=>{ 
          setVerificationTimeout((verificationTimeout) =>{
            if(verificationTimeout<=1){ 
              console.log("time out")
              clearInterval(timer)
              setTimer(false)
              window.location="/signin"
              return;
            }    
            return verificationTimeout - 1;
          })
        },1000)) 
        setUserId(res.data._id)
        setVerificationUI(true)
      }
    }
    if (timer) {
      clearTimeout(timer);
      setTimer(false)
      validate(process.env.REACT_APP_API + "/reset-password",  "?mail="+userDetails.email,tempFunction,"get")
    } else {
      validate(process.env.REACT_APP_API + "/reset-password",  "?mail="+userDetails.email,tempFunction,"get")
    }
  }
  function updateOtp(e){
    if(e.target.value.length===0){
      setUserDetails({...userDetails,otp:false})
      return
    }
    setUserDetails({...userDetails,otp:e.target.value})
  }
  function updateNewPassword(e){
    if(e.target.value.length===0){
      setUserDetails({...userDetails,newPassword:false})
      return
    }
    if (e.target.value.length < 8) {
      setError("The password should be minimum of 8 characters.") 
    } else {
      setError(false);
    }
    setUserDetails({...userDetails,newPassword:e.target.value})
  }
  function updateConfirmNewPassword(e){
    if(e.target.value.length===0){
      setUserDetails({...userDetails,confirmNewPassword:false})
      return
    } 
    setUserDetails({...userDetails,confirmNewPassword:e.target.value})
  }
  function resetPassword(){
    if(!(userDetails.email && userDetails.otp && userDetails.newPassword && userDetails.confirmNewPassword)){
      setError("Values should not be empty.\n Please Enter again.") 
      return
    }
    if(userDetails.newPassword.length<8){
      setError("The password should be minimum of 8 characters.") 
      return;
    }
    setError(false) 
    setLoader(true)
    const tempFunction=(res)=>{
      if(res.data.error){
        setError(res.data.error)
      }else{
        window.location="/signin"
      }
    }
    if (timer) { 
      clearTimeout(timer);
      setTimer(false) 
      validate(process.env.REACT_APP_API + "/reset-password", {...userDetails,_id:userId},tempFunction,"post") 
    } else { 
      validate(process.env.REACT_APP_API + "/reset-password", {...userDetails,_id:userId},tempFunction,"post") 
    }
  }
  return ( 
    (loader===false)
    ?
      <>
        <div className="container d-flex justify-content-center align-items-center h-100 form-container copy-text" id="signup">
          <form className="form-signup justify-content-center">
            <img className="mb-4" src="image/logo.svg" alt="logo.png" width="72" height="72" draggable="false" />
            <h1 className="h3 mb-3 font-weight-normal">Reset password</h1>
            {error ? <p className="error-text">{error}</p> : ""}
            {
              !(verificationUI)
              ?
                <>
                  <label htmlFor="inputEmail" className="sr-only">Email address</label>
                  <input type="email" id="inputEmail" value={userDetails.email ? userDetails.email : ""} onChange={validEmail} className="form-control mt-1" placeholder="Email address" required />
                  <button className="btn btn-lg btn-primary btn-block mt-1" onClick={getOTP} type="button">Get OTP</button>
                  <div className="d-flex flex-column mt-3 align-items-center copy-text"><a href="/signup" className="">Sign up</a><a href="/signin" className="mt-1">Sign in</a></div>
                </>
              :
                <>
                  <p>Time remaining - {verificationTimeout>0?<>{String(verificationTimeout/60).split(".")[0]} : {verificationTimeout%60}</>:("0 : 0")} </p>
                  <label htmlFor="inputEmail" className="sr-only">Email address</label>
                  <input type="email" id="inputEmail" value={userDetails.email ? userDetails.email : ""} className="form-control mt-1" placeholder="Email address" disabled required />
                  <label htmlFor="inputOtp" className="sr-only">otp</label>
                  <input type="text" id="inputOtp" value={userDetails.otp ? userDetails.otp : ""} onChange={updateOtp} className="form-control mt-1" placeholder="OTP" required />
                  <label htmlFor="inputNewPassword" className="sr-only">New Password</label>
                  <input type="password" id="inputNewPassword" value={userDetails.newPassword ? userDetails.newPassword : ""} onChange={updateNewPassword} className="form-control mt-1" placeholder="New Password" required />
                  <label htmlFor="inputConfirmNewPassword" className="sr-only">Email address</label>
                  <input type="password" id="inputConfirmNewPassword" value={userDetails.confirmNewPassword ? userDetails.confirmNewPassword : ""} onChange={updateConfirmNewPassword} className="form-control mt-1" placeholder="Confirm New Password" required />
                  <button className="btn btn-lg btn-primary btn-block mt-1" onClick={resetPassword} type="button">Reset Password</button> 
                </>
            }
            <p className="mt-3 mb-2 text-muted copy-text">&copy; 2021</p>
          </form>
        </div>
      </>
    :
      <Loader/>
  )
}