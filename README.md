<h1 align="center">Backend - Telegram</h1>

## Table of Contents

- [Introduction](#introduction)
- [Built With](#built-with)
- [Requirements](#requirements)
- [Running the Application](#running-the-application)
- [Set up .env file](#Set-up-env-file)
- [End Point](#End-Point)
- [Related Project](#Related-Project)

## Introduction
Telegram is a chat application built with the implementation of VueJs, NodeJs with Express framework, MySQL, and SocketIO. This application will update your current location when you are logged in. You can also send message to a friend using Personal Chat or to many friends using Live Chat.

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)](https://nodejs.org/)
[![Node.js](https://img.shields.io/badge/Socket.io-v3.1.1-green.svg?style=rounded-square)](https://socket.io/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. <a href="https://expressjs.com/en/starter/installing.html">Express</a>
3. <a href="https://www.getpostman.com/">Postman</a>
4. <a href="https://socket.io/">SocketIO</a>
5. Web Server (ex. localhost)

## Running the Application
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name telegram, and Import file [telegram](https://drive.google.com/file/d/1WdJxIWOv7PrErx6ViNwS3l4qCBBSciU9/view?usp=sharing) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.
8. You can see all the end point [here](#end-point)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST=[your_database_host]
DB_USER=[your_database_username]
DB_PASSWORD=[your_database_pass]
DB_NAME=telegram
BASE_URL=http://localhost:5000
SECRET_KEY=[jwt_secret_key]
```

## End Point

**1. USERS INFORMATION**
  * **POST** `/users/register`
  * **POST** `/users/login`
  * **PUT** `/users/updatelocation/:id`
  * **PUT** `/users/name/:id`
  * **PUT** `/users/phone/:id`
  * **PUT** `/users/bio/:id`
  * **PUT** `/users/updateimage/:id`
  * **DELETE** `/users/deletemsg/:id`
  * **GET**  `/users/friends/:id`
  * **GET**  `/users/receiverby/:id`
  * **GET**  `/users/receiver/:idUser/:idReceiver`

## Related Project

- [`Frontend-Telegram`](https://github.com/safiratrisa/Telegram-Vue)
