import React, {Component} from 'react';
import {
  Text,
  Button,
  ToastAndroid,
  TouchableWithoutFeedbackBase,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RNCamera} from 'react-native-camera';
//import styles from '../styleSheets/customStyles';
import Filter from 'bad-words';
import axios from 'axios';

class UpdReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overall_rating: this.props.route.params.overall_rating,
      price_rating: this.props.route.params.overall_rating,
      quality_rating: this.props.route.params.quality_rating,
      clenliness_rating: this.props.route.params.clenliness_rating,
      review_body: this.props.route.params.review_body,

      o_rating: this.props.route.params.overall_rating,
      p_rating: this.props.route.params.price_rating,
      q_rating: this.props.route.params.quality_rating,
      c_rating: this.props.route.params.clenliness_rating,
      r_body: this.props.route.params.review_body,
    };
  }
  componentDidMount() {
    this.displayOrigValues();
  }
  displayOrigValues() {
    /*
    const o = this.props.route.params.overall_rating;
    o_rating = o;
    p_rating = this.props.route.params.price_rating;
    c_rating = this.props.route.params.clenliness_rating
    q_rating = this.props.route.params.quality_rating;
    r_body = this.props.route.params.review_body;
    */
    console.log('Values Loaded from previous screen');
  }
  UpdateReview = async () => {
    let to_send = {};
    //tokens to pass into url
    const loc_id = this.props.route.params.location_id;
    const rev_id = this.props.route.params.review_id;
    const value = await AsyncStorage.getItem('@session_token');

    const filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries', 'cake', 'pastry');

    to_send.overall_rating = parseInt(this.state.overall_rating);
    to_send.price_rating = parseInt(this.state.price_rating);
    to_send.quality_rating = parseInt(this.state.quality_rating);
    to_send.clenliness_rating = parseInt(this.state.clenliness_rating);
    to_send.review_body = filter.clean(this.state.review_body);

    console.log(filter.clean(this.state.review_body));

    return axios
      .patch(
        `http://localhost:3333/api/1.0.0/location/${loc_id}/review/${rev_id}`,
        to_send,
        {
          headers: {
            'X-Authorization': value,
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          console.log('Review updated!');
          this.props.navigation.push('UserInfo');
          ToastAndroid.show('Review updated', ToastAndroid.SHORT);
        } else if (response.status === 400) {
          throw new Error('Failed Validation');
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
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={{padding: 5}}>Update Review Details:</Text>
            <TextInput
              keyboardType="numeric"
              onChangeText={(overall_rating) => this.setState({overall_rating})}
              defaultValue={this.state.overall_rating.toString()}
              style={styles.inputContainer}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Price Rating"
              onChangeText={(price_rating) => this.setState({price_rating})}
              defaultValue={this.state.price_rating.toString()}
              style={styles.inputContainer}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Clenliness Rating"
              onChangeText={(clenliness_rating) =>
                this.setState({clenliness_rating})
              }
              defaultValue={this.state.clenliness_rating.toString()}
              style={styles.inputContainer}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Quality Rating"
              onChangeText={(quality_rating) => this.setState({quality_rating})}
              defaultValue={this.state.quality_rating.toString()}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Review "
              onChangeText={(review_body) => this.setState({review_body})}
              defaultValue={this.state.review_body}
              style={styles.inputContainer}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Update Review"
                onPress={() => this.UpdateReview()}
              />
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

export default UpdReview;
