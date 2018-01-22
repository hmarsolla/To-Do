const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// var password = "123abc!";

// bcrypt.genSalt(10, (err,salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

// var hashed = "$2a$10$lMiUBaP9ADfsDJyhJqkAS.0jioEZd0EUpi4Ym241Cm8fb2DF/PrDG";

// bcrypt.compare(password, hashed, (err, res) => {
//     console.log(res);
// })

// jwt.sign
// jwt.verify

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, "123abc")
// console.log(token);

// var decoded = jwt.verify(token, "123abc");
// console.log(decoded);
// var message = "I am number 3";

// var hash = SHA256(message).toString();

// console.log(hash);


// var data = {
//     id : 4
// };
// var token = {
//     data,
//     hash : SHA256(JSON.stringify(data) + "somesecret").toString()
// }

// var resultHash = SHA256(JSON.stringify(data) + "somesecret").toString();

// if(resultHash === token.hash){
//     console.log("Data was not changed");
// }else{
//     console.log("Data was changed. Don't trust!");
// }

