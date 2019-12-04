//_________________________________________________________________________________________________________________Interacted Reducer
//SAVE TYPES
export const SAVE_AGE = 'SAVE_AGE'; //-> Saves the age
export const SAVE_POSTCODE = 'SAVE_POSTCODE'; //-> Saves the post code
export const SAVE_PROXIMITY = 'SAVE_PROXIMITY'; //-> Saves the proximity
export const SAVE_GENDER = 'SAVE_GENDER'; //-> Saves the gender
export const SAVE_DAY = 'SAVE_DAY'; //-> Saves the day

export const SAVE_TYPEOFSERVICE = 'SAVE_TYPEOFSERVICE'; //-> Saves the type of service
export const SAVE_COVERAGE = 'SAVE_COVERAGE'; //-> Saves the coverage
export const SAVE_ANSWERSQUESTIONS = 'SAVE_ANSWERSQUESTIONS'; //-> Saves the answers & questions
export const SAVE_TEXT = 'SAVE_TEXT'; //-> Saves the text

//ADD TYPES
export const ADD_NEED = 'ADD_NEED'; //-> Add an item of needs
export const ADD_CIRCUMSTANCE = 'ADD_CIRCUMSTANCE'; //-> Add an item of circumstances

//Remove All
export const REMOVE_ALL = 'REMOVE_ALL'; // -> Remove all items from Searching For

//_________________________________________________________________________________________________________________Searches Reducer
//Searches General
export const SAVE_ELEMENT = 'SAVE_ELEMENT'; // -> Saves a new previous search
export const UPDATE_SEARCH = 'UPDATE_SEARCH' // -> Update the previous search
export const CLEAR_ALL_PREVIOUS_SEARCHES = 'CLEAR_ALL_PREVIOUS_SEARCHES'; // -> Delete all previous searches
export const CLEAR_PREVIOUS_SEARCHES_BY_ID = 'CLEAR_PREVIOUS_SEARCHES_BY_ID'; // -> Delete a previous search by id
export const CLEAR_ALL_FAVOURITES = 'CLEAR_ALL_FAVOURITES'

//Favourites Searches
export const ADD_FAVOURITE = 'ADD_FAVOURITES' // -> Saves a previous favourite search
export const UPDATE_FAVOURITE = 'UPDATE_FAVOURITE' // -> Updates a previous favourite search
export const CLEAR_ALL_FAVOURITES_SEARCHES = 'CLEAR_ALL_FAVOURITES_SEARCHES';

//Favourites Services
export const ADD_FAVOURITE_SERVICE = 'ADD_FAVOURITE_SERVICE'; // Saves a favourite service
export const UPDATE_FAVOURITE_SERVICE = 'UPDATE_FAVOURITE_SERVICE'; // -> Update a favourite service
export const CLEAR_ALL_FAVOURITES_SERVICES = 'CLEAR_ALL_FAVOURITES_SERVICES';