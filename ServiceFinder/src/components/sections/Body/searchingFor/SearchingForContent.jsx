import React from 'react';
import Select from "react-select";

import store from '../../../../Store/store';

import { getDataWithText, tagChange } from './functions';
import { getResults, getInteractedElements, clearAllSelectedItems } from '../../../../functions/GeneralFunctions';
import ResultsContent from '../Results/ResultsContent';
import AlertModal from '../../../shared/Elements/AlertModal';
import { SAVE_ELEMENT } from '../../../../Store/Actions/types';
import { getTextAction, getGenderAction, getServiceTypesAction } from '../../../../Store/Actions/actions';


export default class SearchingForContent extends React.Component {

    state = {
        ...this.getCurrentStateFromStore(),
        isFetching: false,
        data: {}
    };

    componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        this.updateStateFromStore();
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        const interacted = store.getState().Interacted;
        let interactedFinal = {}
        for (const obj in interacted) {
            if (interacted[obj].interacted) {
                interactedFinal[obj] = interacted[obj];
            }
        }
        return interactedFinal
    }

    updateStateFromStore = () => {
        const originaData = this.getCurrentStateFromStore();
        const currentState = getDataWithText(originaData);
        if (this.state !== currentState) {
            if (this.state.interacted) {
                if (this.state.interacted.length !== currentState.length) {
                    this.clearResults();
                }
            }
            this.setState({ interacted: currentState, originaData: originaData, focus: true });
        }
    }

    openBox = async (category) => {
        switch (category) {
            case 'needs':
                window.$('#collapse_need').collapse('show');
                window.$('#searchMethodTab').tab('show');
                window.$('#searchMethodCollapse').collapse('show');
                break;
            case 'circumstances':
                window.$('#collapse_circumstances').collapse('show');
                window.$('#searchMethodTab').tab('show');
                window.$('#searchMethodCollapse').collapse('show');
                break;
            default: return;
        }
    }

    clearItems = async () => {
        await store.dispatch(getServiceTypesAction({
            value: '',
            label: ''
        }));
        this.setState({ byText: '' });
        return clearAllSelectedItems();
    }

    changeItems = async (value, action) => {
        if (action.action === 'clear') {
            await store.dispatch(getServiceTypesAction({
                value: '',
                label: ''
            }));
            return clearAllSelectedItems();
        }
        const storeAction = tagChange(value, action);
        try {
            await store.dispatch(getGenderAction({
                value: '',
                label: ''
            }));
            await store.dispatch(storeAction);
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            return window.$('#searchingFor').appendTo('body').modal('show');
        }
    }

    searchClick = async (e, page = 1, perPage = 10) => {
        e.preventDefault();
        await this.setState({ isFetching: true });
        this.clearResults();
        try {
            await store.dispatch(getTextAction(!this.state.byText ? '' : this.state.byText));
            let arr = await getInteractedElements(this.state.originaData, page, perPage);
            const action = {
                type: SAVE_ELEMENT,
                payload: arr
            }
            await store.dispatch(action);
            await this.setState({
                isFetching: false,
                query: arr.query,
                results: await getResults(arr.query),
                data: arr
            });
            if (this.state.results) setTimeout(window.location.href = `#results`, 100);
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            return window.$('#searchingFor').appendTo('body').modal('show');
        }
    }

    changePage = async (page = 1, perPage = 10) => {
        await this.setState({ isFetching: true });
        let arr = await getInteractedElements(this.state.originaData, page, perPage);
        this.clearResults();
        await this.setState({
            isFetching: false,
            query: arr.query,
            results: await getResults(arr.query),
            data: arr
        });
    }

    clearResults = async () => {
        this.setState({
            results: undefined,
        })
    }

    formatOptionLabel = (item) => (
        <div className="text-wrap" onClick={() => this.openBox(item.category)} key={`${item.category}`}>
            <p className="mb-0">{item.label}</p>
        </div>
    )

    render() {
        return (
            <>
                <AlertModal id="searchingFor" name="searching for action" error={this.state.error} />
                < div className="d-flex justify-content-end w-100 mt-3">
                    <button
                        type="button"
                        disabled={!((this.state.interacted && this.state.interacted.length > 0) || (this.state.byText))}
                        className={`btn ${((this.state.interacted && this.state.interacted.length > 0) || (this.state.byText)) ? ('btn-danger') : ('btn-secondary')}`}
                        onClick={this.clearItems}>
                        Clear data
                        </button>
                </div>
                <form onSubmit={this.searchClick}>
                    <div className="d-flex my-3">
                        <div className="d-flex flex-column col">
                            <div>
                                <Select
                                    className="mb-1"
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, Menu: () => null, }}
                                    isMulti={true}
                                    isClearable={true}
                                    value={this.state.interacted}
                                    formatOptionLabel={this.formatOptionLabel}
                                    isSearchable={false}
                                    placeholder='Searching for'
                                    onChange={(value, action) => this.changeItems(value, action)} />
                            </div>
                            <small className="text-muted">You can also optionally search for text in the service name:</small>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Insert text"
                                value={this.state.byText || ''}
                                onChange={(e) => this.setState({ byText: e.target.value })} />

                        </div>
                        <button type="type" className="btn btn-secondary col-auto d-flex align-items-center" onClick={this.searchClick}>
                            <i className="material-icons p-0">search</i>
                        </button>
                    </div>
                </form>
                <ResultsContent firstTime={this.state.firstTime} isFetching={this.state.isFetching} paginacion={this.changePage} data={this.arr} results={this.state.results} interacted={this.state.interacted} clearResults={this.clearResults} />
            </>
        )
    }
}