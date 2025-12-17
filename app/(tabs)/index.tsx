import { useUserContext } from '@/components/welcome/sign-up/UserContext';
import React from 'react';
import { Text, View } from 'react-native';

const SignUp = () => {
  const { user } = useUserContext();

  return (
    <View>
      <Text>You&apos;re in, {user?.username}!</Text>
    </View>
  )
}

export default SignUp