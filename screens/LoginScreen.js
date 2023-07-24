import React, { useState, useContext,useRef, useEffect } from 'react';
import { View,Text, TextInput, Button, StyleSheet,ImageBackground, Image,TouchableOpacity,TouchableWithoutFeedback, ScrollView,Dimensions, Animated  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const {width}=Dimensions.get('window')


// import SignupScreen from './screens/SignUpScreen';
const LoginScreen = ({ navigation }) => {

  const [isNetConnected, setIsNetConnected] = useState(false)

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      setIsNetConnected(state.isConnected);
    });

    return () =>{
      unsubscribe();
    }
  },[])

  // useEffect(()=>{
  //   // Unsubscribe
  //   unsubscribe();
  // },[])

  const animation=useRef(new Animated.Value(0)).current;
  const scrollView=useRef()
  const farmerColorInterpolate=animation.interpolate({
    inputRange:[0,width],
    outputRange:['rgba(27,27,51,1)','rgba(27,27,51,0.4)']

  });
  const dealerColorInterpolate=animation.interpolate({
    inputRange:[0,width],
    outputRange:['rgba(27,27,51,0.4)','rgba(27,27,51,1 )']

  });


  const [username, setUserName] = useState('');
  const [mobile, setMobile] = useState('');
  const [errorr, setErrorr] = useState('');
  const [OTP, setOTP] = useState('');

  const [dusername, setDuserName] = useState('');
  const [dmobile, setDmobile] = useState('');
  const [dOTP, setDOTP] = useState('');
  const [err,setErr] = useState('');


  const {storedCredentials, setStoredCredentials} = useContext(AuthContext);
  const {storedDCredentials, setStoredDCredentials} = useContext(AuthContext);


  const handleLogin = async () => {
    // You can add your login logic using email and password
    // For example, you can make an API call(balu dekh lio) to authenticate the user, If login is successful, navigate to the Home screen
    if (!username || !mobile) {
      setErrorr('Please fill in all fields');
      return;
    }
    if (!isValidMobileNumber(mobile)) {
      setErrorr('Please enter a valid 10-digit mobile number');
      return;
    }

    setErrorr('');

    try {
      // Make an HTTP request to your server to verify the password
      const response = await axios.post('http://192.168.207.193:3000/sendData',({username,mobile}));
  
      // Assuming the server responds with a success status (e.g., 200) if the password is valid
      if (response.data.iuserExists) {
        // Password matched, navigate to the next screen
        setErrorr('OTP sent');
        console.log("otp sent")
        return;
      }
      else if(response.data.loggedIn){
        setErrorr('User already Logged In on another Device')
        return;
      } else {
        // Password did not match, display an error message or take appropriate action
        setErrorr('Invalied Username or Mobile Number');
        return ;

      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }
        
  };

  const handleOtpSubmit = async () => {
    try {
      // Make an HTTP request to your server to verify the password
      const response = await axios.post('http://192.168.207.193:3000/verifyData',({username,mobile,OTP}));
      const result = response.data;
      const {message,status,data} = result
  
      // Assuming the server responds with a success status (e.g., 200) if the password is valid
      if (response.status===200 && response.data.otptry===true) {
        // Password matched, navigate to the next screen
        // login();
        AsyncStorage.setItem('token',JSON.stringify(response.data.token));
        persistLogin(username, message,status);
      } else {
        // Password did not match, display an error message or take appropriate action
        console.log('Invalid password');
        setErrorr("Incorrect OTP");
        return;
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }
  };

  const isValidMobileNumber = (mobile) => {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(mobile);
  };

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('Credentials',JSON.stringify(credentials))
    .then(()=>{
      setStoredCredentials(credentials);
    })
    .catch((errorr)=>{
      console.log(errorr);
    })
  };


  const handleDLogin = async () =>{

    if (!dusername || !dmobile) {
      setErr('Please fill in all fields');
      return;
    }
    if (!isValidDMobileNumber(dmobile)) {
      setErr('Please enter a valid 10-digit mobile number');
      return;
    }

    setErr('');

    try {
      // Make an HTTP request to your server to verify the password
      const response = await axios.post('http://192.168.207.193:3000/sendDealData',({dusername,dmobile}));
  
      // Assuming the server responds with a success status (e.g., 200) if the password is valid
      if (response.data.iuserExists) {
        // Password matched, navigate to the next screen
        setErr('OTP sent');
        console.log("otp sent")
        return;
      }      
      else if(response.data.loggedIn){
        setErr('User already Logged In on another Device')
        return;
      } else {
        // Password did not match, display an error message or take appropriate action
        setErr('Invalied Username or Mobile Number');
        return ;

      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }

  }

  const handleDOtpSubmit = async () =>{

    try {
      // Make an HTTP request to your server to verify the password
      const response = await axios.post('http://192.168.207.193:3000/verifyDealData',({dusername,dmobile,dOTP}));
      const result = response.data;
      const {message,status,data} = result
  
      // Assuming the server responds with a success status (e.g., 200) if the password is valid
      if (response.status===200 && response.data.otptry===true) {
        // Password matched, navigate to the next screen
        AsyncStorage.setItem('token',JSON.stringify(response.data.token));
        persistDLogin(dusername, message,status);
        // navigation.navigate("Home3")
      } else {
        // Password did not match, display an error message or take appropriate action
        console.log('Invalid password');
        setErr("Incorrect OTP");
        return;
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }

  }

  const isValidDMobileNumber = (dmobile) => {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(dmobile);
  };

  const persistDLogin = (credentials, message, status) => {
    AsyncStorage.setItem('DCredentials',JSON.stringify(credentials))
    .then(()=>{
      setStoredDCredentials(credentials);
    })
    .catch((errorr)=>{
      console.log(errorr);
    })
  };

  return (
    <View style={{paddingTop:15,flex:1}}>
      <View style={{height:120,justifyContent:'center',alignItems:'center'}}> 
       <View >
        <Text style={{fontSize:25,fontWeight:'bold',color:'black'}}>Welcome To</Text>
      </View>
      <Text style={{fontSize:25,fontWeight:'bold',color:'black'}}>Farmers Market</Text>
      
      </View>

      
      <View style={{flexDirection:'row',paddingLeft:20,paddingRight:20}}>
        <TouchableWithoutFeedback onPress={()=>  scrollView.current.scrollTo({x:0})}>
          {/* add animated in view and change background color and above onPress*/}
          <Animated.View style={{height:45,width:'50%',borderTopLeftRadius:8,borderBottomLeftRadius:8,
                                  backgroundColor:farmerColorInterpolate,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'white',fontSize:18,}}>Farmer</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>  scrollView.current.scrollTo({x:width})}>
          {/* add animated in view and change background color  and above onPress*/}
          <Animated.View style={{height:45,width:'50%',borderTopRightRadius:8,borderBottomRightRadius:8,
                      backgroundColor:dealerColorInterpolate,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'white',fontSize:18}}>Dealer</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>

      <ScrollView 
      // add this
      ref={scrollView}
      horizontal 
      pagingEnabled 
      showsVerticalScrollIndicator='false'
      scrollEventThrottle={16}
      onScroll={Animated.event([{nativeEvent:{contentOffset:{x:animation}}}],{useNativeDriver:false})}

      >
        <ScrollView>
        <View style={{width:Dimensions.get('window').width}}>
        {errorr ? <Text style={{color: 'red', marginBottom: 10,}}>{errorr}</Text> : null}
        {isNetConnected ? <Text style={{color: 'red', marginBottom: 10,}}>Connected</Text> : <Text style={{color: 'red', marginBottom: 10,}}>Not connected</Text>}
        <View style={{paddingLeft:30,}}>
          <Text style={{fontSize:20,color:'black'}}>UserName</Text>
          </View>          
          <View style={{paddingLeft:30,paddingRight:30}}>
          <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,paddingTop:2,paddingBottom:3}}
                            placeholder="Username"
                            onChangeText={(text) => setUserName(text)}
                            value={username}
                            // keyboardType="email-address"
                            autoCapitalize="none"
                            />
          </View>
          <View style={{paddingLeft:30,}}>
          <Text style={{fontSize:20,color:'black'}}>Mobile Number</Text>
          </View>
          <View style={{paddingLeft:30,paddingRight:30}}>
          <TextInput style={{borderWidth:1,borderColor:'#1b1b33',paddingTop:2,paddingBottom:3,
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,marginBottom:5}}
                            placeholder="Mobile Number"
                            onChangeText={(text) => setMobile(text)}
                            value={mobile}
                            />
          </View>
          
          <TouchableOpacity onPress={()=>handleLogin()}>
          <View style={{justifyContent:'center',alignItems:'center',}}>

            <Text style={{borderWidth:1,borderRadius:10,width:90,padding:10,paddingLeft:15,color:'white',backgroundColor:'black'}}>Get OTP</Text>
            </View>
          </TouchableOpacity>
          <View style={{paddingLeft:30,paddingRight:30}}>

          <Text style={{fontSize:20,color:'black'}}>Enter OTP</Text>
          </View>
          <View style={{paddingLeft:30,paddingRight:30}}>
          <TextInput secureTextEntry style={{borderWidth:1,borderColor:'#1b1b33',paddingTop:10,paddingBottom:7,
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,marginBottom:20}}
                            placeholder="OTP"
                            onChangeText={(text) => setOTP(text)}
                            value={OTP}
                            />
          </View>
          <TouchableOpacity onPress={()=> handleOtpSubmit() }>
          <View style={{justifyContent:'center',alignItems:'center'}}>

            <Text style={{borderWidth:1,backgroundColor:'cyan',color:'black',paddingTop:3,paddingHorizontal:20,
                          borderRadius:10,height:35,fontSize:20,justifyContent:'center',textAlign:'center'}}>Login</Text>
                          </View>
          </TouchableOpacity>

          <Text style={{fontSize:20,color:'red',marginLeft:160,marginTop:10,
                    justifyContent:'center',alignItems:'center'}}>New User??</Text>

          <TouchableOpacity onPress={()=> navigation.navigate('Signup') }>
          <View style={{justifyContent:'center',alignItems:'center'}}>

            <Text style={{borderWidth:1,backgroundColor:'cyan',color:'black',borderRadius:10,paddingHorizontal:20,paddingTop:3,
                      fontSize:20,justifyContent:'center',textAlign:'center'}}>Signup</Text>
          </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
        {/* //Dealer */}

        
        <ScrollView>
        <View style={{width:Dimensions.get('window').width}}>
        {err ? <Text style={{color: 'red', marginBottom: 10,}}>{err}</Text> : null}
        {isNetConnected ? <Text style={{color: 'red', marginBottom: 10,}}>Connected</Text> : <Text style={{color: 'red', marginBottom: 10,}}>Not connected</Text>}
        <View style={{paddingLeft:30,}}>
          <Text style={{fontSize:20,color:'black'}}>UserName</Text>
          </View>
          <View style={{paddingLeft:30,paddingRight:30}}>
          <TextInput style={{borderWidth:1,borderColor:'#1b1b33',paddingTop:10,paddingBottom:8,
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                            placeholder="Username"
                            onChangeText={(text) => setDuserName(text)}
                            value={dusername}
                            // keyboardType="email-address"
                            autoCapitalize="none"
                            />
                            </View>
          
          <View style={{paddingLeft:30,}}>
          <Text style={{fontSize:20,color:'black'}}>Mobile Number</Text>
          </View>
          <View style={{paddingLeft:30,paddingRight:30}}>
          <TextInput style={{borderWidth:1,borderColor:'#1b1b33',paddingTop:10,paddingBottom:8,
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,marginBottom:5}}
                            placeholder="Mobile Number"
                            onChangeText={(text) => setDmobile(text)}
                            value={dmobile}
                            />
          </View>
          {/* <Text style={{fontSize:20}}>Dealer ID</Text>
          <TextInput secureTextEntry style={{borderWidth:1,borderColor:'#1b1b33',
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                            /> */}
          <TouchableOpacity onPress={()=>handleDLogin()}>
          <View style={{justifyContent:'center',alignItems:'center',}}>
            <Text style={{borderWidth:1,borderRadius:10,width:90,padding:10,paddingLeft:15,color:'white',backgroundColor:'black'}}>Get OTP</Text>
            </View>
          </TouchableOpacity>
          <View style={{paddingLeft:30}}>
          <Text style={{fontSize:20,color:'black'}}>Enter OTP</Text>
          </View>
          <View style={{paddingLeft:30,paddingRight:30}}>
          <TextInput secureTextEntry style={{borderWidth:1,borderColor:'#1b1b33',paddingBottom:5,
                            height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,marginBottom:20}}
                            onChangeText={(text)=>setDOTP(text)}
                            placeholder='OTP'/>
          </View>
          <TouchableOpacity onPress={()=> handleDOtpSubmit() }>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{borderWidth:1,backgroundColor:'cyan',color:'black',paddingTop:3,paddingHorizontal:20,
                          borderRadius:10,height:35,fontSize:20,justifyContent:'center',textAlign:'center'}}>Login</Text>
                          </View>
          </TouchableOpacity>
          <Text style={{fontSize:20,color:'red',marginLeft:160,marginTop:10,justifyContent:'center',alignItems:'center'}}>New User??</Text>
          <TouchableOpacity onPress={()=> navigation.navigate('Signup') }>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{borderWidth:1,backgroundColor:'cyan',color:'black',borderRadius:10,paddingHorizontal:20,paddingTop:3,
                      fontSize:20,justifyContent:'center',textAlign:'center'}}>Signup</Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
        
      </ScrollView>
    </View>
  )
  
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
    

//   },
//   userlogoo:{
//     width: 100,
//     height:100,
//     justifyContent: 'center',
//     borderRadius:250,
//     marginBottom:10,
//     padding:50,


//   },
//   logocontainer:{
//     flexDirection:'row',
//     alignItems:'center',

//   },
//   logo:{
//     width: 40,
//     height:40,
//     justifyContent: 'center',
//     display:'flex',
//     marginTop:10,
//     borderRadius:50,
//     marginLeft:8,




//   },
//   buttonn:
//   {
//     padding:30,
//     marginBottom:20,
//     // marginTop:20,
//     borderRadius:45,
    

//   },

//   input: {
//     width: '80%',
//     height: 40,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     borderColor: 'black',
//     borderWidth: 2,
//     borderRadius:15
//   },  backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//     BlurView:10
//   },  
//   inputError: {
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   textt:{
//     fontSize:20,
//     fontWeight:'bold',
//     color:'red',
//   }

// })
export default LoginScreen;
