import React from 'react';
import store from '../../../../Store/store';
import { getUpdateFavouriteSearchAction, getAgeAction, getPostcodeAction, getProximityAction, getGenderAction, getNeedsAction, getCircumstancesAction, getAvailabilityAction, getServiceTypesAction } from '../../../../Store/Actions/actions';
import { CLEAR_ALL_FAVOURITES_SEARCHES, CLEAR_ALL_FAVOURITES } from '../../../../Store/Actions/types';

export default class FavouriteSearchContent extends React.Component {

    state = this.getCurrentStateFromStore();

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            favourites: store.getState().FavouritesSearchesReducer
        }
    }

    updateStateFromStore = async () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            await this.setState(currentState);
        }
    }

    updateItem = async (item) => {
        item.favourite = !item.favourite;
        try {
            await store.dispatch(getUpdateFavouriteSearchAction(item));
            this.forceUpdate();
        } catch (e) {
            console.log('Error(addFavouriteSearch): ', e)
        }
    }

    clearFavouritesSearches = async () => {
        try {
            await store.dispatch({ type: CLEAR_ALL_FAVOURITES_SEARCHES });
            await store.dispatch({ type: CLEAR_ALL_FAVOURITES });
        } catch (e) {
            console.log(e);
        }
    }

    applySearch = async (index) => {
        window.$('div#searchingForCollapse').collapse('show');
        window.$('a[href="#searchingFor"]').tab('show');
        for (let obj in this.state.favourites[index].data) {
            let varBase = this.state.favourites[index].data[obj];
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
                    {this.state.favourites.length > 0 &&
                        <div className="d-flex w-100 justify-content-end">
                            <button type="button" className="btn btn-danger" onClick={() => this.clearFavouritesSearches()}>Clear searches</button>
                        </div>
                    }
                    {this.state.favourites &&
                        this.state.favourites.length > 0 ?
                        this.state.favourites.map((item, i) => {
                            if (item.favourite) {
                                let itemsArr = [];
                                for (let obj in item.data) {
                                    let newString = obj.replace(obj.charAt(0), obj.charAt(0).toUpperCase());
                                    newString = newString.replace('_', ' ');
                                    itemsArr.push(<li key={i}>{newString}: {item.data[obj].label}</li>);
                                }
                                return (
                                    <>
                                        <div className="card-header itemSelected my-2 rounded" key={i}>
                                            <div className="w-100 d-flex justify-content-between">
                                                <h4 className="card-title mb-2">Searching for:</h4>
                                                <div className="d-flex justify-content-end col-auto pr-0 align-items-center">
                                                    <div className="ml-2 d-flex align-items-center cursor-pointer">
                                                        <i className="mx-1 material-icons md-18 btn btn-secondary btn-sm" onClick={() => this.updateItem(item)} style={{ color: '#FFC900' }}>star</i>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="mb-1">
                                                {itemsArr}
                                            </ul>
                                            <div className="w-100 d-flex justify-content-between align-items-center">
                                                <p className="mb-0 text-muted">{item.date}</p>
                                                <p className="btn btn-secondary card-link mb-0 cursor-pointer" onClick={() => this.applySearch(i)}>Search</p>
                                            </div>
                                        </div>
                                    </>
                                )
                            } else {
                                return (
                                    <div className="w-100 d-flex justify-content-center mt-5">
                                        <h5 className="text-black-50">No favourite searches</h5>
                                    </div>
                                )
                            }
                        })
                        :
                        <div className="w-100 d-flex justify-content-center my-3">
                            <h5 className="text-black-50">No favourite searches</h5>
                        </div>
                    }
                </div>
            </>
        )
    }
}