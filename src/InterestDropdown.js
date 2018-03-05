import React, { Component } from 'react';
import { Picker } from 'react-native';

export default class InterestDropdown extends Component {
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
