import React,{useEffect} from 'react';
import { View, Text,Button, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';


const DealDoneScreen = ({navigation}) => {

  useEffect(() => {
    const backAction = () => {
      // Define your custom back button behavior here
      // For example, show an alert or navigate to a different screen
      // You can customize the logic based on your requirements
  
      // To prevent the default back button behavior (e.g., exiting the app),
      // return 'true'. Otherwise, return 'false' or remove the 'return' statement.
  
      // For example, to show an alert when the back button is pressed:

      navigation.navigate('Home')
    
      // Return true to prevent the default behavior
      return true;
    };
  
    // Add event listener for back button presses
    BackHandler.addEventListener('hardwareBackPress', backAction);
  
    // Clean up the event listener when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <ImageBackground
      source={require('./imagee/cropimage.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Deal Done!</Text>
        <Text style={styles.message}>Congratulations! Your deal is complete.</Text>
        <Button title="Home" onPress={()=> navigation.navigate('Home')}/>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DealDoneScreen;
