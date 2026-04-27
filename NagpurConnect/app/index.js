import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import GlassCard from '../components/GlassCard';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: 'train',
    iconLib: 'material',
    title: 'Transit Hub',
    subtitle: 'Metro • Bus • Train',
    description: 'All public transport in one place',
    route: '/transit',
    color: Colors.primary,
  },
  {
    icon: 'thunderstorm',
    iconLib: 'ion',
    title: 'Weather',
    subtitle: 'Critical Alerts',
    description: 'Get weather alerts on SMS',
    route: '/weather',
    color: '#FF4757',
  },
  {
    icon: 'notifications',
    iconLib: 'ion',
    title: 'Civic Alerts',
    subtitle: 'Power • Water • News',
    description: 'Stay informed about your area',
    route: '/alerts',
    color: '#FFA502',
  },
  {
    icon: 'file-document-edit',
    iconLib: 'material',
    title: 'Complaints',
    subtitle: 'File to NMC',
    description: 'Report civic issues directly',
    route: '/complaints',
    color: '#3498DB',
  },
];

const stats = [
  { value: '40 km', label: 'Metro Network', icon: '🚇' },
  { value: '90+', label: 'Bus Routes', icon: '🚌' },
  { value: '10', label: 'NMC Zones', icon: '🏛️' },
  { value: '24/7', label: 'Alert System', icon: '🔔' },
];

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(features.map(() => new Animated.Value(0))).current;
  const statAnims = useRef(stats.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Hero animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    const cardAnimations = cardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 400 + index * 150,
        useNativeDriver: true,
      })
    );
    Animated.stagger(150, cardAnimations).start();

    // Stagger stat animations
    const statAnimations = statAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 1000 + index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, statAnimations).start();
  }, []);

  return (
    <LinearGradient colors={Colors.gradientHero} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🍊</Text>
            <Text style={styles.logoText}>NagpurConnect</Text>
          </View>
          <Text style={styles.tagline}>Your City, One Platform</Text>
          <Text style={styles.subtitle}>
            Transit • Weather • Alerts • Complaints
          </Text>
        </Animated.View>

        {/* Feature Cards */}
        <View style={styles.cardsGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              style={[
                styles.cardWrapper,
                {
                  opacity: cardAnims[index],
                  transform: [
                    {
                      translateY: cardAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(feature.route)}
              >
                <GlassCard style={styles.featureCard}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: feature.color + '20' },
                    ]}
                  >
                    {feature.iconLib === 'ion' ? (
                      <Ionicons
                        name={feature.icon}
                        size={28}
                        color={feature.color}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={feature.icon}
                        size={28}
                        color={feature.color}
                      />
                    )}
                  </View>
                  <Text style={styles.cardTitle}>{feature.title}</Text>
                  <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
                  <Text style={styles.cardDesc}>{feature.description}</Text>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Nagpur at a Glance</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Animated.View
                key={stat.label}
                style={[
                  styles.statItem,
                  {
                    opacity: statAnims[index],
                    transform: [
                      {
                        scale: statAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <GlassCard style={styles.statCard}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </GlassCard>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Emergency Banner */}
        <GlassCard style={styles.emergencyBanner}>
          <View style={styles.emergencyHeader}>
            <Text style={styles.emergencyIcon}>🆘</Text>
            <Text style={styles.emergencyTitle}>Emergency Numbers</Text>
          </View>
          <View style={styles.emergencyNumbers}>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>Police</Text>
              <Text style={styles.emergencyNumber}>100</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>Fire</Text>
              <Text style={styles.emergencyNumber}>101</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>Ambulance</Text>
              <Text style={styles.emergencyNumber}>108</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>NMC</Text>
              <Text style={styles.emergencyNumber}>155304</Text>
            </View>
          </View>
        </GlassCard>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made for Nagpur 🍊</Text>
          <Text style={styles.footerSubtext}>
            The Orange City • Heart of India
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: (width - 44) / 2,
    marginBottom: 4,
  },
  featureCard: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    minHeight: 160,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 44) / 2,
    marginBottom: 4,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emergencyBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.alertRed,
  },
  emergencyNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyItem: {
    alignItems: 'center',
  },
  emergencyLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
