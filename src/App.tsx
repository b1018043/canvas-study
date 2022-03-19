import React, {useRef} from 'react';
import Canvas from "./components/canvas/Canvas";
import "./App.css";

function App() {
  const parentRef = useRef<HTMLDivElement>(null);
  return (
      <div className='container' ref={parentRef}>
        <Canvas parentRef={parentRef}/>
      </div>
  );
}

export default App;
