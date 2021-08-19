
import { createContext, useReducer } from "react"

export const CategoryContext = createContext({});

const initialState= {
    user: null
}
function reducer(state, action){
    switch(action.type){
        case "GET_CATEGORIES":  
            return {
                user: {
                    email:action.user.email,
                    username: action.user.username,
                    isAuth: true,
                }
            };
        case "ADD_CATEGORY":
            return {
                user: null,
            };
        default:
            return state;

    }
}

function CategoryContextWrapper({children}){
    const [state, dispatch] = useReducer(reducer,initialState);
    return (
        <CategoryContext.Provider value={{state, dispatch}}>
            {children}
        </CategoryContext.Provider>
    )
}

export default AuthContextWrapper;