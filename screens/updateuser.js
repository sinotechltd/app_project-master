import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  TextInput,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class UpdateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      first_name: this.props.route.params.f_name,
      last_name: this.props.route.params.l_name,
      email: this.props.route.params.email_n,
      password: '',
    };
  }
  componentDidMount() {
    this.displayOrigValues();
  }
  displayOrigValues() {
    console.log('Values Loaded from previous screen');
  }
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value === null) {
      Alert.alert('Redirected to login page');
      Alert.alert('You need to be logged in to view this page');
      //  ToastAndroid.show("You need to be logged in to view this page",ToastAndroid.LONG);
      this.props.navigation.navigate('Login');
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

  updateItem = async () => {
    let to_send = {};

    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@user_id');

    to_send.first_name = this.state.first_name;
    to_send.last_name = this.state.last_name;
    to_send.email = parseInt(this.state.email);
    to_send.password = parseInt(this.state.password);

    //  console.log(to_send);

    return axios
      .patch(`http://localhost:3333/api/1.0.0/user/${id}`, this.state, {
        headers: {
          'X-Authorization': value,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log('Details changed');
          this.props.navigation.push('UserInfo');
          ToastAndroid.show('Details Updated!', ToastAndroid.SHORT);
        } else if (response.status === 400) {
          throw new Error('Bad Request');
        } else if (response.status === 401) {
          ToastAndroid.show("You're not logged in!", ToastAndroid.SHORT);
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <TextInput
              placeholder="Enter first name"
              onChangeText={(first_name) => this.setState({first_name})}
              value={this.state.first_name}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Enter last name"
              onChangeText={(last_name) => this.setState({last_name})}
              value={this.state.last_name}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Enter email"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Enter password..."
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              style={styles.inputContainer}
            />
            <View style={styles.buttonContainer}>
              <Button title="Update" onPress={() => this.updateItem()} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#40e0d0',
  },
  buttonContainer: {
    height: 45,
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    margin: 10,
  },
  inputContainer: {
    marginTop: 10,
    padding: 5,
    borderWidth: 2,
    margin: 10,
  },
});

export default UpdateUser;
