import Styles from '@/pages/3DThreeJS/index.module.css'
import { useState,useRef, useEffect } from 'react'
import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import * as mergeBufferGeometries from 'three/addons/utils/BufferGeometryUtils.js';


type InitialSceneType = [
    THREE.PerspectiveCamera,
    THREE.Scene,
    THREE.WebGLRenderer
]

type LoadedGeometriesDictType ={
    [key:string]:THREE.BufferGeometry
}

type LoadedGeometriesListType = [
    string,THREE.BufferGeometry
]



// type LoadedMeshesDictType = {
//     [key:string]:THREE.Mesh
// }

function InitialScene(width:number,height:number):InitialSceneType{
    const scene = new THREE.Scene()
    const render = new THREE.WebGLRenderer()
    // set camera
    const camera = new THREE.PerspectiveCamera()
    // define camera view's canvas width and height proportion as the aspect
    camera.fov = 60
    camera.aspect = width / height
    camera.near = 0.1
    camera.far = 500

    // const camera = new THREE.PerspectiveCamera(front_view,aspect,near_distance,far_distance)
    camera.position.set(0,-20,0)  // x,y,z
    camera.lookAt(0,0,0);        // look at the original position
    // camera.lookAt(mesh.position)  // look at the object position 
    render.setSize(width, height);
    // 设置透明背景，这样使得样式和我想的一样父容器的背景色一样
    render.setClearColor(0x000000, 0); // 设置透明背景

    //  环境光
    let enviromentLignt = new THREE.HemisphereLight();
    scene.add(enviromentLignt);
    //  直线光，用于投影
    let directionalLighter = new THREE.DirectionalLight(0Xffffff, 1.0)
    //  投影光线
    // directionalLighter.target = mesh 
    directionalLighter.position.set(0, -50, 20)
    // directionalLighter.position.set(20, 30, -5);
    // turn on the shadow
    directionalLighter.castShadow = true;
    // the shadow scope
    directionalLighter.shadow.mapSize.width = 1024;
    directionalLighter.shadow.mapSize.height = 1024;
    directionalLighter.shadow.bias = -0.5;
    // directionalLighter.shadow.bias = -0.0005; // 调整bias以减少阴影失真
    directionalLighter.shadow.camera.near = 1;
    directionalLighter.shadow.camera.far = 100;
    // directionalLighter.shadow.camera.bottom = 45;
    scene.add(directionalLighter)

    // // 坐标轴 Coordinate  AxesHelper 
    // const axesHelper = new AxesHelper(8000);
    // // // // 将坐标轴添加到场景中
    // scene.add(axesHelper);

    //  添加灯光的方向显示
    // const lighterhelper = new DirectionalLightHelper(directionalLighter, 10)
    // scene.add(lighterhelper);

    // 每次都重置
    return [camera,scene,render]
}


// function CreateMeshes(){
//     // material
//     const geometry = new THREE.BoxGeometry(50,50,50)  // length,width,height 
//     const material = new THREE.MeshBasicMaterial(
//         {
//             color:0x0000ff
//         }
//     )
//     // mesh objects
//     const mesh = new THREE.Mesh(geometry,material)
//     return mesh
// }

function GetPredifineAvailableCharsList():string[]{
    const availableCharsList = "abcdefghijklmnopqrstuvxyz1234567890ABCDEFGHIJKLMNOPQRSTUVXYZ".split('')
    return availableCharsList
}



function PreHandleInputChars(inputChars:string):string[]{
    let handledCharsList:string[] = []
    const CharsList = GetPredifineAvailableCharsList()
    let inputCharsList = inputChars.trim().split('')
    if(inputCharsList.length > 0){
        for(let input_char of inputCharsList){
            let clear_input_char = input_char.trim()
            if(CharsList.indexOf(clear_input_char) > -1){
                handledCharsList.push(clear_input_char)
            }else{
                if(input_char!=""){
                    alert(`【${clear_input_char}】 is invalid input , because 【${clear_input_char}】 3d model has not been built yet, please get rid of this char and try again! `)
                    handledCharsList = []
                    break
                }
            }
        }

    }else{
        alert("input chars can't be empty!")
    }
    return handledCharsList
}





