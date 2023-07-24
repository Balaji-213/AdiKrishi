import React,{useState,useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
import { AuthContext } from './context/authContext';
import AppNav from './appNavigation/AppNav';
// import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';


const App = () => {
  const [appReady,setAppReady]=useState(false);
  const [storedCredentials,setStoredCredentials]=useState("")
  const [storedDCredentials,setStoredDCredentials]=useState("");

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()
      .then(checkLogin)
      .then(checkDLogin)
      .then(() => setAppReady(true))
      .catch(console.warn)
      .finally(() => SplashScreen.hideAsync());
  }, []);

  const checkLogin = async () => {
    AsyncStorage.getItem('Credentials')
    .then((result)=>{
      if(result !== null){
        setStoredCredentials(JSON.parse(result));
      }
      else{
        setStoredCredentials(null);
      }
    })
    .catch(error =>console.log(error))
  }

  const checkDLogin = async () => {
    AsyncStorage.getItem('DCredentials')
    .then((result)=>{
      if(result !== null){
        setStoredDCredentials(JSON.parse(result));
      }
      else{
        setStoredDCredentials(null);
      }
    })
    .catch(error =>console.log(error))
  }

  if(!appReady){
    return (
      <View/>
  )}

  return ( 
  <AuthContext.Provider value={{storedCredentials, setStoredCredentials, storedDCredentials, setStoredDCredentials}}>
    <AppNav/>
  </AuthContext.Provider>
  )
}

export default App;