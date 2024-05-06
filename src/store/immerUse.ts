import {produce} from "immer";

export interface ImmerData {
    a: {
        c: {
            e: number,
            f: number
        },
        d: number
    },
    b: number
}

export interface ImmerAction {
    type: 'add' | 'minus' | 'update'
    num: number
}


// 使用immer 优化reducer

function ImmerReducer(state: ImmerData, action: ImmerAction) {
    switch(action.type) {
        case 'add':
            return produce(state, draft => {
                draft.a.c.e += action.num
            })
        case 'minus':
            return produce(state, draft => {
                draft.a.c.e -= action.num
            })
        case 'update':
            return produce(state, draft => {
                draft.a.c.e = action.num
            })
        default:
            return state
    }
}

export function NoImmerReducer(state:ImmerData,action:ImmerAction){
    switch (action.type) {
        case "add":
            return {
                ...state,
                a:{
                    ...state.a,
                    c:{
                        ...state.a.c,
                        e:state.a.c.e+action.num
                    }
                }
            }
        default:
            return state
    }

}

export default ImmerReducer