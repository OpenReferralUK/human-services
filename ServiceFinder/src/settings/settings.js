import initial_data from "../config";

export const JWT = {
    key: 'secret_key',
    expirationTime: initial_data.general.dataExpirationTime
}
var data = localStorage.getItem('config');
var config;
if (data !== null) {
    config = JSON.parse(data).config;
}

let API_URL_BASE;
let API_URL_BASE_BY_ID;

if (config.OPERATIONAL_MODE === undefined || config.API_URL_BASE === undefined || config.API_URL_BASE_BY_ID === undefined) {
    config.OPERATIONAL_MODE = '';
} else if (config.OPERATIONAL_MODE === 'FETCH_SERVICE_TYPE_SEPARATELY') {
    API_URL_BASE_BY_ID = config.API_URL_BASE_BY_ID;
}
API_URL_BASE = config.OPERATIONAL_MODE !== 'FETCH_SERVICE_TYPE_SEPARATELY' ? config.API_URL_BASE_DEFAULT : config.API_URL_BASE;
export const API_directions = {
    get: {
        needs: API_URL_BASE + "/taxonomies/?per_page=500&vocabulary=esdNeeds",
        circumstances: API_URL_BASE + "/taxonomies/?per_page=500&vocabulary=esdCircumstances",
        serviceTypes: API_URL_BASE + "/taxonomies/?per_page=500&vocabulary=esdServiceTypes",
        gender: API_URL_BASE + "/taxonomies/?vocabulary=esdCircumstances&per_page=500&parent_id=circumstance:191 ",
        serviceId: config.OPERATIONAL_MODE !== 'FETCH_SERVICE_TYPE_SEPARATELY' ? API_URL_BASE + '/services/' : API_URL_BASE_BY_ID + '/services/',
    }
}

export const Query_direction = async (circumstances = '', coverage = '', day = '', maximum_age = '', minimum_age = '', endTime = '', need = '', page = '', per_page = '', postcode = '', proximity = '', startTime = '', taxonomy_id = '', text = '', vocabulary = '') => {
    let baseURL = config.OPERATIONAL_MODE !== 'FETCH_SERVICE_TYPE_SEPARATELY' ? API_URL_BASE + '/services/?' : API_URL_BASE + '/?';
    let urlFinal = baseURL;
    circumstances !== '' && await circumstances.map(cir => {
        return urlFinal += cir ? `circumstance=${cir}&` : '';
    });

    urlFinal += coverage !== '' ? `coverage=${coverage}&` : '';

    day !== '' && await day.map(day => {
        return urlFinal += day ? `day=${day}&` : '';
    });

    endTime !== '' && await endTime.map(endTime => {
        return urlFinal += endTime ? `endTime=${endTime}&` : ''
    });

    urlFinal += maximum_age !== '' ? `maximum_age=${maximum_age}&` : '';

    urlFinal += minimum_age !== '' ? `minimum_age=${minimum_age}&` : '';

    need !== '' && await need.map(need => {
        return urlFinal += need ? `need=${need}&` : '';
    });

    urlFinal += page !== '' ? `page=${page}&` : '';

    urlFinal += per_page !== '' ? `per_page=${per_page}&` : '';

    urlFinal += postcode !== '' ? `postcode=${postcode}&` : '';

    urlFinal += proximity !== '' ? `proximity=${(+proximity * 1609)}&` : '';

    startTime !== '' && startTime.map(startTime => {
        return urlFinal += startTime ? `startTime=${startTime}&` : '';
    });

    urlFinal += taxonomy_id !== '' ? `taxonomy_id=${taxonomy_id}&` : '';

    urlFinal += text !== '' ? `text=${text}&` : '';

    urlFinal += vocabulary !== '' ? `vocabulary=${vocabulary}&` : '';
    return encodeURI(urlFinal);
}