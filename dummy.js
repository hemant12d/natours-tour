// Closures basic overview

// const { Model } = require("mongoose");

// function a(value){
//     return function(value2){
//         return function(){
//             console.log(value, value2);
//         }
//     }
// }

// let b = a(5);
// let c = b(7);

// c();


// Asynchronus Experiment

// const asynFunc = () =>{
//     setTimeout(() => {
//         console.log("I will run after 3 seconds")
//     }, 3000);

//     console.log("Text of async function")
// }

// const a = async ()=>{
//     await asynFunc()
//     console.log("function a is invoked")
// };

// const b = async() => {
//     await a();
//     console.log("Final text of b function")
// }

// console.log("line 1")
// asynFunc();
// // b();
// console.log("line 2")



// Aggregate Overview

// await Model.aggregate([
//     {
//         $match: { age: {$gte: 30}}
//     },
//     {
//         $match: { salary: {$gte:75000}}
//     }
// ])


// EventsConcept

// const events = require('events');
// const eventEmitter = new events.EventEmitter();

// const sendData = () => {
//     console.log("Data has sent !");
// }

// const connectionFunc = () =>{
// console.log("Connection established");
//     sendData();
// }

// eventEmitter.on('connection', connectionFunc);

// eventEmitter.emit('connection');


// Class exercise
// class Bird{
   
//     constructor(name){
//         this.name = name;
//         console.log("1");
//     }
// }

// class peocock extends Bird{
    
//     constructor(name){
         
//         console.log("2");
//         super(name)
//     }

    
//     getName(){
        
//         console.log(this.name)
//     }
// }

// const newPeocock = new peocock("Flying peocock");
// newPeocock.getName();