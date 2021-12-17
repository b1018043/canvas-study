import { randomInt } from "crypto";
import React,{useRef,useEffect, useState,MouseEvent} from "react";

interface block{
    id: number;
    x: number;
    y: number;
}

interface Response {
    type: string;
    id: number;
    x?: number;
    y?: number;
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

    const socketRef = useRef<WebSocket>();

    useEffect(()=>{
        socketRef.current = new WebSocket("ws://localhost:8080/ws");
        socketRef.current.onmessage = (e: MessageEvent<string>)=>{
            const res:Response = JSON.parse(e.data) as Response;
            console.log(`called type ${res.type}`)
            switch(res.type){
                case "join":
                    const newX:number = Math.random()*100;
                    const newY:number = Math.random()*100;
                    const nb:block = {
                        id: res.id,
                        x: newX,
                        y: newY,
                    }
                    setBlocks(bls=>[...bls,nb]);
                    break;
                case "leave":
                    setBlocks(bls=>bls.filter(item=>item.id!==res.id));
                    break;
            }
        }
        return ()=>{
            socketRef.current?.close();
        }
    },[])

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
        const randomColor: string = "rgb(" + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ")" ;
        ctx.fillStyle = randomColor;
        blocks.forEach(item=>{
            ctx.fillRect(item.x,item.y,20,20);
        })
    }

    return (
        <canvas width="1000px" height="1000px" ref={canvasRef}/>
    )
}

export default Canvas;