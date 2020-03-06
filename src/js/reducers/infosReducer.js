const initialState = {
    fullName:"",
    location:"",
    company:"",
    blog:"",
    blogName:"",
    avatarUrl:"",
    errorMessage:""
};

function infosReducer(state = initialState, action)
{
    switch(action.type) {
        case 'RESET_INFO':
            return state={
                fullName:"",
                location:"",
                company:"",
                blog:"",
                blogName:"",
                avatarUrl:"",
                errorMessage:""
            };

        case 'CHANGE_FULLNAME':
            return state = {
                ...state,
                fullName:action.payload
            };

        case 'CHANGE_LOCATION':
            return state = {
                ...state,
                location:action.payload
            };
        case 'CHANGE_COMPANY':
            return state = {
                ...state,
                company:action.payload
            };
        case 'CHANGE_BLOG':
            return state = {
                ...state,
                blog:action.payload
            };
        case 'CHANGE_BLOGNAME':
            return state = {
                ...state,
                blogName:action.payload
            };
        case 'CHANGE_AVATARURL':
            return state = {
                ...state,
                avatarUrl:action.payload
            };
        case 'CHANGE_ERRORMESSAGE':
            return state = {
                ...state,
                errorMessage:action.payload
            };
        default:
            return state;
    }
}

export default infosReducer