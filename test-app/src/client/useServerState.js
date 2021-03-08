import { useState, useContext, useEffect } from 'react'
import ServerStateContext from './useServerStateContext'

export function useServerState(key, jwt) {
  const serverState = useContext(ServerStateContext)
  const [state, setState] = useState()
  
  useEffect(() => {
    console.log("useServerState created with key", key)
    initVal()
    return () => serverState.removeState(key)
  },[key])

  const initVal = async () => {
    serverState.addState(key, setState, jwt)
  }

  const setStateWrapper = (val) => {
    console.log("Changing", key, "to", val)
    serverState.updateState(key, val, jwt)
  }

  return [state, setStateWrapper]
}
