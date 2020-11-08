import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {Provider} from 'react-redux';

import axios from 'axios';

import {elementToRender} from '../helpers/helpers';

import spots from '../helpers/test_data_spots.json';

import createStore from '../store/store';

import Search from './Search';

jest.mock('axios');
const mockedAxios = axios;

describe('Search', () => {
    beforeEach(async () => {
        const mockStore = createStore(
            {
                spot: {
                    selected: null
                },
            },
        );

        render(
            <Provider store={mockStore}>
                <Search spots={spots} />
            </Provider>
        );

        await waitFor(() => screen.getByTestId('spot-item-1'));
    });

    it('renders Search component', () => {
        expect(screen.getByTestId('search')).toMatchSnapshot();
    });

    describe('on spot details', () => {
        it('render different Spot Details when clicking Details', async () => {
            mockedAxios.get.mockResolvedValue({data: spots[0]});

            fireEvent.click(screen.getByTestId('spot-item-details-button-1'));

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith('/spots/1');

            await waitFor(elementToRender('spot-details'));

            expect(screen.getByTestId('spot-details-title')).toHaveTextContent(
                /Seven Lions/i
            );
            expect(screen.getByTestId('spot-details-purchase')).toHaveTextContent(
                /14.00/i
            );

            mockedAxios.get.mockResolvedValue({data: spots[1]});

            fireEvent.click(screen.getByTestId('spot-item-details-button-2'));

            expect(mockedAxios.get).toHaveBeenCalledWith('/spots/2');

            await waitFor(elementToRender('spot-details'));

            expect(screen.getByTestId('spot-details-title')).toHaveTextContent(
                /Garage/i
            );
            expect(screen.getByTestId('spot-details-purchase')).toHaveTextContent(
                /16.50/i
            );

            fireEvent.click(screen.getByTestId('spot-details-close'));

            expect(screen.queryByTestId('spot-details')).not.toBeInTheDocument();
        });
    });
});
