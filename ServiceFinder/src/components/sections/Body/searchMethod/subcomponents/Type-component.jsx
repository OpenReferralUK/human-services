import React from 'react';

import store from '../../../../../Store/store';

import SearchMethodSection from '../SearchMethodSection/SearchMethodSection';
import TagSelector from './../../../../shared/Elements/TagSelector';

import { getServiceTypesAction } from '../../../../../Store/Actions/actions';
import AlertModal from '../../../../shared/Elements/AlertModal';
import { getDataFromLocalStorage } from '../../personaProfile/functions';

export default class TypeComponent extends React.Component {

    state = {
        ...this.getCurrentStateFromStore(),
        isLoaded: false,
        sData: [],
    }

    componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        const data = getDataFromLocalStorage('serviceTypesData');
        if (data.error) {
            this.setState({ error: JSON.stringify(data.error) });
            return window.$('#serviceTypes').appendTo('body').modal('show');
        } else {
            const finalData = data.content.filter(item => item.parent === null);
            finalData.sort((a, b) => a.name > b.name ? 1 : -1);
            this.setState({
                sData: finalData,
                isLoaded: true
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return store.getState().Interacted.serviceTypes
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState && currentState !== undefined) {
            this.setState({ valueSelected: currentState.interacted ? currentState : null })
        }
        this.forceUpdate();
    }

    saveValue = async (value) => {
        try {
            await store.dispatch(getServiceTypesAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#serviceTypes').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <SearchMethodSection title="Choose a type of service" description="Search by service type" >
                <AlertModal name="serviceTypes" id="serviceTypes" error={this.state.error} />
                {this.state.isLoaded &&
                    <div className="d-flex justify-content-between align-items-center">
                        <TagSelector
                            data_selected={this.state.valueSelected}
                            isMulti={false}
                            title="Start typing to choose a service type"
                            isSearchable={true}
                            id="serviceTypesByTag"
                            data={this.state.sData && this.state.sData.map(item => ({ value: item.id, label: item.name, original: item }))}
                            placeholder="Type something"
                            onChange={(value) => this.saveValue(value)}
                            name="serviceTypes">
                        </TagSelector>
                    </div>
                }
            </SearchMethodSection>
        )
    }
}