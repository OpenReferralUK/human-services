import React from 'react';

import TagSelector from '../../../../shared/Elements/TagSelector';
import AlertModal from '../../../../shared/Elements/AlertModal';

import store from '../../../../../Store/store';
import { getCircumstancesAction, getGenderAction } from '../../../../../Store/Actions/actions';
import { getDataFromLocalStorage } from '../functions';

export default class CircumstancesComponent extends React.Component {

    state = {
        ...this.getCurrentStateFromStore(),
        isLoaded: false,
        cData: []
    }

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        const data = getDataFromLocalStorage('circumstancesData');
        if (data.error) {
            await this.setState({ error: JSON.stringify(data.error) });
            return window.$('#circumstances').appendTo('body').modal('show');
        } else {
            const finalData = data.content.filter(item => item.parent === null);
            finalData.sort((a, b) => a.name > b.name ? 1 : -1);
            this.setState({
                cData: finalData,
                isLoaded: true
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            circumstances: store.getState().Interacted.circumstances,
        }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            this.setState(currentState);
        }
    }

    addCircumstance = async (value, action) => {
        try {
            if ((value === null) || (value.length === 0)) {
                if (action.action !== 'clear') {
                    if (action.removedValue !== undefined) {
                        if ((action.removedValue.value === 'circumstance:192') || (action.removedValue.value === 'circumstance:193') || (action.removedValue.value === 'circumstance:194')) {
                            await store.dispatch(getGenderAction({
                                value: '', label: ''
                            }));
                        }
                    }
                } else {
                    await store.dispatch(getGenderAction({
                        value: '', label: ''
                    }));
                }
            }
            await store.dispatch(getCircumstancesAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#circumstances').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <>
                <AlertModal name="circumstances" id="circumstances" error={this.state.error} />
                {this.state.isLoaded &&
                    <TagSelector
                        title="Circumstances:"
                        id="circumstances"
                        isMulti={true}
                        name="circumstances"
                        data_selected={this.state.circumstances.data}
                        data={this.state.cData && this.state.cData.map(item => ({ value: item.id, label: item.name, original: item }))}
                        isSearchable={true}
                        placeholder="Select circumstance"
                        onChange={this.addCircumstance}
                    />
                }
            </>
        )
    }
}