import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import pTypes from 'prop-types';
import _ from 'lodash';

import AuSlider from './AuSlider';
import InterestDropdown from './InterestDropdown';
import NumberAnimated from './NumberAnimated';

class InterestCalculator extends Component {
    static propTypes = {
        amountFrom: pTypes.number.isRequired,
        amountTo: pTypes.number.isRequired,
        amount: pTypes.number.isRequired,
        currencySymbol: pTypes.oneOf(['£', '€', '$']),
        interestsOptions: pTypes.arrayOf(pTypes.number).isRequired,
        interest: pTypes.number.isRequired,
        total: pTypes.oneOfType([pTypes.number, pTypes.string]).isRequired,
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

    render() {
        const { formatRangeInputValue } = this;
        const { total } = this.props;
        return (
            <View style={InterestCalculator.styles.container}>
                <View style={InterestCalculator.styles.separatedBox}>
                    {this.renderInterestDropdown()}
                </View>
                <View style={InterestCalculator.styles.separatedBox}>
                    {this.renderRangeInput()}
                    <Text style={InterestCalculator.styles.total}>
                        {_.isNumber(total) ? (
                            <NumberAnimated value={total} format={formatRangeInputValue} />
                        ) : (
                            total
                        )}
                    </Text>
                </View>
            </View>
        );
    }
}

export default InterestCalculator;
