import React, { Component } from 'react';

export default class AccordionButton extends Component {
    render() {
        return (
            <a href={`#${this.props.link}`} style={{ textDecoration: 'none', color: '#212529' }}>
                <div data-parent={this.props.data_parent} className={"card-header rounded h-100 m-1 p-2 d-flex flex-column align-items-center justify-content-center text-center collapsed cursor-pointer card-selection"} id={this.props.id} data-toggle="collapse" data-target={`#collapse_${this.props.id}`} aria-expanded="false" aria-controls={`collapse_${this.props.id}`}>
                    <h6 className="mb-0 py-2 text-no-wrap">{this.props.name}</h6>
                </div >
            </a>
        )
    }
}