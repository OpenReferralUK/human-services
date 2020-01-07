import React from 'react';
import InfoServiceSection from '../../shared/Elements/InfoServiceSection';

export default class ContactInfoComponent extends React.Component {
    render() {
        return (
            <>
                <InfoServiceSection title="Contact">
                    {this.props.data.contacts.length > 0 || this.props.data.service_at_locations.length > 0 || this.props.data.email !== '' ?

                        <div>
                            {this.props.data.contacts.length > 0 &&
                                <>
                                    <h5>Contact tel: </h5>
                                    <ul>
                                        {this.props.data.contacts.map((item, i) => (
                                            item.phones.map(itemPhone => (
                                            <li className="mb-0" key={i}>{itemPhone.number}</li>
                                            ))
                                        ))}
                                    </ul>
                                </>
                            }
                            {this.props.data.email !== '' &&
                                <>
                                    <h5>Contact email:</h5>
                                    <ul>
                                        <li><div className="d-flex align-items-center">
                                            {this.props.data.email}
                                        </div></li>
                                    </ul>
                                </>
                            }
                            {this.props.data.service_at_locations.length > 0 &&
                                this.props.data.service_at_locations.map((item, i) =>
                                    <div key={i}>
                                        {item.location.physical_addresses.length > 0 &&
                                            <>
                                                <h5>Physical Addresses:</h5>
                                                <ul>
                                                    {item.location.physical_addresses.map((itemAddress, i) =>
                                                        <div key={i}>
                                                            <li className="mb-0">{itemAddress.address_1}{itemAddress.city}({itemAddress.postal_code})</li>
                                                        </div>)}
                                                </ul>
                                            </>
                                        }
                                    </div>
                                )
                            }
                        </div>
                        :
                        <p className="mb-0">No contact info</p>
                    }
                </InfoServiceSection>
            </>
        )
    }
}