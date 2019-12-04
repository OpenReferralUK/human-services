import React, { Component } from 'react';
import Select from "react-select";

export default class TagSelector extends Component {

    render() {
        return (
            <div className="form-group mt-2 w-100">
                {(this.props.title === undefined) ? '' : <label htmlFor={this.props.id} className="mb-0">{this.props.title}</label>}
                <div className="d-flex justify-content-between">
                    <Select
                        formatOptionLabel={this.props.formatOptionLabel}
                        isDisabled={this.props.disabled === undefined ? false : this.props.disabled}
                        className="w-100"
                        components={this.props.components}
                        id={this.props.id}
                        isMulti={this.props.isMulti === undefined ? true : (this.props.isMulti) === true ? true : false}
                        name={this.props.name}
                        options={this.props.data}
                        value={this.props.data_selected}
                        isSearchable={this.props.isSearchable !== undefined ? (this.props.isSearchable === true ? true : false) : false}
                        placeholder={this.props.placeholder}
                        onChange={(value, action) => this.props.onChange(value, action)}
                    />
                    {this.props.children}
                </div>
            </div>
        )
    }
}