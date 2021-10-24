import React,{useState} from "react" 
import DatePicker from "react-datepicker";
import Autocomplete from "react-autocomplete"
import Axios from "axios"
export default function IndexForm(){ 
  const [error,setError]=useState(false)
  const [bookingDetails,setBookingDetails]=useState({from:false,to:false,date:new Date()})
  const [stationInfo,setStationInfo]=useState([]) 
  const [timer, setTimer] = useState(false); 
  function validate(link, value, callBack,time) {
    setTimer(setTimeout(() => {
      Axios
        .post(link, value)
        .then(res => {
          callBack(res)
        })
        .catch(err => {
          console.log(err)
        })  
    }, time));
  }
  function updateAutoComplete(e){
    const tempFunction=(res)=> { 
      if(res.data.error){
        console.log(res.data.error)
      }else{
        var out=[]
        for(var i=0;i<res.data.stations.length;i++){
          out.push({label:res.data.stations[i].station_name+" - "+res.data.stations[i].station_code,_id:res.data.stations[i]._id});
        }
        setStationInfo(out)
      }
    }
    if (timer) { 
      clearTimeout(timer);
      setTimer(false) 
      validate(process.env.REACT_APP_API + "/station-autocomplete", {regex:e.target.value},tempFunction,300) 
    } else { 
      validate(process.env.REACT_APP_API + "/station-autocomplete", {regex:e.target.value},tempFunction,300) 
    }
  }
  function searchTrains(){
    console.log('hello')
  }
  return(
    <div className="container d-flex justify-content-center align-items-center h-100 form-container copy-text" id="signup">
      <form className="form-signup justify-content-center"> 
        {error ? <p className="error-text mb-2">{error}</p> : ""} 
        <Autocomplete
          getItemValue={(item) => item.label} 
          items={stationInfo}
          renderItem={(item, isHighlighted,i) =>
            <div style={{ background: isHighlighted ? 'lightGrey' : 'white',padding:"10px",fontSize:"1rem"}} key={item._id}>
              {item.label}
            </div>
          }
          menuStyle={{
            zIndex:100,
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, .2)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '0px',
            fontSize: '100%', 
            position: 'fixed',
            overflow: 'auto',
            maxHeight: '300px', // TODO: don't cheat, let it flow to the bottom
          }}
          wrapperStyle={{width:"100%",position:"relative"}}
          renderInput={function(props) {
            return <input {...props} className="form-control mt-1 w-100" onBlur={()=>{setStationInfo([])}}  placeholder="From" />
          }}
          value={bookingDetails.from?bookingDetails.from:""}
          onChange={(e) => {setBookingDetails({...bookingDetails,from:e.target.value});updateAutoComplete(e);}}
          onSelect={(val) => {setBookingDetails({...bookingDetails,from:val});console.log(val)}}  
        />
        <Autocomplete
          getItemValue={(item) => item.label}
          items={stationInfo}
          renderItem={(item, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightGrey' : 'white',padding:"10px" }}>
              {item.label}
            </div>
          }
          menuStyle={{
            zIndex:100,
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, .2)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '0px',
            fontSize: '100%', 
            position: 'fixed',
            overflow: 'auto',
            maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
          }}
          wrapperStyle={{width:"100%",position:"relative"}}
          renderInput={function(props) {
            return <input {...props} className="form-control mt-1 w-100" onBlur={()=>{setStationInfo([])}} placeholder="To" />
          }}
          value={bookingDetails.to?bookingDetails.to:""}
          onChange={(e) => {setBookingDetails({...bookingDetails,from:e.target.value});updateAutoComplete(e);}}
          onSelect={(val) => {setBookingDetails({...bookingDetails,from:val})}}  
        />
        <DatePicker
          minDate={new Date()}
          maxDate={new Date().setDate(new Date().getDate()+90)}
          selected={bookingDetails.date}  
          dateFormat="dd/MM/yyyy"
          onChange={(date) => {setBookingDetails({...bookingDetails,date:date})}}
          className="form-control mt-1"
        />
        <button className="btn btn-lg btn-primary btn-block mt-1" onClick={searchTrains} type="button">Search Trains</button> 
      </form> 
    </div> 
  ) 
}