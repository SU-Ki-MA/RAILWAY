const fs =require('fs')
class DFS{ 
  constructor(inputArray){
    this.dfsArray=inputArray 
    this.i=0,this.j=0;
    this.visited=[]  
    for(let i=0;i<inputArray.length;i++){
      for(let j=0;j<inputArray[i].length;j++){
        if(this.visited[i]){
          this.visited[i].push(false)
        }else{
          this.visited.push([])
          this.visited[i].push(false)
        }
      }
    }
  }
  searchElement(e){ 
    if(this.dfsArray[this.i][this.j]===e){ 
      return [this.i,this.j]
    }
    if(this.i==(this.dfsArray.length-1) && this.j==(this.dfsArray[0].length-1)){   
      return -1
    }
    for(let i=0;i<this.dfsArray.length;i++){ 
      for(let j=0;j<this.dfsArray[i].length;j++){  
        if(this.dfsArray[i][j]!==-1 && !(this.visited[i][j])){ 
          this.i=i
          this.j=j
          this.visited[i][j]=true  
          return this.searchElement(e)
        }
      }
    } 
  }
}
console.log()
var temp=new DFS(JSON.parse(fs.readFileSync("./file.json")))
console.log(temp.dfsArray)