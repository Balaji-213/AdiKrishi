import React,{useState,useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity,Dimensions,BackHandler,Modal,FlatList,Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
const {width}=Dimensions.get('window')
import axios from 'axios';

const PendingOrder = ({navigation}) => {

  const route =useRoute();

  const {username} = route.params

  const [data,setData] = useState([])

  useEffect(()=>{
    try{
      axios.post('http://192.168.207.193:3000/getMyPO',({dname:username}))
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
  })


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

  
    const closeModal = () => {
      // Close the modal
      setShowModal(false);
    };

    const renderOrderItem = ({item}) => {
      return (
      <TouchableOpacity style={styles.orderItemContainer} onPress={() => handleOrderDetails(item)}>
        <Text style={styles.orderItemId}>Order ID: {item._id}</Text>
        <Text style={styles.orderItemDetails}>{item.cropname}</Text>
        <Text style={styles.orderItemDetails}>{item.quan}</Text>
        <Button title="Click for More Details" onPress={() => handleOrderClick(item)} />
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
        <View style={{margin:10,justifyContent:'center',alignItems:'center',borderWidth:1,backgroundColor:'black'}}>
            <Text style={{fontSize:20,color:'white'}}>Pending Order</Text>
        </View>
      <FlatList
        data={data}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
      />

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Order Details</Text>
          {selectedOrder && (
            <>
              <Text style={styles.modalText}>Order ID: {selectedOrder?._id || "N/A"}</Text>
              <Text style={styles.modalText}>Details: {selectedOrder?.crop || "N/A"}</Text>
              {/* Add more order details here */}
            </>
          )}
          <Button title="Close" onPress={closeModal} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});
export default PendingOrder;
