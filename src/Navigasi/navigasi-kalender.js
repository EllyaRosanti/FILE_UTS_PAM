import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { cssnavigasicalender } from './cssnavigasicalender';

import Routes from './routes';
import { Buat_Data, Home } from '../Home';

const Stack = createStackNavigator();

function Navigasi_Utama() {
  return (
    <Stack.Navigator {...cssnavigasicalender}>
      <Stack.Screen component={Home} name={Routes.HOME} />
      <Stack.Screen component={Buat_Data} name={Routes.BUAT_DATA} />
    </Stack.Navigator>
  );
}

const Navigasi_Kalender = React.forwardRef((props, ref) => (
  <NavigationContainer ref={ref}>
    <Navigasi_Utama initialRoute={props.initialRoute} />
  </NavigationContainer>
));

Navigasi_Kalender.displayName = 'Navigasi_Kalender';

export default React.memo(Navigasi_Kalender);