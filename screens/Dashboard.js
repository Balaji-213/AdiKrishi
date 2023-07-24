import React,{useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { AuthContext } from '../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';



const Dashboard = ({navigation}) => {

  const [ detk, setDetk] = useState('')

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const tk = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(tk);
        setDetk(decodedToken)
        // console.log(tk);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    retrieveToken();
  }, []); 

  // console.log('hi', token); // This might not reflect the updated value immediately


const {username} = detk

// console.log(username)

  useEffect(() => {
    const backAction = () => {
      // Define your custom back button behavior here
      // For example, show an alert or navigate to a different screen
      // You can customize the logic based on your requirements
  
      // To prevent the default back button behavior (e.g., exiting the app),
      // return 'true'. Otherwise, return 'false' or remove the 'return' statement.
  
      // For example, to show an alert when the back button is pressed:

      Alert.alert('Confirm Exit', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => false, // Returning false will prevent the default behavior
          style: 'cancel'
        },
        {
          text: 'Exit',
          onPress: () => {
            // Perform any cleanup or necessary actions before exiting
            // Then, use BackHandler.exitApp() to exit the app
            BackHandler.exitApp();
          }
        }
      ]);
    
      // Return true to prevent the default behavior
      return true;
    };
  
    // Add event listener for back button presses
    BackHandler.addEventListener('hardwareBackPress', backAction);
  
    // Clean up the event listener when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const logout = ()=>{
    AsyncStorage.removeItem('DCredentials').then(()=>{
      setStoredDCredentials('');
    })
    .catch(err=>console.log(err))
  }

  const handelLogout = async () => {
      
    try{
      await axios.post('http://192.168.207.193:3000/logout',{username})
      .then(res=>{
        console.log('success')
      })
    }
    catch (err) {
      console.log(err)
    }}

  const {storedDCredentials,setStoredDCredentials}=useContext(AuthContext);


    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
          <Text style={styles.menuIconText}>&#9776;</Text>
        </TouchableOpacity>
        <Text style={[styles.headerText&& {height:50,color:'black',padding:10,fontSize:20,}]}>Dashboard</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('New',{username})}
        >
          <Text style={styles.buttonText}>New Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Pending',{username})}
        >
          <Text style={styles.buttonText}>Pending Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('History',{username})}
        >
          <Text style={styles.buttonText}>Order History</Text>
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity  style={styles.menuItem} onPress={() => {navigation.navigate('Dash')}}>
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.menuItem}>
            <Text style={styles.menuItemText}>Your Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('dprofile',{username})}} style={styles.menuItem}>
            <Text style={styles.menuItemText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Request',{username})}} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {logout()
          handelLogout()}} style={[styles.menuItem && {position:'absolute',height:30,padding:3,paddingLeft:5,width:80,left:10,bottom:70,borderWidth:2,backgroundColor:'red',borderColor:'red'}]}>
            <Text style={[styles.menuItemText&& {color:'black'}]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor:'#96b4f2'
    ,height:50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin:10,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin:5

  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuIconText: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    height:'100%',
    width:'50%',
    top: 50,
    left: 0,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
  },
});

export default Dashboard;
