# use-server-state


## Server

The server is initialized be creating a UseServerState object:

```javascript
const useServerState = new UseServerState(8000, getUid)
```

Keys can be added:

```javascript
useServerState.addKey(
  // Unique key:
  'test_key',

  // Getter:
  (uid) => {
    return db[uid].test_key || null
  },
  
  // Setter:
  (uid, value) => {
    db[uid].test_key = value
    return db[uid].test_key || null
  }
)
```

## client

The client is initialized be wrapping your app in UseServerStateProvider with the endpoint and port:

```javascript
<UseServerStateProvider endpoint="localhost" port="8000">
  <App />
</UseServerStateProvider>
```

State can be added:

```javascript
const [test, setTest] = useServerState('test_key', jwt)
```

When `setTest` is called with a new value, the value is saved on the server and all active sessions with the same userID will receive the new value.