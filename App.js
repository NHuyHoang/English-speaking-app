import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Record from './src/containers/RecordSection';
import Guideline from './src/containers/Guideline/Guideline';
import Test1 from './src/containers/Test1/Test1';
import { StackNavigator } from 'react-navigation'

export default class App extends React.Component {
  render() {
    return <RootStack style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const RootStack = StackNavigator(
  {
    Home: {
      screen: Guideline,
    },
    Test1: {
      screen: Test1,
      header:{
        headerStyle: { height: 40 }
      }
    },
    
  },
  {
    initialRouteName: 'Home',
  }
);
