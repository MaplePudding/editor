import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { address } from '../../public'
import Qs from 'qs'
import saveImg from "./save.png";
import downloadImg from './download.png'

let timer = null

export default function EditBox(props){
    let [targetContentArr, setTargetContentArr] = useState([])
    let [getTargetContentArr2, setTargetContentArr2] = useState(null)
    
    let htmlContent = null
    setTimeout(() =>{htmlContent = document.getElementsByClassName('ed-editor-ex')[0]}, 0)

    function transformMDStrToHTML(MDStr){

        //处理标题
        if(MDStr.substring(0, 2) === '# '){
            return `<h1>${MDStr.substring(2)}</h1>`
        }else if(MDStr.substring(0, 3) === '## '){
            return `<h2>${MDStr.substring(3)}</h2>`
        }else if(MDStr.substring(0, 4) === '### '){
            return `<h3>${MDStr.substring(4)}</h3>`
        }else if(MDStr.substring(0, 5) === '#### '){
            return `<h4>${MDStr.substring(5)}</h4>`
        }else if(MDStr.substring(0, 6) === '##### '){
            return `<h5>${MDStr.substring(6)}</h5>`
        }else{
            if(MDStr === '<br>'){
                return MDStr
            }else if(/!\[.*\]\(.*\)/.test(MDStr)){
                //正则处理图片
                let roughAlt = /\[.*\]/.exec(MDStr)[0]
                let alt = `'${roughAlt.substring(1, roughAlt.length - 1)}'`
                let roughSrc = /\(.*\)/.exec(MDStr)[0]
                let src = `'${roughSrc.substring(1, roughSrc.length - 1).replace('/\\/g', '/')}'`;
                return `<img alt=${alt} src=${src}/>`
            }else{
                return MDStr
            }
        }
    }

    //正则解析html
    function getTargetContentArr(){
        let divArr = Array.from(htmlContent.getElementsByTagName('div'))
        let divContentArr = divArr.map((v, i, a) =>{
            return v.innerHTML
        })

        // md字符串转html
        let transformedContentArr = divContentArr.map((v, i, a) =>{
            return transformMDStrToHTML(v)
        })

        setTargetContentArr(transformedContentArr)

        console.log(transformedContentArr)
        //let chunkArr = (htmlContent.innerHTML + '').match(/<div>(.+)<\/div>/g)
        
        /**
         * for(let i = 0; i < chunkArr.length; ++i){
            chunkArr[i] = chunkArr[i].substring(5, chunkArr[i].length - 6)
            console.log(chunkArr[i])
        }
         */
    }



    function download(){

    }

    function save(){
        function getMdStr(){
            //转换成makrdown数组
            let mdStr = document.getElementsByClassName('ed-editor-ex')[0].innerHTML
            let tempArr = mdStr.replaceAll('<div>', '</div>').split("</div>")
            //替换所有的空字符串
            for(let i = 0; i < tempArr.length; ++i){
                if(tempArr[i] === '' || tempArr[i] === '<br>'){
                    tempArr[i] = '\n'
                }
            }

            let finalStr = ''
            //拼接markdown字符串
            for(let i = 0; i < tempArr.length; ++i){
                finalStr += tempArr[i]
            }
            return finalStr
        }
        let mdStr = getMdStr()
        let data = {name: 'mdStr', data: mdStr}

        axios.post(`${address}/save`, Qs.stringify(data)).then((res) =>{
            console.log(res.data)
        })
    }

    
    // 防抖处理，防止调用栈爆炸
    function onChange(event){
        if(!timer){
            timer = setTimeout(() =>{getTargetContentArr(); timer = null}, 1100)
        }
    }

    //触发父组件重渲染
    useEffect(() =>{
        props.setTargetContentArr(targetContentArr)
    })

    useEffect(() =>{
        setInterval(() =>{
            save()
        }, 60000)
    }, [])


    return(
        <React.Fragment>
        <div className='ed-editor-toolBox'>
            <div className='ed-editor-toolBox-i' onClick={() =>{save()}}>Save<img src={saveImg} alt="Save"/></div>
            <div className='ed-editor-toolBox-i' onClick={() =>{download()}}>Download<img src={downloadImg}  alt="Download"/></div>
        </div>
        <div className='ed-editor-ex' contentEditable="true" onInput={() =>{onChange()}} >
            //Please write markdown at the back
        </div>
        </React.Fragment>
    )
}