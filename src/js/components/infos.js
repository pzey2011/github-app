import React, { Component } from "react";
import { connect } from 'react-redux';

class Infos extends Component {
    constructor() {
        super();

    }

    render() {
        return (
            <div className="column-info">
                {this.props.form.wait ? <div className="img-block"></div> : (this.props.infos.avatarUrl) ?
                    <img className="img-block" src={this.props.infos.avatarUrl} alt=""/> : <React.Fragment/>}
                {this.props.form.wait ? <div className="fullname-block"></div> : (this.props.infos.fullName) ?
                    <React.Fragment>
                        <div className="fullname-p-block extra-bold"><p
                            className="fullname-value">{this.props.infos.fullName}</p></div>
                    </React.Fragment> : <React.Fragment/>}
                {this.props.form.wait ? <div className="company-block"></div> : (this.props.infos.company) ?
                    <React.Fragment>
                        <div className="company-p-block"><p className="company-key">{'Company: '}</p><p
                            className="company-value">{this.props.infos.company}</p></div>
                    </React.Fragment> : <React.Fragment/>}
                {this.props.form.wait ? <div className="location-block"></div> : (this.props.infos.location) ?
                    <React.Fragment>
                        <div className="location-p-block"><p className="location-key">{'Location: '}</p><p
                            className="location-value">{this.props.infos.location}</p></div>
                    </React.Fragment> : <React.Fragment/>}
                {this.props.form.wait ? <div className="blog-block"></div> : (this.props.infos.blog) ?
                    <div className="blog-p-block"><p className="blog-key">{'Website: '}</p><a
                        href={this.props.infos.blog} target="_blank">{this.props.infos.blogName}</a></div> :
                    <React.Fragment/>}
            </div>
        );
    }
}
const mapStateToProps = state => ({
    infos:state.infos,
    form:state.form,
})
export default connect(mapStateToProps)(Infos)