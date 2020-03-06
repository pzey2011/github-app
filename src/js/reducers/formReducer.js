
const initialState = {
    username: '',
};
const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_USERNAME':
            return state={
                username:action.payload
            }
        default:
            return state
    }
}
export default formReducer