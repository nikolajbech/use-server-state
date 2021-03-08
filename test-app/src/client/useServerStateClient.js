import { w3cwebsocket as W3CWebSocket } from 'websocket'

export default class UseServerStateClient {
  constructor(endpoint, port){
    this.getJwt = null
    this.states = {}
    this.endpoint = endpoint
    this.port = port
    this.startSocket()
  }

  startSocket() {
    this.client = new W3CWebSocket(`ws://${this.endpoint}:${this.port}/`)
    this.restUrl = `http://${this.endpoint}:${this.port}`
    this.wsIsOpen = false

    this.client.onopen = () => {
      console.log("Client is open")
      this.wsIsOpen = true
      this.verifyUser(this.jwt)
    }
  
    this.client.onmessage = (message) => {
      const response = JSON.parse(message.data)
      const key = Object.keys(response)[0]
      const value = Object.values(response)[0]
  
      if (Object.keys(this.states).includes(key)) {
        if(this.states[key][0] === (value)) return
        this.states[key][1](value)
        this.states[key][0] = value
      }
    }
  }

  verifyUser(jwt) {
    if(jwt) this.jwt = jwt
    this.sendMessage({ type: 'VERIFY_USER' }, jwt)
  }

  async addState(key, setState, jwt) {
    this.jwt = jwt
    this.states[key] = [null, setState] // Init with null if JWT is not available
    const initialValue = await this.initValue(key, jwt)
    console.log("initialValue", initialValue)
    setState(initialValue[key])
    this.states[key] = [initialValue[key], setState]
  }

  removeState(key) {
    delete this.states[key]
  }

  updateState(key, val, jwt){
    this.jwt = jwt
    if(!this.states[key]){
      console.log("(updateState) Key not found - available states", this.states)
      return
    }
    if(this.states[key][0] === val){
      console.log("(updateState) Value is the same")
      return
    }
    this.sendMessage({ type: 'SET', key, value: val }, jwt)
  }

  getState(key) {
    return this.states[key]
  }

  async sendMessage(message, jwt){
    const formattedMessage = JSON.stringify({ ...message, jwt })
    console.log("Sending", formattedMessage)
    this.wsIsOpen && this.client.send(formattedMessage)
  }

  async initValue(key, jwt) {
    return new Promise(async (resolve, reject) => {
      fetch(`${this.restUrl}/get-value?jwt=${jwt}&key=${key}`)
        .then(res => res.json())
        .then(result => {
          console.log("GOT result", result)
          resolve(result)
        })
        .catch(e => {
          console.log(e)
          reject(e)
      })
    })
  }
}
