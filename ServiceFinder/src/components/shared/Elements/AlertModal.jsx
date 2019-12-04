import React from 'react';

export default class AlertModal extends React.Component {
    render() {
        // window.$(`#${this.props.id}`).appendTo('body');
        return (
            <div className="modal fade" id={this.props.id} style={{ zIndex: '5000' }} tabIndex="-1" role="dialog" aria-labelledby="ageAlertModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="ageAlertModalLabel">Error!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            The {this.props.name} cannot been saved!
                                <br />
                            Error: {this.props.error}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}