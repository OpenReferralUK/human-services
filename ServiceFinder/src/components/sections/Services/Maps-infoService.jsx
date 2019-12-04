import React from 'react';
import InfoServiceSection from '../../shared/Elements/InfoServiceSection';

export default class MapInfoServiceComponent extends React.Component {

    state = { isLoaded: false }

    componentDidMount() {
        try {
            let location = this.props.item.service_at_locations[0].location;
            let address = location.physical_addresses[0].address_1
            let city = location.physical_addresses[0].city;
            let postal_code = location.physical_addresses[0].postal_code.replace(' ', '')
            let lat = location.latitude;
            let lon = location.longitude;
            this.setState({
                isLoaded: true,
                address,
                city,
                postal_code,
                lat, lon
            });
        } catch (e) {
            this.props.error(e);
        }
    }

    render() {
        return (
            <>
                <InfoServiceSection title="Directions">
                    <ul>
                        <li>{`${this.state.address}${this.state.city}(${this.state.postal_code})`}</li>
                    </ul>
                    <div className="d-flex justify-content-center w-100">
                        <iframe src={`https://www.google.com/maps/place?q=${this.state.postal_code}&output=embed&z=16`}
                            width="600"
                            height="450"
                            title="gMap"
                            className="map"
                            frameBorder="0"
                            style={{ border: '0' }}></iframe>
                    </div>
                </InfoServiceSection>
            </>
        )
    }
}