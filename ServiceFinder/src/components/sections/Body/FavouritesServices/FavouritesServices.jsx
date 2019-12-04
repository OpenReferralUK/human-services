import React from 'react';
import FavouritesServicesContent from './FavouriteServicesContent';

export default class FavouritesServices extends React.Component {

    render() {
        return (
            <div className="rounded m-2" data-parent="#services">
                <div className="card favouritesServices" id="FavouritesServices">
                    <div className="card-header  panel-title cursor-pointer" id="FavouritesSearchesHeading" data-toggle="collapse" data-target="#FavouritesServicesCollapse" aria-expanded="false" aria-controls="FavouritesServicesCollapse">
                        <div className="d-flex flex-column">
                            <h5 className="mb-0">Favourites services</h5>
                            <p className="mb-0">Click to retrieve a favourite service</p>
                        </div>
                    </div>

                    <div id="FavouritesServicesCollapse" className="collapse" aria-labelledby="FavouritesSearchesHeading" data-parent="#searches">
                        <div className="card-body">
                            <FavouritesServicesContent />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}