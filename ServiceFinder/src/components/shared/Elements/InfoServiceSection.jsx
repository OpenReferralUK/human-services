import React from 'react';

export default class InfoServiceSection extends React.Component {
    render() {
        return (
            <>
                <div className="mx-2 my-2 mt-4">
                    <h4>{this.props.title}</h4>
                    <hr />
                    {this.props.children}
                </div>
            </>
        )
    }
}