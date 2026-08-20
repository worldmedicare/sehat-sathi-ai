import { LabTestReference } from '../types';

export const LAB_TESTS_DATA: LabTestReference[] = [
  {
    name: 'Complete Blood Count (CBC / Hemogram)',
    category: 'General Blood Test',
    normalRange: 'Hemoglobin: 13-17 g/dL (Men), 12-15 g/dL (Women) | TLC (WBC): 4,000 - 11,000 /mcL | Platelets: 1.5 - 4.5 Lakh /mcL',
    unit: 'g/dL, /mcL',
    simpleExplanation: 'Khoon ki jaanch jo anemia (khoon ki kami), infection, aur platelets (dengue ya bleeding check) ke baare me batati hai.',
    whenHigh: 'High WBC means sharir me infection ya inflammation ho sakti hai. High Hemoglobin dehydration ya lung issues me milta hai.',
    whenLow: 'Low Hemoglobin = Anemia (kamzori, thakan). Low Platelets = Dengue, viral infection ya liver issue ka sanket.',
  },
  {
    name: 'HbA1c (Glycated Hemoglobin / 3 Month Sugar)',
    category: 'Diabetes & Metabolism',
    normalRange: 'Normal: < 5.7% | Pre-diabetes: 5.7% - 6.4% | Diabetes: ≥ 6.5%',
    unit: '%',
    simpleExplanation: 'Pichle 90 dino (3 mahine) ka average blood sugar level batata hai.',
    whenHigh: 'Higher than 6.5% indicates uncontrolled blood sugar ya diabetes. Diet, exercise aur doctor ki salah zaroori hoti hai.',
    whenLow: 'Below 5.7% normal mana jata hai.',
  },
  {
    name: 'Lipid Profile (Cholesterol Panel)',
    category: 'Heart & Cholesterol',
    normalRange: 'Total Cholesterol: < 200 mg/dL | LDL (Bad): < 100 mg/dL | HDL (Good): > 40-50 mg/dL | Triglycerides: < 150 mg/dL',
    unit: 'mg/dL',
    simpleExplanation: 'Khoon me fat aur cholesterol ki matra jaanchta hai, jo dil (heart) ki health ke liye zaroori hai.',
    whenHigh: 'High LDL aur Triglycerides naso (arteries) me blockage aur heart attack ka risk badha sakte hain.',
    whenLow: 'Low HDL (Good cholesterol) physical exercise ki kami ya smoking se ho sakta hai.',
  },
  {
    name: 'Thyroid Profile (TSH, Free T3, Free T4)',
    category: 'Hormones',
    normalRange: 'TSH: 0.4 - 4.5 mIU/L | Free T4: 0.8 - 1.8 ng/dL',
    unit: 'mIU/L',
    simpleExplanation: 'Gale me sthit thyroid gland ka hormone control jaanchta hai jo metabolism aur weight control karta hai.',
    whenHigh: 'High TSH (> 4.5) aksar Hypothyroidism (vajan badhna, thakan, bal jhadna) ka sanket deta hai.',
    whenLow: 'Low TSH (< 0.4) Hyperthyroidism (vajan ghatna, ghabrahat, dhadkan tezi) ka sanket ho sakta hai.',
  },
  {
    name: 'Liver Function Test (LFT - SGPT, SGOT, Bilirubin)',
    category: 'Liver Health',
    normalRange: 'Bilirubin Total: 0.2 - 1.2 mg/dL | SGPT (ALT): < 45 U/L | SGOT (AST): < 40 U/L',
    unit: 'mg/dL, U/L',
    simpleExplanation: 'Jigar (Liver) ki functioning, fatty liver, jaundice (piliya) ya alcohol/medicine effect ko jaanchta hai.',
    whenHigh: 'Elevated SGPT/SGOT fatty liver, hepatitis ya excessive medicines ka asar ho sakta hai. High Bilirubin = Jaundice (Piliya).',
    whenLow: 'Aam taur par low hona chinta ka vishay nahi hota.',
  },
  {
    name: 'Kidney Function Test (KFT / RFT - Creatinine, Urea, Uric Acid)',
    category: 'Kidney Health',
    normalRange: 'Serum Creatinine: 0.6 - 1.2 mg/dL | Blood Urea: 15 - 40 mg/dL | Uric Acid: 3.5 - 7.0 mg/dL',
    unit: 'mg/dL',
    simpleExplanation: 'Gurde (Kidney) khoon se gandagi kitni acchi tarah filter kar rahe hain yeh check karta hai.',
    whenHigh: 'High Creatinine kidney ke kamzor filter karne ka sanket ho sakta hai. High Uric Acid jodo me dard (Gout) karta hai.',
    whenLow: 'Creatinine low hona aamtaur par low muscle mass me dekha jata hai.',
  },
  {
    name: 'Vitamin D3 (25-Hydroxy)',
    category: 'Vitamins & Bone Health',
    normalRange: 'Deficiency: < 20 ng/mL | Insufficient: 20-30 ng/mL | Optimal: 30 - 100 ng/mL',
    unit: 'ng/mL',
    simpleExplanation: 'Haddiyo ki mazbooti, immunity aur muscle power ke liye zaroori dhoop ka vitamin.',
    whenHigh: 'Overdose (supplement excessive use) se toxicity ho sakti hai (> 100 ng/mL).',
    whenLow: 'Haddiyo aur kamar me dard, thakan, hair loss aur kamzor immunity hoti hai.',
  },
  {
    name: 'Vitamin B12 (Cyanocobalamin)',
    category: 'Nerve & Energy Health',
    normalRange: 'Normal: 200 - 900 pg/mL | Borderline: 160 - 200 pg/mL',
    unit: 'pg/mL',
    simpleExplanation: 'Naso (nerves), dimaag (brain) aur naye red blood cells banane ke liye sabse zaroori vitamin.',
    whenHigh: 'Aksar harmless ya high supplement intake se hota hai.',
    whenLow: 'Haath-pairo me jhanjhanahat (tingling/numbness), memory loss, thakan aur chidchidapan.',
  },
];

