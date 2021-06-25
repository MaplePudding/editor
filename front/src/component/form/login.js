import React, { useState } from "react"
import { address } from "../../public"
import axios from 'axios'
import { Alert } from 'antd';


export default function Login(props) {
    let [name, setName] = useState('')
    let [pwd, setPwd] = useState('')

    //login
    function login() {
        if (!checkInfo(name, pwd)) {
            alert("输入信息不合法")
            return;
        }

        axios.get(`${address}/login?name=${name}&pwd=${pwd}`)
            .then((res) => {
                if(res.data.ret_code === 0){
                    props.history.replace('/editor')
                }
            })
    }

    function checkInfo(str1, str2) {
        if(str1.length < 1 || str2.length < 1){
            return false
        }

        if (str1.length > 10 || str2.length > 10) {
            return false
        }

        if (str1.indexOf('*') !== -1 || str2.indexOf('*') !== -1) {
            return false
        }

        return true
    }

    return (
        <div className='ed-form-c'>
            <input placeholder="Name:" className='ed-form-c-input' onChange={(event) => { setName(event.target.value) }} />
            <input placeholder="Password:" className='ed-form-c-input' onChange={(event) => { setPwd(event.target.value) }} />
            <button className='ed-form-c-submit' onClick={() => { login() }} >Login</button>
        </div>
    )
}