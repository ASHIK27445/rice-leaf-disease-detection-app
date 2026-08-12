// IMPORTANT: this order MUST exactly match the model's output index order.
// Confirmed from the training notebook (PyTorch ImageFolder alphabetical sort):
// 0 Blast, 1 Narrow_Brown_Spot, 2 Normal_Leaf, 3 Sheath_Blight, 4 Tungro
export const CLASS_LABELS = [
  'Blast',
  'Narrow_Brown_Spot',
  'Normal_Leaf',
  'Sheath_Blight',
  'Tungro',
] as const;

export type ClassLabel = (typeof CLASS_LABELS)[number];

export interface DiseaseInfo {
  labelEn: string;
  nameBn: string;
  isHealthy: boolean;
  causeBn: string;
  symptomsBn: string;
  managementBn: string[];
}

export const DISEASE_INFO: Record<ClassLabel, DiseaseInfo> = {
  Blast: {
    labelEn: 'Blast',
    nameBn: 'ধান ব্লাস্ট রোগ',
    isHealthy: false,
    causeBn: 'Pyricularia oryzae নামক ছত্রাক দ্বারা এই রোগ হয়। বেশি নাইট্রোজেন সার এবং আর্দ্র আবহাওয়ায় এটি দ্রুত ছড়ায়।',
    symptomsBn: 'পাতায় চোখের মতো ধূসর-বাদামি দাগ দেখা যায়, দাগের মাঝখানে ধূসর ও কিনারা বাদামি রঙের হয়। গুরুতর হলে শীষ (নেক ব্লাস্ট) আক্রান্ত হয়ে ফলন কমে যায়।',
    managementBn: [
      'আক্রান্ত পাতা/গাছ সংগ্রহ করে ধ্বংস করুন',
      'অতিরিক্ত নাইট্রোজেন সার প্রয়োগ এড়িয়ে চলুন',
      'জমিতে পানি জমিয়ে না রেখে সঠিক নিষ্কাশন নিশ্চিত করুন',
      'কৃষি সম্প্রসারণ অফিসারের পরামর্শ অনুযায়ী অনুমোদিত ছত্রাকনাশক ব্যবহার করুন',
    ],
  },
  Narrow_Brown_Spot: {
    labelEn: 'Narrow Brown Spot',
    nameBn: 'সরু বাদামি দাগ রোগ',
    isHealthy: false,
    causeBn: 'Cercospora oryzae নামক ছত্রাকের আক্রমণে এই রোগ হয়, সাধারণত গাছ দুর্বল বা পুষ্টিহীন হলে বেশি দেখা যায়।',
    symptomsBn: 'পাতায় সরু, লম্বাটে বাদামি রেখার মতো দাগ পড়ে, যা পাতার শিরা বরাবর ছড়িয়ে থাকে।',
    managementBn: [
      'সুষম সার প্রয়োগ করুন (বিশেষ করে পটাশ সারের ঘাটতি এড়িয়ে চলুন)',
      'জমির আগাছা পরিষ্কার রাখুন',
      'আক্রান্ত অংশ অপসারণ করুন',
      'প্রয়োজনে কৃষি অফিসের পরামর্শে ছত্রাকনাশক প্রয়োগ করুন',
    ],
  },
  Normal_Leaf: {
    labelEn: 'Healthy',
    nameBn: 'সুস্থ পাতা',
    isHealthy: true,
    causeBn: 'কোনো রোগ শনাক্ত হয়নি — পাতাটি স্বাভাবিক ও সুস্থ দেখাচ্ছে।',
    symptomsBn: 'পাতার রঙ স্বাভাবিক সবুজ, কোনো দাগ বা ক্ষত নেই।',
    managementBn: [
      'নিয়মিত জমি পর্যবেক্ষণ চালিয়ে যান',
      'সুষম সার ও সঠিক পানি ব্যবস্থাপনা বজায় রাখুন',
      'নতুন লক্ষণ দেখা দিলে আবার scan করুন',
    ],
  },
  Sheath_Blight: {
    labelEn: 'Sheath Blight',
    nameBn: 'শিথ ব্লাইট রোগ',
    isHealthy: false,
    causeBn: 'Rhizoctonia solani নামক ছত্রাকের আক্রমণে হয়, ঘন চারা রোপণ ও অতিরিক্ত সেচের জমিতে বেশি দেখা যায়।',
    symptomsBn: 'কাণ্ডের নিচের অংশে (শিথ) ডিম্বাকার সবুজাভ-ধূসর দাগ পড়ে, পরে তা বাদামি হয়ে ছড়িয়ে পড়ে।',
    managementBn: [
      'ঘন করে চারা না লাগিয়ে যথাযথ দূরত্ব বজায় রাখুন',
      'জমিতে পানি বেশিদিন জমিয়ে না রাখা',
      'আক্রান্ত গোড়ার অংশ পরিষ্কার করুন',
      'কৃষি অফিসের পরামর্শে অনুমোদিত ছত্রাকনাশক ব্যবহার করুন',
    ],
  },
  Tungro: {
    labelEn: 'Tungro',
    nameBn: 'টুংরো ভাইরাস রোগ',
    isHealthy: false,
    causeBn: 'এটি একটি ভাইরাসজনিত রোগ, যা সবুজ পাতা ফড়িং (green leafhopper) পোকার মাধ্যমে ছড়ায়।',
    symptomsBn: 'পাতা হলুদ থেকে কমলা রঙ ধারণ করে, গাছের বৃদ্ধি বাধাগ্রস্ত হয় ও কুশি কম হয়।',
    managementBn: [
      'পোকা বাহক (green leafhopper) দমনে ব্যবস্থা নিন',
      'আক্রান্ত গাছ তুলে ধ্বংস করুন যাতে ভাইরাস না ছড়ায়',
      'প্রতিরোধী জাতের ধান ব্যবহারের কথা ভাবুন',
      'নিকটস্থ কৃষি অফিসে দ্রুত জানান — এটি দ্রুত ছড়াতে পারে',
    ],
  },
};