import jwt from 'jsonwebtoken';

import initial_data from '../../../../config';
import {
    JWT
} from '../../../../settings/settings';

export const getDateArray = (data) => {
    const day = initial_data.persona_profile.days.day.filter(dayItem => dayItem.value === data.day)[0];
    const time = initial_data.persona_profile.days.time.filter(timeItem => timeItem.value === data.time)[0];

    const newObj = {
        type: 'availability',
        value: ((`${day.id}${time.value}`)),
        day,
        time
    }

    let arrTemp = data.data.slice();
    arrTemp.push(newObj);

    let arrTempToSort = removeDuplicates(arrTemp, 'value');
    arrTempToSort.sort((a, b) => (+a.value > +b.value) ? 1 : -1);

    return arrTempToSort;
}

const removeDuplicates = (originalArray, prop) => {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

export const getDataFromLocalStorage = (data) => {
    try {
        const sData = localStorage.getItem(data);
        const finalData = jwt.verify(sData, JWT.key);
        return finalData;
    } catch (e) {
        return {
            error: e
        }
    }
}