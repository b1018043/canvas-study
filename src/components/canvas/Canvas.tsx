import React,{useRef,useEffect, useState, KeyboardEvent} from "react";

const Canvas = ()=>{
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [dx,setDx] = useState<number>(0);
    const [dy,setDy] = useState<number>(0);

    const getContext = (): CanvasRenderingContext2D =>{
        const canvas: HTMLCanvasElement|any = canvasRef.current;
        return canvas.getContext("2d");
    };

    const drawBackground = (ctx: CanvasRenderingContext2D) =>{
        ctx.fillRect(0,0,1000,700);
        ctx.fillStyle = "white";
        ctx.fillRect(dx,dy,100,100);
        ctx.save();
    }

    const keyHandler = (e: any) =>{
        switch(e.code){
            case "ArrowUp":
                setDy(num=>num+10);
                break;
            case "ArrowRight":
                setDx(num=>num+10);
                break;
            case "ArrowLeft":
                setDx(num=>num-10);
                break;
            case "ArrowDown":
                setDy(num=>num-10);
                break;
        }
        drawBackground(getContext());
    }

    useEffect(()=>{
        const ctx: CanvasRenderingContext2D = getContext();
        
        document.addEventListener("keydown",keyHandler,false);
        drawBackground(ctx);
        return ()=>{
            document.removeEventListener("keydown",keyHandler);
        }
    },[])

    return (
        <canvas width="1000" height="700" ref={canvasRef}/>
    )
}

export default Canvas;