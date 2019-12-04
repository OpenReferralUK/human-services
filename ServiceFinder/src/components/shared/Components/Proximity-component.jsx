import React from 'react';
import Select from 'react-select';

import initial_data from '../../../config';
import InputElement from '../Elements/InputElement';
import AlertModal from '../Elements/AlertModal';
import store from '../../../Store/store';
import { getProximityAction } from '../../../Store/Actions/actions';

export default class ProximityComponent extends React.Component {
    state = {
        ...this.getCurrentStateFromStore(),
        // valueSelected: undefined,
        isLoaded: false,
    }

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        await this.setState({
            isLoaded: true
        });
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            // valueSelected: store.getState().Interacted.proximity.value,
            proximity: store.getState().Interacted.proximity,
        }
    }

    updateStateFromStore = async () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            await this.setState(currentState);
        }
        if (this.state.proximity && this.state.proximity.value === '') {
            this.setState({
                valueSelected: undefined
            })
        }
    }


    changeProximity = async (value) => {
        if (value === null) {
            value = { value: '', label: '' }
        }
        await this.setState({ valueSelected: value.value });
        if (value.value !== 4) this.saveProximity(value)
        else window.$('#proximityInput').focus();
    }

    saveProximity = async (value) => {
        try {
            await store.dispatch(getProximityAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#proximity').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <>
                <AlertModal name="proximity" id="proximity" error={this.state.error} />
                {this.state.isLoaded &&
                    <div className="col">
                        <label htmlFor="proximityComponent" className="mb-0">Distance in miles (up to):</label>
                        <div id="proximityComponent" className="row px-0">
                            <div className="col-xl w-100">
                                <Select
                                    options={initial_data.persona_profile.proximity}
                                    isClearable={true}
                                    value={this.state.valueSelected ?
                                        //When we select 4
                                        this.state.valueSelected < 4 ?
                                            this.state.proximity
                                            :
                                            { value: 4, label: 'Other distance...' }
                                        :
                                        null}
                                    onChange={this.changeProximity}
                                />
                            </div>
                            <div className="col-xl w-100" style={{ display: this.state.valueSelected >= 4 ? 'flex' : 'none' }}>
                                <InputElement
                                    type="number"
                                    id="proximityInput"
                                    value={this.state.proximity ? this.state.proximity.value : ''}
                                    placeholder="Insert proximity"
                                    onChange={(value) => this.changeProximity(+value === 0 ? null : { value: +value, label: `${value} Miles` })}
                                />
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}