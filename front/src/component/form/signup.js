export default function Signup(props){
    //signup
    function signup(){

    }

    return(
        <div className='ed-form-c'>
            <input placeholder="Name:" className='ed-form-c-input'/>
            <input placeholder="Password:" className='ed-form-c-input'/>
            <button className='ed-form-c-submit' onClick={() => {signup()}}>Signup</button>
        </div>
    )
}