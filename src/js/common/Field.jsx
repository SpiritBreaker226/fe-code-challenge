import React from 'react';
import PropTypes from 'prop-types';
import {useField} from 'formik';
import classNames from 'classnames';

const Field = ({
    label,
    dataTestid,
    ...props
}) => {
    const [field, meta] = useField(props);
    const hasError = meta.touched && meta.error;

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
                <label htmlFor={props.id || props.name}>{label}</label>
            </div>
            <input
                data-testid={`${dataTestid}`}
                className={
                    classNames({
                        'text-input': true,
                        'text-input-error': hasError,
                    })
                }
                {...field}
                {...props}
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
                        {meta.error}
                    </div>
                ) : null
            }
        </>
    );
};

Field.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    dataTestid: PropTypes.string
};

Field.defaultProps = {
    dataTestid: 'field'
};

export default Field;
