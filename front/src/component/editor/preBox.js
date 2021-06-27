import React, {useState}from 'react'

export default function PreBox(props){
    function initHtmlStr(htmlArr){
        let htmlStr = ''
        for(let i = 0; i < htmlArr.length; ++i){
            htmlStr += htmlArr[i]
        }
        return htmlStr
    }

    setTimeout(() =>{
        let prex = document.getElementsByClassName('ed-editor-prex')[0]
        prex.innerHTML = initHtmlStr(props.targetContentArr)
    }, 0)
    

    return(
        <div className='ed-editor-prex'>
            
        </div>
    )
}