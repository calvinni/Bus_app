import React from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const Home = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.MainContainer}>

        <View style={styles.headerContainer}>
          <Text style={styles.tempText}>Search for bus stop</Text>
          <View style={styles.button}>
            <Button
              title="Search"
            //   color="#f194ff"
            onPress={() => navigation.navigate("Search")}
            />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.FavText}>Favourites: {"\n"}</Text>
          
          <Text style={styles.Addstops} onPress={() => navigation.navigate("Addfavourites")}>Add more stops <AntDesign name="pluscircleo" size={18} color="black" /></Text>
        </View>
        
      </View>
    );
  };

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    // backgroundColor: '#1E90FF',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tempText: {
    fontSize: 35,
    // color: '#fff',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch'
 },
  
  bodyContainer: {
    flex: 5,
    
  },
  FavText: {
    fontSize: 35,
    // color: '#fff',
    // alignSelf: 'left',
    paddingLeft: 10,
  },
  bodyText: {
    
  },
  Addstops: {
    fontSize: 20,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  
});

export default Home;