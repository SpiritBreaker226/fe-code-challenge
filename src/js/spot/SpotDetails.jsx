import React from 'react';
import PropTypes from 'prop-types';

import TextButton from '../common/TextButton';
import Button from '../common/Button';

const SpotDetails = ({selectedSpot, setSpot, pushTo}) => {
    const onClickPurchase = () => pushTo('/checkout');
    const onClickClose = () => setSpot(null);

    return (
        <section
            className="SpotDetails"
            key="SpotDetails"
            test-testid="spot-details"
        >
            <header>
                <div className="SpotDetails-nav">
                    <TextButton
                        className="SpotDetails-close-button"
                        data-testid="spot-details-close"
                        onClick={onClickClose}
                    >
                        X
                    </TextButton>
                </div>

                <h2 className="SpotDetails-main-title">Spot Details</h2>
            </header>

            {
                selectedSpot.error ?
                    <div className="SpotDetails-error">
                        {selectedSpot.error}
                    </div>
                    :
                    <>
                        <div className="SpotDetails-description">
                            <h3 data-testid="spot-details-title">{selectedSpot.title}</h3>

                            {selectedSpot.description}
                        </div>

                        <div className="SpotDetails-purchase-button-containter">
                            <Button
                                data-testid="spot-details-purchase"
                                color="primary"
                                onClick={onClickPurchase}
                            >
                                {selectedSpot.price} | Book It!
                            </Button>
                        </div>
                    </>
            }

        </section>
    );
};

SpotDetails.propTypes = {
    selectedSpot: PropTypes.object,
    pushTo: PropTypes.func.isRequired,
    setSpot: PropTypes.func.isRequired,
};

export default SpotDetails;
