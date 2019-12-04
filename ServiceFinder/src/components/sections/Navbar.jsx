import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import banner from '../../assets/banner/banner.png';
import logo from '../../assets/logo/new_logo.png'

class Navbar extends React.Component {

    state = {
        maxBackground: 4
    }

    componentDidMount() {
        this.setState({
            n: Math.floor((Math.random() * this.state.maxBackground) + 1)
        })
    }

    moveToHome = () => {
        this.props.history.push('/')
        window.$('#homeButton').toggleClass('active');
        if (window.$('#personaProfileTab').hasClass('active')) {
            window.$('#personaProfileTab').toggleClass('active').attr('aria-selected', false);
        }
        if (window.$('#searchMethodTab').hasClass('active')) {
            window.$('#searchMethodTab').toggleClass('active').attr('aria-selected', false);
        }
        if (window.$('#previousSearchesTab').hasClass('active')) {
            window.$('#previousSearchesTab').toggleClass('active').attr('aria-selected', false);
        }
        if (window.$('#searchingForTab').hasClass('active')) {
            window.$('#searchingForTab').toggleClass('active').attr('aria-selected', false);
        }
    }

    render() {
        return (
            <nav className="p-2 navbar navbar-expand-lg navbar-light bg-light backgroundImage" style={{ backgroundImage: `url(/images/background/background${this.state.n}.png)` }} >
                <a id="homeButton" className="mb-0 d-flex align-items-center" style={{ textDecoration: 'none', color: '#212529' }}
                    onClick={this.moveToHome}
                    data-toggle="tab" href="#homeWords" role="tab" aria-controls="homeWords" aria-selected="false">
                    <img src={logo} className="d-inline-block mobile" alt="logo" />
                    <h5 className="mb-0">Service Finder</h5>
                </a>
                <div className="navbar-toggler border-0 p-0">
                    <div className="d-flex">
                        <button className="btn btn-outline-secondary mr-1" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="d-flex justify-content-center ml-1">
                            <img src={banner} alt="banner" width="65" height="38" />
                        </div>
                    </div>
                </div>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-flex w-100">
                        <li className="nav-item d-flex align-items-center">
                            <Link to="/about" className="nav-item nav-link mt-1" onClick={() => window.$('#navbarSupportedContent').collapse('hide')}>About</Link>
                        </li>
                    </ul>
                </div>
                <div className="d-flex justify-content-center mr-1 pc-only">
                    <img src={banner} alt="banner" width="65" height="38" />
                </div>
            </nav >
        )
    }
}

export default withRouter(Navbar);