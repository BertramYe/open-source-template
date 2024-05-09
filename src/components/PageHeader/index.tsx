

// 自定义接口为了方便后续修改每个页面的标题信息
// 当然你也可以自定义一些关键信息
interface RouterProps {
    title:string,
    children:React.ReactNode
}



const PageHeader = (props:RouterProps ) => {
    document.title = props.title 
    return (
        <>
            { props.children}
        </>
    )
}

export default PageHeader