import React, { Component } from 'react';
import classNames from 'classnames';

export default class SearchElement extends Component {

    submitHandler(e) {
        e.preventDefault();
    }

    classList = classNames("d-flex align-items-start flex-column", this.props.class);

    render() {
        return (
            <form onSubmit={this.submitHandler} className={this.classList}>
                {(this.props.title === undefined) ? '' : <label htmlFor={this.props.id} className="col mb-0">{this.props.title}</label>}
                <div className="d-flex w-100 align-items-center">
                    <input className="form-control form-control-sm mr-3 col" type="text" placeholder="Search"
                        aria-label="Search" id={this.props.id} />
                    <button type="button" className="col-auto btn btn-secondary d-flex align-items-center">
                        <i className="material-icons p-0">search</i>
                    </button>
                </div>
            </form>
        )
    }
}