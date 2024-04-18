import React from 'react';
import './App.css';

interface AppProps {
    name: string;
    children?: React.ReactElement; // 不能是React.ReactElement 以外的类型
    left?: React.ReactNode; // 如果不确定未来的类型，可以使用React.ReactNode
}

const Box: JSX.Element = <span>hello</span>;

function Content(props: AppProps) {
    return <p>{props.left} {props.children}, {props.name}!</p>;
}


function EG1() {
    return (
        <div className="App">
            <header className="App-header">
                ReactElement
                <Content name='react'>
                    {Box}
                </Content>

                {/* ReactNode */}
                {/*<Content name='react' children={Box} left={<div>null</div>}></Content>*/}
                {/*<Content name='react' children={Box} left={1}></Content>*/}
                {/*<Content name='react' children={Box} left={true}></Content>*/}
                {/*<Content name='react' children={Box} left={null}></Content>*/}
                {/*<Content name='react' children={Box} left={undefined}></Content>*/}
                <Content name='react' children={Box} left={"undefined"}></Content>
            </header>
        </div>
    );
}

//React.FC 与 React.FunctionComponent 是等价的 Type FC<P = {}> = FunctionComponent<P>
const EG2: React.FunctionComponent<AppProps> = (props: AppProps) => {
    return (
        <>
            <Content name={props.name} children={props.children} left={props.left}></Content>
        </>
    );

}

function EG3() {
    // const [num, setNum] = React.useState<number>(0);
    const [num, setNum] = React.useState(0);
    //保存 dom 引用的时候，参数需要传个 null：
    const pRef = React.useRef<HTMLParagraphElement>(null);
    // const refNum = React.useRef<{num:number}>(0);

    // 而保存别的内容的时候，不能传 null，不然也会报错，说是 current 只读：
    // RefObject<T> { readonly current: T | null; }
    // useRef<T>(initialValue: T): RefObject<T>;
    // pRef.current = document.createElement('p');
    // 当useRef 返回 MutableRefObject<T> 时，current 是可变的：


    /*
    * 因为 ref 既可以保存 dom 引用，又可以保存其他数据，而保存 dom 引用又要加上 readonly，所以才用 null 做了个区分。
      传 null 就是 dom 引用，返回 RefObject，不传就是其他数据，返回 MutableRefObject。
    * */

    return (
        <>
            <div>
                <button onClick={() => setNum(num + 1)}>Click</button>
                <p ref={pRef}>{num}</p>
            </div>
        </>
    );
}

function EG4() {
    interface GuangProps {
        name: string;
    }

    interface GuangRef {
        aaa: () => void;
    }

    const Guang: React.ForwardRefRenderFunction<GuangRef, GuangProps> = (props, ref) => {
        const inputRef = React.useRef<HTMLInputElement>(null);


        React.useImperativeHandle(ref, () => ({
            aaa() {
                console.log('aaa');
                inputRef.current?.focus();
            }
        }));

        return <>
            input: <input/>
        </>
    }

    const WrapedGuang = React.forwardRef(Guang);
    const ref = React.useRef<GuangRef>(null);

    React.useEffect(() => {
        ref.current?.aaa();
    }, []);

    return (
        <>
            <WrapedGuang ref={ref} name='guang'></WrapedGuang>
        </>
    );
}

function App() {
    return (
        <>
            <EG4/>
            <EG1/>
            <EG2 name='react' children={Box} left={"undefined"}></EG2>
            <EG3/>
        </>
    );
}

export default App;
