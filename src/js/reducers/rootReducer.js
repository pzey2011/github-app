import { combineReducers } from 'redux'
import reposReducer from './reposReducer'
import infosReducer from './infosReducer'
import themeReducer from "./themeReducer";

const rootReducer = combineReducers({
    repos: reposReducer,
    infos: infosReducer,
    themeInfo: themeReducer
});

export default rootReducer;