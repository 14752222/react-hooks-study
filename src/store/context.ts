import {createContext} from "react";

const userContext = createContext({name: 'default', age: 0});

export default userContext;