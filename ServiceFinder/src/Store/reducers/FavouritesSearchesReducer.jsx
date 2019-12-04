import {UPDATE_FAVOURITE, ADD_FAVOURITE, CLEAR_ALL_FAVOURITES_SEARCHES } from "../Actions/types";

const FavouritesSearchesReducer = function (state = [], action) {
    switch (action.type) {
        case UPDATE_FAVOURITE:
            let modState = state.slice();
            modState = modState.filter(element => (element.time !== action.payload.time));
            return (state = modState);
        case ADD_FAVOURITE:
            return state = [action.payload, ...state];
        case CLEAR_ALL_FAVOURITES_SEARCHES:
            return (state = []);
        default: return state;
    }
}

export default FavouritesSearchesReducer;