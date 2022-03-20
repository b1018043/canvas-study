import React from "react";
import useCanvas from "./useCanvas";

interface CanvasProps{
    parentRef: React.RefObject<HTMLDivElement>;
}

const Canvas = ({parentRef}:CanvasProps)=>{
    const canvasRef = useCanvas(parentRef);

    return (
        <canvas width="100%" height="100%" ref={canvasRef}/>
    )
}

export default Canvas;