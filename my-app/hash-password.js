// hash-password.js
const bcrypt = require('bcryptjs');

const password = process.argv[2]; // Takes the password from the command line

if (!password) {
  console.error('Please provide a password to hash.');
  console.log('Usage: node hash-password.js <your-password>');
  process.exit(1);
}

const salt = bcrypt.genSaltSync(12);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log('Hashed Password:');
console.log(hashedPassword);