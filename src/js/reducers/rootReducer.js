import { combineReducers } from 'redux'
import reposReducer from './reposReducer'
import infosReducer from './infosReducer'
import themeReducer from "./themeReducer";
import formReducer from "./formReducer";

const rootReducer = combineReducers({
    repoDivItems: reposReducer,
    infos: infosReducer,
    themeInfo: themeReducer,
    form: formReducer,
});

export default rootReducer;