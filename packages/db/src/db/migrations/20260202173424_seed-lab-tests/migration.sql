-- Seed lab tests data
INSERT INTO "lab_tests" ("code", "loinc_code", "name", "category", "aliases") VALUES
('HGB', '718-7', 'Hemoglobin', 'Hematology', '["Hgb", "HGB", "Hemoglobin (Hgb)", "Haemoglobin"]'),
('HCT', '4544-3', 'Hematocrit', 'Hematology', '["Hct", "HCT", "Packed Cell Volume", "PCV"]'),
('RBC', '789-8', 'Red Blood Cell Count', 'Hematology', '["RBC", "Red Blood Cells", "Erythrocyte Count", "Red Cell Count"]'),
('WBC', '6690-2', 'White Blood Cell Count', 'Hematology', '["WBC", "White Blood Cells", "Leukocyte Count", "Leukocytes"]'),
('PLT', '777-3', 'Platelet Count', 'Hematology', '["PLT", "Platelets", "Thrombocyte Count", "Platelet Count"]'),
('MCV', '787-2', 'Mean Corpuscular Volume', 'Hematology', '["MCV", "Mean Cell Volume"]'),
('MCH', '785-6', 'Mean Corpuscular Hemoglobin', 'Hematology', '["MCH", "Mean Cell Hemoglobin"]'),
('MCHC', '786-4', 'Mean Corpuscular Hemoglobin Concentration', 'Hematology', '["MCHC"]'),
('RDW', '788-0', 'Red Cell Distribution Width', 'Hematology', '["RDW", "Red Cell Distribution Width"]'),
('ESR', '4537-7', 'Erythrocyte Sedimentation Rate', 'Hematology', '["ESR", "Sed Rate", "Sedimentation Rate"]'),
('NA', '2951-2', 'Sodium', 'Chemistry', '["Na", "Sodium", "Na+", "Serum Sodium"]'),
('K', '2823-3', 'Potassium', 'Chemistry', '["K", "Potassium", "K+", "Serum Potassium"]'),
('CL', '2075-0', 'Chloride', 'Chemistry', '["Cl", "Chloride", "Cl-", "Serum Chloride"]'),
('CO2', '2028-9', 'Carbon Dioxide', 'Chemistry', '["CO2", "Bicarbonate", "HCO3", "TCO2", "Total CO2"]'),
('CA', '17861-6', 'Calcium', 'Chemistry', '["Ca", "Calcium", "Ca2+", "Serum Calcium", "Total Calcium"]'),
('MG', '2601-3', 'Magnesium', 'Chemistry', '["Mg", "Magnesium", "Mg2+", "Serum Magnesium"]'),
('PHOS', '2777-1', 'Phosphorus', 'Chemistry', '["Phos", "Phosphorus", "Phosphate", "PO4", "Inorganic Phosphorus"]'),
('BUN', '3094-0', 'Blood Urea Nitrogen', 'Chemistry', '["BUN", "Urea Nitrogen", "Urea"]'),
('CREAT', '2160-0', 'Creatinine', 'Chemistry', '["Creat", "Creatinine", "Cr", "Serum Creatinine"]'),
('EGFR', '33914-3', 'Estimated Glomerular Filtration Rate', 'Chemistry', '["eGFR", "GFR", "Estimated GFR"]'),
('ALT', '1742-6', 'Alanine Aminotransferase', 'Chemistry', '["ALT", "SGPT", "Alanine Transaminase", "GPT"]'),
('AST', '1920-8', 'Aspartate Aminotransferase', 'Chemistry', '["AST", "SGOT", "Aspartate Transaminase", "GOT"]'),
('ALP', '6768-6', 'Alkaline Phosphatase', 'Chemistry', '["ALP", "Alk Phos", "Alkaline Phosphatase"]'),
('GGT', '2324-2', 'Gamma-Glutamyl Transferase', 'Chemistry', '["GGT", "Gamma GT", "GGTP", "Gamma-Glutamyl Transpeptidase"]'),
('TBIL', '1975-2', 'Total Bilirubin', 'Chemistry', '["TBIL", "Bilirubin", "Total Bilirubin", "T Bili"]'),
('DBIL', '1968-7', 'Direct Bilirubin', 'Chemistry', '["DBIL", "Direct Bilirubin", "Conjugated Bilirubin", "D Bili"]'),
('ALB', '1751-7', 'Albumin', 'Chemistry', '["ALB", "Albumin", "Serum Albumin"]'),
('TP', '2885-2', 'Total Protein', 'Chemistry', '["TP", "Total Protein", "Serum Protein"]'),
('GLU', '2345-7', 'Glucose', 'Chemistry', '["Glu", "Glucose", "Blood Sugar", "Fasting Glucose", "FBG"]'),
('HBA1C', '4548-4', 'Hemoglobin A1c', 'Chemistry', '["HbA1c", "A1C", "Glycated Hemoglobin", "Glycosylated Hemoglobin"]'),
('CHOL', '2093-3', 'Total Cholesterol', 'Lipids', '["Chol", "Cholesterol", "Total Cholesterol", "TC"]'),
('HDL', '2085-9', 'HDL Cholesterol', 'Lipids', '["HDL", "HDL-C", "High Density Lipoprotein", "Good Cholesterol"]'),
('LDL', '2089-1', 'LDL Cholesterol', 'Lipids', '["LDL", "LDL-C", "Low Density Lipoprotein", "Bad Cholesterol"]'),
('TRIG', '2571-8', 'Triglycerides', 'Lipids', '["Trig", "Triglycerides", "TG"]'),
('TSH', '3016-3', 'Thyroid Stimulating Hormone', 'Thyroid', '["TSH", "Thyrotropin", "Thyroid Stimulating Hormone"]'),
('FT4', '3024-7', 'Free Thyroxine', 'Thyroid', '["FT4", "Free T4", "Thyroxine Free"]'),
('FT3', '3051-0', 'Free Triiodothyronine', 'Thyroid', '["FT3", "Free T3", "Triiodothyronine Free"]'),
('FE', '2498-4', 'Serum Iron', 'Iron Studies', '["Fe", "Iron", "Serum Iron"]'),
('FERR', '2276-4', 'Ferritin', 'Iron Studies', '["Ferr", "Ferritin", "Serum Ferritin"]'),
('TIBC', '2500-7', 'Total Iron Binding Capacity', 'Iron Studies', '["TIBC", "Total Iron Binding Capacity"]'),
('TROP', '10839-9', 'Troponin I', 'Cardiac', '["Trop", "Troponin", "Troponin I", "TnI", "cTnI"]'),
('BNP', '30934-4', 'B-Type Natriuretic Peptide', 'Cardiac', '["BNP", "Brain Natriuretic Peptide", "B-type Natriuretic Peptide"]'),
('CRP', '1988-5', 'C-Reactive Protein', 'Inflammatory', '["CRP", "C-Reactive Protein", "hs-CRP", "High Sensitivity CRP"]'),
('VITD', '1989-3', 'Vitamin D, 25-Hydroxy', 'Vitamins', '["Vit D", "Vitamin D", "25-OH Vitamin D", "25-Hydroxyvitamin D"]'),
('B12', '2132-9', 'Vitamin B12', 'Vitamins', '["B12", "Vitamin B12", "Cobalamin"]'),
('FOLATE', '2284-8', 'Folate', 'Vitamins', '["Folate", "Folic Acid", "Serum Folate"]'),
('PT', '5902-2', 'Prothrombin Time', 'Coagulation', '["PT", "Prothrombin Time", "Pro Time"]'),
('INR', '6301-6', 'International Normalized Ratio', 'Coagulation', '["INR", "International Normalized Ratio"]'),
('APTT', '3173-2', 'Activated Partial Thromboplastin Time', 'Coagulation', '["APTT", "PTT", "aPTT", "Partial Thromboplastin Time"]'),
('DDIMER', '48066-5', 'D-Dimer', 'Coagulation', '["D-Dimer", "D Dimer", "Fibrin Degradation Product"]'),
('URIC', '3084-1', 'Uric Acid', 'Chemistry', '["Uric Acid", "Urate"]'),
('LDH', '2532-0', 'Lactate Dehydrogenase', 'Chemistry', '["LDH", "Lactate Dehydrogenase", "LD"]'),
('AMY', '1798-8', 'Amylase', 'Chemistry', '["Amy", "Amylase", "Serum Amylase"]'),
('LIPASE', '3040-3', 'Lipase', 'Chemistry', '["Lipase", "Serum Lipase"]');
--> statement-breakpoint
-- Seed lab test reference ranges (US)
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'g/dL', '[{"min":0,"max":11.9,"status":"critical"},{"min":12,"max":16,"status":"optimal"},{"min":16.1,"max":20,"status":"suboptimal"},{"min":20.1,"max":100,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'HGB';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', '%', '[{"min":0,"max":36.9,"status":"critical"},{"min":37,"max":50,"status":"optimal"},{"min":50.1,"max":55,"status":"suboptimal"},{"min":55.1,"max":100,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'HCT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'million/μL', '[{"min":0,"max":4.19,"status":"suboptimal"},{"min":4.2,"max":5.9,"status":"optimal"},{"min":5.91,"max":10,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'RBC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', '/μL', '[{"min":0,"max":3999,"status":"suboptimal"},{"min":4000,"max":11000,"status":"optimal"},{"min":11001,"max":20000,"status":"suboptimal"},{"min":20001,"max":100000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'WBC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', '/μL', '[{"min":0,"max":149999,"status":"suboptimal"},{"min":150000,"max":450000,"status":"optimal"},{"min":450001,"max":1000000,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'PLT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'fL', '[{"min":0,"max":79,"status":"suboptimal"},{"min":80,"max":98,"status":"optimal"},{"min":99,"max":150,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'MCV';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'pg', '[{"min":0,"max":27,"status":"suboptimal"},{"min":28,"max":32,"status":"optimal"},{"min":33,"max":50,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'MCH';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'g/dL', '[{"min":0,"max":32,"status":"suboptimal"},{"min":33,"max":36,"status":"optimal"},{"min":37,"max":50,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'MCHC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', '%', '[{"min":0,"max":8.9,"status":"suboptimal"},{"min":9,"max":14.5,"status":"optimal"},{"min":14.6,"max":25,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'RDW';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mm/hr', '[{"min":0,"max":20,"status":"optimal"},{"min":21,"max":50,"status":"suboptimal"},{"min":51,"max":150,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'ESR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mEq/L', '[{"min":0,"max":129,"status":"critical"},{"min":130,"max":135,"status":"suboptimal"},{"min":136,"max":145,"status":"optimal"},{"min":146,"max":150,"status":"suboptimal"},{"min":151,"max":200,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'NA';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mEq/L', '[{"min":0,"max":3.4,"status":"critical"},{"min":3.5,"max":5,"status":"optimal"},{"min":5.1,"max":5.5,"status":"suboptimal"},{"min":5.6,"max":10,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'K';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mEq/L', '[{"min":0,"max":97,"status":"suboptimal"},{"min":98,"max":106,"status":"optimal"},{"min":107,"max":120,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'CL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mEq/L', '[{"min":0,"max":22,"status":"suboptimal"},{"min":23,"max":30,"status":"optimal"},{"min":31,"max":40,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'CO2';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":8.5,"status":"suboptimal"},{"min":8.6,"max":10.2,"status":"optimal"},{"min":10.3,"max":12,"status":"suboptimal"},{"min":12.1,"max":20,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'CA';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":1.5,"status":"suboptimal"},{"min":1.6,"max":2.6,"status":"optimal"},{"min":2.7,"max":5,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'MG';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":2.9,"status":"suboptimal"},{"min":3,"max":4.5,"status":"optimal"},{"min":4.6,"max":7,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'PHOS';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":7,"status":"suboptimal"},{"min":8,"max":20,"status":"optimal"},{"min":21,"max":50,"status":"suboptimal"},{"min":51,"max":200,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'BUN';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":0.49,"status":"suboptimal"},{"min":0.5,"max":1.3,"status":"optimal"},{"min":1.31,"max":3,"status":"suboptimal"},{"min":3.01,"max":20,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'CREAT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mL/min/1.73m²', '[{"min":0,"max":14,"status":"critical"},{"min":15,"max":59,"status":"suboptimal"},{"min":60,"max":200,"status":"optimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'EGFR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":9,"status":"suboptimal"},{"min":10,"max":40,"status":"optimal"},{"min":41,"max":100,"status":"suboptimal"},{"min":101,"max":1000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'ALT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":9,"status":"suboptimal"},{"min":10,"max":40,"status":"optimal"},{"min":41,"max":100,"status":"suboptimal"},{"min":101,"max":1000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'AST';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":29,"status":"suboptimal"},{"min":30,"max":120,"status":"optimal"},{"min":121,"max":300,"status":"suboptimal"},{"min":301,"max":1000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'ALP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":7,"status":"suboptimal"},{"min":8,"max":50,"status":"optimal"},{"min":51,"max":150,"status":"suboptimal"},{"min":151,"max":1000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'GGT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":1,"status":"optimal"},{"min":1.01,"max":2,"status":"suboptimal"},{"min":2.01,"max":20,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'TBIL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":0.3,"status":"optimal"},{"min":0.31,"max":1,"status":"suboptimal"},{"min":1.01,"max":20,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'DBIL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'g/dL', '[{"min":0,"max":3.4,"status":"suboptimal"},{"min":3.5,"max":5.5,"status":"optimal"},{"min":5.6,"max":8,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'ALB';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'g/dL', '[{"min":0,"max":5.4,"status":"suboptimal"},{"min":5.5,"max":9,"status":"optimal"},{"min":9.1,"max":15,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'TP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":69,"status":"critical"},{"min":70,"max":99,"status":"optimal"},{"min":100,"max":125,"status":"suboptimal"},{"min":126,"max":500,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'GLU';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', '%', '[{"min":0,"max":3.9,"status":"suboptimal"},{"min":4,"max":5.6,"status":"optimal"},{"min":5.7,"max":6.4,"status":"suboptimal"},{"min":6.5,"max":20,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'HBA1C';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":199,"status":"optimal"},{"min":200,"max":239,"status":"suboptimal"},{"min":240,"max":500,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'CHOL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":39,"status":"critical"},{"min":40,"max":59,"status":"suboptimal"},{"min":60,"max":200,"status":"optimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'HDL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":99,"status":"optimal"},{"min":100,"max":129,"status":"suboptimal"},{"min":130,"max":159,"status":"suboptimal"},{"min":160,"max":500,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'LDL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":149,"status":"optimal"},{"min":150,"max":199,"status":"suboptimal"},{"min":200,"max":499,"status":"suboptimal"},{"min":500,"max":2000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'TRIG';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'μU/mL', '[{"min":0,"max":0.49,"status":"suboptimal"},{"min":0.5,"max":4,"status":"optimal"},{"min":4.01,"max":10,"status":"suboptimal"},{"min":10.01,"max":100,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'TSH';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'ng/dL', '[{"min":0,"max":0.79,"status":"suboptimal"},{"min":0.8,"max":1.8,"status":"optimal"},{"min":1.81,"max":5,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'FT4';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'pg/mL', '[{"min":0,"max":2.2,"status":"suboptimal"},{"min":2.3,"max":4.2,"status":"optimal"},{"min":4.3,"max":10,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'FT3';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'μg/dL', '[{"min":0,"max":49,"status":"suboptimal"},{"min":50,"max":150,"status":"optimal"},{"min":151,"max":300,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'FE';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'ng/mL', '[{"min":0,"max":23,"status":"suboptimal"},{"min":24,"max":336,"status":"optimal"},{"min":337,"max":1000,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'FERR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'μg/dL', '[{"min":0,"max":249,"status":"suboptimal"},{"min":250,"max":310,"status":"optimal"},{"min":311,"max":500,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'TIBC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'ng/mL', '[{"min":0,"max":0.04,"status":"optimal"},{"min":0.041,"max":0.4,"status":"suboptimal"},{"min":0.41,"max":50,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'TROP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'pg/mL', '[{"min":0,"max":100,"status":"optimal"},{"min":101,"max":400,"status":"suboptimal"},{"min":401,"max":5000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'BNP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/L', '[{"min":0,"max":1,"status":"optimal"},{"min":1.01,"max":3,"status":"suboptimal"},{"min":3.01,"max":200,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'CRP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'ng/mL', '[{"min":0,"max":19,"status":"suboptimal"},{"min":20,"max":60,"status":"optimal"},{"min":61,"max":150,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'VITD';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'pg/mL', '[{"min":0,"max":199,"status":"suboptimal"},{"min":200,"max":800,"status":"optimal"},{"min":801,"max":2000,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'B12';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'ng/mL', '[{"min":0,"max":1.7,"status":"suboptimal"},{"min":1.8,"max":9,"status":"optimal"},{"min":9.01,"max":50,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'FOLATE';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'seconds', '[{"min":0,"max":10,"status":"suboptimal"},{"min":11,"max":13,"status":"optimal"},{"min":14,"max":30,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'PT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', '', '[{"min":0,"max":0.8,"status":"suboptimal"},{"min":0.9,"max":1.2,"status":"optimal"},{"min":1.21,"max":5,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'INR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'seconds', '[{"min":0,"max":24,"status":"suboptimal"},{"min":25,"max":35,"status":"optimal"},{"min":36,"max":100,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'APTT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'μg/mL', '[{"min":0,"max":0.5,"status":"optimal"},{"min":0.51,"max":2,"status":"suboptimal"},{"min":2.01,"max":50,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'DDIMER';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'mg/dL', '[{"min":0,"max":2.9,"status":"suboptimal"},{"min":3,"max":7,"status":"optimal"},{"min":7.01,"max":15,"status":"suboptimal"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'URIC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":79,"status":"suboptimal"},{"min":80,"max":225,"status":"optimal"},{"min":226,"max":500,"status":"suboptimal"},{"min":501,"max":2000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'LDH';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":24,"status":"suboptimal"},{"min":25,"max":125,"status":"optimal"},{"min":126,"max":500,"status":"suboptimal"},{"min":501,"max":2000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'AMY';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'US', 'U/L', '[{"min":0,"max":9,"status":"suboptimal"},{"min":10,"max":140,"status":"optimal"},{"min":141,"max":500,"status":"suboptimal"},{"min":501,"max":3000,"status":"critical"}]', 'ABIM 2026' FROM "lab_tests" WHERE code = 'LIPASE';
--> statement-breakpoint
-- Seed lab test reference ranges (CA)
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'g/L', '[{"min":0,"max":114,"status":"critical"},{"min":115,"max":170,"status":"optimal"},{"min":171,"max":200,"status":"suboptimal"},{"min":201,"max":300,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'HGB';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'L/L', '[{"min":0,"max":0.37,"status":"critical"},{"min":0.38,"max":0.5,"status":"optimal"},{"min":0.51,"max":0.55,"status":"suboptimal"},{"min":0.56,"max":1,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'HCT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', '× 10^12/L', '[{"min":0,"max":3.49,"status":"suboptimal"},{"min":3.5,"max":5.5,"status":"optimal"},{"min":5.51,"max":10,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'RBC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', '× 10^9/L', '[{"min":0,"max":3.4,"status":"suboptimal"},{"min":3.5,"max":10.5,"status":"optimal"},{"min":10.6,"max":20,"status":"suboptimal"},{"min":20.1,"max":100,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'WBC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', '× 10^9/L', '[{"min":0,"max":129,"status":"suboptimal"},{"min":130,"max":380,"status":"optimal"},{"min":381,"max":1000,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'PLT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'fL', '[{"min":0,"max":79,"status":"suboptimal"},{"min":80,"max":100,"status":"optimal"},{"min":101,"max":150,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'MCV';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'pg', '[{"min":0,"max":24,"status":"suboptimal"},{"min":25,"max":34,"status":"optimal"},{"min":35,"max":50,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'MCH';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'g/L', '[{"min":0,"max":314,"status":"suboptimal"},{"min":315,"max":355,"status":"optimal"},{"min":356,"max":400,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'MCHC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', '%', '[{"min":0,"max":11.4,"status":"suboptimal"},{"min":11.5,"max":15.5,"status":"optimal"},{"min":15.6,"max":25,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'RDW';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mm/h', '[{"min":0,"max":20,"status":"optimal"},{"min":21,"max":50,"status":"suboptimal"},{"min":51,"max":150,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'ESR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":129,"status":"critical"},{"min":130,"max":135,"status":"suboptimal"},{"min":136,"max":146,"status":"optimal"},{"min":147,"max":150,"status":"suboptimal"},{"min":151,"max":200,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'NA';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":3.4,"status":"critical"},{"min":3.5,"max":5.1,"status":"optimal"},{"min":5.2,"max":5.5,"status":"suboptimal"},{"min":5.6,"max":10,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'K';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":97,"status":"suboptimal"},{"min":98,"max":107,"status":"optimal"},{"min":108,"max":120,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'CL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":20,"status":"suboptimal"},{"min":21,"max":32,"status":"optimal"},{"min":33,"max":40,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'CO2';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":2.11,"status":"suboptimal"},{"min":2.12,"max":2.52,"status":"optimal"},{"min":2.53,"max":3,"status":"suboptimal"},{"min":3.01,"max":5,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'CA';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":0.73,"status":"suboptimal"},{"min":0.74,"max":1.03,"status":"optimal"},{"min":1.04,"max":2,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'MG';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":0.8,"status":"suboptimal"},{"min":0.81,"max":1.58,"status":"optimal"},{"min":1.59,"max":3,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'PHOS';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":2,"status":"suboptimal"},{"min":2.1,"max":8,"status":"optimal"},{"min":8.1,"max":20,"status":"suboptimal"},{"min":20.1,"max":100,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'BUN';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μmol/L', '[{"min":0,"max":21,"status":"suboptimal"},{"min":22,"max":93,"status":"optimal"},{"min":94,"max":200,"status":"suboptimal"},{"min":201,"max":1000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'CREAT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mL/min/1.73m²', '[{"min":0,"max":14,"status":"critical"},{"min":15,"max":59,"status":"suboptimal"},{"min":60,"max":200,"status":"optimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'EGFR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":16,"status":"suboptimal"},{"min":17,"max":63,"status":"optimal"},{"min":64,"max":200,"status":"suboptimal"},{"min":201,"max":1000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'ALT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":14,"status":"suboptimal"},{"min":15,"max":37,"status":"optimal"},{"min":38,"max":100,"status":"suboptimal"},{"min":101,"max":1000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'AST';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":49,"status":"suboptimal"},{"min":50,"max":136,"status":"optimal"},{"min":137,"max":300,"status":"suboptimal"},{"min":301,"max":1000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'ALP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":4,"status":"suboptimal"},{"min":5,"max":85,"status":"optimal"},{"min":86,"max":200,"status":"suboptimal"},{"min":201,"max":1000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'GGT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μmol/L', '[{"min":0,"max":17,"status":"optimal"},{"min":18,"max":34,"status":"suboptimal"},{"min":35,"max":400,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'TBIL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μmol/L', '[{"min":0,"max":9,"status":"optimal"},{"min":10,"max":20,"status":"suboptimal"},{"min":21,"max":400,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'DBIL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'g/L', '[{"min":0,"max":33,"status":"suboptimal"},{"min":34,"max":50,"status":"optimal"},{"min":51,"max":80,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'ALB';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'g/L', '[{"min":0,"max":64,"status":"suboptimal"},{"min":65,"max":83,"status":"optimal"},{"min":84,"max":120,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'TP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":3.9,"status":"critical"},{"min":4,"max":6,"status":"optimal"},{"min":6.1,"max":7,"status":"suboptimal"},{"min":7.1,"max":30,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'GLU';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', '%', '[{"min":0,"max":4.7,"status":"suboptimal"},{"min":4.8,"max":6,"status":"optimal"},{"min":6.1,"max":6.4,"status":"suboptimal"},{"min":6.5,"max":20,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'HBA1C';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":5.2,"status":"optimal"},{"min":5.21,"max":6.2,"status":"suboptimal"},{"min":6.21,"max":15,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'CHOL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":0.99,"status":"critical"},{"min":1,"max":1.29,"status":"suboptimal"},{"min":1.3,"max":5,"status":"optimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'HDL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":2,"status":"optimal"},{"min":2.01,"max":3.5,"status":"suboptimal"},{"min":3.51,"max":5,"status":"suboptimal"},{"min":5.01,"max":15,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'LDL';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mmol/L', '[{"min":0,"max":1.7,"status":"optimal"},{"min":1.71,"max":2.25,"status":"suboptimal"},{"min":2.26,"max":5.65,"status":"suboptimal"},{"min":5.66,"max":25,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'TRIG';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mIU/L', '[{"min":0,"max":0.33,"status":"suboptimal"},{"min":0.34,"max":5.6,"status":"optimal"},{"min":5.61,"max":10,"status":"suboptimal"},{"min":10.01,"max":100,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'TSH';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'pmol/L', '[{"min":0,"max":6.9,"status":"suboptimal"},{"min":7,"max":17,"status":"optimal"},{"min":17.01,"max":50,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'FT4';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'pmol/L', '[{"min":0,"max":3.2,"status":"suboptimal"},{"min":3.3,"max":6,"status":"optimal"},{"min":6.01,"max":15,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'FT3';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μmol/L', '[{"min":0,"max":8,"status":"suboptimal"},{"min":9,"max":31,"status":"optimal"},{"min":32,"max":60,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'FE';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μg/L', '[{"min":0,"max":10,"status":"suboptimal"},{"min":11,"max":336,"status":"optimal"},{"min":337,"max":1000,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'FERR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μmol/L', '[{"min":0,"max":44,"status":"suboptimal"},{"min":45,"max":81,"status":"optimal"},{"min":82,"max":120,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'TIBC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'ng/L', '[{"min":0,"max":45,"status":"optimal"},{"min":46,"max":100,"status":"suboptimal"},{"min":101,"max":50000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'TROP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'pg/mL', '[{"min":0,"max":50,"status":"optimal"},{"min":51,"max":300,"status":"suboptimal"},{"min":301,"max":5000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'BNP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'mg/L', '[{"min":0,"max":10,"status":"optimal"},{"min":10.01,"max":50,"status":"suboptimal"},{"min":50.01,"max":500,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'CRP';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'nmol/L', '[{"min":0,"max":74,"status":"suboptimal"},{"min":75,"max":250,"status":"optimal"},{"min":251,"max":400,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'VITD';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'pmol/L', '[{"min":0,"max":132,"status":"suboptimal"},{"min":133,"max":675,"status":"optimal"},{"min":676,"max":1500,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'B12';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'nmol/L', '[{"min":0,"max":9.9,"status":"suboptimal"},{"min":10,"max":45,"status":"optimal"},{"min":45.01,"max":100,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'FOLATE';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 's', '[{"min":0,"max":9,"status":"suboptimal"},{"min":10,"max":14,"status":"optimal"},{"min":15,"max":30,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'PT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', '', '[{"min":0,"max":0.8,"status":"suboptimal"},{"min":0.9,"max":1.2,"status":"optimal"},{"min":1.21,"max":5,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'INR';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 's', '[{"min":0,"max":21,"status":"suboptimal"},{"min":22,"max":30,"status":"optimal"},{"min":31,"max":100,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'APTT';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μg/L', '[{"min":0,"max":600,"status":"optimal"},{"min":601,"max":2000,"status":"suboptimal"},{"min":2001,"max":50000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'DDIMER';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'μmol/L', '[{"min":0,"max":154,"status":"suboptimal"},{"min":155,"max":400,"status":"optimal"},{"min":401,"max":800,"status":"suboptimal"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'URIC';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":99,"status":"suboptimal"},{"min":100,"max":205,"status":"optimal"},{"min":206,"max":500,"status":"suboptimal"},{"min":501,"max":2000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'LDH';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":24,"status":"suboptimal"},{"min":25,"max":115,"status":"optimal"},{"min":116,"max":500,"status":"suboptimal"},{"min":501,"max":2000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'AMY';
INSERT INTO "lab_test_reference_ranges" ("lab_test_id", "country", "unit", "ranges", "source")
SELECT id, 'CA', 'IU/L', '[{"min":0,"max":72,"status":"suboptimal"},{"min":73,"max":393,"status":"optimal"},{"min":394,"max":1000,"status":"suboptimal"},{"min":1001,"max":5000,"status":"critical"}]', 'MCC EORLA 2019' FROM "lab_tests" WHERE code = 'LIPASE';
