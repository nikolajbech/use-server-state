const { UseServerState } = require('./useServerState')

const db = {
  testUID: {
    testValue: 20
  }
}

const getUid = (jwt) => {
  return 'testUID'
}

const useServerState = new UseServerState(8000, getUid)

useServerState.add('test-value',
  (uid) => {
    return db[uid].testValue
  },
  (uid, value) => {
    console.log("Changing DB", value)
    db[uid].testValue = value
    return db[uid].testValue
  }
)
