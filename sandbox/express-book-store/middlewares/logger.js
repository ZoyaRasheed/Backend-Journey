import fs from 'fs'
export default (req,res,next)=>{
    const log = `${Date.now()}  ${req.method} ${req.path}`
    fs.writeFileSync('log.txt',log,'utf-8')
    next()
}

