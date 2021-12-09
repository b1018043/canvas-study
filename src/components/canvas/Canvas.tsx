import React,{useRef,useEffect, Props} from "react";

const Canvas = ()=>{
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    const getContext = (): CanvasRenderingContext2D =>{
        const canvas: HTMLCanvasElement|any = canvasRef.current;
        return canvas.getContext("2d");
    };

    useEffect(()=>{
        const ctx: CanvasRenderingContext2D = getContext();
        ctx.fillRect(0,0,100,100);
        ctx.save();
    },[])

    return (
        <canvas width="1280" height="720" ref={canvasRef}/>
    )
}

export default Canvas;