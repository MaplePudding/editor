import axios from "axios"
import React, {useState} from "react"
import { address } from "../../public"

export default function Signup(props){
    let [name, setName] = useState('')
    let [pwd, setPwd] = useState('')

    //检测输入合法性
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

    //signup
    function signup(){
        if (!checkInfo(name, pwd)) {
            alert("输入信息不合法")
            return;
        }

        axios.get(`${address}/signup?name=${name}&pwd=${pwd}`).then((res) =>{
            if(res.data.ret_code === 2){
                alert("注册失败")
            }else if(res.data.ret_code === 0){
                alert("注册成功")
            }
        })
    }

    return(
        <div className='ed-form-c'>
            <input placeholder="Name:" className='ed-form-c-input' onChange={(event) => {setName(event.target.value)}}/>
            <input placeholder="Password:" className='ed-form-c-input' onChange={(event) => {setPwd(event.target.value)}}/>
            <button className='ed-form-c-submit' onClick={() => {signup()}}>Signup</button>
        </div>
    )
}