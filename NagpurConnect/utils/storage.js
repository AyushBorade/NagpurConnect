import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLAINTS_KEY = '@nagpurconnect_complaints';
const SUBSCRIPTIONS_KEY = '@nagpurconnect_subscriptions';

export const saveComplaint = async (complaint) => {
  try {
    const existing = await getComplaints();
    existing.unshift(complaint);
    await AsyncStorage.setItem(COMPLAINTS_KEY, JSON.stringify(existing));
    return true;
  } catch (error) {
    console.error('Error saving complaint:', error);
    return false;
  }
};

export const getComplaints = async () => {
  try {
    const data = await AsyncStorage.getItem(COMPLAINTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting complaints:', error);
    return [];
  }
};

export const saveSubscription = async (subscription) => {
  try {
    const existing = await getSubscriptions();
    existing.push(subscription);
    await AsyncStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(existing));
    return true;
  } catch (error) {
    console.error('Error saving subscription:', error);
    return false;
  }
};

export const getSubscriptions = async () => {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
};

export const generateComplaintId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `NMC-${year}-${random}`;
};
