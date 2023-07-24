import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, BackHandler, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AuthContext } from '../context/authContext';
import jwtDecode from 'jwt-decode';

import axios from 'axios';
import { TextInput } from 'react-native';
const cropData = [
  { name: 'Areca nut', price: 'kg/Rs299', img: require('./imagee/crop_icon1.jpg') },
  { name: 'Ginger', price: 'kg/Rs259', img: require('./imagee/crop_icon1.jpg') },
  // { name: 'clove Garlic', price: 'kg/Rs298', img:require('./imagee/crop_icon1.jpg')},
  // Add more crop data as needed
];


const HomeScreen2 = ({ navigation }) => {

  const [data, setData] = useState([])
  const [sort, setSort] = useState('')
  const [Try, setTry] = useState('')
  const [query, setQuery] = useState('')
  const [detk, setDetk] = useState('')

  const [isNetConnected, setIsNetConnected] = useState(false)

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsNetConnected(state.isConnected);
    });
    unsubscribe();

  },[])


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


  const { username } = detk

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

  // useEffect(() => {
  //   try {
  //     fetch('http://192.168.23.193:3000/getCropName')
  //       .then(res => {
  //         setData(res.data)
  //       })
  //   }
  //   catch (er) {
  //     console.log(er)
  //   }

  // }, [])

  useEffect(() => {
    const fetchdata = async()=>{
      try {
        await axios.post(`http://192.168.207.193:3000/search?q=${query}&sort=${sort}`)
          .then(res => {
            setData(res.data)
          })
      }
      catch (er) {
        console.log(er)
      }
    }

      fetchdata();

  }, [query,sort])



  const handelLogout = async () => {

    try {
      await axios.post('http://192.168.207.193:3000/logout', { username })
        .then(res => {
          console.log('success')
        })
    }
    catch (err) {
      alert("Something went wrong")
    }
  }





  // console.log(data)

  const logout = () => {
    AsyncStorage.removeItem('Credentials').then(() => {
      setStoredCredentials('');
    })
      .catch(err => console.log(err))
  }

  const [menuVisible, setMenuVisible] = useState(false);

  const { storedCredentials, setStoredCredentials } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSort = (text) => {
    setSort(text)
  };

  const handleDealDonePress = () => {
    navigation.navigate('DealDone');
  };

  const renderCropItem = ((item) => {
    // if (!item) {
    //   return null; // Return null if item is undefined or null
    // }
    return (
      <View style={[styles.cropItem && { flexDirection: 'row', margin: 10, height: 200, width: 200, backgroundColor: 'gray' }]}>
        <View style={[styles.cropInfoContainer && { width: 30, }]}>
          {/* <View style={{margin:10,}}><Image source={item.img} style={styles.cropIcon} /> */}
          {/* </View> */}
          <View style={{ width: 100, margin: 0 }}><Text style={styles.cropName}>{item.name}</Text>
          </View>
          {/* <View style={{margin:0,width:100}}><Text style={styles.cropPrice}>{item.price}</Text></View> */}

        </View>

        <TouchableOpacity style={styles.sellButton} onPress={() => { navigation.navigate('Home2', { name: item.name }) }}>
          <Text style={styles.sellButtonText}>Check Details</Text>
        </TouchableOpacity>
      </View>
    );
  }
  )

  return (

    // New
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
          <Text style={styles.menuIconText}>&#9776;</Text>
        </TouchableOpacity>
        <Text style={[styles.headerText && { height: 50, color: 'black', padding: 10, fontSize: 20, }]}>{username}</Text>
      </View>
      <View style={styles.content}>
        {/* Your home screen content here */}
        <View style={{ flexDirection: 'row', height: 50, backgroundColor: '#d9e4fc' }}>
          <View><Text style={{ fontSize: 20, color: 'black', width: 150, padding: 10, borderColor: 'black', }}>Sort</Text></View>
          <View><Text style={{ fontSize: 20, color: 'black', width: 150, padding: 10 }}>Filter</Text></View>
          <View><Text style={{ fontSize: 20, color: 'black', width: 150, padding: 10 }}>Category</Text></View>
        </View>
        <View>
          <TextInput
            placeholder="Search"
            onChangeText={(text) => setQuery(text)}
            value={query}
          />
          <TextInput
            placeholder="Sort"
            onChangeText={(text) => setSort(text)}
            value={sort}
          />
          <TouchableOpacity onPress={() => handleSort(Try)}>
                        <Text >Sell Now</Text>
          </TouchableOpacity>
        </View>
        {isNetConnected ? <Text style={{color: 'red', marginBottom: 10,}}>Connected</Text> : <Text style={{color: 'red', marginBottom: 10,}}>Not connected</Text>}


        <ScrollView >
          <View style={[styles.content && { margin: 30 }]}>
            {data.map((crop, index) => {
              if (index % 2 === 0) {
                // Render two crops in a row
                const nextCrop = data[index + 1];
                return (
                  <View key={index} style={styles.cropRow}>
                    <View style={styles.cropData}>
                      <Image source={require('./imagee/crop_icon1.jpg')} style={styles.cropImage} />
                      <Text style={styles.cropName}>{crop.name}</Text>
                      <TouchableOpacity style={styles.sellButton} onPress={() => navigation.navigate('Home2', { name: crop.name, username })}>
                        <Text style={styles.sellButtonText}>Sell Now</Text>
                      </TouchableOpacity>
                    </View>
                    {nextCrop && (
                      <View style={styles.cropData}>
                        <Image source={require('./imagee/crop_icon1.jpg')} style={styles.cropImage} />
                        <Text style={styles.cropName}>{nextCrop.name}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Home2', { name: nextCrop.name, username })} style={styles.sellButton}>
                          <Text style={styles.sellButtonText}>Sell Now</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }
              return null;
            })}
            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
      </View>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Your Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('profileFarmer', { username }) }} style={styles.menuItem}>
            <Text style={styles.menuItemText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('RnR', { username }) }} style={styles.menuItem}>
            <Text style={styles.menuItemText}>RnR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            logout()
            handelLogout()
          }} style={[styles.menuItem && { position: 'absolute', height: 30, padding: 3, paddingLeft: 5, width: 80, left: 10, bottom: 70, borderWidth: 2, backgroundColor: 'red', borderColor: 'red' }]}>
            <Text style={[styles.menuItemText && { color: 'black' }]}>Sign Out</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cropRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cropData: {
    flex: 1,
    // alignItems: 'center',
  },
  sellButton: {
    // marginTop: 0,
    // backgroundColor: '#4CAF50',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 5,
    // alignSelf: 'flex-end',
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 100
  },
  sellButtonText: {
    // color: '#fff',
    // fontSize: 18,
    // fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cropIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: 'cover',
  },
  cropName: {
    // fontSize: 21,
    // marginBottom: 5,
    // color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cropPrice: {
    fontSize: 19,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#96b4f2'
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
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    height: '100%',
    width: '50%',
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
  cropItem: {
    marginBottom: 10,
    padding: 0,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  cropInfoContainer: {
    // flexDirection: 'row',
    // alignItems:'center'

  },
  cropImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  leftColumn: {
    marginRight: 8,
  },
  rightColumn: {
    marginLeft: 8,
  },
  bottomSpace: {
    height: 64, // Height of the space at the bottom
  },
});

export default HomeScreen2;
