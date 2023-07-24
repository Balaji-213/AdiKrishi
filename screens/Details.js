import React,{useEffect, useState} from 'react'
import {Button, Text,StyleSheet,Image, TouchableOpacity, TextInput, Linking, Platform, Modal} from 'react-native'
import {View} from 'react-native'
import { NavigationContainer, useRoute } from '@react-navigation/native';
import axios from 'axios';


const Details= ({navigation}) => {

    const Route = useRoute();

    const {item,username} = Route.params;

    const [data,setData] = useState({});
    const [quan,setQuan] = useState('');

    const handleData = async () => {
        const response = await axios.post('http://192.168.207.193:3000/getData',({dname:item.dname}))

        if(response.data.userData){
            // console.log(response.data.userData)
            setData(response.data.userData);
        }else{
            console.log(response.data.userData);
        }
    }

    // console.log(data.name);


    useEffect(()=>{
      handleData();
    },[])

    const handleSellButtonPress = async () => {
      setIsConfirmationVisible(false);
      // navigation.navigate('DealDone');
      await axios.post('http://192.168.207.193:3000/sellCroptest',({cropname:item.cropname, dname:item.dname, fname:username, quan}));
      
    };

    // const openDial = (mobile) =>{
    //     if(Platform.OS === "android"){
    //         Linking.openURL(`tel:${mobile}`)
    //     }
    //     else{
    //         Linking.openURL(`telprompt:${mobile}`)
    //     }
    // }

    const[quantity,setquantity]=useState('');
    const [selectedOption, setSelectedOption] = useState('units');

    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

    const handleSellConfirmation = () => {
      setIsConfirmationVisible(true);
    };

    const handleSell = () => {
        // Perform the selling logic here
        // You can navigate to the "Deal Done" screen or update the UI accordingly
        // For demonstration purposes, let's show an alert
        setIsConfirmationVisible(false);
        Alert.alert('Deal Done');
      };
    
    const handleCancel = () => {
        setIsConfirmationVisible(false);
      };

      
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
      };

    // const[GST,setGST]=useState('');
    // const[date_collection,setdate_collection]=useState('');
    // const[time,settime]=useState('');
    // const[grading,setgrading]=useState('');
    // const[quantity,setquantity]=useState('');
  return(
    <View style={styles.container}> 
        <View style={styles.header}>
            <Text style={styles.headerText}>{username}</Text>

        </View>
        
        <View style={{flexDirection:'row',height:50,backgroundColor:'#d9e4fc'}}>
            <View><Text style={{fontSize:20,color:'black',width:150,padding:10,borderColor:'black',}}>Sort</Text></View>
            <View><Text style={{fontSize:20,color:'black',width:150,padding:10}}>Filter</Text></View>
            <View><Text style={{fontSize:20,color:'black',width:150,padding:10}}>Category</Text></View>
        </View>
        <View style={{borderTopLeftRadius:70,borderTopRightRadius:70,borderWidth:1,backgroundColor:'#f0f5f4',
                        borderColor:'dirtywhite',height:200,marginLeft:10,marginRight:10}}>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'red',fontSize:28,fontWeight:'bold'}}>{item.company}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={{margin:15}}>
                    
                    {/* <Image source={require('./userlogo.jpg')} style={{height:50,width:50}} />     */}
                    
                    
                    <View style={{marginTop:17}}>
                    <Text style={{color:'blue'}}>OWNER:</Text>
                    <Text style={{color:'black'}}>{item.dname}</Text>

                    </View>
                    
                </View>
                <View >
                    <View style={{margin:15,padding:10,}}>
                        <TouchableOpacity style={{backgroundColor:'blue',borderRadius:3,borderWidth:1,height:30,width:80,padding:3}}
                                        // onPress={openDial(data.mobile)}
                                        >
                            <Text style={{color:'white'}}>Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{color:'blue'}}>ADDRESS:</Text>
                    <Text>{data.address}</Text>

                    </View>
                  
                </View>

            </View>
        </View>

        <View style={styles.info}>
            <View style={{flexDirection:'row',margin:2}}>
            <Text style={styles.textcolor}>GST NO:</Text>
            <Text style={{color:'black'}}>   22222222AAAA</Text>
            </View>
            <View style={{flexDirection:'row',margin:2}}>
            <Text style={styles.textcolor}>Email:</Text>
            <Text style={{color:'black'}}>   abc@gmail.com</Text>
            </View>

            <View style={{flexDirection:'row',margin:2}}>
            <Text style={styles.textcolor}>DATE OF COLLECTION:</Text>
            <Text style={{color:'black'}}>   30/06/2023</Text>
            </View>

            <View style={{flexDirection:'row',margin:2}}>
            <Text style={styles.textcolor}>TIME:</Text>
            <Text style={{color:'black'}}>   5:30 PM</Text>

            </View>

            <View style={{flexDirection:'row',margin:2}}>
                    <Text style={styles.textcolor}>Grading : </Text>
                        <View style={{height:50,width:200}}>
                            <Text style={{color:'black'}}>Grade 1= 14,500 Rs</Text>
                            <Text style={{color:'black'}}>Grade 2= 13,500 Rs</Text>
                            <Text style={{color:'black'}}>Grade 3= 11,500 Rs</Text>

                        </View>
            </View>

            <View style={{flexDirection:'row',margin:10}}>
                <Text style={styles.textcolor}>ENTER APPROX QUANTITY: </Text>
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
      

            </View>
            <View style={{justifyContent:'center',alignItems:'center',marginBottom:5}}>
      <Text style={{color:'red'}}>1 Unit=100kg</Text>
      </View>

            <View style={{flexDirection:'row',margin:2}}>
            <Text style={[styles.textcolor&& {fontSize:22,color:'blue'}]}>TOTAL VALUE APPROX:</Text>
            <Text style={{color:'black',fontSize:22,}}>1,50,000 Rs</Text>

            </View>
            <View style={{marginTop:25}}>
                <TouchableOpacity onPress={handleSellConfirmation} style={{backgroundColor:'blue',height:30,width:70,paddingLeft:10}}>
                    <Text style={{color:'white',fontSize:20}} >sell it</Text>
                </TouchableOpacity>
            </View>
            


        </View>
      {/* Confirmation Dialog */}
      <Modal visible={isConfirmationVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Are you sure you want to sell at least (quantity)this item?</Text>
          <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={[styles.modalButton, styles.sellButton]} onPress={()=>{handleSellButtonPress()
          navigation.navigate('Home')}}>
              <Text style={styles.buttonText}>Sell it</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText && {color:'black'}]}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      
    </View>


  );
};
const styles=StyleSheet.create(
    {
        container:{
            flex:1
    },
    header:{
        height:50,
        
        paddingHorizontal: 10,
        backgroundColor:'#96b4f2'
    },
    headerText: {
        
        fontWeight: 'bold',
        marginLeft:10,
        height:50,color:'black',
        paddingHorizontal:10,fontSize:20,
        paddingTop:10
      },
      info:{
        justifyContent:'center',alignItems:'center',
        marginTop:10

      }
      ,textcolor:{
        color:'blue'
      }
});

export default Details;