export const MYTH_FACTS_DATA = [
  {
    myth: 'Har bukhar (fever) me turant antibiotic shuru kar leni chahiye.',
    fact: 'Bukhar 80% viral infection se hota hai jisme antibiotic bilkul asar nahi karti. Galat antibiotic lene se gut bacteria damage aur antibiotic resistance hota hai.',
    category: 'Medicines',
  },
  {
    myth: 'Diabetes sirf zyada meetha khane se hoti hai.',
    fact: 'Diabetes genetic reasons, physical inactivity, stress, aur overall excess calorie/refined carbs se hoti hai, sirf cheeni se nahi.',
    category: 'Diabetes',
  },
  {
    myth: 'Khali pet nimbu-paani peene se saara fat melt ho jata hai.',
    fact: 'Nimbu paani hydration aur Vitamin C deta hai, par calorie deficit aur exercise ke bina koi bhi drink fat melt nahi kar sakti.',
    category: 'Nutrition',
  },
  {
    myth: 'High Blood Pressure ka koi lakshan nahi hota toh dawai band kar sakte hain.',
    fact: 'High BP ko "Silent Killer" kaha jata hai kyunki ye bina kisi lakshan ke heart aur kidney ko nuksan pahunchata hai. Bina doctor ki salah dawai band na karein.',
    category: 'Heart Health',
  },
  {
    myth: 'Pani jitna zyada peeyenge (jaise 6-7 litre), utna skin aur health behtar hogi.',
    fact: 'Sharir ko aam taur par 2.5 se 3.5 litre paani ki zaroorat hoti hai. Bohat zyada paani peene se khoon me sodium dangerously low (Hyponatremia) ho sakta hai.',
    category: 'Wellness',
  },
];

export const SAMPLE_REEL_TOPICS = [
  '5 Signs Your Body is Deficient in Vitamin D & B12',
  'Paracetamol lene ka sahi tareeqa aur kharab galtiyan',
  'Sabse aam 3 Blood Tests jo har saal karwane chahiye',
  'Acidity aur Gas se 10 minute me aaram ke natural tips',
  'Normal Blood Pressure vs High BP Chart in Simple Hindi',
  'Myth vs Fact: Kya Cheeni chhodne se Diabetes theek ho jati hai?',
  'Fatty Liver ke shuruaati 4 lakshan aur Diet hacks',
  'Emergency FAST Rule: Lakwa (Stroke) pehchanne ka 1 minute tarika',
];

export const EMERGENCY_RED_FLAGS = [
  {
    title: 'Severe Crushing Chest Pain',
    hinglish: 'Seene me bhari dabav, jo baayein haath, gale ya peeth me faile',
    action: 'Dil ka daura (Heart Attack) ka sanket. Turant 112/108 call karein ya emergency ER jayein.',
    urgency: 'CRITICAL',
  },
  {
    title: 'Stroke Symptoms (FAST Rule)',
    hinglish: 'Chehra tedha hona, ek taraf ka haath/pair kamzor hona, bolne me ladkhadahat',
    action: 'Har minute zaroori hai. Turant nearest stroke-ready hospital le jayein.',
    urgency: 'CRITICAL',
  },
  {
    title: 'Severe Shortness of Breath',
    hinglish: 'Saans lene me behad takleef, hoth ya ungliya neeli padna',
    action: 'Bitha kar rakhein, kapde dheele karein aur emergency hospital pohanchein.',
    urgency: 'CRITICAL',
  },
  {
    title: 'High Fever with Stiff Neck or Fits (Seizures)',
    hinglish: 'Baccho ya bado me tez bukhar ke saath gardan akadna ya daure aana',
    action: 'Meningitis ya febrile seizure ho sakta hai. Urgent doctor consultation zaroori.',
    urgency: 'HIGH',
  },
  {
    title: 'Severe Uncontrollable Bleeding or Head Trauma',
    hinglish: 'Bhari chot ke baad behoshi, ulti aana ya khoon na rukna',
    action: 'Saaf kapde se dabav banayein aur hospital dispatch karein.',
    urgency: 'HIGH',
  },
];
