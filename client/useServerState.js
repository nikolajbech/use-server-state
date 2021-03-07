import { useState, useContext, useEffect } from 'react'
import ServerStateContext from './useServerStateContext'

export function useServerState(key) {
  const serverState = useContext(ServerStateContext)
  const [state, setState] = useState()
  
  useEffect(() => {
    initVal()
    return () => serverState.removeState(key)
  },[key])

  const initVal = async () => {
    serverState.addState(key, setState)
  }

  const setStateWrapper = (val) => {
    serverState.updateState(key, val)
  }

  return [state, setStateWrapper]
}
