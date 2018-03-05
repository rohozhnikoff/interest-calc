import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, Slider } from 'react-native';
import _ from 'lodash';
import { pure } from 'recompose';
import pTypes from 'prop-types';

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

const AuSlider = pure(({ formatValue, ...props }) => {
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
                                    props.value / (props.maximumValue - props.minimumValue) * 100,
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
});

AuSlider.defaultProps = {
    formatValue: (value) => String(value),
};
AuSlider.propTypes = {
    ...Slider.propTypes,
    formatValue: pTypes.func,
    // styleContainer
};

// ----------------------------------------------------------------------------------

class InterestCalculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            interest: props.interest || props.interestsOptions[0],
            amount: props.amount || props.amountFrom,
        };
    }

    static propTypes = {
        amountFrom: pTypes.number,
        amountTo: pTypes.number.isRequired,
        currencySymbol: pTypes.oneOf(['£', '€', '$']),
        interestsOptions: pTypes.arrayOf(pTypes.number).isRequired,
        interest: pTypes.number,
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
            // borderBottomWidth: 1,
            // borderTopWidth: 1,
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
        const { formatRangeInputValue, onRangeInputChange } = this;
        const { amount } = this.state;
        const { amountFrom, amountTo } = this.props;

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
    onRangeInputChange = (amount) => {
        this.setState({ amount });
    };

    // ----------------------------------------------------------------------------------
    onInterestChange = (itemValue, itemIndex) => {
        this.setState({ interest: itemValue });
    };
    renderInterestDropdown() {
        const { onInterestChange } = this;
        const { interest } = this.state;
        const { interestsOptions } = this.props;
        return (
            <Picker selectedValue={interest} onValueChange={onInterestChange}>
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
    // ----------------------------------------------------------------------------------

    render() {
        const { formatRangeInputValue } = this;
        const { amount, interest } = this.state;
        return (
            <View style={InterestCalculator.styles.container}>
                <View style={InterestCalculator.styles.separatedBox}>
                    {this.renderInterestDropdown()}
                </View>
                <View style={InterestCalculator.styles.separatedBox}>
                    {this.renderRangeInput()}
                    <Text style={InterestCalculator.styles.total}>
                        {formatRangeInputValue(amount + amount * (interest / 100))}
                    </Text>
                </View>
            </View>
        );
    }
}

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Interest Calculator</Text>

                <InterestCalculator
                    {...{
                        interestsOptions: _.times(10)
                            .map((n) => 4.7 + n * Math.PI)
                            .map((n) => n.toFixed(2))
                            .map((n) => parseFloat(n)),
                        amountTo: 250000,
                        amountFrom: 500,
                        amount: 10000,
                    }}
                />
            </View>
        );
    }
}
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 120,
    },
});
