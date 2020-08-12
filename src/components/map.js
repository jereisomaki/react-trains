import React,  { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Dialog from './dialog';
import '../styles/map.css';
const axios = require('axios').default;

const Map = () => {
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 65.558460,
        longitude: 26.518965,
        zoom: 4,
        minZoom: 4,
        maxZoom: 16,
    });

    const [trains, setTrains] = useState([]);
    const [singleTrain, setSingleTrain] = useState([]);

    useEffect(() => {
        GetTrains();
    },[])

    // Get all trains
    const GetTrains = async () => {
        const response = await axios.get('https://rata.digitraffic.fi/api/v1/train-locations/latest/')
        const data = response.data;
        setTrains(data);
    }

    // Get single train
    const GetSingleTrain = async (trainNumber) => {
        const response = await axios.get('https://rata.digitraffic.fi/api/v1/trains/latest/' + trainNumber);
        const data = response.data;
        setSingleTrain(data);
        console.log(data);
    }

    const flyTo = (lat, long) => {
        // Zoom to active marker
        setViewport({
            width: "100vw",
            height: "100vh",
            latitude: lat,
            longitude: long,
            zoom: viewport.zoom,
            minZoom: 4,
            maxZoom: 16,
        })  
    }

    return (
        <ReactMapGL
            {...viewport}
            onViewportChange={nextViewport => {
                setViewport(nextViewport)
            }}
            mapboxApiAccessToken='pk.eyJ1IjoiamVybXVzdGFqYSIsImEiOiJja2RyOHJnOGQxY2V6MnF0dmI5Y2lreGV2In0.FZxl8jcfpFySYN2KmP3U0w'
            mapStyle="mapbox://styles/jermustaja/ckdrhr7kh0za819o20lox1mti"
        >
            {trains.map(train => (
                <Marker
                    key={train.trainNumber}
                    latitude={train.location.coordinates[1]}
                    longitude={train.location.coordinates[0]} 
                >
                    <div className={train.speed == 0 ? "marker-stopped" : "marker-moving"} onClick={() => {
                        flyTo(train.location.coordinates[1], train.location.coordinates[0]);   
                        GetSingleTrain(train.trainNumber);                
                    }}>
                        {train.trainNumber}
                    </div>
                </Marker>
            ))}
            <Dialog/>
        </ReactMapGL>
    );
}

export default Map;