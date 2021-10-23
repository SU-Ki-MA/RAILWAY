import React,{useState,useEffect} from "react"
import Verify from "../verify"
import Loader from "../Components/Loader"
export default function Index(){
  const [userData,setUserData]=useState(false)
  useEffect(()=>{
    async function tempVerify(){
      const verify=new Verify();
      setUserData(await verify.protectedVerification())
    }
    tempVerify()
  },[]) 
  return(
    userData!==false
    ?
      <>
        <h1>hello</h1>
      </>
    :
      <Loader/>
  )
}