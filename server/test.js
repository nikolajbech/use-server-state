const { UseServerState } = require('./useServerState')

const db = {
  testUID: {
    test1Value: 20,
    test2Value: 30,
  }
}

const getUid = (jwt) => {
  return 'testUID'
}

const useServerState = new UseServerState(8000, getUid)

useServerState.add('test-value-1',
  (uid) => {
    return db[uid].test1Value
  },
  (uid, value) => {
    console.log("Changing DB", value)
    db[uid].test1Value = value
    return db[uid].test1Value
  }
)

useServerState.add('test-value-2',
  (uid) => {
    return db[uid].test2Value
  },
  (uid, value) => {
    console.log("Changing DB", value)
    db[uid].test2Value = value
    return db[uid].test2Value
  }
)
