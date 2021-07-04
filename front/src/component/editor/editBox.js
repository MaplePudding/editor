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
        if(/#+ .*/.test(MDStr)){
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
            }
        }else if(MDStr === '<br>'){
            //换行
            return MDStr
        }else if(/!\[.*\]\(.*\)/.test(MDStr)) {
            //正则处理图片
            let roughAlt = /\[.*\]/.exec(MDStr)[0]
            let alt = `'${roughAlt.substring(1, roughAlt.length - 1)}'`
            let roughSrc = /\(.*\)/.exec(MDStr)[0]
            let src = `'${roughSrc.substring(1, roughSrc.length - 1).replace('/\\/g', '/')}'`;
            return `<img alt=${alt} src=${src}/>`
        }else if(/\[.*\]\(.*\)/.test(MDStr)){
            //正则处理link
            let roughTitle = /\[.*\]/.exec(MDStr)[0]
            let title = `${roughTitle.substring(1, roughTitle.length - 1)}`
            let roughHref = /\(.*\)/.exec(MDStr)[0]
            let href = `${roughHref.substring(1, roughHref.length - 1).replace('/\\/g', '/')}`;
            return `<a href="${href}" style="text-decoration:underline;">${title}</a>`
        }else if(MDStr && MDStr.split("* ")[0] != MDStr){
                // 列表
                let res = ''
                let arr = MDStr.split("* ")
                for(let i = 0; i < arr.length; ++i){
                    if(arr[i]){
                        res += `<li>${arr[i]}</li>`
                    }
                }
                return '<ul>' + res + '</ul>'
        }else if(MDStr && MDStr.split("+ ")[0] != MDStr){
                // 列表
                let res = ''
                let arr = MDStr.split("+ ")
                for(let i = 0; i < arr.length; ++i){
                    if(arr[i]){
                        res += `<li>${arr[i]}</li>`
                    }
                }
                return '<ul>' + res + '</ul>'
        }else if(MDStr && MDStr.split("- ")[0] != MDStr) {
                // 列表
                let res = ''
                let arr = MDStr.split("- ")
                for (let i = 0; i < arr.length; ++i) {
                    if (arr[i]) {
                        res += `<li>${arr[i]}</li>`
                    }
                }
                return '<ul>' + res + '</ul>'
        }else{
            let biFlag = false
            let boldFlag = false
            let italicFlag = false
            let deleteFlag = false

            //预览斜体加粗
            while(MDStr.indexOf('***') != -1){
                if(!biFlag){
                    MDStr = MDStr.replace('***', '<b><i>')
                }else{
                    MDStr = MDStr.replace('***', '</i></b>')
                }
                biFlag = !biFlag
            }

            //预览加粗
            while(MDStr.indexOf('**') != -1){
                if(!boldFlag){
                    MDStr = MDStr.replace('**', '<b>')
                }else{
                    MDStr = MDStr.replace('**', '</b>')
                }
                boldFlag = !boldFlag
            }

            console.log(MDStr)

            //预览斜体
            while(MDStr.indexOf('*') != -1){
                if(!italicFlag){
                    MDStr = MDStr.replace('*', '<i>')
                }else{
                    MDStr = MDStr.replace('*', '</i>')
                }
                italicFlag = !italicFlag
            }

            //预览删除线
            while(MDStr.indexOf('~~') != -1){
                if(!deleteFlag){
                    MDStr = MDStr.replace('~~', '<del>')
                }else{
                    MDStr = MDStr.replace('~~', '</del>')
                }
                deleteFlag = !deleteFlag
            }
            return MDStr
        }

    }

    //正则解析html
    function getTargetContentArr(){
        let divArr = Array.from(htmlContent.getElementsByTagName('div'))

        let divContentArr = divArr.map((v, i, a) =>{
            return v.innerHTML
        })

        console.log(divContentArr)

        // md字符串转html
        let transformedContentArr = divContentArr.map((v, i, a) =>{
            return transformMDStrToHTML(v)
        })

        setTargetContentArr(transformedContentArr)

        //let chunkArr = (htmlContent.innerHTML + '').match(/<div>(.+)<\/div>/g)
        
        /**
         * for(let i = 0; i < chunkArr.length; ++i){
            chunkArr[i] = chunkArr[i].substring(5, chunkArr[i].length - 6)
            console.log(chunkArr[i])
        }
         */
    }


    function save(){
        function getMdStr(){
            //转换成makrdown数组
            let mdStr = document.getElementsByClassName('ed-editor-ex')[0].innerHTML
            let tempArr = mdStr.replaceAll('<div></div>', '').replaceAll('<div>', '').split("</div>")

            tempArr = tempArr.filter((val, i, arr) =>{return val != ''})

            //替换所有的空字符串
            for(let i = 0; i < tempArr.length; ++i){
                if(tempArr[i] === '' || tempArr[i] === '<br>'){
                    tempArr[i] = '\n'
                }
            }

            let finalStr = ''
            //拼接markdown字符串
            for(let i = 0; i < tempArr.length; ++i){
                finalStr = finalStr + tempArr[i] + '\n'
            }
            return finalStr
        }
        let mdStr = getMdStr()
        let data = {name: 'mdStr', data: mdStr}

        axios.post(`${address}/save`, Qs.stringify(data)).then((res) =>{
            console.log("save")
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

    // 自动保存
    useEffect(() =>{
        setInterval(() =>{
            save()
        }, 60000)
        console.log("save")
    }, [])

    //登录后获取文件内容

    useEffect(() =>{
        setTimeout(() =>{
            axios.get(`${address}/read`).then((res) =>{
                let tempArr = res.data.split('\n')
                //替换\n 包装上div
                console.log(tempArr)
                for(let i = 0; i < tempArr.length; ++i){
                    if(tempArr[i] === '\n'){
                        tempArr[i] = '<div> </div>'
                    }else{
                        tempArr[i] = `<div>${tempArr[i]}</div>`
                    }
                }



                //拼接html字符串
                let htmlStr = ''
                for(let i = 0; i < tempArr.length; ++i){
                    htmlStr += tempArr[i]
                }
                // 写入html字符串
                document.getElementsByClassName('ed-editor-ex')[0].innerHTML = htmlStr

            })
        }, 500)
    }, [])


    return(
        <React.Fragment>
        <div className='ed-editor-toolBox'>
            <div className='ed-editor-toolBox-i' onClick={() =>{save()}}>Save<img src={saveImg} alt="Save"/></div>
            <div className='ed-editor-toolBox-i'  >Download<a href={`${address}/download`} download='markdown.md'><img src={downloadImg}  alt="Download" /></a></div>
        </div>
        <div className='ed-editor-ex' contentEditable="true" onInput={() =>{onChange()}} >
        </div>
        </React.Fragment>
    )
}