import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
// import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';

const DProfile = ({navigation}) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [mobile,setMobile] = useState('');

  const [data,setData] = useState();

  const route = useRoute();
  const {username} = route.params

  const handleProfile = async () =>{

    try{
      const response = await axios.post('http://192.168.23.193:3000/dprofileData',({username}))
      if(response.data){
        setName(response.data.name);
        setEmail(response.data.email);
        setMobile(response.data.mobile);
        setAddress(response.data.address);
      }
    }
    catch(err){
      console.log(err);
    }

  }  

  handleProfile();

  return (    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>No. of Orders Given:</Text>
          <Text style={styles.value}>7</Text>
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{mobile}</Text>
        </View>
        <View style={styles.profileSection}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{address}</Text>
        </View>

      </View>
      
        <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>{navigation.navigate('Home')}}>
        <View style={{borderRadius:5,borderWidth:1,width:65,}}>
            <Text style={{color:'white',backgroundColor:'black',fontSize:20,justifyContent:'center',alignItems:'center'}}>Home</Text>
        </View>
        </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'black',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileContainer: {
    paddingHorizontal: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
});

export default DProfile;
