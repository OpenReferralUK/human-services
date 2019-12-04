import React from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';

import store from '../../../../Store/store';
import { CLEAR_ALL_FAVOURITES_SERVICES } from '../../../../Store/Actions/types';
import ResultModal from '../../../shared/Components/ResultModal';
import { API_directions } from '../../../../settings/settings';
import { getUpdateFavouriteServiceAction } from '../../../../Store/Actions/actions';
import { getHTMLServicesList, textToClipboard } from './functions';

class FavouriteServicesContent extends React.Component {

    state = this.getCurrentStateFromStore();

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            favourites: store.getState().FavouritesServiceReducer
        }
    }

    updateStateFromStore = async () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            await this.setState(currentState);
        }
    }

    showModal = async (item) => {
        window.$(`#modalFavouriteInfo`).appendTo('body').modal({ backdrop: 'static' });
        window.$('#modalFavouriteInfo').on('shown.bs.modal', () => {
            window.$(document).keyup((e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            })
            window.$(document).click((e) => {
                if (e.target.id === 'modalFavouriteInfo' && window.$('#modalFavouriteInfo').hasClass('show')) {
                    this.closeModal();
                }
            })
        })

        let data;
        await Axios.get(`${API_directions.get.serviceId}${item.id}`)
            .then(async res => data = await res.data)
            .catch(e => console.log(e));
        if (data) {
            await this.setState({ item, res: data, isModalLoaded: true });
        }
        else (alert('Cant find the result'));
    }

    closeModal = async () => {
        await window.$("#modalFavouriteInfo").appendTo('#modal-favourite-div').modal('hide');
        await this.setState({
            isModalLoaded: false
        });
    }

    clearFavouritesServices = async () => {
        try {
            await store.dispatch({ type: CLEAR_ALL_FAVOURITES_SERVICES });
        } catch (e) {
            console.log(e);
        }
    }

    copyServiceList = () => {
        getHTMLServicesList(this.state.favourites.slice());
    }

    deleteFavourite = async (item) => {
        item.favourite = false;
        try {
            await store.dispatch(getUpdateFavouriteServiceAction(item));
        } catch (e) {
            console.log(e);
        }
    }

    sendServiceList = () => {
        let items = store.getState().FavouritesServiceReducer;
        let finalList = '';
        items.map((item, i) => {
            return finalList = finalList + `${item.id}&`;
        });
        this.props.history.push("/service-list/" + finalList);
    }

    copyShareLink = async () => {
        let items = store.getState().FavouritesServiceReducer;
        let finalList = '';
        this.moreThanTen = false;
        items.map((item, i) => {
            if (i < 9) {
                return finalList = finalList + `${item.id}&`;
            } else {
                return this.moreThanTen = true;
            }
        });
        let baseURL = window.location.origin;
        let finalURL = `${baseURL}/service-list/${finalList}`;
        if (textToClipboard(finalURL)) {
            window.$('#textCopied').appendTo('body').modal('show');
        }
    }

    closeTextCopiedModal = () => {
        window.$('#textCopied').appendTo('#divButtonsFavList').modal('hide');
    }

    render() {
        return (
            <>
                <div className="container my-3">
                    {this.state.favourites.length > 0 ?
                        <div className="accordion mb-4" id="accordionFavourites">
                            <div className="d-flex w-100 justify-content-between mb-2">
                                <div className="d-flex mr-1  justify-content-center" id="divButtonsFavList">
                                    <button type="button" className=" btn btn-secondary d-flex justify-content-center" onClick={() => this.copyServiceList()}>
                                        <i className="material-icons ">file_copy</i>
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-1 btn btn-secondary d-flex justify-content-center"
                                        onClick={() => this.sendServiceList()}>
                                        <i className="material-icons">print</i>
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-1 btn btn-secondary d-flex justify-content-center"
                                        onClick={() => this.copyShareLink()}>
                                        <i className="material-icons">share</i>
                                    </button>
                                    {/* Modal */}
                                    <div className="modal fade" id="textCopied" tabIndex="-1" role="dialog" aria-labelledby="textCopied" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content border-success">
                                                <div className="card-header">
                                                    <h3 className="mb-0">Text copied!</h3>
                                                </div>
                                                <div className="modal-body">
                                                    <p className="mb-0">A share link has been copied to your clipboard.</p>
                                                    {this.moreThanTen &&
                                                        <small>We can only share up to 10 services.</small>
                                                    }
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-link" onClick={this.sendServiceList} data-dismiss="modal">View page</button>
                                                    <button type="button" className="btn btn-secondary" onClick={this.closeTextCopiedModal}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className="ml-1 btn btn-danger" onClick={() => this.clearFavouritesServices()}>Clear Services</button>
                            </div>

                            {this.state.favourites.map((item, i) => {
                                if (item.favourite) {
                                    return (
                                        <div className="card rounded" key={i}>
                                            <div className="card-header collapsed" id={item.id}>
                                                <div className="d-flex justify-content-between w-100">
                                                    <div className="d-flex align-items-center results-title cursor-pointer" data-toggle="collapse" data-target={`#TabFavourites${i}`} aria-expanded="false" aria-controls={`TabFavourites${i}`}>
                                                        <p className="mb-0 ml-4">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <div className="w-100 d-flex justify-content-end">
                                                            <button type="button" className="mr-1 btn btn-info btn-sm d-flex justify-content-center" onClick={() => this.showModal(item)}>
                                                                <p className="mb-0 text-nowrap">View Details</p>
                                                            </button>
                                                            <button type="button" className="btn btn-secondary btn-sm ml-1 d-flex justify-content-center" onClick={() => this.deleteFavourite(item)}>
                                                                <i className="material-icons" style={{ color: '#FFC900' }}>star</i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div id={`TabFavourites${i}`} className="collapse" aria-labelledby={item.id} data-parent="#accordionFavourites">
                                                <div className="card-body">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                } else if (this.state.favourites.length === 0) {
                                    return (
                                        <div className="w-100 d-flex justify-content-center mt-5">
                                            <h5 className="text-black-50">No favourite services</h5>
                                        </div>
                                    )
                                }
                                return ('')
                            })}
                            <div id="modal-favourite-div" className="modal-favourite-div">
                                <ResultModal id="modalFavouriteInfo" favs={this.state.favourites} isModalLoaded={this.state.isModalLoaded} data={this.state.res} item={this.state.item} closeModal={this.closeModal} />
                            </div>
                        </div>
                        :
                        <div className="w-100 d-flex justify-content-center my-3">
                            <h5 className="text-black-50">No favourite services</h5>
                        </div>
                    }
                </div>
            </>
        )
    }
}

export default withRouter(FavouriteServicesContent);