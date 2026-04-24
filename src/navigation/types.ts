import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Admin: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  GroupDetail: { groupId: string };
  Affiliation: { groupId: string };
  Feedback: { groupId: string };
  Contribute: { groupId: string };
  ContributionsList: undefined;
  GroupTypeForm: { typeId?: string } | undefined;
  GroupForm: { groupId?: string } | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

export type MainTabProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;
