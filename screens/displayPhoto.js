import React, {Component} from 'react';
import {
  Image,
  ToastAndroid,
  Alert,
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RNCamera} from 'react-native-camera';
//import styles from '../styleSheets/customStyles';

class DisplayPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      photoInfo: undefined || null || '',
      photoData: [],
      photo_url: '',
    };
  }
  getPhoto = () => {
    const rev_id = this.props.route.params.review_id;
    const loc_id = this.props.route.params.location_id;

    axios
      .get(
        `http://localhost:3333/api/1.0.0/location/${loc_id}/review/${rev_id}/photo`,
      )
      .then((response) => {
        if (response.status === 200) {
          // Handle successful response
        } else if (response.status === 404) {
          console.log(response);
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        // Handle the response data here
        // this.setState({
        //   photoData: responseJson,
        // });
        // console.log(responseJson);
        // this.props.navigation.navigate("DisplayPhoto", { photo_url: this.state.photoInfo });
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show('Error', ToastAndroid.SHORT);
      });
  };

  render() {
    const rev_id = this.props.route.params.review_id;
    const loc_id = this.props.route.params.location_id;
    return (
      <View style={styles.container}>
        <Image
          style={{height: 600, width: 400, resizeMode: 'center'}}
          source={{uri: this.state.photoData}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#40e0d0',
    padding: 10,
  },
});

export default DisplayPhoto;
