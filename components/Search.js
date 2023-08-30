import React from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const Search = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.MainContainer}>

        <View style={styles.headerContainer}>
          <Text style={styles.tempText}>Test</Text>
          <View style={styles.button}>
            <Button
              title="Search"
            //   color="#f194ff"
              onPress={() => Alert.alert('Button with adjusted color pressed')}
            />
          </View>
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
    paddingT: 25,
  },
  FavText: {
    fontSize: 35,
    // color: '#fff',
    alignItems: 'left',
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

export default Search;