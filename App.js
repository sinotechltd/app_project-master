import 'react-native-gesture-handler';
import React, { Component, View, Button } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Signup from './screens/signup';
import Login from './screens/login';
import UpdateUser from './screens/updateuser';
import UserInfo from './screens/userInfo';
import LocationInfo from './screens/locationInfo';

import AddReview from './screens/addReview';
import SearchLocation from './screens/search';
import UpdateReview from './screens/updateReview';
import ViewReview from './screens/viewReview';
import TakePhoto1 from './screens/TakePhoto';
import DisplayPhoto from './screens/displayPhoto';
import SettingsPage from './screens/settings';



const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function AppTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={locationApp}
        options={{ title: 'Coffida Review App' },{
          tabBarIcon: ({  }) => (
            <Icon name="home" size={26} />
            
          )}}
      />
      <Tab.Screen name="Search" component={SearchLocation}
       options={{
        tabBarIcon: ({  }) => (
          <Icon name="search" size={26} />
        )}} />
          <Tab.Screen name="Profile" component={UserProfileApp}
       options={{
        tabBarIcon: ({  }) => (
          <Icon name="user" size={26} />
        )}} 
        />
             <Tab.Screen name="Settings" component={SettingsPage}
       options={{
        tabBarIcon: ({  }) => (
          <Icon name="cog" size={26} />
        )}} 
        />
    </Tab.Navigator>
    
  );
}

function UserProfileApp(){
  return(
    <Stack.Navigator >
    <Stack.Screen name="UserInfo" component={UserInfo} options={{ title: 'Profile' }}/>
  <Stack.Screen name="UpdateUser" component={UpdateUser} options={{ title: 'Profile' }}/>
  <Stack.Screen name="TakePhoto" component={TakePhoto1} options={{ title: 'Profile' }} />
  <Stack.Screen name="DisplayPhoto" component={DisplayPhoto} options={{ title: 'Profile' }}/>
  <Stack.Screen name="UpdateReview" component={UpdateReview} options={{ title: 'Profile' }}/>
  </Stack.Navigator>
  );
  
}
function locationApp(){
  return(
    <Stack.Navigator >
      <Stack.Screen name="LocationInfo" component={LocationInfo} options={{ title: 'Home' }}/>
      <Stack.Screen name="ViewReview" component={ViewReview} options={{ title: 'Review' }}/>
      <Stack.Screen name="AddReview" component={AddReview} options={{ title: 'Review' }} />
  </Stack.Navigator>
  );
  
}
function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        
        
        <Stack.Screen name="Sign Up" component={Signup} />
       
        <Stack.Screen name="LocationInfo" 
        component={AppTab}
        options={{ title: 'Coffida Review App' }} />
       
      </Stack.Navigator>

    </NavigationContainer>
  );
}




export default App;
