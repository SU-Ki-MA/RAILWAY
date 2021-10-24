const fs=require("fs")
var data=JSON.parse(fs.readFileSync("../../datas/schedulesinfo.json"))
var output=[] 
for(var i=0;i<data.length;i++){ 
  output.push({  
    arrival: data[i].arrival, 
    train_name: data[i].train_name,
    station_name: data[i].station_name,
    station_code: data[i].station_code, 
    train_number: data[i].train_number,
    departure: data[i].departure
  })
}  
console.log(output.length,data.length)
fs.writeFile("../../output-datas/schedulesinfo.json",JSON.stringify(output),function(){
  console.log("completed")
})