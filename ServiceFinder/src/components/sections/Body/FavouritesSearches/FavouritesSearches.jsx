import React from 'react';
import FavouriteSearchContent from './FavouriteSearchContent';

export default class FavouritesSearches extends React.Component {

    render() {
        return (
            <div className="rounded m-2" data-parent="#searches">
                <div className="card favouritesSearches" id="FavouritesSearches">
                    <div className="card-header  panel-title cursor-pointer" id="FavouritesSearchesHeading" data-toggle="collapse" data-target="#FavouritesSearchesCollapse" aria-expanded="false" aria-controls="FavouritesSearchesCollapse">
                        <div className="d-flex flex-column">
                            <h5 className="mb-0">Favourites searches</h5>
                            <p className="mb-0">Click to retrieve a favourite search</p>
                        </div>
                    </div>

                    <div id="FavouritesSearchesCollapse" className="collapse" aria-labelledby="personaProfilleHeading" data-parent="#searches">
                        <div className="card-body">
                            <FavouriteSearchContent />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}