import React, {Component} from 'react';
import {Button, ToastAndroid, View} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableHighlight,
  Text,
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class SettingsPage extends Component {
  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');

    axios
      .post(
        'http://localhost:3333/api/1.0.0/user/logout',
        {},
        {
          headers: {
            'X-Authorization': token,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show(
            'Successful logout!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          ToastAndroid.show(
            'Need to be logged in first!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          this.props.navigation.navigate('Login');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (responseJson) => {
        console.log('Logged out!');
        AsyncStorage.removeItem('@user_id');
        this.props.navigation.navigate('Login');
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

  render() {
    return (
      <View style={{padding: 100}}>
        <Button title="Logout" onPress={() => this.logout()} />
      </View>
    );
  }
}

export default SettingsPage;
