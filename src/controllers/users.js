const helpers = require('../helpers/helpers')
const bcrypt = require('bcrypt');
const { insertUsers,checkUser, getUsers, getReceiver,getReceiverbyid,updateUsersPut, deleteMessage } = require('../models/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {v4: uuidv4 } = require('uuid')


const users = {
  registerUser: (req, res, next) => {
    const { username, email, password } = req.body
    checkUser(email)
    .then(result => {
      console.log(result.length)
      if(result.length>0) {return helpers.response(res, null, 402, { message: 'Email is Already Exist' })}
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          const data = {
            id: uuidv4(),
            name: '-',
            username,
            email,
            password: hash,
            phoneNumber: 0, 
            bio: '-',
            lat: 0,
            lng: 0,
            images: `${process.env.BASE_URL}/image/user.png`
          }
          insertUsers(data) 
          .then(()=> {
            return helpers.response(res, { message: 'Account Created!'}, 200, null)
          })
          .catch((err) => {
            console.log(err)
            return helpers.response(res, null, 500, { message: 'problem with database' })
          })
        })
      })
    })
  },
  loginUser: (req, res) => {
    const {email, password} = req.body
    console.log('cobaawa;')
    checkUser(email)
    .then(result => {
        console.log('trisa')
      const users = result[0]
      bcrypt.compare(password, users.password, function(err, resCheck) {
        if(!resCheck) {return helpers.response(res, null, 401, { message: 'Wrong Password!!' })}
        delete users.password
        console.log('abcdefgh')
        const option = {
          expiresIn: '12h'
        }
        
        const payload = {
          userID: users.id,
          email: users.email,
        }
        
        jwt.sign(payload, process.env.SECRET_KEY, option, function(err, token) {
          users.token = token
          return helpers.response(res, users, 200, null)
        })
      })
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  getFriends: (req, res, next) => {
    const id = req.params.id
    const username = req.query.username || '' // SEARCH
    getUsers(id, username)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        // const error = new Error('id not found')
        // error.status = 404
        // return next(error)
        return helpers.response(res, [], 200, null)
      }
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  getReceiver: (req, res, next) => {
    const idUser = req.params.idUser
    const idReceiver = req.params.idReceiver
    getReceiver(idUser, idReceiver)
    .then(result => {
      const resultUsers = result
      // if (resultUsers.length === 0) {
      //   return helpers.response(res, {message :'no history'}, 200, null)

      // }
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  getReceiverbyId: (req, res, next) => {
    const id = req.params.id
    getReceiverbyid(id)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        const error = new Error('id not found')
        error.status = 404
        return next(error)
      }
      helpers.response(res, resultUsers, 200, null)
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },
  updateLocation: (req, res, next) => {
    const id = req.params.id
    const lat = req.body.lat
    const lng = req.body.lng
    const data = {lat,lng}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Loctaion updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  updateImage: (req, res, next) => {
    const id = req.params.id
    getReceiverbyid(id)
    .then(result => {
      const resultUsers = result
      if (resultUsers.length === 0) {
        const error = new Error('id not found')
        error.status = 404
        return next(error)
      }
      const dataResults = resultUsers[0]
      const oldImage = dataResults.image
      console.log('cobacoba')
      console.log(dataResults.image)
      // const defaultImage = `${process.env.BASE_URL}/image/user.png`
      if(oldImage){
        const replaceFileName = oldImage.replace(`${process.env.BASE_URL}/upload/`, '')
        console.log(replaceFileName)
        fs.unlink(`./upload/${replaceFileName}`, err =>{
          if(err) {
          const error = new Error('Failed to Delete')
          return next(error)
        }
        })
      }
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
    const data = { images: `${process.env.BASE_URL}/upload/${req.file.filename}` }
    console.log('abcdegghdhd')
    console.log(data)
    updateUsersPut(id,data) 
    .then((result)=> {
      if (result.affectedRows === 0) {
        const error = new Error('id not found')
        error.status = 404
        return next(error)
      }
      return helpers.response(res, { message: 'update image berhasil' }, 200, null)
    })
    .catch((err) => {
      console.log(err)
      return helpers.response(res, null, 500, { message: 'problem with database' })
    })
  },

  updateName: (req, res, next) => {
    const id = req.params.id
    const name = req.body.name
    const data = {name}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Name updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  updatePhone: (req, res, next) => {
    const id = req.params.id
    const phonenumber = req.body.phonenumber
    const data = {phonenumber}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Phone updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  updateBio: (req, res, next) => {
    const id = req.params.id
    const bio = req.body.bio
    const data = {bio}
    updateUsersPut(id,data) 
      .then(result => {
        const resultUsers = result
        if (resultUsers.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Bio updated' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
  deleteMessage: (req, res, next) => {
    const id = req.params.id
    deleteMessage(id)
      .then(result => {
        const resultMessage = result
        if (resultMessage.length === 0) {
          const error = new Error('id not found')
          error.status = 404
          return next(error)
        }
        helpers.response(res, { message: 'Deleted!' }, 200, null)
      })
      .catch((err) => {
        console.log(err)
        return helpers.response(res, null, 500, { message: 'problem with database' })
      })
  },
}

module.exports = users
