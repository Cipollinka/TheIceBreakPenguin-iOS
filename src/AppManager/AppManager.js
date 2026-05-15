import React, { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';

import LocalStorage from './Storage';
import EventManager from './EventsManager';
import { OneSignal } from 'react-native-onesignal';
import * as Device from 'react-native-device-info';
import AppleAdsAttributionInstance from '@vladikstyle/react-native-apple-ads-attribution';
import Params from './Params';

import StackManager from './AppManagerStack';
import SpinnerRoot from './LoaderRoot';
import App from '../../App';

const log = (...args) => console.log('[AppManager]', ...args);
const logOS = (...args) => console.log('[OneSignal]', ...args);
const logAF = (...args) => console.log('[AppsFlyer]', ...args);

export default function AppManager() {
  const ViewSpinner = <SpinnerRoot/>;;
  const ViewGame = <App />
  const ViewStack = (lnk, ua) => <StackManager dataLoad={lnk} userAgent={ua} />;

  const [busy, setBusy] = useState(true);
  const [showGame, setShowGame] = useState(true);

  const rUser = useRef(null);
  const rAdId = useRef(null);
  const rAfUID = useRef(null);
  const rSubs = useRef(null);
  const rOsId = useRef(null);
  const rDeviceId = useRef(null);
  const rPushGranted = useRef(false);
  const rFinalUrl = useRef(null);
  const rUA = useRef(null);
  const rExtraMark = useRef(null);
  const rUnityParams = useRef(null);
  const rInstallRef = useRef(null);
  const rAfInfo = useRef(null);

  const genUser = async () => {
    log('genUser: start');
    const saved = await LocalStorage.get('userID');
    if (saved) {
      rUser.current = saved;
      log('genUser: found existing userID', saved);
      return;
    }
    const rnd = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
    rUser.current = `${Date.now()}-${rnd}`;
    await LocalStorage.save('userID', rUser.current);
    log('genUser: generated new userID', rUser.current);
  };

  const resolveAdId = async () => {
    log('resolveAdId: start');
    rAdId.current = '00000000-0000-0000-0000-000000000000';
    log('resolveAdId: set zero IDFA');
    decideStart();
  };

  const firstPing = async () => {
    log('firstPing: start, sending firstOpen event');
    try {
      const res = await fetch(Params.bodyLin, {headers: {'User-Agent': rUA.current}});
      log('firstPing: fetch finished', { status: res.status, url: Params.bodyLin });
      if (res.status === 200) {
        EventManager.sendEvent(EventManager.eventList.firstOpen);
        log('firstPing: status 200, initOneSignal()');
        await initOneSignal();
      } else {
        log('firstPing: non-200 status, openGame()');
        openGame();
      }
    } catch (e) {
      log('firstPing: fetch error, openGame()', e?.message);
      openGame();
    }
  };

  const initOneSignal = async () => {
    logOS('initOneSignal: start');
    try {
      const canAsk = await OneSignal.Notifications.canRequestPermission();
      logOS('canRequestPermission result', canAsk);

      if (canAsk) {
        const granted = await OneSignal.Notifications.requestPermission(true);
        rPushGranted.current = granted;
        logOS('requestPermission result', granted);
        logOS('initOneSignal: calling initAppsFlyer after permission flow');
        await initAppsFlyer();
      } else {
        logOS('initOneSignal: cannot request permission, skipping requestPermission');
        await initAppsFlyer();
      }

      logOS('adding tag timestamp_user_id', rUser.current);
      OneSignal.User.addTag('timestamp_user_id', rUser.current);
    } catch (e) {
      logOS('initOneSignal: error', e?.message);
      try {
        await initAppsFlyer();
      } catch (err) {
        logAF('initAppsFlyer from initOneSignal fallback error', err?.message);
      }
    }
  };

  const makeSubs = v => {
    if (!v) return '';
    const arr = v.split('_');
    if (arr.length === 1 && arr[0] !== 'asa') return '';
    const res = arr.map((s, idx) => `sub_id_${idx + 1}=${s}`).join('&');
    log('makeSubs:', v, '→', res);
    return res;
  };

  const composeAndStoreUrl = () => {
    log('composeAndStoreUrl: start');
    OneSignal.User.getOnesignalId().then(osId => {
      logOS('getOnesignalId result', osId);
      OneSignal.login(rUser.current);
      logOS('login with userID', rUser.current);

      rOsId.current = osId;

      const token = Params.bodyLin.split('.')[1]?.split('/')[1];
      const head = `?${token}=1`;

      const subs = makeSubs(rSubs.current);
      const parts = [
        head,
        // `appsID=${rAfUID.current}`,
        // `adID=${rAdId.current}`,
        `onesignalID=${rOsId.current}`,
        // `deviceID=${rDeviceId.current}`,
        // subs,
        // `&info=${rAfInfo}`,
        `timestamp=${rUser.current}`,
        // `userID=${rDeviceId.current}`,
      ].filter(Boolean).join('&');

      rFinalUrl.current = Params.bodyLin + parts;
      LocalStorage.save('link', rFinalUrl.current);
      log('composeAndStoreUrl: finalUrl', rFinalUrl.current, {
        extraMark: rExtraMark.current,
        unityParams: rUnityParams.current,
        subs: rSubs.current,
        installRef: rInstallRef.current,
      });
      showWeb(true);
    }).catch(e => {
      logOS('getOnesignalId error in composeAndStoreUrl', e?.message);
      openGame();
    });
  };

  const showWeb = first => {
    log('showWeb: start', { first, pushGranted: rPushGranted.current, finalUrl: rFinalUrl.current });

    if (!rFinalUrl.current || !rFinalUrl.current.startsWith('http')) {
      log('showWeb: invalid finalUrl, fallback to openGame');
      openGame();
      return;
    }

    if (first && rPushGranted.current) {
      log('showWeb: sending push event');
      EventManager.sendEvent(EventManager.eventList.push);
    }
    log('showWeb: sending web event');
    EventManager.sendEvent(EventManager.eventList.web);
    setShowGame(false);
    setBusy(false);
    log('showWeb: state updated, showGame=false, busy=false');
  };

  const initAppsFlyer = async () => {
    logAF('initAppsFlyer: start');
    try {
      
      logAF('initSdk called with conversionDataListener = true');
      logAF('setAdditionalData af_referrer_custom', rInstallRef.current);
      composeAndStoreUrl();
    } catch (e) {
      logAF('initAppsFlyer: error', e?.message);
    }
  };

  const decideStart = async () => {
    log('decideStart: start');
    const cached = await LocalStorage.get('link');
    log('decideStart: cached link', cached);
    if (cached && cached.startsWith('http')) {
      log('decideStart: cached link found');
      rFinalUrl.current = cached;
      showWeb(false);
    } else {
      log('decideStart: no cached link, going to firstPing()');
      firstPing();
    }
  };

  const getAsaAttribution = async () => {
    try {
      const adServicesAttributionData = await AppleAdsAttributionInstance.getAdServicesAttributionData();
      if (adServicesAttributionData?.attribution) {
        rAfInfo.current = JSON.stringify(adServicesAttributionData);
        rSubs.current = 'asa';
        console.log('[getAsaAttribution] ASA attribution:', rAfInfo.current);
      } else {
        rAfInfo.current = 'ORGANIC';
        console.log('[getAsaAttribution] ORGANIC');
      }
    } catch (e) {
      rAfInfo.current = 'ORGANIC';
      console.log('[getAsaAttribution] error, set ORGANIC:', e);
    }
  };

  const openGame = () => {
    log('openGame: will show game after delay');
    setTimeout(() => {
      setShowGame(true);
      setBusy(false);
      log('openGame: state updated, showGame=true, busy=false');
    }, 2500);
  };

  const bootstrap = async () => {
    log('bootstrap: start');
    await genUser();
    logOS('OneSignal.initialize with key', Params.keyOnesignal);
    OneSignal.initialize(Params.keyOnesignal);

    // Запитуємо push permission одразу після initialize — це реєструє юзера в дашборді
    try {
      const pushGranted = await OneSignal.Notifications.requestPermission(true);
      rPushGranted.current = pushGranted;
      logOS('bootstrap: push permission result', pushGranted);
    } catch (e) {
      logOS('bootstrap: push permission error', e?.message);
    }

    setTimeout(() => {
      logOS('bootstrap: setting up notification click listener');
      let tapped = false;
      let deepUrl = null;

      OneSignal.Notifications.addEventListener('click', e => {
        tapped = true;
        deepUrl = e.notification.launchURL || null;
        logOS('Notification click event', {
          launchURL: deepUrl,
          additionalData: e.notification?.additionalData,
        });
      });

      setTimeout(() => {
        log('bootstrap: second timeout triggered, EventManager.setParams', rUser.current);
        EventManager.setParams(rUser.current);

        if (tapped) {
          logOS('bootstrap: notification was tapped, handling push flow');
          LocalStorage.get('link').then(v => {
            log('bootstrap: cached link for push flow', v);
            rFinalUrl.current = v + '&push=true';
            if (deepUrl) {
              logOS('bootstrap: deepUrl exists, open browser', deepUrl);
              EventManager.sendEvent(EventManager.eventList.browser);
              Linking.openURL(deepUrl);
            } else {
              logOS('bootstrap: no deepUrl, send web_push event');
              EventManager.sendEvent(EventManager.eventList.web_push);
            }
            showWeb(false);
          });
        } else {
          log('bootstrap: no notification tap, go to device/UA/AdId resolve');
          (async () => {
            try {
              rDeviceId.current = await Device.getUniqueId();
              rUA.current = await Device.getUserAgent();
              log('bootstrap: device info', {
                deviceId: rDeviceId.current,
                userAgent: rUA.current,
              });
              await resolveAdId();
            } catch (e) {
              log('bootstrap: error getting device info, fallback resolveAdId only', e?.message);
              await resolveAdId();
            }
          })();
        }
      }, 500);
    }, 200);
  };

  useEffect(() => {
    log('useEffect: mount, starting init flow');
    getAsaAttribution();
    bootstrap();

    return () => {
      log('useEffect: unmount (if needed clean listeners manually)');
    };
  }, []);

  if (busy) {
    log('render: busy=true, show spinner');
    return ViewSpinner;
  }

  log('render: busy=false, showGame=', showGame, 'finalUrl=', rFinalUrl.current);
  return showGame ? ViewGame : ViewStack(rFinalUrl.current, rUA.current);
}