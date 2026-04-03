import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

// Shared & Auth
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProLoginScreen from '../screens/auth/ProLoginScreen';

// Worker Screens
import WorkerWelcomeScreen from '../screens/worker/WorkerWelcomeScreen';
import WorkerWorkTypeScreen from '../screens/worker/WorkerWorkTypeScreen';
import WorkerSignupScreen from '../screens/worker/WorkerSignupScreen';
import WorkerVerifyScreen from '../screens/worker/WorkerVerifyScreen';
import WorkerLoginScreen from '../screens/worker/WorkerLoginScreen';
import WorkerRoleScreen from '../screens/worker/WorkerRoleScreen';
import HomeScreen from '../screens/worker/HomeScreen';
import CategoriesScreen from '../screens/worker/CategoriesScreen';
import ProvidersScreen from '../screens/worker/ProvidersScreen';
import RequestServiceScreen from '../screens/worker/RequestServiceScreen';
import MyRequestsScreen from '../screens/worker/MyRequestsScreen';
import WorkerChatScreen from '../screens/worker/ChatScreen';
import NotificationsScreen from '../screens/worker/NotificationsScreen';
import ReviewsScreen from '../screens/worker/ReviewsScreen';
import ProfileScreen from '../screens/worker/ProfileScreen';
import WorkerProfileSetupScreen from '../screens/worker/WorkerProfileSetupScreen';
import WorkerPaymentSetupScreen from '../screens/worker/WorkerPaymentSetupScreen';
import WorkerExploreScreen from '../screens/worker/WorkerExploreScreen';
import WorkerSearchScreen from '../screens/worker/WorkerSearchScreen';
import WorkerInboxScreen from '../screens/worker/WorkerInboxScreen';
import PricingScreen from '../screens/worker/PricingScreen';

// Admin Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import JobsListScreen from '../screens/admin/JobsListScreen';
import ExploreScreen from '../screens/admin/ExploreScreen';
import LeadDetailsScreen from '../screens/admin/LeadDetailsScreen';
import AdminProChatScreen from '../screens/admin/AdminChatScreen';
import EarningsScreen from '../screens/admin/EarningsScreen';
import AdminReviewsScreen from '../screens/admin/AdminReviewsScreen';
import SubscriptionScreen from '../screens/admin/SubscriptionScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminNotificationsScreen from '../screens/admin/AdminNotificationsScreen';
import ScheduleScreen from '../screens/admin/ScheduleScreen';
import CreateQuoteScreen from '../screens/admin/CreateQuoteScreen';
import WorkerProfileScreen from '../screens/admin/WorkerProfileScreen';
import InboxScreen from '../screens/admin/InboxScreen';
import AdminChatScreen from '../screens/admin/ChatScreen';
import RescheduleScreen from '../screens/admin/RescheduleScreen';
import CreateInvoiceScreen from '../screens/admin/CreateInvoiceScreen';
import TeamAccountsScreen from '../screens/admin/TeamAccountsScreen';
import AddMemberScreen from '../screens/admin/AddMemberScreen';
import TaxTrackingScreen from '../screens/admin/TaxTrackingScreen';
import InventoryScreen from '../screens/admin/InventoryScreen';
import CampaignsScreen from '../screens/admin/CampaignsScreen';
import JobOfferDetailScreen from '../screens/admin/JobOfferDetailScreen';
import ContractReviewScreen from '../screens/admin/ContractReviewScreen';
import PreInspectionScreen from '../screens/admin/PreInspectionScreen';
import JobProofComplianceScreen from '../screens/admin/JobProofComplianceScreen';
import JobDetailsScreen from '../screens/admin/JobDetailsScreen';
import AssignJobScreen from '../screens/admin/AssignJobScreen';
import JobSuccessScreen from '../screens/admin/JobSuccessScreen';
import QuoteScopeScreen from '../screens/admin/QuoteScopeScreen';
import QuotePricingScreen from '../screens/admin/QuotePricingScreen';
import QuoteReviewScreen from '../screens/admin/QuoteReviewScreen';
import QuoteSuccessScreen from '../screens/admin/QuoteSuccessScreen';
import QuoteDetailsScreen from '../screens/admin/QuoteDetailsScreen';
import SettingsProfileScreen from '../screens/admin/SettingsProfileScreen';
import WorkerManagementScreen from '../screens/admin/WorkerManagementScreen';

