const fs=require("fs")
var data=JSON.parse(fs.readFileSync("../../datas/trainsinfo.json"))
var output=[] 
for(var i=0;i<data.length;i++){ 
  output.push({ 
    train_name: data[i].train_name,
    train_number: data[i].train_number,
    from_station_name: data[i].from_station_name,
    from_station_code: data[i].from_station_code,
    departure: data[i].departure,
    to_station_name: data[i].to_station_name,
    to_station_code: data[i].to_station_code,
    arrival: data[i].arrival,
    distance: data[i].distance,
    return_number: data[i].return_number,
    duration_h: data[i].duration_h,
    duration_m: data[i].duration_m,  
    train_coordinates:data[i].train_coordinates
  })
} 
console.log(output.length,data.length)
fs.writeFile("../../output-datas/trainsinfo.json",JSON.stringify(output),function(){
  console.log("completed")
})