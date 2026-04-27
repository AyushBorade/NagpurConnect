import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import GlassCard from '../components/GlassCard';
import { metroLines, metroFares } from '../data/metro';
import { busRoutes } from '../data/bus';
import { trainInfo, popularTrains } from '../data/train';

const { width } = Dimensions.get('window');

const tabs = [
  { id: 'metro', label: 'Metro', icon: 'subway-variant', color: Colors.metroOrange },
  { id: 'bus', label: 'Bus', icon: 'bus', color: Colors.busGreen },
  { id: 'train', label: 'Train', icon: 'train', color: Colors.trainBlue },
];

export default function TransitScreen() {
  const [activeTab, setActiveTab] = useState('metro');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLine, setExpandedLine] = useState('orange');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const filteredBusRoutes = busRoutes.filter(
    (route) =>
      route.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrains = popularTrains.filter(
    (train) =>
      train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.number.includes(searchQuery)
  );

  const renderMetroTab = () => (
    <View>
      {metroLines.map((line) => (
        <GlassCard key={line.id} style={styles.lineCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              setExpandedLine(expandedLine === line.id ? null : line.id)
            }
          >
            <View style={styles.lineHeader}>
              <View
                style={[styles.lineDot, { backgroundColor: line.color }]}
              />
              <View style={styles.lineInfo}>
                <Text style={styles.lineName}>{line.name}</Text>
                <Text style={styles.lineSubtitle}>{line.subtitle}</Text>
                <Text style={styles.lineRoute}>
                  {line.from} → {line.to}
                </Text>
              </View>
              <Ionicons
                name={expandedLine === line.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textMuted}
              />
            </View>
          </TouchableOpacity>

          {/* Line Details */}
          <View style={styles.lineDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{line.distance}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Timing</Text>
              <Text style={styles.detailValue}>
                {line.firstTrain} – {line.lastTrain}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Frequency</Text>
              <Text style={styles.detailValue}>{line.frequency}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fare</Text>
              <Text style={styles.detailValue}>{line.fare}</Text>
            </View>
          </View>

          {/* Stations */}
          {expandedLine === line.id && (
            <View style={styles.stationsContainer}>
              <Text style={styles.stationsTitle}>Stations</Text>
              {line.stations.map((station, idx) => (
                <View key={station.code} style={styles.stationRow}>
                  <View style={styles.stationTimeline}>
                    <View
                      style={[
                        styles.stationDot,
                        {
                          backgroundColor: station.interchange
                            ? '#FFD700'
                            : line.color,
                          width: station.interchange ? 16 : 10,
                          height: station.interchange ? 16 : 10,
                        },
                      ]}
                    />
                    {idx < line.stations.length - 1 && (
                      <View
                        style={[
                          styles.stationLine,
                          { backgroundColor: line.color + '40' },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stationInfo}>
                    <Text
                      style={[
                        styles.stationName,
                        station.interchange && styles.stationInterchange,
                      ]}
                    >
                      {station.name}
                    </Text>
                    {station.interchange && (
                      <View style={styles.interchangeBadge}>
                        <Text style={styles.interchangeText}>
                          🔄 Interchange
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.stationCode}>{station.code}</Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>
      ))}

      {/* Fare Chart */}
      <GlassCard style={styles.fareCard}>
        <Text style={styles.fareTitle}>💰 Fare Chart</Text>
        {metroFares.map((fare) => (
          <View key={fare.distance} style={styles.fareRow}>
            <Text style={styles.fareDistance}>{fare.distance}</Text>
            <Text style={styles.fareAmount}>{fare.fare}</Text>
          </View>
        ))}
      </GlassCard>
    </View>
  );

  const renderBusTab = () => (
    <View>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by route number or destination..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredBusRoutes.map((route) => (
        <GlassCard key={route.id} style={styles.busCard}>
          <View style={styles.busHeader}>
            <View style={styles.routeBadge}>
              <Text style={styles.routeNumber}>{route.number}</Text>
            </View>
            <View style={styles.busInfo}>
              <Text style={styles.busName}>{route.name}</Text>
              <Text style={styles.busRoute}>
                {route.from} → {route.to}
              </Text>
            </View>
            {route.type !== 'Regular' && (
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor:
                      route.type === 'Express'
                        ? Colors.alertBlueBg
                        : Colors.alertGreenBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color:
                        route.type === 'Express'
                          ? Colors.alertBlue
                          : Colors.alertGreen,
                    },
                  ]}
                >
                  {route.type}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.busDetails}>
            <Text style={styles.busVia}>
              Via: {route.via.join(' → ')}
            </Text>
          </View>
          <View style={styles.busFooter}>
            <View style={styles.busDetail}>
              <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.busDetailText}>Every {route.frequency}</Text>
            </View>
            <View style={styles.busDetail}>
              <Ionicons name="cash-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.busDetailText}>{route.fare}</Text>
            </View>
            <View style={styles.busDetail}>
              <Ionicons name="moon-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.busDetailText}>Till {route.lastBus}</Text>
            </View>
          </View>
        </GlassCard>
      ))}
    </View>
  );

  const renderTrainTab = () => (
    <View>
      {/* Station Info */}
      <GlassCard style={styles.stationInfoCard}>
        <View style={styles.stationInfoHeader}>
          <MaterialCommunityIcons name="train" size={32} color={Colors.trainBlue} />
          <View style={styles.stationInfoText}>
            <Text style={styles.stationInfoName}>{trainInfo.station}</Text>
            <Text style={styles.stationInfoCode}>
              Station Code: {trainInfo.code} • {trainInfo.platforms} Platforms
            </Text>
            <Text style={styles.stationInfoZone}>{trainInfo.zone}</Text>
          </View>
        </View>
        <View style={styles.heritageBanner}>
          <Text style={styles.heritageIcon}>💎</Text>
          <Text style={styles.heritageText}>{trainInfo.heritage}</Text>
        </View>
      </GlassCard>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by train name or destination..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Trains List */}
      {filteredTrains.map((train) => (
        <GlassCard key={train.id} style={styles.trainCard}>
          <View style={styles.trainHeader}>
            <View>
              <Text style={styles.trainName}>{train.name}</Text>
              <Text style={styles.trainNumber}>#{train.number}</Text>
            </View>
            <View
              style={[
                styles.trainTypeBadge,
                {
                  backgroundColor:
                    train.type === 'Rajdhani'
                      ? Colors.alertRedBg
                      : train.type === 'Superfast'
                      ? Colors.alertBlueBg
                      : Colors.alertYellowBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.trainTypeText,
                  {
                    color:
                      train.type === 'Rajdhani'
                        ? Colors.alertRed
                        : train.type === 'Superfast'
                        ? Colors.alertBlue
                        : Colors.alertOrange,
                  },
                ]}
              >
                {train.type}
              </Text>
            </View>
          </View>
          <View style={styles.trainRoute}>
            <View style={styles.trainStation}>
              <Text style={styles.trainTime}>{train.departure}</Text>
              <Text style={styles.trainCity}>{train.from}</Text>
            </View>
            <View style={styles.trainArrow}>
              <View style={styles.trainDashLine} />
              <MaterialCommunityIcons
                name="train"
                size={18}
                color={Colors.trainBlue}
              />
              <View style={styles.trainDashLine} />
            </View>
            <View style={[styles.trainStation, { alignItems: 'flex-end' }]}>
              <Text style={styles.trainTime}>{train.arrival}</Text>
              <Text style={styles.trainCity}>{train.to}</Text>
            </View>
          </View>
          <View style={styles.trainFooter}>
            <Text style={styles.trainDetail}>
              🚉 Platform {train.platform}
            </Text>
            <Text style={styles.trainDetail}>📅 {train.days}</Text>
          </View>
        </GlassCard>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={Colors.gradientDark} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🚇 Transit Hub</Text>
          <Text style={styles.headerSubtitle}>
            All public transport in Nagpur
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              style={[
                styles.tab,
                activeTab === tab.id && {
                  backgroundColor: tab.color + '20',
                  borderColor: tab.color,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? tab.color : Colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && { color: tab.color },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {activeTab === 'metro' && renderMetroTab()}
          {activeTab === 'bus' && renderBusTab()}
          {activeTab === 'train' && renderTrainTab()}
        </Animated.View>
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

  // Tabs
  tabContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    gap: 6,
  },
  tabLabel: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  // Metro Line Card
  lineCard: { paddingBottom: 8 },
  lineHeader: { flexDirection: 'row', alignItems: 'center' },
  lineDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  lineInfo: { flex: 1 },
  lineName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  lineSubtitle: { fontSize: 12, color: Colors.textSecondary },
  lineRoute: { fontSize: 13, color: Colors.primary, marginTop: 2, fontWeight: '600' },
  lineDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.bgCardBorder,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: { fontSize: 13, color: Colors.textMuted },
  detailValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },

  // Stations
  stationsContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.bgCardBorder },
  stationsTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  stationRow: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 40 },
  stationTimeline: { alignItems: 'center', width: 20, marginRight: 12 },
  stationDot: { borderRadius: 10, marginTop: 4 },
  stationLine: { width: 2, flex: 1, marginTop: 4 },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  stationInterchange: { fontWeight: '700', color: '#FFD700' },
  interchangeBadge: { marginTop: 2, marginBottom: 4 },
  interchangeText: { fontSize: 11, color: '#FFD700' },
  stationCode: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginTop: 4 },

  // Fare
  fareCard: { marginTop: 4 },
  fareTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgCardBorder,
  },
  fareDistance: { fontSize: 14, color: Colors.textSecondary },
  fareAmount: { fontSize: 14, color: Colors.accent, fontWeight: '700' },

  // Bus
  busCard: { paddingBottom: 12 },
  busHeader: { flexDirection: 'row', alignItems: 'center' },
  routeBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.busGreen + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeNumber: { fontSize: 16, fontWeight: '800', color: Colors.busGreen },
  busInfo: { flex: 1 },
  busName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  busRoute: { fontSize: 12, color: Colors.textSecondary },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '700' },
  busDetails: { marginTop: 8 },
  busVia: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  busFooter: { flexDirection: 'row', marginTop: 10, gap: 16 },
  busDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  busDetailText: { fontSize: 12, color: Colors.textSecondary },

  // Train
  stationInfoCard: { marginBottom: 16 },
  stationInfoHeader: { flexDirection: 'row', alignItems: 'center' },
  stationInfoText: { marginLeft: 12, flex: 1 },
  stationInfoName: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  stationInfoCode: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  stationInfoZone: { fontSize: 12, color: Colors.trainBlue, marginTop: 2, fontWeight: '600' },
  heritageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.bgCardBorder,
  },
  heritageIcon: { fontSize: 16, marginRight: 8 },
  heritageText: { fontSize: 12, color: Colors.alertYellow, flex: 1, fontStyle: 'italic' },

  trainCard: {},
  trainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  trainName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, flex: 1, paddingRight: 8 },
  trainNumber: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  trainTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  trainTypeText: { fontSize: 11, fontWeight: '700' },
  trainRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    justifyContent: 'space-between',
  },
  trainStation: {},
  trainTime: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  trainCity: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  trainArrow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 12 },
  trainDashLine: { flex: 1, height: 1, backgroundColor: Colors.bgCardBorder },
  trainFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.bgCardBorder },
  trainDetail: { fontSize: 12, color: Colors.textSecondary },
});
