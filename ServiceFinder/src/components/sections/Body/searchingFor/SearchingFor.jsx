import React from 'react';

import SearchingForContent from './SearchingForContent';

export default class PreviousSearches extends React.Component {

    render() {
        return (
            <div className="rounded my-1 mx-2" data-parent="#accordion">
                <div className="card searchingFor" id="searchMethod">
                    <div className="card-header  panel-title cursor-pointer" id="searchingForHeading" data-toggle="collapse" data-target="#searchingForCollapse" aria-expanded="true" aria-controls="searchingForCollapse">
                        <div className="d-flex flex-column">
                            <h5 className="mb-0">Search</h5>
                            <p className="mb-0">Below are the items currently selected</p>
                        </div>
                    </div>

                    <div id="searchingForCollapse" className="collapse show" aria-labelledby="personaProfilleHeading" data-parent="#searches">
                        <div className="card-body">
                            <SearchingForContent />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}