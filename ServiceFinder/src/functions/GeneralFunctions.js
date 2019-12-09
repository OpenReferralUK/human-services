import React from 'react';
import {
    Query_direction
} from '../settings/settings';
import jwt from 'jsonwebtoken';

import {
    JWT
} from '../settings/settings';
import {
    getDataFromAPI
} from "./APIFunctions";
import store from "../Store/store";
import Axios from 'axios';
import {
    getAgeAction,
    getPostcodeAction,
    getProximityAction,
    getGenderAction,
    getNeedsAction,
    getCircumstancesAction,
    getAvailabilityAction
} from '../Store/Actions/actions';

//________________________________________________________________Functions
export const clearAllSelectedItems = async () => {
    try {
        await store.dispatch(getAgeAction(""));
        await store.dispatch(getPostcodeAction(""));
        await store.dispatch(getProximityAction({
            value: '',
            label: ''
        }));
        await store.dispatch(getGenderAction({
            value: '',
            label: ''
        }));
        await store.dispatch(getNeedsAction([]));
        await store.dispatch(getCircumstancesAction([]));
        await store.dispatch(getAvailabilityAction([]));
        return true;
    } catch (e) {
        console.log(e);
    }
}

export const clearData = async () => {
    try {
        await store.dispatch({
            type: 'CLEAR_DATA'
        });
    } catch (error) {
        console.log('Error(handleTagInteractedChange-SearchingForFunctions):', error);
    }
}

export const getData = async (data, type) => {
    const needToken = await localStorage.getItem(data);
    if (needToken) {
        return await mapData(needToken, type);
    } else {
        await getDataFromAPI();
        await mapData();
    }
}

const mapData = async (token, type) => {
    try {
        const data = await jwt.verify(token, JWT.key);
        let datalvl1 = []
        let datalvl2 = []
        switch (type) {
            case 0:
                data.content.map(async item => {
                    if (item.parent === null) {
                        await datalvl1.push(item);
                    } else {
                        await datalvl2.push(item);
                    }
                })
                return ({
                    datalvl1,
                    datalvl2
                })

            default:
                data.content.map(async item => {
                    if (item.parent === null) {
                        await datalvl1.push({
                            value: item.id,
                            label: item.name
                        });
                    } else {
                        await datalvl2.push({
                            value: item.id,
                            label: item.name
                        });
                    }
                })
                return ({
                    datalvl1,
                    datalvl2
                })
        }
    } catch (e) {
        alert('Error: ' + JSON.stringify(e));
    }
}

export const getResults = async (query) => {
    return await Axios.get(query)
        .then(res => res.data)
        .catch(e => console.log('Error:', e));
}

export const getQuery = (interacted, page, perPage) => {
    let objGeneral = getElements(interacted);

    objGeneral[7] = page;
    objGeneral[8] = perPage;
    if (objGeneral[12]) objGeneral[14] = 'esdServiceTypes'
    return Query_direction(objGeneral[0], objGeneral[1], objGeneral[2], objGeneral[3], objGeneral[4], objGeneral[5], objGeneral[6], objGeneral[7], objGeneral[8], objGeneral[9], objGeneral[10], objGeneral[11], objGeneral[12], objGeneral[13], objGeneral[14]);
}

export const getInteractedElements = async (interacted, page, perPage) => {

    const query = await getQuery(interacted, page, perPage);

    const date = new Date();
    const hour = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
    const dateTime = `${date.getDay() < 10 ? `0${date.getDay()}` : date.getDay()}/${(date.getMonth() + 1) < 10 ? `0${date.getMonth()}` : date.getMonth()}/${date.getFullYear()}`;

    return {
        favourite: false,
        time: date.getTime(),
        date: `${hour} - ${dateTime}`,
        query: encodeURI(query),
        data: await getDataFromInteracted(interacted)
    }
}

