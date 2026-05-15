import React, {useEffect, useState} from "react";
import { Pressable, View, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import Storage from './Storage';
import App from "../../App";

export default function PrivacyPolicyView({navigation, route}) {

    const policiLink = route.params.link;
    const [isClickOnAccept, setClickOnAccept] = useState(false);
    

    useEffect(() => {
        const getStorageData = async() => {
          const val = await Storage.get("privacyOpen");
          if (val) {
            setClickOnAccept(true);
          } 
        }
        getStorageData();
      }, [])

    if (isClickOnAccept) return <App />

    return <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, width: '100%', height:'80%', position: 'absolute', top: 0, alignSelf: 'center'}}>
            <WebView 
                source={{uri: policiLink}}
                style={{flex: 1, width: '100%', height: '100%', position: 'absolute'}}
            />
        </View>

        <Pressable onPress={()=> {setClickOnAccept(true)}} style={{position: 'absolute', bottom: '5%', alignSelf: 'center', width: '90%', height: '10%', backgroundColor: 'orange', borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>I Agree</Text>
        </Pressable>
    </SafeAreaView>
}