import React,{useState,useEffect,useRef} from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text,Button, StyleSheet, TouchableOpacity,Dimensions,BackHandler,Modal,FlatList,TextInput,Animated,ScrollView,TouchableWithoutFeedback } from 'react-native';
const {width}=Dimensions.get('window')
import axios from 'axios';

const ReqNRej = ({navigation}) => {

  const animation=useRef(new Animated.Value(0)).current;
  const scrollView=useRef()
  const pendingColorInterpolate=animation.interpolate({
    inputRange:[0,width],
    outputRange:['rgba(27,27,51,1)','rgba(27,27,51,0.4)']

  });
  const rejectedColorInterpolate=animation.interpolate({
    inputRange:[0,width],
    outputRange:['rgba(27,27,51,0.4)','rgba(27,27,51,1 )']

  });

  const route =useRoute();

  const {username} = route.params

  const [data,setData] = useState([])
  const [rejData,setRejData] = useState([])

  useEffect(()=>{
    try{
      axios.post('http://192.168.207.193:3000/getMyFaRequest',({fname:username}))
      .then(res=>{
        // console.log(result)
        const result = res.data
        // console.log(result)
        setData(result)
      })
    }
    catch(err){
      console.log(err)
    }
  },[])

  useEffect(()=>{
    try{
      axios.post('http://192.168.207.193:3000/getMyFaReject',({fname:username}))
      .then(res=>{
        // console.log(result)
        const result = res.data
        // console.log(result)
        setRejData(result)
      })
    }
    catch(err){
      console.log(err)
    }
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
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };
    const handleOrderClick = (item) => {
      // Set the selected order and show the modal
      setSelectedOrder(item);
      setShowModal(true);
    };

    // console.log(selectedOrder)

  
    const handleCloseModal = () => {
      // Close the modal
      setShowModal(false);
    };

    const renderOrderItem_Pending = ({item}) => {
      return (
        <TouchableOpacity
          style={styles.orderTile}
          onPress={() => handleOrderClick(item)}
        >
          <Text style={styles.orderItemId}>Order.ID:{item._id}</Text>
          <Text style={styles.orderItemId}>Crop Name:{item.cropname}</Text>
          <Text style={styles.orderItemId}>Quan:{item.quan}</Text>
          <Text style={styles.orderText}>Click for More Details</Text>

          {/* <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          
          <TouchableOpacity style={{margin:5,width:100,marginLeft:0}}>
            <Text style={{color:'white',backgroundColor:'black',fontSize:18,paddingLeft:15,borderWidth:1,borderColor:'red',borderRadius:90}}>Approve</Text>
          </TouchableOpacity>
          <View style={{margin:5,}}>
          <TouchableOpacity style={{width:100,marginLeft:0,}}>
            <Text style={{color:'white',backgroundColor:'black',fontSize:18,paddingLeft:20,borderWidth:1,borderColor:'red',borderRadius:90}}>Reject</Text>
          </TouchableOpacity>

          </View>

        </View> */}
        </TouchableOpacity>
      );
    };

    const renderOrderItem_Rejected = ({item}) => {
      return (
        <TouchableOpacity
          style={styles.orderTile}
          onPress={() => handleOrderClick(item)}
        >
          <Text style={styles.orderItemId}>Order.ID:{item._id}</Text>
          <Text style={styles.orderItemId}>Crop Name:{item.cropname}</Text>
          <Text style={styles.orderItemId}>Quan:{item.quan}</Text>
          <Text style={styles.orderText}>Click for More Details</Text>

          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          
          <View style={{margin:5,}}>
          <TouchableOpacity style={{width:100,marginLeft:0,}}>
            <Text style={{color:'white',backgroundColor:'black',fontSize:18,paddingLeft:20,borderWidth:1,borderColor:'red',borderRadius:90}}>Rejected</Text>
          </TouchableOpacity>

          </View>

        </View>
        </TouchableOpacity>
      );
    };


    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
            <Text style={styles.menuIconText}>&#9776;</Text>
          </TouchableOpacity>
          <Text style={[styles.headerText&& {height:50,color:'black',padding:10,fontSize:20,}]}>Dashboard</Text>
        </View>
        
        <View style={{flexDirection:'row',paddingLeft:20,paddingRight:20}}>
        <TouchableWithoutFeedback onPress={()=>  scrollView.current.scrollTo({x:0})}>
          {/* add animated in view and change background color and above onPress*/}
          <Animated.View style={{height:45,width:'50%',borderTopLeftRadius:8,borderBottomLeftRadius:8,
                                  backgroundColor:pendingColorInterpolate,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'white',fontSize:18,}}>Pending Order</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>  scrollView.current.scrollTo({x:width})}>
          {/* add animated in view and change background color  and above onPress*/}
          <Animated.View style={{height:45,width:'50%',borderTopRightRadius:8,borderBottomRightRadius:8,
                      backgroundColor:rejectedColorInterpolate,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'white',fontSize:18}}>Rejected Order</Text>
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


        {/* for pending  */}
        <View style={{width:Dimensions.get('window').width}}>
      <FlatList
        data={data}
        renderItem={renderOrderItem_Pending}
        keyExtractor={(item) => item._id}
      />
      </View>
      
      {/* for rejected order */}
        <View style={{width:Dimensions.get('window').width}}>
      <FlatList
        data={rejData}
        renderItem={renderOrderItem_Rejected}
        keyExtractor={(item) => item._id}
      />
      </View>


      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Order Details</Text>
            <Text style={styles.modalText}>Order ID: {selectedOrder?.crop || 'N/A'}</Text>
            <Text style={styles.modalText}>Name:Aryan</Text>
            <Text style={styles.modalText}>Mobile No.: 1234567890</Text>
            {/* Add more order details here */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


        {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity  style={styles.menuItem} onPress={() => {navigation.navigate('Dash')}}>
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
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
  
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    orderItemContainer: {
      backgroundColor: '#f2f2f2',
      padding: 20,
      marginBottom: 10,
      borderRadius: 8,
    },
    orderItemId: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    orderItemDetails: {
      fontSize: 14,
      marginTop: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    modalHeading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 10,
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
export default ReqNRej;
