export interface CaseDocument {
  id: string;
  name: string;
  type:
    | "medical-records"
    | "medical-history"
    | "prescription"
    | "medical-test"
    | "imaging-report"
    | "notes"
    | "summary";
  date: string;
  pages: number;
  preview: string;
}

// ── CASE-001: Sarah Johnson, 68F, Right Knee OA → Total Knee Replacement ──
const case001Documents: CaseDocument[] = [
  {
    id: "c1-doc-1",
    name: "Clinical Progress Notes",
    type: "medical-records",
    date: "Jan 10, 2024",
    pages: 5,
    preview: `CLINICAL PROGRESS NOTE
Provider: Dr. Michael Chen, Orthopedic Surgery
Date: January 10, 2024
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234

CHIEF COMPLAINT: Follow-up for chronic right knee pain.

HISTORY OF PRESENT ILLNESS:
68-year-old female presents with progressive right knee pain over the past 18 months. Pain is described as constant, aching, rated 8/10 with activity and 4/10 at rest. Symptoms are worse with weight-bearing, stair climbing, and prolonged standing. Patient reports significant difficulty with ADLs including walking more than 1 block, rising from a seated position, and performing household tasks.

FAILED CONSERVATIVE MANAGEMENT:
• Meloxicam 15mg daily × 4 months — minimal relief
• Acetaminophen 500mg PRN — inadequate for breakthrough pain
• Physical therapy (12 sessions over 6 months) — no sustained improvement
• Corticosteroid injections (3 injections, last Oct 2023) — temporary relief only
• Activity modification and bracing — ongoing, insufficient

PHYSICAL EXAMINATION:
• Gait: Antalgic, favoring left side
• Inspection: Varus deformity, mild effusion
• Palpation: Joint line tenderness medially
• ROM: Flexion 85°, Extension -10° (limited)
• Crepitus: Present throughout range
• Stability: ACL/PCL/MCL/LCL intact
• Neurovascular: Intact distally

ASSESSMENT:
Primary osteoarthritis, right knee, Kellgren-Lawrence Grade IV with documented failure of conservative management and significant functional impairment.

PLAN:
Recommend total knee arthroplasty (CPT 27447). Initiate pre-authorization. Pre-operative clearance to be obtained.`,
  },
  {
    id: "c1-doc-2",
    name: "Orthopedic Consultation",
    type: "medical-records",
    date: "Jan 8, 2024",
    pages: 3,
    preview: `ORTHOPEDIC CONSULTATION REPORT
Referring Physician: Dr. James Park, Primary Care
Consulting Physician: Dr. Michael Chen, Orthopedic Surgery
Date: January 8, 2024
Patient: Sarah Johnson | DOB: 03/12/1958

REASON FOR REFERRAL:
Evaluation of severe right knee osteoarthritis unresponsive to conservative treatment.

CLINICAL ASSESSMENT:
Patient has exhausted non-operative treatment options over 18 months. Radiographic evidence shows end-stage osteoarthritis with complete joint space narrowing in the medial compartment. Functional impairment is significant with WOMAC score of 68/96.

IMAGING REVIEW:
Weight-bearing X-rays and MRI reviewed. Findings consistent with Grade IV OA with bone-on-bone contact, osteophyte formation, subchondral sclerosis, and degenerative meniscal changes.

RECOMMENDATION:
Total knee arthroplasty is recommended as the definitive treatment. Patient meets all clinical criteria for surgical intervention based on documented failure of conservative management, severe radiographic disease, and significant functional limitation.

SURGICAL PLAN:
• Right total knee arthroplasty (CPT 27447)
• Estimated OR time: 90 minutes
• Anticipated hospital stay: 1–2 days
• Post-op rehab protocol: Standard TKA pathway`,
  },
  {
    id: "c1-doc-3",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Dec 15, 2023",
    pages: 8,
    preview: `COMPREHENSIVE MEDICAL HISTORY
Patient: Sarah Johnson | DOB: 03/12/1958 | Age: 68 | Sex: Female
MRN: PT-78234 | Insurance: Aetna | Group: GRP-12345

ALLERGIES:
• Penicillin — Rash
• Sulfa drugs — Hives

ACTIVE MEDICATIONS:
1. Meloxicam 15mg — 1 tablet PO daily (NSAID for knee pain)
2. Acetaminophen 500mg — 1–2 tablets PO PRN (breakthrough pain)
3. Lisinopril 10mg — 1 tablet PO daily (hypertension)
4. Metformin 500mg — 1 tablet PO BID (type 2 diabetes)
5. Atorvastatin 20mg — 1 tablet PO daily (hyperlipidemia)

PAST MEDICAL HISTORY:
• Type 2 Diabetes Mellitus — diagnosed 2015, well-controlled (HbA1c 6.8%)
• Hypertension — diagnosed 2010, controlled on medication
• Hyperlipidemia — controlled on statin therapy
• Osteoarthritis, bilateral knees (right > left)

PAST SURGICAL HISTORY:
• Appendectomy (1985) — uncomplicated
• Cholecystectomy (2010) — laparoscopic, uncomplicated

FAMILY HISTORY:
• Father: Coronary artery disease (MI at age 72)
• Mother: Type 2 diabetes, osteoarthritis
• Siblings: One brother with hypertension

SOCIAL HISTORY:
• Non-smoker
• Occasional alcohol (1–2 drinks/week)
• Retired school teacher
• Lives with spouse, single-story home
• Ambulatory with occasional use of cane for long distances`,
  },
  {
    id: "c1-doc-4",
    name: "Pre-Operative Lab Report — CBC",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 2,
    preview: `LABORATORY REPORT — COMPLETE BLOOD COUNT (CBC)
Facility: Regional Medical Center Laboratory
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234
Specimen: Venous Blood | Collection Date: January 5, 2024
Ordering Provider: Dr. Michael Chen

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
WBC                    7.2       4.5–11.0 x10⁹/L    Normal
RBC                    4.5       3.8–5.1 x10¹²/L    Normal
Hemoglobin             13.8      12.0–16.0 g/dL     Normal
Hematocrit             41.2      36.0–46.0 %         Normal
MCV                    91.6      80.0–100.0 fL       Normal
MCH                    30.7      27.0–33.0 pg        Normal
MCHC                   33.5      32.0–36.0 g/dL      Normal
RDW                    13.1      11.5–14.5 %         Normal
Platelets              245       150–400 x10⁹/L      Normal
MPV                    9.8       7.5–11.5 fL         Normal
Neutrophils            62        40–70 %             Normal
Lymphocytes            28        20–40 %             Normal
Monocytes              7         2–8 %               Normal
Eosinophils            2         1–4 %               Normal
Basophils              1         0–1 %               Normal
═══════════════════════════════════════════════════════════

CLINICAL REMARKS:
All CBC parameters within normal limits. Patient is suitable for pre-operative clearance from a hematological standpoint. No evidence of anemia, infection, or coagulation abnormality.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c1-doc-5",
    name: "Pre-Operative Lab Report — BMP & HbA1c",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 2,
    preview: `LABORATORY REPORT — BASIC METABOLIC PANEL & HbA1c
Facility: Regional Medical Center Laboratory
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234
Specimen: Venous Blood | Collection Date: January 5, 2024
Ordering Provider: Dr. Michael Chen

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
Glucose (fasting)      112       70–100 mg/dL        HIGH
BUN                    18        7–20 mg/dL          Normal
Creatinine             0.9       0.6–1.2 mg/dL       Normal
eGFR                   78        >60 mL/min          Normal
Sodium                 140       136–145 mEq/L       Normal
Potassium              4.2       3.5–5.0 mEq/L       Normal
Chloride               101       98–106 mEq/L        Normal
CO2                    24        22–29 mEq/L         Normal
Calcium                9.4       8.5–10.5 mg/dL      Normal
───────────────────────────────────────────────────────────
HbA1c                  6.8       <5.7% Normal        HIGH
                                 5.7–6.4% Pre-DM
                                 ≥6.5% Diabetes
═══════════════════════════════════════════════════════════

CLINICAL REMARKS:
Fasting glucose mildly elevated consistent with known Type 2 DM. HbA1c of 6.8% indicates adequately controlled diabetes. Renal function and electrolytes within normal limits. Patient is cleared for elective surgical procedure from a metabolic standpoint.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c1-doc-6",
    name: "Coagulation Panel (PT/INR/aPTT)",
    type: "medical-test",
    date: "Jan 5, 2024",
    pages: 1,
    preview: `LABORATORY REPORT — COAGULATION STUDIES
Facility: Regional Medical Center Laboratory
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234
Specimen: Citrated Venous Blood | Collection Date: January 5, 2024
Ordering Provider: Dr. Michael Chen

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
Prothrombin Time (PT)  12.4      11.0–13.5 sec       Normal
INR                    1.0       0.8–1.2             Normal
aPTT                   29        25–35 sec           Normal
Fibrinogen             310       200–400 mg/dL       Normal
═══════════════════════════════════════════════════════════

CLINICAL REMARKS:
Coagulation parameters within normal limits. No evidence of coagulopathy. Patient is suitable for elective surgery without increased bleeding risk.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c1-doc-7",
    name: "MRI Right Knee",
    type: "imaging-report",
    date: "Dec 28, 2023",
    pages: 4,
    preview: `RADIOLOGY REPORT — MRI RIGHT KNEE WITHOUT CONTRAST
Facility: Regional Medical Center, Radiology Department
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234
Date of Exam: December 28, 2023
Ordering Provider: Dr. Michael Chen
Radiologist: Dr. Amanda Foster, MD

PROCEDURE: MRI Right Knee without contrast — Sagittal T1, Sagittal PD FS, Coronal PD FS, Axial PD FS sequences.

CLINICAL INDICATION: Chronic right knee pain, evaluation for surgical planning.

COMPARISON: X-ray right knee dated December 15, 2023.

FINDINGS:

ARTICULAR CARTILAGE:
• Medial compartment: Complete loss of articular cartilage with exposed subchondral bone (Grade IV). Bone-on-bone contact present.
• Lateral compartment: Moderate thinning with focal full-thickness defects (Grade III).
• Patellofemoral: Moderate thinning, Grade II-III changes on medial facet.

MENISCI:
• Medial meniscus: Complex degenerative tear involving the body and posterior horn with extrusion.
• Lateral meniscus: Mild degenerative signal, no discrete tear.

LIGAMENTS:
• ACL: Intact, normal signal.
• PCL: Intact, normal signal.
• MCL: Mild thickening consistent with chronic strain, intact fibers.
• LCL: Intact.

BONE:
• Subchondral bone marrow edema in medial femoral condyle and medial tibial plateau.
• Subchondral cyst formation (8mm) in medial tibial plateau.
• Osteophyte formation at all compartments.

OTHER:
• Moderate joint effusion.
• Baker's cyst (2.3 x 1.1 cm) in popliteal fossa.
• No loose bodies identified.

IMPRESSION:
1. Advanced tricompartmental osteoarthritis, most severe in the medial compartment with complete cartilage loss, bone-on-bone contact, and subchondral changes.
2. Complex degenerative medial meniscal tear with extrusion.
3. Moderate joint effusion and Baker's cyst.
4. Ligaments intact.
5. Findings support clinical indication for total knee arthroplasty. <img src='/cases/001/MRI_Knee.png'/>`,
  },
  {
    id: "c1-doc-8",
    name: "X-Ray Right Knee (Weight-Bearing)",
    type: "imaging-report",
    date: "Dec 15, 2023",
    pages: 2,
    preview: `RADIOLOGY REPORT — X-RAY RIGHT KNEE
Facility: Regional Medical Center, Radiology Department
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234
Date of Exam: December 15, 2023
Ordering Provider: Dr. Michael Chen
Radiologist: Dr. Amanda Foster, MD

PROCEDURE: Right knee — AP standing, lateral, and sunrise views.

CLINICAL INDICATION: Chronic right knee pain, suspected osteoarthritis.

COMPARISON: Right knee X-ray from June 2023.

FINDINGS:

AP VIEW (WEIGHT-BEARING):
• Complete loss of joint space in medial compartment with bone-on-bone contact.
• Lateral compartment: Moderate joint space narrowing (~50%).
• Marginal osteophyte formation at medial and lateral femoral condyles and tibial plateaus.
• Subchondral sclerosis in medial compartment.
• Varus deformity measuring approximately 8 degrees.

LATERAL VIEW:
• Moderate patellofemoral joint space narrowing.
• Osteophyte formation at superior and inferior patellar poles.
• No fracture or dislocation.

SUNRISE VIEW:
• Patellar tracking appears adequate.
• Moderate osteophyte formation on medial patellar facet.

IMPRESSION:
1. Kellgren-Lawrence Grade IV osteoarthritis of the right knee, worst in the medial compartment.
2. Bone-on-bone medial compartment narrowing with varus deformity of 8°.
3. Progressive changes compared to prior study from June 2023.
4. Findings consistent with clinical indication for total knee arthroplasty. <img src='/cases/001/X_Ray.jpg'/>`,
  },
  {
    id: "c1-doc-9",
    name: "Meloxicam 15mg Prescription",
    type: "prescription",
    date: "Nov 20, 2023",
    pages: 1,
    preview: `PRESCRIPTION RECORD
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234
Prescriber: Dr. Michael Chen | DEA: FC1234567
Pharmacy: CVS Pharmacy #4521
Date Written: November 20, 2023

─────────────────────────────────────────
Rx: Meloxicam 15mg tablets
Sig: Take 1 tablet by mouth once daily with food
Disp: #30
Refills: 5
─────────────────────────────────────────

INDICATION: Osteoarthritis pain management
DURATION: Ongoing (started Sept 2023)
RESPONSE: Minimal relief after 4 months of continuous use. Patient reports pain still 7-8/10 with activity.

NOTES:
Patient counseled on GI precautions. Monitor renal function given concurrent metformin use. Consider discontinuation prior to surgery.`,
  },
  {
    id: "c1-doc-10",
    name: "Cardiology Pre-Op Clearance",
    type: "medical-records",
    date: "Jan 3, 2024",
    pages: 2,
    preview: `PRE-OPERATIVE CARDIAC CLEARANCE LETTER
Cardiologist: Dr. Robert Singh, MD, FACC
Date: January 3, 2024
Patient: Sarah Johnson | DOB: 03/12/1958 | MRN: PT-78234

TO: Dr. Michael Chen, Orthopedic Surgery

RE: Pre-operative cardiac clearance for elective right total knee arthroplasty

ASSESSMENT:
I have evaluated Sarah Johnson for pre-operative cardiac risk assessment prior to her planned total knee arthroplasty.

CARDIAC HISTORY:
• Hypertension — well-controlled on Lisinopril 10mg
• No history of coronary artery disease, heart failure, or arrhythmia
• No history of chest pain, dyspnea, or syncope

EVALUATION PERFORMED:
• ECG (Jan 3, 2024): Normal sinus rhythm, rate 72 bpm, no ST-T changes
• Blood pressure: 128/78 mmHg
• Heart rate: 72 bpm, regular
• Cardiac exam: S1/S2 normal, no murmurs, gallops, or rubs

RISK STRATIFICATION:
Revised Cardiac Risk Index (RCRI) Score: 1 (diabetes)
Estimated perioperative MACE risk: <1%

CLEARANCE:
Patient is CLEARED for elective surgery from a cardiovascular standpoint. No additional cardiac testing required. Continue current antihypertensive medication. Hold Meloxicam 7 days prior to surgery.

Dr. Robert Singh, MD, FACC`,
  },
];

// ── CASE-002: Robert Williams, 47M, Lumbar Spondylolisthesis → Spinal Fusion ──
const case002Documents: CaseDocument[] = [
  {
    id: "c2-doc-1",
    name: "Spine Consultation — Dr. Patel",
    type: "medical-records",
    date: "Jan 18, 2024",
    pages: 5,
    preview: `ORTHOPEDIC SPINE CONSULTATION
Provider: Dr. Anil Patel, Spine Surgery
Date: January 18, 2024
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129

CHIEF COMPLAINT: Severe low back pain with right leg radiculopathy × 14 months.

HISTORY OF PRESENT ILLNESS:
47-year-old male with progressive low back pain radiating to the right lower extremity for 14 months. Pain rated 7–9/10, exacerbated by standing >10 minutes, walking >1 block, and lifting. Associated numbness and tingling in the right L5 dermatomal distribution. Symptoms result in functional disability affecting work and ADLs.

FAILED CONSERVATIVE MANAGEMENT:
• Gabapentin 300mg TID × 6 months — partial relief
• Naproxen 500mg BID × 4 months — minimal relief
• Cyclobenzaprine 10mg PRN — temporary muscle spasm relief
• Supervised physical therapy (16 sessions over 12 weeks) — no sustained improvement
• Epidural steroid injections × 2 (Aug 2023, Nov 2023) — transient relief only

PHYSICAL EXAMINATION:
• Gait: Antalgic
• Lumbar spine: Tenderness at L4–L5, reduced ROM (flexion 40°, extension 10°)
• Straight leg raise: Positive on right at 35°
• Neurologic: Decreased sensation in right L5 dermatome, EHL weakness 4/5 right
• Reflexes: Patellar 2+ bilaterally, Achilles 2+ bilaterally

ASSESSMENT:
Grade I spondylolisthesis at L4-L5 with foraminal stenosis, right L5 radiculopathy, and degenerative disc disease. Failed >12 weeks of comprehensive conservative management.

PLAN:
Recommend lumbar decompression with posterior interbody fusion at L4-L5 (CPT 22630). Initiate pre-authorization with UnitedHealthcare.`,
  },
  {
    id: "c2-doc-2",
    name: "Lumbar MRI Report",
    type: "imaging-report",
    date: "Jan 12, 2024",
    pages: 4,
    preview: `RADIOLOGY REPORT — MRI LUMBAR SPINE WITHOUT CONTRAST
Facility: Regional Medical Center, Radiology Department
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129
Date of Exam: January 12, 2024
Ordering Provider: Dr. Anil Patel
Radiologist: Dr. Kevin Li, MD

PROCEDURE: MRI lumbar spine without contrast — Sagittal T1, T2, STIR; Axial T2 sequences.

CLINICAL INDICATION: Low back pain with right-sided radiculopathy, suspected spondylolisthesis.

COMPARISON: Lumbar X-ray dated January 10, 2024.

FINDINGS:

L3-L4: Mild disc bulge. No significant stenosis.

L4-L5:
• Grade I anterolisthesis of L4 on L5 (5mm anterior subluxation)
• Disc collapse with loss of >50% disc height
• Broad-based disc protrusion with right foraminal extension
• Moderate bilateral foraminal stenosis, severe on the right
• Right L5 nerve root compression identified
• Ligamentum flavum hypertrophy contributing to central canal narrowing
• Moderate central canal stenosis (AP diameter 9mm)

L5-S1: Mild disc degeneration. Mild bilateral foraminal narrowing without significant stenosis.

IMPRESSION:
1. Grade I spondylolisthesis at L4-L5 with disc collapse and broad-based disc protrusion.
2. Severe right foraminal stenosis with L5 nerve root compression — correlates with clinical radiculopathy.
3. Moderate central canal stenosis at L4-L5.
4. Mild degenerative changes at adjacent levels without significant stenosis.  <img src='/cases/002/LUMBAR_spine_MRI.png'/>`,
  },
  {
    id: "c2-doc-3",
    name: "Lumbar X-Ray (Flexion/Extension)",
    type: "imaging-report",
    date: "Jan 10, 2024",
    pages: 2,
    preview: `RADIOLOGY REPORT — X-RAY LUMBAR SPINE (FLEXION/EXTENSION)
Facility: Regional Medical Center, Radiology Department
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129
Date of Exam: January 10, 2024
Ordering Provider: Dr. Anil Patel
Radiologist: Dr. Kevin Li, MD

PROCEDURE: Lumbar spine — AP, lateral, flexion, and extension views.

CLINICAL INDICATION: Low back pain, evaluation for instability.

COMPARISON: None.

FINDINGS:

AP VIEW:
• Normal lumbar lordosis
• No scoliosis
• Disc space narrowing at L4-L5

LATERAL VIEW:
• Grade I anterolisthesis of L4 on L5 (approximately 5mm)
• Significant disc space narrowing at L4-L5
• Endplate sclerosis at L4-L5

FLEXION/EXTENSION VIEWS:
• Flexion: Anterolisthesis at L4-L5 increases to approximately 7mm
• Extension: Reduces to approximately 4mm
• Dynamic instability: 3mm of translation (positive for instability)
• No instability at other levels

IMPRESSION:
1. Grade I spondylolisthesis at L4-L5 with dynamic instability (3mm translation on flexion/extension).
2. Significant L4-L5 disc space narrowing with endplate changes.
3. Dynamic instability supports surgical stabilization. <img src='/cases/002/Lumbar_X_Ray.png'/>`,
  },
  {
    id: "c2-doc-4",
    name: "EMG / Nerve Conduction Study",
    type: "medical-test",
    date: "Jan 8, 2024",
    pages: 3,
    preview: `ELECTRODIAGNOSTIC REPORT — EMG / NERVE CONDUCTION STUDY
Facility: Regional Medical Center, Neurophysiology Lab
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129
Date of Study: January 8, 2024
Ordering Provider: Dr. Anil Patel
Performing Physician: Dr. Susan Clarke, MD (Neurology)

CLINICAL INDICATION: Right lower extremity radiculopathy, evaluation for nerve root involvement.

NERVE CONDUCTION STUDIES:
═══════════════════════════════════════════════════════════
NERVE              LATENCY    AMPLITUDE    VELOCITY   FLAG
═══════════════════════════════════════════════════════════
R Peroneal Motor   4.8 ms     3.2 mV       42 m/s    LOW
L Peroneal Motor   4.2 ms     5.1 mV       48 m/s    Normal
R Tibial Motor     5.1 ms     6.8 mV       44 m/s    Normal
R Sural Sensory    3.4 ms     12.5 µV      42 m/s    Normal
═══════════════════════════════════════════════════════════

NEEDLE EMG:
═══════════════════════════════════════════════════════════
MUSCLE                    FIBS  PSW   MUAP        RECRUIT
═══════════════════════════════════════════════════════════
R Tibialis Anterior       2+    2+    Polyphasic  Reduced
R Ext. Hallucis Longus    2+    2+    Polyphasic  Reduced
R Peroneus Longus         1+    1+    Normal      Mildly reduced
R Med. Gastrocnemius      0     0     Normal      Normal
R Vastus Medialis         0     0     Normal      Normal
R Lumbar Paraspinals (L5) 2+    2+    —           —
L Tibialis Anterior       0     0     Normal      Normal
═══════════════════════════════════════════════════════════

IMPRESSION:
Electrodiagnostic findings consistent with RIGHT L5 RADICULOPATHY — active/acute-on-chronic. Evidence of denervation in L5-innervated muscles (tibialis anterior, EHL, paraspinals) with reduced recruitment. No evidence of peripheral neuropathy or left-sided involvement. Findings correlate with MRI evidence of L5 nerve root compression at L4-L5.`,
  },
  {
    id: "c2-doc-5",
    name: "Pre-Operative Lab Report — CBC & CMP",
    type: "medical-test",
    date: "Jan 15, 2024",
    pages: 2,
    preview: `LABORATORY REPORT — CBC & COMPREHENSIVE METABOLIC PANEL
Facility: Regional Medical Center Laboratory
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129
Specimen: Venous Blood | Collection Date: January 15, 2024
Ordering Provider: Dr. Anil Patel

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
COMPLETE BLOOD COUNT
WBC                    8.1       4.5–11.0 x10⁹/L    Normal
RBC                    5.2       4.5–5.5 x10¹²/L    Normal
Hemoglobin             15.4      13.5–17.5 g/dL     Normal
Hematocrit             45.8      38.0–50.0 %         Normal
Platelets              268       150–400 x10⁹/L      Normal

COMPREHENSIVE METABOLIC PANEL
Glucose (fasting)      94        70–100 mg/dL        Normal
BUN                    16        7–20 mg/dL          Normal
Creatinine             1.0       0.7–1.3 mg/dL       Normal
eGFR                   >90       >60 mL/min          Normal
Sodium                 141       136–145 mEq/L       Normal
Potassium              4.5       3.5–5.0 mEq/L       Normal
Calcium                9.6       8.5–10.5 mg/dL      Normal
AST                    24        10–40 U/L           Normal
ALT                    28        7–56 U/L            Normal
Albumin                4.3       3.5–5.0 g/dL        Normal
Total Protein          7.1       6.0–8.3 g/dL        Normal
═══════════════════════════════════════════════════════════

CLINICAL REMARKS:
All values within normal limits. Patient is cleared for surgical procedure from laboratory standpoint. No abnormalities detected.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c2-doc-6",
    name: "Physical Therapy Summary",
    type: "medical-records",
    date: "Dec 20, 2023",
    pages: 3,
    preview: `PHYSICAL THERAPY DISCHARGE SUMMARY
Facility: ProMotion Physical Therapy
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129
Referring Provider: Dr. Anil Patel
Treating Therapist: Jennifer Walsh, DPT

TREATMENT PERIOD: September 15 – December 18, 2023 (16 sessions over 12 weeks)

INITIAL PRESENTATION:
• Chief complaint: Low back pain 8/10 with right leg pain 7/10
• Oswestry Disability Index (ODI): 56% (Severe Disability)
• Lumbar flexion ROM: 35° (limited by pain)
• Unable to stand >10 minutes or walk >1 block

TREATMENT PROVIDED:
• Lumbar stabilization exercises
• Core strengthening program
• Neural mobilization / nerve glides
• Manual therapy — joint mobilization L4-L5
• Modalities: TENS, ultrasound, ice/heat
• Ergonomic education and activity modification

DISCHARGE STATUS:
• Pain: Back 7/10, leg 6/10 (minimal improvement)
• ODI: 52% (remained Severe Disability)
• Lumbar flexion ROM: 40° (marginal improvement)
• Functional gains: Minimal — patient continues to report significant limitations

THERAPIST ASSESSMENT:
Patient has reached a plateau with physical therapy. Conservative management has not provided meaningful or sustained functional improvement. Recommend surgical consultation as previously discussed with referring provider.`,
  },
  {
    id: "c2-doc-7",
    name: "Gabapentin 300mg Prescription",
    type: "prescription",
    date: "Jul 15, 2023",
    pages: 1,
    preview: `PRESCRIPTION RECORD
Patient: Robert Williams | DOB: 07/22/1979 | MRN: PT-45129
Prescriber: Dr. Emily Watson | DEA: EW9876543
Pharmacy: Walgreens #7832
Date Written: July 15, 2023

─────────────────────────────────────────
Rx: Gabapentin 300mg capsules
Sig: Take 1 capsule by mouth three times daily
Disp: #90
Refills: 3
─────────────────────────────────────────

INDICATION: Neuropathic pain / lumbar radiculopathy
TITRATION HISTORY:
• Started 100mg TID (Jul 2023), increased to 300mg TID (Aug 2023)
RESPONSE: Partial relief of radiating leg symptoms, does not adequately control pain for functional activities.

Rx: Naproxen 500mg tablets
Sig: Take 1 tablet by mouth twice daily with food
Disp: #60
Refills: 3

INDICATION: Low back pain / anti-inflammatory
RESPONSE: Minimal relief of back pain after 4 months of use.`,
  },
  {
    id: "c2-doc-8",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Jan 18, 2024",
    pages: 4,
    preview: `COMPREHENSIVE MEDICAL HISTORY
Patient: Robert Williams | DOB: 07/22/1979 | Age: 47 | Sex: Male
MRN: PT-45129 | Insurance: UnitedHealthcare | Group: GRP-67890

ALLERGIES:
• Iodine contrast — Anaphylactoid reaction
• Shellfish — Urticaria

ACTIVE MEDICATIONS:
1. Gabapentin 300mg — 1 capsule PO TID (neuropathic pain)
2. Naproxen 500mg — 1 tablet PO BID with food (anti-inflammatory)
3. Cyclobenzaprine 10mg — 1 tablet PO PRN at bedtime (muscle spasm)
4. Tramadol 50mg — 1 tablet PO PRN (breakthrough pain, limited use)
5. Lisinopril 20mg — 1 tablet PO daily (hypertension)

PAST MEDICAL HISTORY:
• Hypertension — diagnosed 2019, controlled on medication
• Obesity — BMI 32.4
• Degenerative disc disease — multi-level
• Lumbar spondylolisthesis — diagnosed 2023

PAST SURGICAL HISTORY:
• Right knee arthroscopy (2015) — meniscal debridement
• No prior spinal surgery

SOCIAL HISTORY:
• Former smoker (quit 2018, 10 pack-year history)
• No alcohol or recreational drug use
• Occupation: Construction foreman (currently on modified duty)
• Lives with wife and two children`,
  },
];

