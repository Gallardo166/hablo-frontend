import { useSignUpContext } from '@/components/welcome/sign-up/SignUpContext';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

type AccountDetailErrorsType = {
  username: string; // cannot be empty, at most 100 chars long
  password: string; // cannot be empty, at least eight chars long
  confirmPassword: string; // must be equal to password
}

const AccountDetails = () => {
  const { username, password, confirmPassword, setUsername,
          setPassword, setConfirmPassword, handleSubmit, error } = useSignUpContext();
  const [errors, setErrors] = useState<AccountDetailErrorsType>({username: "", password: "", confirmPassword: ""})

  function handleUsernameChangeText(text: string) {
    setUsername(text);
    if (!text) {
      setErrors(errors => ({...errors, username: "Username must not be empty."}));
    } else if (text.length > 100) {
      setErrors(errors => ({...errors, username: "Username must be at most 100 characters."}))
    } else {
      setErrors(errors => ({...errors, username: ""}));
    }
  }

  function handlePasswordChangeText(text: string) {
    setPassword(text);
    if (text !== confirmPassword) {
      setErrors(errors => ({...errors, confirmPassword: "Passwords are not equal."}));
    } else {
      setErrors(errors => ({...errors, confirmPassword: ""}));
    }
    if (!text) {
      setErrors(errors => ({...errors, password: "Password must not be empty."}));
    } else if (text.length < 8) {
      setErrors(errors => ({...errors, password: "Password must be at least 8 characters"}));
    } else {
      setErrors(errors => ({...errors, password: ""}));
    }
  }

  function handleConfirmPasswordChangeText(text: string) {
    setConfirmPassword(text);
    if (text !== password) {
      setErrors(errors => ({...errors, confirmPassword: "Passwords are not equal"}));
    } else {
      setErrors(errors => ({...errors, confirmPassword: ""}));
    }
  }

  return (
    <View>
      <TextInput placeholder="Username" defaultValue={username} onChangeText={handleUsernameChangeText} />
      {errors.username ? <Text>{errors.username}</Text> : null}
      <TextInput placeholder="Password" defaultValue={password} onChangeText={handlePasswordChangeText} />
      {errors.password ? <Text>{errors.password}</Text> : null}
      <TextInput placeholder="Confirm password" defaultValue={confirmPassword} onChangeText={handleConfirmPasswordChangeText} />
      {errors.confirmPassword ? <Text>{errors.confirmPassword}</Text> : null}
      {error ? <Text>{error}</Text> : null}
      <Link href="/(welcome)/sign-up">
          Back
      </Link>
      <Button
        disabled={Object.values(errors).some(error => !!error) || !username || !password || !confirmPassword }
        title="Done!"
        onPress={handleSubmit} />
    </View>
  )
}

export default AccountDetails