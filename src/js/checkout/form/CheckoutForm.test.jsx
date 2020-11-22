import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';

import faker from 'faker';

import axios from 'axios';

import {elementToRender} from '../../helpers/helpers';

import spot from '../../spot/spot-reducer';
import checkout from '../checkout-reducer';

import CheckoutForm from './CheckoutForm';

jest.mock('axios');
const mockedAxios = axios;

describe('CheckoutForm', () => {
    let mockStore = null;

    beforeEach(() => {
        mockStore = createStore(
            combineReducers({spot, checkout}),
            {
                spot: {
                    selected: {
                        id: 1,
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
        expect(screen.queryByTestId('phone-error')).toHaveTextContent(
            /Required/i
        );

        fireEvent.change(screen.getByTestId('purchase-spot-email'), {
            target: {value: faker.name.firstName()},
        });

        await waitFor(elementToRender('purchase-spot-email'));

        expect(screen.queryByTestId('purchase-spot-email-error')).toHaveTextContent(
            /valid email/i
        );

        fireEvent.change(screen.getByTestId('phone'), {
            target: {value: faker.random.number(14).toString()},
        });

        await waitFor(elementToRender('phone'));

        expect(screen.queryByTestId('phone-error')).toHaveTextContent(
            /valid phone number/i
        );
    });

    describe('when there is an error on submition', () => {
        it('should render error message in the form', async () => {
            const email = faker.internet.email();
            const phone = faker.phone.phoneNumber('+18177658269');

            fireEvent.change(screen.getByTestId('purchase-spot-email'), {
                target: {value: email},
            });

            await waitFor(elementToRender('purchase-spot-email'));

            fireEvent.change(screen.getByTestId('phone'), {
                target: {value: phone},
            });

            await waitFor(elementToRender('phone'));

            mockedAxios.post.mockRejectedValue(
                new Error('Unable to purchase spot')
            );

            expect(screen.queryByTestId('purchase-spot-form-error'))
                .not
                .toBeInTheDocument();

            fireEvent.click(screen.getByTestId('purchase-spot-submit'));

            await waitFor(elementToRender('purchase-spot-submit'));

            expect(
                screen.getByText('Unable to purchase spot', {exact: false})
            ).toBeInTheDocument();
        });
    });
});
