// ── Medicine Catalogue ────────────────────────────────────────────────────────
// All prices in Indian Rupees (₹) per strip/pack/bottle
// Client: replace image filenames with actual product images
// Place images in client/src/assets/medicines/

export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';

export const categories = [
    { id: 'cardiovascular', label: 'Cardiovascular',    icon: '🫀', color: 'red',    desc: 'Heart & blood pressure medicines' },
    { id: 'oncology',       label: 'Oncology',          icon: '🧬', color: 'purple', desc: 'Cancer treatment & supportive care' },
    { id: 'anti-infective', label: 'Anti-Infective',    icon: '🦠', color: 'green',  desc: 'Antibiotics, antivirals, antifungals' },
    { id: 'neurology',      label: 'Neurology & CNS',   icon: '🧠', color: 'blue',   desc: 'Brain, nerve & mental health medicines' },
    { id: 'respiratory',    label: 'Respiratory',       icon: '🫁', color: 'teal',   desc: 'Asthma, COPD & breathing medicines' },
    { id: 'paediatric',     label: 'Paediatrics',       icon: '👶', color: 'amber',  desc: 'Medicines formulated for children' },
];

export const medicines = [
    // ── CARDIOVASCULAR ────────────────────────────────────────────────────────
    { id: 'cv-001', category: 'cardiovascular', name: 'Atorvastatin 10mg',       composition: 'Atorvastatin Calcium 10mg',       dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 35,   minQty: 10, description: 'Cholesterol-lowering statin for hyperlipidaemia and cardiovascular risk reduction.',  tags: ['Statin', 'Cholesterol'],           image: 'med-cv-001.jpg' },
    { id: 'cv-002', category: 'cardiovascular', name: 'Amlodipine 5mg',          composition: 'Amlodipine Besylate 5mg',          dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 28,   minQty: 10, description: 'Calcium channel blocker for hypertension and stable angina.',                        tags: ['Antihypertensive', 'CCB'],         image: 'med-cv-002.jpg' },
    { id: 'cv-003', category: 'cardiovascular', name: 'Metoprolol 50mg',         composition: 'Metoprolol Tartrate 50mg',         dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 42,   minQty: 10, description: 'Beta-blocker for hypertension, angina, and heart failure management.',                 tags: ['Beta-blocker', 'Antihypertensive'], image: 'med-cv-003.jpg' },
    { id: 'cv-004', category: 'cardiovascular', name: 'Warfarin 5mg',            composition: 'Warfarin Sodium 5mg',              dosageForm: 'Tablet',    packSize: '30 tablets/pack',   pricePerUnit: 95,   minQty: 5,  description: 'Anticoagulant for prevention of blood clots and stroke.',                           tags: ['Anticoagulant'],                   image: 'med-cv-004.jpg' },
    { id: 'cv-005', category: 'cardiovascular', name: 'Digoxin 0.25mg',          composition: 'Digoxin 0.25mg',                   dosageForm: 'Tablet',    packSize: '30 tablets/pack',   pricePerUnit: 75,   minQty: 5,  description: 'Cardiac glycoside for heart failure and atrial fibrillation.',                       tags: ['Cardiac Glycoside'],               image: 'med-cv-005.jpg' },

    // ── ONCOLOGY ──────────────────────────────────────────────────────────────
    { id: 'on-001', category: 'oncology', name: 'Imatinib 400mg',               composition: 'Imatinib Mesylate 400mg',           dosageForm: 'Tablet',    packSize: '30 tablets/pack',   pricePerUnit: 8500, minQty: 1,  description: 'Targeted therapy for CML and GIST. BCR-ABL tyrosine kinase inhibitor.',             tags: ['Targeted Therapy', 'CML'],         image: 'med-on-001.jpg' },
    { id: 'on-002', category: 'oncology', name: 'Ondansetron 8mg',              composition: 'Ondansetron HCl 8mg',               dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 120,  minQty: 5,  description: 'Antiemetic for chemotherapy-induced nausea and vomiting.',                          tags: ['Antiemetic', 'Supportive Care'],   image: 'med-on-002.jpg' },
    { id: 'on-003', category: 'oncology', name: 'Dexamethasone 4mg Inj',        composition: 'Dexamethasone Sodium Phosphate',    dosageForm: 'Injection', packSize: '1 vial/unit',       pricePerUnit: 185,  minQty: 5,  description: 'Corticosteroid for inflammation and oncology supportive care.',                     tags: ['Corticosteroid', 'Injectable'],    image: 'med-on-003.jpg' },
    { id: 'on-004', category: 'oncology', name: 'Tamoxifen 20mg',               composition: 'Tamoxifen Citrate 20mg',            dosageForm: 'Tablet',    packSize: '30 tablets/pack',   pricePerUnit: 320,  minQty: 2,  description: 'Selective estrogen receptor modulator for breast cancer treatment.',                tags: ['SERM', 'Breast Cancer'],           image: 'med-on-004.jpg' },

    // ── ANTI-INFECTIVE ────────────────────────────────────────────────────────
    { id: 'ai-001', category: 'anti-infective', name: 'Amoxicillin 500mg',      composition: 'Amoxicillin Trihydrate 500mg',      dosageForm: 'Capsule',   packSize: '10 capsules/strip', pricePerUnit: 55,   minQty: 10, description: 'Broad-spectrum penicillin antibiotic for respiratory and urinary tract infections.',  tags: ['Antibiotic', 'Penicillin'],        image: 'med-ai-001.jpg' },
    { id: 'ai-002', category: 'anti-infective', name: 'Azithromycin 500mg',     composition: 'Azithromycin 500mg',                dosageForm: 'Tablet',    packSize: '3 tablets/pack',    pricePerUnit: 85,   minQty: 10, description: 'Macrolide antibiotic for community-acquired pneumonia and atypical infections.',     tags: ['Antibiotic', 'Macrolide'],         image: 'med-ai-002.jpg' },
    { id: 'ai-003', category: 'anti-infective', name: 'Fluconazole 150mg',      composition: 'Fluconazole 150mg',                 dosageForm: 'Capsule',   packSize: '1 capsule/pack',    pricePerUnit: 45,   minQty: 10, description: 'Antifungal for candidiasis and cryptococcal infections.',                           tags: ['Antifungal'],                      image: 'med-ai-003.jpg' },
    { id: 'ai-004', category: 'anti-infective', name: 'Metronidazole 400mg',    composition: 'Metronidazole 400mg',               dosageForm: 'Tablet',    packSize: '15 tablets/strip',  pricePerUnit: 32,   minQty: 10, description: 'Antiprotozoal and antibacterial for anaerobic infections.',                         tags: ['Antiprotozoal', 'Antibacterial'],  image: 'med-ai-004.jpg' },
    { id: 'ai-005', category: 'anti-infective', name: 'Oseltamivir 75mg',       composition: 'Oseltamivir Phosphate 75mg',        dosageForm: 'Capsule',   packSize: '10 capsules/pack',  pricePerUnit: 950,  minQty: 5,  description: 'Antiviral neuraminidase inhibitor for influenza A and B treatment.',                tags: ['Antiviral', 'Influenza'],          image: 'med-ai-005.jpg' },

    // ── NEUROLOGY ─────────────────────────────────────────────────────────────
    { id: 'ne-001', category: 'neurology', name: 'Levetiracetam 500mg',         composition: 'Levetiracetam 500mg',               dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 145,  minQty: 5,  description: 'Antiepileptic for partial onset, myoclonic, and generalised tonic-clonic seizures.',  tags: ['Antiepileptic'],                   image: 'med-ne-001.jpg' },
    { id: 'ne-002', category: 'neurology', name: 'Sertraline 50mg',             composition: 'Sertraline HCl 50mg',               dosageForm: 'Tablet',    packSize: '14 tablets/strip',  pricePerUnit: 110,  minQty: 5,  description: 'SSRI antidepressant for depression, OCD, panic disorder and PTSD.',                  tags: ['SSRI', 'Antidepressant'],          image: 'med-ne-002.jpg' },
    { id: 'ne-003', category: 'neurology', name: 'Levodopa/Carbidopa 250mg',    composition: 'Levodopa 250mg + Carbidopa 25mg',   dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 180,  minQty: 5,  description: "Gold standard treatment for Parkinson's disease motor symptoms.",                   tags: ["Parkinson's", 'Dopaminergic'],    image: 'med-ne-003.jpg' },
    { id: 'ne-004', category: 'neurology', name: 'Alprazolam 0.5mg',            composition: 'Alprazolam 0.5mg',                  dosageForm: 'Tablet',    packSize: '10 tablets/strip',  pricePerUnit: 48,   minQty: 5,  description: 'Benzodiazepine for short-term management of anxiety and panic disorders.',            tags: ['Anxiolytic', 'Benzodiazepine'],   image: 'med-ne-004.jpg' },

    // ── RESPIRATORY ───────────────────────────────────────────────────────────
    { id: 're-001', category: 'respiratory', name: 'Salbutamol Inhaler 100mcg', composition: 'Salbutamol Sulphate 100mcg/dose',  dosageForm: 'Inhaler',   packSize: '200 doses/inhaler', pricePerUnit: 220,  minQty: 5,  description: 'Short-acting bronchodilator for acute bronchospasm in asthma and COPD.',            tags: ['Bronchodilator', 'SABA'],          image: 'med-re-001.jpg' },
    { id: 're-002', category: 'respiratory', name: 'Budesonide 200mcg Inhaler', composition: 'Budesonide 200mcg/dose',           dosageForm: 'Inhaler',   packSize: '100 doses/inhaler', pricePerUnit: 380,  minQty: 5,  description: 'Inhaled corticosteroid for long-term asthma control and COPD management.',           tags: ['ICS', 'Asthma'],                  image: 'med-re-002.jpg' },
    { id: 're-003', category: 'respiratory', name: 'Montelukast 10mg',          composition: 'Montelukast Sodium 10mg',           dosageForm: 'Tablet',    packSize: '14 tablets/strip',  pricePerUnit: 95,   minQty: 5,  description: 'Leukotriene receptor antagonist for asthma and allergic rhinitis.',                  tags: ['LTRA', 'Asthma'],                 image: 'med-re-003.jpg' },
    { id: 're-004', category: 'respiratory', name: 'Ambroxol Syrup 30mg/5ml',   composition: 'Ambroxol HCl 30mg per 5ml',        dosageForm: 'Syrup',     packSize: '100ml bottle',      pricePerUnit: 65,   minQty: 10, description: 'Mucolytic expectorant for productive cough and respiratory tract infections.',       tags: ['Mucolytic', 'Expectorant'],        image: 'med-re-004.jpg' },

    // ── PAEDIATRIC ────────────────────────────────────────────────────────────
    { id: 'pa-001', category: 'paediatric', name: 'Paracetamol Syrup 250mg/5ml',  composition: 'Paracetamol 250mg per 5ml',     dosageForm: 'Syrup',     packSize: '60ml bottle',       pricePerUnit: 38,   minQty: 12, description: 'Antipyretic and analgesic syrup for fever and mild-to-moderate pain in children.',   tags: ['Antipyretic', 'Analgesic'],        image: 'med-pa-001.jpg' },
    { id: 'pa-002', category: 'paediatric', name: 'Amoxicillin 125mg/5ml Susp',   composition: 'Amoxicillin Trihydrate 125mg/5ml', dosageForm: 'Suspension', packSize: '60ml bottle',  pricePerUnit: 52,   minQty: 10, description: 'Paediatric antibiotic suspension for ear, throat and chest infections.',             tags: ['Antibiotic', 'Suspension'],        image: 'med-pa-002.jpg' },
    { id: 'pa-003', category: 'paediatric', name: 'ORS Powder Sachet',             composition: 'WHO-ORS Formula',                dosageForm: 'Powder',    packSize: '1 sachet/21.8g',    pricePerUnit: 10,   minQty: 50, description: 'WHO-formula oral rehydration salts for diarrhoea and dehydration in children.',      tags: ['ORS', 'Rehydration'],              image: 'med-pa-003.jpg' },
    { id: 'pa-004', category: 'paediatric', name: 'Zinc Sulphate 20mg/5ml',        composition: 'Zinc Sulphate 20mg per 5ml',     dosageForm: 'Syrup',     packSize: '60ml bottle',       pricePerUnit: 42,   minQty: 10, description: 'Zinc supplementation syrup for paediatric diarrhoea management.',                    tags: ['Zinc', 'Supplement'],              image: 'med-pa-004.jpg' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getMedicinesByCategory = (categoryId) =>
    medicines.filter((m) => m.category === categoryId);

export const getCategoryInfo = (categoryId) =>
    categories.find((c) => c.id === categoryId);

// Format price in INR
export const formatPrice = (amount) =>
    `₹${amount.toLocaleString('en-IN')}`;