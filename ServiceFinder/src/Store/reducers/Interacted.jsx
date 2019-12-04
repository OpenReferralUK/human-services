import { SAVE_AGE, SAVE_POSTCODE, SAVE_PROXIMITY, SAVE_GENDER, SAVE_DAY, ADD_NEED, ADD_CIRCUMSTANCE, SAVE_TYPEOFSERVICE, SAVE_ANSWERSQUESTIONS, REMOVE_ALL, SAVE_TEXT } from "../Actions/types";

const init_data = {
    age: {},
    postcode: {},
    availability: { data: [] },
    needs: { data: [] },
    circumstances: { data: [] },
}

const Interacted = function (state = init_data, action) {
    let modState = state;
    switch (action.type) {
        case SAVE_AGE:
            modState.age = action.payload;
            return state = modState;

        case SAVE_POSTCODE:
            modState.postcode = action.payload;
            return state = modState;

        case SAVE_PROXIMITY:
            modState.proximity = action.payload;
            return state = modState;

        case SAVE_GENDER:
            modState.gender = action.payload;
            return state = modState;

        case SAVE_DAY:
            modState.availability = action.payload;
            return state = modState;

        case ADD_NEED:
            modState.needs = action.payload
            return state = modState;

        case ADD_CIRCUMSTANCE:
            modState.circumstances = action.payload
            return state = modState;

        case SAVE_TYPEOFSERVICE:
            modState = state;
            modState.serviceTypes = action.payload;
            return state = modState;

        case SAVE_TEXT:
            modState = state;
            modState.text = action.payload;
            return state = modState;

        // case SAVE_COVERAGE:
        //     modState = state;
        //     modState.coverage = action.payload;
        //     return state = modState;

        case SAVE_ANSWERSQUESTIONS:
            modState = state;
            modState.aq = action.payload;
            return state = modState

        case REMOVE_ALL:
            state = {
                age: { value: '', interacted: false },
                postcode: { value: '', interacted: false },
                coverage: { value: '', interacted: false },
                proximity: { value: '', interacted: false },
                gender: { value: '', interacted: false },
                availability: { data: [] },
                needs: { data: [] },
                circumstances: { data: [] },
                serviceTypes: { value: '', interacted: false },
            }
            return state;
        default: return state;
    }
}

export default Interacted;