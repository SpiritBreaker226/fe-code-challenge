import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {motion, AnimatePresence} from 'framer-motion';

import {push} from 'connected-react-router';

import {fetchSpot} from '../spot/spot-actions';
import SpotList from './spot-list/SpotList';
import SpotDetails from '../spot/SpotDetails';

const Search = ({
    selectedSpot,
    spots,
    setSpot,
    pushTo
}) => {
    return (
        <div className="Search">
            <SpotList
                spots={spots}
                selectedSpot={selectedSpot}
                setSpot={setSpot}
            />
            <div className="Search-content">
                <AnimatePresence>
                    {
                        selectedSpot &&
                            <motion.div
                                key="SpotDetails"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                            >
                                <SpotDetails
                                    selectedSpot={selectedSpot}
                                    setSpot={setSpot}
                                    pushTo={pushTo}
                                />
                            </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div>
    );
};

Search.propTypes = {
    selectedSpot: PropTypes.object,
    spots: PropTypes.arrayOf(PropTypes.object).isRequired,
    setSpot: PropTypes.func.isRequired,
    pushTo: PropTypes.func.isRequired,
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
    setSpot: fetchSpot,
    pushTo: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
