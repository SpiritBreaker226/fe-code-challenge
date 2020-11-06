import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';

import faker from 'faker';

import spot from '../../spot/spot-reducer';
import checkout from '../checkout-reducer';

import CheckoutForm from './CheckoutForm';

describe('CheckoutForm', () => {
    const elementToRender = testId => {
        return () => screen.getByTestId(testId);
    };

    let mockStore = null;

    beforeEach(() => {
        mockStore = createStore(
            combineReducers({spot, checkout}),
            {
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
                <CheckoutForm />
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
