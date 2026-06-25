import { Scheme } from "./models/Scheme.js";
import { Crop } from "./models/Crop.js";
import { Disease } from "./models/Disease.js";
import { MarketPrice } from "./models/MarketPrice.js";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";

export async function seedDatabase(): Promise<void> {
  await Promise.all([
    seedAdmin(),
    seedSchemes(),
    seedCrops(),
    seedDiseases(),
    seedMarketPrices(),
  ]);
}

async function seedAdmin(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@agrivet.ai";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "AgriVet Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
      phone: "+91-9876543210",
      location: "Chennai, Tamil Nadu",
    });
    console.log(`Admin user created: ${adminEmail}`);
  }
}

async function seedSchemes(): Promise<void> {
  const count = await Scheme.countDocuments();
  if (count > 0) return;

  const schemes = [
    {
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
    },
    {
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
    },
    {
      title: "Kisan Credit Card (KCC)",
      titleTa: "கிசான் கிரெடிட் கார்டு",
      description: "Provides farmers with timely credit for agricultural needs including crop cultivation, post-harvest expenses, and allied activities.",
      descriptionTa: "பயிர் சாகுபடி, அறுவடைக்கு பிந்தைய செலவுகள் மற்றும் தொடர்புடைய நடவடிக்கைகள் உட்பட விவசாய தேவைகளுக்கு விவசாயிகளுக்கு சரியான நேரத்தில் கடன் வழங்குகிறது.",
      category: "central",
      eligibility: "All farmers, sharecroppers, oral lessees, and self-help groups.",
      benefits: "Credit limit up to ₹3 lakh at 4% interest rate (with interest subvention). Flexible repayment.",
      documents: "Aadhaar Card, Land Records, Passport Photo, Bank Account",
      applicationLink: "https://www.nabard.org/content1.aspx?id=572",
      isActive: true,
    },
    {
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
    },
    {
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
    },
    {
      title: "Rashtriya Gokul Mission",
      titleTa: "ராஷ்ட்ரிய கோகுல் இயக்கம்",
      description: "Development and conservation of indigenous bovine breeds to enhance milk production and productivity.",
      descriptionTa: "பால் உற்பத்தி மற்றும் உற்பத்தித்திறனை மேம்படுத்த உள்நாட்டு மாட்டு இனங்களின் வளர்ச்சி மற்றும் பாதுகாப்பு.",
      category: "dairy",
      eligibility: "Dairy farmers, cooperatives, and institutions working with indigenous cattle breeds.",
      benefits: "Subsidy for Gokul Grams, breed improvement programs, AI services.",
      documents: "Aadhaar Card, Land Records, Cattle Registration",
      applicationLink: "https://dahd.nic.in/schemes/rashtriya-gokul-mission",
      isActive: true,
    },
    {
      title: "NABARD Dairy Entrepreneurship Development Scheme (DEDS)",
      titleTa: "நாபார்ட் பால் தொழில் முனைவோர் மேம்பாட்டு திட்டம்",
      description: "Provides back-ended capital subsidy for setting up modern dairy farms and infrastructure.",
      descriptionTa: "நவீன பால் பண்ணைகள் மற்றும் உள்கட்டமைப்பை அமைப்பதற்கு பின்-முனை மூலதன மானியம் வழங்குகிறது.",
      category: "dairy",
      eligibility: "Farmers, individual entrepreneurs, NGOs, companies, cooperatives.",
      benefits: "25% back-ended capital subsidy (33.33% for SC/ST). Maximum subsidy ₹3.30 lakh.",
      documents: "Project Report, Aadhaar Card, Bank Account, Land Documents",
      applicationLink: "https://www.nabard.org",
      isActive: true,
    },
    {
      title: "Tamil Nadu Goat Development Scheme",
      titleTa: "தமிழ்நாடு ஆடு வளர்ப்பு திட்டம்",
      description: "State scheme to promote goat farming among small and marginal farmers with subsidized goat units.",
      descriptionTa: "மானிய ஆட்டு அலகுகளுடன் சிறு மற்றும் குறு விவசாயிகளிடையே ஆடு வளர்ப்பை ஊக்குவிக்கும் மாநில திட்டம்.",
      category: "goat",
      eligibility: "Small and marginal farmers in Tamil Nadu. Priority to SC/ST and women farmers.",
      benefits: "Subsidy of 50% for purchase of 10 female goats + 1 male goat. Training provided.",
      documents: "Aadhaar Card, Community Certificate, Bank Account, Land Records",
      applicationLink: "https://www.tn.gov.in/scheme/data_view/3264",
      isActive: true,
    },
    {
      title: "Poultry Development Scheme - Tamil Nadu",
      titleTa: "கோழி வளர்ப்பு மேம்பாட்டு திட்டம் - தமிழ்நாடு",
      description: "Promotes backyard and commercial poultry farming with subsidized chicks and training.",
      descriptionTa: "மானிய குஞ்சுகள் மற்றும் பயிற்சியுடன் பின்னட்டு மற்றும் வணிக கோழி வளர்ப்பை ஊக்குவிக்கிறது.",
      category: "poultry",
      eligibility: "Farmers and rural households in Tamil Nadu.",
      benefits: "50% subsidy on chick cost. Free training on poultry management.",
      documents: "Aadhaar Card, Bank Account, Residence Proof",
      applicationLink: "https://www.tn.gov.in/scheme/data_view/3265",
      isActive: true,
    },
    {
      title: "PM Krishi Sinchai Yojana (PMKSY)",
      titleTa: "பிரதான் மந்திரி கிருஷி சிஞ்சாய் யோஜனா",
      description: "Ensures access to water for every farm and improves water use efficiency through micro-irrigation.",
      descriptionTa: "நுண்ணீர் பாசனம் மூலம் ஒவ்வொரு பண்ணைக்கும் நீர் அணுகலை உறுதி செய்கிறது மற்றும் நீர் பயன்பாட்டு திறனை மேம்படுத்துகிறது.",
      category: "agriculture",
      eligibility: "All farmers with agricultural land.",
      benefits: "55% subsidy for drip/sprinkler irrigation for small farmers. 45% for others.",
      documents: "Land Records, Aadhaar Card, Bank Account",
      applicationLink: "https://pmksy.gov.in",
      isActive: true,
    },
    {
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
    },
    {
      title: "Paramparagat Krishi Vikas Yojana (PKVY)",
      titleTa: "பரம்பரை கிருஷி விகாஸ் யோஜனா",
      description: "Promotes organic farming through cluster approach and PGS certification.",
      descriptionTa: "கிளஸ்டர் அணுகுமுறை மற்றும் PGS சான்றிதழ் மூலம் இயற்கை விவசாயத்தை ஊக்குவிக்கிறது.",
      category: "agriculture",
      eligibility: "Farmers willing to adopt organic farming practices.",
      benefits: "₹50,000 per hectare over 3 years for organic inputs and certification.",
      documents: "Aadhaar Card, Land Records, Bank Account",
      applicationLink: "https://pgsindia-ncof.gov.in",
      isActive: true,
    },
    {
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
    },
    {
      title: "National Beekeeping & Honey Mission (NBHM)",
      titleTa: "தேசிய தேனீ வளர்ப்பு மற்றும் தேன் இயக்கம்",
      description: "Promotes scientific beekeeping for livelihood generation and crop pollination.",
      descriptionTa: "வாழ்வாதார உருவாக்கம் மற்றும் பயிர் மகரந்தச் சேர்க்கைக்கு அறிவியல் தேனீ வளர்ப்பை ஊக்குவிக்கிறது.",
      category: "agriculture",
      eligibility: "Farmers, SHGs, FPOs interested in beekeeping.",
      benefits: "Subsidy on bee boxes, training, and equipment. Market linkage support.",
      documents: "Aadhaar Card, Bank Account, Training Certificate",
      applicationLink: "https://nbhm.gov.in",
      isActive: true,
    },
    {
      title: "Tamil Nadu Horticulture Development Agency (TANHODA)",
      titleTa: "தமிழ்நாடு தோட்டக்கலை மேம்பாட்டு நிறுவனம்",
      description: "Supports horticulture development including fruits, vegetables, flowers, and spices cultivation.",
      descriptionTa: "பழங்கள், காய்கறிகள், பூக்கள் மற்றும் மசாலாப் பொருட்கள் சாகுபடி உட்பட தோட்டக்கலை மேம்பாட்டை ஆதரிக்கிறது.",
      category: "state",
      eligibility: "Farmers in Tamil Nadu engaged in horticulture.",
      benefits: "Subsidy on planting material, drip irrigation, poly houses, and cold storage.",
      documents: "Land Records, Aadhaar Card, Bank Account",
      applicationLink: "https://www.tanhoda.tn.gov.in",
      isActive: true,
    },
  ];

  await Scheme.insertMany(schemes);
  console.log(`Seeded ${schemes.length} schemes`);
}

