import React, { Component } from "react";
import { connect } from 'react-redux';

class Repos extends Component {
    constructor() {
        super();

    }

    render() {
        let repoDivColumn1Items = this.props.repoDivItems.map((item,i) => {
            if(i<2)
                return (
                    item.divItem
                );


        });
        let repoDivColumn2Items = this.props.repoDivItems.map((item,i) => {
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
            <div className="column-repos"><div className="column-1">{this.props.form.wait?repoEmptyColumn1BlockItems:repoDivColumn1Items}</div><div className="column-2">{this.props.form.wait?repoEmptyColumn2BlockItems:repoDivColumn2Items}</div></div>
        );
    }
}
const mapStateToProps = state => ({
    repoDivItems:state.repoDivItems,
    form:state.form,
})
export default connect(mapStateToProps)(Repos)