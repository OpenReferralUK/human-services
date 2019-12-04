import React, { Component } from 'react';

import SmallBody from './SmallBody';
import BigBody from './BigBody';
import store from '../../../Store/store';

export default class Body extends Component {

    state = {
        windowWidth: 0,
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        try {
            store.dispatch({ type: 'SET_HOME' });
        } catch (e) {
            console.log(e);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ windowWidth: window.innerWidth });
        this.forceUpdate();
    }

    render() {
        if (this.state.windowWidth >= 992) {
            return (
                <div>
                    <BigBody />
                </div>
            )
        } else {
            return (
                <div>
                    <SmallBody width={this.state.windowWidth} />
                </div>
            )
        }
    }
}