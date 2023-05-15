import React, { Component } from 'react';
import { View, Text, Button, Alert, TextInput, ToastAndroid, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class LocationInfo extends Component {
  constructor(props) {
    super(props);


    this.state = {
      locationData: [],
      isLoading: true,
    };

  }
  componentDidMount() {
    this.getInfo();
  }
  getInfo = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@user_id');
    // console.log(id);
  
    axios.get('http://localhost:3333/api/1.0.0/find', {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          isLoading: false,
          locationData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
      });
  };
  
  favLocation = async (loc_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    axios.post(`http://localhost:3333/api/1.0.0/location/${loc_id}/favourite`, null, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // console.log(response);
        } else if (response.status === 404) {
          // console.log(response);
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async () => {
        console.log('Location Favourited');
        // this.getInfo();
        ToastAndroid.show('Location Added to Favourites', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show('Error', ToastAndroid.SHORT);
      });
  };
  
  render() {
    //let data  = this.state.locationData;

    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Welcome to the Coffida App!</Text>
        <Text style={styles.titleText}>Below you can view the best Cafe's around!</Text>
        <Text style={styles.titleText}>Hope you enjoy :))</Text>

        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.locationData}
            renderItem={({ item }) => (
              <View>
                <View style={{ padding: 20 }}>
                  <Text>Town: {item.location_town}</Text>
                  <Text>Name of Cafe: {item.location_name}</Text>
                  <Text>Overall Rating: {item.avg_overall_rating}</Text>
                  <Text>Overall Rating: {item.avg_overall_rating}</Text>
                  <Text>Price Rating: {item.avg_price_rating}</Text>
                  <Text>Quality Rating: {item.avg_quality_rating}</Text>
                  <Text>Clenliness Rating: {item.avg_clenliness_rating}</Text>
                </View>

                <Button
                  title="Favourite this Location"
                  onPress={() => this.favLocation(item.location_id)}
                />
                <Button
                  title="View reviews for this Location"
                  onPress={() => this.props.navigation.navigate("ViewReview", { location_id: item.location_id })}
                />
                <Button style={{ padding: 20 }}
                  title="Create new Review"
                  onPress={() => this.props.navigation.navigate("AddReview", { location_id: item.location_id })}
                />
              </View>
            )}
            keyExtractor={(item, index) => item.location_id.toString()}
          />

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bdb76b',
    padding: 10,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 5 
  }
});

export default LocationInfo;