const getElements = (interacted) => {
    let objGeneral = [];
    for (var item in interacted) {
        let data = [];
        let day = [];
        let sTime = [];
        let eTime = [];
        switch (item) {
            case 'text':
                objGeneral[13] = interacted[item].value;
                break;
            case 'circumstances':
                interacted[item].data.map(item => {
                    return data.push(item.value);
                })
                objGeneral[0] = data;
                break;
            case 'availability':
                interacted[item].data.map(item => {
                    return day.push(item.day.value);
                })
                objGeneral[2] = day;

                interacted[item].data.map(item => {
                    switch (item.time.value) {
                        case '0':
                            sTime.push("06:00");
                            eTime.push("14:00");
                            return true;
                        case '1':
                            sTime.push("12:00");
                            eTime.push("19:00");
                            return true;
                        case '2':
                            sTime.push("18:00");
                            eTime.push("23:59");
                            return true;
                        case '3':
                            sTime.push("00:00");
                            eTime.push("23:59");
                            return true;
                        default: return false;
                    }
                })
                objGeneral[5] = eTime;
                objGeneral[11] = sTime;
                break;
            case 'age':
                if (typeof interacted[item].value === 'string') {
                    objGeneral[3] = interacted[item].value
                    objGeneral[4] = interacted[item].value
                } else {
                    if (+interacted[item].value[0] === 0) objGeneral[4] = "0"
                    else objGeneral[4] = interacted[item].value[0]
                    objGeneral[3] = interacted[item].value[1]
                }
                break;
            case 'needs':
                interacted[item].data.map(item => {
                    return data.push(item.value);
                })
                objGeneral[6] = data;
                break;
            case 'postcode':
                objGeneral[9] = interacted[item].value;
                break;
            case 'proximity':
                objGeneral[10] = interacted[item].value;
                break;
            case 'serviceTypes':
                objGeneral[12] = interacted[item].value;
                break;
            default:
                return objGeneral;
        }
    }
    return objGeneral;
}

const getDataFromInteracted = async function (interacted) {
    let objGeneral = [];
    for (var item in interacted) {
        if (interacted[item].interacted) {
            switch (interacted[item].category) {
                case 'age':
                    if (typeof interacted[item].label === 'string') {
                        objGeneral.push({
                            category: item,
                            value: interacted[item].value,
                            label: interacted[item].label,
                            interacted: true
                        })
                    } else {
                        objGeneral.push({
                            category: item,
                            value: [interacted[item].value[0], interacted[item].value[1]],
                            label: interacted[item].value[0] + ', ' + interacted[item].value[1],
                            interacted: true
                        })
                    }
                    break;
                case 'postcode':
                    objGeneral.push({
                        category: item,
                        value: interacted[item].value,
                        label: interacted[item].value,
                        interacted: true
                    })
                    break;
                case 'coverage':
                case 'proximity':
                case 'gender':
                case 'servicetypes':
                case 'text':
                    objGeneral.push({
                        category: item,
                        value: interacted[item].value,
                        label: interacted[item].label,
                        interacted: true
                    })
                    break;
                case 'needs':
                case 'circumstances':
                    let dataList = [];
                    let dataItems = [];
                    interacted[item].data.map((item, i) => {
                        dataList.push(<li key={i} > {item.label} </li>);
                        return dataItems.push(item);
                    })
                    objGeneral.push({ category: item, value: item, label: (<ul> {dataList} </ul>), data: dataItems })
                    break;
                case 'availability':
                    let availabilityList = [];
                    let availabilityItems = [];
                    interacted[item].data.map((item, i) => {
                        availabilityList.push(<li key={i} > {item.day.label} at {item.time.label} </li>)
                        return availabilityItems.push(item);
                    })
                    objGeneral.push({ category: item, value: item, label: (<ul> {availabilityList} </ul>), data: availabilityItems })
                    break;
                default: return false;
            }
        }

    }
    if (Object.keys(objGeneral).length === 0) {
        objGeneral = [{
            category: "All Services"
        }];
    }
    return objGeneral;
}

export const sortList = (list) => {
    let newList = [];
    list.map(item => {
        if (!isNaN(parseInt(item.name))) {
            newList.push(item);
        }
    });
    if (newList.length > 0) {
        return newList.sort((a, b) => parseInt(a.name) < parseInt(b.name) ? -1 : 1);
    } else {
        return list.sort((a, b) => a.name < b.name ? -1 : 1);
    }
}