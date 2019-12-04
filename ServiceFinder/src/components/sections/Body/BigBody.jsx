import React, { Component } from 'react';
import BigPersonaProfile from './personaProfile/BigPersonaProfile';
import BigSearchMethod from './searchMethod/BigSearchMethod';
import PreviousSearches from './previousSearches/PreviousSearches';
import SearchingFor from './searchingFor/SearchingFor';
import FavouritesSearches from './FavouritesSearches/FavouritesSearches';
import FavouritesServices from './FavouritesServices/FavouritesServices';
import initial_data from '../../../config';

export default class BigBody extends Component {

    render() {
        return (
            <div className="d-flex">
                <div className="container">
                    <div id="mainAccordion" className="accordion">
                        <BigPersonaProfile />
                        <BigSearchMethod />
                    </div>
                </div>
                <div className="container mb-3">
                    <div id="searches">
                        <PreviousSearches />
                        {initial_data.general.allowFavouritesSearches && <FavouritesSearches />}
                        {initial_data.general.allowFavouriteServices && <FavouritesServices />}
                    </div>
                    <div id="searching" className="accordion sticky position-sticky">
                        <SearchingFor />
                    </div>
                </div>
            </div >
        )
    }
}