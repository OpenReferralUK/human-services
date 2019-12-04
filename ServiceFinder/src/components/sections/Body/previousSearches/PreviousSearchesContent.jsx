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

    applySearch = async (index) => {
        window.$('div#searchingForCollapse').collapse('show');
        window.$('a[href="#searchingFor"]').tab('show');
        for (let obj in this.state.searches[index].data) {
            let varBase = this.state.searches[index].data[obj];
            switch (obj) {
                case 'age':
                    await store.dispatch(getAgeAction(varBase.value));
                    break;
                case 'postcode':
                    await store.dispatch(getPostcodeAction(varBase.value));
                    break;
                case 'proximity':
                    await store.dispatch(getProximityAction(varBase));
                    break;
                case 'gender':
                    await store.dispatch(getGenderAction(varBase));
                    break;
                case 'availability':
                    await store.dispatch(getAvailabilityAction(varBase.data));
                    break;
                case 'needs':
                    await store.dispatch(getNeedsAction(varBase.data));
                    break;
                case 'circumstances':
                    await store.dispatch(getCircumstancesAction(varBase.data));
                    break;
                case 'serviceTypes':
                    await store.dispatch(getServiceTypesAction(varBase));
                    break;
                default: return true;
            }
        }
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
                        this.state.searches.map((item, i) => {
                            let itemsArr = [];
                            for (let obj in item.data) {
                                const date = new Date();
                                let newString = obj.replace(obj.charAt(0), obj.charAt(0).toUpperCase());
                                newString = newString.replace('_', ' ');
                                if (newString !== 'All Services') {
                                    itemsArr.push(<li key={`${(i + 1) * date.getTime()}`}>{newString}: {item.data[obj].label}</li>);
                                    break;
                                } else {
                                    itemsArr.push(<li key={`${(i + 1) * date.getTime()}`}>{newString}</li>);
                                    break;
                                }
                            }
                            return (
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
                                        {itemsArr}
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
                            )
                        })
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