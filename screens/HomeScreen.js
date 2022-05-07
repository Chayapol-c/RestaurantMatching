import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../hooks/useAuth';
import tw from 'twrnc'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';



const HomeScreen = () => {
  const navigation = useNavigation()
  const { user, logout } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const swipeRef = useRef(null)

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, 'users', user.uid), snapshot => {
        if (!snapshot.exists) {
          navigation.navigate("Modal")
        }
      })
    , [])

  useEffect(() => {
    let unsub;
    const fetchRestaurants = async () => {
      const passes = await getDocs(collection(db, 'users', user.uid, 'passes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))
      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
        .then(snapshot => snapshot.docs.map(doc => doc.id))

      const passedUserIds = passes.length > 0 ? passes : ['test']
      const swipedUserIds = swipes.length > 0 ? swipes : ['test']

      unsub = onSnapshot(
        query(
          collection(db, 'restaurants'),
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
        ),
        snapshot => {
          setRestaurants(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })
            )
          )
        })
    }
    fetchRestaurants()
    return unsub
  }, [db])
  console.log("res", restaurants)
  const swipeLeft = (cardIndex) => {
    if (!restaurants[cardIndex]) return
    const restaurantSwiped = restaurants[cardIndex]
    console.log(`You swiped PASS on ${restaurantSwiped.name}`)
    setDoc(doc(db, "users", user.uid, 'passes', restaurantSwiped.id), restaurantSwiped)
  }

  const swipeRight = async (cardIndex) => {
    if (!restaurants[cardIndex]) return
    const restaurantSwiped = restaurants[cardIndex]
    // user has swiped as first interaction between the two or didn't get swiped on
    console.log(`You swiped on ${restaurantSwiped.name} (${restaurantSwiped.categories})`)
    setDoc(doc(db, "users", user.uid, 'swipes', restaurantSwiped.id), restaurantSwiped)
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-row items-center justify-between px-5`}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw`h-10 w-10 rounded-full`}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Ionicons name="ios-people" size={40} color="#FF5864" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name='restaurant' size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1 -mt-6`}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={restaurants}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex)
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex)
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: 'red',
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              }
            }
          }}
          renderCard={(card) => card ? (
            <View style={tw`relative bg-red-500 h-3/4 rounded-xl`} key={card.id}>
              <Image
                style={tw`absolute top-0 h-full w-full rounded-xl`}
                source={{ uri: card.photoURL }}
              />
              <View
                style={tw`absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl shadow-xl`}>
                <View>
                  <Text style={tw`text-xl font-bold`}>
                    {card.name}
                  </Text>
                  <Text>
                    {card.categories}
                  </Text>
                </View>
                <Text style={tw`text-2xl font-bold`}>
                  {card.age}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={tw`relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl`}
            >
              <Text style={tw`font-bold pb-5`}>No more profiles</Text>
              <Image
                style={tw`h-20 w-full`}
                height={100}
                width={100}
                source={{ uri: "https://links.papareact.com/6gb" }}
              />

            </View>
          )}
        />
      </View>
      <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw`justify-center items-center rounded-full w-16 h-16 bg-red-200`}>
          <Entypo name='cross' size={24} color='red' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw`justify-center items-center rounded-full w-16 h-16 bg-green-200`}>
          <AntDesign name='heart' size={24} color='green' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
