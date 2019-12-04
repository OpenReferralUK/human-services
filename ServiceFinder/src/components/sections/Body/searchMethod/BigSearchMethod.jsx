import React from 'react';

import SearchMethodContent from './SearchMethodContent';

export default class BigSearchMethod extends React.Component {

    render() {
        return (
            <form className="rounded m-2" data-parent="#accordion">
                <div className="card searchMethod" id="searchMethod">
                    <div className="card-header panel-title cursor-pointer" id="searchMethodHeading" data-toggle="collapse" data-target="#searchMethodCollapse" aria-expanded="false" aria-controls="searchMethodCollapse">
                        <div className="d-flex flex-column">
                            <h5 className="mb-0">Choose Search Method</h5>
                            <p className="mb-0">Choose how you would like to search.</p>
                        </div>
                    </div>

                    <div id="searchMethodCollapse" className="collapse" aria-labelledby="personaProfilleHeading" data-parent="#mainAccordion">
                        <div className="card-body">
                            <SearchMethodContent />
                        </div>
                    </div>
                </div>
            </form >
        )
    }
}