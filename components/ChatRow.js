import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import tw from 'twrnc'

const ChatRow = ({ matchDetails, }) => {

  return (
    <TouchableOpacity style={tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg shadow-md`}>
      <Image
        style={tw`rounded-full h-16 w-16 mr-4`}
        source={{ uri: matchDetails?.photoURL }}
      />
      <View>
        <Text style={tw`text-lg font-semibold`}>
          {matchDetails?.name}
        </Text>
        <Text>{matchDetails?.categories}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow