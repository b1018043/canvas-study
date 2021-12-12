import React,{useRef,useEffect, useState,MouseEvent} from "react";

interface block{
    x: number;
    y: number;
}

const Canvas = ()=>{
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [dx,setDx] = useState<number>(0);
    const [dy,setDy] = useState<number>(0);

    const [blocks,setBlocks] = useState<Array<block>>([] as block[]);

    const getContext = (): CanvasRenderingContext2D =>{
        const canvas: HTMLCanvasElement|any = canvasRef.current;
        return canvas.getContext("2d");
    };

    const drawBackground = (ctx: CanvasRenderingContext2D) =>{
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,1000,700);
        ctx.fillStyle = "red";
        ctx.fillRect(dx,dy,100,100);
        drawBlocks();
        ctx.save();
    }

    const keyHandler = (e: KeyboardEvent):void =>{
        switch(e.code){
            case "ArrowUp":
                setDy(num=>num-10);
                break;
            case "ArrowRight":
                setDx(num=>num+10);
                break;
            case "ArrowLeft":
                setDx(num=>num-10);
                break;
            case "ArrowDown":
                setDy(num=>num+10);
                break;
        }
        drawBackground(getContext());
    }

    useEffect(()=>{
        document.addEventListener("keydown",keyHandler,false);
        drawBackground(getContext());
        return ()=>{
            document.removeEventListener("keydown",keyHandler);
        }
    },[dx,dy,blocks])

    useEffect(()=>{
        drawBackground(getContext());
    },[])

    const drawBlocks = () =>{
        const ctx: CanvasRenderingContext2D = getContext();
        ctx.fillStyle = "#123456";
        blocks.forEach(item=>{
            ctx.fillRect(item.x,item.y,20,20);
        })
    }


    const canvasClickHandler = (e: MouseEvent) =>{
        console.log(`x: ${e.pageX}, y: ${e.pageY}`)
        
        const newBlock: block = {x:e.pageX,y:e.pageY};
        setBlocks(bls=>[...bls,newBlock]);
    }

    return (
        <canvas width="1000px" height="1000px" ref={canvasRef} onClick={canvasClickHandler}/>
    )
}

export default Canvas;