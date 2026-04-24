import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isFirebaseConfigured } from '../config';
import { useAuthContext } from '../context/AuthContext';
import { ConfigMissingScreen } from '../screens/ConfigMissingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { MainTabs } from './MainTabs';
import { GroupDetailScreen } from '../screens/GroupDetailScreen';
import { AffiliationScreen } from '../screens/AffiliationScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { ContributeScreen } from '../screens/ContributeScreen';
import { ContributionsListScreen } from '../screens/ContributionsListScreen';
import { GroupTypeFormScreen } from '../screens/admin/GroupTypeFormScreen';
import { GroupFormScreen } from '../screens/admin/GroupFormScreen';
import type { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8f9fa',
  },
};

function AuthNav() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Agrupaciones Unimet' }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Crear cuenta' }}
      />
    </AuthStack.Navigator>
  );
}

function AppNav() {
  return (
    <AppStack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerBackTitle: 'Atrás' }}
    >
      <AppStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: 'Agrupación' }}
      />
      <AppStack.Screen
        name="Affiliation"
        component={AffiliationScreen}
        options={{ title: 'Afiliación' }}
      />
      <AppStack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{ title: 'Feedback' }}
      />
      <AppStack.Screen
        name="Contribute"
        component={ContributeScreen}
        options={{ title: 'Contribuir' }}
      />
      <AppStack.Screen
        name="ContributionsList"
        component={ContributionsListScreen}
        options={{ title: 'Contribuciones' }}
      />
      <AppStack.Screen
        name="GroupTypeForm"
        component={GroupTypeFormScreen}
        options={{ title: 'Tipo de agrupación' }}
      />
      <AppStack.Screen
        name="GroupForm"
        component={GroupFormScreen}
        options={{ title: 'Agrupación' }}
      />
    </AppStack.Navigator>
  );
}

export function RootNavigator() {
  const { user, ready } = useAuthContext();

  if (!isFirebaseConfigured()) {
    return <ConfigMissingScreen />;
  }
  if (!ready) {
    return (
      <View style={styles.load}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AppNav /> : <AuthNav />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  load: { flex: 1, justifyContent: 'center' },
});
