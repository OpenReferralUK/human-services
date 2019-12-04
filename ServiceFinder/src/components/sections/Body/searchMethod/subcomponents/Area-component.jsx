import React from 'react';

import SearchMethodSection from '../SearchMethodSection/SearchMethodSection';
import PostcodeComponent from '../../../../shared/Components/Postcode-component';
import ProximityComponent from '../../../../shared/Components/Proximity-component';

export default class AreaComponent extends React.Component {

    divClick = (value) => {
        if (value) window.$("#area-search-method").collapse('show');
        else window.$("#area-search-method").collapse('show');
    }

    render() {
        return (
            <SearchMethodSection id="areaSection" title="Choose an Area" description="Search by location/distance." >
                <PostcodeComponent />
                <ProximityComponent />
            </SearchMethodSection >
        )
    }
}