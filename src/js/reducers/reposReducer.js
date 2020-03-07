
function reposReducer(state = [], action)
{
    switch(action.type) {
        case 'PUSH_REPO_DIV_ITEM':
            return [
                ...state,
                {
                    updatedAt: action.payload.updatedAt,
                    divItem: action.payload.divItem
                }
            ];
        case 'RESET_REPO_DIV_ITEMS':
            return state = []

        default:
            return state;
    }
}

export default reposReducer