async function seedCrops(): Promise<void> {
  const count = await Crop.countDocuments();
  if (count > 0) return;

  const crops = [
    {
      name: "Rice (Paddy)",
      nameTa: "நெல்",
      season: "Kharif",
      soilType: "Clay loam, alluvial soil with good water retention",
      cultivationGuide: "1. Land Preparation: Plow 2-3 times, puddle the field. 2. Seed Selection: Use certified seeds like ADT 43, CO 51, or IR 64. 3. Nursery: Prepare nursery 25-30 days before transplanting. 4. Transplanting: Transplant 21-25 day old seedlings at 20x15 cm spacing. 5. Water Management: Maintain 5cm water level during vegetative stage. 6. Harvesting: Harvest when 80% grains turn golden yellow (105-120 days).",
      fertilizerRecommendation: "Basal: 50 kg Urea + 375 kg SSP + 100 kg MOP per hectare. Top dressing: 50 kg Urea at tillering stage + 50 kg Urea at panicle initiation. Apply zinc sulfate 25 kg/ha if deficiency observed.",
      irrigationInfo: "Requires 1200-1500mm water. Maintain 5cm standing water during vegetative stage. Drain field 10 days before harvest. Use SRI method to save 30-40% water.",
      pestInfo: "Major pests: Stem borer, Brown Plant Hopper, Leaf folder. Diseases: Blast, Bacterial Leaf Blight, Sheath Blight. Use IPM practices. Apply Carbofuran 3G for stem borer control.",
      image: "",
    },
    {
      name: "Wheat",
      nameTa: "கோதுமை",
      season: "Rabi",
      soilType: "Well-drained loamy soil, pH 6-7.5",
      cultivationGuide: "1. Sowing Time: November-December in Tamil Nadu. 2. Seed Rate: 100-125 kg/ha. 3. Spacing: Row spacing 22.5 cm. 4. Varieties: HD 2781, K 9107, LOK 1. 5. Harvesting: 110-120 days after sowing when grains are hard.",
      fertilizerRecommendation: "120 kg N + 60 kg P2O5 + 40 kg K2O per hectare. Apply half N and full P, K as basal. Remaining N in two splits at CRI and tillering stages.",
      irrigationInfo: "Requires 4-6 irrigations. Critical stages: CRI (21 days), tillering, jointing, flowering, and grain filling. Avoid waterlogging.",
      pestInfo: "Aphids, termites, and rust diseases are major concerns. Use seed treatment with Thiram + Carbendazim. Spray Dimethoate for aphid control.",
      image: "",
    },
    {
      name: "Cotton",
      nameTa: "பருத்தி",
      season: "Kharif",
      soilType: "Black cotton soil (Vertisol), deep well-drained soil",
      cultivationGuide: "1. Sowing: June-July after monsoon onset. 2. Seed Rate: 2.5 kg/ha (hybrid), 3-4 kg/ha (desi). 3. Spacing: 90x60 cm for hybrid, 60x30 cm for desi. 4. Varieties: MCU 5, SVPR 2, Bunny BG II. 5. Harvesting: Pick bolls when fully open (150-180 days).",
      fertilizerRecommendation: "180 kg N + 90 kg P2O5 + 90 kg K2O per hectare for hybrid cotton. Apply in 4 splits. Foliar spray of 2% DAP at boll development stage.",
      irrigationInfo: "Critical irrigation at flowering and boll development. Total 5-7 irrigations needed. Avoid water stress during boll opening.",
      pestInfo: "Bollworm complex (American, Spotted, Pink), Whitefly, Thrips, Jassids. Use Bt cotton varieties. Spray Spinosad or Emamectin benzoate for bollworm control.",
      image: "",
    },
    {
      name: "Sugarcane",
      nameTa: "கரும்பு",
      season: "Zaid",
      soilType: "Deep, well-drained loamy soil, pH 6-7.5",
      cultivationGuide: "1. Planting: January-February or June-July. 2. Seed Cane: Use 3-budded setts, 35,000-40,000 setts/ha. 3. Spacing: 90 cm row spacing. 4. Varieties: CO 86032, CO 0238, CO 94012. 5. Harvesting: 10-12 months after planting.",
      fertilizerRecommendation: "250 kg N + 100 kg P2O5 + 120 kg K2O per hectare. Apply N in 4 splits. Use trash mulching to conserve moisture and add organic matter.",
      irrigationInfo: "Requires 1500-2500mm water. Critical stages: germination, tillering, grand growth period. Drip irrigation saves 30-40% water and increases yield.",
      pestInfo: "Early shoot borer, Internode borer, Scale insects, Red rot disease. Use hot water treatment for seed cane. Apply Chlorpyrifos for borer control.",
      image: "",
    },
    {
      name: "Banana",
      nameTa: "வாழை",
      season: "Zaid",
      soilType: "Well-drained loamy soil rich in organic matter, pH 6-7.5",
      cultivationGuide: "1. Planting: Any time except peak summer. 2. Planting Material: Tissue culture plants or sword suckers. 3. Spacing: 1.8x1.8 m or 2x2 m. 4. Varieties: Grand Naine, Robusta, Poovan, Nendran. 5. Harvesting: 11-14 months after planting.",
      fertilizerRecommendation: "200 g N + 100 g P2O5 + 300 g K2O per plant per year. Apply in 4-6 splits. Potassium is critical for fruit quality. Use drip fertigation for best results.",
      irrigationInfo: "Requires 1200-1500mm water. Drip irrigation at 16-20 liters/plant/day. Avoid waterlogging. Mulching reduces water requirement by 30%.",
      pestInfo: "Banana weevil, Nematodes, Sigatoka leaf spot, Panama wilt. Use disease-free planting material. Apply Carbofuran for weevil control. Spray Mancozeb for Sigatoka.",
      image: "",
    },
    {
      name: "Tomato",
      nameTa: "தக்காளி",
      season: "Rabi",
      soilType: "Well-drained sandy loam soil, pH 6-7",
      cultivationGuide: "1. Nursery: Raise seedlings in raised beds. 2. Transplanting: 25-30 day old seedlings at 60x45 cm spacing. 3. Varieties: PKM 1, CO 3, Arka Vikas, Hybrid varieties. 4. Staking: Provide stakes for indeterminate varieties. 5. Harvesting: 60-70 days after transplanting.",
      fertilizerRecommendation: "120 kg N + 60 kg P2O5 + 60 kg K2O per hectare. Apply 50% N and full P, K as basal. Remaining N in 2 splits. Foliar spray of 0.5% Boron at flowering.",
      irrigationInfo: "Requires 400-600mm water. Drip irrigation preferred. Critical stages: transplanting, flowering, fruit development. Avoid overhead irrigation to prevent diseases.",
      pestInfo: "Fruit borer, Whitefly, Leaf curl virus, Early blight, Late blight. Use yellow sticky traps. Spray Spinosad for fruit borer. Apply Mancozeb for blight control.",
      image: "",
    },
    {
      name: "Onion",
      nameTa: "வெங்காயம்",
      season: "Rabi",
      soilType: "Well-drained sandy loam to loam soil, pH 6-7",
      cultivationGuide: "1. Nursery: Raise seedlings in raised beds, 8-10 weeks. 2. Transplanting: 45x10 cm spacing. 3. Varieties: Aggregatum, CO 3, CO 4, Bellary Red. 4. Bulb Formation: Reduce irrigation 10 days before harvest. 5. Harvesting: When 50% tops fall over.",
      fertilizerRecommendation: "100 kg N + 50 kg P2O5 + 50 kg K2O per hectare. Apply in 3 splits. Sulfur application (25 kg/ha) improves pungency and shelf life.",
      irrigationInfo: "Requires 350-550mm water. Avoid waterlogging. Reduce irrigation at bulb maturation stage. Drip irrigation increases yield and quality.",
      pestInfo: "Thrips, Purple blotch, Stemphylium blight, Basal rot. Use blue sticky traps for thrips monitoring. Spray Spinosad or Fipronil for thrips control.",
      image: "",
    },
    {
      name: "Groundnut",
      nameTa: "நிலக்கடலை",
      season: "Kharif",
      soilType: "Well-drained sandy loam soil, pH 6-6.5",
      cultivationGuide: "1. Sowing: June-July (Kharif), January-February (Rabi). 2. Seed Rate: 100-120 kg/ha. 3. Spacing: 30x10 cm. 4. Varieties: TMV 2, CO 2, VRI 2, TAG 24. 5. Harvesting: 100-120 days, when leaves turn yellow.",
      fertilizerRecommendation: "25 kg N + 50 kg P2O5 + 50 kg K2O per hectare as basal. Apply Gypsum 500 kg/ha at pegging stage for calcium supply to pods.",
      irrigationInfo: "Requires 500-600mm water. Critical stages: pegging and pod development. Avoid waterlogging. 4-5 irrigations needed.",
      pestInfo: "Leaf miner, Thrips, Tikka disease, Stem rot. Use Trichoderma viride for seed treatment. Spray Chlorothalonil for Tikka disease control.",
      image: "",
    },
    {
      name: "Turmeric",
      nameTa: "மஞ்சள்",
      season: "Kharif",
      soilType: "Well-drained loamy or clay loam soil rich in organic matter",
      cultivationGuide: "1. Planting: April-May with onset of monsoon. 2. Seed Rhizomes: 2500 kg/ha. 3. Spacing: 45x25 cm. 4. Varieties: BSR 1, CO 1, Erode Local, Salem. 5. Harvesting: 7-9 months after planting when leaves turn yellow.",
      fertilizerRecommendation: "60 kg N + 50 kg P2O5 + 120 kg K2O per hectare. Apply in 3 splits. Organic manure 25-30 tonnes/ha improves quality and yield.",
      irrigationInfo: "Requires 1500mm water. Mulching with paddy straw conserves moisture. 15-20 irrigations needed. Avoid waterlogging.",
      pestInfo: "Rhizome rot, Leaf blotch, Shoot borer. Use disease-free rhizomes. Treat with Mancozeb before planting. Apply Chlorpyrifos for shoot borer.",
      image: "",
    },
    {
      name: "Chilli",
      nameTa: "மிளகாய்",
      season: "Kharif",
      soilType: "Well-drained sandy loam to clay loam soil, pH 6-7",
      cultivationGuide: "1. Nursery: 30-35 day old seedlings. 2. Transplanting: 60x45 cm spacing. 3. Varieties: CO 1, PKM 1, Guntur Sannam, K1. 4. Staking: Required for tall varieties. 5. Harvesting: Green chilli 60-70 days, Red chilli 90-100 days.",
      fertilizerRecommendation: "120 kg N + 60 kg P2O5 + 60 kg K2O per hectare. Apply in 4 splits. Foliar spray of 0.5% Boron and 0.5% Zinc sulfate at flowering.",
      irrigationInfo: "Requires 600-800mm water. Drip irrigation preferred. Critical stages: transplanting, flowering, fruit development. Avoid water stress during flowering.",
      pestInfo: "Thrips, Mites, Fruit borer, Anthracnose, Powdery mildew. Use yellow sticky traps. Spray Abamectin for mite control. Apply Carbendazim for anthracnose.",
      image: "",
    },
    {
      name: "Coconut",
      nameTa: "தேங்காய்",
      season: "Zaid",
      soilType: "Well-drained sandy loam to laterite soil, pH 5.5-7",
      cultivationGuide: "1. Planting: June-July or September-October. 2. Spacing: 7.5x7.5 m (triangular). 3. Varieties: WCT, ECT, Hybrid COD x WCT. 4. Pit Size: 1x1x1 m. 5. Bearing: 5-7 years after planting. Harvest every 45 days.",
      fertilizerRecommendation: "500 g N + 320 g P2O5 + 1200 g K2O per palm per year. Apply in 2 splits (June and December). Magnesium sulfate 500 g/palm for deficiency correction.",
      irrigationInfo: "Requires 1500-2000mm water. Drip irrigation at 40-50 liters/palm/day. Basin irrigation 200 liters/palm/week in summer.",
      pestInfo: "Rhinoceros beetle, Red palm weevil, Eriophyid mite, Root wilt disease. Use pheromone traps for weevil monitoring. Apply Chlorpyrifos for beetle control.",
      image: "",
    },
    {
      name: "Maize",
      nameTa: "மக்காச்சோளம்",
      season: "Kharif",
      soilType: "Well-drained loamy soil, pH 6-7.5",
      cultivationGuide: "1. Sowing: June-July (Kharif), October-November (Rabi). 2. Seed Rate: 20-25 kg/ha. 3. Spacing: 60x25 cm. 4. Varieties: COHM 5, NK 6240, Pioneer 30V92. 5. Harvesting: 90-100 days when husks turn brown.",
      fertilizerRecommendation: "150 kg N + 75 kg P2O5 + 75 kg K2O per hectare. Apply N in 3 splits: basal, knee-high, tasseling stages.",
      irrigationInfo: "Requires 500-700mm water. Critical stages: germination, knee-high, tasseling, grain filling. 5-6 irrigations needed.",
      pestInfo: "Fall Armyworm, Stem borer, Downy mildew, Turcicum blight. Use Emamectin benzoate for Fall Armyworm. Apply Metalaxyl for downy mildew.",
      image: "",
    },
  ];

  await Crop.insertMany(crops);
  console.log(`Seeded ${crops.length} crops`);
}

