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
            repoItems:[],
            resultFound:true,
        };
        this.handleSearchApi= this.handleSearchApi.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        eva.replace();

    }
    componentDidUpdate() {
        eva.replace();

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
            this.setState({fullName:result.data.name});
            this.setState({company: result.data.company});
            this.setState({location: result.data.location});
            this.setState({blog: result.data.blog});
            this.setState({avatarUrl:result.data.avatar_url});
            axios.get('https://api.github.com/users/'+userName+"/repos").then((result)=> {
                let listItems = result.data.map((item,i) =>{
                    debugger;
                    if(item.fork) {
                        let forkedLink =<React.Fragment/>;
                        axios.get('https://api.github.com/repos/' + userName + "/" + item.name).then((repo) => {
                            debugger;
                            console.log(repo.data.source.owner.login);
                            forkedLink =  <a href="#">{'@' + repo.data.source.owner.login}</a>;
                            return( <ul key={i}>
                                <li>{item.name}</li>
                                <li>{'Forked from '+ forkedLink}</li>
                                {item.description? <li>{item.description}</li>:<React.Fragment/>}
                                {item.language?<li><i data-eva="code-outline"></i>{item.language}</li>:<React.Fragment/>}
                                <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                <li><i data-eva="copy-outline"></i>{item.forks}</li>
                            </ul>);


                        }).catch((error)=> {
                            // handle error
                            console.log(error);
                            return( <ul key={i}>
                                <li>{item.name}</li>
                                <li>{'Forked from '+ forkedLink}</li>
                                {item.description? <li>{item.description}</li>:<React.Fragment/>}
                                {item.language?<li><i data-eva="code-outline"></i>{item.language}</li>:<React.Fragment/>}
                                <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                <li><i data-eva="copy-outline"></i>{item.forks}</li>
                            </ul>);
                        });

                    }
                    else{
                        return(
                            <ul key={i}>
                                <li>{item.name}</li>
                                {item.description? <li>{item.description}</li>:<React.Fragment/>}
                                {item.language?<li><i data-eva="code-outline"></i>{item.language}</li>:<React.Fragment/>}
                                <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                <li><i data-eva="copy-outline"></i>{item.forks}</li>
                            </ul>
                        );
                    }



                });
                this.setState({repoItems:listItems});
                this.setState({wait:false});
                this.setState({resultFound:true});
            }).catch((error)=> {
                // handle error
                console.log(error);
                this.setState({resultFound:false});
                this.setState({errorMessage:'User not found :('})
                this.setState({wait:false});
            });
        }).catch((error)=> {
            // handle error
            console.log(error);
        });

        console.log(this.state);
    }
    render() {
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
                        />
                        <button type="submit">
                            <i data-eva="search-outline"></i>
                        </button>
                    </form>
                    <br/>

                        {this.state.resultFound?  <div className="row"> <img src={this.state.avatarUrl} alt=""/>

                            <br/>
                            <p>{this.state.fullName?'name: '+this.state.fullName:""}</p><br/>
                            <p>{this.state.company?('company: '+this.state.company):""}</p><br/>
                            <p>{this.state.location?('location: '+this.state.location):""}</p><br/>
                            {this.state.blog? <p>{'blog: '}<a href="#">{this.state.blog}</a></p>:<React.Fragment/>}
                            {this.state.repoItems}</div>:<p style={{color:'red'}}>{this.state.errorMessage}</p>}

                </div>

    );
    }
}

export default Form;
