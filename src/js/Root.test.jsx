import React from 'react';

import {render, screen, waitFor} from '@testing-library/react';

import axios from 'axios';

import {elementToRender} from './helpers/helpers';
import spots from './helpers/test_data_spots.json';

import Root from './Root';

jest.mock('axios');
const mockedAxios = axios;

describe('Root', () => {
    describe('on buying a spot from search', () => {
        it('renders Root component', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: spots});

            render(<Root />);

            await waitFor(elementToRender('spot-item-1'));

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith('/spots');
        });
    });

    describe('when loading the page', () => {
        it('should render the loading text', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: []});

            render(<Root />);

            expect(screen.getByText('Loading', {exact: false})).toBeInTheDocument();
            expect(screen.getByText('Loading', {exact: false})).toMatchSnapshot();
            expect(screen.queryByTestId('data-testid')).not.toBeInTheDocument();
        });
    });
});

