import React from 'react';
import Select from "react-select";

import store from '../../../../../Store/store';
import AlertModal from '../../../../shared/Elements/AlertModal';
import { getCircumstancesAction, getGenderAction } from '../../../../../Store/Actions/actions';
import { getDataFromLocalStorage } from '../functions';

export default class GenderComponent extends React.Component {

    state = this.getCurrentStateFromStore();

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        const data = getDataFromLocalStorage('genderData');
        if (data.error) {
            await this.setState({ error: JSON.stringify(data.error) });
            return window.$('#gender').appendTo('body').modal('show');
        } else {
            data.content.sort((a, b) => a.name > b.name ? 1 : -1);
            await this.setState({
                gData: data.content,
                isLoaded: true
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        let gender = store.getState().Interacted.gender;
        if (gender !== undefined) {
            if (gender.value === '') gender = null;
        }
        return {
            gender
        }
    }

    updateStateFromStore = async () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            await this.setState({ ...currentState, value: '' });
        }
    }

    changeGender = async (value) => {
        try {
            await this.setState({ value });
            await store.dispatch(getGenderAction(value));
            await store.dispatch(getCircumstancesAction([value]));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#gender').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <>
                <AlertModal name="gender" id="gender" error={this.state.error} />
                {this.state.isLoaded &&
                    <div className="col pr-3">
                        <label className="mb-0" htmlFor="genderSelector">Gender:</label>
                        <Select
                            id="genderSelector"
                            className="mr-1"
                            placeholder="Select..."
                            value={this.state.gender}
                            isMulti={false}
                            isClearable={false}
                            options={this.state.gData && this.state.gData.map(item => ({ value: item.id, label: item.name, original: item }))}
                            onChange={this.changeGender}
                        />
                    </div>
                }
            </>
        )
    }
}