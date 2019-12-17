import jwt from 'jsonwebtoken';
import store from '../../../../Store/store';
import initial_data from '../../../../config';
import {
    JWT
} from '../../../../settings/settings';

export const getNeedsObject = async (id, actualData, data) => {
    let obj;
    if (data) {
        obj = await data.filter(item => item.id === id)[0];
    }

    const objFinal = {
        value: obj.id,
        label: obj.name,
        original: obj
    }

    actualData.push(objFinal);

    return removeDuplicates(actualData, 'value');
}

export const getCircumstancesData = (data) => {
    const dataLevel1 = data.filter(item => item.parent === null);
    const childs = data.filter(item => item.parent !== null);
    const dataLevel2 = childs.filter(item => item.parent.parent === null);
    const dataLevel3 = childs.filter(item => item.parent.parent !== null);
    return [dataLevel1, dataLevel2, dataLevel3];
}

export const getCircumstancesObject = (id, actualData, data) => {
    let obj;
    if (data) {
        obj = data.filter(item => item.id === id)[0];
    }

    const objFinal = {
        value: obj.id,
        label: obj.name,
        original: obj
    }

    actualData.push(objFinal);
    return removeDuplicates(actualData, 'value');
}

export const removeDuplicates = async (originalArray, prop) => {
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

export const handleChangePersona = async (e) => {
    try {
        const action = {
            type: 'SET_PERSONA',
            payload: {
                type: e,
                interacted: true,
            }
        }
        await store.dispatch(action);
        return action;
    } catch (error) {
        console.log('Error(handleChangePersona-SearchMethodFunction: ', error);
        return false;
    }
}

export const saveAQTags = async (data) => {
    if (data === null) data = [];
    try {
        const action = {
            type: 'SAVE_AQ',
            payload: data
        }
        await store.dispatch(action);
        return action;
    } catch (error) {
        console.log('Error(saveAQTags-PersonaProfileFunctions): ', error);
        return false;
    }
}

export const getItemsFromData = (value) => {
    const items = initial_data.persona_profile.persona[value].data;
    let needArray = items.needs;
    let cirArray = items.circumstances;
    let arrNeeds = [];
    let arrCirc = [];

    const needsData = getDataFromLocalStorage('needsData');
    const circumstancesData = getDataFromLocalStorage('circumstancesData');

    if (needsData.content !== undefined) {
        for (let i = 0; i < needsData.content.length; i++) {
            for (let j = 0; j < needArray.length; j++) {
                if (needsData.content[i].id === `need:${needArray[j]}`) {
                    arrNeeds.push({
                        value: needsData.content[i].id,
                        label: needsData.content[i].name,
                        original: needsData.content[i]
                    });
                }
            }
        }
    }

    if (circumstancesData.content !== undefined) {
        for (let i = 0; i < circumstancesData.content.length; i++) {
            for (let j = 0; j < cirArray.length; j++) {
                if (circumstancesData.content[i].id === `circumstance:${cirArray[j]}`) {
                    arrCirc.push({
                        value: circumstancesData.content[i].id,
                        label: circumstancesData.content[i].name,
                        original: circumstancesData.content[i]
                    });
                }
            }
        }
    }

    return {
        arrNeeds,
        arrCirc
    };
}

export const getItemsFromQA = () => {
    const items = initial_data.AQItems;
    let arrObj = []

    const needsData = getDataFromLocalStorage('needsData');

    if (needsData.content !== undefined) {
        for (let i = 0; i < needsData.content.length; i++) {
            for (let j = 0; j < items.length; j++) {
                if (needsData.content[i].id === `need:${items[j]}`) {
                    arrObj.push(needsData.content[i]);
                }
            }
        }
    }
    return arrObj;
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