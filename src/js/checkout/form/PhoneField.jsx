import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import PhoneInput from 'react-phone-number-input/input';

import {getIn} from 'formik';

import 'react-phone-number-input/style.css';

const PhoneInputField = ({
    field: {name, value},
    form: {
        errors, handleBlur, setFieldValue, touched,
    },
    label,
    country,
    onChange,
    dataTestid,
}) => {
    const hasError = getIn(touched, name) && getIn(errors, name);
    const handleInputBlur = e => handleBlur(e);
    const onValueChange = phoneNumber => {
        setFieldValue(name, phoneNumber);

        if (onChange !== null) {
            onChange(phoneNumber);
        }
    };

    return (
        <>
            <div
                className={
                    classNames(
                        'field-label',
                        {error: hasError},
                    )
                }
            >
                <label htmlFor={name}>{label}</label>
            </div>
            <PhoneInput
                data-testid={dataTestid}
                name={name}
                value={value}
                country={country}
                onChange={onValueChange}
                onBlur={handleInputBlur}
                className={
                    classNames({
                        'text-input': true,
                        'text-input-error': hasError,
                    })
                }
            />
            {
                hasError ? (
                    <div
                        data-testid={`${dataTestid}-error`}
                        className={
                            classNames({
                                'error-text-container': true,
                                error: hasError
                            })}
                    >
                        {getIn(errors, name)}
                    </div>
                ) : null
            }
        </>
    );
};

PhoneInputField.propTypes = {
    field: PropTypes.any.isRequired,
    form: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    label: PropTypes.string,
    country: PropTypes.string,
    dataTestid: PropTypes.string,
};

PhoneInputField.defaultProps = {
    label: '',
    onChange: null,
    country: 'US',
    dataTestid: 'phone',
};

export default PhoneInputField;
