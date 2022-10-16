import React, { useEffect } from 'react';
import { Komponen } from '../Hooks';
import { View } from 'react-native';
import { apiDATA } from '../Data';

const TempApp = ({ children, backgroundColor = '#FFDAB9', ...rest }) => {
  const init = apiDATA((store) => store.init);
  useEffect(() => {
    init();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor
      }}
      {...rest}
    >
      {children}
    </View>
  );
};

export default function AppView(props) {
  const SafeView = Komponen(TempApp, props);
  return <SafeView />;
}