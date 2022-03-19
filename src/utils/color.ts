const randomColor: ()=>string = ()=>{
    const makeRandNum: ()=> number = ()=> (~~(256 * Math.random()));
    return `rgb(${makeRandNum()},${makeRandNum()},${makeRandNum()})` ;
};

export default randomColor;