function GetGeometryMesh(charKey:string,geometry:THREE.BufferGeometry):THREE.Mesh {
    let mesh: THREE.Mesh;
    let material: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial;
    // 这个center很关键，只有设置了这个center，我们才可以获取到对应的 boundingBox的值，否则都是null
    geometry.center();
    // geometry.attributes.position.needsUpdate = true; // 更新数据，才能有下面的计算
    if (charKey == 'brick') {
        // brick
        material = new THREE.MeshLambertMaterial({ color: 'white' });//{ color: 0x00ffff }
        mesh = new THREE.Mesh(geometry, material);
        // open the shadow 
        mesh.castShadow = true;
        mesh.scale.setX(1)
        mesh.scale.setY(0.1)
        mesh.scale.setZ(0.1)
        // brick  receive shadow
        mesh.receiveShadow = true;
        // let avrg_word_width = (targetGeometry.boundingBox.max.x - targetGeometry.boundingBox.min.x) / (strInputLength)
        // let word_start_x = - (targetGeometry.boundingBox.max.x - targetGeometry.boundingBox.min.x) / 2 - 1
    } else {
        material = new THREE.MeshStandardMaterial({ color: 'white' });//{ color: 0x00ffff }
        mesh = new THREE.Mesh(geometry, material);
        // open the shadow 
        mesh.castShadow = true;
        // set the z position
        let targetBoundingBox = geometry.boundingBox as THREE.Box3
        let char_height = targetBoundingBox.max.z - targetBoundingBox.min.z
        let char_z = char_height / 2
        mesh.position.setZ(char_z * 0.1)
    }
    mesh.name = charKey
    return mesh
}


function GetStlFilePath(char:string):string | undefined {
    // filter with regexp
    let lower_parttern = new RegExp("[a-z]+");
    let number_parttern = new RegExp("[0-9]+");
    let upper_parttern = new RegExp("[A-Z]+");
    switch (char) {
        case 'brick':
            return "./threejs3dstl/mattoncino.stl"
        // 可以有任意多个 case 子句
        default:
            // let char = char_strings.charAt(i)
            if (lower_parttern.test(char)) {
                return "./threejs3dstl/lower/" + char + ".stl"
            } else if (number_parttern.test(char)) {
                return "./threejs3dstl/number/" + char + ".stl"
            } else if (upper_parttern.test(char)) {
                return "./threejs3dstl/upper/" + char + ".stl"
            } else {
                alert(`load resource failed, error: target resource ${char} not existed!,please help refresh the page and try again!`)
                return undefined
        }
    }
}


function PreLoadStlFiles(availableCharsList:string[]){
    const loader = new STLLoader();
    if(!availableCharsList.includes('brick')){
        availableCharsList.push('brick')
    }
    return availableCharsList.map((key)=>{
        let path = GetStlFilePath(key)
        return new Promise((resolve,reject)=>{
            if(path){
                loader.loadAsync(path)
                .then((geometry) => {
                    resolve([key,geometry])
                })
                .catch((error)=>{
                    reject(error)
                })
            }
        })
    }) 
}


//  计算目标char的缩放比例
function CaculateTargetCharScalePercent(targetCharsList: string[], avrgWordWidth: number, LoadedGeometries:LoadedGeometriesDictType):[number,THREE.Mesh[]] {
    let averge_scale_size = 0.2;
    let default_averge_scale_size = 0.1
    let total_temp_scale_size = 0
    let totalChars:number = targetCharsList.length
    let TargetCharsMeshesList:THREE.Mesh[] = []

    targetCharsList.map((char:string)=>{
        let char_mesh = GetGeometryMesh(char,LoadedGeometries[char])
        
        // words
        let geometry_box = char_mesh.geometry.boundingBox as THREE.Box3
        // 实际的大小
        let char_width = geometry_box.max.x - geometry_box.min.x
        //  算出缩放比例
        let temp_scale_size = char_width / avrgWordWidth
        //  计算总共的缩放比例，准备最后求平均值
        total_temp_scale_size += temp_scale_size
        TargetCharsMeshesList.push(char_mesh)
    })
    // 计算平均缩放的尺度
    averge_scale_size = (total_temp_scale_size / totalChars) < default_averge_scale_size ? (total_temp_scale_size / totalChars) : default_averge_scale_size;
    return [averge_scale_size,TargetCharsMeshesList]

}


