import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {push} from 'connected-react-router';
import TextButton from '../common/TextButton';

import SpotItem from '../spot/SpotItem';

import CheckoutForm from './form/CheckoutForm';

const Checkout = ({selectedSpot, pushTo}) => {
    const isSpotSelected = (
        selectedSpot && Object.entries(selectedSpot).length > 0
    );
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
                    <CheckoutForm />
                    :
                    <div
                        className="select-a-spot"
                        data-testid="purchase-spot-select-spot"
                    >
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
};

Checkout.propTypes = {
    pushTo: PropTypes.func.isRequired,
    selectedSpot: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
