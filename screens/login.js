import React, { Component } from 'react';
import { Button, ToastAndroid, View, StyleSheet } from 'react-native';
import { ScrollView, TextInput, TouchableHighlight, Text } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import styles from '../styleSheets/customStyles';
import axios from 'axios';



class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    }


  }
  login = async () => {
    // Validation Here
    axios.post('http://localhost:3333/api/1.0.0/user/login', this.state, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else if (response.status === 400) {
          throw new Error('Incorrect email or password');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (responseJson) => {
        console.log('Signed in!', responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id', JSON.stringify(responseJson.id));
        await AsyncStorage.setItem('@user_info', JSON.stringify(responseJson));
        // convert back to integer when pulling id out
        this.props.navigation.navigate('LocationInfo');
        ToastAndroid.show('Logged in successfully!', ToastAndroid.SHORT, ToastAndroid.CENTER);
      })
      .catch((error) => {
        console.log(error);
        alert('Invalid data, try again!');
        // ToastAndroid.show('Error', ToastAndroid.SHORT);
      });
  };
  
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter your email"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Enter your password"
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          style={styles.inputContainer}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => this.login()}
          />
          <Button
            title="Don't Have an Account?"
            onPress={() => this.props.navigation.navigate('Sign Up')}
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
    backgroundColor: '#6495ed',

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
  inputContainer: {
    padding: 5,
    borderWidth: 2,
    margin: 10
  }
});

export default Login;
