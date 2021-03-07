import { w3cwebsocket as W3CWebSocket } from 'websocket'

export default class UseServerStateClient {
  constructor(endpoint, port){
    this.getJwt = null
    this.states = {}
    this.client = new W3CWebSocket(`ws://${endpoint}:${port}/`)
    this.restUrl = `http://${endpoint}:${port}`
    this.wsIsOpen = false

    this.client.onopen = () => {
      this.wsIsOpen = true
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

  verifyUser() {
    this.sendMessage({ type: 'VERIFY_USER' })
  }

  async addState(key, setState) {
    this.states[key] = [null, setState] // Init with null if JWT is not available
    const initialValue = await this.initValue(key)
    setState(initialValue)
    this.states[key] = [initialValue, setState]
    this.sendMessage({ type: 'GET', key })
  }

  removeState(key) {
    delete this.states[key]
  }

  updateState(key, val){
    if(!this.states[key]) return
    if(this.states[key][0] === val) return
    this.sendMessage({ type: 'SET', key, value: val })
  }

  getState(key) {
    return this.states[key]
  }

  async setGetJwt(getJwt) {
    this.getJwt = getJwt
    await this.getJwt()
    await this.verifyUser()

    const promises = []

    Object.keys(this.states).filter(key => this.states[key][0] === null).map(key => {
      promises.push(this.initValue(key))
    })

    Promise.all(promises).then((values) => {
      values.map((obj) => {
        const key = Object.keys(obj)[0]
        const value = Object.values(obj)[0]
        this.states[key][1](value) // Update state
        this.states[key][0] = value
      })
    })
  }

  async sendMessage(message){
    if(!this.getJwt) {
      console.error('getJwt is not initialized')
    }
    const jwt = await this.getJwt()
    const formattedMessage = JSON.stringify({ ...message, jwt })
    this.wsIsOpen && this.client.send(formattedMessage)
  }

  async initValue(key) {
    return new Promise(async (resolve, reject) => {
      if(!this.getJwt) {
        console.error('getJwt is not initialized')
        reject()
        return
      }
      const jwt = await this.getJwt()
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