function GetTargetStlMeshes(inputChars:string,LoadedGeometriesDict:LoadedGeometriesDictType):THREE.Mesh[]{
    let handledCharsList = PreHandleInputChars(inputChars)
    let targetMeshesList:THREE.Mesh[] = []
    let total_chars_number:number = handledCharsList.length
    if(total_chars_number> 0){
        let brick_geometry = LoadedGeometriesDict['brick']
        let brick_mesh = GetGeometryMesh('brick',brick_geometry)
        targetMeshesList.push(brick_mesh)
        // 根据brick的长宽高计算目标的chars的摆放位置以及缩小的宽高信息
        let brick_mesh_box = brick_mesh.geometry.boundingBox as THREE.Box3
        let brickGeometryWidth = brick_mesh_box.max.x - brick_mesh_box.min.x
        let avrg_word_width = brickGeometryWidth / (total_chars_number)
        let word_start_x = - ((brickGeometryWidth) / 2 - 1)
        let [average_char_scale,target_meshes_list] = CaculateTargetCharScalePercent(handledCharsList,avrg_word_width,LoadedGeometriesDict)
        
        for(let i = 0; i< target_meshes_list.length; i ++ ){
            //  下面这里使用clone的原因是，如果不clone，那么这里面得到的还只是最初的引用，这会导致最终显示只能对于同种mesh,只显示最后一个，scene会自动去重
            // let char_mesh = LoadedMeshesDict[handledCharsList[i]].clone(true)
            // let char_geometry = LoadedGeometriesDict[handledCharsList[i]]
            // let char_mesh = GetGeometryMesh(handledCharsList[i],char_geometry)
            let char_mesh = target_meshes_list[i]
            
            // set every word start positions
            let Actul_start_x = word_start_x + avrg_word_width * i
            char_mesh.position.setX(Actul_start_x);
            char_mesh.scale.set(average_char_scale, average_char_scale, average_char_scale)
            // 这里直接 使用以上的index 来做，目的是如果是字典的话，可能导致队医重复字母的生成不准确
            targetMeshesList.push(char_mesh)
        }
    }
    return targetMeshesList
}


function exportSTL(target_Meshes_list:THREE.Mesh[], finalSTLName:string) {
    // get all of the merged meshed
    let stl_saved = false;
    try{
        // var mergeMeshes = MergeTargetMesh(scene, "all")
        let mergeMeshes = MergeTargetMesh(target_Meshes_list, "all")
        if (mergeMeshes) {
            let exporter = new STLExporter();
            let stlData = exporter.parse(mergeMeshes);
            // save stl files
            let blob = new Blob([stlData], { type: 'text/plain' });
            // create a blob to download the files
            let url = URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.id = "downloadstl"
            link.href = url;
            link.download = finalSTLName + '.stl';
            link.click();
            document.getElementById("downloadstl")?.remove()
            // document.body.remove() // download finished and remove the target element
            // window.URL.revokeObjectURL(href); release blob

            // console.log("userSaveSTLPath:",userSaveSTLPath,"url:",url)
            // location.reload();
            stl_saved = true;
        }
    }
    catch(error){
        alert(`error to save stl files: error:${error}`)
    }
    return stl_saved; 
}



