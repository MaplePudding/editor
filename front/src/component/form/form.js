import React, { useEffect, useState} from 'react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'
import Login from './login'
import Signup from './signup'
import './form.css'

export default function Form(props) {
    let [headChecked, setHeadChecked] = useState(true)

    function autoLogin() {
        return true
    }

    function changeStyle(){
        setHeadChecked(!headChecked)
    }

    // 自动登录
    useEffect(() => {
        if (autoLogin()) {
            console.log("Has been login")
        }
    }, [])

    return (
        <div className='ed-form'>
            <div className='ed-form-h'>
                <Link className={'ed-form-h-l' + (headChecked ? ' ed-form-l-checked': '')} to='/form/login' onClick={() =>{changeStyle()}}>
                    Login
                </Link>
                <Link className={'ed-form-h-l' + (!headChecked ? ' ed-form-l-checked': '')} to='/form/signup' onClick={() =>{changeStyle()}}>
                    Signup
                </Link>
            </div>
            <div className='ed-form-x'>
                <Switch>
                    <Route path='/form/login' component={Login} />
                    <Route path='/form/signup' component={Signup} />
                    <Redirect exact path='/form' to='/form/login' />
                </Switch>
            </div>
        </div>
    )
}