import React, { Component } from "react";
import * as eva from 'eva-icons';
import axios from 'axios';

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
            theme:'white',
            inputFocused:false,
        };
        this.handleSearchApi= this.handleSearchApi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.nameInput=React.createRef();
        this.submitButton=React.createRef();
        this.focusNameInput = this.focusNameInput.bind(this);
        this.getUrlHostName=this.getUrlHostName.bind(this);
        this.reset=this.reset.bind(this);
    }
    componentDidMount() {
        eva.replace({
            width:18,
            height:18,
        });

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
            theme:'white',
            inputFocused:false});
    }
    focusNameInput() {
        this.setState({inputFocused:true});
        this.nameInput.current.focus();
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
        ///reset state
        this.reset();
        /////
        this.setState({wait:true});
        let userName=this.state.searchQuery.replace('@', '');
        axios.get('https://api.github.com/users/'+userName).then((result)=> {
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
                                    {item.description ? <li>{item.description}</li> : <React.Fragment/>}
                                    <li>
                                    {item.language ? <div className="item medium"><i data-eva="code-outline"></i>{item.language}</div> :
                                        <React.Fragment/>}
                                        <div className="item medium"><i data-eva="star-outline"></i>{item.stargazers_count}</div>
                                        <div className="item medium"><i data-eva="copy-outline"></i>{item.forks}</div></li>
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
                            this.setState({wait:false});
                            let forkedDivItem=(<ul className="block">
                                <li ><a href={item.html_url} target="_blank" className="title extra-bold">{item.name}</a>
                                    <div className="item medium">{'Forked from '}<a href={'https://github.com/'+repo.data.source.owner.login} target="_blank">{'@'+ repo.data.source.owner.login}</a></div></li>
                                {item.description ? <li>{item.description}</li> : <React.Fragment/>}
                                <li>{item.language ? <div className="item medium"><i data-eva="code-outline"></i>{item.language}</div> :
                                    <React.Fragment/>}
                                    <div className="item medium"><i data-eva="star-outline"></i>{item.stargazers_count}</div>
                                    <div className="item medium"><i data-eva="copy-outline"></i>{item.forks}</div></li>
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
                                eva.replace();
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
            this.setState({resultFound:false});
            this.setState({errorMessage:'User not found :('})
            this.setState({wait:false});
        });

        console.log(this.state);
    }
    render() {
        let repoDivItems = this.state.repoDivItemsMap.map((item,i) => {
            if(i<4)
                return item.divItem;
        });

        return (
            <div className="container">
                <h1>GitHub Profiles</h1>
                <br/>
                <br/>
                <h2>Enter a GitHub username,
                    to see the magic.</h2>

                    <form onSubmit={this.handleSearchApi}>
                        <label htmlFor="username">GitHub username:</label>
                        <br/>
                        <input id="username"
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                        placeholder={'@username'}
                       ref={this.nameInput}
                       onClick={this.focusNameInput}
                        />
                        <button type="submit" ref={this.submitButton} style={{backgroundColor:'white'}}>
                            <i data-eva="search-outline" data-eva-fill={!this.state.inputFocused?"black":'white'}></i>
                        </button>
                    </form>
                    <br/>

                        {this.state.resultFound? <div className="row">
                                <img src={this.state.avatarUrl} alt=""/>
                                <br/>
                                {this.state.fullName?<React.Fragment><p className="extra-bold">{this.state.fullName}</p></React.Fragment>:<React.Fragment/>}
                            {this.state.company?<React.Fragment><p>{'company: '+this.state.company}</p></React.Fragment>:<React.Fragment/>}
                            {this.state.location?<React.Fragment><p>{'location: '+this.state.location}</p></React.Fragment>:<React.Fragment/>}
                            {this.state.blog? <p>{'blog: '}<a href={this.state.blog} target="_blank">{this.state.blogName}</a></p>:<React.Fragment/>}
                            {repoDivItems}</div>:
                            <p style={{color:'red'}}>{this.state.errorMessage}</p>}

            </div>

        );
    }
}

export default Form;
