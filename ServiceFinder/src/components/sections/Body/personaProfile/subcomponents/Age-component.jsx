import React from 'react';
import classNames from 'classnames'

import store from '../../../../../Store/store';
import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

import { getAgeAction } from '../../../../../Store/Actions/actions';
import AlertModal from '../../../../shared/Elements/AlertModal';

//Slider props
const Handle = Slider.Handle;

const handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <Tooltip prefixCls="rc-slider-tooltip" overlay={value} visible={dragging} placement="top" key={index}>
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

export default class AgeComponent extends React.Component {
    state = {
        ...this.getCurrentStateFromStore(),
        elementSelected: 0,
        isLoaded: false,
        RangeValue: [0, 100],
        minInit: 0,
        maxInit: 100,
    }

    classNameList = classNames("d-flex justify-content-between align-items-center form-control", { "ml-3": !this.mobile });

    componentDidMount() {
        this.classNameList = classNames("d-flex justify-content-between align-items-center form-control", { "ml-3": !this.mobile }, { "input-disabled": this.state.elementSelected === 0 ? true : false });
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
        this.setState({ isLoaded: true });
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    toggleElement = async (value) => {
        await this.setState({
            elementSelected: value,
        });
        this.state.elementSelected === 0 && await this.setState({
            age: { label: '' }
        })
        this.classNameList = await classNames("d-flex justify-content-between align-items-center form-control", { "ml-3": !this.mobile }, { "input-disabled": value === 0 ? true : false });
        await this.forceUpdate();
    }

    getCurrentStateFromStore() {
        return {
            age: store.getState().Interacted.age,
        }
    }

    updateStateFromStore = async () => {
        const currentState = this.getCurrentStateFromStore();

        if (this.state !== currentState) {
            await this.setState(currentState);
        }

        if (this.state.age.interacted === false) {
            await this.setState({
                RangeValue: [0, 100],
                elementSelected: 0
            });
            this.classNameList = classNames("d-flex justify-content-between align-items-center form-control", { "ml-3": !this.mobile }, { "input-disabled": this.state.elementSelected === 0 ? true : false });
            this.forceUpdate();
        }
    }

    handleChange = async (value) => {
        try {
            if (typeof value !== 'string') this.setState({ RangeValue: value });
            if (value > 100) value = "100";
            await store.dispatch(getAgeAction(value));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#age').appendTo('body').modal('show');
        }
    }

    render() {
        this.mobile = window.innerWidth < 767;
        return (
            <>
                <AlertModal name="age" id="age" error={this.state.error} />
                {this.state.isLoaded &&
                    <>
                        <label htmlFor="ageSlider" className="d-flex align-items-center ml-3">
                            <div >Age:</div>
                            {this.state.age.label !== undefined ?
                                typeof this.state.age.label === 'string' ?
                                    <span className="ml-2">{this.state.age.label > 100 ? '+100' : (this.state.age.label === '' ? 'N/A' : this.state.age.label)}</span>
                                    :
                                    (<span className="ml-2">{this.state.age.label[0]} - {this.state.age.label[1]}</span>)
                                :
                                <span className="ml-2">N/A</span>
                            }
                        </label>
                        <div className="row mx-3 my-2" onClick={() => this.toggleElement(0)}>
                            <div className="col mb-0 align-items-center" style={{ display: !this.mobile && 'flex' }}>
                                <label className="d-flex text-nowrap mr-3" htmlFor="ageSlider"><i className="material-icons" style={{ display: this.state.elementSelected === 0 ? 'flex' : 'none' }}>keyboard_arrow_right</i>Type Age:</label>
                                <input
                                    value={this.state.elementSelected === 0 ? this.state.age.label || '' : ''}
                                    className="form-control"
                                    id="ageInput"
                                    type="number"
                                    max="100"
                                    min="0"
                                    placeholder="Ex: 23"
                                    disabled={this.state.elementSelected === undefined ? false : this.state.elementSelected === 0 ? false : true}
                                    onChange={(e) => this.handleChange(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mx-3 my-2">
                            <div className="col">
                                <div className="mb-1 px-0" style={{ display: !this.mobile && 'flex' }} onClick={() => this.toggleElement(1)} >
                                    <label className="d-flex text-nowrap" htmlFor="ageSlider"><i className="material-icons" style={{ display: this.state.elementSelected === 1 ? 'flex' : 'none' }}>keyboard_arrow_right</i>Select age range:</label>
                                    <div className={this.classNameList}>
                                        <p className="mr-3 mb-0">0</p>
                                        <Range
                                            disabled={this.state.elementSelected === 0}
                                            id="ageSlider"
                                            name="ageSlider"
                                            min={this.state.minInit}
                                            max={this.state.maxInit}
                                            step={5}
                                            handle={handle}
                                            value={this.state.RangeValue}
                                            pushable={1}
                                            allowCross={false}
                                            onChange={this.handleChange}
                                            defaultValue={[0, 100]}
                                        />
                                        <p className="ml-3 mb-0">100</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-end w-100">
                            <button className="btn mr-3 btn-outline-secondary" onClick={() => this.handleChange('')}>Reset Age</button>
                        </div>
                    </>
                }
            </>
        )
    }
}