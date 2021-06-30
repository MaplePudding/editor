import React, {useEffect, useState} from 'react'
import PreBox from './preBox'
import EditBox from './editBox'
import { address } from '../../public'
import axios from 'axios'
import saveImg from './save.png'
import downloadImg from './download.png'
import './editor.css'

export default function Editor(props){
    let [targetContentArr, setTargetContentArr] = useState([])
    //检测是否登录过
    function autoLogin() {
        axios.get(`${address}/autoLogin`).then((res) =>{
            if(res.data.ret_code === 0){
                return true
            }else{
                props.history.replace('/form')
            }
        })
    }


    useEffect(() =>{
    autoLogin()
    }, [])


    return(
        <div className='ed-editor'>
            <div className='ed-editor-content'>
                    <EditBox setTargetContentArr={setTargetContentArr} />
                    <PreBox targetContentArr={targetContentArr} />
            </div>
        </div>
    )
}