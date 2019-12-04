import React, { Component } from 'react';
import { getItemsFromData } from '../../sections/Body/searchMethod/functions';
import store from '../../../Store/store';
import { getNeedsAction, getCircumstancesAction } from '../../../Store/Actions/actions';


export default class GridPersona extends Component {

    classListBase = "col-xl p-1 m-1 rounded card-header cursor-pointer text-nowrap d-flex justify-content-center";

    handleClick = async (value) => {
        let arr = getItemsFromData(value);
        try {
            await store.dispatch(getNeedsAction(arr.arrNeeds));
            await store.dispatch(getCircumstancesAction(arr.arrCirc));
            window.$('#personaProfileTab').tab('show')
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (window.innerWidth >= 992) {
            return (
                <div >
                    <div className="row justify-content-center">
                        <div className={this.classListBase} onClick={() => this.handleClick(0)} data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="true" aria-controls="personaProfileCollapse">Lonely</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(1)} data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="true" aria-controls="personaProfileCollapse">Older</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(2)} data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="true" aria-controls="personaProfileCollapse">Unemployed</div>
                    </div>
                    <div className="row justify-content-center">
                        <div className={this.classListBase} onClick={() => this.handleClick(3)} data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="true" aria-controls="personaProfileCollapse">Low income</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(4)} data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="true" aria-controls="personaProfileCollapse">Young family</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(5)} data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="true" aria-controls="personaProfileCollapse">Disabled person</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div >
                    <div className="row">
                        <div className={this.classListBase} onClick={() => this.handleClick(0)}>Lonely</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(1)}>Older</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(2)}>Unemployed</div>
                    </div>
                    <div className="row">
                        <div className={this.classListBase} onClick={() => this.handleClick(3)}>Low income</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(4)}>Young family</div>
                        <div className={this.classListBase} onClick={() => this.handleClick(5)}>Disabled person</div>
                    </div>
                </div >
            )
        }
    }
}