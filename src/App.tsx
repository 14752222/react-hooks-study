import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useReducer,
    Reducer,
    useRef,
    forwardRef,
    ForwardRefRenderFunction, useImperativeHandle, useContext, memo, useCallback
} from 'react';
import './App.css';
import reducer, {Data, IAction} from './store/index';
import userContext from './store/context';

function Demo() {
    const [num, setNum] = useState(1);
    //这个函数只能写一些同步的计算逻辑，不支持异步。
    const [num2, setNum2] = useState(() => {
        const num1 = 1 + 2;
        const num2 = 2 + 3;
        return num1 + num2
    });
    //setNum 可以直接传新的值，或者传一个函数，返回新的值，这个函数的参数是上一次的 state
    return (
        <>
            <div onClick={() => setNum(num + 1)}>{num}</div>
            <div onClick={() => setNum2((num) => num + 1)}>{num2}</div>
        </>
    );
}

interface Ia {
    a: number;
}

async function getData(): Promise<Ia> {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({a: 11})
        }, 1000)
    })
}

// useEffect 会在每次渲染后执行，第二个参数是一个数组，数组里的值发生变化时，才会执行 useEffect
function Demo1() {
    const [num, setNum] = useState(0)
    useEffect(() => {
        getData().then((data) => {
            setNum(data.a)
        })
    }, [])
    return (
        <>
            <div>num: {num}</div>
            <button onClick={() => setNum((num) => num + 1)}>修改</button>
        </>
    )
}

//return 一个函数，这个函数会在组件卸载时执行
function Demo2() {
    const [num, setNum] = useState(0)

    useEffect(() => {
        console.log('useEffect start')

        const timer = setInterval(() => {
            setNum((num) => num + 1)

            return () => {
                console.log('clean up')
                clearInterval(timer)
            }
        }, 1000)


    }, [])
    return (
        <>
            <div>num: {num}</div>
        </>
    )
}


//useLayoutEffect 会在浏览器 layout 之后，painting 之前执行，这个函数里面的操作会阻塞浏览器渲染
function Demo3() {
    const [num, setNum] = useState(0)

    useLayoutEffect(() => {
        console.log('useLayoutEffect start')
        getData().then((data) => {
            setNum(data.a)
        })
    }, []);

    return (
        <>
            <div>num: {num}</div>
        </>
    )
}

// useReducer hook 用来替代 useState，接收一个 reducer 函数和初始值，返回一个数组，第一个元素是 state，第二个元素是 dispatch 函数
function Demo4() {
    const [result, dispatch] = useReducer<Reducer<Data, IAction>>(reducer, {result: 0})
    return (
        <>
            <div>result: {result.result}</div>
            <button onClick={() => dispatch({type: 'add', count: 1})}>add</button>
            <button onClick={() => dispatch({type: 'minus', count: 1})}>minus</button>
        </>
    )
}


function Demo5() {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <>
            <input ref={inputRef}/>
        </>
    )
}

function Demo6() {
    const numRef = useRef(0);

    return (
        <>
            <div>{numRef.current}</div>
            <button onClick={() => numRef.current += 1}>add</button>
        </>
    )
}

function usePrevious<T>(value: T) {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

function Demo7() {
    const [num, setNum] = useState(0);
    const prevNum = usePrevious<number>(num);
    return (
        <>
            <div>current: {num}</div>
            <div>prev: {prevNum}</div>
            <button onClick={() => setNum(num + 1)}>add</button>
        </>
    )
}

// 父组件获取子组件的实例
const Child: ForwardRefRenderFunction<HTMLInputElement> = (props, ref) => {
    return <div>
        input: <input type="button" value="按钮" ref={ref}/>
    </div>
};

const WrappedChild = forwardRef(Child);


function Demo8() {

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // inputRef.current?.focus()
        inputRef.current?.addEventListener('click', () => {
            console.log('click')
        })
    }, [])

    return (
        <>
            <WrappedChild ref={inputRef}/>
        </>
    )
}

interface RefProps {
    add: () => void;
}

//调用子组件的方法
const Child1: ForwardRefRenderFunction<RefProps> = (props, ref) => {
    const InputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => {
        return {
            add: () => {
                console.log('add')
                InputRef.current?.focus()
            }
        }
    }, [InputRef])

    return (<div>
        input: <input type="button" value="按钮" ref={InputRef}/>
    </div>)
}

const WrappedChild1 = forwardRef(Child1);

function Demo9() {

    const inputRef = useRef<RefProps>(null);

    // useEffect(() => {
    //     console.log(inputRef.current)
    //     inputRef.current?.add()
    // }, [])
    const add = () => {
        inputRef.current?.add()
    }

    return (
        <>
            <button onClick={add}>按钮1</button>
            <WrappedChild1 ref={inputRef}/>
        </>
    )
}

function Child2() {

    const user = useContext(userContext)

    return (
        <>
            <div>name: {user.name}</div>
            <div>age: {user.age}</div>
        </>
    )
}

// useContext 是一个 hook，用来获取 context 的值
function Demo10() {
    const [user, setUser] = useState({name: 'tom', age: 0})

    return (
        <>
            <userContext.Provider value={user}>
                <Child2 />
            </userContext.Provider>
            <div>
                <button onClick={()=>setUser((val)=>({...val,name:'zs'}))}>按钮</button>
            </div>
        </>
    )
}


interface ChildProps {
    num: number
}

//memo 优化函数组件
function Child3(props: ChildProps){
    console.log('child3')
    return <div>child3</div>
}
// 比较两次渲染的 props 是否相同，如果相同，不重新渲染
function Child4(props: ChildProps){
    console.log('child4')
    return <div>child4</div>
}

const MemoChild3 = React.memo(Child3)

function Demo11(){
    const [,setNum] = useState(1);
    const [count,setCount] = useState(1);
    useEffect(() => {
        setInterval(()=> {
            setNum(Math.random());
        }, 2000)
    },[]);

    const clickHandler = () => {
        setCount(count+1)
    }

    return <>
        <MemoChild3 num={count}/>
        <Child4 num={count}/>
        <button onClick={clickHandler}>按钮</button>
    </>
}

interface Child5Props {
    num: number;
    callback: Function
}

function Child5(props: Child5Props){
    console.log('child5')
    return <div>child5</div>
}

const MemoChild5 = memo(Child5)


// useCallback 优化函数，返回一个 memoized 函数 , 第二个参数是依赖数组，数组里的值发生变化时，重新生成函数
function Demo12(){
    const [,setNum] = useState(1);
    const [count,setCount] = useState(1);
    useEffect(() => {
        setInterval(()=> {
            setNum(Math.random());
        }, 2000)
    },[]);
    const callback = useCallback(() => {
        console.log('callback')
    },[])



    const clickHandler = () => {
        console.log('click')
        setCount(count+1)
    }

    return <>
        <MemoChild5 num={count} callback={callback}/>
        {/*<Child5 num={count} callback={callback} />*/}
        <button onClick={clickHandler}>按钮5</button>
    </>
}

function App() {
    return (
        <>
            <Demo/>
            <Demo1/>
            <Demo2/>
            <Demo3/>
            <Demo4/>
            <Demo5/>
            <Demo6/>
            <Demo7/>
            <Demo8/>
            <Demo9/>
            <Demo10/>
            <Demo11/>
            <Demo12/>
        </>
    )
}

export default App;
