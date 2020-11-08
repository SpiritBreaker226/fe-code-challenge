import axios from 'axios';

export const SPOT_UPDATE_SELECTED = 'SPOT_UPDATE_SELECTED';

export const updateSelected = spot => {
    return {
        type: SPOT_UPDATE_SELECTED,
        payload: spot
    };
};

export const fetchSpot = spotId => async dispatch => {
    try {
        dispatch(updateSelected(null));

        if (!spotId) { return; }

        const res = await axios.get(`/spots/${spotId}`);
        const spot = res.data;

        spot.price = `$${(spot.price / 100).toFixed(2)}`;

        dispatch(updateSelected(spot));
    } catch (error) {
        dispatch(updateSelected({error: error.message}));
    }
};
