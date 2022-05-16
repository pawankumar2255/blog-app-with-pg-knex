const knex = require('../config/db')
const {createAccessToken,verifyToken} = require('../auth/auth')
const joi = require('joi')


const userRegister = async (req, res) => {
    const joiSchemaForValidation = joi.object({
        name: joi.string().min(3).max(40).required(),
        email: joi.string().email().min(4).required(),
        password: joi.string().min(6).max(16)
    })
    const schemaValidator = joiSchemaForValidation.validate(req.body)
    if (schemaValidator.error) {
        res.status(400).json({
            msg: "error occuring while validating" || schemaValidator.error.message
        })
    } else {
        const data = await req.body
        knex('userDetails').where({email:data.email,password:data.password}).then(d=>{
            if (d.length===0){
                knex('userDetails').insert(data).then(()=>{
                    console.log("signed up")
                    res.status(201).send("signed up successfully")
                }).catch(err => {
                    console.log("error while signing up", err)
                    res.send("some error occured")
                })
            }else{
                console.log("User already exists");
                res.send("dupliate data is entered")
            }
        }).catch(err=>{
            console.log("error while searching user", err)
            res.send("some error is occured")
        })

    }
}


const userLogIn = (req,res)=>{
    knex('userDetails').where({email:req.body.email,password:req.body.password}).then(data=>{

        console.log(data);
    
        if (data[0].email == req.body.email && data[0].password == req.body.password){
            const authToken = createAccessToken(data[0].id)
            res.cookie("token",authToken).send('Logged in successfully')
        }else{
            res.status(401).send("Invalid credentials")
        }
    }).catch(err=>{
        console.log(err.message);
        res.send('User does not exist')
    })
}



const createPost = (req,res)=>{
    const {postTitle} = req.body
    // console.log(req.data)
    knex("post").insert({
        userUniqueId:req.data,
        postTitle
    }).then(()=>{
        console.log("posted")
        res.send("posted")
    }).catch(err=>{
        res.send(err.message)
    })
    
}



const likeDislikePostWithPostId = (req,res)=>{
    knex('post').where({id:req.params.postId}).then(data=>{

        if (data[0]){
            let likeDisliked = req.body.like
            let postStatus
            likeDisliked ? postStatus = "liked" : postStatus = "disLiked"
            // console.log(data);
            knex('likeDislike').where({postId: req.params.postId, userUniqueId:req.data}).then(currentPostData=>{
                console.log(currentPostData)
                if (currentPostData.length==0 ){
                    knex("likeDislike").insert({
                        userUniqueId: req.data,
                        postId: req.params.postId,
                        like: req.body.like || false,
                        dislike: req.body.dislike || false
                    }).then(() => {
                        res.status(201).send(`post ${postStatus}`)
                    }).catch(err => {
                        console.log("error: ", err.message)
                        res.send("error while liking the post")
                    })
                }else {
                    res.send("You already reacted to this")
                }
            }).catch((error) => {
                console.log(error.message);
                res.send("error while searching likeDislike")
            })
        }
    })
}



const getCountLikeByPostId = (req,res)=>{
    knex('likeDislike').where({postId: req.params.postId,like:true}).then(data=>{
        res.status(200).send({likes: data.length})
    }).catch(err=>{
        res.status(404).send(`Post not found ${err.message}`)
    })
}




const getCountDisLikeByPostId = (req,res)=>{
    knex('likeDislike').where({postId: req.params.postId,dislike:true}).then(data=>{
        res.status(200).send({dislikes: data.length})
    }).catch(err=>{
        res.status(404).send(`Post not found ${err.message}`)
    })
}


const userLogOut = (req,res)=>{
    res.clearCookie('token').status(200).send('You Logged Out succesfully')
}



module.exports = {userRegister,userLogIn,createPost,likeDislikePostWithPostId,getCountLikeByPostId,getCountDisLikeByPostId,userLogOut}