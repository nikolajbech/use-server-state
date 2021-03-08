import { useContext } from 'react'

import UseServerStateContext from './useServerStateContext'
import UseServerStateClient from './useServerStateClient'

export default function UseServerStateProvider({ children, endpoint, port }) {

	const serverState = new UseServerStateClient(endpoint, port)
	
	return(
		<UseServerStateContext.Provider value={serverState}>
			{children}
		</UseServerStateContext.Provider>
	)
}