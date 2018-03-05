import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InterestCalculatorContainer from './src/InterestCalculatorContainer';
import store from './src/redux-store';

class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Interest Calculator (redux)</Text>

                <InterestCalculatorContainer />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 120,
    },
});

import { Provider } from 'react-redux';
export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);
