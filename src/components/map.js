import React,  { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Dialog from './dialog';
import { trainsApiUrl } from '../config/api';
import { singleTrainApiUrl } from '../config/api';
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
        const interval = setInterval(() => {
            GetTrains();
        }, 5000);
        return () => clearInterval(interval);
    },[])

    // Get all trains
    const GetTrains = async () => {
        try {
            const response = await axios.get(`${trainsApiUrl}`)
            const data = response.data;
            setTrains(data);
        } catch(error) {
            console.log(error);
        }
    }

    // Get single train
    const GetSingleTrain = async (trainNumber) => {
        try {
            const response = await axios.get(`${singleTrainApiUrl}` + trainNumber);
            const data = response.data;
            setSingleTrain(data);
            console.log(data);
        } catch(error) {
            console.log(error);
        }
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
            mapStyle="mapbox://styles/jermustaja/ckdrw4pw50drj1artc957rf54"
        >
            {trains.map(train => (
                <Marker
                    key={train.trainNumber}
                    latitude={train.location.coordinates[1]}
                    longitude={train.location.coordinates[0]} 
                    offsetLeft={-20}
                    offsetTop={-10}
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