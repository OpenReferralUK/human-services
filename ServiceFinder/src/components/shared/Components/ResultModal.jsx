import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader'
import { css } from '@emotion/core';
import { Link, withRouter } from 'react-router-dom';

import { getUpdateFavouriteServiceAction, getAddFavouriteServiceAction } from '../../../Store/Actions/actions';
import store from '../../../Store/store';
import initial_data from '../../../config';

class ResultModal extends React.Component {
    state = {
        ...this.getCurrentStateFromStore(),
        descriptionOpen: false
    }
    user_postcode;
    favouriteItem;

    override = css`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 50px auto;
`;

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        this.props.interacted && this.getUserPostcode();
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

    getUserPostcode = () => {
        const interactedPostCode = this.props.interacted.filter(item => item.category === 'postcode');
        const user_postcode = interactedPostCode[0] !== undefined ? interactedPostCode[0].value : undefined;
        this.user_postcode = user_postcode;
    }

    printButton = async () => {
        await this.closeModal();
        this.props.history.push(`/service/${this.props.item.id}`);
    }

    closeModal = async () => {
        window.$('#descriptionOneTab').collapse('hide');
        this.props.closeModal();
    }

    updateFavourite = async (item) => {
        item.favourite = !item.favourite;
        try {
            if (item.favourite) await store.dispatch(getAddFavouriteServiceAction(item));
            else await store.dispatch(getUpdateFavouriteServiceAction(item));
            this.forceUpdate();
        } catch (e) {
            console.log('Error(addFavouriteServices): ', e)
        }
    }

