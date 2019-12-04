import React from 'react';

import SearchMethodSection from '../SearchMethodSection/SearchMethodSection';

import GridPersona from '../../../../shared/Elements/GridPersona';

import { handleChangePersona } from '../functions';

import initial_data from '../../../../../config';

export default class PersonasComponent extends React.Component {
    render() {
        return (
            <SearchMethodSection id="personaSection" title="Choose Persona" description="Search by preconfigured scenarios." >
                <GridPersona id="persona" data={initial_data.persona_profile.persona} onClick={async (e) => handleChangePersona(e)} />
            </SearchMethodSection>
        )
    }
}