async function seedDiseases(): Promise<void> {
  const count = await Disease.countDocuments();
  if (count > 0) return;

  const diseases = [
    // Crop diseases
    {
      name: "Rice Blast",
      nameTa: "நெல் வெடிப்பு நோய்",
      type: "crop",
      affectedSpecies: "Rice",
      symptoms: "Diamond-shaped lesions with gray centers and brown borders on leaves. Neck rot causing white/gray panicles. Collar rot at leaf collar.",
      causes: "Fungus Magnaporthe oryzae. Favored by high humidity, moderate temperatures (25-28°C), and excessive nitrogen.",
      prevention: "Use resistant varieties, avoid excessive nitrogen, maintain proper plant spacing, remove infected plant debris.",
      treatment: "Spray Tricyclazole 75 WP (0.6 g/L) or Isoprothiolane 40 EC (1.5 ml/L). Apply at first sign of disease.",
    },
    {
      name: "Bacterial Leaf Blight (BLB)",
      nameTa: "பாக்டீரியா இலை கருகல் நோய்",
      type: "crop",
      affectedSpecies: "Rice",
      symptoms: "Water-soaked lesions on leaf margins that turn yellow then white. Wilting of seedlings (Kresek phase). Milky bacterial ooze.",
      causes: "Bacterium Xanthomonas oryzae pv. oryzae. Spread through water, wind, and infected seeds.",
      prevention: "Use resistant varieties, treat seeds with Streptomycin, avoid flood irrigation, maintain field hygiene.",
      treatment: "Spray Copper oxychloride 50 WP (3 g/L) or Streptomycin sulfate + Tetracycline. No effective chemical cure — prevention is key.",
    },
    {
      name: "Powdery Mildew",
      nameTa: "பொடி பூஞ்சை நோய்",
      type: "crop",
      affectedSpecies: "Wheat, Chilli, Cucurbits, Grapes",
      symptoms: "White powdery coating on leaves, stems, and flowers. Leaves turn yellow and drop. Reduced photosynthesis and yield.",
      causes: "Various fungal species (Erysiphe, Sphaerotheca). Favored by dry weather with high humidity, moderate temperatures.",
      prevention: "Use resistant varieties, proper spacing for air circulation, avoid overhead irrigation.",
      treatment: "Spray Sulfur 80 WP (3 g/L) or Hexaconazole 5 EC (2 ml/L) or Propiconazole 25 EC (1 ml/L).",
    },
    {
      name: "Late Blight",
      nameTa: "தாமத கருகல் நோய்",
      type: "crop",
      affectedSpecies: "Tomato, Potato",
      symptoms: "Dark brown water-soaked lesions on leaves with white mold on undersides. Brown lesions on stems. Fruit rot with brown discoloration.",
      causes: "Oomycete Phytophthora infestans. Favored by cool, wet weather (15-20°C) with high humidity.",
      prevention: "Use certified disease-free seeds, avoid overhead irrigation, remove infected plant material.",
      treatment: "Spray Mancozeb 75 WP (2.5 g/L) or Metalaxyl + Mancozeb (2.5 g/L) preventively. Apply Cymoxanil for curative action.",
    },
    {
      name: "Mosaic Virus",
      nameTa: "மொசைக் வைரஸ் நோய்",
      type: "crop",
      affectedSpecies: "Chilli, Tomato, Cucumber, Beans",
      symptoms: "Mosaic pattern of light and dark green on leaves. Leaf distortion, curling, and stunting. Reduced fruit size and yield.",
      causes: "Various viruses (CMV, TMV, TSWV) transmitted by aphids, thrips, and whiteflies.",
      prevention: "Use virus-free certified seeds, control vector insects, remove infected plants immediately.",
      treatment: "No direct cure. Control vectors with Imidacloprid (0.5 ml/L). Remove and destroy infected plants.",
    },
    {
      name: "Anthracnose",
      nameTa: "அந்த்ராக்னோஸ் நோய்",
      type: "crop",
      affectedSpecies: "Chilli, Mango, Beans, Cucurbits",
      symptoms: "Dark sunken lesions on fruits, leaves, and stems. Pink spore masses in humid conditions. Fruit rot and premature drop.",
      causes: "Fungus Colletotrichum species. Favored by warm, humid conditions and rain splash.",
      prevention: "Use disease-free seeds, avoid overhead irrigation, proper spacing, remove infected fruits.",
      treatment: "Spray Carbendazim 50 WP (1 g/L) or Mancozeb 75 WP (2.5 g/L) or Copper oxychloride (3 g/L).",
    },
    {
      name: "Downy Mildew",
      nameTa: "தாழ் பூஞ்சை நோய்",
      type: "crop",
      affectedSpecies: "Maize, Grapes, Cucurbits, Onion",
      symptoms: "Yellow patches on upper leaf surface with grayish-purple downy growth on undersides. Stunted growth and poor yield.",
      causes: "Oomycetes (Plasmopara, Peronospora, Sclerospora). Favored by cool, moist conditions.",
      prevention: "Use resistant varieties, seed treatment with Metalaxyl, proper drainage, crop rotation.",
      treatment: "Spray Metalaxyl + Mancozeb (2.5 g/L) or Fosetyl-Al (2.5 g/L). Apply preventively.",
    },
    {
      name: "Stem Rot",
      nameTa: "தண்டு அழுகல் நோய்",
      type: "crop",
      affectedSpecies: "Rice, Groundnut, Sunflower",
      symptoms: "Water-soaked lesions on stem near soil level. White cottony mycelium. Lodging of plants. Sclerotia formation.",
      causes: "Fungus Sclerotium rolfsii or Rhizoctonia solani. Favored by high humidity and warm temperatures.",
      prevention: "Deep plowing, crop rotation, use of Trichoderma, avoid excessive irrigation.",
      treatment: "Apply Carbendazim 50 WP (1 g/L) as soil drench. Use Trichoderma viride as biocontrol agent.",
    },
    {
      name: "Leaf Rust",
      nameTa: "இலை துரு நோய்",
      type: "crop",
      affectedSpecies: "Wheat, Barley",
      symptoms: "Orange-brown pustules on leaf surface. Severe infection causes premature leaf death. Reduced grain filling.",
      causes: "Fungus Puccinia triticina. Spread by wind-borne spores. Favored by moderate temperatures and dew.",
      prevention: "Use resistant varieties, early sowing, remove volunteer wheat plants.",
      treatment: "Spray Propiconazole 25 EC (1 ml/L) or Tebuconazole 25.9 EC (1 ml/L) at first sign.",
    },
    {
      name: "Sheath Blight",
      nameTa: "உறை கருகல் நோய்",
      type: "crop",
      affectedSpecies: "Rice",
      symptoms: "Oval or irregular lesions on leaf sheath with grayish-white center and brown border. Lesions coalesce causing lodging.",
      causes: "Fungus Rhizoctonia solani. Favored by high temperature, humidity, and dense planting.",
      prevention: "Avoid dense planting, reduce nitrogen, use resistant varieties, maintain field hygiene.",
      treatment: "Spray Hexaconazole 5 EC (2 ml/L) or Validamycin 3 SL (2 ml/L) at early infection stage.",
    },
    // Animal diseases
    {
      name: "Foot and Mouth Disease (FMD)",
      nameTa: "கால் வாய் நோய்",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo, Sheep, Goat, Pig",
      symptoms: "High fever (40-41°C), vesicles (blisters) on mouth, tongue, feet, and teats. Excessive salivation, lameness, reduced milk production.",
      causes: "Foot and Mouth Disease Virus (FMDV) — highly contagious. Spread through direct contact, contaminated feed, water, and air.",
      prevention: "Regular vaccination (twice yearly), quarantine of new animals, disinfection of premises, restrict movement during outbreaks.",
      treatment: "No specific treatment. Supportive care: antiseptic mouth wash, foot bath with copper sulfate, antibiotics for secondary infections. Notify veterinary authorities immediately.",
    },
    {
      name: "Brucellosis",
      nameTa: "புருசெல்லோசிஸ்",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo, Sheep, Goat",
      symptoms: "Abortion in last trimester, retained placenta, reduced fertility, orchitis in males, swollen joints, reduced milk production.",
      causes: "Bacteria Brucella abortus (cattle), B. melitensis (goats/sheep). Spread through aborted fetuses, placenta, vaginal discharge.",
      prevention: "Vaccination with Brucella abortus strain 19 (calves 4-8 months), test and slaughter policy, proper disposal of aborted material.",
      treatment: "No effective treatment in animals. Infected animals should be culled. Zoonotic disease — humans can get infected.",
    },
    {
      name: "Mastitis",
      nameTa: "மடி அழற்சி",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo, Goat",
      symptoms: "Swollen, hot, painful udder. Abnormal milk (watery, clots, blood). Reduced milk yield. Fever in acute cases.",
      causes: "Bacteria (Staphylococcus, Streptococcus, E. coli). Poor milking hygiene, teat injuries, overcrowding.",
      prevention: "Proper milking hygiene, teat dipping after milking, dry cow therapy, regular CMT testing, clean housing.",
      treatment: "Intramammary antibiotic infusion (Penicillin + Streptomycin). Systemic antibiotics for severe cases. Anti-inflammatory drugs. Consult veterinarian.",
    },
    {
      name: "Newcastle Disease",
      nameTa: "நியூகேஸில் நோய்",
      type: "animal",
      affectedSpecies: "Poultry (Chicken, Turkey)",
      symptoms: "Respiratory distress, gasping, coughing. Nervous signs: twisted neck, paralysis. Greenish diarrhea. Sudden high mortality.",
      causes: "Newcastle Disease Virus (NDV) — highly contagious. Spread through direct contact, contaminated feed, water, equipment.",
      prevention: "Regular vaccination (F strain, Lasota, R2B), biosecurity measures, proper disposal of dead birds.",
      treatment: "No specific treatment. Supportive care: vitamins, electrolytes. Antibiotics for secondary bacterial infections. Notify veterinary authorities.",
    },
    {
      name: "Peste des Petits Ruminants (PPR)",
      nameTa: "சிறு மசால் விலங்கு கொள்ளை நோய்",
      type: "animal",
      affectedSpecies: "Goat, Sheep",
      symptoms: "High fever (40-42°C), nasal discharge, eye discharge, mouth ulcers, diarrhea, pneumonia. High mortality (50-80%).",
      causes: "PPR Virus (Morbillivirus). Highly contagious — spread through direct contact and respiratory secretions.",
      prevention: "Annual vaccination with PPR vaccine, quarantine new animals, restrict movement during outbreaks.",
      treatment: "No specific treatment. Supportive care: antibiotics for secondary infections, anti-diarrheal drugs, vitamins. Notify veterinary authorities.",
    },
    {
      name: "Anthrax",
      nameTa: "குருதி நோய் (ஆந்த்ராக்ஸ்)",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo, Sheep, Goat, Horse",
      symptoms: "Sudden death without prior symptoms. Bloody discharge from natural openings. Bloating. Failure of blood to clot.",
      causes: "Bacteria Bacillus anthracis. Spores survive in soil for decades. Spread through contaminated soil, feed, water.",
      prevention: "Annual vaccination in endemic areas, proper disposal of carcasses (burning/deep burial), avoid grazing in anthrax-prone areas.",
      treatment: "Penicillin or Oxytetracycline if caught early. Anthrax antiserum. Zoonotic disease — handle with extreme caution. Notify authorities.",
    },
    {
      name: "Blackquarter (BQ)",
      nameTa: "கருப்பு காய்ச்சல்",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo, Sheep",
      symptoms: "Sudden lameness, swelling of hindquarters with crackling sound. High fever, depression. Death within 12-48 hours.",
      causes: "Bacteria Clostridium chauvoei. Spores in soil. Affects young animals 6 months to 2 years.",
      prevention: "Annual vaccination with BQ vaccine, avoid grazing in low-lying areas after floods.",
      treatment: "Penicillin in large doses if caught very early. Usually fatal before treatment can be effective. Prevention through vaccination is critical.",
    },
    {
      name: "Hemorrhagic Septicemia (HS)",
      nameTa: "இரத்தக்கசிவு நோய்",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo",
      symptoms: "High fever (41-42°C), profuse salivation, nasal discharge, swelling of throat and brisket. Difficulty breathing. Death in 6-24 hours.",
      causes: "Bacteria Pasteurella multocida. Stress, poor nutrition, and wet conditions predispose animals.",
      prevention: "Annual vaccination with HS vaccine before monsoon, reduce stress, improve nutrition.",
      treatment: "Oxytetracycline or Sulfonamides if treated early. Anti-inflammatory drugs. Usually fatal if not treated within hours.",
    },
    {
      name: "Theileriosis (Tick Fever)",
      nameTa: "உண்ணி காய்ச்சல்",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo",
      symptoms: "High fever, enlarged lymph nodes, anemia, jaundice, reduced milk production, nasal discharge, difficulty breathing.",
      causes: "Protozoan parasite Theileria annulata transmitted by ticks (Hyalomma species).",
      prevention: "Regular tick control with acaricides, tick-resistant breeds, strategic deworming.",
      treatment: "Buparvaquone (Butalex) injection — specific treatment. Supportive care: blood transfusion for severe anemia, vitamins, anti-fever drugs.",
    },
    {
      name: "Lumpy Skin Disease (LSD)",
      nameTa: "கட்டி தோல் நோய்",
      type: "animal",
      affectedSpecies: "Cattle, Buffalo",
      symptoms: "Fever, nodular skin lesions all over body, enlarged lymph nodes, reduced milk production, nasal and eye discharge.",
      causes: "Lumpy Skin Disease Virus (LSDV). Spread by biting insects (mosquitoes, flies, ticks).",
      prevention: "Vaccination with LSD vaccine, insect control, quarantine of affected animals.",
      treatment: "No specific treatment. Supportive care: antibiotics for secondary infections, wound care for skin lesions, anti-inflammatory drugs.",
    },
  ];

  await Disease.insertMany(diseases);
  console.log(`Seeded ${diseases.length} diseases`);
}

