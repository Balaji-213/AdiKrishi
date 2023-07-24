import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList,Image, BackHandler, TextInput } from 'react-native';

const cropData = [
  { name: 'Trader name 1 Premium grade', price: 20000 },
  { name: 'Trader name 2 Grade-1', price: 15000, },
  { name: 'Trader name 3 Grade-2', price: 10000, },
  // Add more crop data as needed
];
// const Header = ({ signOut }) => {
//   return (
//     <View style={styles.headerContainer}>
//       <Text style={styles.title}>Home</Text>
//       <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
//         <Text style={styles.signOutText}>Sign Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const HomeScreen = ({ navigation }) => {

  const route = useRoute()

  const [newData,setNewData] = useState([])
  const {name,username} = route.params

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('');


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

  // console.log(username)


  // useEffect(()=>{
  //   axios.post(`http://192.168.23.193:3000/getCropData`,({name}))
  //   .then(res=>{
  //     // console.log(result)
  //     const result = res.data
  //     setNewData(result)
  //   })
  // },[])

  useEffect(()=>{
    const fetch = async()=>{
      await axios.post(`http://192.168.207.193:3000/search2?q=${query}&sort=${sort}`,({name}))
      .then(res=>{
        // console.log(result)
        const result = res.data
        setNewData(result)
      })
    }

    fetch();

  },[query])

  const handleSellButtonPress = async (item) => {
    // navigation.navigate('DealDone');
    await axios.post('http://192.168.207.193:3000/sellCrop',({cropname:item.crop, dname:item.dname, fname:username}))
    .then(res=>{
      console.log(res.data)
    })
  };

// const handleSignOut = () => {
    
//     navigation.navigate('Login');
    
//   };

  const renderCropItem = (item) => {
    return (
      <View style={styles.cropItem}>
      <View style={styles.cropInfoContainer}>
        <View style={{margin:10,height:20}}>
          <Image source={{uri:item.image}} style={styles.cropIcon} />
        <Text style={{color:'black'}}>{item.crop}</Text></View>
        <View style={{width:150,margin:10}}><Text style={styles.cropName}>{item.dname}</Text>
        </View>
        <View style={{margin:10}}><Text style={styles.cropPrice}>Rs {item.price}</Text></View>
        
      </View>
        
      <TouchableOpacity style={styles.sellButton} onPress={()=>navigation.navigate('Details',{item,username})}>
        <Text style={styles.sellButtonText}>Sell it</Text>
      </TouchableOpacity>
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.headerText&& {height:50,color:'black',padding:10,fontSize:20,}]}>user_name</Text>
            </View>

      <View style={{ }}>
      <View style={{flexDirection:'row',height:50,backgroundColor:'#d9e4fc'}}>
      <View><Text style={{fontSize:20,color:'black',width:150,padding:10,borderColor:'black',}}>Sort</Text></View>
      <View><Text style={{fontSize:20,color:'black',width:150,padding:10}}>Filter</Text></View>
      <View><Text style={{fontSize:20,color:'black',width:150,padding:10}}>Category</Text></View>
  </View>
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
      </View>
      <FlatList
        data={newData}
        renderItem={({item})=>{
          // console.log(item)
          return renderCropItem(item)
        }}
        keyExtractor={item=>item._id}
        contentContainerStyle={styles.cropList}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#dee3df',
  },

  signOutButton: {
    backgroundColor: '#eb5985',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },  
  title: {
    fontSize: 20,
    color:'black',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:10,
    marginRight:10,
    color: '#333',
    padding:20,
    backgroundColor:'#d9e4fc',
  },
  signOutText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
  cropList: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor:'#d9e4fc',
  },
  cropItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  cropName: {
    fontSize: 21,
    marginBottom: 5,
    color: '#333',
  },
  cropPrice: {
    fontSize: 19,
    color: 'black',
  },
  sellButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cropIcon: {
    width: 60,
    height: 60,
    marginRight: 10,
    resizeMode: 'contain',
  },
  cropInfoContainer:{
    flexDirection: 'row',
    alignItems:'center'

  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor:'#96b4f2'
  },
});

export default HomeScreen;
