import { UPDATE_FAVOURITE_SERVICE, ADD_FAVOURITE_SERVICE, CLEAR_ALL_FAVOURITES_SERVICES } from "../Actions/types";

const FavouritesServicesReducer = function (state = [], action) {
    let modState;
    switch (action.type) {
        case UPDATE_FAVOURITE_SERVICE:
            modState = state.slice();
            modState = modState.filter(element => (element.id !== action.payload.id));
            return (state = modState);
        case ADD_FAVOURITE_SERVICE:
            modState = state.slice();
            modState.push(action.payload);
            modState.sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });
            return state = modState;
        case CLEAR_ALL_FAVOURITES_SERVICES:
            return (state = []);
        default: return state;
    }
}

export default FavouritesServicesReducer;