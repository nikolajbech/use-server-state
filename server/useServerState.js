// Express:
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')

// Web socket:
const WebSocket = require('ws')
const { v4 } = require('uuid')

const sessions = {} // object with all current sessions. Takes sessionId.
const getters = {} // object with all all getters. Takes a key and a function.
const setters = {} // object with all all setters. Takes a key and a function.

class UseServerState {
  constructor(port, getUid) {
    this.app = express()
    const server = http.createServer(this.app)
    server.listen(port, function() { console.log(`Server is listening on ${port}`)})
    this.wss = new WebSocket.Server({ server })
    this.setupWSS()
    this.setupRest()
    this.getUid = getUid
    this.app.get('/', function (req, res) {
      res.send('Welcome')
    })
  }

  add(key, getFunc, setFunc) {
    if(key === undefined) return
    getters[key] = getFunc
    setters[key] = setFunc
    console.log('Added getter:', key)
    console.log('Added setter:', key)
  }

  emit(key, uid, value) {
    if(key === undefined) return
    const message = {}
    message[key] = value
    message[type] = 'EMIT'
    reply(uid, message)
  }

  setupWSS() {
    this.wss.on('connection', (ws) => {
      ws.sessionId = v4()
      ws.verified = false
      this.handleClose(ws)
      this.handleMessage(ws)
      console.log("New session with ID", ws.sessionId)
      sessions[ws.sessionId] = { ws }
    })
  }

  handleClose(ws) {
    ws.on('close', () => {
      delete sessions[ws.sessionId]
    })
  }

  async handleMessage(ws) {
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data)
        if(!message.jwt){
          console.error("No JWT")
          return
        }
        if (message.type === 'VERIFY_USER') this.handleVerify(ws, message.jwt)
        const uid = await this.getUid(message.jwt)
        ws.id = uid
        console.log("Got", message, "from", uid)
        if (uid) {
          if (message.type === 'SET') this.handleSet(uid, message.key, message.value)
          if (message.type === 'GET') this.handleGet(uid, message.key)
        } else {
          ws.send(JSON.stringify({ error: 'user not verified' }))
        }
      } catch (e) {
        this.sendError(ws, 'Wrong format')
        return
      }
    })
  }

  sendError(ws, message) {
    const messageObject = {
      type: 'ERROR',
      payload: message,
    }
    ws.send(JSON.stringify(messageObject))
  }

  async handleVerify(ws, jwt) {
    console.log("Verifying user with token", jwt)
    const uid = await this.getUid(jwt)
    console.log("Got UID", uid)
    if (uid) {
      ws.id = uid
      ws.verified = true
    }
  }

  handleGet(uid, key) {
    if(key === undefined) return
    const val = getters[key](uid)
    const answer = {}
    answer[key] = val
    this.reply(uid, answer)
  }

  handleSet(uid, key, value) {
    const val = setters[key](uid, value)
    const answer = {}
    answer[key] = val
    this.reply(uid, answer)
  }

  reply(uid, message) {
    const matchedSessions = Object.values(sessions).filter(session => session.ws.id === uid)
    console.log("Number of matched sessions", matchedSessions.length)
    console.log("Sending message", message, "to", uid)
    matchedSessions.map(session => {
      console.log(session.ws.id)
      session.ws.send(JSON.stringify(message))
    })
  }

  // Rest:
  setupRest() {
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.get('/get-value', async (req, res) => {
      const jwt = req.query.jwt
      if(jwt === 'no_init') return res.send(null)
      const key = req.query.key
      const uid = await this.getUid(jwt)
      if(key === 'undefined') return res.send(null)
      console.log("get", key, "from user", uid)
      const val = getters[key](uid)
      const answer = {}
      answer[key] = val
      res.send(answer)
    })
  }
}

module.exports = { UseServerState }