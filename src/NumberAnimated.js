import pTypes from "prop-types";
import React, { Component } from "react";

class NumberAnimated extends Component {
    static propTypes = {
        value: pTypes.number.isRequired,
        format: pTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    format(value) {
        return this.props.format ? this.props.format(value) : value.toFixed(2);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    static frameMS = 1000 / 30;
    static duration = 100;

    componentWillReceiveProps(newProps) {
        if (this.state.value !== newProps.value) {
            clearInterval(this.interval);
            const { duration } = newProps;

            const step =
                (newProps.value - this.state.value) /
                ((duration || NumberAnimated.duration) /
                    NumberAnimated.frameMS);

            this.interval = setInterval(() => {
                let value = this.state.value + step;

                if (
                    (step > 0 && value >= newProps.value) ||
                    (step < 0 && value <= newProps.value)
                ) {
                    value = newProps.value;
                    clearInterval(this.interval);
                }

                this.setState({
                    value,
                });
            }, NumberAnimated.frameMS);
        }
    }

    render() {
        return this.format(this.state.value);
    }
}

export default NumberAnimated
