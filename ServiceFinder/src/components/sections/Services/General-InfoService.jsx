import React from 'react';
import { withRouter } from 'react-router-dom'
import Axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader'
import { css } from '@emotion/core';

import { API_directions } from '../../../settings/settings';
import DescriptionInfoServiceComponent from './Description-infoService';
import MapInfoServiceComponent from './Maps-infoService';
import store from '../../../Store/store';
import ContactInfoService from './Contact-infoService';

class InfoService extends React.Component {

    state = {
        isLoaded: false,
        error: {
            isError: false
        }
    }

    override = css`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 150px auto auto auto;
    height: 35vh;
`;

    async componentDidMount() {
        const params = this.props.match.params;
        await Axios.get(`${API_directions.get.serviceId}${params.id}`)
            .then(res => {
                this.setState({
                    item: res.data,
                    isLoaded: true
                })
            });
    }

    getError = (e) => {
        this.setState({
            error: {
                isError: true,
                e
            }
        });
        console.log(this.state.error.e)
    }

    back = () => {
        this.props.history.push('/');
    }

    render() {
        let date = new Date();
        return (
            <>
                <div className="container my-2 mt-3">
                    {this.state.isLoaded ?
                        this.state.error.isError ?
                            <>
                                <div className="d-flex justify-content-between">
                                    <h2 className="mb-0">Error!</h2>
                                </div>
                                <hr />
                                <div>
                                    <p className="mb-0">We can't find the service</p>
                                </div>
                            </>
                            :
                            <>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div className="d-flex justify-content-start align-items-center w-100">
                                        {store.getState().tempSearches &&
                                            <div className="d-flex align-items-center cursor-pointer" onClick={this.back}>
                                                <i className="material-icons md-24 mr-3 no-print">arrow_back</i>
                                            </div>
                                        }
                                        <h3 className="mb-0">{this.state.item.name}</h3>
                                    </div>
                                    <p className="mb-0 text-muted">{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</p>
                                </div>
                                <hr className="mt-1" />
                                <div>
                                    <ContactInfoService data={this.state.item} />
                                    <DescriptionInfoServiceComponent description={this.state.item.description} />
                                    <MapInfoServiceComponent item={this.state.item} />
                                </div>
                            </>
                        :
                        <>
                            <h2>Service Info</h2>
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

export default withRouter(InfoService);