function MergeTargetMesh(TargetMeshesList:THREE.Mesh[], type:string) {
    let mesh_geometry_list:THREE.BufferGeometry[] = []
    var material_list:THREE.MeshStandardMaterial[] = []
    // pick and transfer  the target into the matrixWorld
    TargetMeshesList.map((mesh)=>{
        switch (type){
            case 'words':
                if(mesh.name != 'brick'){
                    let matrixWorldGeometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
                    mesh_geometry_list.push(matrixWorldGeometry);
                }
                break;
            case 'brick':
                if (mesh.name == 'brick') {
                    let matrixWorldGeometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
                    mesh_geometry_list.push(matrixWorldGeometry);
                }
                break;
            default:  // 'all'
                // tranfer all of the material as the standerd material
                let mesh_material = mesh.material as THREE.MeshBasicMaterial

                let materialcolor = new THREE.Color(mesh_material.color.r, mesh_material.color.g, mesh_material.color.b)
                let new_material = new THREE.MeshStandardMaterial({
                    color: materialcolor,
                })
                material_list.push(new_material)
                let matrixWorldGeometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
                mesh_geometry_list.push(matrixWorldGeometry)
                break;
        }
            
    })
    
    // begin to merge
    // type : brick, just return the brick mesh
    // type : words, just merge the words mesh into a new mesh
    // type : all , just merge all of the mesh, including the mesh and the brick
    if (type === "brick") {
        let mergedGeometry = mergeBufferGeometries.mergeGeometries(mesh_geometry_list, true);
        // merge different words into one merge but without set any color or something
        let mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
        return mergedMesh
    } else if (type === "words") {
        let mergedGeometry = mergeBufferGeometries.mergeGeometries(mesh_geometry_list, true);
        // merge different words into one merge but without set any color or something
        let mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
        return mergedMesh
    } else {
        let mergedGeometry = mergeBufferGeometries.mergeGeometries(mesh_geometry_list, true);
        // mutiple materials can merged into one with the diferent materils and colos like below
        // var mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
        let mergedMesh = new THREE.Mesh(mergedGeometry, material_list);
        // console.log("mergedMesh",mergedMesh)
        return mergedMesh
    }

}




