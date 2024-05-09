import { 
    createBrowserRouter,
    // createHashRouter,
      
} from "react-router-dom";
import HomePage from "@/pages/Home";
import MoverResizerRotaterPage from "@/pages/MoverResizerRotater";
import PageHeader from "@/components/PageHeader";

import { Suspense} from 'react'; // 延迟加载缓冲


const router = createBrowserRouter([
    {
        path:'/open-source-template',
        element: (
            <Suspense  fallback={<div>Loading...</div>} >   
                <PageHeader title="Home Page"> <HomePage />  </PageHeader> 
            </Suspense>
        ),
        
    },
    {
        path:'/open-source-template/mover-resizer-rotater',
        element:  (
            <Suspense  fallback={<div>Loading...</div>} >   
            <PageHeader title="mover-resizer-rotater">  <MoverResizerRotaterPage/> </PageHeader>
            </Suspense>
        )
    }

])


export default router