import React from 'react';

import { clearAllSelectedItems } from '../../../../functions/GeneralFunctions';

import AgeComponent from './subcomponents/Age-component';
import AvailabilityComponent from './subcomponents/Availability-component';
import CircumstancesComponent from './subcomponents/Circumstances-component';
import ProximityComponent from '../../../shared/Components/Proximity-component';
import PostcodeComponent from '../../../shared/Components/Postcode-component';
import GenderComponent from './subcomponents/Gender-component';
import NeedsComponent from './subcomponents/Needs-component';
import store from '../../../../Store/store';
import SearchButton from '../../../shared/Elements/SearchButton';

export default class PersonaPorfileContent extends React.Component {

    state = {
        cleared: true
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    clearProfile = async () => {
        this.setState({ cleared: false });
        let r = await clearAllSelectedItems()
        if (r) await this.setState({ cleared: true });
    }


    render() {
        let btnDisabled = store.getState().Interacted
        let interacted = []
        for (const key in btnDisabled) {
            if (btnDisabled.hasOwnProperty(key)) {
                const element = btnDisabled[key];
                if (element.interacted) {
                    interacted.push(element);
                }
            }
        }
        return (
            <>
                <SearchButton />
                <div className="w-100 d-flex justify-content-end">
                    <button
                        className={`btn ${(interacted.length <= 0 ? 'btn-secondary' : 'btn-danger')}`}
                        disabled={interacted.length <= 0}
                        onClick={this.clearProfile}>
                        Clear data
                    </button>
                </div>
                <div className="row mb-2">
                    <div className="col">
                        <AgeComponent />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-md-auto w-100">
                        <PostcodeComponent />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-md-auto w-100">
                        <ProximityComponent />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-md-auto w-100">
                        <GenderComponent />
                    </div>
                </div>
                <div className="row mt-2 mx-1">
                    <div className="col-md-auto w-100">
                        <NeedsComponent />
                    </div>
                </div>
                <div className="row mx-1">
                    <div className="col-md-auto w-100">
                        <CircumstancesComponent />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-md-auto w-100">
                        <AvailabilityComponent />
                    </div>
                </div>
            </>
        )
    }
}