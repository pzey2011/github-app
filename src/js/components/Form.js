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
    }
    componentDidMount() {
        eva.replace({
            width:18,
            height:18,
        });

    }
    componentDidUpdate() {
        eva.replace();
    }
    focusNameInput() {
        this.setState({inputFocused:true});
        this.submitButton.current.style.backgroundColor='black';
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
    handleSearchApi(event){
        event.preventDefault();
        this.setState({wait:true});
        let userName=this.state.searchQuery.replace('@', '');
        axios.get('https://api.github.com/users/'+userName).then((result)=> {
            this.setState({resultFound:true});
            this.setState({fullName:result.data.name});
            this.setState({company: result.data.company});
            this.setState({location: result.data.location});
            this.setState({blog: result.data.blog});
            this.setState({avatarUrl:result.data.avatar_url});
            axios.get('https://api.github.com/users/'+userName+"/repos?sort=created&direction=desc").then((result)=> {
                result.data.map((item,i) =>{
                        let forkedLink =<React.Fragment/>;
                        if(!item.fork)
                        {

                             let unForkedDivItem=(
                                <ul key={i}>
                                    <li>{item.name}</li>
                                    {item.description ? <li>{item.description}</li> : <React.Fragment/>}
                                    {item.language ? <li><i data-eva="code-outline"></i>{item.language}</li> :
                                        <React.Fragment/>}
                                    <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                    <li><i data-eva="copy-outline"></i>{item.forks}</li>
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
                            let forkedDivItem=(<ul key={i}>
                                <li>{item.name}</li>
                                <li>{'Forked from '}<a href={'https://github.com/'+repo.data.source.owner.login}>{'@'+ repo.data.source.owner.login}</a></li>
                                {item.description ? <li>{item.description}</li> : <React.Fragment/>}
                                {item.language ? <li><i data-eva="code-outline"></i>{item.language}</li> :
                                    <React.Fragment/>}
                                <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                <li><i data-eva="copy-outline"></i>{item.forks}</li>
                            </ul>);

                            let repoDivItemMap= {
                                updatedAt: item.updated_at,
                                divItem: forkedDivItem
                            }
                            this.setState({ repoDivItemsMap: [...this.state.repoDivItemsMap, repoDivItemMap] });
                            debugger;
                            this.state.repoDivItemsMap.sort(function(a,b){
                                return new Date(b.updatedAt) - new Date(a.updatedAt);
                            });
                            debugger;

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
                            <p>{this.state.fullName?'name: '+this.state.fullName:""}</p><br/>
                            <p>{this.state.company?('company: '+this.state.company):""}</p><br/>
                            <p>{this.state.location?('location: '+this.state.location):""}</p><br/>
                            {this.state.blog? <p>{'blog: '}<a href={'https://'+this.state.blog}>{this.state.blog}</a></p>:<React.Fragment/>}
                            {repoDivItems}</div>:
                            <p style={{color:'red'}}>{this.state.errorMessage}</p>}

            </div>

        );
    }
}

export default Form;
