import { useSessionContext } from '@/components/context/SessionContext';
import { resetFriends } from '@/data/state/friendsSlice';
import { AppDispatch } from '@/data/state/store';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Button, Modal, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import "../globals.css";
import { StyledView } from '@/components/Styled';

const Profile = () => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(false);
  const { conn, setUser, setConn } = useSessionContext();
  const dispatch = useDispatch<AppDispatch>();

  async function handleLogout() {
    const token = await SecureStore.getItemAsync("token");
    const response = await fetch("http://localhost:8080/v1/tokens", {
      "method": "DELETE",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const content = await response.json();
    console.log(content);
    if (!content.error) {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
      conn?.close();
      setConn(null);
      dispatch(resetFriends());
    }
  }

  return (
    <StyledView>
      <Modal visible={modalVisible} className="bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="font-bold">Are you sure you want to log out?</Text>
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
          <Button title="Log out" onPress={handleLogout} />
        </View>
      </Modal>
      <Button title="Log out" onPress={() => setModalVisible(true)} />
    </StyledView>
  )
}

export default Profile