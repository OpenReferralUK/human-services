import React from 'react';

import store from '../../../../../Store/store';

import { getNeedsAction } from '../../../../../Store/Actions/actions';

import TagSelector from '../../../../shared/Elements/TagSelector';
import AlertModal from '../../../../shared/Elements/AlertModal';
import { getDataFromLocalStorage } from '../functions';

export default class NeedsComponent extends React.Component {

    state = {
        ...this.getCurrentStateFromStore(),
        isLoaded: false,
        nData: []
    }

    componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        const data = getDataFromLocalStorage('needsData');
        if (data.error) {
            this.setState({ error: JSON.stringify(data.error) });
            return window.$('#needs').appendTo('body').modal('show');
        } else {
            const finalData = data.content.filter(item => item.parent === null);
            this.setState({
                nData: finalData,
                isLoaded: true
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            needs: store.getState().Interacted.needs,
        }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            this.setState(currentState);
        }
    }

    addNeed = async (value) => {
        try {
            await store.dispatch(getNeedsAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#needs').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <>
                <AlertModal name="needs" id="needs" error={this.state.error} />
                {this.state.isLoaded &&
                    <TagSelector
                        title="Needs:"
                        id="needs"
                        isMulti={true}
                        name="needs"
                        data={this.state.nData && this.state.nData.map(item => ({ value: item.id, label: item.name, original: item }))}
                        data_selected={this.state.needs.data}
                        isSearchable={true}
                        placeholder="Select needs"
                        onChange={this.addNeed}
                    />
                }
            </>
        )
    }
}