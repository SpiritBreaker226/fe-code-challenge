export const SPOT_PURCHASE = 'SPOT_PURCHASE';

export const purchase = data => {
    return {
        type: SPOT_PURCHASE,
        payload: data
    };
};
