import React from 'react';

import SearchMethodSection from '../SearchMethodSection/SearchMethodSection';
import { getItemsFromQA, removeDuplicates } from '../functions';
import store from '../../../../../Store/store';
import { getNeedsAction } from '../../../../../Store/Actions/actions';

export default class AnswersQuestionComponent extends React.Component {

    state = {
        ...this.getCurrentStateFromStore(),
        data: '',
        isLoaded: false,
        dataSelected: [],
    }

    componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        this.updatesItems();
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return { needs: store.getState().Interacted.needs.data }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            this.setState(currentState);
        }
        this.updatesItems();
    }

    updatesItems = async () => {
        const items = getItemsFromQA()
        if (items.length > 0) {
            await this.setState({
                data: items.map(item => {
                    return ({
                        checked: false,
                        value: item.id,
                        label: item.name,
                        original: item
                    })
                }),
                isLoaded: true
            })
        }
    }

    saveAQCheckbox = async (value, index) => {
        this.state.data[index].checked = !this.state.data[index].checked;
        let newData = this.state.needs.slice();
        let newItem = true;
        for (var i = 0; i < newData.length; i++) {
            if (newData[i].value === value.value) {
                newData.splice(i, 1);
                i--;
                newItem = false
            }
        }
        if (newItem) await newData.push(value);

        try {
            await store.dispatch(await getNeedsAction(await removeDuplicates(newData, 'value')));
            this.forceUpdate();
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <SearchMethodSection id="aqSection" title="Ask a question" description="What is the main area of interest?" >
                {this.state.isLoaded &&
                    <>
                        <div className="mt-1 card-grid row">
                            {this.state.data.map((item, i) => {
                                if (this.state.needs.length > 0) {
                                    for (let j = 0; j < this.state.needs.length; j++) {
                                        if (item.value === this.state.needs[j].value) {
                                            let newData = this.state.data.slice();
                                            newData[i].checked = true;
                                        }
                                    }
                                }
                                return (<div className="card col-md-auto rounded custom-control custom-checkbox m-1" key={i}>
                                    <div className="d-flex justify-content-start align-items-center m-1">
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer custom-control-input"
                                            checked={item.checked}
                                            id={item.value}
                                            onChange={() => this.saveAQCheckbox(item, i)} />
                                        <label className="cursor-pointer custom-control-label" htmlFor={item.value}>{item.label}</label>
                                    </div>
                                </div>)
                            }
                            )}
                        </div>
                    </>
                }
            </SearchMethodSection>
        )
    }
}