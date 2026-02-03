// Modules

// Built-in File System module
// Using 'node:fs' to avoid conflicts with any third-party 'fs' modules
const fs = require('node:fs')

// Read a file (utf-8 encoding)
// Make sure the path is correct relative to where this script is run
const text = fs.readFileSync('cls-modules/files.txt','utf-8')
console.log(text)

// Write to a file (this will overwrite the file if it already exists)
// fs.writeFileSync("file1.txt",'my first file by fs ', 'utf-8')

// Append to a file (adds content without overwriting)
// fs.appendFileSync("file1.txt","heyyyy",'utf-8')

// Delete a file
fs.unlinkSync('cls-modules/files.txt')
