import React from 'react';
import Select from 'react-select';
import PreviousSearchesContent from './PreviousSearchesContent';
import FavouritesServicesContent from '../FavouritesServices/FavouriteServicesContent';
import FavouritesSearchesContent from '../FavouritesSearches/FavouriteSearchContent';
import SearchButton from '../../../shared/Elements/SearchButton';

export default class PreviousSearchesMobileComponent extends React.Component {

    options = [
        { value: 'collapse_pSearches', label: 'Previous Searches' },
        { value: 'collapse_fSearches', label: 'Favourite Searches' },
        { value: 'collapse_fServices', label: 'Favourite Services' },
    ]

    handleSelect = (item) => {
        window.$(`#${item.value}`).collapse('show');
        window.$(`#${item.value}`).on('shown.bs.collapse', function () {
            window.location.href = `#menuListHF`
        });
    }

    render() {
        return (
            <>
                <SearchButton />
                <div className="mx-3 my-2" id="menuListHF">
                    <label htmlFor="selectH&F">Select an option:</label>
                    <Select
                        id="selectH&F"
                        isSearchable={false}
                        isClearable={false}
                        defaultValue={0}
                        options={this.options}
                        onChange={this.handleSelect}
                    />
                </div>
                <div id="collapsables">
                    <div id="collapse_pSearches" className="collapse" aria-labelledby="pSearches" data-parent="#previousSearches">
                        <div className="card-body">
                            <PreviousSearchesContent />
                        </div>
                    </div>

                    <div id="collapse_fSearches" className="collapse" aria-labelledby="fSearches" data-parent="#previousSearches">
                        <div className="card-body">
                            <FavouritesSearchesContent />
                        </div>
                    </div>

                    <div id="collapse_fServices" className="collapse" aria-labelledby="fServices" data-parent="#previousSearches">
                        <div className="card-body">
                            <FavouritesServicesContent />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}