// hooks/useAuthCheck.js
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';

export const useAuthCheck = () => {
  const navigation = useNavigation();
  const { state } = useAuth();

  useEffect(() => {
    if (!state.loading && !state.user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [state.user, state.loading]);
};