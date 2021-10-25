import React,{useState} from "react" 
import DatePicker from "react-datepicker";
import Autocomplete from "react-autocomplete"
import Axios from "axios"
export default function IndexForm(){ 
  const [error,setError]=useState(false)
  const [bookingDetails,setBookingDetails]=useState({from:false,to:false,date:new Date()})
  const [stationInfoFrom,setStationInfoFrom]=useState([]) 
  const [stationInfoTo,setStationInfoTo]=useState([]) 
  const [formUI,setFormUI]=useState("after")
  const [trainsInfo,setTrainsInfo]=useState([1]) 
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
    if(e.target.value.length===0){
      setStationInfoTo([])
      setStationInfoFrom([])
      clearTimeout(timer);
      setTimer(false)
      return 
    }
    const tempFunction=(res)=> { 
      if(res.data.error){
        console.log(res.data.error)
      }else{
        var out=[]
        for(var i=0;i<res.data.stations.length;i++){ 
          out.push({label:res.data.stations[i].station_name+" - "+res.data.stations[i].station_code,_id:res.data.stations[i]._id});
        } 
        if(e.target.id==="from"){
          setStationInfoFrom(out)
        }else{
          setStationInfoTo(out)
        }
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
    if(!(bookingDetails.from && bookingDetails.to && bookingDetails.date)){
      setError("Please enter all the values.")
      return 
    }
    setError(false)
    setFormUI("after")
    const tempFunction=(res)=> { 
      if(res.data.error){
        setError(res.data.error)
      }else{
        setTrainsInfo(res.data.trainsInfo)
      }
    }
    if (timer) { 
      clearTimeout(timer);
      setTimer(false) 
      validate(process.env.REACT_APP_API + "/search-trains",  bookingDetails,tempFunction,500) 
    } else { 
      validate(process.env.REACT_APP_API + "/search-trains", bookingDetails,tempFunction,500) 
    }
  }
  function showTrainSchedule(){
    console.log("train schedule")
  }
  return(
    <div className={"container d-flex justify-content-center align-items-center h-100 form-container copy-text "+formUI} id="signup">
      <form className="form-signup justify-content-center"> 
        <Autocomplete
          items={stationInfoFrom}
          shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={item => item.label}
          renderItem={(item, highlighted) =>
            <div
              key={item._id}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent',padding:"10px",fontSize:"1rem"}}
            >
              {item.label}
            </div>
          }
          renderInput={function(props) {
            return <input {...props} id="from" className="form-control mt-1" placeholder="From" />
          }}
          menuStyle={{
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 1)',
            padding: '0',
            fontSize: '1rem',
            position: 'fixed',
            overflow: 'auto', 
            maxHeight: '300px',
            zIndex:"100"
          }}
          wrapperStyle={{width:"100%"}}
          value={bookingDetails.from?bookingDetails.from:""}
          onChange={e => {setBookingDetails({...bookingDetails,from:e.target.value});updateAutoComplete(e);}}
          onSelect={value => {setBookingDetails({...bookingDetails,from:value});setStationInfoFrom([]);}}
        />  
        <Autocomplete
          items={stationInfoTo}
          shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={item => item.label}
          renderItem={(item, highlighted) =>
            <div
              key={item._id}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent',padding:"10px",fontSize:"1rem"}}
            >
              {item.label}
            </div>
          }
          renderInput={function(props) {
            return <input {...props} id="to" className="form-control mt-1" placeholder="To" />
          }}
          menuStyle={{
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 1)',
            padding: '0',
            fontSize: '1rem',
            position: 'fixed',
            overflow: 'auto', 
            maxHeight: '300px',
            zIndex:"100"
          }}
          wrapperStyle={{width:"100%"}}
          value={bookingDetails.to?bookingDetails.to:""}
          onChange={e => {setBookingDetails({...bookingDetails,to:e.target.value});updateAutoComplete(e);}}
          onSelect={value => {setBookingDetails({...bookingDetails,to:value});setStationInfoTo([]);}}
        /> 
        <DatePicker
          minDate={new Date()}
          maxDate={new Date().setDate(new Date().getDate()+90)}
          selected={bookingDetails.date}  
          dateFormat="dd/MM/yyyy"
          onChange={(date) => {setBookingDetails({...bookingDetails,date:date})}}
          className="form-control  mt-1"
        />
        <button className="btn btn-lg btn-primary btn-block mt-1" onClick={searchTrains} type="button">Search Trains</button> 
      </form> 
      {
        formUI==="after"
        ?
          <div className="container mt-3 w-100 train_details">
            {
              trainsInfo.length!==0?
              trainsInfo.map(elem=>{
                return(
                  <div className="train-details row d-flex pb-3 justify-content-center" style={{border:"1px solid #11999E",borderRadius:"5px"}}>
                    <div className="col col-12 d-flex p-2 align-items-center justify-content-between" style={{backgroundColor:"#11999E",color:"#E4F9F5"}}> 
                      <div className="d-flex align-items-center">
                        <h5>{elem.train_name}</h5>
                        <h6 className="ml-1">({elem.train_number})</h6>
                      </div>
                      <a href="#trainScheduel" onClick={showTrainSchedule} style={{textDecoration:"none",color:"#E4F9F5"}}><h5>Train Schedule</h5></a>
                    </div> 
                    <div className="col col-12 row p-3 d-flex justify-content-between"> 
                      <div className="col col-5 d-flex align-items-center justify-content-start">
                        <h6 style={{fontWeight:"bold"}}>{elem.from_departure} |</h6><h6 className="ml-2">{elem.from_station_name} |</h6><h6 className="ml-2"> Mon, 25 Oct</h6>
                      </div>
                      <div className="col col-2 d-flex align-items-center justify-content-center">
                        <h6 className="duration">05:15</h6>
                      </div>
                      <div className="col col-5 d-flex align-items-center justify-content-end">
                        <h6 style={{fontWeight:"bold"}}>{elem.to_arrival} |</h6><h6 className="ml-2">{elem.to_station_name} |</h6><h6 className="ml-2"> Mon, 25 Oct</h6>
                      </div>
                    </div>
                    <div className="col col-12 row pb-3 pl-3 d-flex justify-content-center"> 
                      <button className="btn btn-primary mt-2">Book Now</button>
                    </div>
                  </div>
                )
              })
              :
              <h4 style={{textAlign:"center"}}>No train found</h4>
            }
          </div>
        :
        ""
      }
    </div> 
  ) 
}