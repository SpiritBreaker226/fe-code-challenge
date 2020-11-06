import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {Formik, Form} from 'formik';
import * as Yup from 'yup';

import axios from 'axios';

import {push} from 'connected-react-router';

import Button from '../common/Button';
import Field from '../common/Field';
import TextButton from '../common/TextButton';

import SpotItem from '../spot/SpotItem';

import {purchase} from './checkout-actions';

const Checkout = ({selectedSpot, pushTo, onCheckout}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const isSpotSelected = (selectedSpot && Object.entries(selectedSpot).length > 0);
    const onBackToSearchClick = () => {
        pushTo('/');
    };

    return (
        <section className="Checkout">
            <header className="checkout-header">
                <nav className="checkout-nav checkout-content">
                    <TextButton
                        className="checkout-nav-button"
                        onClick={onBackToSearchClick}
                    >
                        &lt; Back to Search
                    </TextButton>
                </nav>

                {
                    isSpotSelected &&
                        <div className="checkout-content">
                            <SpotItem
                                data={selectedSpot}
                                isSelected={false}
                                showDetails={false}
                            />
                        </div>
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
                        onSubmit={async values => {
                            try {
                                await axios.post('/reservations', {
                                    ...values,
                                    spotId: selectedSpot.id
                                });

                                onCheckout(values);
                                pushTo('/confirmation');
                            } catch (error) {
                                setErrorMessage(error.message);
                            }
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className="form checkout-content">
                                {
                                    errorMessage &&
                                    <div
                                        data-testid="purchase-spot-form-error"
                                        className="error"
                                    >
                                        {errorMessage}
                                    </div>
                                }

                                <Field
                                    name="firstName"
                                    type="text"
                                    label="First Name"
                                />

                                <Field
                                    name="lastName"
                                    type="text"
                                    label="Last Name"
                                />

                                <Field
                                    dataTestid="purchase-spot-email"
                                    name="email"
                                    type="email"
                                    label="Email"
                                />

                                <Field
                                    dataTestid="purchase-spot-phone"
                                    name="phone"
                                    type="phone"
                                    label="Phone"
                                />

                                <div className="submit-containter">
                                    <Button
                                        data-testid="purchase-spot-submit"
                                        color="secondary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Purchase for
                                        ${(selectedSpot.price / 100).toFixed(2)}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    :
                    <div className="select-a-spot">
                        Select a Spot by going back to Search
                    </div>
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
