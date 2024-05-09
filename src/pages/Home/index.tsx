
import { Link } from "react-router-dom"


const  HomePage = ( ) => {
    return (
        <>
        
        <div> this is a project to show my own opensource template </div>
        <div> click to visit the <Link to={"/mover-resizer-rotater"}  className={"mover-resizer-rotater"} >mover-resizer-rotater</Link> </div>
        
        </>
       
    )
}


export default HomePage