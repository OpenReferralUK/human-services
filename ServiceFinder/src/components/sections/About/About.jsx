import React from 'react';
import { withRouter } from 'react-router-dom';
import store from '../../../Store/store';

class AboutComponent extends React.Component {

    back = () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <>
                <div className="container my-2 mt-3">
                    <div className="d-flex justify-content-start align-items-center w-100">
                        {store.getState().tempSearches &&
                            <div className="d-flex align-items-center cursor-pointer" onClick={this.back}>
                                <i className="material-icons md-24 mr-3">arrow_back</i>
                            </div>
                        }
                        <h3 className="mb-0">About</h3>
                    </div>
                    <hr />
                    <div className="p-2">
                        <p className="h6">
                            Service Finder is targeted at any public or third sector frontline worker looking to find services that might support the needs and circumstances of a citizen.It accesses open data collected to meet the data standard of the <a href="https://openreferral.org" target="_blank" rel="noopener noreferrer">OpenReferral community.</a>
                        </p>
                        <p className="h6">
                            Developed by <a href="https://www.vidavia.com/" target="_blank" rel="noopener noreferrer">VidaVia</a> and made available under the <a href="http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">Open Government Licence</a> subject to acknowledging the source as <a href="https://github.com/esd-org-uk/human-services" target="_blank" rel="noopener noreferrer">OpenCommunity</a> in co-operation with the <a href="https://www.local.gov.uk/" target="_blank" rel="noopener noreferrer">Local Government Association</a>.
                        </p>
                    </div>
                    <hr />
                    <div id="licences" className="p-2">
                        <small>The Service Finder logo was designed by <a href="https://www.vidavia.com/" target="_blank" rel="noopener noreferrer">VidaVia</a>. The header background images have been adapted from images from <a href="http://www.freepik.com" target="_blank" rel="noopener noreferrer">Freepik</a></small>
                    </div>
                </div>
            </>
        )
    }

}

export default withRouter(AboutComponent);