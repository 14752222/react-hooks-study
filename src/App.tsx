import React, {Reducer, useEffect, useReducer, useRef, useState} from 'react';
import './App.css';

function Demo1() {
    const [count, setCount] = useState(0)
    console.log('render')
    useEffect(() => {

        // @ts-ignore
        let time = setInterval(() => {
            setCount(count + 1)
        }, 1000)

        return () => {
            clearInterval(time)
        }

    },[])


    return (
        <>
            <div>{count}</div>
        </>
    )
}

function Demo2() {
    const [count, setCount] = useState(0)
    console.log('render')
    useEffect(() => {
        // @ts-ignore
        let time = setInterval(() => {
            setCount(count => count + 1)
        }, 1000)

        return () => {
            clearInterval(time)
        }

    } ,[])


    return (
        <>
            <div>{count}</div>
        </>
    )
}

interface Action1 {
    type: 'add' | 'minus'
    num: number
}

function reducer1(state: number, action: Action1) {
    switch (action.type) {
        case "add":
            return state + action.num
        case "minus":
            return state - action.num
        default:
            return state
    }
}

function Demo3() {
    const [count, dispatch] = useReducer<Reducer<number, Action1>>(reducer1, 0)
    console.log('render')
    useEffect(() => {

        //@ts-ignore
        let time = setInterval(() => {
            dispatch({type: 'add', num: 1})
        }, 1000)

        return () => {
            clearInterval(time)
        }

    },[])


    return (
        <>
            <div>{count}</div>
        </>
    )
}

function Demo4() {
    const [count, setCount] = useState(0)
    console.log('render')
    useEffect(() => {
        console.log(count) // 但有的时候，是必须要用到 state 的，也就是肯定会形成闭包，

        // @ts-ignore
        let time:number = setInterval(() => {
            setCount(count => count + 1)
        }, 1000)

        return () => {
            clearInterval(time)
        }

    }, [count])


    return (
        <>
            <div>{count}</div>
        </>
    )
}

/*
* 通过 useRef 创建 ref 对象，保存执行的函数，每次渲染更新 ref.current 的值为最新函数。
  这样，定时器执行的函数里就始终引用的是最新的 count。
  useEffect 只跑一次，保证 setIntervel 不会重置，是每秒执行一次。

执行的函数是从 ref.current 取的，这个函数每次渲染都会更新，引用着最新的 count。*/
function Demo5() {
    const [count, setCount] = useState(0)
    const upDateCount = () => {
        setCount(count + 1)
    }

    const ref = useRef(upDateCount)

    ref.current = upDateCount

    useEffect(() => {
        console.log(`demo 5  ==>`, count)
        const timer = setInterval(() => ref.current(), 1000)

        return () => {
            clearInterval(timer)
        }
    },[]);


    return <div className="demo5">{count}</div>
}


function App() {
    return (
        <div className="App">
            <Demo1/>
            <Demo2/>
            <Demo3/>
            <Demo4/>
            <Demo5/>
        </div>
    );
}

export default App;
