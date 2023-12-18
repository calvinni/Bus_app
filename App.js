import React, {useEffect, useState} from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ActivityIndicator, FlatList, Text, View, StyleSheet} from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Home from './components/Home';
import Addfavourites from './components/Favourites';
import Search from './components/Search';
import Details from './components/Details';
import Settings from './components/Settings';

const App = () => {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} options={({ route, navigation }) => ({ 
          title: "Home", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Addfavourites' component={Addfavourites} options={({ route, navigation }) => ({ 
          title: "Addfavourites", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Search' component={Search} options={({ route, navigation }) => ({ 
          title: "Search", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Details' component={Details} options={({ route, navigation }) => ({ 
          title: "Details", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Settings' component={Settings} options={{ title: "Settings", headerTitleAlign: "center", }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;