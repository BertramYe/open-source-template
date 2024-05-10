import { 
    createBrowserRouter,
} from "react-router-dom";



import { Suspense} from 'react'; // 延迟加载缓冲
import TemplateDetailsPages from "@/pages/TemplateDetails";
import TemplateHomePage from  '@/pages/TemplateHome'

const router = createBrowserRouter([
    {   path:'/open-source-template',
        element:(
            <Suspense  fallback={<div>Loading...</div>} > 
                <TemplateHomePage />
            </Suspense  >  
        )
    },
    {
        path:'/open-source-template/:template_name',
        element: (
            <Suspense  fallback={<div>Loading...</div>} >   
                <TemplateDetailsPages /> 
            </Suspense>
        ),
    },
])


export default router