import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

type Lang = 'bn' | 'en';

const content: Record<Lang, {
  badge: string;
  title: string;
  subtitle: string;
  switchLabel: string;
}> = {
  bn: {
    badge: 'AI চালিত',
    title: 'ধানের পাতার\nরোগ শনাক্তকরণ',
    subtitle: 'একটি ছবি তুলুন, সাথে সাথে জেনে নিন আপনার ধান গাছের পাতায় কী রোগ হয়েছে এবং কীভাবে তা প্রতিরোধ করবেন।',
    switchLabel: 'EN',
  },
  en: {
    badge: 'AI POWERED',
    title: 'Rice Leaf\nDisease Detection',
    subtitle: 'Take a photo and instantly find out what disease is affecting your rice plant leaves and how to prevent it.',
    switchLabel: 'বাং',
  },
};

export default function HomeScreen() {
  const [lang, setLang] = useState<Lang>('bn');

  // Fast Refresh / স্টেট corrupt হলেও যাতে ক্র্যাশ না করে, সেজন্য গার্ড
  const t = content[lang] ?? content.bn;

  const toggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Language Switch */}
      <TouchableOpacity
        style={styles.langSwitch}
        activeOpacity={0.8}
        onPress={toggleLang}
      >
        <Text style={styles.langSwitchText}>{t.switchLabel}</Text>
      </TouchableOpacity>

      {/* Decorative background circles */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Hero Content */}
      <View style={styles.heroContent}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconEmoji}>🌾</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t.badge}</Text>
        </View>

        <Text style={styles.title}>{t.title}</Text>

        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  langSwitch: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  langSwitchText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  circleTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 40,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#A5D6A7',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 18,
  },
  subtitle: {
    color: '#C8E6C9',
    fontSize: 14.5,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 320,
  },
});