async function seedMarketPrices(): Promise<void> {
  const count = await MarketPrice.countDocuments();
  if (count > 0) return;

  const crops = [
    { name: "Rice (Paddy)", nameTa: "நெல்", basePrice: 2200, unit: "per quintal", market: "Chennai APMC", location: "Chennai" },
    { name: "Wheat", nameTa: "கோதுமை", basePrice: 2100, unit: "per quintal", market: "Coimbatore APMC", location: "Coimbatore" },
    { name: "Cotton", nameTa: "பருத்தி", basePrice: 6500, unit: "per quintal", market: "Tirupur APMC", location: "Tirupur" },
    { name: "Sugarcane", nameTa: "கரும்பு", basePrice: 3200, unit: "per tonne", market: "Erode APMC", location: "Erode" },
    { name: "Banana", nameTa: "வாழை", basePrice: 1800, unit: "per quintal", market: "Trichy APMC", location: "Trichy" },
    { name: "Tomato", nameTa: "தக்காளி", basePrice: 1200, unit: "per quintal", market: "Koyambedu Market", location: "Chennai" },
    { name: "Onion", nameTa: "வெங்காயம்", basePrice: 1500, unit: "per quintal", market: "Madurai APMC", location: "Madurai" },
    { name: "Groundnut", nameTa: "நிலக்கடலை", basePrice: 5500, unit: "per quintal", market: "Vellore APMC", location: "Vellore" },
    { name: "Turmeric", nameTa: "மஞ்சள்", basePrice: 8000, unit: "per quintal", market: "Erode APMC", location: "Erode" },
    { name: "Chilli", nameTa: "மிளகாய்", basePrice: 9000, unit: "per quintal", market: "Guntur APMC", location: "Guntur" },
    { name: "Coconut", nameTa: "தேங்காய்", basePrice: 1800, unit: "per 100 nuts", market: "Pollachi APMC", location: "Pollachi" },
    { name: "Maize", nameTa: "மக்காச்சோளம்", basePrice: 1800, unit: "per quintal", market: "Salem APMC", location: "Salem" },
    { name: "Soybean", nameTa: "சோயா பீன்", basePrice: 4200, unit: "per quintal", market: "Dharmapuri APMC", location: "Dharmapuri" },
    { name: "Sunflower", nameTa: "சூரியகாந்தி", basePrice: 5200, unit: "per quintal", market: "Krishnagiri APMC", location: "Krishnagiri" },
    { name: "Black професsorGram", nameTa: "உளுந்து", basePrice: 6800, unit: "per quintal", market: "Thanjavur APMC", location: "Thanjavur" },
  ];

  const priceEntries = crops.map((crop) => {
    // Generate 90 days of price history
    const history = Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      const variation = (Math.random() - 0.5) * 0.1 * crop.basePrice;
      return { price: Math.round(crop.basePrice + variation), date };
    });

    return {
      cropName: crop.name,
      cropNameTa: crop.nameTa,
      price: history[history.length - 1].price,
      unit: crop.unit,
      market: crop.market,
      location: crop.location,
      date: new Date(),
      priceHistory: history,
    };
  });

  await MarketPrice.insertMany(priceEntries);
  console.log(`Seeded ${priceEntries.length} market prices`);
}
