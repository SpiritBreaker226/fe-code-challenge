import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {push} from 'connected-react-router';

import Button from '../common/Button';
import TextButton from '../common/TextButton';

import SpotItem from '../spot/SpotItem';

const Checkout = ({selectedSpot, pushTo}) => {
    const onPurchaseClick = () => pushTo('/confirmation');
    const isSpotSelected = (selectedSpot && Object.entries(selectedSpot).length > 0);

    return (
        <section className="checkout">
            <header>
                <nav className="checkout-nav">
                    <TextButton>Back to Search</TextButton>
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
                    <Button
                        data-testid="purchase-spot"
                        color="secondary"
                        onClick={onPurchaseClick}
                    >
                        Purchase for $14.00
                    </Button>
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
};

Checkout.propTypes = {
    pushTo: PropTypes.func.isRequired,
    selectedSpot: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
