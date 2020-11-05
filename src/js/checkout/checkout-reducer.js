import {SPOT_PURCHASE} from './checkout-actions';

export const initialState = {
    firstName: null,
    LastName: null,
    email: null,
    phone: null,
};

export default function checkout(state = initialState, {type, payload}) {
    switch (type) {
        case SPOT_PURCHASE: {
            return {
                ...state,
                ...payload
            };
        }
        default:
            return state;
    }
}
