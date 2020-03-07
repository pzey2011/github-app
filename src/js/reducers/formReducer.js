
const initialState = {
    username: '',
    inputFocused:false,
    wait: false,
    resultFound: false,
};
const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_USERNAME':
            return state={
                username:action.payload
            }

        case 'CHANGE_INPUTFOCUS':
            return state = {
                ...state,
                inputFocused: action.payload
            }
        case 'CHANGE_WAIT':
            return state = {
                ...state,
                wait: action.payload
            }
        case 'CHANGE_RESULTFOUND':
            return state = {
                ...state,
                resultFound: action.payload
            }
        case 'RESET_FORM':
            return initialState;
        default:
            return state
    }
}
export default formReducer