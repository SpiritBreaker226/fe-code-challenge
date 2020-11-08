import {screen} from '@testing-library/react';

export const elementToRender = testId => () => screen.queryByTestId(testId);
