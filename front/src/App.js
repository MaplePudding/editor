import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import React from 'react'
import Form from './component/form/form';
import Editor from './component/editor/editor';
import './App.css';

function App() {



	return (
		<div className="ed-app">
			<div className="ed-h">
				<span className='ed-h-inner'>&nbsp;E&nbsp;D&nbsp;I&nbsp;T&nbsp;O&nbsp;R&nbsp;</span>
			</div>
			<BrowserRouter>
				<div className='ed-x'>
					<Switch>
						<Route path='/form' component={Form} />
						<Route path='/editor' component={Editor} />
						<Redirect exact path='/' to='/form' />
					</Switch>
				</div>
			</BrowserRouter>
		</div>
	)
}

export default App;
