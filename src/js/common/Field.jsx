import React from 'react';
import PropTypes from 'prop-types';
import {useField} from 'formik';

const Field = ({
    label,
    dataTestid,
    ...props
}) => {
    const [field, meta] = useField(props);

    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input
                data-testid={`${dataTestid}`}
                className="text-input"
                {...field}
                {...props}
            />
            {
                meta.touched && meta.error ? (
                    <div
                        data-testid={`${dataTestid}-error`}
                        className="error"
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
