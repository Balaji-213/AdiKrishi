import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Dimensions,BackHandler,Button,ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
const {width}=Dimensions.get('window')

const NewOrder= ({navigation}) => {

  const Route = useRoute();

  const {username} = Route.params

  // const[dname,setDName]=useState('')
  const[mobile,setMobile]=useState('')
  const[cropname,setCropname]=useState('')
  const[rate,setRate]=useState('')
  const[price,setPrice]=useState('')
  const[picture,setPicture]=useState('')

  const[company,setCompany]=useState('')
  const[gst,setGst]=useState('')
  const[crop,setCrop]=useState('')
  
  const[quantype,setQuantype]=useState('units')
  const[quan,setQuan]=useState('')

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('units');

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const handleOptionSelect = (option) => {
      setSelectedOption(option);
      setQuantype(option);
    };

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

  const response = await axios.post('http://192.168.207.193:3000/uploadImage',({image}))
  
  // console.log(response.data.urlid)

  if(response.data.urlid){
    setPicture(response.data.urlid)
  }
  
}

// console.log(picture)


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


  const submitreq = async () => {

    
    try {
      // Make an HTTP request to your server to verify the password
      const response = await axios.post('http://192.168.207.193:3000/newCropData',({dname:username,company,gst,crop,cropname,rate,quantype,quan,picture}));
  
      // Assuming the server responds with a success status (e.g., 200) if the password is valid
      if (response.data.test==='success') {
        // Password matched, navigate to the next screen
        console.log("success")
        return;
      } else {
        // Password did not match, display an error message or take appropriate action
        // setErrorr('Invalied Username or Mobile Number');
        return ;

      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
    }

  }



    return(
 
            // <KeyboardAvoidingView style={[styles.container&&{width:Dimensions.get('window').width,}]} behavior="padding" enabled>
          

            <ScrollView style={[styles.container&&{width:Dimensions.get('window').width,}]}>
            <View style={styles.container}>
                
            <View style={styles.header}>
              <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
                <Text style={styles.menuIconText}>&#9776;</Text>
              </TouchableOpacity>
              <Text style={[styles.headerText&& {height:50,color:'black',padding:10,fontSize:20,}]}>Dashboard</Text>
            </View>
            <View style={{margin:10,justifyContent:'center',alignItems:'center',
                      borderWidth:1,backgroundColor:'black'}}>
                <Text style={{fontSize:20,color:'white'}}>Create Order</Text>
            </View>
    
    
            <View style={{width:Dimensions.get('window').width}}>
                <Text style={{fontSize:15,color:'red'}}>Enter customer details.</Text>
                
              <Text style={{fontSize:20,color:'black'}}>Company Name</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                                onChangeText={(text) => setCompany(text)}
                                value={company}
                                />
    
    <Text style={{fontSize:20,color:'black'}}>GST No:</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                                onChangeText={(text) => setGst(text)}
                                value={gst}
                                />
    
    
              <Text style={{fontSize:20,color:'black'}}>Crop Type</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,marginBottom:5}}
                                onChangeText={(text) => setCrop(text)}
                                value={crop}
                                />
              
              <Text style={{fontSize:20,color:'black'}}>Crop Name</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10,marginBottom:20}}
                                onChangeText={(text) => setCropname(text)}
                                value={cropname}
                                />
    
              <Text style={{fontSize:20,color:'black'}}>Crop quantity</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                                onChangeText={(text) => setQuan(text)}
                                value={quan}
                                />
              
              
    
    
            <View style={styles.optionContainer}>
            <View style={styles.radioButton}>
              <TouchableOpacity
                style={styles.radioButtonInner}
                onPress={() => handleOptionSelect('units')}
              >
                {selectedOption === 'units' && <View style={styles.radioButtonSelected} />}
              </TouchableOpacity>
              <Text style={styles.radioButtonLabel}>Units</Text>
            </View>
            <View style={styles.radioButton}>
              <TouchableOpacity
                style={styles.radioButtonInner}
                onPress={() => handleOptionSelect('kg')}
              >
                {selectedOption === 'kg' && <View style={styles.radioButtonSelected} />}
              </TouchableOpacity>
              <Text style={styles.radioButtonLabel}>kg</Text>
              
            </View>
            
          </View>
          <View style={{justifyContent:'center',alignItems:'center',}}>
          <Text style={{color:'red'}}>1 Unit=100kg</Text>
          </View>
    
                <Text style={{fontSize:20,color:'black'}}>Price /kg</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                                onChangeText={(text) => setRate(text)}
                                value={rate}
                                />
    
                <Text style={{fontSize:20,color:'black'}}>Total Amount</Text>
              <TextInput style={{borderWidth:1,borderColor:'#1b1b33',
                                height:35,borderRadius:8,paddingHorizontal:20,fontSize:16,paddingLeft:10}}
                                // will be Calculated and printed
                                />
    
                <TouchableOpacity onPress={()=> {pickImage()} }>
                <Text style={{borderWidth:1,backgroundColor:'black',color:'white',margin:5,width:200,marginLeft:90,
                          borderRadius:5,fontSize:20,justifyContent:'center',textAlign:'center'}}>Upload crop Image</Text>
              </TouchableOpacity>
    
              <TouchableOpacity onPress={()=> submitreq() }>
                <Text style={{borderWidth:1,backgroundColor:'black',color:'white',width:200,marginLeft:90,
                          borderRadius:5,fontSize:20,justifyContent:'center',textAlign:'center'}}>Place Order</Text>
              </TouchableOpacity>
              
            </View>
            
            
            <ScrollView>
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
          </ScrollView>
            </View>
            {/* </TouchableOpacity>
            </ScrollView> */}
            
            {/* </KeyboardAvoidingView> */}
            </ScrollView>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,flexGrow:0,

  },
  backgroundTouchable: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
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
  optionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
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
export default NewOrder;
