import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import tw from 'twrnc'

const ChatRow = ({ matchDetails, }) => {
  const navigation = useNavigation()
  const { user } = useAuth()
  const [matchedUserInfo, setMatchedUserInfo] = useState(null)

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
  }, [matchDetails, user]);

  return (
    <TouchableOpacity style={tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg shadow-md`}>
      <Image
        style={tw`rounded-full h-16 w-16 mr-4`}
        source={{ uri: matchedUserInfo?.photoURL }}
      />
      <View>
        <Text style={tw`text-lg font-semibold`}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text>"Say Hi!"</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow