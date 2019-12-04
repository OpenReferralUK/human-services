const tempSearches = function (state = false, action) {
    switch (action.type) {
        case 'SET_HOME':
            return (state = true);
        default: return state;
    }
}

export default tempSearches;