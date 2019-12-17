import Axios from 'axios';

import jwt from 'jsonwebtoken';

import {
    JWT,
    API_directions,
} from '../settings/settings';

//Api Functions
export const getAllCircumstancesFromAPI = async function (name) {
    try {
        let res = await Axios.get(API_directions.get.circumstances);
        let data = await jwt.sign(res.data, JWT.key, {
            expiresIn: JWT.expirationTime
        });
        await localStorage.setItem(name, data);
        return true;
    } catch (e) {
        localStorage.removeItem(name);
        console.log(e);
        return false;
    }
}

export const getAllNeedsFromAPI = async function (name) {
    try {
        let res = await Axios.get(API_directions.get.needs);
        let data = await jwt.sign(res.data, JWT.key, {
            expiresIn: JWT.expirationTime
        });
        await localStorage.setItem(name, data);
        return true;
    } catch (e) {
        localStorage.removeItem(name);
        console.log(e);
        return false;
    }
}

export const getAllServiceTypesFromAPI = async function (name) {
    try {
        let res = await Axios.get(API_directions.get.serviceTypes);
        let data = await jwt.sign(res.data, JWT.key, {
            expiresIn: JWT.expirationTime
        });
        await localStorage.setItem(name, data);
        return true;
    } catch (e) {
        localStorage.removeItem(name);
        console.log(e);
        return false;
    }
}

export const getAllGenderFromAPI = async function (name) {
    try {
        let res = await Axios.get(API_directions.get.gender);
        let data = await jwt.sign(res.data, JWT.key, {
            expiresIn: JWT.expirationTime
        });
        await localStorage.setItem(name, data);
        return true;
    } catch (e) {
        localStorage.removeItem(name);
        console.log(e);
        return false;
    }
}

export const getDataFromAPI = async function () {
    let cir, need, st, gender;
    cir = await getAllCircumstancesFromAPI('circumstancesData')
    need = await getAllNeedsFromAPI('needsData');
    st = await getAllServiceTypesFromAPI('serviceTypesData');
    gender = await getAllGenderFromAPI('genderData');

    if (cir && need && st && gender) {
        return true;
    } else return false;
}

export const checkTokenExpiration = async (name) => {
    if (localStorage.getItem(name)) {
        try {
            let Item = localStorage.getItem(name);
            await jwt.verify(Item, JWT.key);
            return true;
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                switch (name) {
                    case 'circumstancesData':
                        return await getAllCircumstancesFromAPI();
                    case 'needsData':
                        return await getAllNeedsFromAPI();
                    case 'serviceTypesData':
                        return await getAllServiceTypesFromAPI();
                    case 'genderData':
                        return await getAllGenderFromAPI();
                    default:
                        return false;
                }
            } else {
                return false;
            }
        }
    } else return false;
}
export const checkData = async () => {
    let cir, need, st, gender;
    cir = await checkTokenExpiration('circumstancesData');
    need = await checkTokenExpiration('needsData');
    st = await checkTokenExpiration('serviceTypesData');
    gender = await checkTokenExpiration('genderData');
    if (cir && need && st && gender) return true;
    return false;
}

export const refreshData = async () => {
    await getDataFromAPI();
}