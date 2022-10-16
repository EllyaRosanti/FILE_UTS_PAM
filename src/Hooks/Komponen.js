import React, { useEffect, useRef } from 'react';

export default function Komponen(Component, props) {
  const propsRef = useRef(props);
  propsRef.current = props;
  useEffect(() => {
    propsRef.current = null;
  }, []);
  return useRef(() => {
    const props = propsRef.current;
    if (props === null) {
      throw new Error(
        'Komponen yang dikembalikan harus dirender dalam fase renderer yang sama dengan hook'
      );
    }
    return <Component {...props} />;
  }).current;
}