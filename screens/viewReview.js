import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class ViewReview extends Component {
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
    const loc_id = this.props.route.params.location_id;

    //

    return axios
      .get(`http://localhost:3333/api/1.0.0/location/${loc_id}`, {
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
        this.setState({
          isLoading: false,
          locationData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      });
  };

  likeReview = async (loc_id, rev_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        loc_id +
        '/review/' +
        rev_id +
        '/like',
      {
        method: 'post',
        headers: {
          'X-Authorization': value,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          //console.log(response);
        } else if (response.status === 404) {
          //console.log(response);
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async () => {
        console.log('Review Liked');
        this.getInfo();
        ToastAndroid.show('Review Liked', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show('error', ToastAndroid.SHORT);
      });
  };
  unlikeReview = async (loc_id, rev_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        loc_id +
        '/review/' +
        rev_id +
        '/like',
      {
        method: 'delete',
        headers: {
          'X-Authorization': value,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
        } else if (response.status === 404) {
          //console.log(response);
        } else {
          throw 'Something went wrong';
        }
      })
      .then(async () => {
        console.log('Unliked Review');
        this.getInfo();
        ToastAndroid.show('Unliked Review', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show('error', ToastAndroid.SHORT);
      });
  };
  render() {
    // data  = this.state.locationData;
    const loc_id = this.props.route.params.location_id;
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            data={this.state.locationData.location_reviews}
            renderItem={({item}) => (
              <View style={{padding: 20}}>
                <Text>{item.review_body}</Text>
                <Text>Overall Rating: {item.overall_rating}</Text>
                <Text>Price Rating: {item.price_rating}</Text>
                <Text>Quality: {item.quality_rating}</Text>
                <Text>clenliness: {item.clenliness_rating}</Text>
                <Text>Likes: {item.likes}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Like"
                    onPress={() => this.likeReview(loc_id, item.review_id)}
                  />
                  <Button
                    title="unLike"
                    onPress={() => this.unlikeReview(loc_id, item.review_id)}
                  />
                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.review_id.toString()}
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
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    margin: 10,
  },
});
export default ViewReview;
