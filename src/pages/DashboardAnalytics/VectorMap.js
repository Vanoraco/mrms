import PropTypes from 'prop-types';
import React, { useRef } from "react";
import { VectorMap } from "react-jvectormap";
import "./jquery-jvectormap.scss";

const Vectormap = props => {
    const mapRef = useRef(null);
    
    return (
        <div style={{ width: props.width, height: 350 }}>
            <VectorMap
                map={props.value}
                zoomOnScroll={false}
                zoomButtons={false}        
                backgroundColor="transparent"
                ref={mapRef}
                containerStyle={{
                    width: "100%",
                    height: "80%",
                }}
                regionStyle={{
                    initial: {
                        stroke: "#9599ad",
                        strokeWidth: 0.25,
                        fill: "#f3f6f9",
                        fillOpacity: 1,
                    },
                }}
                lineStyle={{
                    animation: true,
                    strokeDasharray: "6 3 6",
                }}
            // containerClassName="map"
            />
        </div>
    );
};

Vectormap.propTypes = {
    color: PropTypes.string,
    value: PropTypes.any,
    width: PropTypes.any
};

export default Vectormap;
