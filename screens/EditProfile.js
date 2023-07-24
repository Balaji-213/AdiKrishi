import React,{useState,useEffect} from 'react';
import { View,SafeAreaView,Image, StyleSheet,TouchableOpacity, ImageBackground,TextInput,Modal,Button,BackHandler} from 'react-native';
import {Avatar,Title,Text,Caption,TouchableRipple,} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const EditProfile=({navigation})=>{


  const route = useRoute();
  const {username,data} = route.params

  const [name, setName] = useState(data.name)
  const [mobile, setMobile] = useState(data.mobile)
  const [email, setEmail] = useState(data.email)
  const [address, setAddress] = useState(data.address)
  const [image, setImage] = useState('')


  const edit =async(data)=>{
    const editData = await 
    axios.post('http://192.168.207.193:3000/editProfile',({id:data._id, name, email, address, mobile}))
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  

  useEffect(() => {
    const backAction = () => {
      // Define your custom back button behavior here
      // For example, show an alert or navigate to a different screen
      // You can customize the logic based on your requirements
  
      // To prevent the default back button behavior (e.g., exiting the app),
      // return 'true'. Otherwise, return 'false' or remove the 'return' statement.
  
      // For example, to show an alert when the back button is pressed:
      navigation.navigate('dprofile',{username})
    
      // Return true to prevent the default behavior
      return true;
    };
  
    // Add event listener for back button presses
    BackHandler.addEventListener('hardwareBackPress', backAction);
  
    // Clean up the event listener when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

    const {colors} = useTheme();

  const [menuVisible, setMenuVisible] = useState(false);
    const[ModalVisible,setModalVisible]=useState(false);


    const OpenModal=()=>{
        setModalVisible(true);
    }
    const CloseModal=()=>{
        setModalVisible(false);
    }

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

          <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>Edit Profile</Text>
          </View>


          </View>

            <View style={{margin:20}}>
                <View style={{alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{}}>
                        <View style={{height:100,width:100,borderWidth:1,borderRadius:0,borderColor:'white',
                            justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <ImageBackground
                                    source={require('./imagee/userlogo.jpg')}
                                    style={{height:100,width:100,}}
                                    imageStyle={{borderRadius:15}}

                                    />
                                    <View>

                                    
                                    <TouchableOpacity onPress={OpenModal} style={{paddingBottom:60}}>
                                    
                                    <Image source={require('./imagee/camera.jpg')} style={{height:20,width:20}}/>

                                   
                                    </TouchableOpacity>
                                    </View>

                                


                        </View>
                    </TouchableOpacity>

                    <Text style={{marginTop:10,fontSize:18,fontWeight:'bold'}}>@{username}</Text>
                </View>
                <View style={styles.action}>
                    <Image source={require('./imagee/userlogo.jpg')} style={{height:30,width:30}}/>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={((text)=>{setName(text)})}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
            </View>

            <View style={styles.action}>
                    <Image source={require('./imagee/phone.png')} style={{height:30,width:30}}/>
          <TextInput
            placeholder="Phone"
            value={mobile}
            onChangeText={((text)=>{setMobile(text)})}
            placeholderTextColor="#666666"
            keyboardType='number-pad'
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
            </View>
            <View style={styles.action}>
                    <Image source={require('./imagee/email.jpg')} style={{height:30,width:30,}}/>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={((text)=>{setEmail(text)})}
            placeholderTextColor="#666666"
            keyboardType='email-address'
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
            </View>
            <View style={styles.action}>
                    <Image source={require('./imagee/loca.png')} style={{height:30,width:30}}/>
          <TextInput
            placeholder="Location"
            value={address}
            onChangeText={((text)=>{setAddress(text)})}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
            </View>

            <TouchableOpacity style={styles.commandButton} onPress={()=>{console.log(name,mobile,email,address)}}>
                <Text style={styles.panelButtonTitle}>Submit</Text>

            </TouchableOpacity>
            </View>

            <Modal
            visible={ModalVisible}
            animationType='fade'
            transparent
            onRequestClose={CloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                       
                        <View style={styles.modalHeading}>
                        <Text style={{color:'white'}}>Upload photo</Text>
                    </View>

                        
                        <TouchableOpacity>
                        <View style={styles.modalHeading}>
                        <Text style={{color:'white'}}>Choose from Library</Text>
                    </View>

                        </TouchableOpacity>

                        <TouchableOpacity>
                        <View style={styles.modalHeading}>
                        <Text style={{color:'white'}}>Take photo</Text>
                    </View>

                        </TouchableOpacity>
                    <Button title="Close" onPress={CloseModal} />

                    </View>



                </View>

            </Modal>

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
    commandButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginTop: 10,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      // elevation: 5,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',

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
      modalContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0)',
        zIndex:2,
        padding:20

      },
      modalHeading:{
        fontSize:22,
        fontWeight:'bold',
        marginBottom:20,
        color:'white'
      },
      modalText:{
        fontSize:16,
        marginBottom:10
      },
      modalContent: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        
      },
  });
  export default EditProfile;