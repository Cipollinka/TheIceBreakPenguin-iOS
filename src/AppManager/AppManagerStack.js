import React, { useEffect, useState } from 'react';
import {NavigationContainer, NavigationIndependentTree, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AppManagerMain from './AppManagerMain';
import AppManagerChild from './AppManagerChild';
import PrivacyPolicyView from './PrivacyPolicyView';
import Storage from './Storage';

const StackInstance = createStackNavigator();

export default function AppManagerStack({dataLoad, userAgent}) {

  console.log(userAgent)
  const [isOpenPolicy, setOpenPolicy] = useState(false);
  const [linkToOpenPolicy, setLinkToOpenPolicy] = useState("");

  useEffect(() => {
    const getStorageData = async() => {
      const val = await Storage.get("privacyOpen");
      if (val) {
        setLinkToOpenPolicy(val)
        setOpenPolicy(true);
      } 
    }
    getStorageData();
  }, [])

  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <StackInstance.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isOpenPolicy ? "policy" : "main"}>
        <StackInstance.Screen
          name="main"
          component={AppManagerMain}
          initialParams={{data: dataLoad, userAgent: userAgent}}
        />
        <StackInstance.Screen name="policy" component={PrivacyPolicyView} initialParams={{link: linkToOpenPolicy}}/>
        <StackInstance.Screen name="child" component={AppManagerChild} />
      </StackInstance.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  );
}
