import React from 'react';

import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';

import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import faker from 'faker';

import axios from 'axios';

import createStore, {getHistory} from './store/store';

import {elementToRender} from './helpers/helpers';
import spots from './helpers/test_data_spots.json';

import App from './App';

jest.mock('axios');
const mockedAxios = axios;

describe('Root', () => {
    describe('on buying a spot from search', () => {
        it('should allow user to choose a location then pushase a spot', async () => {
            const email = faker.internet.email();
            const phone = faker.phone.phoneNumber('+18177658269');

            window.history.pushState(
                {spot: {selected: spots[0]}},
                'Spot Checkout page', '/checkout'
            );

            render(
                <Provider store={createStore()}>
                    <ConnectedRouter history={getHistory()}>
                        <App spots={spots} />
                    </ConnectedRouter>
                </Provider>
            );

            await waitFor(elementToRender('spot-item-1'));

            mockedAxios.get.mockResolvedValue({data: spots[0]});

            fireEvent.click(screen.getByTestId('spot-item-details-button-1'));

            await waitFor(elementToRender('spot-details'));

            fireEvent.click(screen.getByTestId('spot-details-purchase'));

            await waitFor(elementToRender('spot-details-purchase'));

            fireEvent.change(screen.getByTestId('purchase-spot-email'), {
                target: {value: email},
            });

            await waitFor(elementToRender('purchase-spot-email'));

            fireEvent.change(screen.getByTestId('phone'), {
                target: {value: phone},
            });

            await waitFor(elementToRender('phone'));

            mockedAxios.post.mockResolvedValueOnce();

            fireEvent.click(screen.getByTestId('purchase-spot-submit'));

            expect(screen.queryByTestId('purchase-spot-submit'))
                .toHaveAttribute('disabled');

            await waitFor(elementToRender('confirmation'));

            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/reservations', {
                    firstName: '',
                    lastName: '',
                    email,
                    phone,
                    spotId: 1,
                }
            );

            expect(screen.getByTestId('confirmation-email')).toHaveTextContent(email);

            expect(screen.queryByTestId('confirmation')).toBeInTheDocument();

            fireEvent.click(screen.getByTestId('confirmation-purchase-again'));

            await waitFor(elementToRender('spot-list-main-title'));

            expect(screen.getByTestId('spot-list-spots-avaliable')).toHaveTextContent(
                /3 Spots/i
            );
        });
    });
});

