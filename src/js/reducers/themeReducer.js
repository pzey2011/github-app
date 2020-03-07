
import ls from 'local-storage';

const initialState = {
    theme: 'light',
    haveTheme:false,
};
const themeReducer = (state = initialState, action) => {
    if (action.type === 'CHECK_THEME_LOCAL') {
        if (!ls.get('theme'))
        {
            return state= {
                ...state,
                haveTheme: false}
        }
        else{
            return state= {
                theme: ls.get('theme'),
                haveTheme: true}

        }
    }
    else if (action.type === 'SET_THEME') {
        ls.set('theme',action.payload);
        return state = {
                ...state,
                theme: action.payload
            }

    }
    else {
        return state
    }
}
export default themeReducer