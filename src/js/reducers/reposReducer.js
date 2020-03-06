const initialState = {
    repoDivItemsMap:[],
};
function reposReducer(state = initialState, action)
{
    switch(action.type) {
        case 'ADD_REPO_DIV_ITEM':
            return [
                ...state,
                {
                    id: action.id,
                    title: action.title,
                    done: false
                }
            ];
        case 'RESET_REPO_DIV_ITEMS':
            return state = {
                repoDivItemsMap:[]
            }

        default:
            return state;
    }
}

export default reposReducer