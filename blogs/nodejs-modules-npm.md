# Node.js Modules & npm

This lecture focuses on the concept of modules in Node.js, which are essential for organizing and structuring code.  

## Node.js Overview

- Node.js allows running JavaScript outside the browser  
- Built with **V8 engine + C++ runtime** → now called a **runtime environment**  
- Can build: web servers, CLI tools, iOS/Android apps, IoT and watch apps  
- Versions: **LTS (even)** → stable, **Current (odd)** → latest features  
- **npm** → to install dependencies  
- Node CLI provides options like checking version, running in watch mode, etc.  
- **Difference from browser JS**: Some JS features provided by browsers may not work in Node.js  

---

## Types of Modules

1. **Built-in Modules**  
   - Come with Node.js  
   - Example: File System (`fs`) module for file operations  

2. **Third-party Modules**  
   - External modules available online  
   - Installed via npm  

3. **Custom Modules**  
   - Created by developers for project-specific needs  
   - Can be required like built-in or third-party modules  

### Using require Function

- Loads modules into the code  
- Node.js checks for third-party modules first, then built-in ones  
- Throws an error if module is not found  


---

## Working with npm

- **Purpose**: Manages packages for Node.js applications  
- **package.json**: Identifies project as a package  
  - Includes project name, version, scripts, dependencies  
  - Created using `npm init`  
- **Adding Dependencies**: Example: `npm install @types/node`  
  - Updates `package.json`  
  - Creates `node_modules` folder  
- **node_modules Folder**:  
  - Stores installed packages  
  - Should not be manually changed  
  - Can be regenerated using `npm install`  
- **package-lock.json**:  
  - Tracks exact versions of dependencies and sub-dependencies  
  - Ensures consistent installs  
- **Sharing Projects**:  
  - Do not share `node_modules`  
  - Share `package.json` and `package-lock.json` only  

---

## Node.js Wrapper Function

Every Node.js module is internally wrapped in a function. This is why inside your module, you automatically have access to: `require`, `exports`, `module`, `__filename`, and `__dirname`.  

### How It Works

```javascript
(function (exports, require, module, __filename, __dirname) {
    // Your module code runs here
})();
