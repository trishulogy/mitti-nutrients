// ============================================================================
// Advisory Builder
// ============================================================================
// Generates localized, plain-language action cards from sensor data +
// severity levels. This is the "translation layer" that converts chemical
// data into farmer-friendly instructions.
// ============================================================================

import type { NutrientKey, SeverityLevel, Advisory, LocaleCode } from '../types';

// ── Advisory Template Registry ─────────────────────────────────────────────
// Each nutrient × severity combination has a message in every supported language.

type AdvisoryTemplate = {
  message: Record<LocaleCode, string>;
  detail?: Record<LocaleCode, string>;
  iconName: string;
  dueInDays?: number;
};

type AdvisoryRegistry = Record<NutrientKey, Record<SeverityLevel, AdvisoryTemplate>>;

export const ADVISORY_REGISTRY: AdvisoryRegistry = {
  nitrogen: {
    critical: {
      message: {
        en: 'Nitrogen is very low. Apply urea (46-0-0) at 50 kg/acre within 2 days.',
        hi: 'नाइट्रोजन बहुत कम है। 2 दिन में 50 किग्रा/एकड़ यूरिया डालें।',
        ta: 'நைட்ரஜன் மிகக் குறைவு. 2 நாளில் ஏக்கருக்கு 50 கிலோ யூரியா இடவும்.',
        te: 'నత్రజని చాలా తక్కువగా ఉంది. 2 రోజుల్లో ఎకరాకు 50 కిలోల యూరియా వేయండి.',
        mr: 'नायट्रोजन खूप कमी आहे. 2 दिवसांत 50 किलो/एकर युरिया टाका.',
        bn: 'নাইট্রোজেন খুবই কম। ২ দিনের মধ্যে একরে ৫০ কেজি ইউরিয়া দিন।',
      },
      detail: {
        en: 'Nitrogen deficiency causes yellowing of older leaves and stunted growth. Urea is the most cost-effective nitrogen source. Apply in the evening and irrigate lightly after application.',
        hi: 'नाइट्रोजन की कमी से पुरानी पत्तियाँ पीली पड़ जाती हैं। यूरिया शाम को डालें और हल्की सिंचाई करें।',
        ta: 'நைட்ரஜன் குறைபாடு பழைய இலைகள் மஞ்சளாவதற்கு காரணமாகும். மாலையில் யூரியா இட்டு, லேசாக நீர் பாய்ச்சவும்.',
        te: 'నత్రజని లోపం వల్ల పాత ఆకులు పసుపు రంగులోకి మారతాయి. సాయంత్రం యూరియా వేసి తేలికగా నీరు పెట్టండి.',
        mr: 'नायट्रोजनच्या कमतरतेमुळे जुनी पाने पिवळी पडतात. संध्याकाळी युरिया टाकून हलके पाणी द्या.',
        bn: 'নাইট্রোজেনের ঘাটতিতে পুরনো পাতা হলুদ হয়ে যায়। সন্ধ্যায় ইউরিয়া দিন ও হালকা সেচ দিন।',
      },
      iconName: 'urea-bag',
      dueInDays: 2,
    },
    warning: {
      message: {
        en: 'Nitrogen is slightly low. Plan a urea top-dress within the next week.',
        hi: 'नाइट्रोजन थोड़ा कम है। अगले सप्ताह यूरिया की टॉप ड्रेसिंग करें।',
        ta: 'நைட்ரஜன் சற்று குறைவு. அடுத்த வாரத்தில் யூரியா மேலுரம் இடத் திட்டமிடுங்கள்.',
        te: 'నత్రజని కొంచెం తక్కువగా ఉంది. వచ్చే వారంలో యూరియా పైపాటు వేయండి.',
        mr: 'नायट्रोजन थोडे कमी आहे. पुढील आठवड्यात युरिया टॉप ड्रेसिंग करा.',
        bn: 'নাইট্রোজেন সামান্য কম। আগামী সপ্তাহে ইউরিয়া টপ ড্রেসিং করুন।',
      },
      iconName: 'calendar-alert',
      dueInDays: 7,
    },
    optimal: {
      message: {
        en: 'Nitrogen level is healthy. No action needed.',
        hi: 'नाइट्रोजन का स्तर ठीक है। कोई कार्रवाई की ज़रूरत नहीं।',
        ta: 'நைட்ரஜன் அளவு நல்லது. எந்த நடவடிக்கையும் தேவையில்லை.',
        te: 'నత్రజని స్థాయి బాగుంది. చర్య అవసరం లేదు.',
        mr: 'नायट्रोजनचे प्रमाण योग्य आहे. कोणत्याही कृतीची गरज नाही.',
        bn: 'নাইট্রোজেনের মাত্রা ভালো। কোনো পদক্ষেপের দরকার নেই।',
      },
      iconName: 'check-circle',
    },
  },

  phosphorus: {
    critical: {
      message: {
        en: 'Phosphorus is very low. Apply DAP or SSP at 40 kg/acre immediately.',
        hi: 'फॉस्फोरस बहुत कम है। तुरंत 40 किग्रा/एकड़ DAP या SSP डालें।',
        ta: 'பாஸ்பரஸ் மிகக் குறைவு. உடனடியாக ஏக்கருக்கு 40 கிலோ DAP இடவும்.',
        te: 'భాస్వరం చాలా తక్కువ. వెంటనే ఎకరాకు 40 కిలోల DAP వేయండి.',
        mr: 'फॉस्फरस खूप कमी आहे. ताबडतोब 40 किलो/एकर DAP टाका.',
        bn: 'ফসফরাস খুবই কম। এখনই একরে ৪০ কেজি DAP দিন।',
      },
      iconName: 'fertilizer-spread',
      dueInDays: 1,
    },
    warning: {
      message: {
        en: 'Phosphorus is slightly low. Consider applying bone meal or SSP at next sowing.',
        hi: 'फॉस्फोरस थोड़ा कम है। अगली बुवाई में हड्डी का चूरा या SSP डालें।',
        ta: 'பாஸ்பரஸ் சற்று குறைவு. அடுத்த விதைப்பில் எலும்புத்தூள் இடுங்கள்.',
        te: 'భాస్వరం కొంచెం తక్కువ. తదుపరి విత్తనంలో ఎముక పొడి వేయండి.',
        mr: 'फॉस्फरस थोडे कमी आहे. पुढील पेरणीत हाडांची पूड टाका.',
        bn: 'ফসফরাস সামান্য কম। পরবর্তী বপনে হাড়ের গুঁড়ো দিন।',
      },
      iconName: 'calendar-alert',
      dueInDays: 14,
    },
    optimal: {
      message: {
        en: 'Phosphorus level is healthy. No action needed.',
        hi: 'फॉस्फोरस का स्तर ठीक है। कोई कार्रवाई की ज़रूरत नहीं।',
        ta: 'பாஸ்பரஸ் அளவு நல்லது. நடவடிக்கை தேவையில்லை.',
        te: 'భాస్వరం స్థాయి బాగుంది. చర్య అవసరం లేదు.',
        mr: 'फॉस्फरसचे प्रमाण योग्य आहे. कृतीची गरज नाही.',
        bn: 'ফসফরাসের মাত্রা ভালো। পদক্ষেপের দরকার নেই।',
      },
      iconName: 'check-circle',
    },
  },

  potassium: {
    critical: {
      message: {
        en: 'Potassium is very low. Apply MOP (Muriate of Potash) at 30 kg/acre urgently.',
        hi: 'पोटैशियम बहुत कम है। तुरंत 30 किग्रा/एकड़ MOP डालें।',
        ta: 'பொட்டாசியம் மிகக் குறைவு. அவசரமாக ஏக்கருக்கு 30 கிலோ MOP இடவும்.',
        te: 'పొటాషియం చాలా తక్కువ. అత్యవసరంగా ఎకరాకు 30 కిలోల MOP వేయండి.',
        mr: 'पोटॅशियम खूप कमी आहे. तातडीने 30 किलो/एकर MOP टाका.',
        bn: 'পটাশিয়াম খুবই কম। জরুরি ভিত্তিতে একরে ৩০ কেজি MOP দিন।',
      },
      iconName: 'alert-triangle',
      dueInDays: 3,
    },
    warning: {
      message: {
        en: 'Potassium is slightly low. Add potash fertilizer at next irrigation.',
        hi: 'पोटैशियम थोड़ा कम है। अगली सिंचाई में पोटाश खाद डालें।',
        ta: 'பொட்டாசியம் சற்று குறைவு. அடுத்த பாசனத்தில் பொட்டாஷ் உரம் இடுங்கள்.',
        te: 'పొటాషియం కొంచెం తక్కువ. తదుపరి నీటిపారుదలలో పొటాష్ ఎరువు వేయండి.',
        mr: 'पोटॅशियम थोडे कमी आहे. पुढील सिंचनात पोटॅश खत टाका.',
        bn: 'পটাশিয়াম সামান্য কম। পরবর্তী সেচে পটাশ সার দিন।',
      },
      iconName: 'calendar-alert',
      dueInDays: 7,
    },
    optimal: {
      message: {
        en: 'Potassium level is healthy. No action needed.',
        hi: 'पोटैशियम का स्तर ठीक है। कोई कार्रवाई की ज़रूरत नहीं।',
        ta: 'பொட்டாசியம் அளவு நல்லது. நடவடிக்கை தேவையில்லை.',
        te: 'పొటాషియం స్థాయి బాగుంది. చర్య అవసరం లేదు.',
        mr: 'पोटॅशियमचे प्रमाण योग्य आहे. कृतीची गरज नाही.',
        bn: 'পটাশিয়ামের মাত্রা ভালো। পদক্ষেপের দরকার নেই।',
      },
      iconName: 'check-circle',
    },
  },

  ph: {
    critical: {
      message: {
        en: 'Soil pH is out of safe range. Consult your local KVK or agronomist immediately.',
        hi: 'मिट्टी का pH असुरक्षित है। तुरंत अपने स्थानीय KVK या कृषि विशेषज्ञ से संपर्क करें।',
        ta: 'மண்ணின் pH பாதுகாப்பான எல்லைக்கு வெளியே. உடனடியாக KVK-ஐ அணுகவும்.',
        te: 'మట్టి pH సురక్షిత పరిధిలో లేదు. వెంటనే KVK ని సంప్రదించండి.',
        mr: 'मातीचा pH असुरक्षित आहे. ताबडतोब स्थानिक KVK शी संपर्क साधा.',
        bn: 'মাটির pH নিরাপদ সীমার বাইরে। এখনই স্থানীয় KVK-এর সাথে যোগাযোগ করুন।',
      },
      iconName: 'phone-call',
      dueInDays: 1,
    },
    warning: {
      message: {
        en: 'Soil pH is slightly off. Consider lime (if acidic) or gypsum (if alkaline) application.',
        hi: 'मिट्टी का pH थोड़ा असंतुलित है। चूना (अम्लीय हो तो) या जिप्सम (क्षारीय हो तो) डालें।',
        ta: 'மண் pH சற்று சரியில்லை. சுண்ணாம்பு அல்லது ஜிப்சம் இடுங்கள்.',
        te: 'మట్టి pH కొంచెం తేడాగా ఉంది. సున్నం లేదా జిప్సం వేయడం పరిగణించండి.',
        mr: 'मातीचा pH थोडा असंतुलित आहे. चुना किंवा जिप्सम वापरा.',
        bn: 'মাটির pH সামান্য ভারসাম্যহীন। চুন বা জিপসাম দিন।',
      },
      iconName: 'beaker',
      dueInDays: 10,
    },
    optimal: {
      message: {
        en: 'Soil pH is in the ideal range. No action needed.',
        hi: 'मिट्टी का pH आदर्श सीमा में है। कोई कार्रवाई की ज़रूरत नहीं।',
        ta: 'மண் pH சிறந்த வரம்பில் உள்ளது. நடவடிக்கை தேவையில்லை.',
        te: 'మట్టి pH ఆదర్శ పరిధిలో ఉంది. చర్య అవసరం లేదు.',
        mr: 'मातीचा pH आदर्श मर्यादेत आहे. कृतीची गरज नाही.',
        bn: 'মাটির pH আদর্শ সীমায় আছে। পদক্ষেপের দরকার নেই।',
      },
      iconName: 'check-circle',
    },
  },

  ec: {
    critical: {
      message: {
        en: 'Soil salinity (EC) is dangerously high/low. Flush with clean water or consult KVK.',
        hi: 'मिट्टी की लवणता (EC) खतरनाक स्तर पर है। साफ पानी से धोएं या KVK से संपर्क करें।',
        ta: 'மண் உப்புத்தன்மை (EC) ஆபத்தான நிலையில். சுத்தமான நீரால் கழுவுங்கள்.',
        te: 'మట్టి లవణత (EC) ప్రమాదకర స్థాయిలో ఉంది. శుభ్రమైన నీటితో కడగండి.',
        mr: 'मातीची क्षारता (EC) धोकादायक आहे. स्वच्छ पाण्याने धुवा किंवा KVK शी संपर्क साधा.',
        bn: 'মাটির লবণাক্ততা (EC) বিপজ্জনক। পরিষ্কার পানি দিয়ে ধুয়ে দিন।',
      },
      iconName: 'water-drop',
      dueInDays: 1,
    },
    warning: {
      message: {
        en: 'Soil salinity (EC) is slightly off. Monitor and adjust irrigation.',
        hi: 'मिट्टी की लवणता (EC) थोड़ी असंतुलित है। सिंचाई की निगरानी करें।',
        ta: 'மண் உப்புத்தன்மை (EC) சற்று அசாதாரணம். பாசனத்தை கவனியுங்கள்.',
        te: 'మట్టి లవణత (EC) కొంచెం తేడాగా ఉంది. నీటిపారుదలను పర్యవేక్షించండి.',
        mr: 'मातीची क्षारता (EC) थोडी असंतुलित आहे. सिंचन तपासा.',
        bn: 'মাটির লবণাক্ততা (EC) সামান্য অস্বাভাবিক। সেচ পর্যবেক্ষণ করুন।',
      },
      iconName: 'eye',
      dueInDays: 5,
    },
    optimal: {
      message: {
        en: 'Soil salinity (EC) is in the healthy range. No action needed.',
        hi: 'मिट्टी की लवणता (EC) स्वस्थ सीमा में है। कोई कार्रवाई की ज़रूरत नहीं।',
        ta: 'மண் உப்புத்தன்மை (EC) ஆரோக்கியமான வரம்பில். நடவடிக்கை தேவையில்லை.',
        te: 'మట్టి లవణత (EC) ఆరోగ్యకరమైన పరిధిలో ఉంది. చర్య అవసరం లేదు.',
        mr: 'मातीची क्षारता (EC) निरोगी मर्यादेत आहे. कृतीची गरज नाही.',
        bn: 'মাটির লবণাক্ততা (EC) সুস্থ সীমায়। পদক্ষেপের দরকার নেই।',
      },
      iconName: 'check-circle',
    },
  },
};

/**
 * Build a localized advisory for a given nutrient and severity.
 */
export function buildAdvisory(
  nutrientKey: NutrientKey,
  severity: SeverityLevel,
  locale: LocaleCode
): Advisory {
  const template = ADVISORY_REGISTRY[nutrientKey][severity];

  return {
    id: `${nutrientKey}-${severity}`,
    nutrientKey,
    severity,
    message: template.message[locale],
    detailMessage: template.detail?.[locale],
    iconName: template.iconName,
    dueInDays: template.dueInDays,
  };
}

/**
 * Build all advisories for a complete set of nutrient severities.
 * Results are sorted: critical first, then warning, then optimal.
 */
export function buildAllAdvisories(
  severities: Record<NutrientKey, SeverityLevel>,
  locale: LocaleCode
): Advisory[] {
  const nutrientKeys: NutrientKey[] = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'ec'];

  const advisories = nutrientKeys.map((key) =>
    buildAdvisory(key, severities[key], locale)
  );

  // Sort by severity priority: critical → warning → optimal
  const severityOrder: Record<SeverityLevel, number> = {
    critical: 0,
    warning: 1,
    optimal: 2,
  };

  return advisories.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
