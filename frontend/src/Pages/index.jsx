import React,{useState,useEffect} from "react"
import Verify from "../verify"
import Loader from "../Components/Loader"
import Navbar from "../Components/Navbar"
import IndexForm from "../Components/IndexForm"
import "../../node_modules/react-datepicker/src/stylesheets/datepicker.scss"
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
        <Navbar/>
        <IndexForm/>
      </>
    :
      <Loader/>
  )
}