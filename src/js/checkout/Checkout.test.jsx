import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {Provider} from 'react-redux';
import {createStore} from 'redux';

import faker from 'faker';

import Checkout from './Checkout';
import spotReducer, {
    initialState,
} from '../spot/spot-reducer';

describe('Checkout', () => {
    const elementToRender = testId => {
        return () => screen.getByTestId(testId);
    };

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
        expect(queryByTestId('purchase-spot-submit')).toBeInTheDocument();
    });

    describe('using forum', () => {
        let mockStore = null;

        beforeEach(() => {
            mockStore = createStore(
                spotReducer,
                {
                    ...initialState,
                    spot: {
                        selected: {
                            id: faker.random.number(9),
                            title: faker.lorem.lines(1),
                            price: faker.random.number(9999),
                            description: faker.lorem.paragraph(1),
                            distance: `${faker.random.number(999)} ft`,
                            image: faker.image.city()
                        },
                    },
                },
            );

            render(
                <Provider store={mockStore}>
                    <Checkout />
                </Provider>
            );
        });

        it('should display error messages for phone & email', async () => {
            fireEvent.click(screen.getByTestId('purchase-spot-submit'));

            await waitFor(elementToRender('purchase-spot-submit'));

            expect(screen.queryByTestId('purchase-spot-email-error')).toHaveTextContent(
                /Required/i
            );
            expect(screen.queryByTestId('purchase-spot-phone-error')).toHaveTextContent(
                /Required/i
            );

            fireEvent.change(screen.getByTestId('purchase-spot-email'), {
                target: {value: faker.name.firstName()},
            });

            await waitFor(elementToRender('purchase-spot-email'));

            expect(screen.queryByTestId('purchase-spot-email-error')).toHaveTextContent(
                /valid email/i
            );

            fireEvent.change(screen.getByTestId('purchase-spot-phone'), {
                target: {value: faker.name.jobTitle()},
            });

            await waitFor(elementToRender('purchase-spot-phone'));

            expect(screen.queryByTestId('purchase-spot-phone-error')).toHaveTextContent(
                /valid phone number/i
            );
        });
    });

    describe('when user goes directly to the checkout from URL', () => {
        it('should render no spot found message', () => {
            const mockStore = createStore(
                spotReducer,
                {
                    ...initialState,
                    spot: {selected: null},
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

            expect(queryByTestId('purchase-spot-submit')).not.toBeInTheDocument();
        });
    });
});
