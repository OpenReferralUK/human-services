import React from 'react';
import PersonaProfileContent from './PersonaProfileContent';

export default class SmallPersonaProfile extends React.Component {
    render() {
        return (
            <div className='container my-2 pb-5'>
                <PersonaProfileContent />
            </div>
        )
    }
}