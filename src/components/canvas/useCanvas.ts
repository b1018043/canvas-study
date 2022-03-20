import React,{useRef,useEffect, useState} from "react";
import randomColor from "../../utils/color";
import useWebSocket from "./useWebSocket";

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

interface Request {
    x: number;
    y: number;
}

const BACKGROUND_COLOR = "black";
const USERRECT_COLOR = "red";

const useCanvas = (parentRef: React.RefObject<HTMLDivElement>) =>{
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const {websocketReadyState,websocketSend} = useWebSocket("ws://localhost:8080/ws",(e: MessageEvent<string>)=>{
        const res:Response = JSON.parse(e.data) as Response;
        switch(res.type){
            case "join":
                const newX:number = 0;
                const newY:number = 0;
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
            case "move":
                setBlocks(bls=>{
                    return bls.map(item=>{
                        if(item.id===res.id){
                            const newItem: block = {
                                id: item.id,
                                x:res.x||0,
                                y: res.y||0,
                            }
                            return newItem
                        }
                        return item;
                    }) as block[];
                });
        }
    });

    const [dx,setDx] = useState<number>(0);
    const [dy,setDy] = useState<number>(0);

    const [blocks,setBlocks] = useState<Array<block>>([] as block[]);

    const getContext = (): CanvasRenderingContext2D =>{
        const canvas: HTMLCanvasElement|any = canvasRef.current;
        return canvas.getContext("2d");
    };

    const drawBackground = (ctx: CanvasRenderingContext2D) =>{
        if(!canvasRef.current) return;
        canvasRef.current.height = parentRef.current?.clientHeight || 100;
        canvasRef.current.width = parentRef.current?.clientWidth || 100;
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
        ctx.fillStyle = USERRECT_COLOR;
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
        if(websocketReadyState===1&&websocketSend){
            const req:Request = {
                x: dx,
                y: dy,
            }
            websocketSend(JSON.stringify(req));
        }
    },[dx,dy,websocketReadyState])

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
        blocks.forEach(item=>{
            ctx.fillStyle = randomColor();
            ctx.fillRect(item.x,item.y,20,20);
        })
    }

    return canvasRef;
}

export default useCanvas;