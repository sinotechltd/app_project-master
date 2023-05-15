import React , {Component} from 'react';
import {Button , ToastAndroid,StyleSheet,View} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from 'bad-words';

class ReviewScreen extends Component{
  constructor(props){
    super(props);

    this.state = {
      overall_rating:"",
      price_rating:"",
      quality_rating:"",
      clenliness_rating:"",
      review_body:"",
  }


  }
  addReview = async () => {
    let to_send = {};
    const loc_id = this.props.route.params.location_id;
    const value = await AsyncStorage.getItem('@session_token');

    const filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries','cake','pastry');


    to_send.overall_rating = parseInt(this.state.overall_rating);
    to_send.price_rating = parseInt(this.state.price_rating);   
    to_send.quality_rating = parseInt(this.state.quality_rating);    
    to_send.clenliness_rating = parseInt(this.state.clenliness_rating);
    to_send.review_body = filter.clean(this.state.review_body);

   
    console.log(filter.clean(this.state.review_body));


    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review", {
      method: 'post',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(to_send),
    })
    .then((response) => {
      if(response.status === 201){      
        
      }
       else if (response.status ===400){
     
        throw 'Failed Validation';
      }
      else{
        throw 'Something went wrong';
      }

    })
    .then(async () => {
      console.log("Review created");
      this.props.navigation.push("LocationInfo");
      ToastAndroid.show("Review created", ToastAndroid.SHORT);

    })
    .catch((error) => {
      console.log(error);
      alert("Incorrect Data entry, try again");
      //ToastAndroid.show("error", ToastAndroid.SHORT);
    })
      }
      render(){

       
        return(
            <View style={styles.container}>
              <ScrollView>
                <View >
              <TextInput
              keyboardType="numeric"
              placeholder="Overall Rating"
              onChangeText={(overall_rating) => this.setState ({overall_rating})}
              value={this.state.overall_rating.toString()}
              style={styles.inputContainer}
              />
              <TextInput
              keyboardType="numeric"
              placeholder="Price Rating"
              onChangeText={(price_rating) => this.setState ({price_rating})}
              value={this.state.price_rating.toString()}
              style={styles.inputContainer}
              />
              <TextInput
              keyboardType="numeric"
              placeholder="Quality Rating"
              onChangeText={(quality_rating) => this.setState ({quality_rating})}
              value={this.state.quality_rating.toString()}
              style={styles.inputContainer}
              />
              <TextInput
              keyboardType="numeric"
              placeholder="Clenliness Rating"
              onChangeText={(clenliness_rating) => this.setState ({clenliness_rating})}
              value={this.state.clenliness_rating.toString()}
              style={styles.inputContainer}
              />
              <TextInput
              placeholder="Review "
              onChangeText={(review_body) => this.setState ({review_body})}
              value={this.state.review_body}
              style={styles.inputContainer}
              />
              <View style={styles.buttonContainer} >
                <Button
              title="Add Review"
              onPress={() =>  this.addReview()}
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
    backgroundColor: '#bdb76b',

  },
  buttonContainer: {
    height: 45,
    justifyContent: 'space-between',
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
    margin: 10
  }
});


export default ReviewScreen;
