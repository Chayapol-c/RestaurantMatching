import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import ChatList from '../components/ChatList'


const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Matches List" />
      <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen