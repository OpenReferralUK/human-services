import React, { Component } from 'react';
import SmallPersonaProfile from './personaProfile/SmallPersonaProfile';
import SmallSearchMethod from './searchMethod/SmallSearchMethod';
import SearchingForContent from './searchingFor/SearchingForContent';
import PreviousSearchesMobileComponent from './previousSearches/PreviousSearchesMobile';

export default class SmallBody extends Component {
    render() {
        return (
            <div className="position-sticky">
                {this.props.width < 768 ?
                    <ul className="bg-light align-items-center sticky-top d-flex nav nav-pills nav-justified justify-content-center" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link rounded-0 p-1 m-0 d-flex justify-content-center align-items-center flex-column" id="personaProfileTab" data-toggle="tab" href="#personaProfile" role="tab" aria-controls="personaProfile" aria-selected="false">
                                <i className="material-icons" style={{ fontSize: '1.5em', width: '24px', height: '24px' }}>persona</i>
                                <small className="mb-0">Persona <br />Profile</small>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link rounded-0 p-1 m-0 d-flex justify-content-center  align-items-center flex-column" id="searchMethodTab" data-toggle="tab" href="#searchMethod" role="tab" aria-controls="searchMethod" aria-selected="false">
                                <i className="material-icons" style={{ fontSize: '1.5em', width: '24px', height: '24px' }}>find_replace</i>
                                <small className="mb-0">Search <br />Method</small>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link rounded-0 p-1 m-0 d-flex justify-content-center  align-items-center flex-column" id="previousSearchesTab" data-toggle="tab" href="#previousSearches" role="tab" aria-controls="previousSearches" aria-selected="false">
                                <i className="material-icons" style={{ fontSize: '1.5em', width: '24px', height: '24px' }}>history</i>
                                <small className="mb-0">History & <br />Favourites</small>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link rounded-0 p-1 m-0 d-flex justify-content-center  align-items-center flex-column" id="searchingForTab" data-toggle="tab" href="#searchingFor" role="tab" aria-controls="searchingFor" aria-selected="false">
                                <i className="material-icons" style={{ fontSize: '1.5em', width: '24px', height: '24px' }}>search</i>
                                <small className="mb-0">Searching <br />For</small>
                            </a>
                        </li>
                    </ul>
                    :
                    <ul className="bg-light sticky-top align-items-center nav nav-pills nav-justified d-flex justify-content-center" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link rounded-0 text-nowrap" id="personaProfileTab" data-toggle="tab" href="#personaProfile" role="tab" aria-controls="personaProfile" aria-selected="false">Persona Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link rounded-0 text-nowrap" id="searchMethodTab" data-toggle="tab" href="#searchMethod" role="tab" aria-controls="searchMethod" aria-selected="false">Search Method</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link rounded-0 text-nowrap" id="previousSearchesTab" data-toggle="tab" href="#previousSearches" role="tab" aria-controls="previousSearches" aria-selected="false">History & Favourites</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link rounded-0 text-nowrap" id="searchingForTab" data-toggle="tab" href="#searchingFor" role="tab" aria-controls="searchingFor" aria-selected="false">Searching For</a>
                        </li>
                    </ul>
                }
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="homeWords">
                        <p className="h6 m-5 text-justify">
                            Service Finder is targeted at any public or third sector frontline worker looking to find services that might support the needs and circumstances of a citizen.It accesses open data collected to meet the data standard of the <a href="https://openreferral.org" target="_blank" rel="noopener noreferrer">OpenReferral community.</a>
                        </p>
                        <p className="h6 m-5 text-justify">
                            Developed by <a href="https://www.vidavia.com/" target="_blank" rel="noopener noreferrer">VidaVia</a> and made available under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">Open Government Licence</a> subject to acknowledging the source as <a href="https://github.com/esd-org-uk/human-services" target="_blank" rel="noopener noreferrer">OpenCommunity</a> in co-operation with the <a href="https://www.local.gov.uk/" target="_blank" rel="noopener noreferrer">Local Government Association</a>.
                        </p>
                    </div>
                    <div className="tab-pane fade" id="personaProfile" role="tabpanel" aria-labelledby="personaProfileTab">
                        <SmallPersonaProfile />
                    </div>
                    <div className="tab-pane fade" id="searchMethod" role="tabpanel" aria-labelledby="searchMethodTab">
                        <SmallSearchMethod />
                    </div>
                    <div className="tab-pane fade" id="previousSearches" role="tabpanel" aria-labelledby="previousSearchesTab">
                        <PreviousSearchesMobileComponent />
                    </div>
                    <div className="tab-pane fade" id="searchingFor" role="tabpanel" aria-labelledby="searchingForTab">
                        <div className="container">
                            <SearchingForContent />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}