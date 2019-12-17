import React, { Component } from 'react';
import classNames from 'classnames';

export default class DropdownElement extends Component {

    classList = classNames("form-group", { "d-flex": (this.props.horizontal === true ? true : false) }, this.props.class);

    render() {
        return (
            <div className={this.classList}>
                {(this.props.title === undefined) ? '' : <label htmlFor={this.props.id} className=" d-flex align-items-center mb-0">{this.props.title}</label>}
                <select
                    className="form-control col"
                    id={this.props.id}
                    onChange={(e) => this.props.onChange(e.target.value, this.props.id)}
                    value={this.props.default === undefined ? undefined : this.props.default}
                    disabled={this.props.disabled === undefined ? false : this.props.disabled}
                >
                    <option key="0" selected={this.props.default === undefined ? true : null} disabled value="-1">{(this.props.placeholder === undefined) ? "Select option" : this.props.placeholder}</option>
                    {this.props.data && this.props.data.map((item, i) => (<option key={i} value={item.value}>{item.label}</option>))}
                </select>
            </div>
        )
    }
}