import Realm from 'realm';
import {realmAppID} from '../includes/variables/dbAPIVariables'

// Returns the shared instance of the Realm app.
export function getRealmApp() {
   const appId = realmAppID; // Set Realm app ID here.
   const appConfig = {
     id: appId,
     timeout: 30000,
   };

   const app = new Realm.App(appConfig);
   return app;
}

export let app = getRealmApp();