// NEW: Admin Settings
import BusinessNameScreen from '../screens/admin/settings/BusinessNameScreen';
import ServicesOfferedScreen from '../screens/admin/settings/ServicesOfferedScreen';
import ServiceAreasScreen from '../screens/admin/settings/ServiceAreasScreen';
import WorkingHoursScreen from '../screens/admin/settings/WorkingHoursScreen';
import PortfolioPhotosScreen from '../screens/admin/settings/PortfolioPhotosScreen';
import CertificationsScreen from '../screens/admin/settings/CertificationsScreen';
import PersonalInfoScreen from '../screens/admin/settings/PersonalInfoScreen';
import BankDetailsScreen from '../screens/admin/settings/BankDetailsScreen';
import AppPreferencesScreen from '../screens/admin/settings/AppPreferencesScreen';
import HelpSupportScreen from '../screens/admin/settings/HelpSupportScreen';
import ComingSoonScreen from '../screens/admin/ComingSoonScreen';

// NEW: Worker Settings
import EditProfileScreen from '../screens/worker/settings/EditProfileScreen';
import SavedAddressesScreen from '../screens/worker/settings/SavedAddressesScreen';
import PaymentMethodsScreen from '../screens/worker/settings/PaymentMethodsScreen';
import SecurityScreen from '../screens/worker/settings/SecurityScreen';
import TermsScreen from '../screens/worker/settings/TermsScreen';
import PersonalInfoScreenWorker from '../screens/worker/settings/PersonalInfoScreen';
import ServicesOfferedScreenWorker from '../screens/worker/settings/ServicesOfferedScreen';
import ServiceAreasScreenWorker from '../screens/worker/settings/ServiceAreasScreen';
import WorkingHoursScreenWorker from '../screens/worker/settings/WorkingHoursScreen';

