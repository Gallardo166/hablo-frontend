import { useAppContext } from '@/components/context/AppContext';
import { useSignUpContext } from '@/components/context/SignUpContext';
import { StyledButton, StyledInput, StyledLink } from '@/components/Styled';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

type AccountDetailErrorsType = {
  username: string; // cannot be empty, at most 100 chars long
  password: string; // cannot be empty, at least eight chars long
  confirmPassword: string; // must be equal to password
}

const AccountDetails = () => {
  const { username, password, confirmPassword, setUsername,
          setPassword, setConfirmPassword, handleSubmit, error, setError, loading } = useSignUpContext();
  const [errors, setErrors] = useState<AccountDetailErrorsType>({username: "", password: "", confirmPassword: ""});
  const { colorScheme } = useAppContext();

  function handleUsernameChangeText(text: string) {
    setUsername(text);
    if (!text) {
      setErrors(errors => ({...errors, username: "Username must not be empty."}));
      setError("");
    } else if (text.length > 100) {
      setErrors(errors => ({...errors, username: "Username must be at most 100 characters."}));
      setError("");
    } else {
      setErrors(errors => ({...errors, username: ""}));
      setError("");
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
      setErrors(errors => ({...errors, password: "Password must be at least 8 characters."}));
    } else {
      setErrors(errors => ({...errors, password: ""}));
    }
  }

  function handleConfirmPasswordChangeText(text: string) {
    setConfirmPassword(text);
    if (text !== password) {
      setErrors(errors => ({...errors, confirmPassword: "Passwords are not equal."}));
    } else {
      setErrors(errors => ({...errors, confirmPassword: ""}));
    }
  }

  return (
    <View className="flex gap-6">
      <View className="flex gap-3">
        <View>
          <StyledInput placeholder="Username" value={username} onChangeText={handleUsernameChangeText} />
          {errors.username ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{errors.username}</Text> : null}
        </View>
        <View>
          <StyledInput placeholder="Password" value={password} onChangeText={handlePasswordChangeText} />
          {errors.password ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{errors.password}</Text> : null}
        </View>
        <View>
          <StyledInput placeholder="Confirm password" value={confirmPassword} onChangeText={handleConfirmPasswordChangeText} />
          {errors.confirmPassword ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{errors.confirmPassword}</Text> : null}
        </View>
        {error ? <Text className={"font-itim text-lg " + (colorScheme === "light" ? "text-red-700" : "text-red-500")}>{error}</Text> : null}
      </View>
      <StyledLink text="&lt; Back" href="/(welcome)/sign-up" />
      <StyledButton text="Done!" loading={loading} disabled={Object.values(errors).some(error => !!error) || !username || !password || !confirmPassword} onPress={handleSubmit} />
    </View>
  )
}

export default AccountDetails