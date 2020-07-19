import React from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'

import axios from './utils/axios'

import Home from './screens/Home'
import Login from './screens/Login'

axios()

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path={'/'} component={Home} />
				<Route exact path={'/login'} component={Login} />
			</Switch>
		</BrowserRouter>
	)
}

export default App