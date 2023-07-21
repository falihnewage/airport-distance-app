import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker, Polyline } from '@react-google-maps/api';
import { Button, TextField, Typography, Container, Box, Grid, Input } from '@mui/material';

interface DistanceCalculatorProps { }

const DistanceCalculator: React.FC<DistanceCalculatorProps> = () => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(
        null
    );
    const [distance, setDistance] = useState<string>('');
    const [render, setRender] = useState<boolean>(false);
    const [Text1, setText1] = useState<string>('');
    const [center, setcenter] = useState<any>({
        lat: 37.0902,
        lng: -95.7129
    });

    const [location1, setLocation1] = useState<any>({
        lat: null,
        lng: null
    })
    const [location2, setLocation2] = useState<any>({
        lat: null,
        lng: null
    })

    const originRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const NewRef = useRef<HTMLInputElement>(null);
    // if (!isLoaded) {
    //   return <SkeletonText />;
    // }

    async function calculateRoute() {
        if (
            inputRef.current?.value === '' ||
            NewRef.current?.value === ''
        ) {
            return;
        }
        console.log(Text1, 'Text1 ref');
       
console.log(inputRef.current?.value,'input Re');
console.log(NewRef.current?.value,'New Re');

        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: inputRef.current?.value!,
            destination: NewRef.current?.value!,
            travelMode: google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(results);
        console.log(results.routes[0].legs[0].distance, 'results');

        setDistance(results.routes[0].legs[0].distance?.text || '');

        await setLocation1({
            lat: results.routes[0].legs[0].end_location.lat(),
            lng: results.routes[0].legs[0].end_location.lng()
        })
        await setLocation2({
            lat: results.routes[0].legs[0].start_location.lat(),
            lng: results.routes[0].legs[0].start_location.lng()
        })
        setRender(true)
        const centerLat = (results.routes[0].legs[0].end_location.lat() + results.routes[0].legs[0].start_location.lat()) / 2;
        const centerLng = (results.routes[0].legs[0].end_location.lng() + results.routes[0].legs[0].start_location.lng()) / 2;
        setcenter({ lat: centerLat, lng: centerLng })
        let distance = calculateDistance(results?.routes[0]?.legs[0]?.end_location?.lat(), results.routes[0].legs[0].end_location.lng(), results.routes[0].legs[0].start_location.lat(), results.routes[0].legs[0].start_location.lng())
        setDistance(distance)
        console.log(results.routes[0].legs[0].end_location.lat(),
            results.routes[0].legs[0].end_location.lng()
            , 'lat');

    }
    const polylineOptions = {
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWeight: 2,
    };
    function calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
        console.log(lat1, lon1, lat2, lon2, 'inside function');
        // Constants
        const R = 6371000; // Earth radius in meters

        // Convert latitude and longitude to radians
        const lat1Radians = lat1 * Math.PI / 180;
        const lon1Radians = lon1 * Math.PI / 180;
        const lat2Radians = lat2 * Math.PI / 180;
        const lon2Radians = lon2 * Math.PI / 180;

        // Calculate the difference in latitude and longitude
        const deltaLat = lat2Radians - lat1Radians;
        const deltaLon = lon2Radians - lon1Radians;

        // Calculate the distance between the two points
        const distance = Math.sqrt(
            Math.pow(deltaLat, 2) + Math.pow(Math.sin(deltaLon), 2) * Math.cos(lat1Radians) * Math.cos(lat2Radians)
        );

        return (distance * R / 1852).toFixed(2);;
    }

    const mapContainerStyle = {
        width: '100%',
        height: '100vh',
    };
    
   

    return (
        <LoadScript googleMapsApiKey="AIzaSyCToFPMUnuzoEEhzMu8pBrNRT2uTzqT9tM" libraries={['places']}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {/* Full-screen map */}
                    <div style={mapContainerStyle}>
                        <GoogleMap
                            center={center}
                            zoom={5}
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            options={{
                                zoomControl: false,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                            onLoad={map => setMap(map as google.maps.Map)}
                        >
                            {render &&
                                <div>
                                    <Marker position={location1} />

                                    <Marker position={location2} />
                                </div>

                            }
                            {render &&
                                <div>
                                    <Polyline path={[location1, location2]} options={polylineOptions} />
                                </div>
                            }
                            {/* Position the input fields and button */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 16, // Adjust the top position as needed
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    maxWidth: 300,
                                    width: '90%',
                                    background: '#ffffffcc',
                                    padding: 16,
                                    borderRadius: 4,
                                }}
                            >
                                <Typography variant="h5" align="center" gutterBottom>
                                    Airport Distance Calculator
                                </Typography>
                                {/* <Autocomplete
                                    restrictions={{ country: 'us' }}
                                    types={['airport']}>
                                    
                                    <TextField
                                        label="Airport Code 2"
                                        variant="outlined"
                                        autoComplete='true'
                                        fullWidth
                                        value={originRef.current?.value}
                                        onChange={(e) => setText1(originRef?.current?.value!)}
                                        ref={originRef}
                                        margin="normal"
                                    />
                                </Autocomplete> */}
                                {/* <Autocomplete
                                    restrictions={{ country: 'us' }}
                                    types={['airport']}>
                                    <TextField
                                        label="Airport Code 1"
                                        variant="outlined"
                                        fullWidth
                                        value={destinationRef.current?.value}
                                        //   onChange={(e)=>setText1(e.target?.value)}
                                        ref={destinationRef}
                                        margin="normal"
                                    />



                                </Autocomplete> */}
                                 <div className="input-container">
                                <Autocomplete
                                    restrictions={{ country: 'us' }}
                                    types={['airport']}>
                                    {/* <Input type='text' placeholder='Origin' ref={originRef} /> */}
                                    {/* <Input type='text' placeholder='Origin' ref={originRef} /> */}
                                    <input type="text" className="bigger-input" ref={NewRef} />
                                    

                                </Autocomplete>
                                </div>
                                <div className="input-container">
                                <Autocomplete
                                    restrictions={{ country: 'us' }}
                                    types={['airport']}>
                                    {/* <Input type='text' placeholder='Origin' ref={originRef} /> */}
                                    {/* <Input type='text' placeholder='Origin' ref={originRef} /> */}
                                    <input type="text" className="bigger-input" ref={inputRef} />

                                </Autocomplete>
                                </div>
                                <Button variant="contained" color="primary" fullWidth onClick={calculateRoute}>
                                    Calculate Distance
                                </Button>
                                
                                {distance !== null && (
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Distance: {distance} miles
                                    </Typography>
                                )}
                            </div>
                        </GoogleMap>
                    </div>
                </Grid>
            </Grid>
        </LoadScript>
    );
};

export default DistanceCalculator;
