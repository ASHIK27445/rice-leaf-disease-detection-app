import { Skia } from '@shopify/react-native-skia';
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import { CLASS_LABELS, DISEASE_INFO, ClassLabel } from '../data/diseaseInfo';

const INPUT_SIZE = 224;

// ImageNet normalization values used during training (see notebook cell 12/14)
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

let cachedModel: TensorflowModel | null = null;

/**
 * Loads the tflite model once and reuses it for every prediction.
 * Call this once (e.g. on app start or screen mount) before predicting.
 */
export async function loadRiceModel(): Promise<TensorflowModel> {
  if (cachedModel) return cachedModel;
  cachedModel = await loadTensorflowModel(
    // Place the .tflite file in assets/model/ and adjust this path if needed
    require('../assets/model/RiceLeafBD_EfficientNetB0_float32.tflite'),
    [] // delegates: [] = default CPU delegate
  );
  return cachedModel;
}

/**
 * Reads a local image (from camera capture) and converts it into the
 * normalized [1, 224, 224, 3] float32 tensor the model expects.
 */
async function imageToTensor(imageUri: string): Promise<Float32Array> {
  const data = await Skia.Data.fromURI(imageUri);
  const image = Skia.Image.MakeImageFromEncoded(data);
  if (!image) {
    throw new Error('ছবিটি পড়া যায়নি (image decode failed)');
  }

  // Draw the image scaled into a 224x224 surface to resize it
  const surface = Skia.Surface.MakeOffscreen(INPUT_SIZE, INPUT_SIZE);
  if (!surface) {
    throw new Error('Skia surface তৈরি করা যায়নি');
  }
  const canvas = surface.getCanvas();
  const destRect = { x: 0, y: 0, width: INPUT_SIZE, height: INPUT_SIZE };
  canvas.drawImageRect(
    image,
    { x: 0, y: 0, width: image.width(), height: image.height() },
    destRect,
    Skia.Paint()
  );
  surface.flush();

  const snapshot = surface.makeImageSnapshot();
  // readPixels gives RGBA bytes (0-255), row-major, size = 224*224*4
  const pixels = snapshot.readPixels(0, 0, {
    width: INPUT_SIZE,
    height: INPUT_SIZE,
    colorType: 4, // RGBA_8888
    alphaType: 1,
  }) as Uint8Array;

  // Convert RGBA(0-255) -> normalized RGB float32, drop alpha channel
  const out = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
  let o = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] / 255;
    const g = pixels[i + 1] / 255;
    const b = pixels[i + 2] / 255;
    out[o++] = (r - MEAN[0]) / STD[0];
    out[o++] = (g - MEAN[1]) / STD[1];
    out[o++] = (b - MEAN[2]) / STD[2];
  }
  return out;
}

function softmax(logits: Float32Array | number[]): number[] {
  const max = Math.max(...logits);
  const exps = Array.from(logits).map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

export interface PredictionResult {
  label: ClassLabel;
  confidencePercent: number;
  info: (typeof DISEASE_INFO)[ClassLabel];
  allScores: { label: ClassLabel; percent: number }[];
}

/**
 * Full pipeline: takes a captured photo's local URI, runs it through the
 * model, and returns the top prediction plus Bangla disease info.
 */
export async function predictDisease(imageUri: string): Promise<PredictionResult> {
  const model = await loadRiceModel();
  const inputTensor = await imageToTensor(imageUri);

  const inputBuffer = new ArrayBuffer(inputTensor.byteLength);
  new Uint8Array(inputBuffer).set(
    new Uint8Array(
      inputTensor.buffer,
      inputTensor.byteOffset,
      inputTensor.byteLength
    )
  );

  const outputs = model.runSync([inputBuffer]);
  const logits = new Float32Array(outputs[0]); // shape [5], raw logits (no softmax applied by the model)
  const probs = softmax(logits);

  let bestIdx = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[bestIdx]) bestIdx = i;
  }

  const label = CLASS_LABELS[bestIdx];
  const allScores = CLASS_LABELS.map((l, i) => ({
    label: l,
    percent: Math.round(probs[i] * 1000) / 10,
  })).sort((a, b) => b.percent - a.percent);

  return {
    label,
    confidencePercent: Math.round(probs[bestIdx] * 1000) / 10,
    info: DISEASE_INFO[label],
    allScores,
  };
}