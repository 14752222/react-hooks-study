
//导出一个interface，用来约束 action
export interface IAction {
    type: 'add' | 'minus'
    count: number
}

export interface Data {
    result: number
}

function reducer(state: Data, action: IAction) {

    switch(action.type) {
        case 'add':
            return {
                result: state.result + action.count
            }
        case 'minus':
            return {
                result: state.result - action.count
            }
        default:
            return state
    }
}


export default reducer

