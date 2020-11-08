import React from 'react';
import {render} from '@testing-library/react';

import faker from 'faker';

import SpotDetails from './SpotDetails';

describe('SpotDetails', () => {
    it('should render as expeected', async () => {
        const title = faker.lorem.lines(1);
        const selectedSpot = {
            id: faker.random.number(9),
            title,
            price: faker.random.number(9999),
            description: faker.lorem.paragraph(1),
            distance: `${faker.random.number(999)} ft`,
            image: faker.image.city()
        };

        const {getByTestId} = render(
            <SpotDetails
                selectedSpot={selectedSpot}
                setSpot={jest.fn()}
                pushTo={jest.fn()}
            />
        );

        expect(getByTestId('spot-details-title')).toHaveTextContent(title);
    });
});
