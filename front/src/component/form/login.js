import React from "react"
import { Input } from 'antd';

export default function Login(props){

    //login
    function login(){

    }

    return(
        <div className='ed-form-c'>
            <input placeholder="Name:" className='ed-form-c-input'/>
            <input placeholder="Password:" className='ed-form-c-input'/>
            <button className='ed-form-c-submit' onClick={() => {login()}}>Login</button>
        </div>
    )
}