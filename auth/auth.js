const jwt = require('jsonwebtoken')

require('dotenv').config()


const createAccessToken = (user)=>{
    return jwt.sign(user,process.env.SECRET_KEY)
}


const verifyToken = (req,res,next)=>{
    if (req.headers.cookie== undefined){
        console.log("token expird or missing");
        res.send('token does not exist')
    }
    const token = req.headers.cookie.split('=')[1]
    console.log(token);
    jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
        if(err){
            console.log('token has been expired');
            res.send({status:`expired token: ${err.message}`})
        }
        req.data = data
        console.log(data)
        next()
    })
}


module.exports = {createAccessToken,verifyToken }