import React, { Component } from 'react';
import classNames from 'classnames';

export default class InputElement extends Component {

    classList = classNames("form-group w-100", { "d-flex": (this.props.horizontal === true ? true : false) }, this.props.class);
    classLabel = classNames("d-flex align-items-center mb-0 text-nowrap mr-3", this.props.titleClass);
    classInput = classNames("form-control", this.props.inputClass);

    render() {
        return (
            <div className={this.classList}>
                {(this.props.title === undefined) ? '' : <label htmlFor={this.props.id} className={this.classLabel}>{this.props.arrow}{this.props.title}</label>}
                <input
                    disabled={this.props.disabled === undefined ? false : (this.props.disabled === true ? true : false)}
                    type={this.props.type}
                    name={this.props.name}
                    className={this.classInput}
                    id={this.props.id}
                    maxLength={this.props.maxlength}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChange={(e, elem) => this.props.onChange(e.target.value, this.props.id)}
                    min={this.props.min}
                    max={this.props.max} />
                {this.props.children}
            </div>
        )
    }
}