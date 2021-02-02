const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getFriends, getReceiver, getReceiverbyId, updateLocation, updateImage, updateName, updatePhone, updateBio, deleteMessage} = require('../controllers/users')
const {fileUpload} = require('../middleware/upload')

router
.post('/register',registerUser)
.post('/login',loginUser)
.put('/updatelocation/:id',updateLocation)
.put('/name/:id',updateName)
.delete('/deletemsg/:id',deleteMessage)
.put('/phone/:id',updatePhone)
.put('/bio/:id',updateBio)
.put('/updateimage/:id', fileUpload, updateImage)
.get('/friends/:id', getFriends)
.get('/receiverby/:id', getReceiverbyId)
.get('/receiver/:idUser/:idReceiver', getReceiver)

module.exports = router
