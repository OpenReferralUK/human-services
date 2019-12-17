import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader'
import { css } from '@emotion/core';
import Axios from 'axios';
import { API_directions } from '../../../../settings/settings';
import store from '../../../../Store/store';
import ResultModal from '../../../shared/Components/ResultModal';
import { getAddFavouriteServiceAction, getUpdateFavouriteServiceAction } from '../../../../Store/Actions/actions';

class ResultsContent extends React.Component {

    override = css`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 150px auto auto auto;
    height: 35vh;
`;

    state = {
        ...this.getCurrentStateFromStore(),
        page: 1,
        perPage: 10,
        isModalLoaded: false,
    }

    componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        window.$('#modalInfo').modal('handleUpdate');
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
        window.$(`#modalInfo`).appendTo('body').modal({ backdrop: 'static' });
        window.$('#modalInfo').on('shown.bs.modal', () => {
            window.$(document).keyup((e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            })
            window.$(document).click((e) => {
                if (e.target.id === 'modalInfo' && window.$('#modalInfo').hasClass('show')) {
                    this.closeModal();
                }
            })
        })

        await this.setState({
            isModalLoaded: false,
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

    firstPage = async () => {
        await this.setState({
            page: 1
        })

        this.props.paginacion(this.state.page, this.state.perPage);
    }

    lastPage = async () => {
        await this.setState({
            page: this.props.results.totalPages
        });
        this.props.paginacion(this.state.page, this.state.perPage);
    }

    changePagination = async (value) => {
        await this.setState({
            page: 1,
            perPage: value.target.value
        })
        this.props.paginacion(this.state.page, this.state.perPage);
    }

    changePage = async (value) => {
        await this.setState({
            page: value
        });
        this.props.paginacion(this.state.page, this.state.perPage);
    }

    getPagination = () => {
        if (this.props.results.totalPages > 1) {
            if (this.props.results.totalPages === 2) {
                if (this.state.page === 1) {
                    return (
                        <>
                            <li className="page-item cursor-pointer active" onClick={() => this.changePage(1)}><p className="page-link mb-0">1</p></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(2)}><p className="page-link mb-0">2</p></li>
                        </>
                    )
                } else {
                    return (
                        <>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(1)}><p className="page-link mb-0">1</p></li>
                            <li className="page-item cursor-pointer active" onClick={() => this.changePage(2)}><p className="page-link mb-0">2</p></li>
                        </>
                    )
                }
            } else if (this.props.results.totalPages >= 3) {
                if ((this.props.results.number !== this.props.results.totalPages) && (this.props.results.number > 1)) {
                    return (
                        <>
                            <li className="page-item cursor-pointer"><button type="button" className="page-link" onClick={this.firstPage}>&laquo;</button></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(this.props.results.number - 1)}><p className="page-link mb-0">{this.props.results.number - 1}</p></li>
                            <li className="page-item cursor-pointer active" onClick={() => this.changePage(this.props.results.number)}><p className="page-link mb-0">{this.props.results.number}</p></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(this.props.results.number + 1)}><p className="page-link mb-0">{this.props.results.number + 1}</p></li>
                            <li className="page-item cursor-pointer"><button type="button" className="page-link" onClick={this.lastPage}>&raquo;</button></li>
                        </>
                    )
                } else if (this.props.results.number === this.props.results.totalPages) {
                    return (
                        <>
                            <li className="page-item cursor-pointer"><button type="button" className="page-link" onClick={this.firstPage}>&laquo;</button></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(this.props.results.number - 2)}><p className="page-link mb-0">{this.props.results.number - 2}</p></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(this.props.results.number - 1)}><p className="page-link mb-0">{this.props.results.number - 1}</p></li>
                            <li className="page-item cursor-pointer active" onClick={() => this.changePage(this.props.results.number)}><p className="page-link mb-0">{this.props.results.number}</p></li>
                            <li className="page-item cursor-pointer disabled"><button type="button" className="page-link">&raquo;</button></li>
                        </>
                    )
                } else if (this.props.results.number === 1) {
                    return (
                        <>
                            <li className="page-item cursor-pointer disabled"><button type="button" className="page-link">&laquo;</button></li>
                            <li className="page-item cursor-pointer active" onClick={() => this.changePage(this.props.results.number)}><p className="page-link mb-0">{this.props.results.number}</p></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(this.props.results.number + 1)}><p className="page-link mb-0">{this.props.results.number + 1}</p></li>
                            <li className="page-item cursor-pointer" onClick={() => this.changePage(this.props.results.number + 2)}><p className="page-link mb-0">{this.props.results.number + 2}</p></li>
                            <li className="page-item cursor-pointer"><button type="button" className="page-link" onClick={this.lastPage}>&raquo;</button></li>
                        </>
                    )
                }
            }
        }
    }
    closeModal = async () => {
        await window.$("#modalInfo").appendTo('#modal-div').modal('hide');
    }

    updateFavourite = async (item) => {
        this.state.favourites.map(favItem => {
            if (favItem.id === item.id) {
                item.favourite = favItem.favourite
            }
        });
        item.favourite = !item.favourite;
        await this.setState({
            item
        })
        try {
            if (item.favourite) await store.dispatch(getAddFavouriteServiceAction(item));
            else await store.dispatch(getUpdateFavouriteServiceAction(item));
            this.forceUpdate();
        } catch (e) {
            console.log('Error(addFavouriteServices): ', e)
        }
    }

    render() {
        if (this.props.isFetching) {
            return (
                <BeatLoader
                    css={this.override}
                    sizeUnit={"px"}
                    size={15}
                    color={'#b3b300'}
                    loading={this.state.loading}
                />
            )
        } else {
            return (<>
                {
                    this.props.results &&
                    <div className="container my-2" id="results">
                        <div className="mb-0 mt-4 w-100 d-flex align-items-center justify-content-between">
                            <h4 className="mb-0">Results ({this.props.results.totalElements}):</h4>
                            <button className="btn btn-danger" onClick={this.props.clearResults}>
                                Clear Results
                            </button>
                        </div>
                        <hr className="my-2" />
                        <div>
                            <div className="row d-flex align-items-center justify-content-between mb-2">
                                {/* Results per page */}
                                {this.props.results.content.length > 0 &&
                                    <div className="col-xl-auto my-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <p className='mb-0 mr-2'>Show </p>
                                            <select id="perPage" className="form-control col-6" value={this.state.perPage} onChange={this.changePagination}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                            <p className='mb-0 ml-2'>results </p>
                                        </div>
                                    </div>
                                }
                            </div>

                            {/* Results */}
                            <div className="accordion mb-4" id="accordionResults">
                                {this.props.results.content.map((item, i) => {
                                    return (
                                        <div className="card" key={i}>
                                            <div className="card-header collapsed d-flex ml-0 row w-100 justify-content-between" id={item.id}>
                                                <div className="d-flex results-title col-xl p-2 w-100 align-items-center cursor-pointer" data-toggle="collapse" data-target={`#Tab${i}`} aria-expanded="false" aria-controls={`Tab${i}`}>
                                                    <p className="mb-0 ml-4">
                                                        {item.name}
                                                    </p>
                                                </div>
                                                <div className="d-flex justify-content-end col p-2 w-100 align-items-center">
                                                    <button className="btn btn-secondary btn-sm mr-1 d-flex justify-content-center" type="button" onClick={() => this.updateFavourite(item)}>
                                                        <i className="mb-0 material-icons" style={{
                                                            color: (this.state.favourites.filter(favItem => favItem.id === item.id)[0] &&
                                                                this.state.favourites.filter(favItem => favItem.id === item.id)[0].favourite === true &&
                                                                '#FFC900')
                                                        }}>star</i>
                                                    </button>
                                                    <button className="btn btn-info btn-sm d-flex ml-1 justify-content-center" type="button" onClick={() => this.showModal(item)}>
                                                        <p className="mb-0 text-nowrap">View Details</p>
                                                    </button>
                                                </div>
                                            </div>

                                            <div id={`Tab${i}`} className="collapse" aria-labelledby={item.id} data-parent="#accordionResults">
                                                <div className="card-body">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div id="modal-div" className="modal-div">
                                    <ResultModal id="modalInfo" favs={this.state.favourites} isModalLoaded={this.state.isModalLoaded} data={this.state.res} item={this.state.item} closeModal={this.closeModal} interacted={this.props.interacted} />
                                </div>
                            </div>
                            {/* Pagination */}
                            <nav aria-label="Page navigation example" className="col-xl-auto my-2">
                                <ul className="pagination justify-content-center align-items-center mb-0">
                                    {this.getPagination()}
                                </ul>
                            </nav>
                        </div>
                    </div>
                }
            </>
            )
        }
    }
}

export default ResultsContent;