import AdminSearchScreen from '../screens/admin/AdminSearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function WorkerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#0062E1',
        tabBarInactiveTintColor: '#718096',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Explore': iconName = focused ? 'location' : 'location-outline'; break;
            case 'Inbox': iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'; break;
            case 'Account': iconName = focused ? 'person-circle' : 'person-circle-outline'; break;
          }
          return (
            <View style={[styles.tabIconContainer, focused && styles.activePillPadded]}>
              <Ionicons name={iconName} size={24} color={color} />
              {route.name === 'Inbox' && <View style={styles.notifDot} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={WorkerExploreScreen}
        initialParams={{ activeTab: 'Overview' }}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="Inbox"
        component={WorkerInboxScreen}
        options={{ tabBarLabel: 'Inbox' }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.proTabBar,
        tabBarActiveTintColor: '#0062E1',
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Explore': iconName = focused ? 'location' : 'location-outline'; break;
            case 'Inbox': iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'; break;
            case 'Account': iconName = focused ? 'person-circle' : 'person-circle-outline'; break;
          }
          return (
            <View style={[styles.tabIconContainer, focused && styles.activePillPadded]}>
              <Ionicons name={iconName} size={22} color={color} />
              {route.name === 'Inbox' && <View style={styles.notifBadgeTab} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        initialParams={{ activeTab: 'Overview' }}
        options={{ 
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.tabIconContainer, focused && styles.activePillPadded]}>
              <Ionicons name={focused ? 'location' : 'location-outline'} size={22} color={color} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{ 
          tabBarLabel: 'Inbox',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.tabIconContainer, focused && styles.activePillPadded]}>
              <Ionicons name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} size={22} color={color} />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Account"
        component={AdminProfileScreen}
        options={{ 
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.tabIconContainer, focused && styles.activePillPadded]}>
              <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={22} color={color} />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AdminTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProLogin" component={ProLoginScreen} />

        {/* Worker Flow */}
        <Stack.Screen name="WorkerWelcome" component={WorkerWelcomeScreen} />
        <Stack.Screen name="WorkerWorkType" component={WorkerWorkTypeScreen} />
        <Stack.Screen name="WorkerSignup" component={WorkerSignupScreen} />
        <Stack.Screen name="WorkerVerify" component={WorkerVerifyScreen} />
        <Stack.Screen name="WorkerLogin" component={WorkerLoginScreen} />
        <Stack.Screen name="WorkerRole" component={WorkerRoleScreen} />
        <Stack.Screen name="WorkerProfileSetup" component={WorkerProfileSetupScreen} />
        <Stack.Screen name="WorkerPaymentSetup" component={WorkerPaymentSetupScreen} />
        <Stack.Screen name="WorkerExplore" component={WorkerExploreScreen} />
        <Stack.Screen name="WorkerSearch" component={WorkerSearchScreen} />
        <Stack.Screen name="WorkerTabs" component={WorkerTabs} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="AdminSearch" component={AdminSearchScreen} />

        {/* Other screens */}
        <Stack.Screen name="Providers" component={ProvidersScreen} />
        <Stack.Screen name="RequestService" component={RequestServiceScreen} />
        <Stack.Screen name="Chat" component={WorkerChatScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="LeadMap" component={ExploreScreen} />
        <Stack.Screen name="LeadDetails" component={LeadDetailsScreen} />
        <Stack.Screen name="AdminProChat" component={AdminProChatScreen} />
        <Stack.Screen name="AdminReviews" component={AdminReviewsScreen} />
        <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
        <Stack.Screen name="AdminSchedule" component={ScheduleScreen} />
        <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
        <Stack.Screen name="JobOfferDetail" component={JobOfferDetailScreen} />
        <Stack.Screen name="ContractReview" component={ContractReviewScreen} />
        <Stack.Screen name="PreInspection" component={PreInspectionScreen} />
        <Stack.Screen name="JobProofCompliance" component={JobProofComplianceScreen} />
        <Stack.Screen name="AdminJobs" component={JobsListScreen} />
        <Stack.Screen name="CreateQuote" component={CreateQuoteScreen} />
        <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} />
        <Stack.Screen name="AdminChat" component={AdminChatScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
        <Stack.Screen name="Reschedule" component={RescheduleScreen} />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />

        {/* Missing Automation Modules */}
        <Stack.Screen name="Analytics" component={ComingSoonScreen} />
        <Stack.Screen name="TeamAccounts" component={TeamAccountsScreen} />
        <Stack.Screen name="AddMember" component={AddMemberScreen} />
        <Stack.Screen name="TaxTracking" component={TaxTrackingScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Campaigns" component={CampaignsScreen} />
        <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />

        {/* Settings Screens */}
        <Stack.Screen name="BusinessName" component={BusinessNameScreen} />
        <Stack.Screen name="ServicesOffered" component={ServicesOfferedScreen} />
        <Stack.Screen name="ServiceAreas" component={ServiceAreasScreen} />
        <Stack.Screen name="WorkingHours" component={WorkingHoursScreen} />
        <Stack.Screen name="PortfolioPhotos" component={PortfolioPhotosScreen} />
        <Stack.Screen name="Certifications" component={CertificationsScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="AppPreferences" component={AppPreferencesScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="PersonalInfoWorker" component={PersonalInfoScreenWorker} />
        <Stack.Screen name="ServicesOfferedWorker" component={ServicesOfferedScreenWorker} />
        <Stack.Screen name="ServiceAreasWorker" component={ServiceAreasScreenWorker} />
        <Stack.Screen name="WorkingHoursWorker" component={WorkingHoursScreenWorker} />

        {/* New Job/Quote Flow */}
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="AssignJob" component={AssignJobScreen} />
        <Stack.Screen name="JobSuccess" component={JobSuccessScreen} />
        <Stack.Screen name="QuoteScope" component={QuoteScopeScreen} />
        <Stack.Screen name="QuotePricing" component={QuotePricingScreen} />
        <Stack.Screen name="QuoteReview" component={QuoteReviewScreen} />
        <Stack.Screen name="QuoteSuccess" component={QuoteSuccessScreen} />
        <Stack.Screen name="QuoteDetails" component={QuoteDetailsScreen} />
        <Stack.Screen name="SettingsProfile" component={SettingsProfileScreen} />
        <Stack.Screen name="WorkerManagement" component={WorkerManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 85, 
    backgroundColor: COLORS.white, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.borderLight, 
    paddingBottom: 20, 
    paddingTop: 12, 
    elevation: 10, 
    shadowColor: COLORS.shadowDark, 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12 
  },
  proTabBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 85, 
    backgroundColor: COLORS.white, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.borderLight, 
    paddingBottom: 20, 
    paddingTop: 12, 
    elevation: 10, 
    shadowColor: COLORS.shadowDark, 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12 
  },
  tabLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  tabIconContainer: { alignItems: 'center', justifyContent: 'center', width: 44, height: 32 },
  activePillPadded: { backgroundColor: '#B2EBF2', borderRadius: 16, width: 64, height: 32 },
  tabIconContainerActive: { backgroundColor: '#EEF2FF' },
  proTabIconContainerActive: { backgroundColor: '#D0F2FE' },
  notifDot: {
    position: 'absolute',
    top: 0,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notifBadgeTab: {
    position: 'absolute',
    top: 0,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
});
