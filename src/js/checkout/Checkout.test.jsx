import React from 'react';
import {render} from '@testing-library/react';

import {Provider} from 'react-redux';
import {createStore} from 'redux';

import faker from 'faker';

import Checkout from './Checkout';
import spotReducer, {
    initialState,
} from '../spot/spot-reducer';

describe('Checkout', () => {
    it('should render a fourm with the spot details', () => {
        const spotId = faker.random.number(9);
        const mockStore = createStore(
            spotReducer,
            {
                ...initialState,
                spot: {
                    selected: {
                        id: spotId,
                        title: faker.lorem.lines(1),
                        price: faker.random.number(9999),
                        description: faker.lorem.paragraph(1),
                        distance: `${faker.random.number(999)} ft`,
                        image: faker.image.city()
                    },
                },
            },
        );

        const {queryByText, queryByTestId} = render(
            <Provider store={mockStore}>
                <Checkout />
            </Provider>
        );

        expect(
            queryByText('Select a Spot', {exact: false})
        ).not.toBeInTheDocument();

        expect(queryByTestId(`spot-item-info-${spotId}`)).toBeInTheDocument();
    });

    describe('when user goes directly to the checkout from URL', () => {
        it('should render no spot found message', () => {
            const mockStore = createStore(
                spotReducer,
                {
                    ...initialState,
                    spot: {selected: {}},
                },
            );

            const {queryByText, queryByTestId} = render(
                <Provider store={mockStore}>
                    <Checkout />
                </Provider>
            );

            expect(
                queryByText('Select a Spot', {exact: false})
            ).toBeInTheDocument();

            expect(queryByTestId('purchase-spot')).not.toBeInTheDocument();
        });
    });
});
