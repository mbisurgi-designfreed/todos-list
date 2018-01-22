const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

const hashPassword = '$2a$10$IsId/GdtJMdeSy67N8rmHObBBFWtZeSwUE2CfkTwY/56AyXhh2k1i';

bcrypt.compare(password, hashPassword, (err, res) => {
    console.log(res);
});

// const message = 'I am user number 3';
// const hash = SHA256(message).toString();

// console.log('Message:', message);
// console.log('Hash:', hash);

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed');
// }

// const data = {
//     id: 10
// };

// const token = jwt.sign(data, 'somesecret');
// const decoded = jwt.verify(token, 'somesecret');

// console.log(decoded);