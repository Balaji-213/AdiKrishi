import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import DealDoneScreen from '../screens/DealDoneScreen';
import HomeScreen2 from '../screens/HomeScreen2';
import Dashboard from '../screens/Dashboard';
import NewOrder from '../screens/NewOrder';
import PendingOrder from '../screens/PendingOrder';
import OrderHistory from '../screens/OrderHistory';
import DProfile from '../screens/DProfile';
import ProfileFarmer from '../screens/ProfileFarmer';
import Details from '../screens/Details';
import RequestQ from '../screens/RequestQ';
import ReqNRej from '../screens/ReqNRej';
import EditProfile from '../screens/EditProfile';

const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  // const isLoggedIn = true; // Example condition
  // const storedCredentials=true;

  return (
    <AuthContext.Consumer>
      {({storedCredentials,storedDCredentials})=>(
          <NavigationContainer>

            <Stack.Navigator initialRouteName="Login">
              {storedCredentials?(
              <>
                <Stack.Screen name="Home" component={HomeScreen2} options={{ headerShown: false }} />
                {/* <Stack.Screen name="DealDone" component={DealDoneScreen}  options={{ headerShown: false }}/> */}
                <Stack.Screen name="Home2" component={HomeScreen}  options={{ headerShown: false }}/>
                <Stack.Screen name="profileFarmer" component={ProfileFarmer}  options={{ headerShown: false }}/>
                <Stack.Screen name="Details" component={Details}  options={{ headerShown: false }}/>
                <Stack.Screen name="RnR" component={ReqNRej}  options={{ headerShown: false }}/>

              </>
              ):
              (storedDCredentials?(
                <>
                <Stack.Screen name="Dash" component={Dashboard} options={{ headerShown: false }} />
                <Stack.Screen name="New" component={NewOrder} options={{headerShown: false}}/>
                <Stack.Screen name="Pending" component={PendingOrder} options={{headerShown: false}}/>
                <Stack.Screen name="History" component={OrderHistory} options={{headerShown: false}}/>
                <Stack.Screen name="dprofile" component={DProfile}  options={{ headerShown: false }}/>
                <Stack.Screen name="Request" component={RequestQ}  options={{ headerShown: false }}/>
                <Stack.Screen name="editProfile" component={EditProfile}  options={{ headerShown: false }}/>


            
                </>
              ):
              (
                <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
                </>
              ))
              }

            </Stack.Navigator>

          </NavigationContainer>
        
        
      )}

    </AuthContext.Consumer>
  )
};

export default AppNavigator;

