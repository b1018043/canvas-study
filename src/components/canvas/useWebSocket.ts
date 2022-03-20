import React,{useRef,useEffect} from "react";

type MessageHandler = (e: MessageEvent<string>)=>void; 

type SendArgs = string | ArrayBufferLike | Blob | ArrayBufferView ;

const useWebSocket = (URL: string,onmessage: MessageHandler) =>{
    const socketRef = useRef<WebSocket>();
    useEffect(()=>{
        socketRef.current = new WebSocket(URL);
        socketRef.current.onmessage = onmessage||null;
        return ()=>{
            socketRef.current?.close();
        }
    },[]);

    return {
        // NOTE: JavaScriptのネイティブ関数を直接渡すとUncaught TypeError: Illegal invocationが発生するため
        // 直接参照しないようにしている
        websocketSend: (msg:SendArgs)=>{socketRef.current?.send(msg)},
        websocketReadyState: socketRef.current?.readyState,
    };
}

export default useWebSocket;