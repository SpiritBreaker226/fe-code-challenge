import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {useFormik} from 'formik';

import {push} from 'connected-react-router';

import Button from '../common/Button';
import TextButton from '../common/TextButton';

import SpotItem from '../spot/SpotItem';

import {purchase} from './checkout-actions';

const validate = values => {
    const errors = {};

    if (!values.phone) {
        errors.phone = 'Phone is Required';
    } else if (!/^[0-9]{10}$/i.test(values.phone)) {
        errors.phone = 'Please enter a valid phone number.';
    }

    if (!values.email) {
        errors.email = 'Email is Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Please enter a valid email.';
    }

    return errors;
};

const Checkout = ({selectedSpot, pushTo, onCheckout}) => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        validate,
        onSubmit: values => {
            onCheckout(values);
            pushTo('/confirmation');
        },
    });
    const onFieldAction = type => (
        (type === 'submit') ? formik.handleSubmit : formik.handleChange
    );
    const isSpotSelected = (selectedSpot && Object.entries(selectedSpot).length > 0);
    const onBackToSearchClick = () => {
        pushTo('/');
    };

    return (
        <section className="checkout">
            <header>
                <nav className="checkout-nav">
                    <TextButton onClick={onBackToSearchClick}>Back to Search</TextButton>
                </nav>

                {
                    isSpotSelected &&
                        <SpotItem
                            data={selectedSpot}
                            isSelected={false}
                            showDetails={false}
                        />
                }
            </header>

            {
                isSpotSelected ?
                    <form onSubmit={onFieldAction('submit')}>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            onChange={onFieldAction('field')}
                            value={formik.values.firstName}
                        />
                        {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            onChange={onFieldAction('field')}
                            value={formik.values.lastName}
                        />
                        {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            data-testid="purchase-spot-email"
                            onChange={onFieldAction('field')}
                            value={formik.values.email}
                        />
                        {formik.errors.email ? <div data-testid="purchase-spot-email-error">{formik.errors.email}</div> : null}
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            data-testid="purchase-spot-phone"
                            onChange={onFieldAction('field')}
                            value={formik.values.phone}
                        />
                        {formik.errors.phone ? <div data-testid="purchase-spot-phone-error">{formik.errors.phone}</div> : null}
                        <Button
                            data-testid="purchase-spot-submit"
                            color="secondary"
                            type="submit"
                        >
                            Purchase for ${(selectedSpot.price / 100).toFixed(2)}
                        </Button>
                    </form>
                    :
                    <span>Select a Spot by going back to Search</span>
            }
        </section>
    );
};

const mapStateToProps = state => {
    const {
        spot: {
            selected: selectedSpot
        }
    } = state;

    return {
        selectedSpot
    };
};

const mapDispatchToProps = {
    pushTo: push,
    onCheckout: purchase,
};

Checkout.propTypes = {
    onCheckout: PropTypes.func.isRequired,
    pushTo: PropTypes.func.isRequired,
    selectedSpot: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
