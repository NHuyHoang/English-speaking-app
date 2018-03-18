import { AppRegistry } from 'react-native';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import React from 'react';
const store = configureStore();
const ReduxWrap = () => (
    <Provider store={store}>
        <App/>
    </Provider>
)
AppRegistry.registerComponent('record_section', () => ReduxWrap);
