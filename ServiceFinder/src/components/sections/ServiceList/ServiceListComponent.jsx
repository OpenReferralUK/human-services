import React from 'react';
import { withRouter } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader'
import { css } from '@emotion/core';
import { API_directions } from '../../../settings/settings';
import Axios from 'axios';
import ResultModal from '../../shared/Components/ResultModal';
import store from '../../../Store/store';

class ServiceListComponent extends React.Component {

    override = css`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 150px auto auto auto;
    height: 35vh;
`;

    state = {
        isLoaded: false,
        isModalLoaded: false
    }

    async componentDidMount() {
        let tokenList = this.props.match.params.list;
        let arrList = [];
        let idList = tokenList.split('&');
        const request = idList.map(async (item, i) => {
            if (item !== '') {
                return await Axios.get(`${API_directions.get.serviceId}${item}`)
                    .then(async res => {
                        arrList.push(res.data)
                    })
                    .catch(e => console.log(e));
            }
        });

        Promise.all(request).then(async () => {
            await this.setState({
                items: arrList,
                isLoaded: true
            });
        });
    }

    showModal = async (item) => {
        await window.$("#detailsFavItem").appendTo('body').modal('show');
        await this.setState({ item });
        await this.setState({ isModalLoaded: true });
    }

    closeModal = async () => {
        await window.$("#detailsFavItem").appendTo('#favItemsGeneral').modal('hide');
        await this.setState({
            isModalLoaded: false
        });
    }


    back = () => {
        this.props.history.push('/');
    }

    render() {
        return (
            <>
                <div className="container my-2 mt-3">
                    {this.state.isLoaded ?
                        <>
                            <div className="d-flex justify-content-between w-100">
                                <div className="d-flex justify-content-start align-items-center w-100">
                                    {store.getState().tempSearches &&
                                        <div className="d-flex align-items-center cursor-pointer" onClick={this.back}>
                                            <i className="material-icons md-24 mr-3 no-print">arrow_back</i>
                                        </div>
                                    }
                                    <h3 className="mb-0">Service List</h3>
                                </div>
                                <button className="btn btn-secondary btn-sm no-print" onClick={() => window.print()}>
                                    <i className="material-icons mb-0">print</i>
                                </button>
                            </div>
                            <hr />
                            <div id="favItemsGeneral">
                                <ResultModal id="detailsFavItem" data={this.state.item} isModalLoaded={this.state.isModalLoaded} item={this.state.item} closeModal={this.closeModal} />
                                <div className="accordion mb-4" id="accordionFavourites">
                                    {this.state.items &&
                                        this.state.items.map((item, i) => (
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
                                                                <button type="button" className=" no-print mr-1 btn btn-info btn-sm d-flex justify-content-center" onClick={() => this.showModal(item)}>
                                                                    <p className="mb-0 text-nowrap">View Details</p>
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
                                        ))
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <h2>Service List</h2>
                            <hr />
                            <BeatLoader
                                css={this.override}
                                sizeUnit={"px"}
                                size={15}
                                color={'#b3b300'}
                                loading={this.state.loading}
                            />
                        </>
                    }
                </div>
            </>
        )
    }
}

export default withRouter(ServiceListComponent);