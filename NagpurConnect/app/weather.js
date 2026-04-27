import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { showToast } from '../components/Toast';
import { currentWeather, severeAlerts, forecast, weatherHistory } from '../data/weather';
import { nagpurAreas } from '../data/areas';
import { saveSubscription } from '../utils/storage';

export default function WeatherScreen() {
  const [phone, setPhone] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tempAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(tempAnim, {
        toValue: 1,
        friction: 4,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubscribe = async () => {
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    const area = nagpurAreas.find((a) => a.id === selectedArea);
    await saveSubscription({
      phone,
      area: area?.name || 'All Areas',
      type: 'weather',
      date: new Date().toISOString(),
    });
    showToast(`Weather alerts enabled for ${area?.name || 'All Areas'}! 📱`, 'success');
    setPhone('');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'red': return Colors.alertRed;
      case 'orange': return Colors.alertOrange;
      case 'yellow': return Colors.alertYellow;
      default: return Colors.alertBlue;
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'red': return Colors.alertRedBg;
      case 'orange': return Colors.alertOrangeBg;
      case 'yellow': return Colors.alertYellowBg;
      default: return Colors.alertBlueBg;
    }
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return Colors.alertGreen;
    if (aqi <= 100) return Colors.alertYellow;
    if (aqi <= 150) return Colors.alertOrange;
    return Colors.alertRed;
  };

  return (
    <LinearGradient colors={Colors.gradientDark} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>⛈️ Weather Alerts</Text>
          <Text style={styles.headerSubtitle}>Nagpur, Maharashtra</Text>
        </Animated.View>

        {/* Current Weather Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: tempAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
            ],
          }}
        >
          <LinearGradient
            colors={['rgba(255, 107, 53, 0.15)', 'rgba(255, 107, 53, 0.05)']}
            style={styles.weatherMainCard}
          >
            <View style={styles.weatherTop}>
              <View>
                <Text style={styles.weatherIcon}>{currentWeather.icon}</Text>
                <Text style={styles.weatherCondition}>
                  {currentWeather.condition}
                </Text>
              </View>
              <View style={styles.tempContainer}>
                <Text style={styles.temperature}>
                  {currentWeather.temperature}°
                </Text>
                <Text style={styles.feelsLike}>
                  Feels like {currentWeather.feelsLike}°C
                </Text>
              </View>
            </View>

            <View style={styles.weatherGrid}>
              <View style={styles.weatherStat}>
                <Ionicons name="water" size={18} color={Colors.alertBlue} />
                <Text style={styles.statValue}>{currentWeather.humidity}%</Text>
                <Text style={styles.statLabel}>Humidity</Text>
              </View>
              <View style={styles.weatherStat}>
                <Ionicons name="speedometer" size={18} color={Colors.textSecondary} />
                <Text style={styles.statValue}>
                  {currentWeather.windSpeed} km/h
                </Text>
                <Text style={styles.statLabel}>Wind</Text>
              </View>
              <View style={styles.weatherStat}>
                <Ionicons name="eye" size={18} color={Colors.textSecondary} />
                <Text style={styles.statValue}>{currentWeather.visibility}</Text>
                <Text style={styles.statLabel}>Visibility</Text>
              </View>
              <View style={styles.weatherStat}>
                <Ionicons name="sunny" size={18} color={Colors.alertOrange} />
                <Text style={styles.statValue}>UV {currentWeather.uvIndex}</Text>
                <Text style={styles.statLabel}>UV Index</Text>
              </View>
            </View>

            {/* AQI */}
            <View style={styles.aqiContainer}>
              <Text style={styles.aqiLabel}>Air Quality Index</Text>
              <View style={styles.aqiRight}>
                <Text
                  style={[styles.aqiValue, { color: getAqiColor(currentWeather.aqi) }]}
                >
                  {currentWeather.aqi}
                </Text>
                <Text style={styles.aqiDesc}>{currentWeather.aqiLabel}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Severe Weather Alerts */}
        {severeAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚨 Active Alerts</Text>
            {severeAlerts.map((alert) => (
              <GlassCard
                key={alert.id}
                style={[
                  styles.alertCard,
                  { borderLeftWidth: 4, borderLeftColor: getSeverityColor(alert.severity) },
                ]}
              >
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>{alert.icon}</Text>
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityBg(alert.severity) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          { color: getSeverityColor(alert.severity) },
                        ]}
                      >
                        {alert.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.alertDesc}>{alert.description}</Text>
                <View style={styles.alertMeta}>
                  <Text style={styles.alertTime}>
                    📅 {alert.validFrom} – {alert.validTo}
                  </Text>
                  <Text style={styles.alertSource}>Source: {alert.source}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        {/* 5-Day Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 5-Day Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.forecastScroll}
          >
            {forecast.map((day) => (
              <GlassCard key={day.day} style={styles.forecastCard}>
                <Text style={styles.forecastDay}>{day.day}</Text>
                <Text style={styles.forecastIcon}>{day.icon}</Text>
                <Text style={styles.forecastHigh}>{day.high}°</Text>
                <Text style={styles.forecastLow}>{day.low}°</Text>
                <Text style={styles.forecastCond}>{day.condition}</Text>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* SMS Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 SMS Alert Subscription</Text>
          <GlassCard style={styles.subscribeCard}>
            <Text style={styles.subscribeDesc}>
              Get critical weather alerts delivered to your phone via SMS.
              Never miss a severe weather warning!
            </Text>

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneInput}>
              <Text style={styles.phonePrefix}>+91</Text>
              <TextInput
                style={styles.phoneField}
                placeholder="Enter 10-digit number"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Text style={styles.inputLabel}>Select Area</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.areaScroll}
            >
              {nagpurAreas.slice(0, 10).map((area) => (
                <GlassCard
                  key={area.id}
                  style={[
                    styles.areaChip,
                    selectedArea === area.id && styles.areaChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.areaChipText,
                      selectedArea === area.id && styles.areaChipTextActive,
                    ]}
                    onPress={() => setSelectedArea(area.id)}
                  >
                    {area.name}
                  </Text>
                </GlassCard>
              ))}
            </ScrollView>

            <GradientButton
              title="Subscribe to Alerts"
              icon="📲"
              onPress={handleSubscribe}
              style={styles.subscribeBtn}
            />
          </GlassCard>
        </View>

        {/* Alert History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Recent Alert History</Text>
          {weatherHistory.map((event, idx) => (
            <GlassCard key={idx} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View
                  style={[
                    styles.historyDot,
                    { backgroundColor: getSeverityColor(event.severity) },
                  ]}
                />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyEvent}>{event.event}</Text>
                  <Text style={styles.historyDate}>{event.date}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 16 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },

  // Weather Main Card
  weatherMainCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  weatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherIcon: { fontSize: 50 },
  weatherCondition: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  tempContainer: { alignItems: 'flex-end' },
  temperature: { fontSize: 56, fontWeight: '800', color: Colors.textPrimary },
  feelsLike: { fontSize: 13, color: Colors.textMuted },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.bgCardBorder,
  },
  weatherStat: { alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  aqiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.bgCardBorder,
  },
  aqiLabel: { fontSize: 14, color: Colors.textSecondary },
  aqiRight: { alignItems: 'flex-end' },
  aqiValue: { fontSize: 22, fontWeight: '800' },
  aqiDesc: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  // Section
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  // Alert Cards
  alertCard: {},
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  alertIcon: { fontSize: 24, marginRight: 10 },
  alertInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, flex: 1, paddingRight: 8 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  severityText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  alertDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 8 },
  alertMeta: {},
  alertTime: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  alertSource: { fontSize: 11, color: Colors.textMuted },

  // Forecast
  forecastScroll: { marginBottom: 4 },
  forecastCard: { width: 100, alignItems: 'center', marginRight: 10, paddingVertical: 14 },
  forecastDay: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  forecastIcon: { fontSize: 28, marginVertical: 6 },
  forecastHigh: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  forecastLow: { fontSize: 14, color: Colors.textMuted },
  forecastCond: { fontSize: 10, color: Colors.textSecondary, marginTop: 4 },

  // Subscribe
  subscribeCard: { padding: 20 },
  subscribeDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    marginBottom: 16,
  },
  phonePrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingLeft: 14,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.bgCardBorder,
    paddingVertical: 14,
  },
  phoneField: { flex: 1, paddingLeft: 12, fontSize: 14, color: Colors.textPrimary, paddingVertical: 14 },
  areaScroll: { marginBottom: 16 },
  areaChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 0,
    borderRadius: 20,
  },
  areaChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  areaChipText: { fontSize: 12, color: Colors.textSecondary },
  areaChipTextActive: { color: Colors.primary, fontWeight: '700' },
  subscribeBtn: { marginTop: 4 },

  // History
  historyCard: { paddingVertical: 12 },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  historyInfo: { flex: 1 },
  historyEvent: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  historyDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
});
