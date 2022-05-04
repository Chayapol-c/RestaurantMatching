import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import * as Google from 'expo-google-app-auth'
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut, } from '@firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext({})
const config = {
  androidClientId: '971717229528-6p9naf58cf64a23nkl94c7kjsrun4v6r.apps.googleusercontent.com',
  iosClientId: '971717229528-ocser14ea34ld6rr3drf7t0bu7pl9jr0.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
        } else {
          setUser(null)
        }
        setLoadingInitial(false)
      }),
    []
  );

  const logout = () => {
    setLoading(true)
    signOut(auth)
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type === 'success') {
          const { idToken, accessToken } = logInResult
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credential)
        }
        return Promise.reject()
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  }

  const memoedValue = useMemo(() => ({
    user,
    loading,
    error,
    signInWithGoogle,
    logout,
  }), [user, loading, error])

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}

