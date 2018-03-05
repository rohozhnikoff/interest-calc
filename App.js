import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, Slider } from 'react-native';
import _ from 'lodash';
// import { pure } from 'recompose';
import pTypes from 'prop-types';

// ----------------------------------------------------------------------------------
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { handleActions } from 'redux-actions';

export const INTEREST_CHANGE = 'INTEREST_CHANGE';
export const AMOUNT_CHANGE = 'AMOUNT_CHANGE';

const store = createStore(
    combineReducers({
        interest: handleActions({ [INTEREST_CHANGE]: (state, { payload }) => payload }, 7.84),
        amount: handleActions({ [AMOUNT_CHANGE]: (state, { payload }) => payload }, 10000),
        interestsOptions: (state, action) => {
            return _.isArray(state)
                ? state
                : _.times(10)
                      .map((n) => 4.7 + n * Math.PI)
                      .map((n) => n.toFixed(2))
                      .map((n) => parseFloat(n));
        },
        amountTo: () => 250000,
        amountFrom: () => 500,
    })
);

// ----------------------------------------------------------------------------------

const AuSliderStyles = StyleSheet.create({
    container: {},

    slider: {
        borderRadius: 40,
    },
    sliderComponent: {
        // borderRadius: 40,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
    },

    headerText: {
        color: 'gray',
        fontSize: 11,
    },
    headerTextValue: {
        position: 'absolute',
        top: 0,
    },
});

const trackImage = require('./assets/AuSlider/track.png');
const thumbImage = require('./assets/AuSlider/thumb.png');

Slider.defaultProps = {
    trackImage,
    thumbImage,
};

class AuSlider extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.value !== this.props.value;
    }
    render() {
        const { formatValue, ...props } = this.props;
        return (
            <View style={[AuSliderStyles.container, props.styleContainer]}>
                <View style={AuSliderStyles.header}>
                    <Text style={AuSliderStyles.headerText}>{formatValue(props.minimumValue)}</Text>
                    <Text style={AuSliderStyles.headerText}>{formatValue(props.maximumValue)}</Text>

                    <Text
                        style={[
                            AuSliderStyles.headerText,
                            AuSliderStyles.headerTextValue,
                            {
                                left: `${Math.max(
                                    Math.min(
                                        props.value /
                                            (props.maximumValue - props.minimumValue) *
                                            100,
                                        62
                                    ),
                                    13
                                )}%`,
                            },
                        ]}>
                        {formatValue(props.value)}
                    </Text>
                </View>
                <View style={AuSliderStyles.slider}>
                    <Slider {...props} style={[AuSliderStyles.sliderComponent, props.style]} />
                </View>
            </View>
        );
    }
}

AuSlider.defaultProps = {
    formatValue: (value) => String(value),
};
AuSlider.propTypes = {
    ...Slider.propTypes,
    formatValue: pTypes.func,
    // styleContainer
};

// ----------------------------------------------------------------------------------
class InterestDropdown extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.interest !== this.props.interest;
    }
    render() {
        const { interestsOptions, onInterestChange, interest } = this.props;
        return (
            <Picker selectedValue={String(interest)} onValueChange={onInterestChange}>
                {interestsOptions.map((n) => (
                    <Picker.Item
                        label={`${n.toString().replace('.', ',')} %`}
                        value={String(n)}
                        key={n}
                    />
                ))}
            </Picker>
        );
    }
}
// ----------------------------------------------------------------------------------

import { connect } from 'react-redux';
class InterestCalculator extends Component {
    static propTypes = {
        amountFrom: pTypes.number.isRequired,
        amountTo: pTypes.number.isRequired,
        amount: pTypes.number.isRequired,
        currencySymbol: pTypes.oneOf(['£', '€', '$']),
        interestsOptions: pTypes.arrayOf(pTypes.number).isRequired,
        interest: pTypes.number.isRequired,
    };

    static defaultProps = {
        currencySymbol: '£',
        amountFrom: 0,
    };

    static styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            alignItems: 'center',
        },
        total: {
            fontWeight: '600',
            color: 'black',
            fontSize: 18,
        },
        separatedBox: {
            width: '96%',
            borderColor: 'rgba(0,0,0,.2)',
            paddingTop: 20,
            paddingBottom: 20,
        },
    });
    // ----------------------------------------------------------------------------------
    static formatMoney = (num, decimal = 0) =>
        Number(num)
            .toFixed(decimal)
            .replace(/./g, (c, i, a) => (i && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c));
    // ----------------------------------------------------------------------------------
    renderRangeInput() {
        const { formatRangeInputValue } = this;
        const { amountFrom, amountTo, onRangeInputChange, amount } = this.props;

        return (
            <AuSlider
                step={500}
                maximumValue={amountTo}
                minimumValue={amountFrom}
                value={amount}
                formatValue={formatRangeInputValue}
                onValueChange={onRangeInputChange}
            />
        );
    }
    formatRangeInputValue = (value) => {
        return `${this.props.currencySymbol}${InterestCalculator.formatMoney(value)}`;
    };

    // ----------------------------------------------------------------------------------

    renderInterestDropdown() {
        const { interestsOptions, onInterestChange, interest } = this.props;
        return (
            <InterestDropdown
                interestsOptions={interestsOptions}
                onInterestChange={onInterestChange}
                interest={interest}
            />
        );
    }
    // ----------------------------------------------------------------------------------

    render() {
        const { formatRangeInputValue } = this;
        const { amount, interest, total } = this.props;
        return (
            <View style={InterestCalculator.styles.container}>
                <View style={InterestCalculator.styles.separatedBox}>
                    {this.renderInterestDropdown()}
                </View>
                <View style={InterestCalculator.styles.separatedBox}>
                    {this.renderRangeInput()}
                    <Text style={InterestCalculator.styles.total}>
                        {formatRangeInputValue(total)}
                    </Text>
                </View>
            </View>
        );
    }
}
const InterestCalculatorConnected = connect(
    ({ interest, amount, amountTo, amountFrom, interestsOptions }) => {
        return {
            interest,
            amount,
            amountTo,
            amountFrom,
            interestsOptions,
            total: amount + amount * (interest / 100),
        };
    },
    (dispatch) => ({
        onInterestChange: (value) => dispatch({ type: INTEREST_CHANGE, payload: Number(value) }),
        onRangeInputChange: (value) => dispatch({ type: AMOUNT_CHANGE, payload: Number(value) }),
    })
)(InterestCalculator);

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Interest Calculator (redux)</Text>

                <InterestCalculatorConnected />
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

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);
