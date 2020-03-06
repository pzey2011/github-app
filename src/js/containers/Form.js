import React, { Component } from "react";
import * as eva from 'eva-icons';
import axios from 'axios';
import { connect } from 'react-redux'
import { checkThemeLocal , getTheme , setTheme } from '../actions'
import ls from 'local-storage';

class Form extends Component {
    constructor() {
        super();

        this.state = {
            searchQuery: "",
            fullName:"",
            location:"",
            company:"",
            blog:"",
            blogName:"",
            avatarUrl:"",
            repoDivItemsMap:[],
            resultFound:true,
            theme:'',
            inputFocused:false,
        };
        this.handleSearchApi= this.handleSearchApi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.nameInput=React.createRef();
        this.submitButton=React.createRef();
        this.themeToggleIcon=React.createRef();
        this.themeToggleIconDiv=React.createRef();
        this.focusNameInput = this.focusNameInput.bind(this);
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
        }
    }
    reset(){
        this.setState({fullName:"",
            location:"",
            company:"",
            blog:"",
            blogName:"",
            avatarUrl:"",
            repoDivItemsMap:[],
            resultFound:true,
            inputFocused:false});
    }
    focusNameInput() {
        this.setState({inputFocused:true});
        this.nameInput.current.focus();
        if(this.state.theme=='dark')
        {
            document.documentElement.setAttribute('input-focus', 'dark-true');
        }
        else {
            document.documentElement.setAttribute('input-focus', 'light-true');
        }
    }
    handleChange(event) {

        const { value } = event.target;
        value.replace('@', '');
        this.setState(() => {
            return {
                searchQuery: value
            };
        });
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

        this.setState({wait:true});
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
        let userName=this.state.searchQuery.replace('@', '');
        axios.get('https://api.github.com/users/'+userName).then((result)=> {
            this.setState({wait:false});
            this.setState({resultFound:true});
            this.setState({fullName:result.data.name});
            this.setState({company: result.data.company});
            this.setState({location: result.data.location});
            this.setState({blog: result.data.blog});
            let hostName=this.getUrlHostName(result.data.blog);
            this.setState({blogName: hostName});
            this.setState({avatarUrl:result.data.avatar_url});
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
                            this.setState({ repoDivItemsMap: [...this.state.repoDivItemsMap, repoDivItemMap] });
                        }
                });
                result.data.map((item,i) => {
                    if (item.fork) {
                        axios.get('https://api.github.com/repos/' + userName + "/" + item.name+"?sort=created&direction=desc").then((repo) => {
                            let forkedDivItem=(<ul className="block">
                                <li className="item-container" ><a href={item.html_url} target="_blank" className="item title extra-bold">{item.name}</a>
                                    <p className="item medium forked">{'Forked from @'}</p><a href={'https://github.com/'+repo.data.source.owner.login} target="_blank"  className="item medium">{repo.data.source.owner.login}</a></li>
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
                            this.setState({ repoDivItemsMap: [...this.state.repoDivItemsMap, repoDivItemMap] });
                            this.state.repoDivItemsMap.sort(function(a,b){
                                return new Date(b.updatedAt) - new Date(a.updatedAt);
                            });
                            if(this.state.repoDivItemsMap.length==result.data.length){
                                this.setState({wait:false});
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
            this.setState({wait:false});
            this.setState({resultFound:false});
            this.setState({errorMessage:'User not found :('});
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
        let repoDivColumn1Items = this.state.repoDivItemsMap.map((item,i) => {
            if(i<2)
                return (
                    item.divItem
                );


        });
        let repoDivColumn2Items = this.state.repoDivItemsMap.map((item,i) => {
            if(i>1 && i<4)
                return (
                    item.divItem
                );
        });
        let repoEmptyColumn1BlockItems=[];
        for (var i = 0; i < 2; i++) {
            repoEmptyColumn1BlockItems.push(
                <ul className="block"></ul>
            );
        }
        let repoEmptyColumn2BlockItems=[];
        repoEmptyColumn2BlockItems.push(
            <ul className="block"></ul>
        );
        return (
            <div className="container">
                <div className="container-2">
                    <div className="theme-icon-div" ref={this.themeToggleIconDiv} onClick={this.toggleTheme}><i className="theme-icon" data-eva={this.props.themeInfo.theme=='light'?"moon":"sun-outline"} ref={this.themeToggleIcon} data-eva-fill="#212121" ></i></div>
                    <h1>GitHub Profiles</h1>
                    <h2>Enter a GitHub username,
                        to see the magic.</h2>
                    <form className="search-form" onSubmit={this.handleSearchApi}>
                        <label htmlFor="username">GitHub username:</label>

                        <div className="form-group">

                            <input id="username"
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}
                            placeholder={'@username'}
                           ref={this.nameInput}
                           onClick={this.focusNameInput}
                            />
                            <button type="submit" ref={this.submitButton} >
                                {this.state.wait? <i data-eva="loader-outline"></i>:<i data-eva="search-outline"></i>}
                            </button>
                        </div>

                    </form>

                        {this.state.resultFound? <div className="row"><div className="column-info">
                                {this.state.wait?<div className="img-block"></div>:(this.state.avatarUrl)?<img className="img-block" src={this.state.avatarUrl} alt=""/>:<React.Fragment/>}
                                {this.state.wait?<div className="fullname-block"></div>:(this.state.fullName)?<React.Fragment><div className="fullname-p-block extra-bold"><p className="fullname-value">{this.state.fullName}</p></div></React.Fragment>:<React.Fragment/>}
                            {this.state.wait?<div className="company-block"></div>:(this.state.company)?<React.Fragment><div className="company-p-block"><p className="company-key">{'Company: '}</p><p className="company-value">{this.state.company}</p></div></React.Fragment>:<React.Fragment/>}
                                {this.state.wait?<div className="location-block"></div>:(this.state.location)?<React.Fragment><div className="location-p-block"><p className="location-key">{'Location: '}</p><p className="location-value">{this.state.location}</p></div></React.Fragment>:<React.Fragment/>}
                            {this.state.wait?<div className="blog-block"></div>:(this.state.blog)? <div className="blog-p-block"><p className="blog-key">{'Website: '}</p><a href={this.state.blog} target="_blank">{this.state.blogName}</a></div>:<React.Fragment/>}
                            </div> <div className="column-repos"><div className="column-1">{this.state.wait?repoEmptyColumn1BlockItems:repoDivColumn1Items}</div><div className="column-2">{this.state.wait?repoEmptyColumn2BlockItems:repoDivColumn2Items}</div></div></div>:
                            <p className="error-message extra-bold">{this.state.errorMessage}</p>}
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    themeInfo: state.themeInfo
})
const mapDispatchToProps = dispatch => ({
    checkThemeLocal: () => dispatch(checkThemeLocal()),
    getTheme: () => dispatch(getTheme()),
    setTheme: (theme) => dispatch(setTheme(theme))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form)