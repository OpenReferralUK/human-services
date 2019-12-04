import React from 'react';
import InfoServiceSection from '../../shared/Elements/InfoServiceSection';

export default class DescriptionInfoServiceComponent extends React.Component {
    render() {
        return (
            <>
                <InfoServiceSection title="Description">
                    <div>
                        {this.props.description}
                    </div>
                </InfoServiceSection>
            </>
        )
    }
}