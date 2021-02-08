const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getFriends, getReceiver, getReceiverbyId, updateLocation, updateImage, updateName, updatePhone, updateBio, deleteMessage} = require('../controllers/users')
const {fileUpload} = require('../middleware/upload')
const{verifyAccess} = require('../middleware/auth')

router
.post('/register',registerUser)
.post('/login',loginUser)
.put('/updatelocation/:id', verifyAccess,updateLocation)
.put('/name/:id',verifyAccess,updateName)
.delete('/deletemsg/:id',verifyAccess,deleteMessage)
.put('/phone/:id',verifyAccess,updatePhone)
.put('/bio/:id',verifyAccess,updateBio)
.put('/updateimage/:id', verifyAccess,fileUpload, updateImage)
.get('/friends/:id', verifyAccess,getFriends)
.get('/receiverby/:id', verifyAccess,getReceiverbyId)
.get('/receiver/:idUser/:idReceiver',verifyAccess, getReceiver)

module.exports = router
