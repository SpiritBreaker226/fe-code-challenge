import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import {push} from 'connected-react-router';

import Button from '../common/Button';
import TextButton from '../common/TextButton';

import SpotItem from '../spot/SpotItem';

import {purchase} from './checkout-actions';

const Checkout = ({selectedSpot, pushTo, onCheckout}) => {
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
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string().required('Email is required')
                                .email('Please enter a valid email.'),
                            phone: Yup.string()
                                .required('Phone is required')
                                .max(7, 'Please enter a valid phone number.')
                                .max(10, 'Please enter a valid phone number.'),
                        })}
                        onSubmit={values => {
                            onCheckout(values);
                            pushTo('/confirmation');
                        }}
                    >
                        <Form>
                            <label htmlFor="firstName">First Name</label>
                            <Field
                                name="firstName"
                                type="text"
                            />
                            <ErrorMessage name="firstName" />
                            <label htmlFor="lastName">Last Name</label>
                            <Field
                                name="lastName"
                                type="text"
                            />
                            <ErrorMessage name="lastName" />
                            <label htmlFor="email">Email</label>
                            <Field
                                data-testid="purchase-spot-email"
                                name="email"
                                type="email"
                            />
                            <ErrorMessage
                                name="email"
                                data-testid="purchase-spot-email-error"
                            />

                            <label htmlFor="phone">Phone</label>
                            <Field
                                data-testid="purchase-spot-phone"
                                name="phone"
                                type="phone"
                            />
                            <ErrorMessage
                                name="phone"
                                data-testid="purchase-spot-phone-error"
                            />
                            <Button
                                data-testid="purchase-spot-submit"
                                color="secondary"
                                type="submit"
                            >
                                Purchase for ${(selectedSpot.price / 100).toFixed(2)}
                            </Button>
                        </Form>
                    </Formik>
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
