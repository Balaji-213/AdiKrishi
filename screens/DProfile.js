import React,{useEffect, useState} from 'react';
import { View,SafeAreaView,Image, StyleSheet,TouchableOpacity,BackHandler } from 'react-native';
import {Avatar,Title,Text,Caption,TouchableRipple} from 'react-native-paper';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';


const DProfile=({navigation})=>{

  const [data,setData] = useState({});

  const route = useRoute();
  const {username} = route.params
  
  useEffect(()=>{
    const handleProfile = async () =>{

      try{
        const response = await axios.post('http://192.168.207.193:3000/dprofileData',({username}))
        if(response.data){
          setData(response.data);
        }
      }
      catch(err){
        console.log(err);
      }
  
    }  
  
    handleProfile();
  },[])


  
  useEffect(() => {
    const backAction = () => {
      // Define your custom back button behavior here
      // For example, show an alert or navigate to a different screen
      // You can customize the logic based on your requirements
  
      // To prevent the default back button behavior (e.g., exiting the app),
      // return 'true'. Otherwise, return 'false' or remove the 'return' statement.
  
      // For example, to show an alert when the back button is pressed:
      navigation.navigate('Dash')
    
      // Return true to prevent the default behavior
      return true;
    };
  
    // Add event listener for back button presses
    BackHandler.addEventListener('hardwareBackPress', backAction);
  
    // Clean up the event listener when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
    return(
        <SafeAreaView style={styles.container}>
          <View style={{margin:5,flexDirection:'row'}}>
          <View>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
            
            <Text style={styles.menuIconText}>&#9776;</Text>

            
          </TouchableOpacity>

          </View>

          <View style={{justifyContent:'center',alignItems:'center',marginLeft:120}}>

          <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>Profile</Text>
          </View>

          <View style={{marginLeft:130}}>
            <TouchableOpacity onPress={()=>{navigation.navigate('editProfile',{username,data})}}>
            <Image source={require('./imagee/edituser.png')} style={{width: 30, height: 30,}} on/>
            <Text>Edit</Text>
            </TouchableOpacity>
          </View>


          </View>
            <View style={styles.userInfoSection}>
              <View style={{flexDirection:'row',marginTop:15}}>
              <Image
                source={require('./imagee/userlogo.jpg')} style={{width: 80, height: 80,}}/>

              
                <View style={{marginLeft:20}}>

                
                <Title style={[styles.title&&{marginTop:15,marginBottom:5}]}>{data.name}</Title>
                <Caption style={styles.caption}>@{username}</Caption>
                </View>
                </View>

            </View>
            <View style={styles.userInfoSection}>
              <View style={styles.row}>
                <Image source={require('./imagee/loca.png')} style={{width: 30, height: 30,}}/>
              <Text style={{marginLeft:10}}>{data.address}</Text>

              </View>
              <View style={styles.row}>
                <Image source={require('./imagee/phone.png')} style={{width: 30, height: 30,}}/>
              <Text style={{marginLeft:10}}>+91 {data.mobile}</Text>
              
              </View>
              <View style={styles.row}>
                <Image source={require('./imagee/email.jpg')} style={{width: 30, height: 30,}}/>
              <Text style={{marginLeft:10}}>{data.email}</Text>
              
              </View>


            </View>

            <View style={styles.infoBoxWrapper}>
              <View style={[styles.infoBox, {borderRightColor:'#dddddd',borderRightWidth:1}] }>
                <Title>
                  12
                </Title>
                <Caption>Orders</Caption>
              </View>
              <View style={styles.infoBox}>
                <Title>
                  2
                </Title>
                <Caption> Pending Orders</Caption>
              </View>

            </View>
            <View style={styles.menuWrapper}>
            <TouchableRipple onPress={()=>{}}>
                <View style={styles.menuItem}>
                  <Image source={require('./imagee/home.jpg')} style={{width: 30, height: 30,}}/>
                  <Text style={{marginLeft:8}}>Home</Text>

                </View>
              </TouchableRipple>
              <TouchableRipple onPress={()=>{}}>
                <View style={styles.menuItem}>
                  <Image source={require('./imagee/heart.jpg')} style={{width: 30, height: 30,}}/>
                  <Text style={{marginLeft:8}}>Your Favorites</Text>

                </View>
              </TouchableRipple>
              <TouchableRipple onPress={()=>{}}>
                <View style={styles.menuItem}>
                  <Image source={require('./imagee/account_check_outline.png')} style={{width: 30, height: 30,}}/>
                  <Text style={{marginLeft:8}}>Support</Text>

                </View>
              </TouchableRipple>
              <TouchableRipple onPress={()=>{}}>
                <View style={styles.menuItem}>
                  <Image source={require('./imagee/share.png')} style={{width: 30, height: 30,}}/>
                  <Text style={{marginLeft:8}}>Tell your friends</Text>

                </View>
              </TouchableRipple>
            </View>

            {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity  style={styles.menuItem}>
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.menuItem}>
            <Text style={styles.menuItemText}>Your Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('profile')}} style={styles.menuItem}>
            <Text style={styles.menuItemText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Login')}} style={[styles.menuItem && {position:'absolute',height:30,padding:3,paddingLeft:5,width:80,left:10,bottom:70,borderWidth:2,backgroundColor:'red',borderColor:'red'}]}>
            <Text style={[styles.menuItemText&& {color:'black'}]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 25,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuWrapper: {
      marginTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    menuItemText: {
      color: '#777777',
      marginLeft: 20,
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
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
    menuIcon: {
      marginRight: 10,
    },
    menuIconText: {
      fontSize: 24,
    },
  });
  export default DProfile;