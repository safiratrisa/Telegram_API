const connection = require('../configs/db')


const users = {
  checkUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  checkPassword: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertUsers: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET ?', data, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getUsers: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`select users.id, users.username, users.images FROM users WHERE NOT (users.id = ? OR users.id = 11)`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getReceiverbyid: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`select * FROM users WHERE users.id = ?`, id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  getReceiver: (idUser, idReceiver) => {
    return new Promise((resolve, reject) => {
      connection.query(`select send.id, sender.id AS senderId, sender.username AS sendername, sender.images AS senderimages, receiver.id AS receiverId, receiver.username AS receivername, receiver.phonenumber AS receiverphone, receiver.lat AS receiverlat, receiver.lng AS receiverlng, receiver.images AS receiverimage, send.messagesend, send.datetime, send.time from send LEFT JOIN users AS sender ON send.senderid = sender.id LEFT JOIN users AS receiver ON send.receiverid = receiver.id WHERE (send.senderid = ${idUser} or send.senderid = ${idReceiver}) AND (send.receiverid = ${idReceiver} or send.receiverid = ${idUser}) ORDER BY send.datetime ASC`, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  insertHistory: (dataHistory) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO send SET ?', dataHistory, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  updateUsersPut: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [data, id], (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
  deleteMessage: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM send WHERE id = ?', id, (error, results) => {
        if (!error) {
          resolve(results)
        } else {
          reject(error)
        }
      })
    })
  },
}

module.exports = users
