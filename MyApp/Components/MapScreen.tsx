import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker, Region} from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import type {ICarouselInstance} from 'react-native-reanimated-carousel';
import axios from 'axios';

const {width} = Dimensions.get('window');

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 50.4501,
    longitude: 30.5234,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef<MapView>(null);
  const carouselRef = useRef<ICarouselInstance>(null);

  const fetchPlaces = async (newRegion: Region) => {
    try {
      const response = await axios.get(
        `https://api.foursquare.com/v3/places/search?ll=${newRegion.latitude},${newRegion.longitude}&radius=1000`,
        {
          headers: {
            Authorization: 'fsq3XTTiMfhYlPGa1Mreu3MIXvSCiQoHqqO1Q62Zj6rK1uo=',
          },
        },
      );

      const fetchedPlaces = response.data.results.map((place: any) => ({
        id: place.fsq_id,
        name: place.name,
        latitude: place.geocodes.main.latitude,
        longitude: place.geocodes.main.longitude,
      }));

      setPlaces(fetchedPlaces);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    console.log(222222222222);
    setRegion(newRegion);
    fetchPlaces(newRegion);
  };

  const focusOnMarker = (index: number) => {
    const selectedPlace = places[index];
    mapRef.current?.animateToRegion({
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    fetchPlaces(region);
  }, []);
  console.log(33333333);

  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>333333333</Text>
      <View>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={onRegionChangeComplete}>
          {places.map((place, index) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              onPress={() => carouselRef.current?.scrollTo({index})}
            />
          ))}
        </MapView>
      </View>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          data={places}
          width={width}
          height={100}
          loop={false}
          renderItem={({item, index}) => (
            <View style={styles.carouselItem}>
              <Text style={styles.title}>{item.name}</Text>
            </View>
          )}
          onSnapToItem={focusOnMarker}
        />
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1, backgroundColor: '#fff'},
  carouselContainer: {
    position: 'absolute',
    bottom: 20,
  },
  carouselItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
