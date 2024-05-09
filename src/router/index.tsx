import { 
    // createBrowserRouter,
    createHashRouter 
} from "react-router-dom";
import HomePage from "@/pages/Home";
import MoverResizerRotaterPage from "@/pages/MoverResizerRotater";
import PageHeader from "@/components/PageHeader";


const router = createHashRouter([
    {
        path:'/open-source-template/',
        element: <PageHeader title="Home Page"> <HomePage />  </PageHeader>   , 
    },
    {
        path:'/mover-resizer-rotater',
        element:  <PageHeader title="mover-resizer-rotater">  <MoverResizerRotaterPage/> </PageHeader>        
    }

])


export default router