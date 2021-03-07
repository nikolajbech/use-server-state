# use-server-state


## Server

The server is initialized be creating a UseServerState object:

```javascript
const useServerState = new UseServerState(8000, getUid) // port, method to get uid from jwt
```

Keys can be added:

```javascript
useServerState.addKey('test_key',
  (uid) => {
    return db[uid].test_key || null
  },
  (uid, value) => {
    db[uid].test_key = value
    return db[uid].test_key || null
  }
)
```

## client

The client is initialized at a top-level by creating a UseServerStateClient object:

```javascript
const serverState = new UseServerStateClient('localhost', '8000')
```

State can be added:

```javascript
const [test, setTest] = useServerState('test_key')
```

When `setTest` is called with a new value, the value is saved on the server and all active sessions with the same userID will receive the new value.