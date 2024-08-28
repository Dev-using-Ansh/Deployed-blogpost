const bcrypt = require("bcrypt");
async function hashedPassword(passwordFromDB){
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(passwordFromDB, salt);
}
hashedPassword("password123")
.then(password =>{
    email = "kumarguptaansh0@gmail.com"
    console.log(typeof password);
    const obj = {email,password};
    return obj;
}).catch(err =>{
    console.log(err);
})