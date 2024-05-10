
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MoverResizerRotaterPage from "@/pages/MoverResizerRotater";
import NotFoundPage from "@/pages/NotFound";
import TemplateHomePage from  '@/pages/TemplateHome'


const TemplateDetailsPages = () => {

    function GetTargetValidTemplate( input_template_name:string | null | undefined ) :[string, JSX.Element]
    {
        const [AvaliableTemplateNamesList,] =  useState({
            'mover-resizer-rotater':<MoverResizerRotaterPage />,
            'not-found': <NotFoundPage />,
            'template-home':< TemplateHomePage />
        })  
        
        if( input_template_name && input_template_name in AvaliableTemplateNamesList){
            let element = AvaliableTemplateNamesList[input_template_name as keyof typeof AvaliableTemplateNamesList]
            return [input_template_name,element]
        }else{
            return ['not-found', <NotFoundPage />]
        }
    }
    const rounterParams = useParams()
    console.log(rounterParams)
    let [ title, Element] = GetTargetValidTemplate(rounterParams.template_name)
    return (
        <>
            <PageHeader title={title}> 
                {Element}
            </PageHeader>
        </>
    )
}


export default TemplateDetailsPages