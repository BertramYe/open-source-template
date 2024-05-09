
import { 
    Link,
    // Outlet 

} from "react-router-dom"



const  HomePage = ( ) => {
    return (
        <>
        <div> this is a project to show my own opensource template </div>
        <div> click to visit the <Link to={"/open-source-template/mover-resizer-rotater"}  className={"mover-resizer-rotater"} >mover-resizer-rotater</Link> </div>
        
        {/* <Outlet/> */}
        </>
       
    )
}


export default HomePage