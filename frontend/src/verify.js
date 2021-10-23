import Axios from "axios"
export default class Verify{
  async protectedVerification(){
    var promise=new Promise((res,rej)=>{
      var data=JSON.parse(localStorage.getItem("UserData"))
      if(data){
        res(data)
      }else{
        rej(false)
      }
    }) 
    var data=await promise.catch(()=>{localStorage.removeItem("UserData");window.location="/signin";}) 
    var res=await Axios.post(process.env.REACT_APP_API + "/verify-jwt",data).catch(()=>{localStorage.removeItem("UserData");window.location="/signin";}) 
    if(res.data.error){ 
      localStorage.removeItem("UserData")
      window.location="/signin"
    }else{
      return data
    }
    return false
  }
  async unProtectedVerification(){
    var promise=new Promise((res,rej)=>{
      var data=JSON.parse(localStorage.getItem("UserData"))
      if(data){
        res(data)
      }else{
        rej(false)
      }
    }) 
    var data;
    data=await promise.catch(err=>{data=false})
    if(data){
      window.location="/"
      return
    } 
    return false
  }
}