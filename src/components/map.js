import React,  { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Dialog from './dialog';
import { trainsApiUrl } from '../config/api';
import { singleTrainApiUrl } from '../config/api';
import '../styles/map.css';
const axios = require('axios').default;

const Map = (props) => {
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
        // Update train locations every 5 seconds
        const interval = setInterval(() => {
            GetTrains();
        }, 5000);
        return () => clearInterval(interval);
    },[])

    useEffect(() => {
        if(props.searchID != null){
            SearchTrain();
            props.setSearchID(null)
        }
    }, [props.searchID])

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

    // Zoom to active marker
    const flyTo = (lat, long, zoom) => {
        setViewport({
            width: viewport.width,
            height: viewport.height,
            latitude: lat,
            longitude: long,
            zoom: zoom,
            minZoom: viewport.minZoom,
            maxZoom: viewport.maxZoom,
        })  
    }

    // Search train
    const SearchTrain = () => {
        console.log("search: " + props.searchID)

        {trains.map(train => (
            // Check if search is equal to train number
            train.trainNumber == props.searchID ? flyTo(train.location.coordinates[1], train.location.coordinates[0], 10) : null
        ))}
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
                        flyTo(train.location.coordinates[1], train.location.coordinates[0], viewport.zoom);   
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