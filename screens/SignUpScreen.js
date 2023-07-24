import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import { TextInput } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SignUpScreen = ({navigation}) => {


  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [mobile,setMobile]=useState('');
  const[picture,setPicture]=useState('');
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('farmer');


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
 
    // console.log(data.assets[0]);

    if (!data.canceled) {
      const base64String = convertImageToDataUrl(data.assets[0].base64)
      imageUpload(base64String._j)
    }
  };


  const convertImageToDataUrl = async (imageUri) => {
    try {
  
      // Create the data URL string
      const dataUrl = `data:image/jpeg;base64,${imageUri}`;
  
      // Use the data URL as needed (e.g., store it in state or send it to an API)
  
      // console.log('Data URL:', dataUrl);
      return dataUrl
    } catch (error) {
      console.error('Error converting image to data URL:', error);
    }
  }
  


async function imageUpload (image){

  const response = await axios.post('http://192.168.8.193:3000/uploadImage',({image}))
  
  // console.log(response.data.urlid)

  if(response.data.urlid){
    setPicture(response.data.urlid)
  }
  
}

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSignup = () => {
    // Perform signup logic here
    // You can use the entered name, email, and password for further processing or API calls
    if (!name ||!username|| !email || !address || !mobile) {
      setError('Please fill in all fields');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidMobileNumber(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    console.log('Signup:', name,username, email,address,mobile,selectedOption);
    setError('');
    
    fetch("http://192.168.8.193:3000/newData",{
      method:"post",
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
          name,
          username,
          email,
          address,
          mobile,
          selectedOption
      }),
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
    })

    navigation.navigate('Login');
  };

  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidMobileNumber = (mobile) => {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(mobile);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Signup</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={[styles.input,!name && styles.inputError]}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input,!name && styles.inputError]}
        placeholder="UserName"
        value={username}
        onChangeText={setUserName}
      />
      <TextInput
        style={[styles.input ,!mobile && styles.inputError]}
        placeholder="Mobile no."
        value={mobile}
        onChangeText={setMobile}
        
      />
      <TextInput
        style={[styles.input ,!email && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input,!address && styles.inputError]}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        // secureTextEntry
      />
      <View style={styles.optionContainer}>
        <View style={styles.radioButton}>
          <TouchableOpacity
            style={styles.radioButtonInner}
            onPress={() => handleOptionSelect('farmer')}
          >
            {selectedOption === 'farmer' && <View style={styles.radioButtonSelected} />}
          </TouchableOpacity>
          <Text style={styles.radioButtonLabel}>Farmer</Text>
        </View>
        <View style={styles.radioButton}>
          <TouchableOpacity
            style={styles.radioButtonInner}
            onPress={() => handleOptionSelect('dealer')}
          >
            {selectedOption === 'dealer' && <View style={styles.radioButtonSelected} />}
          </TouchableOpacity>
          <Text style={styles.radioButtonLabel}>Dealer</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonInner: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'blue',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
});

export default SignUpScreen;
