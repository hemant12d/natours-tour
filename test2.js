const obj = {
    name: "Hemant Soni", 
    age: 20,
    profession: {role: "Web Developer", mainRole: "Backend Developer"}
}

const anotherObj = {...obj};
console.log(anotherObj === obj);
console.log(anotherObj.profession === obj.profession);
anotherObj.name = "Ajay Soni";
anotherObj.profession.role = "App Developer";
console.log(obj, anotherObj);