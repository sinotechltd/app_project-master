import React, { Component } from 'react';
import { View, Text, Button, Alert, TextInput, ToastAndroid, ActivityIndicator, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from 'axios';

class SearchData extends Component {
  constructor(props) {
    super(props);


    this.state = {
      isLoading: true,
      locations: null,
      q: '',
      limit:'',
      quality: '',
      clenliness:'',
      overall_rating: 0,
      price_rating: '',
    };

  }
  componentDidMount() {
    this.checkLoggedIn();
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      ToastAndroid.show('Need to be logged in first!', ToastAndroid.SHORT, ToastAndroid.CENTER);
      // this.props.navigation.navigate('Login');
    } else {
      this.getData('http://localhost:3333/api/1.0.0/find');
    }
  };
  
  getData = async (url) => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@user_id');
    // console.log(id);
  
    axios.get(url, {
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
          locations: responseJson,
        });
        // this.props.navigation.navigate('DisplaySearch', { searchResults: this.state.locations });
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
      });
  };
  
  search = () => {
    let url = 'http://localhost:3333/api/1.0.0/find?';
    /*
      console.log(this.state.q);
      console.log(this.state.overall_rating);
      console.log(this.state.price_rating);
      console.log(this.state.limit);
    */
    if (this.state.q !== '') {
      url += 'q=' + this.state.q + '&';
    }
    if (this.state.overall_rating > 0) {
      url += 'overall_rating=' + this.state.overall_rating + '&';
    }
    if (this.state.price_rating !== '' && this.state.price_rating > 0 && this.state.price_rating <= 5) {
      url += 'price_rating=' + this.state.price_rating + '&';
    }
    if (this.state.quality !== '' && this.state.quality > 0 && this.state.quality <= 5) {
      url += 'quality_rating=' + this.state.quality + '&';
    }
    if (this.state.clenliness > 0) {
      url += 'clenliness_rating=' + this.state.clenliness + '&';
    }
    if (this.state.limit !== '' && this.state.limit > 0 && this.state.limit <= 100) {
      url += 'limit=' + this.state.limit + '&';
    }
  
    this.getData(url);
  };
  
  ratingCompleted = (rating, name) => {
    let statedObject = {};
    statedObject[name] = rating;
    this.setState(statedObject);
  };
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textView}>
          <Text>Search: </Text>
        <TextInput
          value={this.state.q}
          onChangeText={(q => this.setState({ q: q }))}
        />
        <Text>Limit:</Text>
         <TextInput
          value={this.state.limit}
          onChangeText={(limit => this.setState({ limit: limit }))}
        />
        <Text>Price Rating</Text>
         <TextInput
          value={this.state.price_rating}
          onChangeText={(price_rating => this.setState({ price_rating: price_rating }))}
        />
        </View>
        <View style={styles.textView}>
  <Text>Clenliness Rating</Text>
         <TextInput
          value={this.state.clenliness}
          onChangeText={(clenliness => this.setState({ clenliness: clenliness }))}
        />   
        <Text>Quality Rating</Text>
         <TextInput
          value={this.state.quality}
          onChangeText={(quality => this.setState({ quality: quality }))}
        />
        </View>
          <Text>Overall Rating</Text>
        <AirbnbRating
          size={10}
          defaultRating={0}
          onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
        />
      

        <Button
          title="Search"
          onPress={() => { this.search() }}
        />

        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={this.state.locations}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item.location_town}</Text>
              <Text>{item.location_name}</Text>
              <Text>Overall Rating: {item.avg_overall_rating}</Text>
              <Text>Price: {item.avg_price_rating}</Text>
              <Text>Quality: {item.avg_quality_rating}</Text>
              <Text>Clenliness: {item.avg_clenliness_rating}</Text>
            </View>
          )}
          keyExtractor={(item, index) => item.location_id.toString()}
        />
      </View>


    );
  };

};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cd5c5c',
    padding: 10,
    
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    
  }
});

export default SearchData;