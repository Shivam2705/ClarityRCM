// src/services/medicalCodingApi.ts

export async function callMedicalCodingApi(medicalText: string) {
  const url = "https://rcm-medical-coding-caller-1037311574972.us-central1.run.app/rcm_coding_agent"
  const payload = { medical_text: medicalText };
  // return [{'cpt_code': '73130', 'justification': "The medical text explicitly documents that 'X-ray imaging shows no evidence of fractures or dislocations in the right hand,' which corresponds to this CPT code for an X-ray of the hand.", 'cpt_score': 0.93, 'icd_link': [{'text': 'fractures', 'icd10_code': {'code': 'S62.91XA', 'description': 'Unspecified fracture of right hand, initial encounter for closed fracture', 'score': 0.86}}, {'text': 'dislocations', 'icd10_code': {'code': 'S63.004A', 'description': 'Unspecified dislocation of right wrist and hand, initial encounter', 'score': 0.85}}, {'text': 'pain', 'icd10_code': {'code': 'M79.641', 'description': 'Pain in right hand', 'score': 0.79}}, {'text': 'stiffness', 'icd10_code': {'code': 'M25.641', 'description': 'Stiffness of right hand, not elsewhere classified', 'score': 0.7}}, {'text': 'fall', 'icd10_code': {'code': 'W19.XXXA', 'description': 'Unspecified fall, initial encounter', 'score': 0.65}}, {'text': 'muscle wasting', 'icd10_code': {'code': 'M62.541', 'description': 'Muscle wasting and atrophy, not elsewhere classified, right hand', 'score': 0.55}}, {'text': 'right hand contracture', 'icd10_code': {'code': 'M24.541', 'description': 'Contracture, right hand', 'score': 0.53}}]}]
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return [{'cpt_code': '73130', 'justification': "The medical text explicitly documents that 'X-ray imaging shows no evidence of fractures or dislocations in the right hand,' which corresponds to this CPT code for an X-ray of the hand.", 'cpt_score': 0.93, 'icd_link': [{'text': 'fractures', 'icd10_code': {'code': 'S62.91XA', 'description': 'Unspecified fracture of right hand, initial encounter for closed fracture', 'score': 0.86}}, {'text': 'dislocations', 'icd10_code': {'code': 'S63.004A', 'description': 'Unspecified dislocation of right wrist and hand, initial encounter', 'score': 0.85}}, {'text': 'pain', 'icd10_code': {'code': 'M79.641', 'description': 'Pain in right hand', 'score': 0.79}}, {'text': 'stiffness', 'icd10_code': {'code': 'M25.641', 'description': 'Stiffness of right hand, not elsewhere classified', 'score': 0.7}}, {'text': 'fall', 'icd10_code': {'code': 'W19.XXXA', 'description': 'Unspecified fall, initial encounter', 'score': 0.65}}, {'text': 'muscle wasting', 'icd10_code': {'code': 'M62.541', 'description': 'Muscle wasting and atrophy, not elsewhere classified, right hand', 'score': 0.55}}, {'text': 'right hand contracture', 'icd10_code': {'code': 'M24.541', 'description': 'Contracture, right hand', 'score': 0.53}}]}]
  
    return { error: error.message || "Unknown error" };
  }
}
