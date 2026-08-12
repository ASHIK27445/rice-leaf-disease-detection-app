import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { predictDisease, PredictionResult } from '../lib/predictDisease';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>ছবি তোলার জন্য ক্যামেরা অনুমতি দরকার</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>অনুমতি দিন</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function analyzeUri(uri: string) {
    setError(null);
    setResult(null);
    setPhotoUri(uri);
    setLoading(true);
    try {
      const prediction = await predictDisease(uri);
      setResult(prediction);
    } catch (e: any) {
      setError(e?.message ?? 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  }

  async function takeAndAnalyze() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (!photo) return;
    await analyzeUri(photo.uri);
  }

  async function pickFromGallery() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError('গ্যালারি থেকে ছবি নেওয়ার জন্য অনুমতি দরকার');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (pickerResult.canceled) return;

    const uri = pickerResult.assets[0].uri;
    await analyzeUri(uri);
  }

  function reset() {
    setPhotoUri(null);
    setResult(null);
    setError(null);
  }

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.captureButton} onPress={takeAndAnalyze}>
              <Text style={styles.captureText}>📷 পাতার ছবি তুলুন</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <Text style={styles.galleryText}>🖼️ গ্যালারি থেকে বাছুন</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />

          {loading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#2d6a4f" />
              <Text style={styles.msg}>বিশ্লেষণ করা হচ্ছে...</Text>
            </View>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          {result && (
            <View style={styles.card}>
              <Text style={[styles.diseaseName, result.info.isHealthy && styles.healthy]}>
                {result.info.isHealthy ? '✅' : '⚠️'} {result.info.nameBn}
              </Text>
              <Text style={styles.confidence}>বিশ্বাসযোগ্যতা: {result.confidencePercent}%</Text>

              <Text style={styles.sectionTitle}>কারণ</Text>
              <Text style={styles.sectionText}>{result.info.causeBn}</Text>

              <Text style={styles.sectionTitle}>লক্ষণ</Text>
              <Text style={styles.sectionText}>{result.info.symptomsBn}</Text>

              <Text style={styles.sectionTitle}>করণীয়</Text>
              {result.info.managementBn.map((tip, i) => (
                <Text key={i} style={styles.tip}>• {tip}</Text>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>আবার Scan করুন</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  msg: { fontSize: 15, color: '#333', marginTop: 10, textAlign: 'center' },
  error: { color: '#bc4749', fontSize: 14, textAlign: 'center', marginVertical: 10 },
  actionRow: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  captureButton: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  captureText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  galleryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#2d6a4f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  galleryText: { color: '#2d6a4f', fontSize: 14, fontWeight: '600' },
  resultContainer: { padding: 16, alignItems: 'center' },
  preview: { width: '100%', height: 260, borderRadius: 12, marginBottom: 16 },
  card: {
    width: '100%',
    backgroundColor: '#f4f1de',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  diseaseName: { fontSize: 20, fontWeight: '700', color: '#bc4749', marginBottom: 4 },
  healthy: { color: '#2d6a4f' },
  confidence: { fontSize: 14, color: '#555', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1b4332', marginTop: 10 },
  sectionText: { fontSize: 14, color: '#333', marginTop: 2, lineHeight: 20 },
  tip: { fontSize: 14, color: '#333', marginTop: 4, lineHeight: 20 },
  button: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});