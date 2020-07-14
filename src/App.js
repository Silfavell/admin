import React from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'

import Login from './screens/Login'
import Register from './screens/Register'
import Activation from './screens/Activation'
import Home from './screens/Home'
import Details from './screens/Details'

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path={'/'} component={Home} />
				<Route path={'/login'} component={Login} />
				<Route path={'/register'} component={Register} />
				<Route path={'/activation'} component={Activation} />
				<Route path={'/details/:id'} component={Details} />
			</Switch>
		</BrowserRouter>
	)
}

export default App