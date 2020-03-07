
export function setTheme(theme) {
    return { type: 'SET_THEME', payload: theme }
}

export function changeUsername(name){
    return { type: 'CHANGE_USERNAME', payload: name }
}
export function resetInfo(){
    return { type: 'RESET_INFO' }
}
export function changeFullname(name){
    return { type: 'CHANGE_FULLNAME', payload: name }
}
export function changeLocation(data){
    return { type: 'CHANGE_LOCATION', payload: data }
}
export function changeCompany(data){
    return { type: 'CHANGE_COMPANY', payload: data }
}
export function changeBlog(data){
    return { type: 'CHANGE_BLOG', payload: data }
}
export function changeBlogName(data){
    return { type: 'CHANGE_BLOGNAME', payload: data }
}
export function changeAvatarUrl(data){
    return { type: 'CHANGE_AVATARURL', payload: data }
}
export function changeErrorMessage(data){
    return { type: 'CHANGE_ERRORMESSAGE', payload: data }
}
export function changeInputFocused(data){
    return { type: 'CHANGE_INPUTFOCUS', payload: data }
}
export function pushRepoDivItem(data){
    return { type: 'PUSH_REPO_DIV_ITEM', payload: data }
}
export function resetRepoDivItems(data){
    return { type: 'RESET_REPO_DIV_ITEMS', payload: data }
}
export function setWait(data){
    return { type: 'CHANGE_WAIT', payload: data }
}
export function setResultFound(data){
    return { type: 'CHANGE_RESULTFOUND', payload: data }
}
export function resetForm(){
    return { type: 'RESET_FORM'}
}