const ThreeJS3DPage = () => {
    const [width,] = useState<number>(window.innerWidth * 0.5)
    const [height,] = useState<number>(window.innerHeight * 0.5);
    const guiContainerRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null) 
    let [camera,scene,render]:InitialSceneType = InitialScene(width,height)


    const [inputChars,SetInputChars] = useState<string>('') 
    const availableCharsList = useRef([...GetPredifineAvailableCharsList()]) 
    const [LoadedGeometriesDict,SetLoadedGeometriesDict] = useState<LoadedGeometriesDictType>({})
    const [availableDownload,SetAvaliableDownload] = useState<boolean>(false)
    

    //  { autoPlace: false } 这个配置对象告诉 dat.GUI 不要自动创建 GUI 元素并将其添加到页面上，而是让我们手动控制 GUI 元素的放置。
    // 即，将 autoPlace 设置为 false 时，dat.GUI 不会自动将 GUI 面板添加到 document.body。
    const gui = useRef<GUI>(new GUI({ autoPlace: false }))

    //  初始化设置
    function InitialGui(){
        gui.current.destroy()
        // 下面这两种方式清理gui的folder是不行的
        // gui.current.folders.length = 0
        // gui.current.children.length = 0
        gui.current.domElement.style.width = width * 0.5 * 0.5 + "px"
        guiContainerRef.current?.append(gui.current.domElement)
    }
    
    //  重置gui自身的子空间
    function AddGuiControlers(targetMeshesList:THREE.Mesh[]){
        const wordSize = {
            size: 0.1,
            z_top:1.25
        }
        const wordsColorObject = {
            color: 0x00ffff,
        }

        // 先清除，后再重新添加回去
        InitialGui()  // 这一步的调用被注释是因为我们在 useEffect的钩子里面已经添加了InitialGui的初始化，
        // 这样使得我们可以每次在修改input内容时，都会激发gui的初始化，因为输入框input的改变会激发整个页面的重新渲染，从而导致整个页面的输入框会发生改变

        for(let mesh of targetMeshesList){
            let guiFolder = gui.current.addFolder(mesh.name);
            // 正常字母除了修改颜色，还可以修改其字母大小
            if(mesh.name!='brick'){
                guiFolder.add(wordSize, 'size', 0, 1).name(`${mesh.name} size`).onChange((value)=>{
                    mesh.scale.set(value, value, value)
                    RerenderScene()
                })
                //  控制z轴坐标
                guiFolder.add(wordSize, 'z_top', 0, 50).name(`${mesh.name} verical`).onChange((value)=>{
                    mesh.position.setZ(value)
                    RerenderScene()
                })
            }
            //  brick 只有改变颜色选项
            guiFolder.addColor(wordsColorObject, 'color').name(`${mesh.name} color`).onChange((value)=>{
                let mesh_material = mesh.name =='brick'? mesh.material as THREE.MeshStandardMaterial : mesh.material as THREE.MeshLambertMaterial
                mesh_material.color.set(value)
                RerenderScene()
            })
            // 默认保持Gui的folders关闭
            guiFolder.close()
        }
    }


    //  做整个页面的重新渲染
    function RerenderScene(){
        // 先置空，后添加，将canvas对象添加到对应的场景中
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        render.setSize(width, height);
        render.render(scene, camera); 
    }

    useEffect(()=>{
        // 只在组件首次加载时执行
        InitialGui()
        const Promises = PreLoadStlFiles(availableCharsList.current)
        Promise.all(Promises).then(
            (resolveValues)=>{
                let temp_geometry:LoadedGeometriesDictType = {}
                resolveValues.map((LoadedGeometriesList)=>{
                    let [key,geometry]= LoadedGeometriesList as LoadedGeometriesListType
                    temp_geometry[key] = geometry
                })
                SetLoadedGeometriesDict(temp_geometry)
            }
        )
    },[])


    useEffect(()=>{
        //  添加到这里是因为每次我们输入input的内容时，总是会触发，整个页面的冲洗渲染，为了保持一致性，所以才会在这里添加初始化内容，这样会让每次input输入，都会激发InitialGui
        const control = new OrbitControls(camera,render.domElement)
        control.addEventListener('change',RerenderScene)
        //  当组件卸载时，出现的动作
        return () => {
            control.removeEventListener('change', RerenderScene);
        };
    },[scene])

    function GenButtonClick(){
        // 先清空，再重新添加
        containerRef.current?.firstChild?.remove()
        //  完全彻底清除,重置
        let reinit = InitialScene(width,height)
        camera = reinit[0]
        scene = reinit[1]
        render = reinit[2]
        
        // scene.children.map((child)=>{
        //     //  清除指定的除了环境光之外的元素，即所有的 mesh类的元素全部清除即可
        //     if(child.type === 'Mesh'){
        //         scene.remove(child)
        //     }
        // })
        let targetMeshesList = GetTargetStlMeshes(inputChars,LoadedGeometriesDict)
        //  除了 scene的add方法，还可以像下面这样进行添加
        scene.children = [
            ...scene.children,
            ...targetMeshesList
        ]
        // for(let mesh of targetMeshesList){
        //     scene.add(mesh)
        // }

        //将以上的meshes添加到对应的 gui 面板上
        AddGuiControlers(targetMeshesList)

        // 允许下载
        SetAvaliableDownload(true)        
        

        // 先置空，后添加，将canvas对象添加到对应的场景中
        containerRef.current?.appendChild(render.domElement)

        RerenderScene()
    }

    function DownloadButtonClick(){
        let target_meshes:THREE.Mesh[] = []
        scene.children.map((child)=>{
            if(child.type === 'Mesh'){
                target_meshes.push(child as THREE.Mesh)
            }
        })
        let saved =  exportSTL(target_meshes,inputChars)
        if(!saved){
            alert('download sucessfully!')
        }else{
            alert('download failed!')
        }
    }

    return (<>
        <div>
            <div className={Styles.threejsContainer} style={{ width: width, height: height }}>
                <div  ref={containerRef}> </div>
                <div className={Styles.guiContainer}  ref={guiContainerRef}></div>
            </div>
            <div className={Styles.input_area}>
                <label >input chars to create the 3D words:</label>
                <input type="text" value={inputChars} onChange={(e)=>{
                    SetInputChars(e.target.value)
                    // 每次输入内容改变都会重置
                    scene.children.length = 0
                    InitialGui()
                    SetAvaliableDownload(false)
                    containerRef.current?.firstChild?.remove()
                }}/>
                <button id="genSTL" onClick={GenButtonClick} 
                disabled={availableCharsList.current.length !== Object.keys(LoadedGeometriesDict).length }>click</button>
                <button disabled = {!availableDownload}  onClick={DownloadButtonClick} >download</button>
                <p> avaliabe chars: {GetPredifineAvailableCharsList()} </p>
            </div>
        </div>
    </>)
}

export default ThreeJS3DPage