require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const routerUsers = require('./src/routers/users')
const bodyParser = require('body-parser')
const helpers = require('./src/helpers/helpers')
const socket = require('socket.io')
const moment = require('moment')
moment.locale('id')
const { insertHistory } = require('./src/models/users');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/upload', express.static('./upload'))
app.use('/image', express.static('./image'))

app.use('/users', routerUsers)

const io = socket(server, {
    cors: {
        origin: '*'
    },
    transport: ['websocket']
})

const users = []
const idnicks= {}
const clients = []

io.on("connection", (socket) => {
    console.log('ada client yang connect ' + socket.id);
    socket.on('login', (dataLogin)=> {
      // users.push(dataLogin.idUser)
      socket.idUser = dataLogin.idUser
      idnicks[dataLogin.idUser] = socket.id
      // users.push(idnicks[dataLogin.idUser])
      // console.log('Trisa Safira Hasanah')
      // console.log(users)
      console.log(idnicks)
      io.emit('userlist', idnicks)
  })
  socket.on('sendtoroom', (datagroup)=> {
    socket.join(datagroup.room)
    console.log(datagroup)
    console.log('user :'+datagroup.idUser + ' join ke '+datagroup.room);
    socket.broadcast.to(datagroup.room).emit('sendgroup', datagroup)
    socket.broadcast.to(datagroup.room).emit('sendnotifgroup', datagroup)
    socket.emit('sendgroup', datagroup)
    // io.emit('userlist', idnicks)
})
    socket.on('send', (data)=> {
      console.log('socket id sender: '+idnicks[data.idUser])
      console.log('socket id receiver: '+idnicks[data.idReceiver])
        
        const formatMessage = {
          usersendername : data.usersendername,
            message: data.message,
            idUser: data.idUser,
            idReceiver: data.idReceiver,
            username: data.username,
            time: moment(new Date()).format('LT')
        }

        io.to(idnicks[data.idReceiver]).emit('sendmsg', formatMessage)
        io.to(idnicks[data.idReceiver]).emit('sendnotif', formatMessage)
        socket.emit('sendmsg', formatMessage)

                const dataHistory = { 
                    senderid : data.idUser, 
                    receiverid : data.idReceiver, 
                    messagesend : data.message,
                    datetime : new Date(),
                    time : formatMessage.time
                }
                insertHistory(dataHistory)
                  .then(result => {
                    const resultPhone = result
                    // helpers.response(null, resultPhone, 201, null)
                  })
                  .catch((err) => {
                    console.log(err)
                    // return helpers.response(null, null, 500, { message: 'problem with database' })
                  })
    
    })

    socket.on("disconnect", () => {
        console.log('client terputus');
        // users.splice(users.indexOf(socket.idUser),1)
        delete idnicks[socket.idUser]
        // delete clients[socket.id]
        console.log(idnicks)
        io.emit('userlist', idnicks)
      });
  });


app.use((err, req, res, next) => {
    helpers.response(res, null, err.status, { message: err.message })
  })
  
  app.use('*', (req, res) => {
    helpers.response(res, null, 404, { message: 'URL not Found!' })
  })
server.listen(PORT, () => {
    console.log(`server is running in PORT ${PORT}`)
})