import React from 'react';

import DropdownElement from '../../../../shared/Elements/DropdownElement';
import SearchMethodSection from '../SearchMethodSection/SearchMethodSection';

import store from '../../../../../Store/store'

import TagSelector from '../../../../shared/Elements/TagSelector';
import { getNeedsObject } from '../functions';
import { getNeedsAction } from '../../../../../Store/Actions/actions';
import AlertModal from '../../../../shared/Elements/AlertModal';
import { getDataFromLocalStorage } from '../../personaProfile/functions';


export default class NeedsComponent extends React.Component {
    state = {
        ...this.getCurrentStateFromStore(),
        isLoaded: false,
        nData: [],
        needs: { data: [] },
        itemsSelected: [],
        filterLvl2: '',
        groupSelected: -1,
        detailSelected: ''
    }

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        const data = getDataFromLocalStorage('needsData');
        if (data.error) {
            await this.setState({ error: JSON.stringify(data.error) });
            return window.$('#needs').appendTo('body').modal('show');
        } else {
            const dataLevel1 = data.content.filter(item => item.parent === null);
            const dataLevel2 = data.content.filter(item => item.parent !== null);
            this.setState({
                nData: data.content,
                dataLevel1: dataLevel1,
                dataLevel2: dataLevel2,
                isLoaded: true
            });
        }
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            needs: store.getState().Interacted.needs,
        }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            this.setState(currentState);
        }
    }

    addNeed = async (value) => {
        try {
            await store.dispatch(getNeedsAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#sneeds').appendTo('body').modal('show');
        }
    }

    level2Filter = async (value) => {
        const data = this.state.dataLevel2.filter(item => item.parent.id === value);
        await this.setState({
            groupSelected: value,
            filterLvl2: data
        })
    }

    getItemSelected = async () => {
        let objToSave;
        if (this.state.groupSelected !== -1) {
            if (this.state.detailSelected === '') {
                objToSave = await getNeedsObject(this.state.groupSelected, this.state.needs.data.slice(), this.state.nData);
            } else {
                objToSave = await getNeedsObject(this.state.detailSelected, this.state.needs.data.slice(), this.state.nData);
            }
        } else {
            await this.setState({ error: 'You must to choose a need' })
            return window.$('#sneeds').appendTo('body').modal('show');
        }

        try {
            await store.dispatch(getNeedsAction(objToSave));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#sneeds').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <SearchMethodSection id="needSection" title="Choose Need" description="Search by particular need(s)." >
                <AlertModal id="sneeds" name="needs" error={this.state.error} />
                {this.state.isLoaded &&
                    <>
                        <div className="d-flex justify-content-between align-items-center">
                            <DropdownElement
                                placeholder="Select group"
                                horizontal={false}
                                id='needs-group'
                                title="Needs Group"
                                default={this.state.groupSelected}
                                data={this.state.dataLevel1.map(item => ({ value: item.id, label: item.name, original: item }))}
                                class="col-xl-auto pl-0"
                                onChange={(e) => this.setState({ groupSelected: e })}
                            />

                            {((this.state.groupSelected !== '') && (this.state.filterLvl2.length > 0)) &&
                                <DropdownElement
                                    placeholder="Select detail"
                                    horizontal={false}
                                    id='needs-detail'
                                    title="Needs Detail"
                                    default={this.state.detailSelected}
                                    data={this.state.dataLevel2.map(item => ({ value: item.id, label: item.name, original: item }))}
                                    class="col-xl-auto pr-0"
                                    onChange={(e) => this.setState({ detailSelected: e })}
                                />
                            }
                            <button type="button" className="col-auto btn btn-secondary justify-content-center d-flex align-items-center mt-2 h-25 ml-2" onClick={this.getItemSelected}>
                                <i className="material-icons p-0">add</i>
                            </button>
                        </div>
                        <div className="d-flex justify-content-between">
                            <TagSelector
                                isSearchable={false}
                                title="Chosen need(s):"
                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, Menu: () => null, }}
                                // data={this.state.nData.map(item => ({ value: item.id, label: item.name, original: item }))}
                                placeholder="Your selection"
                                onChange={this.addNeed}
                                data_selected={this.state.needs.data}
                                name="needs" />
                        </div>
                    </>
                }
            </SearchMethodSection>
        )
    }
}