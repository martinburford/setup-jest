// React imports
import React, { Component, Fragment } from 'react';

// Local project (JavaScript) imports
import Firstname from './components/Firstname/Firstname';

class App extends Component {
    render(){
        return (
            <Fragment>
                <h1>App</h1>
                <Firstname name="Martin" />
            </Fragment>
        );
    }
}

export default App;