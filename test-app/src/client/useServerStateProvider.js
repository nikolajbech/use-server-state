import { useEffect } from 'react'

import UseServerStateContext from './useServerStateContext'
import UseServerStateClient from './useServerStateClient'


export default function UseServerStateProvider({ children, endpoint, port }) {
	const serverState = new UseServerStateClient(endpoint, port)
	console.log("serverState created")

	return(
		<UseServerStateContext.Provider value={serverState}>
			{children}
		</UseServerStateContext.Provider>
	)
}