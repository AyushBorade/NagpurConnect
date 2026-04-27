export const currentWeather = {
  temperature: 42,
  feelsLike: 45,
  humidity: 28,
  windSpeed: 12,
  windDirection: 'NW',
  aqi: 142,
  aqiLabel: 'Unhealthy for Sensitive Groups',
  condition: 'Partly Cloudy',
  icon: '⛅',
  uvIndex: 9,
  visibility: '6 km',
  lastUpdated: 'Just now',
};

export const severeAlerts = [
  {
    id: 'wa1',
    severity: 'red',
    title: 'Heat Wave Warning',
    description: 'Extreme heat wave conditions expected. Temperature may exceed 46°C. Avoid outdoor activities between 11 AM – 4 PM.',
    validFrom: '27 Apr 2026, 6:00 AM',
    validTo: '29 Apr 2026, 6:00 PM',
    source: 'IMD Nagpur',
    icon: '🔥',
  },
  {
    id: 'wa2',
    severity: 'orange',
    title: 'Thunderstorm Alert',
    description: 'Thunderstorm with lightning and gusty winds (40-50 kmph) likely in isolated areas of Nagpur district.',
    validFrom: '28 Apr 2026, 3:00 PM',
    validTo: '28 Apr 2026, 9:00 PM',
    source: 'IMD Nagpur',
    icon: '⛈️',
  },
  {
    id: 'wa3',
    severity: 'yellow',
    title: 'Poor Air Quality',
    description: 'AQI expected to remain in the "Unhealthy" category (150-200) due to dust and vehicular emissions.',
    validFrom: '27 Apr 2026',
    validTo: '30 Apr 2026',
    source: 'CPCB Nagpur',
    icon: '😷',
  },
];

export const forecast = [
  { day: 'Mon', icon: '☀️', high: 43, low: 28, condition: 'Sunny' },
  { day: 'Tue', icon: '⛅', high: 42, low: 27, condition: 'Partly Cloudy' },
  { day: 'Wed', icon: '⛈️', high: 38, low: 25, condition: 'Thunderstorm' },
  { day: 'Thu', icon: '🌧️', high: 35, low: 24, condition: 'Rain' },
  { day: 'Fri', icon: '⛅', high: 39, low: 26, condition: 'Partly Cloudy' },
];

export const weatherHistory = [
  { date: '26 Apr', event: 'Heat wave advisory issued', severity: 'red' },
  { date: '24 Apr', event: 'Dust storm warning — Visibility reduced', severity: 'orange' },
  { date: '22 Apr', event: 'Heavy rainfall — 45mm recorded', severity: 'orange' },
  { date: '20 Apr', event: 'Thunderstorm alert for eastern Nagpur', severity: 'yellow' },
  { date: '18 Apr', event: 'Heat wave warning — 44°C recorded', severity: 'red' },
];
