import React, { Component } from 'react'

import PersonaProfileContent from './PersonaProfileContent';

export default class BigPersonaProfile extends Component {

    render() {
        return (
            <div className="rounded mt-2 ml-2 mr-2" data-parent="#accordion">
                <div className="card personaProfile">
                    <div className="card-header panel-title cursor-pointer " id="personaProfileHeading" data-toggle="collapse" data-target="#personaProfileCollapse" aria-expanded="false" aria-controls="personaProfileCollapse">
                        <div className="d-flex flex-column">
                            <h5 className="mb-0">Set Persona Profile</h5>
                            <p className="mb-0">This will drive the search terms. It is not personal data</p>
                        </div>
                    </div>

                    <div id="personaProfileCollapse" className="collapse" aria-labelledby="personaProfilleHeading" data-parent="#mainAccordion">
                        <div className="card-body">
                            <PersonaProfileContent />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}