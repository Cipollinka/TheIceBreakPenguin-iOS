import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  Dimensions,
  SafeAreaView,
  StatusBar,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import WebView from 'react-native-webview';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingAppManager from './LoadingAppManager';

export default function AppManagerChild({navigation, route}) {
  const linkRefresh = route.params.data;
  const userAgent = route.params.userAgent;

  if (!linkRefresh || !linkRefresh.startsWith('http')) {
    console.log('AppManagerChild: invalid URL, going back', linkRefresh);
    navigation.goBack();
    return null;
  }
  const webViewRef = useRef(null);

  const insets = useSafeAreaInsets();

  const [isLandscape, setIsLandscape] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return width > height;
  });
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setIsLandscape(window.width > window.height);
    });
    return () => sub?.remove();
  }, []);

  const CLIPBOARD_INJECT_JS = `
    (function() {
      if (window.__clipboardPatched) return;
      window.__clipboardPatched = true;
      var orig = navigator.clipboard && navigator.clipboard.writeText;
      navigator.clipboard.writeText = function(text) {
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'clipboard', text: text}));
        return Promise.resolve();
      };
      var origExec = document.execCommand.bind(document);
      document.execCommand = function(cmd) {
        if (cmd === 'copy') {
          var sel = window.getSelection();
          if (sel && sel.toString()) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'clipboard', text: sel.toString()}));
          }
        }
        return origExec.apply(document, arguments);
      };
    })();
    true;
  `;

  const onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'clipboard' && data.text) {
        Clipboard.setString(data.text);
        console.log('Clipboard: copied', data.text);
      }
    } catch (_) {}
  };

  const redirectDomens = ['https://ninecasino.life/#deposit'];

  const openInBrowser = [
    'whatsapp://',
    'https://www.whatsapp.com/',
    'https://whatsapp.com/',
    'https://wa.me/',
    'https://wa.link/',
    'https://api.whatsapp.com/',
    'https://chat.whatsapp.com/',
    'https://business.whatsapp.com/',
    'https://web.whatsapp.com/',
  ];

      const [isTwoClick, setTwoClick] = useState(false);

  function backHandlerButton() {
        if (isTwoClick) {
            navigation.goBack();
            return;
        }
        setTwoClick(true);
        webViewRef.current.goBack();
        setTimeout(() => {
            setTwoClick(false);
        }, 500);
    }

  const checkLinkInArray = (link, array) => {
    try {
      for (let i = 0; i < array.length; i++) {
        if (link.includes(array[i])) {
          return true;
        }
      }
      return false;
    } catch (_) {
      return false;
    }
  };

  const openURLInBrowser = async url => {
    await Linking.openURL(url);
  };

  const onShouldStartLoadWithRequest = event => {
    console.log('CHILD_SHOULD_START_LOAD_WITH_REQUEST', event.url);

    if (
        event.url.startsWith('blob:') ||
        event.url.startsWith('data:') ||
        event.url === 'about:blank'
    ) {
      console.log('BLOCKED non-http URL to prevent crash:', event.url.substring(0, 100));
      return false;
    }

    if (event.url.includes('x-safari-https') || event.url.includes('itms-appss')) {
      Linking.openURL(event.url);
      navigation.goBack();
      return false;
    }

    if (checkLinkInArray(event.url, openInBrowser)) {
      openURLInBrowser(event.url);
      return false;
    }

    if (event.url.includes('pay.google')) {
      console.log('✅ Google Pay detected, opening current page in browser');
      if (currentURL) {
        console.log('Opening URL in browser:', currentURL);
        Linking.openURL(currentURL).catch(err => {
          console.error('Error opening current URL in browser:', err);
        });
      }
      return false;
    }

    if (event.url.includes('play.google.com/store/apps/details')) {
      openURLInBrowser(event.url);
      return false;
    }

    if (!(event.url.startsWith('https://') || event.url.startsWith('http://')) &&  event.url.split('://').length > 1) {
      Linking.openURL(event.url);
      return false;
    }

    if (checkLinkInArray(event.mainDocumentURL, redirectDomens)) {
      navigation.navigate('main');
      return false;
    }
    return true;
  };

  const [currentURL, setCurrentURL] = useState('');
  const checkURL = useRef('');

  function checkLockedURL(url) {
    setCurrentURL(url);
    setTimeout(() => {
      if (currentURL === 'about:blank') {
        navigation.goBack();
      }
    }, 2000);
  }

  const stateChange = navState => {
    const currentUrl = navState.url;
    console.log('MAIN_NAVIGATION_STATION_CHANGE', currentUrl);
    checkURL.current = currentUrl;
    checkLockedURL(currentUrl);
  };

  const timeoutRetryCount = useRef(0);
  const timeoutRetryTimer = useRef(null);
  const [webViewKey, setWebViewKey] = useState(0);
  const MAX_TIMEOUT_RETRIES = 2;

  useEffect(() => {
    return () => {
      if (timeoutRetryTimer.current) {
        clearTimeout(timeoutRetryTimer.current);
      }
    };
  }, []);

  const handleTimeoutError = () => {
    if (timeoutRetryTimer.current) {
      clearTimeout(timeoutRetryTimer.current);
    }

    try {
      webViewRef.current?.stopLoading();
    } catch (_) {}

    if (timeoutRetryCount.current < MAX_TIMEOUT_RETRIES) {
      timeoutRetryCount.current += 1;
      const delay = 1000 * timeoutRetryCount.current;
      console.log(`CHILD timeout (-1001), retry ${timeoutRetryCount.current}/${MAX_TIMEOUT_RETRIES} in ${delay}ms`);

      timeoutRetryTimer.current = setTimeout(() => {
        setWebViewKey(k => k + 1);
      }, delay);
    } else {
      console.log('CHILD timeout (-1001) max retries reached, going back');
      timeoutRetryCount.current = 0;
      navigation.goBack();
    }
  };


  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <StatusBar barStyle={'light-content'} translucent={false}/>
        <WebView
          key={webViewKey}
          originWhitelist={['*', 'http://*', 'https://*']}
          source={{uri: linkRefresh}}
          injectedJavaScript={CLIPBOARD_INJECT_JS}
          onMessage={onWebViewMessage}
          textZoom={100}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onNavigationStateChange={stateChange}
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          onLoad={() => {
            timeoutRetryCount.current = 0;
          }}
          onError={syntEvent => {
            const {nativeEvent} = syntEvent;
            const {code} = nativeEvent;
            if (code === -1101) {
              navigation.goBack();
            }
            if (code === -10) {
              Alert.alert(
                'Ooops',
                "It seems you don't have the bank app installed, wait for a redirect to the payment page",
              );
              navigation.goBack();
            }
            if (code === -1001) {
              handleTimeoutError();
            }
          }}
          renderError={() => (
            <View style={{flex: 1, backgroundColor: '#000'}}>
              <LoadingAppManager />
            </View>
          )}
          onOpenWindow={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            const {targetUrl} = nativeEvent;
            console.log('CHILD_OPEN_WINDOW', targetUrl);
          }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          allowFileAccess={true}
          showsVerticalScrollIndicator={false}
          javaScriptCanOpenWindowsAutomatically={true}
          style={{
            flex: 1,
          }}
          ref={webViewRef}
          userAgent={userAgent}
        />
      </SafeAreaView>
      <TouchableOpacity
          style={{
              width: 30,
              height: 30,
              position: 'absolute',
              bottom: 0,
              left: 25,
              alignItems: 'center',
              justifyContent: 'center',
          }}
          onPress={() => {
              backHandlerButton();
          }}>
          <Image
              source={require('./src/_back.png')}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
          />
      </TouchableOpacity>

      <TouchableOpacity
          style={{
              width: 30,
              height: 30,
              position: 'absolute',
              bottom: 5,
              right: 25,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
          }}
          onPress={() => {
              webViewRef.current.reload();
          }}>
          <Image
              source={require('./src/_reload.png')}
              style={{width: '90%', height: '90%', resizeMode: 'contain'}}
          />
      </TouchableOpacity>
    </View>
  );
}
