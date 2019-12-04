import React from 'react';
import PreviousSearchesContent from './PreviousSearchesContent';

export default class PreviousSearches extends React.Component {

    render() {
        return (
            <div className="rounded m-2" data-parent="#accordion">
                <div className="card previousSearches" id="previousSearches">
                    <div className="card-header  panel-title cursor-pointer" id="previousSearchesHeading" data-toggle="collapse" data-target="#previousSearchesCollapse" aria-expanded="false" aria-controls="previousSearchesCollapse">
                        <div className="d-flex flex-column">
                            <h5 className="mb-0">Previous searches</h5>
                            <p className="mb-0">Click to retrieve a previous search</p>
                        </div>
                    </div>

                    <div id="previousSearchesCollapse" className="collapse" aria-labelledby="personaProfilleHeading" data-parent="#searches">
                        <div className="card-body">
                            <PreviousSearchesContent />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}