import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from 'twrnc'
import { collection, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import ChatRow from './ChatRow'

const ChatList = () => {
  const [matches, setMatches] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    let unsub;
    const fetchMatches = async () => {
      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))
      console.log("swipes", swipes)
      unsub = onSnapshot(
        collection(db, 'users', user.uid, 'swipes'),
        snapshot => {
          setMatches(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
        }
      )
    }
    fetchMatches()
    return unsub
  }, [user])

  return matches.length > 0 ? (
    <FlatList
      style={tw`h-full`}
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw`p-5`}>
      <Text style={tw`text-center text-lg`}>No matches at the moment</Text>
    </View>
  )
}

export default ChatList