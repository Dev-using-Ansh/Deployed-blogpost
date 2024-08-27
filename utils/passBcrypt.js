const bcrypt = require('bcrypt');
 
function hashPassword(plaintext){
    return bcrypt.genSalt(10)
    .then(salt =>{
        // console.log("Salt for the plaintext", salt);
        return bcrypt.hash(plaintext,salt)
    }).then(hashedPassword =>{
        console.log("Password created succussfully", hashedPassword);
        // console.log(typeof hashedPassword)
        return hashedPassword
    }).catch(err =>{
        console.log("Error in hashed Password",err);
    })


}
// hashPassword("Password123");
// const hashedPwd = hashPassword("Password123");
// console.log(typeof hashedPwd);
// console.log("after the fetch",hashedPwd);

let hashPwd;
 hashPassword("Password123")
.then(result =>{
    console.log(typeof result);
    console.log(result);
    hashPwd = result;
}).catch(err =>{
    console.log("There is error in result", err);
})
// const hashPword = hashPassword("Password123");
// console.log("This is promise",hashPword);
console.log(hashPwd);
async function comparePassword(plainPasswordFromLogin, hashedPwdFromDb){
    const isMatch = await bcrypt.compare(plainPasswordFromLogin, hashedPwdFromDb);
    console.log("IsMatch :", isMatch);
}
// comparePassword("password123","$2b$10$6M0uJf3kYwKIiUSzMuHegu3QqylWSDEgE78BPEjUrtJbh4ozSS/3e");
function hashPasswordSync(plainText){
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainText,salt);
}
const bcryptPassword = hashPasswordSync("password123");
console.log("Using sync function",bcryptPassword);
console.log("Type of Bcrypt sync", typeof bcryptPassword);
function comparePasswordSync(plainPasswordFromLogin, hashedPwdFromDb){
    const isMatch = bcrypt.compareSync(plainPasswordFromLogin, hashedPwdFromDb);
    console.log("IsMatchSync" , isMatch);
}
comparePasswordSync("password123",bcryptPassword);