import React from 'react';

import SearchMethodSection from '../SearchMethodSection/SearchMethodSection';
import DropdownElement from '../../../../shared/Elements/DropdownElement';

import store from '../../../../../Store/store';
import AlertModal from '../../../../shared/Elements/AlertModal';
import TagSelector from '../../../../shared/Elements/TagSelector';
import { getCircumstancesData, getCircumstancesObject } from '../functions';
import { getCircumstancesAction, getGenderAction } from '../../../../../Store/Actions/actions';
import { getDataFromLocalStorage } from '../../personaProfile/functions';
import { sortList } from '../../../../../functions/GeneralFunctions';

export default class CircumstancesComponent extends React.Component {

    state = {
        ...this.getCurrentStateFromStore(),
        isLoaded: false,
        circumstances: { data: [] },
        lvl1Selected: undefined,
        lvl2Selected: undefined,
        lvl3Selected: undefined,
        filterlvl2: '',
        filterlvl3: ''
    }

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        const data = getDataFromLocalStorage('circumstancesData');
        if (data.error) {
            // await this.setState({ error: JSON.stringify(data.error) });
            // return window.$('#circumstances').appendTo('body').modal('show');
            this.setState({
                isLoaded: true
            })
        } else {
            let newData = getCircumstancesData(data.content);
            await this.setState({
                cData: data.content,
                cData1: newData[0],
                cData2: newData[1],
                cData3: newData[2],
                isLoaded: true,
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            circumstances: store.getState().Interacted.circumstances,
        }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            this.setState(currentState);
        }
    }

    addCircumstance = async (value) => {
        try {
            await store.dispatch(getCircumstancesAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#circumstances').appendTo('body').modal('show');
        }
    }

    level2Filter = async (value) => {
        const data = this.state.cData2.filter(item => item.parent.id === value);
        await this.setState({
            lvl1Selected: value,
            lvl2Selected: '',
            lvl3Selected: '',
            filterlvl2: sortList(data)
        });
    }

    level3Filter = async (value) => {
        const data = this.state.cData3.filter(item => item.parent.id === value);
        await this.setState({
            lvl2Selected: value,
            lvl3Selected: '',
            filterlvl3: sortList(data)
        });
    }

    getItemSelected = async () => {
        let error = false;
        let objToSave, cir;
        if (!this.state.lvl3Selected) {
            if (!this.state.lvl2Selected) {
                if (!this.state.lvl1Selected) {
                    error = true;
                } else {
                    if (this.state.filterlvl2.length > 0) error = true;
                    else objToSave = await getCircumstancesObject(this.state.lvl1Selected, this.state.circumstances.data, this.state.cData);
                }
            } else {
                if (!this.state.lvl2Selected) {
                    error = true;
                } else {
                    if (this.state.filterlvl3.length > 0) error = true;
                    else {
                        if ((this.state.lvl2Selected === 'circumstance:192') || (this.state.lvl2Selected === 'circumstance:193') || (this.state.lvl2Selected === 'circumstance:194')) {
                            cir = await this.state.cData.filter(item => item.id === this.state.lvl2Selected)[0];
                        }
                        objToSave = await getCircumstancesObject(this.state.lvl2Selected, this.state.circumstances.data, this.state.cData);
                    }
                }
            }
        } else {
            if (!this.state.lvl3Selected) {
                error = true;
            } else {
                objToSave = await getCircumstancesObject(this.state.lvl3Selected, this.state.circumstances.data, this.state.cData);
            }
        }

        if (error) {
            await this.setState({ error: 'You must to choose a circumstance' })
            return window.$('#scircumstances').appendTo('body').modal('show');
        }

        try {
            if (cir) await store.dispatch(getGenderAction({ value: cir.id, label: cir.name, original: cir.original }));
            await store.dispatch(getCircumstancesAction(objToSave));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#scircumstances').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <SearchMethodSection id="cirSection" title="Choose Circumstances" description="Search by particular circumstance(s)." >
                <AlertModal id="scircumstances" name="circumstances" error={this.state.error} />
                {this.state.isLoaded &&
                    <>
                        <div className="d-flex ml-1 row justify-content-between align-items-center">
                            <DropdownElement
                                placeholder="Select group"
                                horizontal={false}
                                id='circumstances-group-lvl1'
                                title="Circumstances LVL 1"
                                default={this.state.groupSelected}
                                data={this.state.cData1 && this.state.cData1.map(item => ({ value: item.id, label: item.name, original: item }))}
                                class="col-sm-auto pl-0 w-100"
                                onChange={(e) => this.level2Filter(e)}
                            />

                            {((this.state.lvl1Selected !== '') && (this.state.filterlvl2.length > 0)) &&
                                <DropdownElement
                                    placeholder="Select group"
                                    horizontal={false}
                                    id='circumstances-group-lvl2'
                                    title="Circumstances LVL 2"
                                    default={this.state.groupSelected}
                                    data={this.state.filterlvl2 && this.state.filterlvl2.map(item => ({ value: item.id, label: item.name, original: item }))}
                                    class="col-sm-auto pl-0 w-100"
                                    onChange={(e) => this.level3Filter(e)}
                                />
                            }
                            {((this.state.lvl2Selected !== '') && (this.state.lvl1Selected !== '') && (this.state.filterlvl3.length > 0)) &&
                                <DropdownElement
                                    placeholder="Select group"
                                    horizontal={false}
                                    id='circumstances-group-lvl3'
                                    title="Circumstances LVL 3"
                                    default={this.state.groupSelected}
                                    data={this.state.filterlvl3 && this.state.filterlvl3.map(item => ({ value: item.id, label: item.name, original: item }))}
                                    class="col-sm-auto pl-0 w-100"
                                    onChange={(e) => this.setState({ lvl3Selected: e })}
                                />
                            }
                            <div className="d-flex justify-content-end w-100 col-auto">
                                <button type="button" className="btn btn-secondary align-items-center d-flex mb-0" onClick={this.getItemSelected}>
                                    <i className="material-icons p-0">add</i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <TagSelector
                                isSearchable={false}
                                title="Chosen circumstance(s):"
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, Menu: () => null, }}
                                placeholder="Your selection"
                                onChange={this.addCircumstance}
                                data_selected={this.state.circumstances.data}
                                name="circumstances" />
                        </div>
                    </>
                }
            </SearchMethodSection>
        )
    }
}