    render() {
        return (
            <div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby={`modalTitle`} aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header row ml-1">
                            {this.props.isModalLoaded && this.props.item &&
                                <>
                                    <h5 className="modal-title col" id={`modalTitle`}>{this.props.item.name}</h5>
                                    <div className="col-auto d-flex justify-content-end align-items-center">
                                        {initial_data.general.allowFavouriteServices && !this.props.id.includes('Fav') &&
                                            <i className="material-icons mx-2 my-1 cursor-pointer"
                                                onClick={() => this.updateFavourite(this.props.item)}
                                                style={{
                                                    color: (this.props.favs.filter(favItem => favItem.id === this.props.item.id)[0] &&
                                                        this.props.favs.filter(favItem => favItem.id === this.props.item.id)[0].favourite &&
                                                        '#FFC900')
                                                }}
                                            >star</i>
                                        }
                                        <Link style={{ color: '#212529' }} to={`/service/${this.props.item.id}`} onClick={this.printButton}>
                                            < i className="material-icons mx-2 my-1 cursor-pointer">print</i>
                                        </Link>
                                        <i className="material-icons mx-2 my-1 cursor-pointer text-danger" onClick={this.closeModal}>close</i>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="modal-body">
                            {this.props.isModalLoaded ?
                                <div className="row my-2">
                                    <div className="col-lg-6 mt-2 position-sticky">
                                        <div className="contact sticky-top">
                                            <h4>Contact</h4>
                                            <hr />
                                            {this.props.data.contacts.length > 0 ?
                                                <div>
                                                    <h5>Contact tel: </h5>
                                                    <ul>
                                                        {this.props.data.contacts.map((item, i) => (
                                                            item.phones.map(itemPhone => (
                                                                <li className="mb-0" key={i}>{itemPhone.number}</li>
                                                            ))

                                                        ))}
                                                    </ul>
                                                    {this.props.data.email !== '' &&
                                                        <>
                                                            <h5>Contact email:</h5>
                                                            <ul>
                                                                <li><div className="d-flex align-items-center">
                                                                    {this.props.data.email}
                                                                    <a href={`mailto:${this.props.data.email}`} style={{ textDecoration: 'none' }}>
                                                                        <button type="button" className="d-flex align-items-center btn btn-sm ml-3 btn-secondary">
                                                                            <i className="material-icons md-14 mr-2">email</i>
                                                                            Send email
                                                                                            </button>
                                                                    </a>
                                                                </div></li>
                                                            </ul>
                                                        </>
                                                    }
                                                    {this.props.data.service_at_locations.length > 0 &&
                                                        <>
                                                            {this.props.data.service_at_locations.map((item, i) =>
                                                                <div key={i}>
                                                                    {item.location.physical_addresses.length > 0 &&
                                                                        <>
                                                                            <h5>Physical Addresses:</h5>
                                                                            <ul>
                                                                                {item.location.physical_addresses.map((itemAddress, i) =>
                                                                                    <div key={i}>
                                                                                        <li className="mb-0">{itemAddress.address_1}{itemAddress.city}({itemAddress.postal_code})</li>
                                                                                    </div>)}
                                                                            </ul>
                                                                        </>
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                    <div id="feedbackButtons" className="buttons w-100 d-flex justify-content-around ">
                                                        <button type="button" className="btn btn-secondary btn-sm mx-5" onClick={() => window.$('#feedbackModal').appendTo('body').modal('show')}>Give feedback</button>
                                                        <div className="modal fade" id="feedbackModal" tabindex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true" >
                                                            <div className="modal-dialog" role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title" id="feedbackModalLabel">Give Feedback</h5>
                                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        Thank you for your feedback
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-secondary" onClick={() => window.$('#feedbackModal').appendTo('#feedbackButtons').modal('hide')} >Close</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button type="button" className="btn btn-secondary btn-sm mx-5" onClick={() => window.$('#reportErrorModal').appendTo('body').modal('show')}>Report Error</button>
                                                        <div className="modal fade" id="reportErrorModal" tabindex="-1" role="dialog" aria-labelledby="reportErrorModalLabel" aria-hidden="true" >
                                                            <div className="modal-dialog" role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title" id="reportErrorModalLabel">Report Error</h5>
                                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        Your report will be tested. <br /> Thank you
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-secondary" onClick={() => window.$('#reportErrorModal').appendTo('#feedbackButtons').modal('hide')} >Close</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                                :
                                                <p className="mb-0">No contact info</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mt-2">
                                        {this.props.data.service_at_locations.length > 0 &&
                                            <div className="map">
                                                <h4>Addresses</h4>
                                                <hr />
                                                <ul className="list-group">
                                                    {this.props.data.service_at_locations.map(item =>
                                                        item.location.physical_addresses.map((item, i) => (
                                                            <li className="list-group-item " key={i}>
                                                                <div className="row d-flex align-items-center justify-content-between">
                                                                    <p className="mb-0 col-sm-5">{item.address_1}</p>
                                                                    <div className="col-sm-auto">
                                                                        <a href={`http://www.google.com/maps/place/${item.postal_code}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                            <button type="button" className="mx-2 btn btn-sm btn-secondary text-nowrap">View on Map</button>
                                                                        </a>
                                                                        {this.user_postcode &&
                                                                            <a href={`http://www.google.com/maps/dir/${this.user_postcode}/${item.postal_code}`} target='_blank' rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                                <button type="button" className="mx-2 btn btn-sm btn-secondary text-nowrap">View Directions</button>
                                                                            </a>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>
                                        }
                                        {this.props.data.description &&
                                            <div id="description">
                                                <div id="descriptionOne" className="panel-title mt-2" data-toggle="collapse" data-target="#descriptionOneTab" aria-expanded="false" aria-controls="descriptionOneTab"
                                                    onClick={() => {
                                                        window.$('#descriptionOneTab').on('shown.bs.collapse', () => {
                                                            this.setState({ descriptionOpen: true })
                                                        });

                                                        window.$('#descriptionOneTab').on('hide.bs.collapse', () => {
                                                            this.setState({ descriptionOpen: false })
                                                        });
                                                    }}>
                                                    <h4>Description</h4>
                                                </div>
                                                <hr className="mb-0" />
                                                {!this.state.descriptionOpen &&
                                                    <div className="card-body">
                                                        {this.props.data.description.length > 150 ?
                                                            this.props.data.description.substr(0, 150) + '...'
                                                            :
                                                            this.props.data.description.substr(0, this.props.data.description.length)}
                                                    </div>
                                                }
                                                <div id="descriptionOneTab" className="collapse" aria-labelledby="descriptionOne" data-parent="#description">
                                                    {this.state.descriptionOpen &&
                                                        <div className="card-body">
                                                            {this.props.data.description}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                :
                                <BeatLoader
                                    css={this.override}
                                    sizeUnit={"px"}
                                    size={15}
                                    color={'#b3b300'}
                                    loading={this.state.loading}
                                />
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.closeModal}>Close</button>
                        </div>
                    </div >
                </div >
            </div >
        )
    }
}

export default withRouter(ResultModal);