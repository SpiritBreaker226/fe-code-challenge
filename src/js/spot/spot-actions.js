export const SPOT_UPDATE_SELECTED = 'SPOT_UPDATE_SELECTED';

export const updateSelected = spot => {
    return {
        type: SPOT_UPDATE_SELECTED,
        payload: spot
    };
};
