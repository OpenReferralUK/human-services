import { UPDATE_SEARCH, CLEAR_ALL_PREVIOUS_SEARCHES, CLEAR_PREVIOUS_SEARCHES_BY_ID, SAVE_ELEMENT, CLEAR_ALL_FAVOURITES } from "../Actions/types";

const SearchReducer = function (state = [], action) {
    switch (action.type) {
        case SAVE_ELEMENT:
            return state = [action.payload, ...state];
        case UPDATE_SEARCH:
            state.forEach((element, i) => {
                if (element.time === action.payload.time) {
                    state[i] = action.payload
                }
            });
            return (state)
        case CLEAR_ALL_FAVOURITES:
            state.forEach((element, i) => {
                if (element.favourite) {
                    element.favourite = false;
                }
            });
            return (state)
        case CLEAR_ALL_PREVIOUS_SEARCHES:
            return (state = []);
        case CLEAR_PREVIOUS_SEARCHES_BY_ID:
            const finalState = state.filter(item => item.time !== action.payload);
            return state = finalState;
        default: return state;
    }
}

export default SearchReducer;