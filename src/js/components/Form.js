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
            repoItemsMapByTime:[],
            theme:'white'
        };
        this.handleSearchApi= this.handleSearchApi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.nameInput=React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);
    }
    componentDidMount() {
        eva.replace();

    }
    focusTextInput() {
        eva.replace({
            fill:'black'
        });
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
            axios.get('https://api.github.com/users/'+userName+"/repos").then((result)=> {
                let notForkedRepoItems = result.data.map((item,i) =>{
                        let forkedLink =<React.Fragment/>;

                        if(!item.fork)
                        {
                            return (
                                <ul key={i}>
                                    <li>{item.name}</li>
                                    {item.description ? <li>{item.description}</li> : <React.Fragment/>}
                                    {item.language ? <li><i data-eva="code-outline"></i>{item.language}</li> :
                                        <React.Fragment/>}
                                    <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                    <li><i data-eva="copy-outline"></i>{item.forks}</li>
                                </ul>
                            );
                        }
                });
                result.data.map((item,i) => {
                    if (item.fork) {
                        axios.get('https://api.github.com/repos/' + userName + "/" + item.name).then((repo) => {
                            this.setState({wait:false});
                            let forkedItem=(<ul key={i}>
                                <li>{item.name}</li>
                                <li>{'Forked from '}<a href={'https://github.com/'+repo.data.source.owner.login}>{'@'+ repo.data.source.owner.login}</a></li>
                                {item.description ? <li>{item.description}</li> : <React.Fragment/>}
                                {item.language ? <li><i data-eva="code-outline"></i>{item.language}</li> :
                                    <React.Fragment/>}
                                <li><i data-eva="star-outline"></i>{item.stargazers_count}</li>
                                <li><i data-eva="copy-outline"></i>{item.forks}</li>
                            </ul>);
                            this.setState({ repoItems: [...this.state.repoItems, forkedItem] });

                            if(i==result.data.length-1)
                            {
                                this.setState({repoItems:forkedItems});
                            }

                        }).catch((error) => {
                            // handle error
                            console.log(error);
                        });

                    }
                });
                this.setState({repoItems:notForkedRepoItems});


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
                               onClick={this.focusTextInput}
                        />
                        <button type="submit">
                            <i data-eva="search-outline"></i>
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
                            {this.state.repoItems}</div>:
                            <p style={{color:'red'}}>{this.state.errorMessage}</p>}

            </div>

        );
    }
}

export default Form;
