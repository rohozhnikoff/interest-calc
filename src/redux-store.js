import { createStore, combineReducers } from 'redux';

import { handleActions } from 'redux-actions';
import _ from 'lodash';

export const INTEREST_CHANGE = 'INTEREST_CHANGE';
export const AMOUNT_CHANGE = 'AMOUNT_CHANGE';

const interestsOptions = _.times(10)
    .map((n) => 4.7 + n * Math.PI)
    .map((n) => n.toFixed(2))
    .map((n) => parseFloat(n));

export default createStore(
    combineReducers({
        interest: handleActions(
            { [INTEREST_CHANGE]: (state, { payload }) => payload },
            interestsOptions[1]
        ),
        interestsOptions: (state, action) => {
            return state === interestsOptions ? state : interestsOptions;
        },
        amount: handleActions({ [AMOUNT_CHANGE]: (state, { payload }) => payload }, 10000),
        amountTo: () => 250000,
        amountFrom: () => 500,
    })
);
