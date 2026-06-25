// In-memory demo data for when MongoDB is not available
import bcrypt from "bcryptjs";

export interface DemoUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  location: string;
  language: string;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
}

export interface DemoScheme {
  _id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  category: string;
  eligibility: string;
  benefits: string;
  documents: string;
  applicationLink: string;
  isActive: boolean;
  createdAt: string;
}

export interface DemoCrop {
  _id: string;
  name: string;
  nameTa: string;
  season: string;
  soilType: string;
  cultivationGuide: string;
  fertilizerRecommendation: string;
  irrigationInfo: string;
  pestInfo: string;
  image: string;
}

// In-memory stores
export const demoUsers: DemoUser[] = [];
export const demoLivestock: unknown[] = [];
export const demoConsultations: unknown[] = [];
export const demoVaccinations: unknown[] = [];
export const demoNotifications: unknown[] = [];
export const demoChatHistory: unknown[] = [];

export const demoSchemes: DemoScheme[] = [
  {
    _id: "scheme_1",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    titleTa: "பிரதான் மந்திரி கிசான் சம்மான் நிதி",
    description: "Direct income support of ₹6,000 per year to small and marginal farmers in three equal installments.",
    descriptionTa: "சிறு மற்றும் குறு விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 நேரடி வருமான ஆதரவு மூன்று சம தவணைகளில் வழங்கப்படுகிறது.",
    category: "central",
    eligibility: "Small and marginal farmers with landholding up to 2 hectares. Must have valid Aadhaar card and bank account.",
    benefits: "₹6,000 per year in three installments of ₹2,000 each directly to bank account.",
    documents: "Aadhaar Card, Land Records (Patta), Bank Account Details, Mobile Number",
    applicationLink: "https://pmkisan.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_2",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    titleTa: "பிரதான் மந்திரி பயிர் காப்பீட்டு திட்டம்",
    description: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events.",
    descriptionTa: "எதிர்பாராத நிகழ்வுகளால் பயிர் இழப்பு/சேதம் ஏற்படும் விவசாயிகளுக்கு நிதி ஆதரவு வழங்கும் விரிவான பயிர் காப்பீட்டு திட்டம்.",
    category: "central",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops.",
    benefits: "Premium as low as 2% for Kharif crops, 1.5% for Rabi crops. Full coverage for crop loss.",
    documents: "Aadhaar Card, Bank Account, Land Records, Sowing Certificate",
    applicationLink: "https://pmfby.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_3",
    title: "Kisan Credit Card (KCC)",
    titleTa: "கிசான் கிரெடிட் கார்டு",
    description: "Provides farmers with timely credit for agricultural needs including crop cultivation, post-harvest expenses, and allied activities.",
    descriptionTa: "பயிர் சாகுபடி, அறுவடைக்கு பிந்தைய செலவுகள் மற்றும் தொடர்புடைய நடவடிக்கைகள் உட்பட விவசாய தேவைகளுக்கு விவசாயிகளுக்கு சரியான நேரத்தில் கடன் வழங்குகிறது.",
    category: "central",
    eligibility: "All farmers, sharecroppers, oral lessees, and self-help groups.",
    benefits: "Credit limit up to ₹3 lakh at 4% interest rate. Flexible repayment.",
    documents: "Aadhaar Card, Land Records, Passport Photo, Bank Account",
    applicationLink: "https://www.nabard.org",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_4",
    title: "Soil Health Card Scheme",
    titleTa: "மண் ஆரோக்கிய அட்டை திட்டம்",
    description: "Provides soil health cards to farmers with crop-wise recommendations of nutrients and fertilizers for individual farms.",
    descriptionTa: "தனிப்பட்ட பண்ணைகளுக்கு ஊட்டச்சத்துக்கள் மற்றும் உரங்களின் பயிர்வாரி பரிந்துரைகளுடன் விவசாயிகளுக்கு மண் ஆரோக்கிய அட்டைகளை வழங்குகிறது.",
    category: "central",
    eligibility: "All farmers across India.",
    benefits: "Free soil testing, personalized fertilizer recommendations, improved crop yield.",
    documents: "Aadhaar Card, Land Records",
    applicationLink: "https://soilhealth.dac.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_5",
    title: "National Livestock Mission (NLM)",
    titleTa: "தேசிய கால்நடை இயக்கம்",
    description: "Supports sustainable development of livestock sector including poultry, small ruminants, pigs, and fodder development.",
    descriptionTa: "கோழி, சிறிய மசால் விலங்குகள், பன்றிகள் மற்றும் தீவன மேம்பாடு உட்பட கால்நடை துறையின் நிலையான வளர்ச்சியை ஆதரிக்கிறது.",
    category: "central",
    eligibility: "Farmers, entrepreneurs, SHGs, FPOs engaged in livestock activities.",
    benefits: "Subsidy up to 50% for livestock infrastructure. Support for breed improvement.",
    documents: "Aadhaar Card, Bank Account, Project Report",
    applicationLink: "https://nlm.udyamimitra.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_6",
    title: "Rashtriya Gokul Mission",
    titleTa: "ராஷ்ட்ரிய கோகுல் இயக்கம்",
    description: "Development and conservation of indigenous bovine breeds to enhance milk production and productivity.",
    descriptionTa: "பால் உற்பத்தி மற்றும் உற்பத்தித்திறனை மேம்படுத்த உள்நாட்டு மாட்டு இனங்களின் வளர்ச்சி மற்றும் பாதுகாப்பு.",
    category: "dairy",
    eligibility: "Dairy farmers, cooperatives, and institutions working with indigenous cattle breeds.",
    benefits: "Subsidy for Gokul Grams, breed improvement programs, AI services.",
    documents: "Aadhaar Card, Land Records, Cattle Registration",
    applicationLink: "https://dahd.nic.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_7",
    title: "NABARD Dairy Entrepreneurship Development Scheme",
    titleTa: "நாபார்ட் பால் தொழில் முனைவோர் மேம்பாட்டு திட்டம்",
    description: "Provides back-ended capital subsidy for setting up modern dairy farms and infrastructure.",
    descriptionTa: "நவீன பால் பண்ணைகள் மற்றும் உள்கட்டமைப்பை அமைப்பதற்கு பின்-முனை மூலதன மானியம் வழங்குகிறது.",
    category: "dairy",
    eligibility: "Farmers, individual entrepreneurs, NGOs, companies, cooperatives.",
    benefits: "25% back-ended capital subsidy (33.33% for SC/ST). Maximum subsidy ₹3.30 lakh.",
    documents: "Project Report, Aadhaar Card, Bank Account, Land Documents",
    applicationLink: "https://www.nabard.org",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_8",
    title: "Tamil Nadu Goat Development Scheme",
    titleTa: "தமிழ்நாடு ஆடு வளர்ப்பு திட்டம்",
    description: "State scheme to promote goat farming among small and marginal farmers with subsidized goat units.",
    descriptionTa: "மானிய ஆட்டு அலகுகளுடன் சிறு மற்றும் குறு விவசாயிகளிடையே ஆடு வளர்ப்பை ஊக்குவிக்கும் மாநில திட்டம்.",
    category: "goat",
    eligibility: "Small and marginal farmers in Tamil Nadu. Priority to SC/ST and women farmers.",
    benefits: "Subsidy of 50% for purchase of 10 female goats + 1 male goat. Training provided.",
    documents: "Aadhaar Card, Community Certificate, Bank Account, Land Records",
    applicationLink: "https://www.tn.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_9",
    title: "Poultry Development Scheme - Tamil Nadu",
    titleTa: "கோழி வளர்ப்பு மேம்பாட்டு திட்டம்",
    description: "Promotes backyard and commercial poultry farming with subsidized chicks and training.",
    descriptionTa: "மானிய குஞ்சுகள் மற்றும் பயிற்சியுடன் பின்னட்டு மற்றும் வணிக கோழி வளர்ப்பை ஊக்குவிக்கிறது.",
    category: "poultry",
    eligibility: "Farmers and rural households in Tamil Nadu.",
    benefits: "50% subsidy on chick cost. Free training on poultry management.",
    documents: "Aadhaar Card, Bank Account, Residence Proof",
    applicationLink: "https://www.tn.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_10",
    title: "PM Krishi Sinchai Yojana (PMKSY)",
    titleTa: "பிரதான் மந்திரி கிருஷி சிஞ்சாய் யோஜனா",
    description: "Ensures access to water for every farm and improves water use efficiency through micro-irrigation.",
    descriptionTa: "நுண்ணீர் பாசனம் மூலம் ஒவ்வொரு பண்ணைக்கும் நீர் அணுகலை உறுதி செய்கிறது.",
    category: "agriculture",
    eligibility: "All farmers with agricultural land.",
    benefits: "55% subsidy for drip/sprinkler irrigation for small farmers. 45% for others.",
    documents: "Land Records, Aadhaar Card, Bank Account",
    applicationLink: "https://pmksy.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_11",
    title: "e-NAM (National Agriculture Market)",
    titleTa: "மின்-தேசிய விவசாய சந்தை",
    description: "Online trading platform for agricultural commodities to ensure better price discovery for farmers.",
    descriptionTa: "விவசாயிகளுக்கு சிறந்த விலை கண்டுபிடிப்பை உறுதி செய்ய விவசாய பொருட்களுக்கான ஆன்லைன் வர்த்தக தளம்.",
    category: "agriculture",
    eligibility: "All farmers registered with APMC markets.",
    benefits: "Better price realization, transparent trading, reduced intermediaries.",
    documents: "Aadhaar Card, Bank Account, APMC Registration",
    applicationLink: "https://enam.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "scheme_12",
    title: "Tamil Nadu Chief Minister's Comprehensive Insurance Scheme",
    titleTa: "தமிழ்நாடு முதலமைச்சர் விரிவான காப்பீட்டு திட்டம்",
    description: "Provides comprehensive insurance coverage to farmers and their families in Tamil Nadu.",
    descriptionTa: "தமிழ்நாட்டில் விவசாயிகள் மற்றும் அவர்களது குடும்பங்களுக்கு விரிவான காப்பீட்டு பாதுகாப்பை வழங்குகிறது.",
    category: "state",
    eligibility: "All farmers in Tamil Nadu with valid Patta.",
    benefits: "Life insurance ₹2 lakh, accident insurance ₹5 lakh, crop insurance coverage.",
    documents: "Patta, Aadhaar Card, Bank Account",
    applicationLink: "https://www.tn.gov.in",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const demoCrops: DemoCrop[] = [
  {
    _id: "crop_1",
    name: "Rice (Paddy)",
    nameTa: "நெல்",
    season: "Kharif",
    soilType: "Clay loam, alluvial soil with good water retention",
    cultivationGuide: "1. Land Preparation: Plow 2-3 times, puddle the field.\n2. Seed Selection: Use certified seeds like ADT 43, CO 51, or IR 64.\n3. Nursery: Prepare nursery 25-30 days before transplanting.\n4. Transplanting: Transplant 21-25 day old seedlings at 20x15 cm spacing.\n5. Water Management: Maintain 5cm water level during vegetative stage.\n6. Harvesting: Harvest when 80% grains turn golden yellow (105-120 days).",
    fertilizerRecommendation: "Basal: 50 kg Urea + 375 kg SSP + 100 kg MOP per hectare.\nTop dressing: 50 kg Urea at tillering stage + 50 kg Urea at panicle initiation.\nApply zinc sulfate 25 kg/ha if deficiency observed.",
    irrigationInfo: "Requires 1200-1500mm water. Maintain 5cm standing water during vegetative stage. Drain field 10 days before harvest. Use SRI method to save 30-40% water.",
    pestInfo: "Major pests: Stem borer, Brown Plant Hopper, Leaf folder.\nDiseases: Blast, Bacterial Leaf Blight, Sheath Blight.\nUse IPM practices. Apply Carbofuran 3G for stem borer control.",
    image: "",
  },
  {
    _id: "crop_2",
    name: "Tomato",
    nameTa: "தக்காளி",
    season: "Rabi",
    soilType: "Well-drained sandy loam soil, pH 6-7",
    cultivationGuide: "1. Nursery: Raise seedlings in raised beds.\n2. Transplanting: 25-30 day old seedlings at 60x45 cm spacing.\n3. Varieties: PKM 1, CO 3, Arka Vikas, Hybrid varieties.\n4. Staking: Provide stakes for indeterminate varieties.\n5. Harvesting: 60-70 days after transplanting.",
    fertilizerRecommendation: "120 kg N + 60 kg P2O5 + 60 kg K2O per hectare. Apply 50% N and full P, K as basal. Remaining N in 2 splits. Foliar spray of 0.5% Boron at flowering.",
    irrigationInfo: "Requires 400-600mm water. Drip irrigation preferred. Critical stages: transplanting, flowering, fruit development. Avoid overhead irrigation to prevent diseases.",
    pestInfo: "Fruit borer, Whitefly, Leaf curl virus, Early blight, Late blight. Use yellow sticky traps. Spray Spinosad for fruit borer. Apply Mancozeb for blight control.",
    image: "",
  },
  {
    _id: "crop_3",
    name: "Onion",
    nameTa: "வெங்காயம்",
    season: "Rabi",
    soilType: "Well-drained sandy loam to loam soil, pH 6-7",
    cultivationGuide: "1. Nursery: Raise seedlings in raised beds, 8-10 weeks.\n2. Transplanting: 45x10 cm spacing.\n3. Varieties: Aggregatum, CO 3, CO 4, Bellary Red.\n4. Bulb Formation: Reduce irrigation 10 days before harvest.\n5. Harvesting: When 50% tops fall over.",
    fertilizerRecommendation: "100 kg N + 50 kg P2O5 + 50 kg K2O per hectare. Apply in 3 splits. Sulfur application (25 kg/ha) improves pungency and shelf life.",
    irrigationInfo: "Requires 350-550mm water. Avoid waterlogging. Reduce irrigation at bulb maturation stage. Drip irrigation increases yield and quality.",
    pestInfo: "Thrips, Purple blotch, Stemphylium blight, Basal rot. Use blue sticky traps for thrips monitoring. Spray Spinosad or Fipronil for thrips control.",
    image: "",
  },
  {
    _id: "crop_4",
    name: "Cotton",
    nameTa: "பருத்தி",
    season: "Kharif",
    soilType: "Black cotton soil (Vertisol), deep well-drained soil",
    cultivationGuide: "1. Sowing: June-July after monsoon onset.\n2. Seed Rate: 2.5 kg/ha (hybrid), 3-4 kg/ha (desi).\n3. Spacing: 90x60 cm for hybrid, 60x30 cm for desi.\n4. Varieties: MCU 5, SVPR 2, Bunny BG II.\n5. Harvesting: Pick bolls when fully open (150-180 days).",
    fertilizerRecommendation: "180 kg N + 90 kg P2O5 + 90 kg K2O per hectare for hybrid cotton. Apply in 4 splits. Foliar spray of 2% DAP at boll development stage.",
    irrigationInfo: "Critical irrigation at flowering and boll development. Total 5-7 irrigations needed. Avoid water stress during boll opening.",
    pestInfo: "Bollworm complex (American, Spotted, Pink), Whitefly, Thrips, Jassids. Use Bt cotton varieties. Spray Spinosad or Emamectin benzoate for bollworm control.",
    image: "",
  },
  {
    _id: "crop_5",
    name: "Banana",
    nameTa: "வாழை",
    season: "Zaid",
    soilType: "Well-drained loamy soil rich in organic matter, pH 6-7.5",
    cultivationGuide: "1. Planting: Any time except peak summer.\n2. Planting Material: Tissue culture plants or sword suckers.\n3. Spacing: 1.8x1.8 m or 2x2 m.\n4. Varieties: Grand Naine, Robusta, Poovan, Nendran.\n5. Harvesting: 11-14 months after planting.",
    fertilizerRecommendation: "200 g N + 100 g P2O5 + 300 g K2O per plant per year. Apply in 4-6 splits. Potassium is critical for fruit quality. Use drip fertigation for best results.",
    irrigationInfo: "Requires 1200-1500mm water. Drip irrigation at 16-20 liters/plant/day. Avoid waterlogging. Mulching reduces water requirement by 30%.",
    pestInfo: "Banana weevil, Nematodes, Sigatoka leaf spot, Panama wilt. Use disease-free planting material. Apply Carbofuran for weevil control. Spray Mancozeb for Sigatoka.",
    image: "",
  },
  {
    _id: "crop_6",
    name: "Sugarcane",
    nameTa: "கரும்பு",
    season: "Zaid",
    soilType: "Deep, well-drained loamy soil, pH 6-7.5",
    cultivationGuide: "1. Planting: January-February or June-July.\n2. Seed Cane: Use 3-budded setts, 35,000-40,000 setts/ha.\n3. Spacing: 90 cm row spacing.\n4. Varieties: CO 86032, CO 0238, CO 94012.\n5. Harvesting: 10-12 months after planting.",
    fertilizerRecommendation: "250 kg N + 100 kg P2O5 + 120 kg K2O per hectare. Apply N in 4 splits. Use trash mulching to conserve moisture and add organic matter.",
    irrigationInfo: "Requires 1500-2500mm water. Critical stages: germination, tillering, grand growth period. Drip irrigation saves 30-40% water and increases yield.",
    pestInfo: "Early shoot borer, Internode borer, Scale insects, Red rot disease. Use hot water treatment for seed cane. Apply Chlorpyrifos for borer control.",
    image: "",
  },
  {
    _id: "crop_7",
    name: "Groundnut",
    nameTa: "நிலக்கடலை",
    season: "Kharif",
    soilType: "Well-drained sandy loam soil, pH 6-6.5",
    cultivationGuide: "1. Sowing: June-July (Kharif), January-February (Rabi).\n2. Seed Rate: 100-120 kg/ha.\n3. Spacing: 30x10 cm.\n4. Varieties: TMV 2, CO 2, VRI 2, TAG 24.\n5. Harvesting: 100-120 days, when leaves turn yellow.",
    fertilizerRecommendation: "25 kg N + 50 kg P2O5 + 50 kg K2O per hectare as basal. Apply Gypsum 500 kg/ha at pegging stage for calcium supply to pods.",
    irrigationInfo: "Requires 500-600mm water. Critical stages: pegging and pod development. Avoid waterlogging. 4-5 irrigations needed.",
    pestInfo: "Leaf miner, Thrips, Tikka disease, Stem rot. Use Trichoderma viride for seed treatment. Spray Chlorothalonil for Tikka disease control.",
    image: "",
  },
  {
    _id: "crop_8",
    name: "Turmeric",
    nameTa: "மஞ்சள்",
    season: "Kharif",
    soilType: "Well-drained loamy or clay loam soil rich in organic matter",
    cultivationGuide: "1. Planting: April-May with onset of monsoon.\n2. Seed Rhizomes: 2500 kg/ha.\n3. Spacing: 45x25 cm.\n4. Varieties: BSR 1, CO 1, Erode Local, Salem.\n5. Harvesting: 7-9 months after planting when leaves turn yellow.",
    fertilizerRecommendation: "60 kg N + 50 kg P2O5 + 120 kg K2O per hectare. Apply in 3 splits. Organic manure 25-30 tonnes/ha improves quality and yield.",
    irrigationInfo: "Requires 1500mm water. Mulching with paddy straw conserves moisture. 15-20 irrigations needed. Avoid waterlogging.",
    pestInfo: "Rhizome rot, Leaf blotch, Shoot borer. Use disease-free rhizomes. Treat with Mancozeb before planting. Apply Chlorpyrifos for shoot borer.",
    image: "",
  },
  {
    _id: "crop_9",
    name: "Chilli",
    nameTa: "மிளகாய்",
    season: "Kharif",
    soilType: "Well-drained sandy loam to clay loam soil, pH 6-7",
    cultivationGuide: "1. Nursery: 30-35 day old seedlings.\n2. Transplanting: 60x45 cm spacing.\n3. Varieties: CO 1, PKM 1, Guntur Sannam, K1.\n4. Staking: Required for tall varieties.\n5. Harvesting: Green chilli 60-70 days, Red chilli 90-100 days.",
    fertilizerRecommendation: "120 kg N + 60 kg P2O5 + 60 kg K2O per hectare. Apply in 4 splits. Foliar spray of 0.5% Boron and 0.5% Zinc sulfate at flowering.",
    irrigationInfo: "Requires 600-800mm water. Drip irrigation preferred. Critical stages: transplanting, flowering, fruit development. Avoid water stress during flowering.",
    pestInfo: "Thrips, Mites, Fruit borer, Anthracnose, Powdery mildew. Use yellow sticky traps. Spray Abamectin for mite control. Apply Carbendazim for anthracnose.",
    image: "",
  },
  {
    _id: "crop_10",
    name: "Coconut",
    nameTa: "தேங்காய்",
    season: "Zaid",
    soilType: "Well-drained sandy loam to laterite soil, pH 5.5-7",
    cultivationGuide: "1. Planting: June-July or September-October.\n2. Spacing: 7.5x7.5 m (triangular).\n3. Varieties: WCT, ECT, Hybrid COD x WCT.\n4. Pit Size: 1x1x1 m.\n5. Bearing: 5-7 years after planting. Harvest every 45 days.",
    fertilizerRecommendation: "500 g N + 320 g P2O5 + 1200 g K2O per palm per year. Apply in 2 splits (June and December). Magnesium sulfate 500 g/palm for deficiency correction.",
    irrigationInfo: "Requires 1500-2000mm water. Drip irrigation at 40-50 liters/palm/day. Basin irrigation 200 liters/palm/week in summer.",
    pestInfo: "Rhinoceros beetle, Red palm weevil, Eriophyid mite, Root wilt disease. Use pheromone traps for weevil monitoring. Apply Chlorpyrifos for beetle control.",
    image: "",
  },
];

export const demoMarketPrices = [
  { _id: "mp_1", cropName: "Rice (Paddy)", cropNameTa: "நெல்", price: 2200, unit: "per quintal", market: "Chennai APMC", location: "Chennai", date: new Date().toISOString(), priceHistory: generateHistory(2200) },
  { _id: "mp_2", cropName: "Tomato", cropNameTa: "தக்காளி", price: 1200, unit: "per quintal", market: "Koyambedu Market", location: "Chennai", date: new Date().toISOString(), priceHistory: generateHistory(1200) },
  { _id: "mp_3", cropName: "Onion", cropNameTa: "வெங்காயம்", price: 1500, unit: "per quintal", market: "Madurai APMC", location: "Madurai", date: new Date().toISOString(), priceHistory: generateHistory(1500) },
  { _id: "mp_4", cropName: "Cotton", cropNameTa: "பருத்தி", price: 6500, unit: "per quintal", market: "Tirupur APMC", location: "Tirupur", date: new Date().toISOString(), priceHistory: generateHistory(6500) },
  { _id: "mp_5", cropName: "Banana", cropNameTa: "வாழை", price: 1800, unit: "per quintal", market: "Trichy APMC", location: "Trichy", date: new Date().toISOString(), priceHistory: generateHistory(1800) },
  { _id: "mp_6", cropName: "Sugarcane", cropNameTa: "கரும்பு", price: 3200, unit: "per tonne", market: "Erode APMC", location: "Erode", date: new Date().toISOString(), priceHistory: generateHistory(3200) },
  { _id: "mp_7", cropName: "Groundnut", cropNameTa: "நிலக்கடலை", price: 5500, unit: "per quintal", market: "Vellore APMC", location: "Vellore", date: new Date().toISOString(), priceHistory: generateHistory(5500) },
  { _id: "mp_8", cropName: "Turmeric", cropNameTa: "மஞ்சள்", price: 8000, unit: "per quintal", market: "Erode APMC", location: "Erode", date: new Date().toISOString(), priceHistory: generateHistory(8000) },
  { _id: "mp_9", cropName: "Chilli", cropNameTa: "மிளகாய்", price: 9000, unit: "per quintal", market: "Guntur APMC", location: "Guntur", date: new Date().toISOString(), priceHistory: generateHistory(9000) },
  { _id: "mp_10", cropName: "Coconut", cropNameTa: "தேங்காய்", price: 1800, unit: "per 100 nuts", market: "Pollachi APMC", location: "Pollachi", date: new Date().toISOString(), priceHistory: generateHistory(1800) },
  { _id: "mp_11", cropName: "Wheat", cropNameTa: "கோதுமை", price: 2100, unit: "per quintal", market: "Coimbatore APMC", location: "Coimbatore", date: new Date().toISOString(), priceHistory: generateHistory(2100) },
  { _id: "mp_12", cropName: "Maize", cropNameTa: "மக்காச்சோளம்", price: 1800, unit: "per quintal", market: "Salem APMC", location: "Salem", date: new Date().toISOString(), priceHistory: generateHistory(1800) },
];

function generateHistory(basePrice: number) {
  return Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    const variation = (Math.random() - 0.5) * 0.1 * basePrice;
    return { price: Math.round(basePrice + variation), date: date.toISOString() };
  });
}

let adminInitialized = false;

export async function initDemoAdmin(): Promise<void> {
  if (adminInitialized) return;
  adminInitialized = true;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@agrivet.ai";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const existing = demoUsers.find((u) => u.email === adminEmail);
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    demoUsers.push({
      _id: "admin_1",
      name: "AgriVet Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
      phone: "+91-9876543210",
      location: "Chennai, Tamil Nadu",
      language: "en",
      profileImage: "",
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    console.log(`Demo admin created: ${adminEmail}`);
  }
}
