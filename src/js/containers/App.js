import React, { Component } from "react";
import * as eva from 'eva-icons';
import axios from 'axios';
import { connect } from 'react-redux';
import Infos from '../components/infos';
import Repos from '../components/repos';
import { setTheme ,changeUsername,resetInfo,changeFullname,changeAvatarUrl,changeBlog,changeBlogName,changeCompany,changeLocation,changeErrorMessage,changeInputFocused,pushRepoDivItem,resetRepoDivItems,setWait,setResultFound,resetForm} from '../actions'
import ls from 'local-storage';

class App extends Component {
    constructor() {
        super();

        this.handleSearchApi= this.handleSearchApi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.nameInput=React.createRef();
        this.submitButton=React.createRef();
        this.themeToggleIcon=React.createRef();
        this.themeToggleIconDiv=React.createRef();
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.getUrlHostName=this.getUrlHostName.bind(this);
        this.reset=this.reset.bind(this);
        this.toggleTheme=this.toggleTheme.bind(this);
    }
    componentDidMount() {

        if(!ls.get('theme'))
        {
            this.props.setTheme('light');
            document.documentElement.setAttribute('input-focus', 'light-false');
        }
        else{
            if(ls.get('theme')=='dark')
            {
                this.props.setTheme('dark');
                this.themeToggleIcon.current.setAttribute("data-eva", "sun-outline");
                this.themeToggleIcon.current.setAttribute("data-eva-fill", "#fff");
                document.documentElement.setAttribute('data-theme', 'dark');
                document.documentElement.setAttribute('input-focus', 'dark-false');
            }
            else{
                this.themeToggleIcon.current.setAttribute("data-eva", "moon");
                document.documentElement.setAttribute('input-focus', 'light-false');
            }
        }

        eva.replace({
            width:18,
            height:18,
        });

    }
    toggleTheme(){
        if(this.props.themeInfo.theme=='dark')
        {
            this.themeToggleIconDiv.current.removeChild(document.getElementsByClassName("eva-sun-outline")[0]);
            let newIcon = document.createElement("i");
            newIcon.setAttribute("data-eva", "moon");
            this.themeToggleIconDiv.current.append(newIcon);
            eva.replace({
                width:18,
                height:18});
            this.props.setTheme('light');
            document.documentElement.setAttribute('data-theme', 'light');
            if(this.props.form.inputFocused)
            {
                document.documentElement.setAttribute('input-focus', 'light-true');
            }
            else{
                document.documentElement.setAttribute('input-focus', 'light-false');
            }
        }
        else{
            this.themeToggleIconDiv.current.removeChild(document.getElementsByClassName("eva-moon")[0]);
            let newIcon = document.createElement("i");
            newIcon.setAttribute("data-eva", "sun-outline");
            newIcon.setAttribute("data-eva-fill", "#fff");
            this.themeToggleIconDiv.current.append(newIcon);
            eva.replace({
                width:18,
                height:18});
            this.props.setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            if(this.props.form.inputFocused)
            {
                document.documentElement.setAttribute('input-focus', 'dark-true');
            }
            else{
                document.documentElement.setAttribute('input-focus', 'dark-false');
            }
        }
    }
    reset(){
        this.props.resetInfo();
        this.props.resetRepoDivItems();
        this.props.resetForm();
    }
    onFocus(){
        this.props.changeInputFocused(true);
        if(this.props.themeInfo.theme=='dark')
        {
            document.documentElement.setAttribute('input-focus', 'dark-true');
        }
        else {
            document.documentElement.setAttribute('input-focus', 'light-true');
        }
    }
    onBlur(){
        this.props.changeInputFocused(false);
        if(this.props.themeInfo.theme=='dark')
        {
            document.documentElement.setAttribute('input-focus', 'dark-false');
        }
        else {
            document.documentElement.setAttribute('input-focus', 'light-false');
        }
    }
    handleChange(event) {

        const { value } = event.target;
        this.props.changeUsername(value);
    }
    getUrlHostName(url){
        let hostname="";
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
        return hostname;
    }
    handleSearchApi(event){
        event.preventDefault();

        this.props.wait(true);
        //////change icon manually by dom there was no other solution for this
        this.submitButton.current.removeChild(document.getElementsByClassName("eva-search-outline")[0]);
        let newIcon = document.createElement("i");
        newIcon.setAttribute("data-eva", "loader-outline");
        this.submitButton.current.append(newIcon);
        eva.replace({
            width:18,
            height:18});
        ///////

        ///reset state
        this.reset();
        /////
        let userName=this.props.form.username.replace('@', '');
        axios.get('https://api.github.com/users/'+userName).then((result)=> {
            this.props.wait(false);
            this.props.resultFound(true);
            this.props.changeFullname(result.data.name);
            this.props.changeCompany(result.data.company);
            this.props.changeLocation(result.data.location);
            this.props.changeBlog(result.data.blog);
            this.props.changeAvatarUrl(result.data.avatar_url);

            let hostName=this.getUrlHostName(result.data.blog);
            this.props.changeBlogName(hostName);
            axios.get('https://api.github.com/users/'+userName+"/repos?sort=created&direction=desc").then((result)=> {
                result.data.map((item,i) =>{
                        let forkedLink =<React.Fragment/>;
                        if(!item.fork)
                        {
                             let unForkedDivItem=(
                                <ul className="block">
                                    <li className="extra-bold"><a href={item.html_url} className='title' target="_blank">{item.name}</a></li>
                                    {item.description ? <li className="description">{item.description}</li> : <React.Fragment/>}
                                    <li className="item-container">
                                    {item.language ? <div className="icon-item medium"><i data-eva="code-outline"></i><p className="language">{item.language}</p></div> :
                                        <React.Fragment/>}
                                        <div className="icon-item medium"><i data-eva="star"></i><p className="star">{item.stargazers_count}</p></div>
                                        <div className="icon-item medium"><i data-eva="copy"></i><p className="copy">{item.forks}</p></div></li>
                                </ul>
                            )
                            let repoDivItemMap= {
                                updatedAt: item.updated_at,
                                divItem: unForkedDivItem
                            }

                            this.props.pushRepoDivItem(repoDivItemMap);
                        }
                });
                result.data.map((item,i) => {
                    if (item.fork) {
                        axios.get('https://api.github.com/repos/' + userName + "/" + item.name+"?sort=created&direction=desc").then((repo) => {
                            let forkedDivItem=(<ul className="block">
                                <li className="item-container" ><a href={item.html_url} target="_blank" className="item title extra-bold">{item.name}</a>
                                    <p className="item medium forked">{"Forked from "}</p><a href={'https://github.com/'+repo.data.source.owner.login} target="_blank"  className="item medium ">{' @'+repo.data.source.owner.login}</a></li>
                                {item.description ? <li className="description">{item.description}</li> : <React.Fragment/>}
                                <li className="item-container">{item.language ? <div className="icon-item medium"><i data-eva="code-outline"></i><p className="language">{item.language}</p></div> :
                                    <React.Fragment/>}
                                    <div className="icon-item medium"><i data-eva="star"></i><p className="star">{item.stargazers_count}</p></div>
                                    <div className="icon-item  medium"><i data-eva="copy"></i><p className="copy">{item.forks}</p></div></li>
                            </ul>);

                            let repoDivItemMap= {
                                updatedAt: item.updated_at,
                                divItem: forkedDivItem
                            }
                            this.props.pushRepoDivItem(repoDivItemMap);
                            this.props.repoDivItems.sort(function(a,b){
                                return new Date(b.updatedAt) - new Date(a.updatedAt);
                            });
                            if(this.props.repoDivItems.length==result.data.length){
                                this.props.wait(false);
                                //////change icon manually by dom there was no other solution for this
                                this.submitButton.current.removeChild(document.getElementsByClassName("eva-loader-outline")[0]);
                                let newIcon = document.createElement("i");
                                newIcon.setAttribute("data-eva", "search-outline");
                                this.submitButton.current.append(newIcon);
                                eva.replace({
                                    width:18,
                                    height:18});
                                //
                            }
                        }).catch((error) => {
                            // handle error
                            console.log(error);
                        });

                    }
                });


            }).catch((error)=> {
                // handle error
                console.log(error);

            });
        }).catch((error)=> {
            // handle error
            this.props.wait(false);
            this.props.resultFound(false);
            this.props.changeErrorMessage('User not found :(');
            /////change icon manually by dom there was no other solution for this
            this.submitButton.current.removeChild(document.getElementsByClassName("eva-loader-outline")[0]);
            let newIcon = document.createElement("i");
            newIcon.setAttribute("data-eva", "search-outline");
            this.submitButton.current.append(newIcon);
            eva.replace({
                width:18,
                height:18});
            ////
        });

        console.log(this.state);
    }
    render() {

        return (
            <div className="container">
                    <div className="theme-icon-div" ref={this.themeToggleIconDiv} onClick={this.toggleTheme}><i className="theme-icon" data-eva={this.props.themeInfo.theme=='light'?"moon":"sun-outline"} ref={this.themeToggleIcon} data-eva-fill="#212121" ></i></div>
                    <h1>GitHub Profiles</h1>
                    <h2>Enter a GitHub username,
                        to see the magic.</h2>
                    <form className="search-form" onSubmit={this.handleSearchApi}>
                        <label htmlFor="username">GitHub username:</label>

                        <div className="form-group">

                            <input id="username"
                            type="text"
                            value={this.props.form.username}
                            onChange={this.handleChange}
                            placeholder={'@username'}
                                   onFocus={this.onFocus}
                                   onBlur={this.onBlur}
                           ref={this.nameInput}
                            />
                            <button type="submit" ref={this.submitButton} >
                                {this.props.form.wait? <i data-eva="loader-outline"></i>:<i data-eva="search-outline"></i>}
                            </button>
                        </div>

                    </form>

                        {this.props.form.resultFound? <div className="row"><Infos /> <Repos /></div>:
                            <p className="error-message extra-bold">{this.props.infos.errorMessage}</p>}
            </div>

        );
    }
}