// ── CASE-003: Maria Garcia, 43F, UTI / Office Visit ──
const case003Documents: CaseDocument[] = [
  {
    id: "c3-doc-1",
    name: "Office Visit Note — Dr. Park",
    type: "medical-records",
    date: "Jan 16, 2024",
    pages: 3,
    preview: `OFFICE VISIT NOTE
Provider: Dr. James Park, Internal Medicine
Date: January 16, 2024
Patient: Maria Garcia | DOB: 11/05/1982 | MRN: PT-91823

CHIEF COMPLAINT: Dysuria, urinary frequency, and urgency × 3 days.

HISTORY OF PRESENT ILLNESS:
43-year-old female presents with a 3-day history of burning on urination, increased urinary frequency (every 1–2 hours), and urgency. Denies fever, chills, flank pain, hematuria, vaginal discharge, or nausea/vomiting. Reports gradual worsening despite increased oral hydration and over-the-counter cranberry supplements. No recent sexual activity change or new hygiene products. Last UTI approximately 2 years ago, treated with Nitrofurantoin successfully.

REVIEW OF SYSTEMS:
• Constitutional: No fever, no weight change
• GU: Dysuria (+), frequency (+), urgency (+), no hematuria
• GI: No nausea, vomiting, or diarrhea
• Musculoskeletal: No flank or back pain

PHYSICAL EXAMINATION:
• Vitals: BP 124/78, HR 76, Temp 98.4°F, RR 16, SpO2 99%
• General: Well-appearing, no acute distress
• Abdomen: Soft, non-tender, non-distended, no suprapubic tenderness
• CVA tenderness: Absent bilaterally
• Skin: No rashes

IN-OFFICE URINALYSIS:
═══════════════════════════════════════════
TEST                RESULT         FLAG
═══════════════════════════════════════════
Color               Dark Yellow    —
Clarity             Hazy           Abnormal
Specific Gravity    1.025          Normal
pH                  6.0            Normal
Leukocyte Esterase  2+             Positive
Nitrites            Positive       Positive
WBC                 25–50/HPF      HIGH
RBC                 2–5/HPF        Normal
Bacteria            Moderate       Positive
Protein             Trace          Borderline
Glucose             Negative       Normal
═══════════════════════════════════════════

ASSESSMENT:
Acute uncomplicated urinary tract infection (cystitis).

PLAN:
1. Nitrofurantoin 100mg BID × 5 days
2. Urine culture ordered (results pending)
3. Push oral fluids
4. Follow up if symptoms worsen, fever develops, or no improvement in 48 hours
5. Continue chronic disease medications unchanged`,
  },
  {
    id: "c3-doc-2",
    name: "Home Blood Pressure Log",
    type: "medical-records",
    date: "Jan 14, 2024",
    pages: 2,
    preview: `HOME BLOOD PRESSURE MONITORING LOG
Patient: Maria Garcia | DOB: 11/05/1982
Monitoring Period: January 1–14, 2024
Device: Omron BP7350 (validated, proper cuff size)

══════════════════════════════════════════════════════
DATE        AM (SYS/DIA)   PM (SYS/DIA)   NOTES
══════════════════════════════════════════════════════
Jan 1       126/80         122/76         After walk
Jan 2       128/82         124/78
Jan 3       130/84         126/80
Jan 4       124/78         120/76
Jan 5       122/76         118/74
Jan 6       126/80         124/78
Jan 7       128/82         126/80
Jan 8       124/76         122/76
Jan 9       126/80         124/78
Jan 10      128/82         126/80
Jan 11      124/78         122/76
Jan 12      126/80         124/78
Jan 13      128/82         126/80         Slight headache
Jan 14      124/78         122/76
══════════════════════════════════════════════════════

AVERAGE: 126/80 mmHg (AM) / 123/77 mmHg (PM)
Overall Average: 125/79 mmHg

SUMMARY: Blood pressure is well-controlled within target range (<130/80) on current medication regimen (Amlodipine 5mg + Lisinopril 20mg). No readings above 130/85. Continue current regimen.`,
  },
  {
    id: "c3-doc-3",
    name: "A1c & Lipid Panel Lab Report",
    type: "medical-test",
    date: "Jan 12, 2024",
    pages: 2,
    preview: `LABORATORY REPORT — HbA1c & LIPID PANEL
Facility: Regional Medical Center Laboratory
Patient: Maria Garcia | DOB: 11/05/1982 | MRN: PT-91823
Specimen: Venous Blood | Collection Date: January 12, 2024
Ordering Provider: Dr. James Park

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
GLYCEMIC CONTROL
HbA1c                  6.2       <5.7% Normal        HIGH
                                 5.7–6.4% Pre-DM
Fasting Glucose        108       70–100 mg/dL        HIGH

LIPID PANEL
Total Cholesterol      198       <200 mg/dL          Normal
LDL Cholesterol        118       <100 mg/dL          HIGH
HDL Cholesterol        54        >40 mg/dL           Normal
Triglycerides          132       <150 mg/dL          Normal
VLDL                   26        5–40 mg/dL          Normal
Total Chol/HDL Ratio   3.7       <5.0                Normal

RENAL FUNCTION
BUN                    14        7–20 mg/dL          Normal
Creatinine             0.8       0.6–1.2 mg/dL       Normal
eGFR                   >90       >60 mL/min          Normal
═══════════════════════════════════════════════════════════

CLINICAL REMARKS:
HbA1c of 6.2% indicates pre-diabetes / well-controlled diabetes on Metformin 500mg. LDL above goal for diabetic patient — consider statin therapy or lifestyle modification. Renal function normal.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c3-doc-4",
    name: "Urine Culture & Sensitivity",
    type: "medical-test",
    date: "Jan 18, 2024",
    pages: 1,
    preview: `MICROBIOLOGY REPORT — URINE CULTURE & SENSITIVITY
Facility: Regional Medical Center Laboratory
Patient: Maria Garcia | DOB: 11/05/1982 | MRN: PT-91823
Specimen: Clean-Catch Midstream Urine | Collection Date: January 16, 2024
Report Date: January 18, 2024

CULTURE RESULTS:
Organism Identified: Escherichia coli
Colony Count: >100,000 CFU/mL (SIGNIFICANT)

ANTIBIOTIC SENSITIVITY:
═══════════════════════════════════════════════════════════
ANTIBIOTIC              MIC (µg/mL)    INTERPRETATION
═══════════════════════════════════════════════════════════
Nitrofurantoin          16             SENSITIVE
Trimethoprim/Sulfa      ≤1/19          SENSITIVE
Ciprofloxacin           ≤0.25          SENSITIVE
Amoxicillin/Clavulanate ≤2             SENSITIVE
Cephalexin              ≤4             SENSITIVE
Ampicillin              16             INTERMEDIATE
═══════════════════════════════════════════════════════════

INTERPRETATION:
E. coli urinary tract infection confirmed. Organism is sensitive to Nitrofurantoin (current treatment). Empiric antibiotic choice is appropriate. No change in therapy recommended.

Microbiologist: Dr. Linda Torres, PhD`,
  },
  {
    id: "c3-doc-5",
    name: "Medication Reconciliation",
    type: "prescription",
    date: "Jan 16, 2024",
    pages: 1,
    preview: `MEDICATION RECONCILIATION
Patient: Maria Garcia | DOB: 11/05/1982 | MRN: PT-91823
Date: January 16, 2024
Provider: Dr. James Park

ALLERGIES: Penicillin — Rash

CURRENT CHRONIC MEDICATIONS:
═══════════════════════════════════════════════════════════
MEDICATION          DOSE        FREQUENCY    INDICATION
═══════════════════════════════════════════════════════════
Amlodipine          5mg         PO daily     Hypertension
Lisinopril          20mg        PO daily     Hypertension
Metformin           500mg       PO BID       Type 2 DM
═══════════════════════════════════════════════════════════

NEW MEDICATION ADDED:
═══════════════════════════════════════════════════════════
Nitrofurantoin      100mg       PO BID       UTI (5-day course)
Start: Jan 16, 2024 | Stop: Jan 21, 2024
═══════════════════════════════════════════════════════════

INTERACTIONS CHECKED: No significant drug-drug interactions identified.
ADHERENCE NOTES: Patient reports good compliance with chronic medications. Counseled on completing full antibiotic course.`,
  },
  {
    id: "c3-doc-6",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Jan 16, 2024",
    pages: 3,
    preview: `COMPREHENSIVE MEDICAL HISTORY
Patient: Maria Garcia | DOB: 11/05/1982 | Age: 43 | Sex: Female
MRN: PT-91823 | Insurance: UnitedHealthcare | Group: GRP-11223

ALLERGIES:
• Penicillin — Rash

PAST MEDICAL HISTORY:
• Essential Hypertension — diagnosed 2019, well-controlled
• Type 2 Diabetes Mellitus — diagnosed 2021, controlled on Metformin (HbA1c 6.2%)
• Hyperlipidemia — borderline, lifestyle modification + monitoring
• UTI history — 1 episode ~2 years ago, uncomplicated

PAST SURGICAL HISTORY:
• Cesarean section (2012) — uncomplicated
• No other surgeries

FAMILY HISTORY:
• Mother: Type 2 diabetes, hypertension
• Father: Hyperlipidemia, coronary artery disease (stent age 65)
• Siblings: One sister with gestational diabetes

SOCIAL HISTORY:
• Non-smoker, never smoked
• Social alcohol (1–2 drinks/month)
• Occupation: Office administrator
• Exercise: Walks 30 minutes 3–4 times/week
• Diet: Working on reducing carbohydrates per dietitian recommendation

PREVENTIVE CARE:
• Last mammogram: 2023 (normal)
• Last Pap smear: 2023 (normal)
• Flu vaccine: 2023
• COVID-19: Fully vaccinated + booster`,
  },
  {
    id: "c3-doc-7",
    name: "Renal & Bladder Ultrasound Report",
    type: "imaging-report",
    date: "Jan 17, 2024",
    pages: 2,
    preview: `RADIOLOGY REPORT — RENAL & BLADDER ULTRASOUND
Facility: Regional Medical Center, Radiology Department
Patient: Maria Garcia | DOB: 11/05/1982 | MRN: PT-91823
Date of Exam: January 17, 2024
Ordering Provider: Dr. James Park
Radiologist: Dr. Helen Morris, MD

PROCEDURE: Limited renal and bladder ultrasound.

CLINICAL INDICATION: Dysuria, urgency, and recurrent lower urinary tract symptoms. Rule out hydronephrosis or urinary retention.

FINDINGS:
• Right kidney: 10.8 cm, normal cortical thickness and echogenicity.
• Left kidney: 10.6 cm, normal cortical thickness and echogenicity.
• No hydronephrosis, focal renal mass, or shadowing renal calculi identified.
• Urinary bladder wall thickness within normal limits.
• Pre-void bladder volume: 210 mL.
• Post-void residual: 18 mL (not clinically significant).

IMPRESSION:
1. Unremarkable renal ultrasound without hydronephrosis.
2. No sonographic evidence of obstructive uropathy.
3. Minimal post-void residual volume.
4. Imaging findings consistent with uncomplicated lower urinary tract infection. <img src='/cases/003/ultrasound.jpg'/>`,
  },
];

// ── CASE-004: David Thompson, 69M, CABG ──
const case004Documents: CaseDocument[] = [
  {
    id: "c4-doc-1",
    name: "Cardiology Consultation — Dr. Martinez",
    type: "medical-records",
    date: "Jan 10, 2024",
    pages: 5,
    preview: `CARDIOLOGY CONSULTATION
Provider: Dr. Lisa Martinez, Cardiothoracic Surgery
Date: January 10, 2024
Patient: David Thompson | DOB: 09/18/1955 | MRN: PT-33847

CHIEF COMPLAINT: Progressive exertional angina and dyspnea × 3 months.

HISTORY OF PRESENT ILLNESS:
69-year-old male with a 3-month history of worsening chest pain on exertion, now occurring with minimal activity (walking 1 block, climbing half a flight of stairs). Associated with dyspnea and diaphoresis. Relieved with rest and sublingual nitroglycerin. Canadian Cardiovascular Society (CCS) Class III angina. Recent stress test showed significant ischemia in the LAD territory.

CARDIAC CATHETERIZATION RESULTS (Jan 8, 2024):
• Left Main: 40% stenosis
• LAD: 90% proximal stenosis (critical)
• LCx: 70% stenosis in OM1
• RCA: 50% mid-vessel stenosis
• LVEF: 45% (mildly reduced)
• LVEDP: 18 mmHg (mildly elevated)

ASSESSMENT:
Severe multi-vessel coronary artery disease with critical LAD stenosis. Reduced LVEF. Not amenable to PCI given left main involvement and multi-vessel disease. SYNTAX score: 33 (intermediate-high).

PLAN:
Recommend coronary artery bypass grafting — single arterial graft (LIMA to LAD) with saphenous vein grafts to OM1 and RCA (CPT 33533). Initiate pre-authorization with Cigna.`,
  },
  {
    id: "c4-doc-2",
    name: "Cardiac Catheterization Report",
    type: "imaging-report",
    date: "Jan 8, 2024",
    pages: 4,
    preview: `CARDIAC CATHETERIZATION REPORT
Facility: Regional Heart Center
Patient: David Thompson | DOB: 09/18/1955 | MRN: PT-33847
Date of Procedure: January 8, 2024
Operator: Dr. Lisa Martinez, MD, FACC
Anesthesia: Conscious sedation

PROCEDURE: Left heart catheterization with coronary angiography.

CLINICAL INDICATION: Progressive angina pectoris, positive stress test.

ACCESS: Right radial artery, 6F sheath.

HEMODYNAMICS:
• Aortic pressure: 138/82 mmHg
• LVEDP: 18 mmHg (mildly elevated)
• Cardiac output: 4.2 L/min
• Cardiac index: 2.1 L/min/m²

CORONARY ANGIOGRAPHY:
Left Main Coronary Artery: 40% distal stenosis
LAD: 90% proximal stenosis, TIMI 2 flow distal to lesion. Calcified plaque.
Diagonal 1: 50% ostial stenosis
LCx: 70% stenosis at origin of OM1. LCx itself with 40% proximal disease.
RCA: Dominant vessel. 50% mid-vessel stenosis. PDA patent.

LEFT VENTRICULOGRAPHY:
• LVEF: 45% by contrast ventriculography
• Anterolateral wall hypokinesis
• No mitral regurgitation

IMPRESSION:
1. Severe triple-vessel coronary artery disease with critical LAD stenosis.
2. Mildly reduced LV systolic function (EF 45%).
3. SYNTAX score: 33 — favors surgical revascularization.

RECOMMENDATION: CABG with LIMA-LAD graft. Heart Team discussion recommended.`,
  },
  {
    id: "c4-doc-3",
    name: "Chest X-Ray (Pre-Op)",
    type: "imaging-report",
    date: "Jan 9, 2024",
    pages: 1,
    preview: `RADIOLOGY REPORT — CHEST X-RAY PA & LATERAL
Facility: Regional Medical Center, Radiology Department
Patient: David Thompson | DOB: 09/18/1955 | MRN: PT-33847
Date of Exam: January 9, 2024
Ordering Provider: Dr. Lisa Martinez
Radiologist: Dr. Amanda Foster, MD

PROCEDURE: Chest X-ray — PA and lateral views.

CLINICAL INDICATION: Pre-operative evaluation for CABG.

COMPARISON: None available.

FINDINGS:

LUNGS: Clear bilaterally. No infiltrates, consolidation, or pleural effusion. No masses or nodules.

HEART: Mildly enlarged cardiac silhouette (cardiothoracic ratio ~0.55). Aortic knob calcification noted.

MEDIASTINUM: No widening. Trachea midline.

BONES: Mild degenerative changes in thoracic spine. No acute osseous abnormality.

IMPRESSION:
1. Mild cardiomegaly — correlate with known coronary artery disease.
2. Lungs clear — no acute cardiopulmonary process.
3. Aortic calcification consistent with atherosclerotic disease.`,
  },
  {
    id: "c4-doc-4",
    name: "Echocardiogram Report",
    type: "imaging-report",
    date: "Jan 7, 2024",
    pages: 3,
    preview: `ECHOCARDIOGRAPHY REPORT — TRANSTHORACIC
Facility: Regional Heart Center
Patient: David Thompson | DOB: 09/18/1955 | MRN: PT-33847
Date of Study: January 7, 2024
Sonographer: Karen Mitchell, RDCS
Interpreting Physician: Dr. Lisa Martinez, MD

CLINICAL INDICATION: Chest pain, evaluation of LV function prior to planned CABG.

FINDINGS:

LEFT VENTRICLE:
• LV internal dimension (diastole): 5.4 cm (mildly dilated)
• LV internal dimension (systole): 4.0 cm
• Interventricular septum: 1.1 cm (normal)
• Posterior wall: 1.0 cm (normal)
• LVEF: 45% (mildly reduced, estimated by Simpson's biplane)
• Regional wall motion: Anterolateral and apical hypokinesis

RIGHT VENTRICLE:
• RV size and function normal
• TAPSE: 2.1 cm (normal)

VALVES:
• Mitral valve: Trace regurgitation, no stenosis
• Aortic valve: Mild sclerosis, no stenosis, trace regurgitation
• Tricuspid valve: Trace regurgitation, RVSP estimated 30 mmHg (normal)
• Pulmonic valve: Normal

OTHER:
• Left atrium: Mildly dilated (4.2 cm)
• No pericardial effusion
• IVC: Normal size and respiratory variation

IMPRESSION:
1. Mildly reduced LV systolic function (EF 45%) with regional wall motion abnormalities in LAD territory.
2. Mild LV and LA dilation.
3. Valves grossly normal with trace regurgitation.
4. No pericardial effusion.`,
  },
  {
    id: "c4-doc-5",
    name: "Pre-Operative Lab Panel",
    type: "medical-test",
    date: "Jan 9, 2024",
    pages: 3,
    preview: `LABORATORY REPORT — PRE-OPERATIVE PANEL
Facility: Regional Medical Center Laboratory
Patient: David Thompson | DOB: 09/18/1955 | MRN: PT-33847
Specimen: Venous Blood | Collection Date: January 9, 2024
Ordering Provider: Dr. Lisa Martinez

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
COMPLETE BLOOD COUNT
WBC                    9.4       4.5–11.0 x10⁹/L    Normal
Hemoglobin             14.2      13.5–17.5 g/dL     Normal
Hematocrit             42.6      38.0–50.0 %         Normal
Platelets              312       150–400 x10⁹/L      Normal

METABOLIC PANEL
Glucose (fasting)      118       70–100 mg/dL        HIGH
BUN                    22        7–20 mg/dL          HIGH
Creatinine             1.3       0.7–1.3 mg/dL       BORDERLINE
eGFR                   58        >60 mL/min          LOW
Sodium                 139       136–145 mEq/L       Normal
Potassium              4.8       3.5–5.0 mEq/L       Normal

COAGULATION
PT                     12.8      11.0–13.5 sec       Normal
INR                    1.1       0.8–1.2             Normal
aPTT                   30        25–35 sec           Normal

CARDIAC MARKERS
Troponin I             0.02      <0.04 ng/mL         Normal
BNP                    285       <100 pg/mL          HIGH

LIPID PANEL
Total Cholesterol      242       <200 mg/dL          HIGH
LDL                    158       <100 mg/dL          HIGH
HDL                    38        >40 mg/dL           LOW
Triglycerides          230       <150 mg/dL          HIGH

HbA1c                  7.2       <5.7%               HIGH
═══════════════════════════════════════════════════════════

CLINICAL REMARKS:
Elevated BNP consistent with mild heart failure. HbA1c 7.2% indicates suboptimally controlled diabetes. Borderline renal function — recommend nephrology optimization pre-op. Dyslipidemia noted — optimize statin therapy.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c4-doc-6",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Jan 10, 2024",
    pages: 4,
    preview: `COMPREHENSIVE MEDICAL HISTORY
Patient: David Thompson | DOB: 09/18/1955 | Age: 69 | Sex: Male
MRN: PT-33847 | Insurance: Cigna | Group: GRP-44556

ALLERGIES:
• No known drug allergies (NKDA)

ACTIVE MEDICATIONS:
1. Aspirin 81mg — PO daily (antiplatelet)
2. Atorvastatin 40mg — PO daily (dyslipidemia)
3. Metoprolol Succinate 50mg — PO daily (rate control / angina)
4. Lisinopril 20mg — PO daily (hypertension / cardiac protection)
5. Metformin 1000mg — PO BID (Type 2 DM)
6. Nitroglycerin 0.4mg SL — PRN chest pain
7. Clopidogrel 75mg — PO daily (post-cath)

PAST MEDICAL HISTORY:
• Coronary artery disease — multi-vessel (diagnosed Jan 2024)
• Type 2 Diabetes Mellitus — diagnosed 2010 (HbA1c 7.2%)
• Hypertension — diagnosed 2005
• Dyslipidemia
• Obesity — BMI 31.2
• Mild CKD (Stage 3a, eGFR 58)
• Former smoker (quit 2012, 30 pack-year history)

PAST SURGICAL HISTORY:
• Right inguinal hernia repair (2008)
• Colonoscopy with polypectomy (2020)

FAMILY HISTORY:
• Father: MI at age 58, died age 64 (sudden cardiac death)
• Mother: Type 2 diabetes, stroke at age 75
• Brother: CABG at age 62`,
  },
];

// ── CASE-005: Jennifer Brown, 34F, Screening Mammography ──
const case005Documents: CaseDocument[] = [
  {
    id: "c5-doc-1",
    name: "Screening Mammography Report",
    type: "imaging-report",
    date: "Jan 10, 2024",
    pages: 2,
    preview: `RADIOLOGY REPORT — BILATERAL SCREENING MAMMOGRAPHY
Facility: Regional Women's Health Center
Patient: Jennifer Brown | DOB: 01/30/1990 | MRN: PT-62951
Date of Exam: January 10, 2024
Ordering Provider: Dr. Robert Kim
Radiologist: Dr. Sarah Chen, MD

PROCEDURE: Bilateral digital screening mammography with tomosynthesis (3D) — CC and MLO views. (CPT 77067)

CLINICAL INDICATION: Annual screening mammography. Family history of breast cancer (maternal aunt, age 52).

COMPARISON: Screening mammogram dated January 2023.

BREAST COMPOSITION: Heterogeneously dense (ACR Category C) — may obscure small masses.

FINDINGS:

RIGHT BREAST:
• No suspicious masses, calcifications, or architectural distortion.
• Stable benign-appearing calcification in upper outer quadrant.
• No skin thickening or axillary lymphadenopathy.

LEFT BREAST:
• No suspicious masses or architectural distortion.
• No suspicious calcifications.
• Stable fibroglandular tissue pattern.
• No skin thickening or axillary lymphadenopathy.

IMPRESSION:
Negative bilateral screening mammography. No evidence of malignancy.

BI-RADS ASSESSMENT: Category 1 — Negative
RECOMMENDATION: Routine annual screening mammography in 12 months. Given heterogeneously dense breast tissue and family history, patient may benefit from supplemental screening discussion (MRI or ultrasound).`,
  },
  {
    id: "c5-doc-2",
    name: "Breast Ultrasound Report",
    type: "imaging-report",
    date: "Jan 10, 2024",
    pages: 2,
    preview: `RADIOLOGY REPORT — BILATERAL BREAST ULTRASOUND
Facility: Regional Women's Health Center
Patient: Jennifer Brown | DOB: 01/30/1990 | MRN: PT-62951
Date of Exam: January 10, 2024
Radiologist: Dr. Sarah Chen, MD

PROCEDURE: Bilateral whole-breast ultrasound (supplemental screening).

CLINICAL INDICATION: Dense breast tissue on mammography, family history of breast cancer.

FINDINGS:

RIGHT BREAST:
• 12 o'clock, 4cm from nipple: 5mm simple cyst (anechoic, well-circumscribed, posterior enhancement). Benign.
• No solid masses identified.
• No suspicious features.

LEFT BREAST:
• 2 o'clock, 6cm from nipple: 4mm simple cyst. Benign.
• 9 o'clock, 3cm from nipple: 8mm oval, well-circumscribed, hypoechoic lesion with smooth margins. Likely fibroadenoma. Stable compared to prior.
• No suspicious features.

AXILLAE: Bilateral lymph nodes normal in morphology. No suspicious adenopathy.

IMPRESSION:
1. Bilateral simple cysts — benign.
2. Left breast 9 o'clock probable fibroadenoma — stable, benign.
3. No suspicious solid masses.

BI-RADS: Category 2 — Benign findings.
RECOMMENDATION: Routine follow-up in 12 months.`,
  },
  {
    id: "c5-doc-3",
    name: "Annual Wellness Lab Report",
    type: "medical-test",
    date: "Jan 8, 2024",
    pages: 2,
    preview: `LABORATORY REPORT — ANNUAL WELLNESS PANEL
Facility: Regional Medical Center Laboratory
Patient: Jennifer Brown | DOB: 01/30/1990 | MRN: PT-62951
Specimen: Venous Blood | Collection Date: January 8, 2024
Ordering Provider: Dr. Robert Kim

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
CBC
WBC                    6.8       4.5–11.0 x10⁹/L    Normal
Hemoglobin             13.2      12.0–16.0 g/dL     Normal
Hematocrit             39.5      36.0–46.0 %         Normal
Platelets              225       150–400 x10⁹/L      Normal

METABOLIC
Glucose                88        70–100 mg/dL        Normal
TSH                    2.1       0.4–4.0 mIU/L      Normal

LIPID PANEL
Total Cholesterol      182       <200 mg/dL          Normal
LDL                    105       <130 mg/dL          Normal
HDL                    62        >40 mg/dL           Normal
Triglycerides          78        <150 mg/dL          Normal

Vitamin D, 25-OH       32        30–100 ng/mL        Normal
═══════════════════════════════════════════════════════════

CLINICAL REMARKS: All values within normal limits. Continue routine screening.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c5-doc-4",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Jan 10, 2024",
    pages: 2,
    preview: `COMPREHENSIVE MEDICAL HISTORY
Patient: Jennifer Brown | DOB: 01/30/1990 | Age: 34 | Sex: Female
MRN: PT-62951 | Insurance: Humana | Group: GRP-78901

ALLERGIES:
• No known drug allergies (NKDA)

ACTIVE MEDICATIONS:
1. Oral contraceptive (combined) — daily
2. Vitamin D3 1000 IU — daily

PAST MEDICAL HISTORY:
• No significant past medical history
• No chronic conditions

PAST SURGICAL HISTORY:
• Wisdom teeth extraction (2012)

FAMILY HISTORY:
• Maternal aunt: Breast cancer (diagnosed age 52, treated with mastectomy)
• Mother: Healthy
• Father: Hypertension
• No BRCA testing performed

SOCIAL HISTORY:
• Non-smoker
• Social alcohol (2–3 drinks/week)
• Occupation: Marketing manager
• Regular exercise (yoga, running 3×/week)
• No children`,
  },
];

// ── CASE-006: Michael Davis, 54M, Lumbar Epidural Injection ──
const case006Documents: CaseDocument[] = [
  {
    id: "c6-doc-1",
    name: "Pain Management Consultation",
    type: "medical-records",
    date: "Jan 12, 2024",
    pages: 4,
    preview: `PAIN MANAGEMENT CONSULTATION
Provider: Dr. Sarah Lee, Pain Medicine
Date: January 12, 2024
Patient: Michael Davis | DOB: 06/14/1970 | MRN: PT-18293

CHIEF COMPLAINT: Chronic low back pain with bilateral lower extremity radiculopathy × 8 months.

HISTORY OF PRESENT ILLNESS:
54-year-old male with progressive low back pain and bilateral leg pain for 8 months. Pain rated 6–8/10, worse with prolonged sitting, standing, and walking. Bilateral L5-S1 dermatomal distribution. Associated with intermittent numbness and tingling in both feet. Patient is a postal worker, unable to complete full shifts due to pain.

FAILED CONSERVATIVE MANAGEMENT:
• Physical therapy (8 sessions) — mild temporary relief
• NSAIDs (Ibuprofen 800mg TID × 3 months) — partial relief, GI side effects
• Muscle relaxants (Tizanidine 4mg TID) — drowsiness, limited benefit
• Chiropractic care (6 sessions) — temporary relief

IMAGING REVIEW:
MRI lumbar spine (Dec 2023): L5-S1 broad-based disc protrusion with bilateral foraminal stenosis. Moderate central canal narrowing. Facet arthropathy at L4-L5 and L5-S1.

PHYSICAL EXAMINATION:
• Lumbar tenderness at L5-S1
• ROM: Flexion 45°, extension 15° (limited by pain)
• SLR: Positive bilaterally at 45°
• Neurologic: Sensation intact, 5/5 strength bilateral LE
• Reflexes: Achilles 1+ bilateral (diminished)

PLAN:
Lumbar epidural steroid injection at L5-S1 under fluoroscopic guidance (CPT 64483). Pre-authorization required per Medicare guidelines.`,
  },
  {
    id: "c6-doc-2",
    name: "MRI Lumbar Spine",
    type: "imaging-report",
    date: "Dec 20, 2023",
    pages: 3,
    preview: `RADIOLOGY REPORT — MRI LUMBAR SPINE WITHOUT CONTRAST
Facility: Regional Medical Center, Radiology Department
Patient: Michael Davis | DOB: 06/14/1970 | MRN: PT-18293
Date of Exam: December 20, 2023
Ordering Provider: Dr. Sarah Lee
Radiologist: Dr. Kevin Li, MD

PROCEDURE: MRI lumbar spine without contrast.

CLINICAL INDICATION: Chronic low back pain with bilateral radiculopathy.

FINDINGS:

L3-L4: Mild disc bulge. No significant stenosis.

L4-L5:
• Mild disc bulge with bilateral facet arthropathy
• Mild bilateral foraminal narrowing
• Ligamentum flavum hypertrophy

L5-S1:
• Broad-based disc protrusion (5mm) with bilateral foraminal extension
• Moderate bilateral foraminal stenosis with bilateral S1 nerve root contact
• Moderate central canal stenosis (AP diameter 10mm)
• Annular tear at posterior disc margin
• Bilateral facet arthropathy with small effusions

IMPRESSION:
1. L5-S1 broad-based disc protrusion with moderate bilateral foraminal stenosis — correlates with bilateral radiculopathy.
2. Moderate central canal stenosis at L5-S1.
3. Multi-level facet arthropathy (L4-L5, L5-S1).
4. Annular tear at L5-S1.`,
  },
  {
    id: "c6-doc-3",
    name: "Pre-Procedure Lab Report",
    type: "medical-test",
    date: "Jan 10, 2024",
    pages: 1,
    preview: `LABORATORY REPORT — PRE-PROCEDURE PANEL
Facility: Regional Medical Center Laboratory
Patient: Michael Davis | DOB: 06/14/1970 | MRN: PT-18293
Specimen: Venous Blood | Collection Date: January 10, 2024
Ordering Provider: Dr. Sarah Lee

═══════════════════════════════════════════════════════════
TEST NAME              RESULT    REFERENCE RANGE     FLAG
═══════════════════════════════════════════════════════════
CBC
WBC                    7.8       4.5–11.0 x10⁹/L    Normal
Hemoglobin             15.0      13.5–17.5 g/dL     Normal
Platelets              278       150–400 x10⁹/L      Normal

COAGULATION
PT                     12.2      11.0–13.5 sec       Normal
INR                    1.0       0.8–1.2             Normal
aPTT                   28        25–35 sec           Normal

METABOLIC
Glucose                96        70–100 mg/dL        Normal
Creatinine             1.0       0.7–1.3 mg/dL       Normal
eGFR                   >90       >60 mL/min          Normal
═══════════════════════════════════════════════════════════

CLINICAL REMARKS: All values within normal limits. Patient cleared for fluoroscopic-guided injection procedure.

Pathologist: Dr. Patricia Hayes, MD`,
  },
  {
    id: "c6-doc-4",
    name: "X-Ray Lumbar Spine",
    type: "imaging-report",
    date: "Aug 15, 2023",
    pages: 2,
    preview: `RADIOLOGY REPORT — X-RAY LUMBAR SPINE
Facility: Regional Medical Center, Radiology Department
Patient: Michael Davis | DOB: 06/14/1970 | MRN: PT-18293
Date of Exam: August 15, 2023
Ordering Provider: Dr. Sarah Lee
Radiologist: Dr. Kevin Li, MD

PROCEDURE: Lumbar spine — AP and lateral views.

CLINICAL INDICATION: Chronic low back pain, initial imaging evaluation.

COMPARISON: None.

FINDINGS:

AP VIEW:
• Normal lumbar alignment
• No scoliosis
• Disc space narrowing at L5-S1
• Mild facet hypertrophy at L4-L5, L5-S1

LATERAL VIEW:
• Normal lumbar lordosis maintained
• L5-S1 disc space narrowing (~40% height loss)
• Endplate sclerosis at L5-S1
• Small anterior osteophytes at L4 and L5
• No fracture, spondylolisthesis, or pars defect

IMPRESSION:
1. Degenerative disc disease at L5-S1 with disc space narrowing and endplate changes.
2. Multi-level facet arthropathy.
3. No fracture, listhesis, or acute abnormality.
4. MRI recommended for further evaluation of neural structures.`,
  },
  {
    id: "c6-doc-5",
    name: "Patient Medical History",
    type: "medical-history",
    date: "Jan 12, 2024",
    pages: 3,
    preview: `COMPREHENSIVE MEDICAL HISTORY
Patient: Michael Davis | DOB: 06/14/1970 | Age: 54 | Sex: Male
MRN: PT-18293 | Insurance: Medicare | Group: GRP-33445

ALLERGIES:
• Codeine — Nausea/vomiting

ACTIVE MEDICATIONS:
1. Ibuprofen 800mg — PO TID with food (anti-inflammatory)
2. Tizanidine 4mg — PO TID (muscle relaxant)
3. Acetaminophen 500mg — PO PRN (breakthrough pain)
4. Omeprazole 20mg — PO daily (GI protection with NSAID use)

PAST MEDICAL HISTORY:
• Chronic low back pain — 8 months
• Degenerative disc disease — lumbar spine
• GERD — controlled on omeprazole
• No diabetes, hypertension, or cardiac history

PAST SURGICAL HISTORY:
• Appendectomy (1995)
• Right shoulder arthroscopy (2018) — rotator cuff repair

SOCIAL HISTORY:
• Non-smoker
• Social alcohol (1–2 beers/week)
• Occupation: US Postal Service letter carrier (25 years)
• Currently on modified duty due to back pain
• Married, two adult children`,
  },
];

// ── Default fallback documents ──
const defaultDocuments: CaseDocument[] = [
  {
    id: "default-doc-1",
    name: "Clinical Notes",
    type: "medical-records",
    date: "Jan 15, 2024",
    pages: 3,
    preview:
      "Clinical progress notes for this patient case. Please refer to the case summary for detailed information.",
  },
  {
    id: "default-doc-2",
    name: "Lab Results",
    type: "medical-test",
    date: "Jan 10, 2024",
    pages: 2,
    preview: "Laboratory results are pending or not yet associated with this case.",
  },
];

const caseDocumentsMap: Record<string, CaseDocument[]> = {
  "CASE-001": case001Documents,
  "CASE-002": case002Documents,
  "CASE-003": case003Documents,
  "CASE-004": case004Documents,
  "CASE-005": case005Documents,
  "CASE-006": case006Documents,
};

export function getCaseDocuments(caseId: string): CaseDocument[] {
  return caseDocumentsMap[caseId] || defaultDocuments;
}
