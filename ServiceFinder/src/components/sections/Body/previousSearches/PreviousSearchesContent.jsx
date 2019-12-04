import React from 'react';
import store from '../../../../Store/store';
import { getClearAllSearchesAction, getClearPreviousSearchesByIDAction, getUpdateFavouriteSearchAction, getAddFavouriteSearchAction, getAgeAction, getPostcodeAction, getProximityAction, getGenderAction, getNeedsAction, getCircumstancesAction, getAvailabilityAction, getServiceTypesAction } from '../../../../Store/Actions/actions';
import initial_data from '../../../../config';

export default class PreviousSearchesContent extends React.Component {

    state = this.getCurrentStateFromStore();

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            searches: store.getState().SearchesReducer
        }
    }

    updateStateFromStore = async () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            await this.setState(currentState);
        }
    }

    clearPreviousSearches = async () => {
        try {
            await store.dispatch(getClearAllSearchesAction());
        } catch (error) {
            console.log('Error(clearPreviousSearches): ', error);
        }
    }

    clearPreviousSearchesById = async (item) => {
        try {
            await store.dispatch(getClearPreviousSearchesByIDAction(item));
        } catch (error) {
            console.log('Error(clearPreviousSearchesById): ', error);
        }
    }

    addFavouriteSearch = async (item) => {
        item.favourite = !item.favourite;
        try {
            if (item.favourite) await store.dispatch(getAddFavouriteSearchAction(item));
            else await store.dispatch(getUpdateFavouriteSearchAction(item));
            this.forceUpdate();
        } catch (e) {
            console.log('Error(addFavouriteSearch): ', e)
        }
    }

    applySearch = (index) => {
        window.$('div#searchingForCollapse').collapse('show');
        window.$('a[href="#searchingFor"]').tab('show');
        this.state.searches[index].data.map(async deepItem => {
            switch (deepItem.category) {
                case 'age':
                    return await store.dispatch(getAgeAction(deepItem.value));
                case 'postcode':
                    return await store.dispatch(getPostcodeAction(deepItem.value));
                case 'proximity':
                    return await store.dispatch(getProximityAction(deepItem));
                case 'gender':
                    return await store.dispatch(getGenderAction(deepItem));
                case 'availability':
                    return await store.dispatch(getAvailabilityAction(deepItem.data));
                case 'needs':
                    return await store.dispatch(getNeedsAction(deepItem.data));
                case 'circumstances':
                    return await store.dispatch(getCircumstancesAction(deepItem.data));
                case 'serviceTypes':
                    return await store.dispatch(getServiceTypesAction(deepItem));
                default: return true;
            }
        })
    }


    render() {
        return (
            <>
                <div className="container my-1">
                    {this.state.searches.length > 0 &&
                        <div className="d-flex w-100 justify-content-end">
                            <button type="button" className="btn btn-danger" onClick={() => this.clearPreviousSearches()}>Clear searches</button>
                        </div>
                    }
                    {this.state.searches &&
                        this.state.searches.length > 0 ?
                        this.state.searches.map((item, i) =>
                            (
                                <div className="card-header itemSelected my-2 rounded" key={i}>
                                    <div className="w-100 d-flex justify-content-between">
                                        <h4 className="card-title mb-2">Searching for:</h4>
                                        <div className="d-flex justify-content-end col-auto pr-0 align-items-center">
                                            <div className="dropdown">
                                                <button className="btn btn-secondary btn-sm dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" data-display="static" aria-haspopup="true" aria-expanded="false">Options</button>
                                                <div className="dropdown-menu dropdown-menu-lg-right">
                                                    {initial_data.general.allowFavouritesSearches &&
                                                        item.favourite ?
                                                        <button className="cursor-pointer text-nowrap dropdown-item" onClick={() => this.addFavouriteSearch(item)}>Remove from Favourites</button>
                                                        :
                                                        <button className="cursor-pointer text-nowrap dropdown-item" onClick={() => this.addFavouriteSearch(item)}>Add to Favourites</button>
                                                    }
                                                    <button className="dropdown-item cursor-pointer text-nowrap" onClick={() => this.clearPreviousSearchesById(item)}>Remove Search</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="mb-1">
                                        {this.state.searches[i].data.map((deepItem, j) => {
                                            let category = deepItem.category.replace(deepItem.category.charAt(0), deepItem.category.charAt(0).toUpperCase())
                                            category = category.replace('_', " ");
                                            const date = new Date();
                                            if (category !== 'All Services') {
                                                return (<li key={`${(j + 1) * date.getTime()}`}>{category}: {deepItem.label}</li>)
                                            } else {
                                                return (<li key={`${(j + 1) * date.getTime()}`}>{category}</li>);
                                            }
                                        })}
                                    </ul>
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            {item.favourite &&
                                                <i className="material-icons md-14 text-muted mr-1">star</i>
                                            }
                                            <p className="ml-1 mb-0 text-muted">{item.date}</p>
                                        </div>
                                        <p className="btn btn-secondary card-link mb-0 cursor-pointer" onClick={() => this.applySearch(i)}>Search</p>
                                    </div>
                                </div>
                            ))
                        :
                        <div className="w-100 d-flex justify-content-center my-3">
                            <h5 className="text-black-50">No previous searches</h5>
                        </div>
                    }
                </div >
            </>
        )
    }
}