const mapStateToProps = state => ({
    themeInfo: state.themeInfo,
    infos:state.infos,
    form:state.form,
    repoDivItems:state.repoDivItems,
})
const mapDispatchToProps = dispatch => ({
    setTheme: (theme) => dispatch(setTheme(theme)),
    changeUsername:(name) => dispatch(changeUsername(name)),
    resetInfo:() => dispatch(resetInfo()),
    changeCompany:(data) => dispatch(changeCompany(data)),
    changeFullname:(data) => dispatch(changeFullname(data)),
    changeLocation:(data) => dispatch(changeLocation(data)),
    changeBlogName:(data) => dispatch(changeBlogName(data)),
    changeBlog:(data) => dispatch(changeBlog(data)),
    changeAvatarUrl:(data) => dispatch(changeAvatarUrl(data)),
    changeErrorMessage:(data) => dispatch(changeErrorMessage(data)),
    changeInputFocused:(data) => dispatch(changeInputFocused(data)),
    resetRepoDivItems:() => dispatch(resetRepoDivItems()),
    pushRepoDivItem:(data) => dispatch(pushRepoDivItem(data)),
    wait:(data) => dispatch(setWait(data)),
    resultFound:(data) => dispatch(setResultFound(data)),
    resetForm:(data) => dispatch(resetForm()),
})
export default connect(mapStateToProps, mapDispatchToProps)(App)