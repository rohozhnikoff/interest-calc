import React, { Component } from 'react';
import { StyleSheet, Text, View, Slider } from 'react-native';
import pTypes from 'prop-types';

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

const trackImage = require('../assets/AuSlider/track.png');
const thumbImage = require('../assets/AuSlider/thumb.png');

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

export default AuSlider;
