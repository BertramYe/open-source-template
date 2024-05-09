
import { useEffect,useState } from 'react';
import {
    initTargetContainerMoveRoateResize,
    ScaledTargetContainerWithParentLabel,
    GetMoveResizeRotateParameters,
    SetMoveResizeRotateParameters,
} from 'mover-resizer-rotater';

import 'mover-resizer-rotater/index.css'
import Styles from '@/pages/MoverResizerRotater/index.module.css'



const MoverResizerRotaterPage = () => {
    // const [initialParameters1, setInitialParameters1] = useState<object>({
    //     x: 200,
    //     y: 100,
    //     width: 100,
    //     height: 100, 
    //     moverAvailable: true,                               // target label can be moved
    //     rotaterAvailable: ['n'],                            // target label's rotater
    //     resizerAvailable: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],    // target label's resizer
    //     // rotatersIconPath: './default-rotater-icon.svg'
    // });
    // const [initialParameters2, setInitialParameters2] = useState<object>({
    //     x: 200,
    //     y: 100,
    //     width: 100,
    //     height: 100, 
    //     moverAvailable: true,                               // target label can be moved
    //     rotaterAvailable: ['nw', 'ne', 'se', 'sw'],    // target label's rotater
    //     resizerAvailable: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],    // target label's resizer
    //     // rotatersIconPath: './default-rotater-icon.svg'
    // });
    
    const [initialParameters1,] = useState<object>({
        x: 200,
        y: 100,
        width: 100,
        height: 100, 
        moverAvailable: true,                               // target label can be moved
        rotaterAvailable: ['n'],                            // target label's rotater
        resizerAvailable: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],    // target label's resizer
        // rotatersIconPath: './default-rotater-icon.svg'
    });
    const [initialParameters2,] = useState<object>({
        x: 200,
        y: 100,
        width: 100,
        height: 100, 
        moverAvailable: true,                               // target label can be moved
        rotaterAvailable: ['nw', 'ne', 'se', 'sw'],    // target label's rotater
        resizerAvailable: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],    // target label's resizer
        // rotatersIconPath: './default-rotater-icon.svg'
    });


    
    
    const [emptyElement1, setEmptyElement1] = useState<HTMLElement | null>(null);
    const [emptyElement2, setEmptyElement2] = useState<HTMLElement | null>(null);
    const [scalePercent1, setScaledPercent1] = useState<number>(100);
    const [scalePercent2, setScaledPercent2] = useState<number>(100);
    const [emptyElement1Parms, setEmptyElement1Parms] = useState<string>('');
    const [emptyElement2Parms, setEmptyElement2Parms] = useState<string>('');

    useEffect(() => {
        let targetContainer1 = initTargetContainerMoveRoateResize('targetContainer1', initialParameters1)
        setEmptyElement1(targetContainer1)
        let targetContainer2 = initTargetContainerMoveRoateResize('targetContainer2', initialParameters2)
        setEmptyElement2(targetContainer2)

    }, [])

    const scaledContainer = (changeScaled:number) => {
        setScaledPercent1(scalePercent1 + changeScaled)
        SetMoveResizeRotateParameters(emptyElement1,{
            scalePercent:scalePercent1
        })
    }

    const scaledContainerWithParent = (changeScaled:number)=>{
        setScaledPercent2(scalePercent2 + changeScaled)
        ScaledTargetContainerWithParentLabel(emptyElement2,changeScaled)
    }

    const getAllParameters = () => {
        let strList = []
        for(let element of [emptyElement1,emptyElement2]){
            let params = GetMoveResizeRotateParameters(element)
            let str = JoinParametersString(params)
            strList.push(str)
        }
        setEmptyElement1Parms("Container1 Parameters:\n" + strList[0])
        setEmptyElement2Parms("Container2 Parameters:\n" + strList[1])
    }

    const JoinParametersString = (params:object|any)=> {
        let str:string = ""
        Object.keys(params).map((key,)=>{
            if(key !== 'rect'){
                str += `${key}:${params[key]}\n`
            }
        })
        return str
    }

    return (
        <>
            <div className={Styles.container}>
                <h1 className={Styles.title}> mover-resizer-rotater </h1>
                <div className={Styles.descriptions}>
                    <p> this is a simple project that coded with pure javascript and css, which help you can operate the html element Box with the functions of move, resize,rotate and scale as the same time. it supports pure html and all kinds of popular frontend frameworks, like `Vue/React/NextJS/Anglar` and so on. </p>
                </div>
                <div className={Styles.ScenarioTips}>
                    <p className={Styles.ScenarioTips1}>Scenario 1: No Parent Container</p>
                    <p className={Styles.ScenarioTips2}>Scenario 2: Have Parent Container</p>
                </div>
                <div className={Styles.showAreaContainer} >
                    <div id='targetContainer1' className={Styles.targetContainer}>
                        <span>Container1</span>
                    </div>
                    <div id='parentContainer' className={Styles.parentContainer}>
                        ParentContainer
                        <div id='targetContainer2' className={Styles.targetContainer}>
                            <span>Container2</span>  
                        </div>
                    </div>
                </div >

                <div className={Styles.controllersContainer}>
                    <h2> Controlers </h2>
                    <div className={Styles.scaledButtonContainer}>
                        <p className={Styles.controllerTips}>Scale Container Only</p>
                        <button className={Styles.increaseScaled}  onClick={()=>{scaledContainer(1)}}> scale up </button>
                        <input className={Styles.scalePercentValue}   type="text" value={scalePercent1 + '%'}  readOnly />
                        <button className={Styles.decreaseScaled } onClick={()=>{scaledContainer(-1)}}> scale down </button>
                    </div>
                    <br/>
                    <div className={Styles.scaledButtonContainer}>
                        <p className={Styles.controllerTips}>Scale width Parent Container</p>
                        <button className={Styles.increaseScaled}  onClick={()=>{scaledContainerWithParent(1)}}> scale up </button>
                        <input className={Styles.scalePercentValue}   type="text" value={scalePercent2 + '%'}  readOnly />
                        <button className={Styles.decreaseScaled} onClick={()=>{scaledContainerWithParent(-1)}}> scale down </button>
                    </div>
                    <br/>
                    <div className={Styles.scaledButtonContainer}>
                        <p className={Styles.controllerTips}>Get Mover Resizer Rotater Parameters</p>
                        <button className={Styles.paramsButton} onClick={getAllParameters}>click get params</button>
                    </div>
                    <br/>
                    <div className={Styles.backToGitHub}>
                        <a href='https://github.com/BertramYe/mover-resizer-rotater'>
                            <img alt="Static Badge" src="https://img.shields.io/badge/mover_resizer_rotater-%23198dfd?style=flat-square&logo=github&logoColor=black" />
                        </a>
                    </div>
                </div>
                <p>
                    {emptyElement1Parms}
                    <br/>
                    {emptyElement2Parms}
                </p>
            </div>
        </>
    )
}


export default MoverResizerRotaterPage