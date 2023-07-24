import React, { useState,useRef,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList,ScrollView, TextInput,TouchableOpacity,Dimensions,TouchableWithoutFeedback, Modal, Button,Animated, BackHandler } from 'react-native';
const {width}=Dimensions.get('window')
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const RequestQ = ({navigation}) => {
  const [orders, setOrders] = useState([
    { id: '001', details: 'Order details 001' },
    { id: '002', details: 'Order details 002' },
    { id: '003', details: 'Order details 003' },
    // Add more order objects as needed
  ]);
  const [Quantity, setQuantity] = useState('');
  const [selectedOption, setSelectedOption] = useState('kg');
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const route =useRoute();

  const {username} = route.params

  const [data,setData] = useState([])

  useEffect(()=>{
    try{
      axios.post('http://192.168.207.193:3000/getMyRequest',({dname:username}))
      .then(res=>{
        console.log(result)
        const result = res.data
        // console.log(result)
        setData(result)
      })
    }
    catch(err){
      console.log(err)
    }
  })

  const accept = async(item) =>{
    try{
      await axios.post('http://192.168.207.193:3000/acceptRequest',({id:item._id, quan:Quantity}));
    }
    catch(er){
      console.log(er)
    }
  }

  const cancel = async(item) =>{
    try{
      await axios.post('http://192.168.207.193:3000/cancelRequest',({id:item._id}));
    }
    catch(er){
      console.log(er)
    }   
  }

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

  const [quantityModalvisible,setQuantityModalvisible]= useState(false);
  const handleQuantityDetails = (order) => {
    setSelectedOrder(order);
    setQuantityModalvisible(true);
  };

  const closeQuantityModal = () => {
    setQuantityModalvisible(false);
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const renderOrderItem_Pending = ({ item }) => {
    return (
      <TouchableOpacity style={styles.orderItemContainer} onPress={() => handleOrderDetails(item)}>
        <Text style={styles.orderItemId}>Order ID: {item._id}</Text>
        <Text style={styles.orderItemDetails}>{item.cropname}</Text>
        <Text style={styles.orderItemDetails}>{item.quan}</Text>
        <Button title="Click for More Details" onPress={() => handleOrderDetails(item)} />
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          
          <TouchableOpacity style={{margin:5,width:90,marginLeft:0}} onPress={() => handleQuantityDetails(item)}>
            <Text style={{color:'white',backgroundColor:'black',fontSize:18,paddingLeft:20,borderWidth:1,borderColor:'red',borderRadius:90}}>Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin:5,width:90,marginLeft:0}} onPress={() => cancel(item)}>
            <Text style={{color:'white',backgroundColor:'black',fontSize:18,paddingLeft:20,borderWidth:1,borderColor:'red',borderRadius:90}}>Reject</Text>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    );
  };


  const renderOrderItem_Rejected = ({ item }) => {
    return (
      <TouchableOpacity style={styles.orderItemContainer} onPress={() => handleOrderDetails(item)}>
        <Text style={styles.orderItemId}>Order ID: {item.id}</Text>
        <Text style={styles.orderItemDetails}>{item.details}</Text>
        <Button title="Click for More Details" onPress={() => handleOrderDetails(item)} />
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

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
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
        data={orders}
        renderItem={renderOrderItem_Rejected}
        keyExtractor={(item) => item.id}
      />
      </View>
      


      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Order Details</Text>
          {selectedOrder && (
            <>
              <Text style={styles.modalText}>Order ID: {selectedOrder.id}</Text>
              <Text style={styles.modalText}>Details: {selectedOrder.details}</Text>
              {/* Add more order details here */}
            </>
          )}
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>

      

{/* quantity modall */}

      <Modal
        visible={quantityModalvisible}
        animationType="slide"
        onRequestClose={closeQuantityModal}
      >
        <View style={styles.modalContainer}>
          <View style={{flexDirection:'row'}}>
            <View>
            <Text style={[styles.modalHeading, {width:200}]}>Total Quantity available :</Text>

            </View>
            <View>
              {selectedOrder? <Text style={styles.modalHeading}>{selectedOrder.quan}</Text>: null }
            {/* <Text style={styles.modalHeading}>10kg</Text> */}

            </View>

          </View>
          <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:20}}>Enter Quantity: </Text>
          <TextInput placeholder='Quantity'  onChangeText={(text)=>setQuantity(text)} style={{borderWidth:1,height:32,fontSize:16,borderColor:'black',padding:8}}/>

          <View style={styles.optionContainer}>
        <View style={styles.radioButton}>
          <TouchableOpacity
            style={styles.radioButtonInner}
            onPress={() => handleOptionSelect('kg')}
          >
            {selectedOption === 'kg' && <View style={styles.radioButtonSelected} />}
          </TouchableOpacity>
          <Text style={styles.radioButtonLabel}>kg</Text>
        </View>
        <View style={styles.radioButton}>
          <TouchableOpacity
            style={styles.radioButtonInner}
            onPress={() => handleOptionSelect('unit')}
          >
            {selectedOption === 'unit' && <View style={styles.radioButtonSelected} />}
          </TouchableOpacity>
          <Text style={styles.radioButtonLabel}>unit</Text>
        </View>
      </View>
          </View>
          <Text style={{color:'red',marginBottom:5}}>Note: 1unit=10kg</Text>

            <View style={{marginBottom:5}}>
            <Button title="Order now" onPress={()=>{accept(selectedOrder)
            closeQuantityModal()
            }}  />
            </View>
          
          <Button title="Close" onPress={closeQuantityModal} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor:'#96b4f2'
    ,height:50,
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default RequestQ;
