import { connect } from 'react-redux';
import _ from 'lodash';
import { INTEREST_CHANGE, AMOUNT_CHANGE } from './redux-store';
import InterestCalculator from './InterestCalculator';

export default connect(
    ({ interest, amount, amountTo, amountFrom, interestsOptions }) => {
        return {
            interest,
            amount,
            amountTo,
            amountFrom,
            interestsOptions,

            total:
                amount === amountTo && interest === _.last(interestsOptions)
                    ? 'UBER DOHUYA MONEY'
                    : amount + amount * (interest / 100),
        };
    },
    (dispatch) => ({
        onInterestChange: (value) => dispatch({ type: INTEREST_CHANGE, payload: Number(value) }),
        onRangeInputChange: (value) => dispatch({ type: AMOUNT_CHANGE, payload: Number(value) }),
    })
)(InterestCalculator);
