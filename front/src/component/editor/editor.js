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
        axios.get(`${address}/login`).then((res) =>{
            if(res.data.ret_code === 0){
                props.history.replace('/editor')
            }
        })
        return true
    }

    useEffect(() =>{
        if(autoLogin()){
            console.log("login success")
        }else{
            props.history.replace('/form')
        }
    }, [])

    function download(){

    }

    function save(){

    }
    return(
        <div className='ed-editor'>
            <div className='ed-editor-toolBox'>
                <div className='ed-editor-toolBox-i' onClick={save}>Save<img src={saveImg} alt="Save"/></div>
                <div className='ed-editor-toolBox-i' onClick={download}>Download<img src={downloadImg}  alt="Download"/></div>
            </div>
            <div className='ed-editor-content'>
                    <EditBox setTargetContentArr={setTargetContentArr}/>
                    <PreBox targetContentArr={targetContentArr}/>
            </div>
        </div>
    )
}