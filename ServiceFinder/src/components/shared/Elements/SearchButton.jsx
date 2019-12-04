import React from 'react';

export default class SearchButton extends React.Component {
    showSearches = () => {
        window.$('#myTab li:last-child a').tab('show')
    }
    render() {
        return (
            <>
                <div className="search-button-div mobile-only tablet-only cursor-pointer" onClick={this.showSearches}>
                    <p className="search-button material-icons">search</p>
                </div>
            </>
        )
    }
}