import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { address } from '../../public'
import axios from 'axios'
import Login from './login'
import Signup from './signup'
import './form.css'

export default function Form(props) {
    let [headChecked, setHeadChecked] = useState(true)

    //默认携带cookie
    axios.defaults.withCredentials = true

    function autoLogin() {
        axios.get(`${address}/autoLogin`).then((res) =>{
            if(res.data.ret_code === 0){
                props.history.replace('/editor')
            }
        })
    }

    function changeStyle() {
        setHeadChecked(!headChecked)
    }

    // 自动登录
    useEffect(() => {
    autoLogin()
    }, [])

    return (
        <div className='ed-form'>
            <div className='ed-form-h'>
                <Link className={'ed-form-h-l' + (headChecked ? ' ed-form-l-checked' : '')} to='/form/login' onClick={() => { changeStyle() }}>
                    Login
                </Link>
                <Link className={'ed-form-h-l' + (!headChecked ? ' ed-form-l-checked' : '')} to='/form/signup' onClick={() => { changeStyle() }}>
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