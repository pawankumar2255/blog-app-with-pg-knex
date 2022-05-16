const express = require('express')
const router = express.Router()
const {userRegister,userLogIn, createPost, likeDislikePostWithPostId, getCountLikeByPostId, getCountDisLikeByPostId, userLogOut} = require('../controllers/controller')
const {verifyToken} = require("../auth/auth")


router.post('/register',userRegister)

router.post('/login',userLogIn)

router.post('/feed', verifyToken, createPost)
router.post('/post/:postId/reaction', verifyToken, likeDislikePostWithPostId)
router.get('/like/:postId',getCountLikeByPostId)
router.get('/dislike/:postId',getCountDisLikeByPostId)
router.get('/logout',verifyToken,userLogOut)



module.exports = router     