const fs=require("fs")
var data=JSON.parse(fs.readFileSync("../../datas/stationsinfo.json"))
var output=[]
for(var i=0;i<data.length;i++){ 
  output.push({station_name:data[i].station_name,station_code:data[i].station_code,station_coordinates:data[i].station_coordinates})
}
console.log(output.length,data.length)
fs.writeFile("../../output-datas/stationsinfo.json",JSON.stringify(output),function(){
  console.log("completed")
})