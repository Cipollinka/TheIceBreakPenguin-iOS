import React, {useEffect, useRef, useState} from 'react';
import {
    Linking,
    Dimensions,
    SafeAreaView,
    StatusBar,
    View,
    Image,
    Alert,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import WebView from 'react-native-webview';
import Clipboard from '@react-native-clipboard/clipboard';

import LoadingAppManager from './LoadingAppManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Storage from './Storage'

export default function AppManagerMain({navigation, route}) {
    const linkRefresh = route.params.data;
    const userAgent = route.params.userAgent;

    const insets = useSafeAreaInsets();

    const [isLandscape, setIsLandscape] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return width > height;
    });
    useEffect(() => {
        const sub = Dimensions.addEventListener('change', ({ window }) => {
            setIsLandscape(window.width > window.height);
            if (isLandscape) webViewRef.current.reload();
        });
        return () => sub?.remove();
    }, []);

    const webViewRef = useRef(null);

    const redirectDomens = [
        'https://spin.city/payment/success?identifier=',
        'https://jokabet.com/',
        'https://winspirit.app/?identifier=',
        'https://rocketplay.com/api/payments',
        'https://ninewin.com/',
    ];

    const domensForBlock = [
        'bitcoin',
        'litecoin',
        'dogecoin',
        'tether',
        'ethereum',
        'bitcoincash',
    ];

    const openInBrowser = [
        'mailto:',
        'itms-appss://',
        'https://m.facebook.com/',
        'https://www.facebook.com/',
        'https://www.instagram.com/',
        'https://twitter.com/',
        'https://x.com/',
        'https://www.whatsapp.com/',
        'https://whatsapp.com/',
        'https://wa.me/',
        'https://wa.link/',
        'https://api.whatsapp.com/',
        'https://chat.whatsapp.com/',
        'https://business.whatsapp.com/',
        'https://web.whatsapp.com/',
        'https://t.me/',
        'fb://',
        'whatsapp://',
        'twitter://',
        'x-twitter://',
        'conexus://',
        'bmoolbb://',
        'cibcbanking://',
        'bncmobile://',
        'rbcmobile://',
        'scotiabank://',
        'pcfbanking://',
        'rbcbanking',
        'tdct://',
        'nl.abnamro.deeplink.psd2.consent://',
        'nl-snsbank-sign://',
        'nl-asnbank-sign://',
        'triodosmobilebanking',
        'intent://',
        'paytmmp://',
        'paytmp://',
        'upi://',
        'phonepe://',
        'tez://',
        'monzo://',
        'nl-asnbank-ideal://',
        'bunq://',
        'market://',
        'https://rmpy.adj.st/wallet/',
        'x-safari-https'
    ];

    const openURLInBrowser = async url => {
        await Linking.openURL(url);
    };

    const checkLinkInArray = (link, array) => {
        for (let i = 0; i < array.length; i++) {
            if (link.includes(array[i])) {
                return true;
            }
        }
        return false;
    };

    const CLIPBOARD_INJECT_JS = `
      (function() {
        if (window.__clipboardPatched) return;
        window.__clipboardPatched = true;
        var orig = navigator.clipboard && navigator.clipboard.writeText;
        navigator.clipboard.writeText = function(text) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'clipboard', text: text}));
          return Promise.resolve();
        };
        // Also patch execCommand('copy') for older implementations
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

    const [currentURL, setCurrentURL] = useState('');
    const checkURL = useRef('');

    function checkLockedURL(url) {
        setCurrentURL(url);
        setTimeout(() => {
            if (currentURL === 'about:blank') {
                webViewRef.current.injectJavaScript(
                    `window.location.replace('${linkRefresh}')`,
                );
            }
        }, 2000);
    }

    async function saveOpenPrivacyParam (link) {
        await Storage.save("privacyOpen", link);
        navigation.navigate("policy", {link});
    }


    const onShouldStartLoadWithRequest = event => {
        let currentUrl = event.url;
        console.log('MAIN_SHOULD_START_LOAD_WITH_REQUEST', currentUrl);

        if (
            currentUrl.startsWith('blob:') ||
            currentUrl.startsWith('data:') ||
            currentUrl === 'about:blank' || 
            currentUrl === 'https://www.facebook.com/tr/'
        ) {
            console.log('BLOCKED non-http URL to prevent crash:', currentUrl.substring(0, 100));
            return false;
        }

        if (currentUrl.startsWith('https://www.termsfeed.com/')) {
            saveOpenPrivacyParam(currentUrl);
            return false;
        }

        if (currentUrl.includes('pay.google')) {
            console.log('✅ Google Pay detected, opening current page in browser');
            if (currentURL) {
                console.log('Opening URL in browser:', currentURL);
                Linking.openURL(currentURL).catch(err => {
                    console.error('Error opening current URL in browser:', err);
                });
            }
            return false;
        }

        if (!(currentUrl.startsWith('https://') || currentUrl.startsWith('http://')) &&  currentUrl.split('://').length > 1) {
            Linking.openURL(currentUrl);
            return false;
        }

        try {
            if (
                event.url.includes('interac.express-connect.com') ||
                event.url.includes('https://linx24.com/') ||
                event.url.includes(
                    'https://bankieren.rabobank.nl/consent/jump-to/start?',
                ) ||
                event.url.includes('api.payment-gateway.io/app/de/paymentPage')
                || event.url.includes('https://www.payzoff.com/payment') ||
                event.url.includes('https://bpglobalfav.live/pay/') ||
                event.url.includes('https://api.paymentapi111.com/payoption/')
            ) {
                navigation.navigate('child', {
                    data: event.url,
                    userAgent: route.params.userAgent,
                });
                webViewRef.current.injectJavaScript(
                    `window.location.replace('${linkRefresh}')`,
                );
            }
        } catch (_) {
        }
        try {
            if (
                !(
                    event.mainDocumentURL.includes('pay.skrill.com') ||
                    event.mainDocumentURL.includes('app.corzapay.com')
                )
            ) {
            } else {
                navigation.navigate('child', {data: event.mainDocumentURL});
                webViewRef.current.injectJavaScript(
                    `window.location.replace('${linkRefresh}')`,
                );
            }
        } catch (error) {
        }

        if (checkLinkInArray(currentUrl, openInBrowser)) {
            webViewRef.current.stopLoading();
            openURLInBrowser(currentUrl);
            webViewRef.current.injectJavaScript(
                `window.location.replace('${linkRefresh}')`,
            );
        }

        if (checkLinkInArray(currentUrl, redirectDomens)) {
            webViewRef.current.injectJavaScript(
                `window.location.replace('${linkRefresh}')`,
            );
        }

        if (checkLinkInArray(currentUrl, domensForBlock)) {
            webViewRef.current.stopLoading();
            return false;
        }
        return true;
    };

    const stateChange = navState => {
        const currentUrl = navState.url;
        console.log('MAIN_NAVIGATION_STATION_CHANGE', currentUrl);
        checkURL.current = currentUrl;
        checkLockedURL(currentUrl);
    };

    const [isDoubleClick, setDoubleClick] = useState(false);

    const isBackClick = () => {
        if (isDoubleClick) {
            webViewRef.current.injectJavaScript(
                `window.location.replace('${linkRefresh}')`,
            );
        } else {
            webViewRef.current.goBack();
            setDoubleClick(true);
        }
        setTimeout(() => {
            setDoubleClick(false);
        }, 400);
    };

    const [toastText, setToastText] = useState(null);
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (text) => {
        setToastText(text);
        Animated.sequence([
            Animated.timing(toastOpacity, {toValue: 1, duration: 200, useNativeDriver: true}),
            Animated.delay(1800),
            Animated.timing(toastOpacity, {toValue: 0, duration: 300, useNativeDriver: true}),
        ]).start(() => setToastText(null));
    };

    const [isInit, setInit] = React.useState(true);
    const [isLoadingPage, setLoadingPage] = useState(true);
    const [isInvisibleLoader, setInvisibleLoader] = useState(false);

    const finishLoading = () => {
        if (!isInit) {
            setInit(true);
        } else {
            setLoadingPage(false);
            setInvisibleLoader(true);
        }
    };

    const timeoutRetryCount = useRef(0);
    const timeoutRetryTimer = useRef(null);
    const [webViewKey, setWebViewKey] = useState(0);
    const MAX_TIMEOUT_RETRIES = 3;

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

        setLoadingPage(true);
        setInvisibleLoader(false);

        try {
            webViewRef.current?.stopLoading();
        } catch (_) {}

        if (timeoutRetryCount.current < MAX_TIMEOUT_RETRIES) {
            timeoutRetryCount.current += 1;
            const delay = 1000 * timeoutRetryCount.current;
            console.log(`Timeout (-1001), retry ${timeoutRetryCount.current}/${MAX_TIMEOUT_RETRIES} in ${delay}ms`);

            timeoutRetryTimer.current = setTimeout(() => {
                setWebViewKey(k => k + 1);
            }, delay);
        } else {
            console.log('Timeout (-1001) max retries reached, remounting WebView');
            timeoutRetryCount.current = 0;
            timeoutRetryTimer.current = setTimeout(() => {
                setWebViewKey(k => k + 1);
            }, 2000);
        }
    };


    return (
        <>
            <View style={{flex: 1}}>
                <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
                    <StatusBar barStyle={'light-content'} translucent={false}/>
                    <WebView
                        key={webViewKey}
                        originWhitelist={[
                            '*',
                            'http://*',
                            'https://*',
                            'intent://*',
                            'tel:*',
                            'mailto:*',
                            'itms-appss://*',
                            'https://m.facebook.com/*',
                            'https://www.facebook.com/*',
                            'https://www.instagram.com/*',
                            'https://twitter.com/*',
                            'https://x.com/*',
                            'https://www.whatsapp.com/*',
                            'https://t.me/*',
                            'fb://*',
                        ]}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        onNavigationStateChange={stateChange}
                        source={{uri: linkRefresh}}
                        injectedJavaScript={CLIPBOARD_INJECT_JS}
                        onMessage={onWebViewMessage}
                        textZoom={100}
                        allowsBackForwardNavigationGestures={true}
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                        onLoadStart={() => setLoadingPage(true)}
                        onLoadEnd={() => finishLoading()}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        onLoad={event => {
                            console.log('Load event', event);
                            timeoutRetryCount.current = 0;
                        }}
                        onError={syntEvent => {
                            const {nativeEvent} = syntEvent;
                            const {code} = nativeEvent;
                            if (code === -1002) {
                                Alert.alert(
                                    'Ooops',
                                    "It seems you don't have the bank app installed, wait for a redirect to the payment page",
                                );
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
                            console.log('MAIN_OPEN_WINDOW', targetUrl);
                            // if (!targetUrl) return;
                            if (!targetUrl.startsWith('http')) {
                                console.log('MAIN_OPEN_WINDOW: blocked non-http URL', targetUrl.substring(0, 100));
                                return;
                            }
                            // if (checkLinkInArray(targetUrl, domensForBlock)) {
                            //     Clipboard.setString(targetUrl.toString().split(":")[1]);
                            //     showToast('Address copied');
                            //     console.log('MAIN_OPEN_WINDOW: crypto address copied', targetUrl);
                            //     return;
                            // }
                            if (checkLinkInArray(targetUrl, openInBrowser)) {
                                openURLInBrowser(targetUrl);
                                return;
                            }
                            navigation.navigate('child', {
                                data: targetUrl,
                                userAgent: route.params.userAgent,
                            });
                        }}
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
                onPress={isBackClick}>
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
                    bottom: 0,
                    right: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 5,
                }}
                onPress={() => {
                    webViewRef.current.reload();
                    setLoadingPage(true);
                }}>
                <Image
                    source={require('./src/_reload.png')}
                    style={{width: '90%', height: '90%', resizeMode: 'contain'}}
                />
                </TouchableOpacity>
            </View>
            {isLoadingPage && !isInvisibleLoader ? <LoadingAppManager/> : <></>}
            {toastText && (
                <Animated.View style={{
                    position: 'absolute',
                    bottom: 50,
                    alignSelf: 'center',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    opacity: toastOpacity,
                }}>
                    <Text style={{color: '#fff', fontSize: 14}}>{toastText}</Text>
                </Animated.View>
            )}
        </>
    );
}
