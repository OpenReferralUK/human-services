import React from 'react';
import store from '../../../Store/store';

import AlertModal from '../Elements/AlertModal';
import { getPostcodeAction } from '../../../Store/Actions/actions';

import InputElement from '../Elements/InputElement';

export default class PostcodeComponent extends React.Component {

    state = this.getCurrentStateFromStore();

    async componentDidMount() {
        this.unsubscribeStore = store.subscribe(this.updateStateFromStore);
    }

    componentWillUnmount() {
        this.unsubscribeStore();
    }

    getCurrentStateFromStore() {
        return {
            postcode: store.getState().Interacted.postcode,
        }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        if (this.state !== currentState) {
            this.setState(currentState);
        }
    }

    changePostCode = async (value) => {
        try {
            await store.dispatch(getPostcodeAction(value.toUpperCase().replace(' ', '')));
        } catch (e) {
            await this.setState({ error: JSON.stringify(e) });
            window.$('#personaProfile').appendTo('body').modal('show');
        }
    }

    render() {
        return (
            <>
                <AlertModal name="personaProfile" error={this.state.error} />
                <div className="col">
                    <InputElement
                        id="postcode"
                        title="Post Code:"
                        type="text"
                        value={this.state.postcode.label || ''}
                        onChange={this.changePostCode}
                        placeholder="Ex: PR9 7PG" />
                </div>
            </>
        )
    }
}