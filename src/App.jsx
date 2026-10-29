import React, { useState, useMemo, useCallback, useEffect, Fragment, Component } from "react";
import { ChevronLeft, ChevronDown, X, Check, Info, AlertTriangle, Search as SearchIcon } from "lucide-react";

/* ============================================================
   PsyCore — referência rápida de psicofarmacologia
   Dados extraídos da planilha do usuário (85 fármacos, 68 alvos)
   ============================================================ */

const DATA = {"receptorGroups":{"5-HT1A":"Serotoninérgicos","5-HT1B":"Serotoninérgicos","5-HT1D":"Serotoninérgicos","5-HT1E":"Serotoninérgicos","5-HT2A":"Serotoninérgicos","5-HT2B":"Serotoninérgicos","5-HT2C":"Serotoninérgicos","5-HT3":"Serotoninérgicos","5HT-4":"Serotoninérgicos","5HT-5":"Serotoninérgicos","5-HT6":"Serotoninérgicos","5-HT7":"Serotoninérgicos","D1":"Dopaminérgicos","D2":"Dopaminérgicos","D3":"Dopaminérgicos","D4":"Dopaminérgicos","D5":"Dopaminérgicos","SERT":"Transportadores","NAT":"Transportadores","DAT":"Transportadores","α1":"Adrenérgicos","α2":"Adrenérgicos","α2A":"Adrenérgicos","α2B":"Adrenérgicos","α2C":"Adrenérgicos","H1":"Histaminérgicos","H2":"Histaminérgicos","H3":"Histaminérgicos","M1":"Muscarínicos","M2":"Muscarínicos","M3":"Muscarínicos","M4":"Muscarínicos","M5":"Muscarínicos","MT1":"Melatoninérgicos","MT2":"Melatoninérgicos","MT3":"Melatoninérgicos","σ1":"Outros","NOS":"Outros","nAChR":"Outros","NMDA":"Outros","GABA-A":"Outros","GABA-T":"Outros","R- Adenosina A1":"Outros","Canal Na+":"Outros","Canal Ca2+":"Outros","Canal de K+":"Outros","GSK-3β":"Outros","IPPase":"Outros","IMPase":"Outros","HDAC":"Outros","HCN (Ih)":"Outros","Anidrase Carbônica":"Outros","Receptor Caianato":"Outros","κ-opioide":"Outros","μ-opioide":"Outros","δ-opioide":"Outros","OX1":"Outros","OX2":"Outros","GHB":"Outros","VMAT2":"Outros","TAAR1":"Outros","Imidazolina I (I1)":"Outros","AChE":"Outros","BuChE":"Outros","nAChR α4β2":"Outros","nAChR α7":"Outros","CB1":"Outros","CB2":"Outros","MAO-A":"Outros","MAO-B":"Outros"},"receptorOrder":["5-HT1A","5-HT1B","5-HT1D","5-HT1E","5-HT2A","5-HT2B","5-HT2C","5-HT3","5HT-4","5HT-5","5-HT6","5-HT7","D1","D2","D3","D4","D5","SERT","NAT","DAT","α1","α2","α2A","α2B","α2C","H1","H2","H3","M1","M2","M3","M4","M5","MT1","MT2","MT3","σ1","NOS","nAChR","NMDA","GABA-A","GABA-T","R- Adenosina A1","Canal Na+","Canal Ca2+","Canal de K+","GSK-3β","IPPase","IMPase","HDAC","HCN (Ih)","Anidrase Carbônica","Receptor Caianato","κ-opioide","μ-opioide","δ-opioide","OX1","OX2","GHB","VMAT2","TAAR1","Imidazolina I (I1)","AChE","BuChE","MAO-A","MAO-B","nAChR α4β2","nAChR α7","CB1","CB2"],"tipoLabels":{"ant":"Antagonista","agp":"Agonista parcial","agt":"Agonista total","mod":"Modulador alostérico","inib":"Inibidor (transportador)","outro":"Outro"},"drugs":[{"id":"agomelatina","nome":"Agomelatina","classe":"Melatoninérgico","nc":"Valdoxan","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C9","CYP2C19"],"tx":"Hepático — CYP1A2 (90%). Contraindicado com inibidores potentes de CYP1A2 (ex. fluvoxamina — risco de hepatotoxicidade). CYP2C9 e CYP2C19 (menores).","pc":{"CYP1A2":"~90%","CYP2C9":"menor parte","CYP2C19":"menor parte"}},"pos":{"mv":"~1-2h (droga-mãe); primeira passagem muito extensa","pos":"Inicial 25mg/dia (à noite); usual 25-50mg/dia; máximo 50mg/dia. CONTRAINDICADO com fluvoxamina","iv":"1x/dia (à noite)","ap":"Valdoxan (Servier) — comprimidos 25mg, caixas com 14/28/56"},"rx":[{"r":"5-HT2B","t":"ant","s":1,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"MT1","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — induz sono por inibição do núcleo supraquiasmático","ea":"—"},{"r":"MT2","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — regula transcrição genética para regularização do sono (atrasa a fase pela manhã, induz à noite)","ea":"—"}]},{"id":"alprazolam","nome":"Alprazolam","classe":"Benzodiazepínico","nc":"Frontal / Apraz","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Alta sensibilidade a inibidores de CYP3A4 (ex. azólicos, macrolídeos).","pc":{"CYP3A4":"via única"}},"pos":{"mv":"~11-15h","pos":"Ansiedade: 0,25-0,5mg 3x/dia; Pânico: inicial 0,5mg 3x/dia, usual 4-6mg/dia dividido; máximo 10mg/dia","iv":"3x/dia (ou 2x/dia para XR)","ap":"Frontal (Pfizer) — comprimidos 0,25/0,5/1/2mg; Frontal XR (liberação prolongada) 0,5/1/2mg. Apraz (Cosmed) — comprimidos 0,5/1/2mg. Genéricos 0,25/0,5/1/2mg"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"amilssulprida","nome":"Amilssulprida","classe":"Antipsicótico atípico (AP 2ª G)","nc":"Socian","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — hepático mínimo, 50% excretado inalterado (padrão típico das benzamidas).","vr":"Renal ~50% inalterado · hepático mínimo"},"pos":{"mv":"~12h (dose baixa) a ~17h (dose alta) — farmacocinética não-linear","pos":"Baixa dose (efeito antidepressivo/pré-sináptico): 50mg/dia. Alta dose (antipsicótico): 400-800mg/dia","iv":"1x/dia (baixa dose) ou 2x/dia (alta dose)","ap":"Socian (Sanofi Medley) — comprimidos 50mg e 200mg, caixas com 20"},"rx":[{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT7","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"}]},{"id":"amitriptilina","nome":"Amitriptilina","classe":"Tricíclico","nc":"Amytril / Mitrip / Protanol","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP2C19","CYP1A2","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP2C19/1A2/3A4 (metabólito ativo nortriptilina). Inibidor leve de CYP2D6.","pc":{"CYP2C19":"maior parte (desmetilação)","CYP2D6":"maior parte (hidroxilação)","CYP1A2":"menor parte","CYP3A4":"menor parte"}},"pos":{"mv":"~10-25h (droga-mãe); nortriptilina (metabólito) ~18-44h","pos":"Inicial 25-50mg/dia; usual 100-150mg/dia; máximo 300mg/dia (uso hospitalar)","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Amytril (Cristália) — comprimidos revestidos 10/25/75mg. Similares: Mitrip, Protanol. Genéricos 25/75mg"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":3,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"aripiprazol","nome":"Aripiprazol","classe":"Antipsicótico atípico","nc":"Aristab / Kavium / Arpejo / Toarip","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 (duplo; ajuste de dose por genótipo/inibidores, conforme bula). Metabólito ativo desidro-aripiprazol (potência semelhante).","pc":{"CYP3A4":"maior parte","CYP2D6":"maior parte"}},"pos":{"mv":"~75h (droga-mãe); metabólito ativo desidro-aripiprazol ~94h","pos":"Oral: inicial 10-15mg/dia; usual 10-30mg/dia; máximo 30mg/dia. Na apresentação em gotas (20mg/mL), 1 gota = 1mg — 10 gotas = 10mg, 15 gotas = 15mg.","iv":"1x/dia oral; mensal (LAI)","ap":"Aristab (Aché) — comprimidos 10/15/20/30mg; suspensão oral 1mg/mL, frascos 100/150mL. Kavium — comprimidos orodispersíveis. Arpejo (EMS) — comprimidos e solução oral (gotas) 20mg/mL, frascos 15/30mL (1 gota = 1mg). Similares: Toarip (Torrent), Harip (Prati), Biquiz (Supera), Sensaz (Cristália), Hedd (FQM), Aipri (Cosmed), Lazuc e Aquarela (Aché; Aquarela também em suspensão 1mg/mL). Genéricos 10/15/20/30mg"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":5,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT6","t":"ant","s":1,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D2","t":"agp","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"agp","s":2,"et":"Depressão bipolar; anedonia; sintomas negativos da esquizofrenia; possível efeito pró-cognitivo (D3 preferencial — cariprazina)","ea":"Sonolência, acatisia (menos proeminente que agonistas D2-preferenciais)"},{"r":"D4","t":"ant","s":1,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"asenapina","nome":"Asenapina","classe":"Antipsicótico atípico","nc":"Saphris — não comercializado","obs":null,"met":{"tp":"Hepático","en":["UGT1A4","CYP1A2"],"tx":"Hepático — UGT1A4 (~50%) + CYP1A2. Inibidor fraco-moderado de CYP2D6.","pc":{"UGT1A4":"~50%","CYP1A2":"maior parte do restante"}},"pos":{"mv":"~24h","pos":"5-10mg 2x/dia (sublingual); máximo 20mg/dia","iv":"2x/dia","ap":"Sem comercialização no Brasil"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":2,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":3,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":5,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5HT-5","t":"ant","s":3,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT6","t":"ant","s":4,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":5,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":4,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":5,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":5,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":4,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"atomoxetina","nome":"Atomoxetina","classe":"ISRN (não-estimulante)","nc":"Atentah","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","UGT","CYP2C19"],"tx":"Hepático — CYP2D6 (polimorfismo muito relevante: metabolizadores lentos têm exposição ~10x maior), CYP2C19 (menor). O metabólito 4-hidroxiatomoxetina é glicuronidado e é a forma de excreção predominante (urinária).","pc":{"CYP2D6":"maior parte","UGT":"conjugação do metabólito — forma de excreção","CYP2C19":"menor parte"}},"pos":{"mv":"~5h (mas o efeito farmacodinâmico dura mais, por ligação prolongada a NAT)","pos":"TDAH: inicial 40mg/dia (adultos) ou 0,5mg/kg/dia (crianças); titular após 3 dias; usual 80-100mg/dia; máximo 100mg/dia (adultos) ou 1,4mg/kg/dia (crianças)","iv":"1-2x/dia","ap":"Atentah (Apsen) — cápsulas 10/18/25/40/60/80/100mg, caixas com 30"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":5,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"blonanserona","nome":"Blonanserona","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Dados farmacocinéticos limitados (uso concentrado na Ásia).","pc":{"CYP3A4":"via única"}},"pos":{"mv":"~68-142h (variável, fármaco pouco caracterizado em população ocidental)","pos":"Inicial 4mg/dia; usual 8-16mg/dia; máximo 24mg/dia (dados de bula japonesa/coreana)","iv":"1-2x/dia","ap":"SEM REGISTRO NA ANVISA — uso concentrado no Japão e Coreia do Sul, não disponível no Brasil"},"rx":[{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"D2","t":"ant","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":5,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"α2A","t":"ant","s":2,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"}]},{"id":"brexanolona","nome":"Brexanolona","classe":"Esteroide Neuroativo","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["3α/3β-HSD","sulfotransferase"],"tx":"Hepático — vias não-CYP (3α/3β-hidroxiesteroide desidrogenases, sulfatação, glicuronidação — como esteroides endógenos).","pc":{"3α/3β-HSD":"maior parte","sulfotransferase":"menor parte"}},"pos":{"mv":"~9h","pos":"Depressão pós-parto grave: infusão IV contínua por 60h em ambiente hospitalar monitorado, dose ajustada por peso (protocolo específico)","iv":"Infusão única de 60h (uso hospitalar)","ap":"SEM COMERCIALIZAÇÃO NO BRASIL — Zulresso disponível apenas por importação pessoa física; via IV, não oral"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"Efeito ansiolítico/hipnótico intenso e rápido; uso aprovado para depressão pós-parto grave (modulação GABAérgica rápida e profunda)","ea":"Sedação intensa, tontura; risco de perda de consciência em infusão rápida — administração exige monitorização hospitalar controlada"}]},{"id":"brexpiprazol","nome":"Brexpiprazol","classe":"Antipsicótico atípico","nc":"Rexulti","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 (duplo, mesmo padrão do aripiprazol).","pc":{"CYP3A4":"maior parte","CYP2D6":"maior parte"}},"pos":{"mv":"~91h (mais longa da classe — 2-4 dias)","pos":"Inicial 0,5-1mg/dia (potencialização de antidepressivo) ou 1-2mg/dia (esquizofrenia); usual 1-3mg/dia (potencialização) ou 2-4mg/dia (esquizofrenia); máximo 4mg/dia","iv":"1x/dia","ap":"Rexulti (Lundbeck Brasil) — comprimidos 0,5/1/2/3mg, registrado na Anvisa"},"rx":[{"r":"5-HT1A","t":"agp","s":5,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":3,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":3,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":3,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"agp","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"agp","s":4,"et":"Depressão bipolar; anedonia; sintomas negativos da esquizofrenia; possível efeito pró-cognitivo (D3 preferencial — cariprazina)","ea":"Sonolência, acatisia (menos proeminente que agonistas D2-preferenciais)"},{"r":"D4","t":"ant","s":4,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":5,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2C","t":"ant","s":5,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"bromazepam","nome":"Bromazepam","classe":"Benzodiazepínico","nc":"Lexotan","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4 (hidroxilação) seguida de glicuronidação.","pc":{"CYP3A4":"maior parte (hidroxilação, seguida de glicuronidação)"}},"pos":{"mv":"~10-20h","pos":"Ansiedade: 3-6mg/dia, dividido; máximo 18mg/dia (uso hospitalar)","iv":"1-3x/dia","ap":"Lexotan (Roche) — comprimidos 3mg (caixas com 20/30) e 6mg (caixa com 30). Genéricos 3/6mg"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"bupropiona","nome":"Bupropiona","classe":"IRND","nc":"Wellbutrin XL / Bup / Zetron / Seth","obs":null,"met":{"tp":"Hepático","en":["CYP2B6"],"tx":"Hepático — CYP2B6 (metabólito ativo hidroxibupropiona, mais potente). Inibidor potente de CYP2D6 (ex.: reduz conversão de tamoxifeno em endoxifeno).","pc":{"CYP2B6":"maior parte"}},"pos":{"mv":"~21h (droga-mãe); hidroxibupropiona ~20h","pos":"Depressão: inicial 150mg/dia; usual 300mg/dia; máximo 450mg/dia (XL). Cessação tabágica: 150mg/dia por 3 dias, depois 150mg 2x/dia","iv":"1x/dia (XL) ou 2x/dia (SR)","ap":"Wellbutrin XL (GSK) — comprimidos XL 150/300mg. Bup (Eurofarma) — 150mg. Similares XL: Zetron, Bup XL, Buene, Alpes XL (Supera), Eutymia XL, Deradop XL, Bupium XL. Antitabagismo: Seth, Noradop, Bupium — 150mg. Genéricos 150mg"},"rx":[{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"nAChR","t":"ant","s":2,"et":"Contribui para a eficácia na cessação tabágica (reduz o reforço da nicotina) — mecanismo adicional da bupropiona além da inibição de NAT/DAT","ea":"Convulsões em dose alta (risco aumentado, contraindicado em epilepsia/transtornos alimentares)"}]},{"id":"buspirona","nome":"Buspirona","classe":"Ansiolítico não-BZD (azapirona)","nc":"Ansitec","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Alta sensibilidade a inibidores/indutores (ex. toranja, cetoconazol).","pc":{"CYP3A4":"via única"}},"pos":{"mv":"2-11h em média (variação individual ampla, 2-33h)","pos":"Inicial 5mg 2-3x/dia; titular a cada 2-3 dias; usual 20-30mg/dia; máximo 60mg/dia","iv":"2-3x/dia","ap":"Ansitec (Libbs) — comprimidos 5mg e 10mg, caixas com 20/60/90"},"rx":[{"r":"5-HT1A","t":"agp","s":3,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"D2","t":"agp","s":1,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":2,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"α1","t":"ant","s":1,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"}]},{"id":"carbamazepina","nome":"Carbamazepina","classe":"Anticonvulsivante","nc":"Tegretol","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","epóxido-hidrolase"],"tx":"Hepático — CYP3A4 (metabólito ativo carbamazepina-10,11-epóxido, depois via epóxido-hidrolase). Indutor potente de CYP3A4 (também CYP1A2, CYP2C9, CYP2C19 e UGT); autoindução nas primeiras semanas.","pc":{"CYP3A4":"maior parte","epóxido-hidrolase":"etapa seguinte — hidrólise do epóxido"},"vr":"CYP3A4 (oxidação) → epóxido-hidrolase (hidrólise do metabólito ativo)"},"pos":{"mv":"~12-17h (dose única); ~5-14h em uso crônico (autoindução do próprio metabolismo)","pos":"Estabilizador de humor/epilepsia: inicial 200mg/dia; titular; usual 600-1200mg/dia; monitorização de nível sérico disponível","iv":"2-4x/dia (ou 1-2x/dia para CR)","ap":"Tegretol (Novartis) — comprimidos 200/400mg; Tegretol CR (liberação controlada) 200/400mg; suspensão oral 20mg/mL (100mg/5mL), frasco 100mL. Genéricos, incl. suspensão"},"rx":[{"r":"R- Adenosina A1","t":"ant","s":1,"et":"Upregulation compensatória de receptores — menor excitabilidade em grandes ondas por mais receptores de um sinalizador inibitório; efeito antimaníaco e neuroprotetor hipotético","ea":"—"},{"r":"Canal Na+","t":"ant","s":4,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"},{"r":"Canal de K+","t":"ant","s":3,"et":"—","ea":"Alargamento do QT (hERG) — risco de arritmia, classe de efeito adverso, não terapêutico"}]},{"id":"cariprazina","nome":"Cariprazina","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 (principal), CYP2D6 (menor). Metabólito ativo DDCAR (potência semelhante, meia-vida de 1-3 semanas).","pc":{"CYP3A4":"maior parte","CYP2D6":"menor parte"}},"pos":{"mv":"2-4 dias (droga-mãe); metabólitos ativos (DCAR/DDCAR) 1-3 SEMANAS","pos":"Inicial 1,5mg/dia; usual 1,5-6mg/dia; máximo 6mg/dia","iv":"1x/dia","ap":"SEM COMERCIALIZAÇÃO REGULAR NO BRASIL — Reagila/Vraylar disponível apenas por importação (via empresas especializadas), sem previsão de registro Anvisa"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D2","t":"agp","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"agp","s":5,"et":"Depressão bipolar; anedonia; sintomas negativos da esquizofrenia; possível efeito pró-cognitivo (D3 preferencial — cariprazina)","ea":"Sonolência, acatisia (menos proeminente que agonistas D2-preferenciais)"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":2,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"α2A","t":"ant","s":2,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"centanafadina","nome":"Centanafadina","classe":"IRSND","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Outro/Indefinido","en":["CYP2D6","UGT"],"tx":"Aprovação recente — dados em consolidação; eliminação parcialmente renal com participação hepática (CYP2D6/UGT).","pc":{"CYP2D6":"participação parcial","UGT":"participação parcial"}},"pos":{"mv":"Dados de fase 3 (ainda não aprovado)","pos":"TDAH: doses estudadas em ensaios clínicos de fase 3 até 400mg/dia dividido — sem posologia comercial estabelecida, medicamento ainda não aprovado por nenhuma agência regulatória","iv":"2x/dia (estudos clínicos)","ap":"NÃO APROVADO PELA ANVISA (nem pelo FDA até o momento) — ainda em desenvolvimento clínico, não comercializado em nenhum país"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":5,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"cetamina-escetamina","nome":"Cetamina/Escetamina","classe":"Antagonista não competitivo do receptor NMDA","nc":"Spravato / Ketamin / Clortamina","obs":"R-cetamina (arcetamina) > S-cetamina (escetamina) em afinidade σ1","met":{"tp":"Hepático","en":["CYP3A4","CYP2B6","CYP2C9"],"tx":"Hepático — CYP3A4 e CYP2B6 (principais), CYP2C9 (menor). Metabólitos ativos: norcetamina (1/3-1/5 da potência no NMDA) e HNK (mecanismo distinto, sem efeito dissociativo).","pc":{"CYP3A4":"maior parte","CYP2B6":"maior parte","CYP2C9":"menor parte"}},"pos":{"mv":"Cetamina IV: ~2-3h; Escetamina intranasal: ~7-12h","pos":"Escetamina (Spravato) intranasal: 56mg dose inicial, depois 56-84mg 2x/semana (indução, sem. 1-4), depois semanal/quinzenal (manutenção). Cetamina IV (off-label): ~0,5mg/kg em infusão de 40min","iv":"Escetamina: 2x/semana (indução) → semanal/quinzenal (manutenção)","ap":"Spravato (Janssen) — escetamina spray nasal 28mg/dispositivo (2 jatos), uso em serviço de saúde. Ketamin e Ketamin NP (Cristália) — escetamina injetável 50mg/mL, frasco-ampola 10mL ou ampola 2mL. Clortamina (Biochimico) — cetamina racêmica injetável 50mg/mL, frasco-ampola 10mL. Injetáveis de uso hospitalar"},"rx":[{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":2,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"σ1","t":"agp","s":1,"et":"Contribuição para efeito dissociativo/neuroplástico, mecanismo secundário ao antagonismo NMDA (cetamina)","ea":"Mesmo perfil do agonismo total, não caracterizado isoladamente"},{"r":"NMDA","t":"ant","s":5,"et":"Antidepressivo (incluindo efeito antissuicida rápido — cetamina/escetamina); neuroproteção","ea":"Dissociação; hipertensão; náuseas; risco de abuso (cetamina)"},{"r":"κ-opioide","t":"agp","s":1,"et":"Analgesia","ea":"Disforia; alucinações em doses altas"},{"r":"μ-opioide","t":"agp","s":2,"et":"Analgesia potente (referência de classe, fora do escopo desta planilha de psicofármacos)","ea":"Depressão respiratória, dependência, constipação, sedação"}]},{"id":"citalopram","nome":"Citalopram","classe":"ISRS","nc":"Cipramil / Denyl / Citta","obs":null,"met":{"tp":"Hepático","en":["CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP2C19 e CYP3A4 (principais), CYP2D6 (menor).","pc":{"CYP2C19":"maior parte","CYP3A4":"maior parte","CYP2D6":"menor parte"}},"pos":{"mv":"~35h","pos":"Inicial 20mg/dia; usual 20-40mg/dia; máximo 40mg/dia (redução de dose acima de 60 anos, risco de prolongamento de QT)","iv":"1x/dia","ap":"Cipramil (Lundbeck) — comprimidos 20mg, caixas com 14/28. Similares: Denyl (Cristália), Citta (Eurofarma), Città (Momenta), Nypram (Prati). Genéricos 20/40mg. Sem solução oral no Brasil"},"rx":[{"r":"SERT","t":"ant","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"H1","t":"outro","s":1,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"clobazam","nome":"Clobazam","classe":"Benzodiazepínico","nc":"Frisium / Urbanil","obs":"Único 1,5-benzodiazepínico desta lista (os demais — diazepam, clonazepam, alprazolam, lorazepam, bromazepam — são 1,4-benzodiazepínicos). Clobazam e seu metabólito ativo norclobazam têm afinidade maior por complexos GABA-A α2 do que α1 — proposto como explicação para a menor sedação e prejuízo psicomotor em doses equivalentes. Aprovado como adjuvante anticonvulsivante (inclusive na síndrome de Lennox-Gastaut) além do uso ansiolítico.","met":{"tp":"Hepático","en":["CYP3A4","CYP2C19"],"tx":"Duas vias hepáticas relevantes: cerca de 2/3 da dose sofre N-desmetilação via CYP3A4, formando o metabólito ativo N-desmetilclobazam (norclobazam) — de alta potência anticonvulsivante e meia-vida muito mais longa que a droga-mãe. O clobazam remanescente, e o próprio norclobazam, são inativados por hidroxilação predominantemente via CYP2C19 (com participação menor de CYP2C18). Metabolizadores lentos de CYP2C19 (mais frequentes em populações asiáticas, ~35%) acumulam norclobazam significativamente mais — cautela nesses casos. É fraco inibidor de CYP2D6.","pc":{"CYP3A4":"~2/3 da dose (N-desmetilação)","CYP2C19":"inativação por hidroxilação"}},"pos":{"mv":"~10-30h (clobazam, média ~18h) + norclobazam (metabólito ativo) ~36-82h — efeito sustentado mesmo após a droga-mãe ser eliminada","pos":"Ansiedade (adultos e adolescentes >15 anos): dose inicial 20mg/dia, podendo ser aumentada conforme resposta; doses de até 30mg podem ser administradas em dose única à noite. Epilepsia (adjuvante): dose ajustada por peso corporal, com titulação gradual conforme protocolo.","iv":"1x/dia (à noite) ou dividido 2x/dia com maior concentração à noite","ap":"Frisium e Urbanil (Sanofi Medley) — comprimidos 10mg e 20mg"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"α2,α3 — ansiolítico e miorrelaxante, com afinidade preferencial por α2 sobre α1 (diferencial frente às 1,4-benzodiazepínicas); α1 — hipnótico e anticonvulsivante; efeito sustentado pela meia-vida longa do norclobazam; aprovado como adjuvante em epilepsia refratária, incluindo síndrome de Lennox-Gastaut.","ea":"Tolerância; dependência; risco de quedas; sedação — relatada como potencialmente menos intensa que outras benzodiazepinas em doses equivalentes, atribuída à maior seletividade α2 sobre α1; prejuízo de memória (α1); potencializa efeitos do álcool; risco de acúmulo/toxicidade por norclobazam em metabolizadores lentos de CYP2C19."}]},{"id":"clomipramina","nome":"Clomipramina","classe":"Tricíclico","nc":"Anafranil / Clo","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP1A2, CYP2C19 e CYP3A4 (metabólito ativo desmetilclomipramina, mais noradrenérgico) + CYP2D6. Inibidor leve de CYP2D6.","pc":{"CYP2C19":"maior parte (desmetilação)","CYP2D6":"maior parte (hidroxilação)","CYP1A2":"menor parte","CYP3A4":"menor parte"}},"pos":{"mv":"~19-37h","pos":"Inicial 25mg/dia; usual 100-150mg/dia; máximo 250mg/dia (oral) — protocolo IV disponível para TOC refratário em alguns serviços","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Anafranil (Sandoz) — comprimidos revestidos 25mg; Anafranil SR (liberação prolongada) 75mg. Clo (EMS) — 10/25/75mg. Genéricos"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":3,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"clonazepam","nome":"Clonazepam","classe":"Benzodiazepínico","nc":"Rivotril / Clopam","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","NAT2"],"tx":"Hepático — nitrorredução a 7-amino-clonazepam é a via principal e é catalisada por enzimas CYP3A (CYP3A4). O 7-amino-clonazepam é então N-acetilado pela NAT2, que é polimórfica: acetiladores lentos com CYP3A4 normal/alto acumulam 7-amino-clonazepam (razão ~2x maior). Hidroxilação a 3-hidroxi é via menor.","pc":{"CYP3A4":"maior parte (nitrorredução)","NAT2":"etapa seguinte — N-acetilação (polimórfica)"}},"pos":{"mv":"~30-40h","pos":"Ansiedade: 0,25-2mg 2-3x/dia. Pânico: até 4mg/dia. Máximo 20mg/dia (situações especiais)","iv":"2-3x/dia","ap":"Rivotril (Roche) — comprimidos 0,5/2mg; sublingual 0,25mg; solução oral (gotas) 2,5mg/mL, frasco 20mL (1 gota = 0,1mg). Similares: Clopam (Cristália), Zilepam, Epileptil, Uni-Clonazepax. Genéricos, incl. sublingual 0,25mg e gotas"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"clonidina","nome":"Clonidina","classe":"Alfa 2 agonista","nc":"Atensina / Clonidin","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático parcial (50%, via CYP2D6) + renal do restante (40-60%, inalterado).","pc":{"CYP2D6":"~50% da dose"},"vr":"Hepático 50% (CYP2D6) · renal 40-60% inalterado"},"pos":{"mv":"~12-16h","pos":"Hipertensão/TDAH (off-label)/Tourette: inicial 0,1mg 2x/dia; titular; usual 0,2-0,6mg/dia dividido; máximo 2,4mg/dia (hipertensão)","iv":"2-3x/dia (ou 1x/semana para adesivo transdérmico)","ap":"Atensina — comprimidos 0,100mg e 0,150mg, caixas com 30. Clonidin (Cristália) — injetável 150mcg/mL, ampola 1mL (uso anestésico/hospitalar). Sem adesivo transdérmico no Brasil"},"rx":[{"r":"α2A","t":"agp","s":5,"et":"Melhora da cognição e do comportamento no TDAH — ação pós-sináptica no córtex pré-frontal (fortalece conexões dendríticas em sinais de baixa intensidade); subtipo mais seletivamente visado pela guanfacina","ea":"Sedação leve, hipotensão, bradicardia"},{"r":"α2B","t":"agp","s":4,"et":"Sedação (redução da atividade simpática) — subtipo mais associado ao efeito sedativo/hipnótico da clonidina","ea":"Sonolência excessiva, hipotensão"},{"r":"α2C","t":"agp","s":4,"et":"Modulação de catecolaminas (reduz liberação); potencializa sedação; possível papel em impulsividade","ea":"Potencializa sedação e hipotensão dos demais subtipos"},{"r":"Imidazolina I (I1)","t":"agp","s":5,"et":"Hipotensão; sedação (contribui para o efeito da clonidina, distinto do efeito α2)","ea":"Mesmo perfil do agonismo α2 — sedação, hipotensão"}]},{"id":"clorpromazina","nome":"Clorpromazina","classe":"Fenotiazinas (AP 1ºG)","nc":"Amplictil / Longactil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP1A2","CYP3A4"],"tx":"Hepático — múltiplas vias (CYP2D6, CYP1A2, CYP3A4 + glicuronidação/sulfatação; >10 metabólitos). Inibidor leve de CYP2D6.","pc":{"CYP2D6":"maior parte","CYP1A2":"menor parte","CYP3A4":"menor parte"}},"pos":{"mv":"~30h","pos":"Baixa dose (sedação/ansiedade): 25-100mg/dia. Alta dose (psicose): 300-800mg/dia; máximo 1000mg/dia","iv":"1-3x/dia","ap":"Amplictil (Sanofi) — comprimidos 25/100mg; solução oral (gotas) 40mg/mL, frasco 20mL (1 gota = 1mg). Longactil (Cristália) — comprimidos 25/100mg; solução oral 40mg/mL; injetável 5mg/mL, ampola 5mL (25mg), uso IM. Genéricos"},"rx":[{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":2,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D5","t":"ant","s":1,"et":"Papel clínico independente não caracterizado (geralmente coocupado com D1)","ea":"Não caracterizado isoladamente"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":1,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M3","t":"ant","s":2,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":2,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"},{"r":"M5","t":"ant","s":2,"et":"Papel clínico independente pouco caracterizado — geralmente coocupado com M1 em antipsicóticos de perfil pan-muscarínico (clozapina, olanzapina, haloperidol, flufenazina, clorpromazina)","ea":"Contribui de forma pouco específica ao perfil anticolinérgico geral"}]},{"id":"clozapina","nome":"Clozapina","classe":"Antipsicótico atípico","nc":"Leponex / Pinazan / Okótico","obs":" Metabólito norclozapina: Ag.Parc. M4 (hipersalivação)","met":{"tp":"Hepático","en":["CYP1A2","CYP3A4","CYP2D6","UGT1A4","UGT1A1"],"tx":"Hepático — CYP1A2 (principal; tabagismo induz CYP1A2 e reduz níveis), CYP3A4 e CYP2D6 (menores). Glicuronidação relevante em paralelo (UGT1A4 e UGT1A1): os glucuronídeos de clozapina e norclozapina somam 33-38% dos metabólitos recuperados.","pc":{"CYP1A2":"maior parte","CYP3A4":"menor parte","CYP2D6":"menor parte","UGT1A4":"glicuronidação — 33-38% dos metabólitos","UGT1A1":"glicuronidação — 33-38% dos metabólitos"},"vr":"CYP (1A2 > 3A4/2D6) · glicuronidação 33-38% dos metabólitos recuperados"},"pos":{"mv":"~12h (8-16h)","pos":"Inicial 12,5mg 1-2x/dia; titular lentamente; usual 300-450mg/dia; máximo 900mg/dia","iv":"2-3x/dia (maior parte à noite)","ap":"Leponex (Viatris) — comprimidos 25mg (caixa com 20) e 100mg (caixa com 30). Similares: Pinazan (Cristália) e Okótico (Supera) — 25/100mg"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":3,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT6","t":"ant","s":3,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":1,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":1,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":2,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":4,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":4,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":1,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"M3","t":"ant","s":3,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":2,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"}]},{"id":"desvenlafaxina","nome":"Desvenlafaxina","classe":"IRSN","nc":"Pristiq / Desenvo / Elifore / Afax","obs":"Diferente da venlafaxina: perfil SERT:NAT próximo de 1:1 (levemente NAT-preferencial em alguns estudos de ocupação PET) — IRSN mais \"balanceado\"","met":{"tp":"Hepático","en":["UGT","CYP3A4"],"tx":"Hepático — UGT (não-CYP, principal) + CYP3A4 (menor). Menos dependente de CYP que a venlafaxina.","pc":{"UGT":"maior parte","CYP3A4":"menor parte"}},"pos":{"mv":"~11h","pos":"Inicial 50mg/dia; usual 50mg/dia (a maioria não se beneficia de doses maiores); máximo 100mg/dia","iv":"1x/dia","ap":"Pristiq (Pfizer) — comprimidos de liberação prolongada 50/100mg. Similares: Elifore (Pfizer), Desenvo (Aché), Afax (Prati). Genéricos 50/100mg"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"dexmedetomidina","nome":"Dexmedetomidina","classe":"Alfa 2 agonista","nc":"Precedex; genéricos","obs":"Uso exclusivamente hospitalar, via IV contínua controlada — não existe apresentação oral (alta taxa de extração hepática de primeira passagem).","met":{"tp":"Hepático","en":["UGT2B10","UGT1A4","CYP2A6"],"tx":"Biotransformação hepática extensa e quase completa (>95% do fármaco) — glucuronidação direta via UGT2B10/UGT1A4 e hidroxilação via CYP2A6, gerando metabólitos inativos. Alta taxa de extração hepática (~0,7). Depuração reduzida em hepatopatia (leve: 74%; moderada: 64%; grave: 53% do normal), prolongando a meia-vida efetiva.","pc":{"UGT2B10":"maior parte","UGT1A4":"maior parte","CYP2A6":"menor parte"}},"pos":{"mv":"~2h (1,7-3,3h) — meia-vida contextual aumenta com a duração da infusão","pos":"Sedação em UTI: ataque opcional de 1mcg/kg em 10min + manutenção 0,2-0,7mcg/kg/h (até 1,4mcg/kg/h em alguns protocolos), titulada pelo escore de sedação (RASS 0 a -3). Sedação processual: ataque de 1mcg/kg em 10min + manutenção 0,6mcg/kg/h (faixa 0,2-1mcg/kg/h).","iv":"Infusão IV contínua controlada — bolus rápido contraindicado","ap":"Uso hospitalar exclusivo — Precedex (Pfizer) e genéricos: frasco-ampola 2mL = 200mcg (100mcg/mL); diluir antes da infusão"},"rx":[{"r":"α2A","t":"agt","s":6,"et":"Sedação que mimetiza sono fisiológico (ação no locus coeruleus, ↓ liberação de noradrenalina), sem depressão respiratória significativa nas doses habituais; efeito analgésico adjuvante e ansiolítico. Atividade intrínseca ~3x maior e afinidade ~8-10x maior que a clonidina — agonista total (não parcial).","ea":"Hipotensão e bradicardia, mais pronunciadas que com clonidina pela maior potência/seletividade; pode evoluir a bloqueio cardíaco em bolus rápido ou dose excessiva."},{"r":"α2B","t":"agt","s":6,"et":"Contribui para o efeito sedativo central e para vasoconstrição periférica.","ea":"Em bolus rápido ou dose alta, ativação periférica de α2B (e, secundariamente, de α1) pode causar hipertensão transitória paradoxal antes de predominar o efeito hipotensor central — por isso bolus rápido é contraindicado."},{"r":"α2C","t":"agt","s":6,"et":"Modulação da liberação de catecolaminas; possível contribuição ansiolítica.","ea":"Potencializa a sedação e a hipotensão associadas aos demais subtipos α2."}]},{"id":"diazepam","nome":"Diazepam","classe":"Benzodiazepínico","nc":"Valium / Dienpax / Compaz","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2C19"],"tx":"Hepático — CYP3A4 e CYP2C19. Metabólitos ativos em cascata: nordiazepam → temazepam → oxazepam (meia-vida longa, duração de ação prolongada).","pc":{"CYP3A4":"maior parte","CYP2C19":"maior parte"}},"pos":{"mv":"~20-100h (droga-mãe + metabólitos ativos em cascata — duração muito prolongada)","pos":"Ansiedade: 5-10mg 2-4x/dia, máximo 40mg/dia. Abstinência alcoólica: doses maiores sob protocolo hospitalar","iv":"2-4x/dia (ou dose única à noite em uso crônico)","ap":"Valium (Roche) — comprimidos 5/10mg. Dienpax (Sanofi) — 10mg. Uni-Diazepax (União Química). Genéricos 5/10mg. Injetável 5mg/mL, ampola 2mL (10mg), uso IM/EV: Compaz (Cristália) e genéricos hospitalares. Sem solução oral/gotas no Brasil"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"donepezila","nome":"Donepezila","classe":"Inibidor AChE","nc":"Eranz / Lábrea / Epéz / Don","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP3A4 + glicuronidação.","pc":{"CYP2D6":"maior parte","CYP3A4":"maior parte"}},"pos":{"mv":"~70h","pos":"Alzheimer leve-moderado: inicial 5mg/dia (à noite); após 4-6 semanas pode titular para 10mg/dia; Alzheimer moderado-grave: pode titular para 23mg/dia","iv":"1x/dia (à noite)","ap":"Eranz (Wyeth/Pfizer) — comprimidos 5/10mg, caixas com 28. Similares: Lábrea (Cristália), Epéz (Torrent), Don (Eurofarma), Senes (Supera) — 5/10mg. Genéricos 5/10mg"},"rx":[{"r":"σ1","t":"agt","s":6,"et":"Neuroproteção; neurogênese; possível efeito antipsicótico em depressão psicótica; potencial ansiolítico/antidepressivo adicional (fluvoxamina, fluoxetina, escitalopram)","ea":"Efeitos adversos específicos do σ1 pouco caracterizados isoladamente em humanos — a maior parte dos dados é pré-clínica"},{"r":"AChE","t":"ant","s":4,"et":"Aumento da ACh → melhora da função cognitiva e da memória","ea":"Relaxamento de esfíncter; diarreia; aumento de secreções (sudorese, sialorreia); bradicardia"}]},{"id":"doxepina","nome":"Doxepina","classe":"Tricíclico","nc":"Só tem sob manipulação","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP2C19"],"tx":"Hepático — CYP2D6 e CYP2C19. Inibidor leve de CYP2D6.","pc":{"CYP2D6":"maior parte","CYP2C19":"maior parte"}},"pos":{"mv":"~8-24h","pos":"Inicial 25-75mg/dia; usual 75-150mg/dia; máximo 300mg/dia. Em dose baixa (3-6mg), uso off-label específico para insônia","iv":"1x/dia (à noite)","ap":"SEM APRESENTAÇÃO COMERCIAL REGULAR NO BRASIL — disponível majoritariamente via manipulação (farmácia de manipulação), não como especialidade farmacêutica industrializada"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":2,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"duloxetina","nome":"Duloxetina","classe":"IRSN","nc":"Cymbalta / Velija / Cymbi","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2D6"],"tx":"Hepático — CYP1A2 (principal) e CYP2D6 (menor). Tabagismo induz CYP1A2 (↓ níveis); fluvoxamina ↑ muito os níveis. Inibidor moderado de CYP2D6.","pc":{"CYP1A2":"maior parte","CYP2D6":"menor parte"}},"pos":{"mv":"~12h","pos":"Depressão/dor neuropática: inicial 30-60mg/dia; usual 60mg/dia; máximo 120mg/dia","iv":"1x/dia","ap":"Cymbalta (Lilly) — cápsulas 30/60mg. Similares: Velija (Libbs), Cymbi (EMS), Deprasil (Cristália), Abretia (FQM), Dual, Sympta, Neulox, Duatlo, Leduo, Mydulo, Dullo, Duxxen. Genéricos 30/60mg"},"rx":[{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"escitalopram","nome":"Escitalopram","classe":"ISRS","nc":"Lexapro / Exodus / Esc","obs":null,"met":{"tp":"Hepático","en":["CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP2C19 (principal), CYP3A4 e CYP2D6 (menores). Inibidor fraco-moderado de CYP2D6.","pc":{"CYP2C19":"maior parte","CYP3A4":"menor parte","CYP2D6":"menor parte"}},"pos":{"mv":"~27-32h","pos":"Inicial 10mg/dia; usual 10-20mg/dia; máximo 20mg/dia","iv":"1x/dia","ap":"Lexapro (Lundbeck) — comprimidos 10/15/20mg; solução oral (gotas) 20mg/mL, frasco 15mL (1 gota = 1mg). Esc ODT (Eurofarma) — orodispersível 5/10/15/20mg. Similares: Exodus e Fusor (Aché), Espran (Torrent), Reconter, Mind, Escena, Eudok, Escilex, Deciprax, Lexaprass, Esc. Genéricos, incl. gotas"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"}]},{"id":"eszopiclona","nome":"Eszopiclona","classe":"Fármaco Z","nc":"Prysma","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2E1"],"tx":"Hepático — CYP3A4 e CYP2E1 (menor).","pc":{"CYP3A4":"maior parte","CYP2E1":"menor parte"}},"pos":{"mv":"~6h","pos":"Insônia: 1-3mg imediatamente antes de deitar; máximo 3mg/dia","iv":"1x/dia (ao deitar)","ap":"Prysma (Eurofarma) — comprimidos 1/2/3mg. Genérico (Eurofarma) 2/3mg"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"Efeito hipnótico com menor efeito ansiolítico/miorrelaxante que os BZDs clássicos (seletividade α1 — zolpidem/zaleplona); eszopiclona menos seletiva, mais próxima do perfil clássico","ea":"Sonolência residual, amnésia anterógrada em dose alta, parassonias (sonambulismo)"}]},{"id":"fenitoina","nome":"Fenitoína","classe":"Anticonvulsivante","nc":"Hidantal / Fenital","obs":null,"met":{"tp":"Hepático","en":["CYP2C9","CYP2C19","UGT"],"pc":{"CYP2C9":"~90% da p-hidroxilação","CYP2C19":"menor parte — ganha peso em nível alto, quando a CYP2C9 satura","UGT":"conjugação do HPPH — forma de excreção"},"vr":"CYP2C9/CYP2C19 (p-hidroxilação SATURÁVEL) → glicuronidação do HPPH · <5% excretado inalterado","tx":"Hepático — p-hidroxilação a HPPH (5-(4-hidroxifenil)-5-fenil-hidantoína), ~90% por CYP2C9 e o restante por CYP2C19; o HPPH é então glicuronidado e excretado (menos de 5% da dose sai inalterada). A hidroxilação é SATURÁVEL: a cinética é de Michaelis-Menten, não de primeira ordem — perto da faixa terapêutica alta, um pequeno aumento de dose eleva o nível sérico e a meia-vida de forma desproporcional, com risco de intoxicação. Metabolizadores lentos de CYP2C9 precisam de redução de 50% da dose de manutenção (25% nos intermediários), conforme a diretriz do CPIC. É altamente ligada à albumina (~90%), o que torna o nível total enganoso em hipoalbuminemia — nesses casos o que importa é a fração livre. Indutor enzimático potente: CYP2B6 e CYP3A4 (forte), CYP1A2 e CYP2A6 (moderado), subfamília CYP2C (leve a moderado) e várias UGT."},"pos":{"mv":"~22h em média (7-42h) — a meia-vida AUMENTA com a dose, por saturação da hidroxilação; equilíbrio em 7-10 dias com 300mg/dia","pos":"Adulto: 100mg 3x/dia; manutenção usual 300-400mg/dia; máximo 600mg/dia. Estado epiléptico: ataque 10-15mg/kg IV a no máximo 50mg/min, seguido de 100mg VO ou IV a cada 6-8h. Pediatria: 5mg/kg/dia em 2-3 tomadas (máx 300mg/dia); manutenção 4-8mg/kg/dia; acima de 6 anos pode precisar da dose mínima do adulto (300mg/dia). Idoso: iniciar 3mg/kg/dia fracionado. Obesidade: dose de ataque pelo peso ideal + 1,33x o excesso. Nível sérico 10-20 mcg/mL. Hipoalbuminemia ou insuficiência renal/hepática: dosar a fração livre ou corrigir o nível total. Titular SEMPRE em incrementos pequenos acima de 300mg/dia, pela cinética saturável.","iv":"2-3x/dia","ap":"Hidantal (Sanofi) — comprimidos 100mg, caixa com 25. Fenital (Cristália) — comprimidos 100mg; injetável 50mg/mL, ampola 5mL (250mg), uso EV/IM. Genéricos"},"rx":[{"r":"Canal Na+","t":"ant","s":5,"et":"Bloqueio uso-dependente do canal de sódio voltagem-dependente — estabiliza o canal no estado inativado, de modo que quanto mais rápido o disparo neuronal, maior o bloqueio. É o mecanismo definidor da fenitoína: suprime a descarga repetitiva sustentada da crise sem deprimir a transmissão normal.","ea":"Nistagmo, ataxia e disartria em nível acima de 20 mcg/mL (sinais clássicos de intoxicação, nessa ordem); em infusão IV rápida — hipotensão, bradicardia e arritmia"},{"r":"Canal Ca2+","t":"ant","s":2,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"fenobarbital","nome":"Fenobarbital","classe":"Anticonvulsivante (barbitúrico)","nc":"Gardenal; Fenocris","obs":null,"met":{"tp":"Hepático","en":["CYP2C9","CYP2C19","CYP2E1","UGT"],"pc":{"CYP2C9":"maior parte (p-hidroxilação)","CYP2C19":"menor parte","CYP2E1":"menor parte","UGT":"conjugação dos metabólitos e N-glicosidação"},"vr":"Hepático 50-75% (p-hidroxilação + conjugação) · renal 25-50% excretado inalterado","tx":"Hepático — p-hidroxilação principalmente por CYP2C9, com CYP2C19 e CYP2E1 menores, seguida de conjugação (glicuronídeos e N-glicosídeo). Fração relevante sai inalterada pela urina (25-50%), o que torna a depuração parcialmente dependente da função renal e do pH urinário (alcalinização acelera a eliminação — base do manejo da intoxicação). Ligação proteica baixa para a classe (40-60%). É um dos indutores enzimáticos mais potentes da psicofarmacologia: induz fortemente CYP2B6 e CYP3A4, moderadamente CYP1A2 e CYP2A6, fracamente a subfamília CYP2C e CYP2E1, além de UGT e glicoproteína-P. A indução leva 2-3 semanas para se instalar e outras 2-4 semanas para regredir após a suspensão."},"pos":{"mv":"~79h em média (53-118h) — muito longa; estado de equilíbrio só em 2-3 semanas","pos":"Epilepsia (adulto): 2-3 mg/kg/dia VO, dose única ou fracionada — a bula orienta avaliar eficácia e ajuste somente após 15 dias. Pediatria: 3-4 mg/kg/dia VO. Crise aguda: 30-120mg IM/IV, repetir conforme necessidade, máximo 400mg/24h. Estado epiléptico: 200-320mg IV no adulto (repetir a cada 6h se necessário) ou 15-20mg/kg IV em 10-15min na pediatria; infusão lenta, <60mg/min. Nível sérico anticonvulsivante 15-30 mg/L (adulto). ClCr<10mL/min: espaçar o intervalo para 12-16h; hemodiálise exige dose suplementar. Reduzir em idoso e hepatopata.","iv":"1-2x/dia (VO); a cada 6h se necessário na crise (IV/IM)","ap":"Gardenal (Sanofi Medley) — comprimidos 50mg e 100mg, embalagem com 20. Gardenal 4% — solução oral em gotas 40mg/mL, frasco 20mL (1 gota = 1mg), uso pediátrico. Fenocris (Cristália) — solução injetável 100mg/mL, ampolas de 2mL (200mg por ampola), embalagens com 25 e 50"},"rx":[{"r":"GABA-A","t":"mod","s":5,"et":"Modulação alostérica positiva no sítio dos barbitúricos — PROLONGA o tempo de abertura do canal de cloro (diferente dos benzodiazepínicos, que aumentam a FREQUÊNCIA de abertura). Em concentração alta abre o canal diretamente, sem precisar de GABA: é isso que dá teto de eficácia maior na crise refratária, e também o que explica o risco de depressão respiratória.","ea":"Sedação, lentificação cognitiva e prejuízo de atenção/memória; depressão respiratória dose-dependente (sem teto, ao contrário dos benzodiazepínicos); tolerância e dependência; potencialização grave com álcool e outros depressores; em criança e idoso pode cursar com agitação paradoxal."},{"r":"Receptor Caianato","t":"ant","s":3,"et":"Antagonismo dos receptores glutamatérgicos AMPA/caianato — reduz a neurotransmissão excitatória por um mecanismo independente do GABA, o que soma ao efeito anticonvulsivante na crise refratária","ea":"Contribui para a lentificação cognitiva e a sedação, não separável clinicamente do efeito GABAérgico"},{"r":"Canal Ca2+","t":"ant","s":2,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"flufenazina","nome":"Flufenazina","classe":"Fenotiazinas (AP 1ºG)","nc":"Flufenan Depot","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP1A2"],"tx":"Hepático — CYP2D6 e CYP1A2 (mesmo padrão da clorpromazina, dose menor).","pc":{"CYP2D6":"maior parte","CYP1A2":"menor parte"}},"pos":{"mv":"~15-30h","pos":"Oral: 2,5-20mg/dia. Também LAI quinzenal/mensal (Flufenazina Decanoato)","iv":"1-3x/dia oral; quinzenal-mensal (LAI)","ap":"Flufenan Depot (Cristália) — enantato de flufenazina 25mg/mL, ampola 1mL (caixa com 50), uso IM/SC. Sem apresentação oral comercializada"},"rx":[{"r":"5-HT1A","t":"ant","s":1,"et":"Sem efeito terapêutico independente estabelecido — ocupação de baixa afinidade, tipicamente sem consequência clínica isolada distinta (típico da classe dos antipsicóticos típicos)","ea":"Nenhum efeito adverso independente bem estabelecido"},{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":2,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":3,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":4,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"D5","t":"ant","s":2,"et":"Papel clínico independente não caracterizado (geralmente coocupado com D1)","ea":"Não caracterizado isoladamente"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H2","t":"ant","s":1,"et":"Sem efeito terapêutico psiquiátrico independente estabelecido","ea":"Não caracterizado isoladamente em psicofarmacologia"},{"r":"M5","t":"ant","s":1,"et":"Papel clínico independente pouco caracterizado — geralmente coocupado com M1 em antipsicóticos de perfil pan-muscarínico (clozapina, olanzapina, haloperidol, flufenazina, clorpromazina)","ea":"Contribui de forma pouco específica ao perfil anticolinérgico geral"}]},{"id":"fluoxetina","nome":"Fluoxetina","classe":"ISRS","nc":"Prozac / Daforin / Fluxene / Verotina","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático — CYP2D6 (metabólito ativo norfluoxetina, meia-vida muito mais longa). Fluoxetina/norfluoxetina são inibidores potentes de CYP2D6, e moderados de CYP2C9, CYP2C19 e CYP3A4.","pc":{"CYP2D6":"maior parte"}},"pos":{"mv":"~1-4 dias (droga-mãe); norfluoxetina ~4-16 dias","pos":"Inicial 20mg/dia; usual 20-40mg/dia; máximo 80mg/dia","iv":"1x/dia","ap":"Prozac (Lilly) — cápsulas 20mg. Daforin (EMS) — comprimidos 20mg, cápsulas 10mg, solução oral (gotas) 20mg/mL. Fluxene (Eurofarma) — comprimidos 10mg, cápsulas 20mg. Verotina (Libbs) — comprimidos 20mg. Genéricos, incl. gotas 20mg/mL"},"rx":[{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"fluvoxamina","nome":"Fluvoxamina","classe":"ISRS","nc":"Luvox / Revoc / Semtri","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2D6"],"tx":"Hepático — CYP1A2 e CYP2D6. Inibidor potente de CYP1A2 (o mais forte entre os ISRS) e CYP2C19, e moderado de CYP3A4/2C9 (↑ muito clozapina, teofilina, cafeína).","pc":{"CYP1A2":"maior parte","CYP2D6":"menor parte"}},"pos":{"mv":"~15h","pos":"Inicial 50mg/dia (à noite); usual 100-200mg/dia; máximo 300mg/dia","iv":"1x/dia (à noite)","ap":"Luvox e Revoc (Abbott) — comprimidos 50/100mg. Semtri (Biolab). Genérico (Biolab)"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"σ1","t":"agp","s":2,"et":"Contribuição para efeito dissociativo/neuroplástico, mecanismo secundário ao antagonismo NMDA (cetamina)","ea":"Mesmo perfil do agonismo total, não caracterizado isoladamente"}]},{"id":"gabapentina","nome":"Gabapentina","classe":"Anticonvulsivante / Gabapentinoide","nc":"Neurontin / Gabaneurin / Empak","obs":"reduz influxo de Ca2+ e liberação pré-sináptica de glutamato/substância P/noradrenalina","met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal. Absorção não linear -> biodisponibilidade 60% para 33% com aumento da dose.","vr":"Renal integral · biodisponibilidade cai de 60% para 33% com o aumento da dose"},"pos":{"mv":"~5-7h (função renal normal)","pos":"Neuropatia/dor: inicial 300mg 1x/dia (dia 1), 300mg 2x/dia (dia 2), 300mg 3x/dia (dia 3); titular; usual 900-3600mg/dia dividido; máximo 3600mg/dia","iv":"3x/dia (intervalo máximo entre doses de 12h, por causa da absorção saturável)","ap":"Neurontin (Pfizer) — cápsulas 300/400mg; comprimidos 600mg. Similares: Gabaneurin (EMS), Empak (Biolab), Gapem (Prati). Genéricos"},"rx":[{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"galantamina","nome":"Galantamina","classe":"Inibibidor AChE e agonista nicotínico","nc":"Coglive / Gaudy / Elatium / Cogit","obs":" Ligante potencializador alostérico (APL) — não ativa o canal diretamente, mas aumenta a resposta do receptor à ACh endógena; mecanismo adicional e distinto da inibição da AChE, característico da galantamina entre os inibidores de colinesterase","met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP3A4 + glicuronidação.","pc":{"CYP2D6":"maior parte","CYP3A4":"maior parte"}},"pos":{"mv":"~7h (IR); ER tem perfil de absorção mais lento, meia-vida de eliminação similar","pos":"Alzheimer leve-moderado: inicial 8mg/dia; titular a cada 4 semanas; usual 16-24mg/dia; máximo 24mg/dia","iv":"2x/dia (IR) ou 1x/dia (ER)","ap":"Cápsulas de liberação prolongada 8/16/24mg: Coglive (Libbs) 8/16/24mg; Gaudy (EMS) 24mg; Elatium (Prati) 24mg; Cogit (Biolab) 8/16/24mg. Genéricos (Prati, Biolab). Reminyl descontinuado no Brasil"},"rx":[{"r":"nAChR","t":"mod","s":2,"et":"Potencializa a resposta colinérgica endógena ao acetilcolina — contribui para o efeito pró-cognitivo em conjunto com a inibição de AChE","ea":"Mesmo perfil colinérgico da inibição de AChE (náusea, diarreia, cãibras)"},{"r":"AChE","t":"ant","s":3,"et":"Aumento da ACh → melhora da função cognitiva e da memória","ea":"Relaxamento de esfíncter; diarreia; aumento de secreções (sudorese, sialorreia); bradicardia"},{"r":"nAChR α4β2","t":"mod","s":3,"et":"Potencializa a resposta colinérgica endógena à acetilcolina — contribui para o efeito pró-cognitivo em conjunto com a inibição de AChE","ea":"Mesmo perfil colinérgico da inibição de AChE (náusea, diarreia, cãibras)"},{"r":"nAChR α7","t":"mod","s":3,"et":"Potencializa a resposta colinérgica endógena — contribuição pró-cognitiva adicional da galantamina frente aos demais inibidores de AChE","ea":"Mesmo perfil colinérgico geral"}]},{"id":"guanfacina-er","nome":"Guanfacina ER","classe":"Alfa 2 agonista","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4 (ajuste de dose com inibidores/indutores, conforme bula).","pc":{"CYP3A4":"via única"}},"pos":{"mv":"~17h","pos":"TDAH: inicial 1mg/dia (à noite); titular semanalmente; usual 1-4mg/dia (conforme peso); máximo 4mg/dia","iv":"1x/dia","ap":"Sem registro na Anvisa — Intuniv (guanfacina ER) não é comercializado no Brasil"},"rx":[{"r":"α2A","t":"agp","s":4,"et":"Melhora da cognição e do comportamento no TDAH — ação pós-sináptica no córtex pré-frontal (fortalece conexões dendríticas em sinais de baixa intensidade); subtipo mais seletivamente visado pela guanfacina","ea":"Sedação leve, hipotensão, bradicardia"},{"r":"α2B","t":"agp","s":1,"et":"Sedação (redução da atividade simpática) — subtipo mais associado ao efeito sedativo/hipnótico da clonidina","ea":"Sonolência excessiva, hipotensão"},{"r":"α2C","t":"agp","s":1,"et":"Modulação de catecolaminas (reduz liberação); potencializa sedação; possível papel em impulsividade","ea":"Potencializa sedação e hipotensão dos demais subtipos"}]},{"id":"haloperidol","nome":"Haloperidol","classe":"Antipsicótico típico (AP 1ª G)","nc":"Haldol / Halo","obs":null,"met":{"tp":"Hepático","en":["UGT1A4","UGT2B7","UGT1A9","CYP3A4","CYP2D6"],"tx":"Hepático — glicuronidação é a via principal (>50% da eliminação; UGT1A4, UGT1A9, UGT2B7), com CYP3A4 e CYP2D6 em paralelo e redução carbonílica a haloperidol reduzido (reversível). Inibidor moderado de CYP2D6.","pc":{"UGT1A4":"maior parte da glicuronidação","UGT2B7":"parte da glicuronidação","UGT1A9":"parte da glicuronidação","CYP3A4":"menor parte","CYP2D6":"menor parte"},"vr":"Glicuronidação >50% da eliminação · CYP3A4/CYP2D6 · redução carbonílica (reversível)"},"pos":{"mv":"~14-26h (variável por polimorfismo de CYP2D6)","pos":"Oral: inicial 0,5-5mg/dia; usual 2-20mg/dia; máximo 100mg/dia (psicose). Também LAI mensal (Haldol Decanoato)","iv":"1-3x/dia oral; mensal (LAI)","ap":"Haldol (Janssen) — comprimidos 1mg e 5mg; solução oral (gotas) 2mg/mL (1 gota = 0,1mg); injetável 5mg/mL, ampola 1mL (IM); Haldol Decanoato 50mg/mL, ampola 1mL (LAI mensal). Halo (Cristália) — comprimidos, gotas e injetável 5mg/mL; Halo Decanoato 50mg/mL, ampola 1mL. Genéricos"},"rx":[{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":1,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT7","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":4,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":2,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":1,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"M5","t":"ant","s":1,"et":"Papel clínico independente pouco caracterizado — geralmente coocupado com M1 em antipsicóticos de perfil pan-muscarínico (clozapina, olanzapina, haloperidol, flufenazina, clorpromazina)","ea":"Contribui de forma pouco específica ao perfil anticolinérgico geral"},{"r":"σ1","t":"ant","s":4,"et":"Ansiolítico; auxilia em sintomas depressivos psicóticos; papel clínico menos claro que o dos agonistas — pode até reduzir os benefícios pró-cognitivos observados com agonistas σ1 em combinação (sertralina)","ea":"Não caracterizado isoladamente"}]},{"id":"iloperidona","nome":"Iloperidona","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP3A4 (duplo, mesmo padrão do aripiprazol/brexpiprazol).","pc":{"CYP2D6":"maior parte","CYP3A4":"maior parte"}},"pos":{"mv":"~18-33h","pos":"Inicial 1mg 2x/dia; titular; usual 6-12mg/dia dividido; máximo 24mg/dia","iv":"2x/dia","ap":"SEM REGISTRO ATIVO NA ANVISA — Fanapt não comercializado no Brasil"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":2,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":5,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"imipramina","nome":"Imipramina","classe":"Tricíclico","nc":"Imipra","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP1A2, CYP2C19 e CYP3A4 (metabólito ativo desipramina, mais noradrenérgico) + CYP2D6. Inibidor leve de CYP2D6.","pc":{"CYP2C19":"maior parte (desmetilação)","CYP2D6":"maior parte (hidroxilação)","CYP1A2":"menor parte","CYP3A4":"menor parte"}},"pos":{"mv":"~11-25h (droga-mãe); desipramina (metabólito) ~12-24h","pos":"Inicial 25-75mg/dia; usual 100-200mg/dia; máximo 300mg/dia (uso hospitalar)","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Imipra (Cristália) — comprimidos 25mg, caixas com 20/60. Genéricos"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":2,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"lamotrigina","nome":"Lamotrigina","classe":"Estabilizador / Anticonvulsivante","nc":"Lamictal / Neural / Forlut","obs":null,"met":{"tp":"Hepático","en":["UGT1A4","UGT2B10"],"tx":"Hepático — UGT1A4 (não-CYP). Valproato INIBE essa via (aumenta muito níveis de lamotrigina); carbamazepina/fenitoína INDUZEM (reduzem níveis).","pc":{"UGT1A4":"maior parte (fração metabolizada 0,42-0,64)","UGT2B10":"parte relevante (0,32-0,57)"}},"pos":{"mv":"~25h","pos":"Epilepsia/estabilizador de humor: titulação lenta obrigatória (risco de rash grave) — inicial 25mg em dias alternados (associado a valproato) ou 25mg/dia (sem valproato); titular ao longo de 6 semanas; usual 100-400mg/dia; máximo 400-700mg/dia","iv":"1-2x/dia","ap":"Lamictal (GSK) — comprimidos 25/50/100/200mg e comprimidos dispersíveis. Similares: Neural (Cristália) e Forlut (Biolab) — 25/100mg. Genéricos"},"rx":[{"r":"Canal Na+","t":"ant","s":3,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"lemborexant","nome":"Lemborexant","classe":"Inibidor Orexinas","nc":"Dayvigo — registrado, não lançado","obs":"v Ki OX1R=6,1nM vs OX2R=2,6nM — lemborexanta tem preferência documentada pelo OX2R (~2x), diferente da suvorexanta (não-seletiva)","met":{"tp":"Hepático","en":["CYP3A4","CYP3A5"],"tx":"Hepático — CYP3A4 (mesmo ajuste da suvorexanta), CYP3A5 (menor).","pc":{"CYP3A4":"maior parte","CYP3A5":"menor parte"}},"pos":{"mv":"~17-19h (5mg) a ~55h (10mg) — farmacocinética não-linear","pos":"Insônia: 5-10mg imediatamente antes de deitar; máximo 10mg/dia","iv":"1x/dia (ao deitar)","ap":"Dayvigo (Eisai; comercialização Eurofarma) — comprimidos 5/10mg. Registrado em 2025, ainda sem venda no Brasil"},"rx":[{"r":"OX1","t":"ant","s":4,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"},{"r":"OX2","t":"ant","s":5,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"}]},{"id":"levomepromazina","nome":"Levomepromazina","classe":"Antipsicótico típico","nc":"Neozine","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 (metabolismo amplo, semelhante à clorpromazina). Inibidor leve de CYP2D6.","pc":{"CYP3A4":"maior parte","CYP2D6":"maior parte"}},"pos":{"mv":"~15-30h","pos":"Baixa dose (sedação/insônia): 3-25mg à noite. Alta dose (antipsicótico): 25-200mg/dia, máximo 1000mg/dia (uso hospitalar)","iv":"1x/dia (dose baixa) a 2-3x/dia (dose alta)","ap":"Neozine (Sanofi Medley) — comprimidos 25mg e 100mg; Neozine 4% solução oral (gotas) 40mg/mL, frasco 20mL (1 gota = 1mg; diluir em água açucarada)"},"rx":[{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":3,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":3,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":3,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"}]},{"id":"levominalciprana","nome":"Levominalciprana","classe":"IRSN","nc":"Não tem no Brasil","obs":"Levomilnaciprana é o IRSN mais \"noradrenérgico-preferencial\" da classe — potência funcional ~2x maior para NAT que para SERT (IC50 NE=10,5nM vs 5-HT=19,0nM), confirmado in vivo por teste pressor de tiramina em humanos; ~10-17x mais seletiva para NAT que venlafaxina/duloxetina/desvenlafax,ina","met":{"tp":"Predominantemente renal","en":["CYP3A4"],"tx":"Predominantemente renal — 55% excretado inalterado; CYP3A4 (menor) para o restante.","pc":{"CYP3A4":"menor parte — só o que não sai inalterado"}},"pos":{"mv":"~12h","pos":"Inicial 20mg/dia; usual 40-80mg/dia; máximo 120mg/dia","iv":"1x/dia","ap":"Sem registro na Anvisa — Fetzima não é comercializado no Brasil"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"lisdexanfetamina-anfetaminas","nome":"Lisdexanfetamina/anfetaminas","classe":"Estimulante SNC","nc":"Venvanse / Juneve / Lyberdia","obs":"Mecanismo não é bloqueio clássico de sítio, e sim substrato do VMAT2: a anfetamina entra na vesícula sináptica e, como amina terciária protonável, colapsa o gradiente de pH vesicular, causando efluxo de dopamina por um mecanismo de troca (exchange-diffusion) — efeito funcional final é redução do armazenamento vesicular normal, daí a manutenção na escala de \"antagonismo\" funcional","met":{"tp":"Outro/Indefinido","en":["CYP2D6"],"tx":"Lisdexanfetamina é pró-fármaco inativo — convertida a dextroanfetamina por hidrólise nas hemácias (não-hepática). Dextroanfetamina: parcialmente CYP2D6, parcialmente renal (dependente de pH). Inibidor fraco de CYP2D6.","pc":{"CYP2D6":"participação parcial (da dextroanfetamina)"},"vr":"Hidrólise eritrocitária (ativação, não-hepática) · CYP2D6 parcial · renal pH-dependente"},"pos":{"mv":"Lisdexanfetamina (pró-fármaco) ~1h; dextroanfetamina (ativa) ~10-13h","pos":"TDAH: inicial 30mg/dia (manhã); titular semanalmente; usual 30-70mg/dia; máximo 70mg/dia","iv":"1x/dia (manhã)","ap":"Venvanse (Takeda) — cápsulas 30/50/70mg. Juneve (Takeda) — 30/50/70mg. Lyberdia (EMS) — solução oral (gotas) 40mg/mL, frasco 50mL (1 gota = 2mg). Similares: Monitum (Teva), Lisvenx, Lisdev, Lidexor (também gotas), Deksa, Lysdexa, Vimade. Genérico (Pharlab) 30/50/70mg"},"rx":[{"r":"NAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"VMAT2","t":"ant","s":4,"et":"Tratamento da discinesia tardia e coreia (tetrabenazina-símile); reduz liberação dopaminérgica quando usado como substrato de troca (anfetaminas)","ea":"Sedação, depressão, acatisia, prolongamento do QT (classe tetrabenazina)"},{"r":"TAAR1","t":"agt","s":6,"et":"Inverte a direção do DAT/NAT (efluxo em vez de captação) e diminui a exposição extracelular de D2 → reduz fissura; reduz sintomas psicóticos; melhora atenção no TDAH","ea":"Taquicardia, ansiedade, insônia (classe estimulante)"}]},{"id":"lorazepam","nome":"Lorazepam","classe":"Benzodiazepínico","nc":"Lorax","obs":null,"met":{"tp":"Hepático","en":["UGT2B7","UGT2B15","UGT2B4"],"tx":"Hepático — glicuronidação direta (não-CYP) a 3-O-fenil-glucuronídeo inativo, por UGT2B7/UGT2B15/UGT2B4; como oxazepam e temazepam (grupo \"LOT\"). Mais seguro em insuficiência hepática. UGT2B15*2/*2 reduz a depuração em 40-50%.","pc":{"UGT2B7":"maior parte","UGT2B15":"maior parte","UGT2B4":"menor parte"},"vr":"Glicuronidação direta integral (não-CYP) — sem etapa oxidativa"},"pos":{"mv":"~10-20h (não sofre oxidação hepática — vantagem em hepatopatas/idosos)","pos":"Ansiedade/insônia: 1-4mg/dia dividido; máximo 10mg/dia (ambulatorial, uso não crônico)","iv":"2-3x/dia","ap":"Lorax (Pfizer/Wyeth) — comprimidos 1/2mg. Genéricos 2mg"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"lumateperona","nome":"Lumateperona","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — múltiplas vias sem CYP dominante (CYP3A4 parcial + redutases + glicuronidação) — reduz risco de interação.","pc":{"CYP3A4":"participação parcial — sem CYP dominante"},"vr":"Múltiplas vias sem CYP dominante — CYP3A4 parcial, redutases e glicuronidação"},"pos":{"mv":"~18h","pos":"42mg 1x/dia à noite (dose fixa, sem titulação necessária); não requer ajuste por função renal/hepática leve-moderada","iv":"1x/dia (à noite)","ap":"SEM REGISTRO NA ANVISA — Caplyta (aprovação muito recente nos EUA, 2019) não disponível no Brasil"},"rx":[{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"D1","t":"ant","s":3,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":2,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"α1","t":"ant","s":1,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"}]},{"id":"lurasidona","nome":"Lurasidona","classe":"Antipsicótico atípico","nc":"Latuda / Lutab / Lubip","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Tomar com alimento (absorção); ajuste de dose com inibidores/indutores de CYP3A4.","pc":{"CYP3A4":"via única"}},"pos":{"mv":"~18h","pos":"Inicial 40mg/dia (com alimento, ≥350kcal); usual 40-80mg/dia; máximo 160mg/dia (esquizofrenia) ou 120mg/dia (depressão bipolar)","iv":"1x/dia (com alimento)","ap":"Latuda (Daiichi Sankyo) — comprimidos 20/40/80mg, caixas com 7/14/30/60. Similares: Lutab (Aché) e Lubip (Torrent) — 20/40/80mg. Genérico 40/80mg"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":4,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":5,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":4,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":1,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2C","t":"ant","s":3,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"}]},{"id":"litio","nome":"Lítio","classe":"Estabilizador do humor","nc":"Carbolitium / Literata / Bilyt","obs":null,"met":{"tp":"Nenhum (excreção renal integral)","en":[],"tx":"Sem metabolismo — excreção renal integral, forma inalterada. Compete com sódio na reabsorção tubular proximal (interação com diuréticos, IECA/BRA, AINEs).","vr":"Renal 100% inalterado — sem metabolismo"},"pos":{"mv":"~24h (dose única); pode chegar a ~58h em uso crônico/idosos","pos":"Estabilizador de humor: inicial 300-600mg/dia dividido; titular conforme litemia (alvo 0,6-1,2 mEq/L); usual 900-1800mg/dia; monitorização de nível sérico obrigatória","iv":"2-3x/dia (ou 1x/dia à noite para liberação controlada)","ap":"Carbolitium (Eurofarma) — comprimidos 300mg, caixas com 60/90; Carbolitium CR (liberação controlada) 450mg. Similares: Literata (Cristália) e Bilyt (Biolab) — 300mg. Genéricos 300mg"},"rx":[{"r":"GSK-3β","t":"ant","s":2,"et":"Neuroplasticidade; neuroproteção (lítio, valproato)","ea":"Anomalia de Ebstein — má formação da válvula tricúspide fetal (lítio, teratogenicidade)"},{"r":"IPPase","t":"ant","s":3,"et":"Neuroplasticidade e neuroproteção (via depleção de inositol — lítio)","ea":"Acne/psoríase"},{"r":"IMPase","t":"ant","s":2,"et":"Mesmo mecanismo de depleção de inositol do IPPase (lítio)","ea":"Acne/psoríase"}]},{"id":"mazindol","nome":"Mazindol","classe":"IRD","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Outro/Indefinido","en":[],"tx":"Dados limitados (fármaco antigo) — hepático oxidativo, sem isoenzima bem caracterizada.","vr":"Hepático oxidativo — isoenzima não caracterizada"},"pos":{"mv":"Dados limitados","pos":"Histórico: 1-2mg/dia como anorexígeno (uso para TDAH é off-label/investigacional, sem posologia padronizada estabelecida)","iv":"1-2x/dia (uso histórico)","ap":"RETIRADO DO MERCADO BRASILEIRO PELA ANVISA em 04/10/2011 (produtos Absten S, Fagolipo, Moderine) — não disponível atualmente"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":5,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"melatonina","nome":"Melatonina","classe":"Agonista melatoninérgico","nc":"Suplemento alimentar","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C19","CYP1A1"],"tx":"Hepático — CYP1A2 (principal) e CYP2C19/1A1 (menores). Biodisponibilidade oral baixa (15%). Sensível a inibidores de CYP1A2 (fluvoxamina ↑ muito os níveis).","pc":{"CYP1A2":"~90%","CYP2C19":"menor parte","CYP1A1":"menor parte"}},"pos":{"mv":"~45min-1h (efeito rápido, meia-vida curta)","pos":"Insônia/jet lag: 0,5-5mg (uso não regulado como medicamento em muitos países — suplemento em alguns mercados)","iv":"1x/dia (30-60min antes de deitar)","ap":"Sem medicamento registrado — comercializada como suplemento alimentar (limite de 0,21mg/dia) ou por manipulação"},"rx":[{"r":"MT1","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — induz sono por inibição do núcleo supraquiasmático","ea":"—"},{"r":"MT2","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — regula transcrição genética para regularização do sono (atrasa a fase pela manhã, induz à noite)","ea":"—"},{"r":"MT3","t":"agt","s":6,"et":"Reduz formação de radicais livres (efeito antioxidante)","ea":"—"}]},{"id":"memantina","nome":"Memantina","classe":"Antagonista NMDA","nc":"Ebix / Alois / Heimer / Zider","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 48-80% inalterado, dependente de pH urinário (como as anfetaminas).","vr":"Renal 48-80% inalterado, dependente do pH urinário"},"pos":{"mv":"~60-80h","pos":"Alzheimer moderado-grave: inicial 5mg/dia; titular semanalmente; usual 20mg/dia (10mg 2x/dia ou 28mg 1x/dia ER); máximo 28mg/dia (ER) ou 20mg/dia (IR)","iv":"2x/dia (IR) ou 1x/dia (ER)","ap":"Ebix (Lundbeck) — comprimidos 10/20mg. Alois (Apsen) — comprimidos 10/20mg; solução oral (gotas) 10mg/mL, frascos 15/50mL (1 gota = 0,5mg). Moriale ODT (EMS) — orodispersível 5/10mg. Similares: Heimer (Eurofarma), Zider (Libbs), Maizher (Prati), Mealz (Torrent; 10/20mg), ALZ (Cristália). Genéricos 10mg"},"rx":[{"r":"5-HT3","t":"ant","s":2,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"NMDA","t":"ant","s":3,"et":"Antidepressivo (incluindo efeito antissuicida rápido — cetamina/escetamina); neuroproteção","ea":"Dissociação; hipertensão; náuseas; risco de abuso (cetamina)"},{"r":"nAChR α7","t":"ant","s":1,"et":"Contribuição secundária/pouco caracterizada ao mecanismo da memantina","ea":"Não caracterizado isoladamente"}]},{"id":"metilfenidato","nome":"Metilfenidato","classe":"Estimulante SNC","nc":"Ritalina / Ritalina LA / Concerta","obs":null,"met":{"tp":"Hepático","en":["CES1A1"],"tx":"Hepático — carboxilesterase CES1A1 (não-CYP) a ácido ritalínico (inativo). Participação mínima de CYP450.","pc":{"CES1A1":"maior parte (>80%)"}},"pos":{"mv":"~2-4h (IR); ~3-4h (OROS/ER, absorção prolongada)","pos":"TDAH: inicial 5-10mg 2x/dia (IR) ou 18-36mg/dia (OROS); usual 20-60mg/dia; máximo 60-108mg/dia conforme formulação","iv":"2-3x/dia (IR) ou 1x/dia (OROS/ER)","ap":"Ritalina (Novartis) — comprimidos 10mg. Ritalina LA — cápsulas 10/20/30/40mg. Concerta (Janssen) — comprimidos de liberação prolongada 18/36/54mg. Similares 10mg: Medato (Eurofarma), Attenze. Similares LP 18/36/54mg: FoQ XR (Cosmed), Consiv (Adium), Ragione. Genéricos 10mg e LP 18/36/54mg"},"rx":[{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"minalciprana","nome":"Minalciprana","classe":"IRSN","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 50% excretado inalterado; glicuronidação (não-CYP) para o restante.","vr":"Renal 50% inalterado · glicuronidação do restante"},"pos":{"mv":"~8h","pos":"Dor crônica/fibromialgia: inicial 12,5mg 1x/dia, titular; usual 100mg/dia dividido; máximo 200mg/dia. Uso como antidepressivo é off-label no Brasil (aprovação primária é para fibromialgia)","iv":"2x/dia","ap":"Sem registro ativo na Anvisa — não é comercializada no Brasil (Ixel/Savella em outros mercados, onde a indicação aprovada é fibromialgia, não depressão)"},"rx":[{"r":"SERT","t":"inib","s":1,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"mirtazapina","nome":"Mirtazapina","classe":"NaSSA","nc":"Remeron / Razapina / Zapsy","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP1A2","CYP3A4"],"tx":"Hepático — CYP2D6, CYP1A2 e CYP3A4 (múltiplas vias).","pc":{"CYP3A4":"maior parte (N-desmetilação e N-óxido)","CYP2D6":"8-hidroxilação","CYP1A2":"8-hidroxilação"}},"pos":{"mv":"~20-40h","pos":"Inicial 15mg/dia (à noite); usual 15-45mg/dia; máximo 45mg/dia","iv":"1x/dia (à noite)","ap":"Remeron (Organon) — comprimidos revestidos 15/30/45mg; Remeron Soltab (orodispersível) 15/30/45mg. Similares: Razapina (Sandoz), Zapsy (Prati). Genéricos, incl. orodispersível"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":3,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"α2","t":"ant","s":3,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"modafinila","nome":"Modafinila","classe":"Inibidor Atípico do Transportador de Dopamina","nc":"Stavigile","obs":" Ki in vitro fraco (~4µM, mais fraco que cocaína/metilfenidato), mas ocupação por PET in vivo de 51-57% do DAT estriatal em doses clínicas (200-300mg) — divergência Ki-fraco/ocupação-relevante. Modo de ligação \"atípico\": estabiliza conformação DAT voltada para dentro (inward-facing), diferente de cocaína/metilfenidato (voltada para fora) — correlaciona com menor potencial de abuso apesar do bloqueio real do DAT (Schmitt & Reith 2011)","met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — hidrólise amídica (não-CYP) + CYP3A4 (menor). Indutor moderado de CYP3A4 e CYP1A2 e inibidor fraco-moderado de CYP2C19.","pc":{"CYP3A4":"menor parte"},"vr":"Hidrólise amídica (maior parte, não-CYP) · CYP3A4 menor parte"},"pos":{"mv":"~15h","pos":"TDAH/sonolência excessiva: inicial 100-200mg/dia (manhã); usual 200mg/dia; máximo 400mg/dia","iv":"1x/dia (manhã) ou dividido manhã/meio-dia","ap":"Stavigile (Libbs) — comprimidos 100/200mg, caixas com 10/30"},"rx":[{"r":"DAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"naltrexona","nome":"Naltrexona","classe":"Antagonista opioide","nc":"Revia / Uninaltrex / Contrave","obs":null,"met":{"tp":"Hepático","en":["di-hidrodiol desidrogenase"],"tx":"Hepático — di-hidrodiol desidrogenase (não-CYP) ao metabólito ativo 6-beta-naltrexol (um pouco menos potente, meia-vida mais longa).","pc":{"di-hidrodiol desidrogenase":"maior parte"},"vr":"Di-hidrodiol desidrogenase (não-CYP) → 6-beta-naltrexol ativo"},"pos":{"mv":"~4h (via oral); ~5-10 dias (injetável de liberação prolongada, Vivitrol)","pos":"Transtorno por uso de álcool/opioides: 50mg/dia (oral); também injetável IM mensal (380mg)","iv":"1x/dia (oral) ou mensal (injetável)","ap":"Revia (Cristália) e Uninaltrex (União Química) — comprimidos 50mg, caixas com 30. Contrave (Merck) — naltrexona 8mg + bupropiona 90mg, liberação prolongada. Sem injetável de depósito no Brasil"},"rx":[{"r":"κ-opioide","t":"ant","s":3,"et":"Bloqueio do craving por álcool e opioides; possível efeito antidepressivo em protocolos experimentais de antagonismo κ isolado (naltrexona)","ea":"Precipitação de abstinência em usuários de opioides; hepatotoxicidade em dose alta"},{"r":"μ-opioide","t":"ant","s":4,"et":"Tratamento do transtorno por uso de álcool e de opioides; reduz o reforço/prazer associado ao consumo (naltrexona)","ea":"Precipita abstinência grave em usuários de opioides; hepatotoxicidade; disforia; náuseas"},{"r":"δ-opioide","t":"ant","s":2,"et":"Contribuição secundária ao efeito da naltrexona no transtorno por uso de substâncias","ea":"Não caracterizado isoladamente"}]},{"id":"nortriptilina","nome":"Nortriptilina","classe":"Tricíclico","nc":"Pamelor","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático — CYP2D6 (polimorfismo relevante; monitorização de nível sérico usada na prática).","pc":{"CYP2D6":"maior parte"}},"pos":{"mv":"~18-44h","pos":"Inicial 25mg/dia; usual 75-150mg/dia; máximo 150mg/dia (ambulatorial); monitorização de nível sérico disponível","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Pamelor (Cellera) — cápsulas 10/25/50/75mg. Genéricos"},"rx":[{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":2,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"olanzapina","nome":"Olanzapina","classe":"Antipsicótico atípico","nc":"Zyprexa / Axonium / Zap","obs":null,"met":{"tp":"Hepático","en":["UGT1A4","UGT2B10","CYP1A2","CYP2D6"],"tx":"Hepático — glicuronidação como via principal: UGT1A4 (10-N-glucuronídeos) e UGT2B10 (4'-N-glucuronídeo). CYP1A2 em paralelo (mesma interação com tabagismo da clozapina), CYP2D6 (menor). UGT1A4*3 aumenta ~2x a glicuronidação; UGT2B10*2 reduz ~2x.","pc":{"UGT1A4":"maior parte (10-N-glucuronídeos)","UGT2B10":"parte relevante (4'-N-glucuronídeo)","CYP1A2":"menor parte","CYP2D6":"menor parte"}},"pos":{"mv":"~30h (21-54h)","pos":"Inicial 5-10mg/dia; usual 10-20mg/dia; máximo 20mg/dia (oral)","iv":"1x/dia","ap":"Zyprexa (Lilly) — comprimidos revestidos 2,5/5/10mg; Zyprexa Zydis (orodispersível) 5/10mg; Zyprexa IM 10mg, frasco-ampola com pó (reconstituir com 2,1mL = 5mg/mL). Similares: Axonium (Aché), Zap (Eurofarma), Olanexyn, Zopix, Crisapina (Cristália), Zesten, Olanzys, Onaz. Genéricos, incl. orodispersível"},"rx":[{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":4,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":2,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT6","t":"ant","s":4,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":3,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":2,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":5,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":4,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":2,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"M3","t":"ant","s":3,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":2,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"}]},{"id":"oxcarbazepina","nome":"Oxcarbazepina","classe":"Anticonvulsivante","nc":"Trileptal","obs":null,"met":{"tp":"Hepático","en":["UGT"],"tx":"Hepático — redução citosólica (arilcetona-redutase, não-CYP) ao metabólito ativo MHD/eslicarbazepina, principal responsável pelo efeito; o MHD é então glicuronidado (49% da dose sai como glucuronídeos de MHD, 27% como MHD inalterado). Indutor moderado de CYP3A4 e de UGT, e inibidor leve de CYP2C19.","pc":{"UGT":"maior parte — 49% da dose como glucuronídeos de MHD"},"vr":"Redução citosólica a MHD → glicuronidação 49% da dose · MHD inalterado 27%"},"pos":{"mv":"~2h (droga-mãe); eslicarbazepina (MHD, metabólito ativo) ~9h","pos":"Epilepsia: inicial 300mg/dia; titular; usual 600-1200mg/dia; máximo 2400mg/dia","iv":"2x/dia","ap":"Trileptal (Novartis) — comprimidos revestidos 300/600mg, caixas com 20/60; suspensão oral 60mg/mL, frasco 100mL. Genéricos (comprimidos e suspensão)"},"rx":[{"r":"GABA-A","t":"agp","s":1,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"},{"r":"R- Adenosina A1","t":"outro","s":0,"et":"Upregulation compensatória de receptores — menor excitabilidade em grandes ondas por mais receptores de um sinalizador inibitório; efeito antimaníaco e neuroprotetor hipotético","ea":"—"},{"r":"Canal Na+","t":"ant","s":3,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":1,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"},{"r":"Canal de K+","t":"ant","s":2,"et":"—","ea":"Alargamento do QT (hERG) — risco de arritmia, classe de efeito adverso, não terapêutico"}]},{"id":"oxibato-de-sodio","nome":"Oxibato de sódio","classe":"Depressor do sistema nervoso central","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Não-hepático","en":[],"tx":"Via não-hepática — semialdeído succínico desidrogenase converte a succinato (ciclo de Krebs), sem passar por CYP450.","vr":"Semialdeído succínico desidrogenase → succinato (ciclo de Krebs) — sem CYP"},"pos":{"mv":"~0,5-1h (bem curta — por isso a dose noturna dividida)","pos":"Cataplexia/narcolepsia: inicial 4,5g/noite (dividido em 2 doses, 1ª ao deitar + 2ª 2,5-4h depois); titular; usual 6-9g/noite; máximo 9g/noite","iv":"2x/noite (regime fracionado obrigatório, por meia-vida curta)","ap":"SEM COMERCIALIZAÇÃO REGULAR NO BRASIL — Xyrem disponível apenas por importação controlada (substância sujeita a controle especial)"},"rx":[{"r":"GHB","t":"agp","s":3,"et":"Potencializa efeito sedativo; tratamento da cataplexia/narcolepsia (oxibato de sódio)","ea":"Depressão respiratória em dose alta; potencial de abuso; sonambulismo"}]},{"id":"paliperidona","nome":"Paliperidona","classe":"Antipsicótico atípico","nc":"Invega / Invega Sustenna / Trinza / Vegapali","obs":null,"met":{"tp":"Predominantemente renal","en":["CYP2D6","CYP3A4","glicoproteína-P"],"tx":"Predominantemente renal — 59% excretado inalterado (é o próprio metabólito ativo da risperidona). Hepático mínimo (CYP2D6/CYP3A4, <10%). Substrato de glicoproteína-P.","pc":{"CYP2D6":"<10%","CYP3A4":"<10%","glicoproteína-P":"transporte, não metabolismo"},"vr":"Renal 59% inalterado · hepático <10% (CYP2D6/CYP3A4)"},"pos":{"mv":"~23h (oral ER); formulação injetável de ação prolongada (LAI) tem meia-vida efetiva de semanas","pos":"Oral: 3-12mg/dia. LAI mensal (Invega Sustenna): 39-234mg. LAI trimestral (Invega Trinza) também disponível após estabilização com a mensal","iv":"1x/dia oral; mensal ou trimestral (LAI)","ap":"Invega (Janssen) — comprimidos de liberação prolongada (OROS) 3/6/9mg. Invega Sustenna (LAI mensal) — seringas preenchidas 50/75/100/150mg. Invega Trinza (LAI trimestral) — 175/263/350/525mg. Vegapali (Zodiac) — similar mensal, seringas 50/75/100/150mg"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":2,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":2,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"α2A","t":"ant","s":2,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":4,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"paroxetina","nome":"Paroxetina","classe":"ISRS","nc":"Aropax / Pondera / Paxil CR","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático — CYP2D6 (satura em doses maiores, por autoinibição). É o inibidor mais potente de CYP2D6 entre os ISRS (ex.: tamoxifeno).","pc":{"CYP2D6":"maior parte (satura em dose maior)"}},"pos":{"mv":"~21h","pos":"Inicial 20mg/dia; usual 20-50mg/dia; máximo 60mg/dia","iv":"1x/dia","ap":"Aropax (GSK) — comprimidos 20mg. Paxil CR (GSK) — liberação controlada 12,5/25mg. Pondera (Eurofarma) — 10/15/20/25/30/40mg. Similares: Roxetin (Cristália), Moratus (Medley), Cebrilin (Libbs), Paxtrat (União Química). Genéricos"},"rx":[{"r":"SERT","t":"inib","s":5,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"M1","t":"ant","s":1,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"NOS","t":"ant","s":1,"et":"Sem efeito terapêutico central estabelecido de forma isolada","ea":"Disfunção erétil (efeito periférico — ex. paroxetina)"}]},{"id":"pimavanserina","nome":"Pimavanserina","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP3A5","CYP2J2"],"tx":"Hepático — CYP3A4/CYP3A5 (principal), CYP2J2 (menor). Sensível a inibidores/indutores de CYP3A4.","pc":{"CYP3A4":"maior parte","CYP3A5":"maior parte","CYP2J2":"menor parte"}},"pos":{"mv":"~57h","pos":"34mg 1x/dia (dose fixa); indicado para psicose associada à Doença de Parkinson","iv":"1x/dia","ap":"SEM REGISTRO NA ANVISA — Nuplazid não comercializado no Brasil"},"rx":[{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":4,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"}]},{"id":"pitolisanto","nome":"Pitolisanto","classe":"Inibidor H3","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4","FMO"],"tx":"Hepático — CYP2D6 e CYP3A4 + FMO (menor).","pc":{"CYP2D6":"maior parte","CYP3A4":"maior parte","FMO":"menor parte"}},"pos":{"mv":"~20h","pos":"Sonolência excessiva (narcolepsia): inicial 8,9mg/dia (manhã); titular; usual 17,8-35,6mg/dia; máximo 35,6mg/dia","iv":"1x/dia (manhã)","ap":"SEM REGISTRO NA ANVISA — Wakix não comercializado no Brasil, confirmado pela ABRANHI"},"rx":[{"r":"H3","t":"ant","s":4,"et":"Melhora da sonolência diurna (pitolisanto)","ea":"Insônia, cefaleia"}]},{"id":"pregabalina","nome":"Pregabalina","classe":"Anticonvulsivante / Gabapentinoide","nc":"Lyrica / Insit / Dorene / Prebictal","obs":"reduz influxo de Ca2+ e liberação pré-sináptica de glutamato/substância P/noradrenalina","met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal. Absorção linear, biodisponibilidade ≥90% independente da dose (diferencial frente à gabapentina).","vr":"Renal integral · biodisponibilidade ≥90% independente da dose"},"pos":{"mv":"~6,3h (função renal normal)","pos":"Neuropatia/dor/TAG: inicial 75mg 2x/dia (150mg/dia); pode iniciar em dose terapêutica sem titulação longa; usual 150-300mg/dia dividido; máximo 600mg/dia","iv":"2x/dia (ou 3x/dia para dor neuropática, conforme bula)","ap":"Lyrica (Pfizer) — cápsulas 75/150mg. Similares: Insit (Apsen) 50/75mg, Dorene (Aché) 75/150mg + solução oral, Prebictal (Zodiac), Konduz (EMS) 35/75/150mg, Glya (Cristália), Limiar, Mobale, Ápice, Prefiss, Pregalpha, Lysugi, Proleptol, Jolik. Genéricos"},"rx":[{"r":"Canal Ca2+","t":"ant","s":4,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"quetiapina","nome":"Quetiapina","classe":"Antipsicótico atípico","nc":"Seroquel / Quetipin / Atip / Queropax","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 (principal), CYP2D6 (menor). Metabólito ativo norquetiapina (mais potente na inibição de NAT, relevante em dose alta).","pc":{"CYP3A4":"maior parte","CYP2D6":"menor parte"}},"pos":{"mv":"~6-7h (IR); XR tem perfil de absorção mais lento, mesma meia-vida de eliminação","pos":"Inicial 25-50mg/dia; titular; usual 300-800mg/dia (psicose) ou 50-300mg/dia (depressão bipolar/potencialização); máximo 800mg/dia","iv":"2x/dia (IR) ou 1x/dia à noite (XR)","ap":"Seroquel (AstraZeneca) — comprimidos 25/100/200/300mg; Seroquel XRO 50/200/300/400mg. Quetipin SO (Cristália) — suspensão oral 12,5 e 25mg/mL. Similares: Atip e Atip XR, Kitapen, Mensyva (Aché), Neotiapim, Queropax (EMS), Quepsia LP, Quetipin LP, Quet XR. Genéricos"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT6","t":"ant","s":1,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":1,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":1,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":1,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":1,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":1,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":1,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"M3","t":"ant","s":1,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":1,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"}]},{"id":"rameltonina","nome":"Rameltonina","classe":"Agonista melatoninérgico","nc":"Rozerem / Rahime","obs":" Ki MT1=14pM vs MT2=112pM — rameltona tem preferência ~8x pelo MT1 (ao contrário da agomelatina/melatonina, que não diferenciam)","met":{"tp":"Hepático","en":["CYP1A2","CYP2C9","CYP3A4"],"tx":"Hepático — CYP1A2 (90%, primeira passagem extensa, biodisponibilidade <2%), CYP2C9/3A4 (menores). Contraindicado com fluvoxamina.","pc":{"CYP1A2":"~90%","CYP2C9":"menor parte","CYP3A4":"menor parte"}},"pos":{"mv":"~1-2,6h","pos":"Insônia: 8mg, 30 minutos antes de deitar; máximo 8mg/dia","iv":"1x/dia (ao deitar)","ap":"Rozerem (Takeda) — comprimidos 8mg, caixa com 30. Rahime (Apsen) — 8mg, caixas com 10/30"},"rx":[{"r":"MT1","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — induz sono por inibição do núcleo supraquiasmático","ea":"—"},{"r":"MT2","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — regula transcrição genética para regularização do sono (atrasa a fase pela manhã, induz à noite)","ea":"—"}]},{"id":"risperidona","nome":"Risperidona","classe":"Antipsicótico atípico","nc":"Risperdal / Risperidon / Riss / Viverdal","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 (principal; polimorfismo relevante), CYP3A4 (menor). Metabólito ativo paliperidona (potência semelhante).","pc":{"CYP2D6":"maior parte","CYP3A4":"menor parte"}},"pos":{"mv":"~3-20h (variável por polimorfismo de CYP2D6); considerando a paliperidona (metabólito ativo), meia-vida efetiva combinada ~20h","pos":"Inicial 1-2mg/dia; titular; usual 2-6mg/dia; máximo 16mg/dia. LAI quinzenal (Risperdal Consta) em descontinuação no Brasil","iv":"1-2x/dia oral; quinzenal (LAI)","ap":"Risperdal (Janssen) — comprimidos 1/2/3mg; solução oral 1mg/mL. Risperdal Consta (LAI quinzenal) 25/37,5/50mg — em descontinuação no Brasil desde 2025. Similares: Risperidon (Cristália), Riss (Eurofarma), Viverdal (União Química), Perlid (Prati; solução oral). Genéricos, incl. solução oral 1mg/mL"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT7","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":3,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":5,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"rivastigmina","nome":"Rivastigmina","classe":"Inibidor AChE","nc":"Exelon / Exelon Patch / Vivencia Patch","obs":" Mecanismo pseudo-irreversível (carbamilação) — forma complexo covalente transitório com a enzima, hidrolisado lentamente ao longo de horas; farmacologicamente distinto da inibição reversível clássica de donepezila/galantamina","met":{"tp":"Não-hepático","en":["colinesterases"],"tx":"Não-hepático — hidrólise pelas colinesterases no local de ação. Participação hepática mínima.","pc":{"colinesterases":"maior parte — hidrólise no local de ação"},"vr":"Hidrólise pelas colinesterases no local de ação — hepático mínimo"},"pos":{"mv":"~1-2h (mas efeito farmacodinâmico prolongado, pela ligação à colinesterase)","pos":"Alzheimer/Parkinson leve-moderado: inicial 1,5mg 2x/dia; titular a cada 2 semanas; usual 6-12mg/dia dividido; máximo 12mg/dia (oral) ou 13,3mg/dia (adesivo transdérmico)","iv":"2x/dia (oral) ou 1x/dia (adesivo transdérmico)","ap":"Exelon (Novartis) — cápsulas 1,5/3/4,5/6mg; solução oral 2mg/mL. Exelon Patch 5/10/15 — 4,6/9,5/13,3mg/24h. Vivencia Patch (Aché) — 4,6mg/24h (9mg) e 13,3mg/24h (27mg). Genéricos em cápsulas (Aché, Ranbaxy)"},"rx":[{"r":"AChE","t":"ant","s":4,"et":"Aumento da ACh → melhora da função cognitiva e da memória","ea":"Relaxamento de esfíncter; diarreia; aumento de secreções (sudorese, sialorreia); bradicardia"},{"r":"BuChE","t":"ant","s":4,"et":"Aumento do ACh central → melhora da função cognitiva e da memória (papel maior conforme a doença avança e a AChE perde densidade)","ea":"Náuseas; êmese; diarreia; tontura; cefaleia"}]},{"id":"sertralina","nome":"Sertralina","classe":"ISRS","nc":"Zoloft / Tolrest / Assert","obs":null,"met":{"tp":"Hepático","en":["CYP2C19","CYP2B6","CYP2D6","CYP2C9","CYP3A4","UGT2B7"],"tx":"Hepático, por múltiplas vias redundantes — CYP2C19 e CYP2B6 (N-desmetilação), CYP2D6/2C9/3A4 (menores), MAO-A e MAO-B (desaminação oxidativa) e glicuronidação. Via de glicuronidação: N-carbamoil-glucuronidação direta, mais rápida pela UGT2B7 (Km ~50 micromol/L); os metabólitos desaminados também são conjugados. Sertralina inalterada não é detectável na urina. A redundância de vias torna a farmacocinética robusta: nenhum polimorfismo isolado a altera de forma marcante. Inibidor leve-moderado de CYP2D6 em doses altas.","pc":{"CYP2C19":"maior parte (N-desmetilação)","CYP2B6":"maior parte (N-desmetilação)","CYP2D6":"menor parte","CYP2C9":"menor parte","CYP3A4":"menor parte","UGT2B7":"menor parte (N-carbamoil-glucuronídeo)"},"vr":"Vias redundantes, nenhuma dominante: N-desmetilação (CYP2C19/2B6) · desaminação oxidativa (MAO-A e MAO-B) · glicuronidação (UGT2B7)"},"pos":{"mv":"~26h","pos":"Inicial 50mg/dia; usual 50-200mg/dia; máximo 200mg/dia","iv":"1x/dia","ap":"Zoloft (Pfizer) — comprimidos revestidos 50/100mg. Tolrest (Aché) — 25/75mg. Similares: Assert, Serenata (Torrent), Dieloft, Zysertin, Afetus, Ralzin. Genéricos. Só comprimidos no Brasil — sem solução oral"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"DAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"σ1","t":"ant","s":3,"et":"Ansiolítico; auxilia em sintomas depressivos psicóticos; papel clínico menos claro que o dos agonistas — pode até reduzir os benefícios pró-cognitivos observados com agonistas σ1 em combinação (sertralina)","ea":"Não caracterizado isoladamente"}]},{"id":"solrianfetol","nome":"Solrianfetol","classe":"IRND","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 95% excretado inalterado. Hepático mínimo.","vr":"Renal 95% inalterado · hepático mínimo"},"pos":{"mv":"~7,1h","pos":"Sonolência excessiva (narcolepsia/apneia do sono): inicial 75mg/dia (manhã); titular; usual 75-150mg/dia; máximo 150mg/dia","iv":"1x/dia (manhã)","ap":"SEM REGISTRO NA ANVISA — Sunosi não comercializado no Brasil, confirmado pela Associação Brasileira de Narcolepsia (ABRANHI)"},"rx":[{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"sulpirida","nome":"Sulpirida","classe":"Antipsicótico atípico (AP 2ª G)","nc":"Equilid","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — mesmo padrão da amissulprida, hepático mínimo.","vr":"Renal predominante · hepático mínimo"},"pos":{"mv":"~8h","pos":"Baixa dose (efeito antidepressivo/dispepsia funcional): 50-150mg/dia. Alta dose (antipsicótico): 400-800mg/dia; máximo 1600mg/dia","iv":"1-2x/dia (dose baixa) ou 2-3x/dia (dose alta)","ap":"Equilid — cápsulas 50mg e comprimidos 200mg, caixas com 20"},"rx":[{"r":"D2","t":"ant","s":2,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":2,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"}]},{"id":"suvorexant","nome":"Suvorexant","classe":"Inibidor Orexinas","nc":"Não tem no Brasil","obs":"Ki OX1R=0,55nM / Ki OX2R=0,35nM — afinidades praticamente equivalentes (diferença <2x), antagonista duplo não-seletivo","met":{"tp":"Hepático","en":["CYP3A4","CYP2C19"],"tx":"Hepático — CYP3A4 (ajuste de dose com inibidores, conforme bula), CYP2C19 (menor).","pc":{"CYP3A4":"maior parte","CYP2C19":"menor parte"}},"pos":{"mv":"~12h","pos":"Insônia: 10-20mg imediatamente antes de deitar; máximo 20mg/dia","iv":"1x/dia (ao deitar)","ap":"Sem registro na Anvisa — Belsomra não comercializado no Brasil"},"rx":[{"r":"OX1","t":"ant","s":5,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"},{"r":"OX2","t":"ant","s":5,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"}]},{"id":"thc","nome":"THC","classe":"Agonista canabinoide","nc":"Mevatyl","obs":" Ki na faixa nM — agonista parcial de eficácia intrínseca baixa-moderada em relação aos endocanabinoides (anandamida, 2-AG) e a agonistas sintéticos de referência (CP55940)","met":{"tp":"Hepático","en":["CYP2C9","CYP3A4","UGT1A1","UGT1A3","UGT1A9"],"tx":"Hepático — CYP2C9 e CYP3A4. Metabólito ativo 11-OH-THC (mais potente por via oral — explica a diferença entre uso inalado e oral). Conjugação subsequente por UGT: o THC-COOH-glucuronídeo é o principal metabólito urinário (UGT1A1/UGT1A3; UGT1A9 atua no 11-OH-THC). Inibição fraca-moderada de CYP3A4/2C9 relatada em alguns estudos.","pc":{"CYP2C9":"maior parte","CYP3A4":"menor parte","UGT1A1":"conjugação do THC-COOH (principal metabólito urinário)","UGT1A3":"conjugação do THC-COOH","UGT1A9":"conjugação do 11-OH-THC"},"vr":"CYP2C9/CYP3A4 (oxidação) → conjugação por UGT; THC-COOH-glucuronídeo é o principal metabólito urinário"},"pos":{"mv":"~1-3h (fumado/vaporizado); ~4-6h se ingerido por via oral (mas efeito clínico pode ser mais prolongado pelo metabólito ativo 11-OH-THC)","pos":"Uso medicinal (produtos à base de Cannabis): dose extremamente variável conforme formulação e indicação; sem posologia padronizada única — depende do produto registrado/prescrito individualmente","iv":"Variável conforme via de administração e produto","ap":"Produtos à base de Cannabis (óleos, extratos) disponíveis no Brasil via prescrição e importação/RDC específica da Anvisa (não como \"THC\" isolado com apresentação padronizada)"},"rx":[{"r":"CB1","t":"agp","s":3,"et":"Analgesia, redução das náuseas, aumento do apetite; sonolência","ea":"Prejuízo de memória; prejuízo de função executiva; prejuízo de atenção; aumento de ansiedade; paranoia; dependência; lentificação psicomotora; sonolência"},{"r":"CB2","t":"agp","s":2,"et":"Papel predominantemente imunomodulador/anti-inflamatório periférico; contribuição central pouco caracterizada","ea":"Não bem caracterizado isoladamente"}]},{"id":"topiramato","nome":"Topiramato","classe":"Anticonvulsivante","nc":"Topamax / Amato / Égide","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 70% inalterado em dose baixa; hepático ganha relevância em dose alta. Inibidor fraco de CYP2C19 e indutor fraco/dose-dependente de CYP3A4.","vr":"Renal 70% inalterado em dose baixa · hepático ganha peso em dose alta"},"pos":{"mv":"~21h","pos":"Epilepsia/enxaqueca: inicial 25mg/dia; titular lentamente (1-2 semanas); usual 100-400mg/dia; máximo 400mg/dia","iv":"1-2x/dia","ap":"Topamax (Janssen) — comprimidos 25/50/100mg. Similares: Amato, Égide, Têmpora, Arasid, Ritop. Genéricos"},"rx":[{"r":"GABA-A","t":"agp","s":2,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"},{"r":"Canal Na+","t":"ant","s":4,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"},{"r":"Canal de K+","t":"ant","s":3,"et":"—","ea":"Alargamento do QT (hERG) — risco de arritmia, classe de efeito adverso, não terapêutico"},{"r":"Anidrase Carbônica","t":"ant","s":4,"et":"Perda de peso; perda de apetite (efeito colateral às vezes usado terapeuticamente — ex. topiramato para obesidade off-label)","ea":"Parestesia; acidose metabólica; nefrolitíase"},{"r":"Receptor Caianato","t":"ant","s":4,"et":"Redução da neurotransmissão glutamatérgica excitatória — contribui para o efeito anticonvulsivante e estabilizador de humor do topiramato","ea":"Lentificação cognitiva, parestesias (mecanismo compartilhado com outros efeitos do topiramato)"}]},{"id":"tranilcipromina","nome":"Tranilcipromina","classe":"IMAO irreversível não-seletivo","nc":"Parnate","obs":"Inibição IRREVERSÍVEL: o efeito não termina com a eliminação do fármaco, e sim com a ressíntese da enzima — daí a necessidade de wash-out de ~2 semanas ao trocar para/de outros serotoninérgicos (e de 5 semanas quando o fármaco anterior é fluoxetina, pela meia-vida da norfluoxetina). Exige restrição dietética de tiramina (queijos curados, embutidos, fermentados, extratos de levedura, chope) pelo risco de crise hipertensiva. Contraindicada com ISRS/IRSN, tricíclicos, triptanos, tramadol, dextrometorfano, linezolida, simpatomiméticos e demais IMAO.","met":{"tp":"Hepático","en":["CYP2A6"],"tx":"Metabolização hepática, com CYP2A6 como principal enzima responsável (a tranilcipromina é substrato e, ao mesmo tempo, inibidor potente e competitivo dessa via — Ki ≈ 0,08 µM). Excreção predominantemente urinária. Atenção: o risco real do fármaco é FARMACODINÂMICO (crise hipertensiva por tiramina/simpatomiméticos e síndrome serotoninérgica), não a competição por CYP.","pc":{"CYP2A6":"maior parte"}},"pos":{"mv":"Meia-vida farmacocinética ~2h (1,5-3,2h), mas meia-vida FARMACODINÂMICA de ~1 semana — a inibição é irreversível e o efeito só cessa com a ressíntese da MAO (~2 semanas para recuperação enzimática completa)","pos":"Depressão: iniciar 20mg/dia (10mg pela manhã + 10mg à tarde). Sem resposta satisfatória após 2 semanas, pode-se acrescentar 10mg ao meio-dia, mantendo a dose por ao menos 1 semana. Manutenção: 10-20mg/dia; faixa usual até 30mg/dia. Doses de 40-60mg/dia acrescentam inibição da recaptação de noradrenalina, mas elevam o risco pressórico.","iv":"2-3x/dia (manhã, meio-dia e tarde) — evitar dose noturna pelo efeito ativador","ap":"Parnate (GSK) — comprimidos revestidos 10mg, embalagem com 20"},"rx":[{"r":"MAO-A","t":"ant","s":5,"et":"Bloqueio irreversível da degradação de serotonina, noradrenalina e dopamina — mecanismo antidepressivo principal; eficácia consolidada em depressão refratária e em depressão com características atípicas.","ea":"Crise hipertensiva na ingestão de tiramina ou de simpatomiméticos (\"reação do queijo\") — é a inibição da MAO-A intestinal/hepática que impede a degradação da tiramina da dieta; risco de síndrome serotoninérgica grave em associação com serotoninérgicos; hipotensão ortostática (paradoxalmente comum)."},{"r":"MAO-B","t":"ant","s":5,"et":"Aumenta dopamina e aminas traço (feniletilamina, a \"anfetamina endógena\") — contribui para o componente ativador/pró-energético e para o efeito na anedonia.","ea":"Insônia e ativação, sobretudo com dose vespertina/noturna; contribui para o potencial de abuso/dependência descrito com a tranilcipromina."},{"r":"NAT","t":"inib","s":2,"et":"Inibição adicional da recaptação de noradrenalina que emerge em doses mais altas (40-60mg/dia) — mecanismo suplementar ao bloqueio da MAO.","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil."},{"r":"DAT","t":"inib","s":1,"et":"Liberação dopaminérgica fraca (efeito tipo anfetamina, decorrente da estrutura química) — contribuição secundária ao perfil ativador.","ea":"Insônia, supressão do apetite; componente que ajuda a explicar os relatos de dependência farmacológica à tranilcipromina."}]},{"id":"trazodona","nome":"Trazodona","classe":"AIRS","nc":"Donaren / Donaren Retard / Inseris XR","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 (principal), CYP2D6 (menor). Metabólito ativo mCPP (menos potente, atividade 5-HT2C própria).","pc":{"CYP3A4":"maior parte","CYP2D6":"menor parte"}},"pos":{"mv":"Bifásica: ~3-6h (fase inicial) + 5-9h (fase terminal), IR; XR tem perfil de absorção mais lento","pos":"Insônia: 25-100mg; Depressão: inicial 150mg/dia, usual 150-400mg/dia, máximo 400mg/d (ambulatorial) ou 600mg/d (internado)","iv":"1x/dia (à noite) para insônia; 2-3x/dia para depressão","ap":"Donaren (Apsen) — comprimidos 50/100mg; Donaren Retard 150/300mg. Inseris XR. Similares: Loredon, Tradep, Andhora, Sonic, Motraz, Azod. Genéricos"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"SERT","t":"inib","s":1,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":1,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"valproato","nome":"Valproato","classe":"Estabilizador / Anticonvulsivante","nc":"Depakene / Depakote / Epilenil","obs":null,"met":{"tp":"Hepático","en":["UGT2B7","UGT1A4","CYP2C9","CYP2C19","CYP2A6"],"tx":"Hepático — glicuronidação (30-50%; UGT2B7 com a maior depuração intrínseca, UGT1A4/1A8/1A10 também ativas), beta-oxidação mitocondrial (40%), CYP2C9/2C19/2A6 (10-15%). Inibidor de UGT (UGT2B7 e UGT1A4 — ex.: lamotrigina, lorazepam), de epóxido-hidrolase (acúmulo de carbamazepina-10,11-epóxido) e inibidor fraco de CYP2C9.","pc":{"UGT2B7":"maior parte da glicuronidação","UGT1A4":"parte da glicuronidação","CYP2C9":"menor parte","CYP2C19":"menor parte","CYP2A6":"menor parte"},"vr":"Glicuronidação 30-50% · beta-oxidação mitocondrial 40% · CYP 10-15%"},"pos":{"mv":"~9-16h","pos":"Estabilizador de humor: inicial 250-500mg/dia; titular; usual 1000-2000mg/dia (15-60mg/kg/dia); monitorização de nível sérico recomendada","iv":"2-3x/dia (ou 1x/dia para ER)","ap":"Ácido valproico: Depakene (Abbott) — cápsulas 250mg, comprimidos 300/500mg, xarope 250mg/5mL (50mg/mL), frasco 100mL; Epilenil (Biolab) 500mg; Lavie (Prati) xarope 50mg/mL; genéricos. Divalproato: Depakote — comprimidos 250/500mg; Depakote ER 250/500mg; Depakote Sprinkle 125mg; Leps ER (Torrent); genéricos"},"rx":[{"r":"GABA-T","t":"ant","s":1,"et":"Aumenta a disponibilidade de GABA ao inibir sua degradação enzimática — contribui para o efeito anticonvulsivante/estabilizador do valproato","ea":"Efeito mecanístico modesto frente aos demais mecanismos do valproato — sem perfil adverso isolado bem caracterizado"},{"r":"Canal Na+","t":"ant","s":2,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"GSK-3β","t":"ant","s":1,"et":"Neuroplasticidade; neuroproteção (lítio, valproato)","ea":"Anomalia de Ebstein — má formação da válvula tricúspide fetal (lítio, teratogenicidade)"},{"r":"HDAC","t":"ant","s":2,"et":"Contribui para o efeito estabilizador de humor e neuroplástico do valproato (mecanismo epigenético — acetilação de histonas)","ea":"Hipótese de contribuição para teratogenicidade (defeitos de tubo neural)"}]},{"id":"vareniclina","nome":"Vareniclina","classe":"Antitabágico (agonista nicotínico)","nc":"Champix","obs":" Ki subnanomolar (afinidade extrema) — mecanismo terapêutico central (cessação tabágica): eficácia parcial de ~20-45% relativa à nicotina/epibatidina, permitindo alívio de fissura/abstinência (ativação parcial) e bloqueio competitivo da ativação total por nicotina se o paciente fumar","met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 92% excretado inalterado. Hepático mínimo.","vr":"Renal 92% inalterado"},"pos":{"mv":"~24h","pos":"Cessação tabágica: inicial 0,5mg 1x/dia (dias 1-3), depois 0,5mg 2x/dia (dias 4-7), depois 1mg 2x/dia (a partir do dia 8); duração usual de 12 semanas","iv":"1-2x/dia (titulação inicial)","ap":"Champix (Pfizer) — comprimidos 0,5mg e 1mg; kit de início (0,5 + 1mg) e caixa de manutenção 1mg"},"rx":[{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"nAChR α4β2","t":"agp","s":5,"et":"Alívio parcial da fissura/abstinência de nicotina + bloqueio competitivo do reforço se o paciente fumar (mecanismo central da vareniclina na cessação tabágica)","ea":"Náusea (efeito mais comum); alterações de humor/ideação (alerta pós-comercialização); sonhos vívidos, insônia"},{"r":"nAChR α7","t":"agt","s":6,"et":"Papel secundário/menos caracterizado clinicamente na cessação tabágica; possível contribuição cognitiva","ea":"Não bem caracterizado isoladamente"}]},{"id":"venlafaxina","nome":"Venlafaxina","classe":"IRSN","nc":"Efexor XR / Venlaxin / Alenthus XR / Venforin","obs":"Relação Ki SERT:NAT ≈30:1 — em baixa dose (≤150mg/d) comporta-se essencialmente como ISRS; inibição de NAT clinicamente relevante só surge em doses mais altas (ocupação de NAT não aumenta além de ~150mg/d)","met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 (metabólito ativo desvenlafaxina, potência semelhante) e CYP3A4 (menor). Inibidor fraco de CYP2D6.","pc":{"CYP2D6":"maior parte","CYP3A4":"menor parte"}},"pos":{"mv":"~5h (droga-mãe); desvenlafaxina ~11h","pos":"Inicial 37,5-75mg/dia (XR); usual 75-225mg/dia; máximo 375mg/dia","iv":"1x/dia (XR)","ap":"Efexor XR (Viatris) — cápsulas de liberação prolongada 37,5/75/150mg. Similares XR: Veniz XR (Sun), Venlaxin XR (Eurofarma), Vensate LP (Cristália), Venlift OD (Torrent), Alenthus XR (Medley), Myletin, Venforin. Liberação imediata: comprimidos 37,5/75mg (genéricos) e Venlaxin 150mg"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"vilazodona","nome":"Vilazodona","classe":"APIRS","nc":"Aymee","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2C19","CYP2D6"],"tx":"Hepático — CYP3A4 (70%), CYP2C19 e CYP2D6 (menores). Tomar com alimento (absorção).","pc":{"CYP3A4":"~70%","CYP2C19":"menor parte","CYP2D6":"menor parte"}},"pos":{"mv":"~25h","pos":"Inicial 10mg/dia (com alimento); usual 20-40mg/dia; máximo 40mg/dia","iv":"1x/dia (com alimento)","ap":"Aymee (Libbs) — comprimidos 10mg (caixa com 7), 20mg e 40mg (caixas com 30)"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"}]},{"id":"viloxazina","nome":"Viloxazina","classe":"IRSN com inibição 5ht","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","UGT1A9","UGT2B15"],"tx":"Hepático — CYP2D6 (<50%, polimorfismo com impacto modesto) + UGT1A9/UGT2B15. Inibidor potente de CYP1A2, moderado de CYP2D6 e fraco-moderado de CYP3A4 (ex.: teofilina, contraindicada).","pc":{"CYP2D6":"<50%","UGT1A9":"parte relevante","UGT2B15":"parte relevante"}},"pos":{"mv":"IR: 2-5h; ER (Qelbree): ~7h","pos":"TDAH: inicial 100mg/dia (crianças) ou 200mg/dia (adultos); titular; usual 100-400mg/dia (crianças) ou 200-600mg/dia (adultos); máximo 400mg/dia (crianças) ou 600mg/dia (adultos)","iv":"1x/dia (manhã)","ap":"Sem registro na Anvisa — Qelbree (aprovado no FDA em 2021) não é comercializado no Brasil"},"rx":[{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"agp","s":4,"et":"Contribui para efeito no TDAH/humor via modulação da liberação de NE/DA no córtex pré-frontal (mecanismo da viloxazina, distinto do antagonismo clássico usado por outros agentes)","ea":"Perfil adverso menos caracterizado isoladamente que o do antagonismo"},{"r":"NAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"vortioxetina","nome":"Vortioxetina","classe":"Multimodal serotoninérgico","nc":"Brintellix / Voextor / VOD / Evortia","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4","CYP3A5","CYP2C9","CYP2C19","CYP2A6","CYP2C8","CYP2B6"],"tx":"Hepático — CYP2D6 (principal), com CYP3A4, CYP3A5, CYP2C9, CYP2C19, CYP2A6, CYP2C8 e CYP2B6 (vias secundárias — reduz dependência de uma única via).","pc":{"CYP2D6":"maior parte","CYP3A4":"menor parte","CYP3A5":"menor parte","CYP2C9":"menor parte","CYP2C19":"menor parte","CYP2A6":"menor parte","CYP2C8":"menor parte","CYP2B6":"menor parte"}},"pos":{"mv":"~66h","pos":"Inicial 10mg/dia; usual 10-20mg/dia; máximo 20mg/dia","iv":"1x/dia","ap":"Brintellix (Lundbeck) — comprimidos 5/10/15/20mg. Similares: Voextor (Libbs), VOD (Eurofarma), Evortia (Mantecorp), Môdulix (Althaia)"},"rx":[{"r":"5-HT1A","t":"agt","s":6,"et":"Mesmo espectro de efeito do agonismo parcial, com eficácia intrínseca máxima — potencial ganho pró-cognitivo/antidepressivo adicional","ea":"Mesmo perfil do agonismo parcial; risco teórico maior de contribuir para síndrome serotoninérgica em associação com outros serotoninérgicos"},{"r":"5-HT1B","t":"agp","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT3","t":"ant","s":4,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"}]},{"id":"xanomelina","nome":"Xanomelina","classe":"Agonista colinérgico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Hepático e renal combinados (uso associado à trospiquina, predominantemente renal). Isoenzima CYP ainda pouco caracterizada.","vr":"Hepático e renal combinados (uso com trospiquina, predominantemente renal) — CYP pouco caracterizado"},"pos":{"mv":"Dados de xanomelina isolada: ~3-4h; formulação combinada com trospiquina tem perfil próprio","pos":"Esquizofrenia: inicial 50mg/20mg (xanomelina/trospiquina) 2x/dia; titular; usual 125mg/30mg 2x/dia; máximo 125mg/30mg 2x/dia","iv":"2x/dia","ap":"SEM REGISTRO NA ANVISA — Cobenfy (aprovação FDA 2024) disponível apenas por importação, sem previsão de chegada ao Brasil"},"rx":[{"r":"M1","t":"agp","s":4,"et":"Pró-cognitivo (memória); antipsicótico (xanomelina)","ea":"Náuseas; dispepsia; sudorese"},{"r":"M2","t":"agp","s":1,"et":"Papel secundário frente ao M1/M4 no mecanismo pró-cognitivo/antipsicótico da xanomelina","ea":"Mesmo perfil colinérgico (náusea, sudorese), com possível bradicardia paradoxal"},{"r":"M3","t":"agp","s":1,"et":"Papel secundário frente ao M1/M4 no mecanismo da xanomelina","ea":"Mesmo perfil colinérgico (náusea, sudorese)"},{"r":"M4","t":"agp","s":4,"et":"Antipsicótico (reduz atividade dopaminérgica na via mesolímbica) — mecanismo central da xanomelina; também descrito no metabólito norclozapina (hipersalivação paradoxal da clozapina)","ea":"Náuseas; dispepsia; sudorese; hipersalivação (efeito paradoxal descrito com norclozapina)"},{"r":"M5","t":"agp","s":1,"et":"Papel pouco caracterizado clinicamente","ea":"Não caracterizado isoladamente"}]},{"id":"ziprasidona","nome":"Ziprasidona","classe":"Antipsicótico atípico","nc":"Geodon","obs":null,"met":{"tp":"Hepático","en":["aldeído oxidase","CYP3A4"],"tx":"Hepático — aldeído oxidase (2/3 da dose, via não-CYP) + CYP3A4 (1/3).","pc":{"aldeído oxidase":"~2/3 da dose","CYP3A4":"~1/3 da dose"},"vr":"Aldeído oxidase ~2/3 da dose (não-CYP) · CYP3A4 ~1/3"},"pos":{"mv":"~7h (droga-mãe); metabólito ativo pouco relevante","pos":"Inicial 20mg/dia (com alimento, ≥500kcal); usual 40-80mg/dia; máximo 80mg/dia (oral). Também disponível IM (uso agudo/agitação)","iv":"1x/dia (com alimento) ou 2x/dia dividida","ap":"Geodon (Viatris) — cápsulas 40mg e 80mg, caixas com 14/30"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":4,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":1,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"SERT","t":"inib","s":1,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"zolpidem","nome":"Zolpidem","classe":"Fármaco Z","nc":"Stilnox / Patz SL / Nuit Flash","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP1A2","CYP2C9"],"tx":"Hepático — CYP3A4 (principal), CYP1A2/2C9 (menores).","pc":{"CYP3A4":"maior parte","CYP1A2":"menor parte","CYP2C9":"menor parte"}},"pos":{"mv":"~2,5h","pos":"Insônia: 5-10mg imediatamente antes de deitar (dose reduzida para 5mg em mulheres, por metabolismo mais lento); máximo 10mg/dia","iv":"1x/dia (ao deitar)","ap":"Stilnox (Sanofi) — comprimidos 10mg; Stilnox CR 6,25/12,5mg. Patz SL (EMS) — sublingual 5/10mg; Patz gotas 10mg/mL. Nuit Flash (Biolab) — orodispersível 5mg. Zolfest — spray oral 25mg/mL. Similares: Riposo SL, Stilram SL, Lune, Turno, Zolrem, Zoup, Zylinox, Zolpaz, Hizolp, Insonox, Isoy, Noctiden, Prompt. Genéricos"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"Efeito hipnótico com menor efeito ansiolítico/miorrelaxante que os BZDs clássicos (seletividade α1 — zolpidem/zaleplona); eszopiclona menos seletiva, mais próxima do perfil clássico","ea":"Sonolência residual, amnésia anterógrada em dose alta, parassonias (sonambulismo)"}]}]};

/* ---------------- ligação à albumina — valproato ---------------- */
const ALBUMIN = {
  geral:
    "O valproato liga-se fortemente à albumina (~90% ligado), mas de forma saturável e não-linear: em concentrações mais altas os sítios de ligação se saturam e a fração livre (ativa) sobe desproporcionalmente — de ~10% para até ~50% dentro da faixa terapêutica alta. Ocupa dois sítios na albumina, compartilhados com outros fármacos: o \"sítio da varfarina\" e o \"sítio do diazepam\".",
  risco:
    "Hipoalbuminemia (hepatopatia, doença renal, desnutrição, idosos, gestação) reduz a proteína disponível e eleva a fração livre de valproato mesmo com nível sérico total \"normal\" — risco de toxicidade não detectado se só o total for dosado.",
  specific: {
    diazepam:
      "Diazepam compete pelo mesmo sítio de ligação (\"sítio do diazepam\") na albumina — aumenta a fração livre de ambos, com risco de potencialização do efeito sedativo, especialmente em uso agudo ou hipoalbuminemia.",
    fenitoina:
      "Fenitoína é o caso clássico, e é duplo: o valproato a desloca da albumina E inibe seu catabolismo hepático. O nível TOTAL de fenitoína cai, enquanto a fração livre (ativa) sobe em 60-100% — pode haver intoxicação com nível total \"normal\" ou até baixo. Nesta combinação o nível total não serve: dosar a fração livre. Monitorar também hiperamonemia.",
  },
  generico:
    "Princípio geral: valproato pode deslocar (e ser deslocado por) outros fármacos de alta ligação proteica pelo mesmo mecanismo — salicilatos (↑ até 4x a fração livre do próprio valproato, com inibição adicional da beta-oxidação) e varfarina. Não são psicofármacos desta lista, mas a coprescrição é comum.",
};

/* ---------------- inibição / indução enzimática hepática ----------------
   Cada entrada é {enzima, efeito, força} para alimentar o motor de alertas.
   Isoformas de UGT declaradas no nível em que há dado: valproato inibe
   UGT1A4 e UGT2B7 especificamente; carbamazepina e oxcarbazepina induzem UGT
   de forma ampla (string genérica "UGT", que casa com qualquer isoforma).
   valproato→CYP2C9: inibição fraca a moderada e dose-dependente. */
const ENZYME_EFFECTS = {
  valproato: [
    { enzyme: "UGT1A4", effect: "inibidor", strength: "moderado-forte", obs: "aumenta muito os níveis de lamotrigina — costuma exigir redução de dose" },
    { enzyme: "UGT2B7", effect: "inibidor", strength: "moderado", obs: "mesma isoforma que o valproato usa — há competição além da inibição" },
    { enzyme: "epóxido-hidrolase", effect: "inibidor", strength: "moderado", obs: "acúmulo do metabólito ativo/tóxico carbamazepina-10,11-epóxido" },
    { enzyme: "CYP2C9", effect: "inibidor", strength: "fraco-moderado", obs: "dose/concentração-dependente" },
  ],
  carbamazepina: [
    { enzyme: "CYP3A4", effect: "indutor", strength: "forte", obs: "autoindução nas primeiras semanas de uso" },
    { enzyme: "CYP1A2", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C9", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C19", effect: "indutor", strength: "moderado" },
    { enzyme: "UGT", effect: "indutor", strength: "moderado", obs: "indução ampla de UGT (1A1, 2B7, 2B15) — ex.: reduz níveis de lamotrigina em até ~40%" },
  ],
  oxcarbazepina: [
    { enzyme: "CYP3A4", effect: "indutor", strength: "moderado" },
    { enzyme: "UGT", effect: "indutor", strength: "moderado", obs: "indução de UGT descrita em bula (dose-dependente, mais relevante acima de 1200 mg/dia)" },
    { enzyme: "CYP2C19", effect: "inibidor", strength: "fraco" },
  ],
  topiramato: [
    { enzyme: "CYP2C19", effect: "inibidor", strength: "fraco" },
    { enzyme: "CYP3A4", effect: "indutor", strength: "fraco", obs: "dose-dependente, relevante em dose alta" },
  ],
  fenobarbital: [
    { enzyme: "CYP2B6", effect: "indutor", strength: "forte" },
    { enzyme: "CYP3A4", effect: "indutor", strength: "forte", obs: "indução se instala em 2-3 semanas e regride em 2-4 semanas após suspender" },
    { enzyme: "CYP1A2", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2A6", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C9", effect: "indutor", strength: "fraco" },
    { enzyme: "CYP2C19", effect: "indutor", strength: "fraco" },
    { enzyme: "CYP2E1", effect: "indutor", strength: "fraco" },
    { enzyme: "UGT", effect: "indutor", strength: "moderado", obs: "reduz níveis de lamotrigina, valproato e outros substratos de UGT" },
  ],
  fenitoina: [
    { enzyme: "CYP2B6", effect: "indutor", strength: "forte" },
    { enzyme: "CYP3A4", effect: "indutor", strength: "forte", obs: "quetiapina pode precisar de mais de 5x a dose, lurasidona ~5x, clozapina e olanzapina 2-4x" },
    { enzyme: "CYP1A2", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2A6", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C9", effect: "indutor", strength: "fraco-moderado" },
    { enzyme: "CYP2C19", effect: "indutor", strength: "fraco-moderado" },
    { enzyme: "UGT", effect: "indutor", strength: "moderado", obs: "reduz níveis de lamotrigina e de outros substratos de UGT" },
  ],
  fluoxetina: [
    { enzyme: "CYP2D6", effect: "inibidor", strength: "forte" },
    { enzyme: "CYP2C9", effect: "inibidor", strength: "moderado" },
    { enzyme: "CYP2C19", effect: "inibidor", strength: "moderado" },
    { enzyme: "CYP3A4", effect: "inibidor", strength: "moderado" },
  ],
  fluvoxamina: [
    { enzyme: "CYP1A2", effect: "inibidor", strength: "forte", obs: "o mais potente entre os ISRS — ex.: ↑ muito clozapina, teofilina, cafeína" },
    { enzyme: "CYP2C19", effect: "inibidor", strength: "forte" },
    { enzyme: "CYP3A4", effect: "inibidor", strength: "moderado" },
    { enzyme: "CYP2C9", effect: "inibidor", strength: "moderado" },
  ],
  paroxetina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "forte", obs: "o mais potente entre os ISRS — satura por autoinibição" }],
  sertralina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco-moderado", obs: "mais relevante em doses altas" }],
  escitalopram: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco-moderado" }],
  bupropiona: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "forte", obs: "ex.: reduz conversão de tamoxifeno em endoxifeno" }],
  duloxetina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "moderado" }],
  venlafaxina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  viloxazina: [
    { enzyme: "CYP1A2", effect: "inibidor", strength: "forte", obs: "ex.: teofilina — contraindicado" },
    { enzyme: "CYP2D6", effect: "inibidor", strength: "moderado" },
    { enzyme: "CYP3A4", effect: "inibidor", strength: "fraco-moderado" },
  ],
  asenapina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco-moderado" }],
  levomepromazina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  haloperidol: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "moderado" }],
  clorpromazina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  amitriptilina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  clomipramina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  imipramina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  doxepina: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  modafinila: [
    { enzyme: "CYP3A4", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP1A2", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C19", effect: "inibidor", strength: "fraco-moderado" },
  ],
  "lisdexanfetamina-anfetaminas": [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco" }],
  clobazam: [{ enzyme: "CYP2D6", effect: "inibidor", strength: "fraco", obs: "cautela com dextrometorfano, pimozida, paroxetina, nebivolol" }],
  tranilcipromina: [{ enzyme: "CYP2A6", effect: "inibidor", strength: "forte", obs: "inibidor competitivo potente; em dose terapêutica é praticamente a única via CYP inibida de forma relevante" }],
  thc: [
    { enzyme: "CYP3A4", effect: "inibidor", strength: "fraco-moderado", obs: "evidência limitada (poucos estudos)" },
    { enzyme: "CYP2C9", effect: "inibidor", strength: "fraco-moderado", obs: "evidência limitada (poucos estudos)" },
  ],
};

/* ---------------- uso em gestação ----------------
   Três níveis: "contra" (contraindicação formal, regulatória ou por
   teratogenicidade estabelecida), "relativa" (decisão de risco-benefício —
   usar quando a indicação justifica, com a ressalva descrita) e "sem"
   (sem contraindicação). Nenhum psicofármaco desta lista está em "sem":
   todos exigem decisão caso a caso, e essa é a leitura clínica, não uma
   lacuna de preenchimento. */
const RISCO_NIVEIS = {
  contra: { rotulo: "Contraindicação", tier: "red" },
  relativa: { rotulo: "Contraindicação relativa", tier: "amber" },
  sem: { rotulo: "Sem contraindicação", tier: "green" },
};
const GESTACAO_NIVEIS = RISCO_NIVEIS;
const GESTACAO = {
  valproato: { n: "contra", t: "Contraindicado na gravidez (EMA/Anvisa). Malformação em ~10% (vs 2-3%) e alteração do neurodesenvolvimento em 30-40% dos expostos. Em idade fértil exige programa de prevenção de gravidez. No transtorno bipolar e na enxaqueca a contraindicação não tem exceção." },
  topiramato: { n: "contra", t: "Contraindicado na gravidez para enxaqueca e controle de peso; na epilepsia, apenas se não houver alternativa. Malformação em 4-9% (vs 1-3%), incluindo fenda oral e restrição de crescimento. Exige contracepção eficaz até 4 semanas após parar." },
  tranilcipromina: { n: "contra", t: "IMAO irreversível: dados em gestação praticamente inexistentes e risco de crise hipertensiva, agravado pela interação com simpatomiméticos e tocolíticos usados em obstetrícia." },
  modafinila: { n: "contra", t: "Não deve ser usada na gravidez e exige contracepção eficaz (alerta EMA/INFARMED 2019 — risco de malformação congênita maior)." },
  thc: { n: "contra", t: "Restrição de crescimento fetal, baixo peso ao nascer e efeito sobre o neurodesenvolvimento. Sem indicação que justifique exposição." },
  carbamazepina: { n: "relativa", t: "Defeito de fechamento do tubo neural e doença hemorrágica do recém-nascido. Evitar se houver alternativa; se mantida, ácido fólico 5mg/dia e vitamina K no termo." },
  fenitoina: { n: "relativa", t: "Fenda oral, hipospádia, defeito cardiovascular e doença hemorrágica do recém-nascido — risco persiste apesar do ácido fólico. Evitar se houver alternativa." },
  fenobarbital: { n: "relativa", t: "Fenda oral, malformação cardíaca e urogenital, doença hemorrágica do recém-nascido. Entre os anticonvulsivantes de risco intermediário." },
  oxcarbazepina: { n: "relativa", t: "Risco de malformação menor que o da carbamazepina, mas os dados são menos robustos que os da lamotrigina." },
  litio: { n: "relativa", t: "Anomalia de Ebstein no 1º trimestre (risco absoluto baixo, bem menor do que se pensava) e, no termo, letargia, hipotonia, hipotireoidismo e diabetes insípido neonatal. Frequentemente mantido: suspender costuma trazer mais risco que seguir, com nível sérico monitorado de perto." },
  paroxetina: { n: "relativa", t: "O ISRS com pior perfil: malformação cardíaca com exposição no 1º trimestre. ACOG orienta evitar — preferir outro ISRS se a troca for viável." },
  citalopram: { n: "relativa", t: "Sinal de malformação, sobretudo cardíaca, no 1º trimestre. No 3º trimestre, síndrome de retirada neonatal e hipertensão pulmonar persistente." },
  escitalopram: { n: "relativa", t: "No 3º trimestre, síndrome de retirada neonatal e hipertensão pulmonar persistente do recém-nascido." },
  sertralina: { n: "relativa", t: "Entre os ISRS mais usados na gestação, com perfil favorável. No 3º trimestre, retirada neonatal e hipertensão pulmonar persistente." },
  fluoxetina: { n: "relativa", t: "No 3º trimestre, retirada neonatal e hipertensão pulmonar persistente. Meia-vida longa da norfluoxetina prolonga a exposição mesmo após suspender." },
  fluvoxamina: { n: "relativa", t: "Mesmo perfil de classe dos ISRS; dados em gestação mais escassos que os da sertralina e da fluoxetina." },
  vilazodona: { n: "relativa", t: "Dados humanos insuficientes para afastar risco." },
  vortioxetina: { n: "relativa", t: "Dados humanos insuficientes para afastar risco." },
  venlafaxina: { n: "relativa", t: "Síndrome de retirada neonatal no 3º trimestre. Possível associação com hipertensão gestacional." },
  desvenlafaxina: { n: "relativa", t: "Mesmo perfil da venlafaxina, da qual é o metabólito ativo." },
  duloxetina: { n: "relativa", t: "Síndrome de retirada neonatal no 3º trimestre; dados humanos limitados." },
  levominalciprana: { n: "relativa", t: "Dados humanos insuficientes." },
  minalciprana: { n: "relativa", t: "Dados humanos insuficientes." },
  bupropiona: { n: "relativa", t: "Dados conflitantes sobre malformação no 1º trimestre. É opção quando há indicação de cessação de tabagismo." },
  mirtazapina: { n: "relativa", t: "Dados observacionais sem sinal consistente de malformação; experiência menor que a dos ISRS." },
  trazodona: { n: "relativa", t: "Sem sinal consistente de teratogenicidade; dados limitados." },
  agomelatina: { n: "relativa", t: "Dados humanos insuficientes." },
  amitriptilina: { n: "relativa", t: "Tricíclico com longa experiência de uso; efeito anticolinérgico e sedativo no recém-nascido na exposição próxima ao termo." },
  nortriptilina: { n: "relativa", t: "Tricíclico com longa experiência; menos anticolinérgico que a amitriptilina. Nível sérico monitorável." },
  imipramina: { n: "relativa", t: "Tricíclico com longa experiência; sintomas anticolinérgicos e de retirada no recém-nascido." },
  clomipramina: { n: "relativa", t: "Tricíclico; descrita síndrome de retirada neonatal com exposição no 3º trimestre." },
  doxepina: { n: "relativa", t: "Tricíclico; dados em gestação escassos." },
  haloperidol: { n: "relativa", t: "Antipsicótico com a maior experiência de uso em gestação. Relato de malformação de membro com exposição no 1º trimestre; no 3º, sintomas extrapiramidais ou retirada neonatal." },
  clorpromazina: { n: "relativa", t: "Fenotiazina com longa experiência; sintomas extrapiramidais neonatais e hipotensão materna." },
  levomepromazina: { n: "relativa", t: "Mesmo perfil das fenotiazinas, com menos dados." },
  flufenazina: { n: "relativa", t: "Mesmo perfil das fenotiazinas de alta potência." },
  olanzapina: { n: "relativa", t: "Entre os atípicos mais estudados. No 3º trimestre, extrapiramidalismo ou retirada neonatal; atenção ao ganho de peso e ao diabetes gestacional." },
  quetiapina: { n: "relativa", t: "Entre os atípicos mais estudados em gestação, sem sinal consistente de malformação." },
  risperidona: { n: "relativa", t: "Dados limitados sem aumento de risco teratogênico. No 3º trimestre, extrapiramidalismo ou retirada neonatal." },
  paliperidona: { n: "relativa", t: "Metabólito ativo da risperidona, mesmo perfil. Na formulação de longa ação a exposição não é interrompível." },
  aripiprazol: { n: "relativa", t: "No 3º trimestre, extrapiramidalismo e/ou retirada neonatal, que pode exigir internação." },
  brexpiprazol: { n: "relativa", t: "Dados humanos insuficientes; perfil presumido do aripiprazol." },
  cariprazina: { n: "relativa", t: "Dados humanos insuficientes. Metabólito ativo de meia-vida de 1-3 semanas prolonga a exposição após suspender." },
  lurasidona: { n: "relativa", t: "Sem evidência animal de efeito adverso. No 3º trimestre, extrapiramidalismo ou retirada neonatal." },
  ziprasidona: { n: "relativa", t: "Dados humanos limitados." },
  asenapina: { n: "relativa", t: "Dados humanos insuficientes." },
  clozapina: { n: "relativa", t: "Mantida quando é a única opção eficaz. Atenção a agranulocitose e convulsão neonatal, diabetes gestacional e necessidade de hemograma do recém-nascido." },
  amilssulprida: { n: "relativa", t: "Hiperprolactinemia pode dificultar a concepção; dados em gestação escassos." },
  sulpirida: { n: "relativa", t: "Mesmo perfil da amissulprida." },
  lumateperona: { n: "relativa", t: "Dados humanos insuficientes." },
  pimavanserina: { n: "relativa", t: "Dados humanos insuficientes." },
  iloperidona: { n: "relativa", t: "Dados humanos insuficientes." },
  blonanserona: { n: "relativa", t: "Dados humanos insuficientes." },
  lamotrigina: { n: "relativa", t: "O anticonvulsivante de melhor perfil: risco de malformação semelhante ao da população geral até 600mg/dia. A ressalva é cinética — o clearance sobe muito na gestação e cai de forma abrupta no pós-parto, exigindo ajuste de dose e redosagem." },
  gabapentina: { n: "relativa", t: "Dados limitados; sem sinal forte de teratogenicidade." },
  pregabalina: { n: "relativa", t: "Sinal de aumento modesto de malformação maior em estudos observacionais." },
  diazepam: { n: "relativa", t: "Exposição próxima ao termo: depressão respiratória neonatal e síndrome de abstinência (irritabilidade, tremor, hiper-reflexia). Meia-vida longa dos metabólitos prolonga o efeito no recém-nascido." },
  clonazepam: { n: "relativa", t: "Mesmo perfil de classe; depressão respiratória e abstinência neonatal na exposição próxima ao termo." },
  alprazolam: { n: "relativa", t: "Mesmo perfil de classe; meia-vida curta favorece abstinência materna entre doses." },
  lorazepam: { n: "relativa", t: "Mesmo perfil de classe. Glicuronidação direta evita acúmulo de metabólito ativo — preferível em hepatopatia." },
  bromazepam: { n: "relativa", t: "Mesmo perfil de classe." },
  clobazam: { n: "relativa", t: "Mesmo perfil de classe; norclobazam de meia-vida longa prolonga a exposição neonatal." },
  zolpidem: { n: "relativa", t: "Dados limitados; evitar uso próximo ao termo pelo risco de sedação neonatal." },
  eszopiclona: { n: "relativa", t: "Dados limitados, mesmo perfil do zolpidem." },
  suvorexant: { n: "relativa", t: "Dados humanos insuficientes." },
  lemborexant: { n: "relativa", t: "Dados humanos insuficientes." },
  melatonina: { n: "relativa", t: "Dados em gestação insuficientes, apesar do uso difundido como suplemento." },
  rameltonina: { n: "relativa", t: "Dados humanos insuficientes." },
  metilfenidato: { n: "relativa", t: "Sinal de aumento pequeno de malformação cardíaca em estudos de registro. Manter só se o prejuízo funcional justificar." },
  "lisdexanfetamina-anfetaminas": { n: "relativa", t: "Risco de restrição de crescimento, pré-eclâmpsia e parto prematuro; sintomas de retirada neonatal. Suspender quando possível." },
  atomoxetina: { n: "relativa", t: "Dados humanos limitados, sem sinal consistente." },
  viloxazina: { n: "relativa", t: "Dados humanos insuficientes." },
  centanafadina: { n: "relativa", t: "Aprovação recente, sem dados em gestação." },
  "guanfacina-er": { n: "relativa", t: "Dados humanos limitados; é opção não-estimulante quando o estimulante precisa ser suspenso." },
  clonidina: { n: "relativa", t: "Longa experiência como anti-hipertensivo na gestação; atenção à hipertensão de rebote na retirada." },
  "cetamina-escetamina": { n: "relativa", t: "Dados em gestação insuficientes; neurotoxicidade em modelos animais de cérebro em desenvolvimento." },
  brexanolona: { n: "relativa", t: "A indicação é depressão pós-parto, não gestação; sem dados de uso durante a gravidez." },
  naltrexona: { n: "relativa", t: "Decisão caso a caso: o risco de recaída em uso de álcool/opioide costuma superar o do fármaco. Conferir transaminases." },
  vareniclina: { n: "relativa", t: "Dados limitados; comparar com o risco do tabagismo mantido, que é alto." },
  memantina: { n: "relativa", t: "Dados humanos insuficientes; indicação rara em idade fértil." },
  donepezila: { n: "relativa", t: "Dados humanos insuficientes; indicação rara em idade fértil." },
  galantamina: { n: "relativa", t: "Dados humanos insuficientes; indicação rara em idade fértil." },
  rivastigmina: { n: "relativa", t: "Dados humanos insuficientes; indicação rara em idade fértil." },
  buspirona: { n: "relativa", t: "Dados limitados, sem sinal de teratogenicidade." },
  dexmedetomidina: { n: "relativa", t: "Uso restrito a sedação hospitalar monitorada; dados em gestação limitados." },
  "oxibato-de-sodio": { n: "relativa", t: "Dados em gestação insuficientes; depressão do SNC relevante." },
  solrianfetol: { n: "relativa", t: "Dados humanos insuficientes." },
  pitolisanto: { n: "relativa", t: "Dados humanos insuficientes; pode reduzir a eficácia de contraceptivo hormonal." },
  mazindol: { n: "relativa", t: "Anorexígeno sem indicação que justifique exposição na gestação." },
  xanomelina: { n: "relativa", t: "Aprovação recente, sem dados em gestação." },
};
const AMAMENTACAO = {
  clozapina: { n: "contra", t: "Concentra no leite e acumula no lactente. Risco de agranulocitose, sedação intensa e convulsão no bebê. Amamentação contraindicada." },
  thc: { n: "contra", t: "Altamente lipossolúvel: concentra no leite e persiste por semanas. Efeito sobre o neurodesenvolvimento do lactente." },
  sertralina: { n: "sem", t: "Dose relativa no lactente de 0,5-2% — o ISRS de primeira escolha na lactação, com a maior casuística publicada." },
  paroxetina: { n: "sem", t: "Dose relativa no lactente abaixo de 2%. Diferente da gestação, na amamentação é uma das opções mais seguras." },
  quetiapina: { n: "sem", t: "Dose relativa no lactente em torno de 0,1% — a menor entre os antipsicóticos. Observar sonolência do bebê." },
  olanzapina: { n: "sem", t: "Dose relativa no lactente em torno de 1%, com boa casuística. Observar sonolência e ganho de peso do bebê." },
  valproato: { n: "sem", t: "Dose relativa no lactente de 1-2%: compatível com a amamentação — contraste direto com a contraindicação na gestação. Observar icterícia e sinais hematológicos." },
  carbamazepina: { n: "sem", t: "Dose relativa no lactente de 3-6%, compatível. Observar sedação, dificuldade de sucção e icterícia." },
  lorazepam: { n: "sem", t: "Dose relativa no lactente em torno de 2% e sem metabólito ativo — o benzodiazepínico preferido na lactação. Observar sedação." },
  nortriptilina: { n: "sem", t: "Dose relativa no lactente baixa, com casuística favorável — o tricíclico preferido na lactação." },
  zolpidem: { n: "sem", t: "Dose relativa no lactente muito baixa e meia-vida curta. Dose única noturna é compatível." },
  metilfenidato: { n: "sem", t: "Dose relativa no lactente de 0,2-0,7%. Observar irritabilidade e redução de apetite do bebê." },
  gabapentina: { n: "sem", t: "Dose relativa no lactente de 1-4%, compatível. Observar sedação." },
  fenitoina: { n: "sem", t: "Dose relativa no lactente baixa, compatível. Observar sedação e dificuldade de sucção." },
  litio: { n: "relativa", t: "Dose relativa no lactente de 12-30% e nível no bebê de 10-50% do materno. Não é proibição absoluta: exige dosagem de litemia, função renal e TSH do lactente, hidratação garantida e suspensão a qualquer intercorrência febril ou diarreica." },
  fluoxetina: { n: "relativa", t: "Dose relativa no lactente de 5-9% e meia-vida longa da norfluoxetina, que acumula no bebê. Preferir sertralina se houver escolha." },
  citalopram: { n: "relativa", t: "Dose relativa no lactente de 3-5%, com relatos de sonolência excessiva no bebê." },
  escitalopram: { n: "relativa", t: "Dose relativa no lactente em torno de 5%. Observar sonolência e ganho de peso." },
  fluvoxamina: { n: "relativa", t: "Dose relativa no lactente baixa, mas casuística pequena." },
  venlafaxina: { n: "relativa", t: "Dose relativa no lactente de 6-9%, acima dos ISRS. Observar sedação do bebê." },
  desvenlafaxina: { n: "relativa", t: "Dose relativa no lactente em torno de 6-7%, mesmo perfil da venlafaxina." },
  duloxetina: { n: "relativa", t: "Dose relativa no lactente baixa, mas dados escassos." },
  levominalciprana: { n: "relativa", t: "Dados em lactação insuficientes." },
  minalciprana: { n: "relativa", t: "Dados em lactação insuficientes." },
  bupropiona: { n: "relativa", t: "Relato de convulsão em lactente exposto. Dose relativa baixa, mas o sinal justifica cautela e observação." },
  mirtazapina: { n: "relativa", t: "Dose relativa no lactente de 1-2%, casuística limitada. Observar sedação." },
  trazodona: { n: "relativa", t: "Dose relativa no lactente baixa; dados limitados. Observar sedação." },
  agomelatina: { n: "relativa", t: "Dados em lactação insuficientes." },
  vilazodona: { n: "relativa", t: "Dados em lactação insuficientes." },
  vortioxetina: { n: "relativa", t: "Dados em lactação insuficientes." },
  amitriptilina: { n: "relativa", t: "Dose relativa no lactente baixa. Mais sedativo e anticolinérgico que a nortriptilina, que é preferível." },
  imipramina: { n: "relativa", t: "Dose relativa no lactente baixa; dados menores que os da nortriptilina." },
  clomipramina: { n: "relativa", t: "Dose relativa no lactente baixa; observar sedação." },
  doxepina: { n: "relativa", t: "Relato de depressão respiratória e sedação em lactente — evitar se houver alternativa entre os tricíclicos." },
  tranilcipromina: { n: "relativa", t: "Dados em lactação praticamente inexistentes." },
  haloperidol: { n: "relativa", t: "Dose relativa no lactente variável (0,2-12%). Observar sedação e sintomas extrapiramidais no bebê." },
  clorpromazina: { n: "relativa", t: "Sedação do lactente; relato de apneia. Observar de perto, sobretudo em prematuro." },
  levomepromazina: { n: "relativa", t: "Mesmo perfil sedativo das fenotiazinas, com menos dados." },
  flufenazina: { n: "relativa", t: "Dados limitados; mesmo perfil das fenotiazinas." },
  risperidona: { n: "relativa", t: "Dose relativa no lactente de 2-5%. Observar sedação e sintomas extrapiramidais." },
  paliperidona: { n: "relativa", t: "Metabólito ativo da risperidona, mesmo perfil. Na formulação de longa ação a exposição não é interrompível." },
  aripiprazol: { n: "relativa", t: "Dose relativa no lactente baixa, mas pode reduzir a prolactina e comprometer a produção de leite." },
  brexpiprazol: { n: "relativa", t: "Dados em lactação insuficientes." },
  cariprazina: { n: "relativa", t: "Dados insuficientes; metabólito ativo de meia-vida de semanas prolonga a exposição." },
  lurasidona: { n: "relativa", t: "Dados em lactação insuficientes." },
  ziprasidona: { n: "relativa", t: "Dados em lactação insuficientes." },
  asenapina: { n: "relativa", t: "Dados em lactação insuficientes." },
  amilssulprida: { n: "relativa", t: "Dose relativa no lactente alta em relatos e hiperprolactinemia materna; dados escassos." },
  sulpirida: { n: "relativa", t: "Já usado como galactogogo, mas com hiperprolactinemia e sintomas extrapiramidais maternos; não indicado para esse fim." },
  lumateperona: { n: "relativa", t: "Dados em lactação insuficientes." },
  pimavanserina: { n: "relativa", t: "Dados em lactação insuficientes." },
  iloperidona: { n: "relativa", t: "Dados em lactação insuficientes." },
  blonanserona: { n: "relativa", t: "Dados em lactação insuficientes." },
  lamotrigina: { n: "relativa", t: "Dose relativa no lactente de até 20%, com nível mensurável no bebê. Observar exantema, sonolência e apneia; dosar nível do lactente se houver sintoma." },
  oxcarbazepina: { n: "relativa", t: "Dose relativa no lactente baixa; dados menores que os da carbamazepina." },
  fenobarbital: { n: "relativa", t: "Sedação do lactente e acúmulo pela meia-vida neonatal longa. Observar sucção e ganho de peso; evitar em prematuro." },
  topiramato: { n: "relativa", t: "Dose relativa no lactente de até 24%. Observar diarreia, sonolência e ganho de peso insuficiente." },
  pregabalina: { n: "relativa", t: "Dose relativa no lactente baixa; dados limitados." },
  diazepam: { n: "relativa", t: "Metabólitos ativos de meia-vida longa acumulam no lactente. Preferir lorazepam. Uso único é aceitável; uso contínuo exige observação de sedação." },
  clonazepam: { n: "relativa", t: "Relato de apneia e sedação em lactente. Observar de perto, sobretudo em prematuro." },
  alprazolam: { n: "relativa", t: "Relato de síndrome de retirada em lactente após uso materno prolongado." },
  bromazepam: { n: "relativa", t: "Mesmo perfil de classe; dados escassos." },
  clobazam: { n: "relativa", t: "Norclobazam de meia-vida longa acumula no lactente. Observar sedação e sucção." },
  eszopiclona: { n: "relativa", t: "Dados limitados; observar sedação do lactente." },
  suvorexant: { n: "relativa", t: "Dados em lactação insuficientes." },
  lemborexant: { n: "relativa", t: "Dados em lactação insuficientes." },
  melatonina: { n: "relativa", t: "Presente fisiologicamente no leite, mas dados sobre dose suplementar são insuficientes." },
  rameltonina: { n: "relativa", t: "Dados em lactação insuficientes." },
  "lisdexanfetamina-anfetaminas": { n: "relativa", t: "Concentra no leite (dose relativa no lactente de até 10%). Observar irritabilidade, insônia e baixo ganho de peso; dose alta não é compatível." },
  atomoxetina: { n: "relativa", t: "Dados em lactação insuficientes." },
  viloxazina: { n: "relativa", t: "Dados em lactação insuficientes." },
  centanafadina: { n: "relativa", t: "Aprovação recente, sem dados em lactação." },
  "guanfacina-er": { n: "relativa", t: "Dados limitados; observar sedação e bradicardia do lactente." },
  clonidina: { n: "relativa", t: "Passa ao leite e pode reduzir a prolactina, comprometendo a produção. Observar sedação e hipotensão do lactente." },
  "cetamina-escetamina": { n: "relativa", t: "Suspender a amamentação durante a sessão e descartar o leite pelas horas seguintes; sem dados de uso continuado." },
  brexanolona: { n: "relativa", t: "Dose relativa no lactente baixa, mas a infusão de 60h exige observação de sedação do bebê." },
  naltrexona: { n: "relativa", t: "Dose relativa no lactente baixa; dados limitados." },
  vareniclina: { n: "relativa", t: "Dados limitados; comparar com o risco do tabagismo mantido." },
  memantina: { n: "relativa", t: "Dados em lactação insuficientes." },
  donepezila: { n: "relativa", t: "Dados em lactação insuficientes." },
  galantamina: { n: "relativa", t: "Dados em lactação insuficientes." },
  rivastigmina: { n: "relativa", t: "Dados em lactação insuficientes." },
  buspirona: { n: "relativa", t: "Dados em lactação insuficientes." },
  dexmedetomidina: { n: "relativa", t: "Meia-vida curta e uso hospitalar pontual: amamentação pode ser retomada poucas horas após a infusão." },
  "oxibato-de-sodio": { n: "relativa", t: "Depressão do SNC relevante; suspender a amamentação nas horas seguintes à dose." },
  solrianfetol: { n: "relativa", t: "Dados em lactação insuficientes." },
  modafinila: { n: "relativa", t: "Dados em lactação insuficientes; observar irritabilidade do lactente." },
  pitolisanto: { n: "relativa", t: "Dados em lactação insuficientes." },
  mazindol: { n: "relativa", t: "Sem indicação que justifique exposição do lactente." },
  xanomelina: { n: "relativa", t: "Aprovação recente, sem dados em lactação." },
};


/* ---------------- plano de otimização de dose ----------------
   Dose inicial, incremento, intervalo entre ajustes e dose-alvo, para os
   fármacos em que a titulação é protocolo e não apenas "começar baixo".
   `variantes` trocam o esquema inteiro quando há coprescrição que muda a
   cinética; `ajustes` descrevem o que fazer ao ACRESCENTAR ou RETIRAR esse
   outro fármaco com a titulação já em curso. */
const TITULACAO = {
  lamotrigina: {
    ini: "25mg/dia nas semanas 1-2",
    passo: "50mg/dia nas semanas 3-4, 100mg na semana 5",
    alvo: "200mg/dia a partir da semana 6 (faixa 100-400mg/dia)",
    obs: "Risco de exantema grave é ligado à velocidade de escalonamento. Interrupção >5 dias: retitular. Quem suspendeu por exantema não é reexposto.",
    variantes: [
      {
        quando: ["valproato"],
        rotulo: "com valproato — inibidor de UGT1A4, metade do esquema",
        ini: "12,5mg/dia (25mg em dias alternados) nas semanas 1-2",
        passo: "25mg/dia nas semanas 3-4, 50mg na semana 5; incrementos de 25mg a cada 1-2 semanas",
        alvo: "100mg/dia a partir da semana 6 (máximo 200mg/dia)",
      },
      {
        quando: ["carbamazepina", "fenitoina", "fenobarbital", "oxcarbazepina"],
        rotulo: "com indutor de glucuronidação — esquema dobrado",
        ini: "50mg/dia nas semanas 1-2",
        passo: "100mg/dia fracionado nas semanas 3-4, 200mg na semana 5; incrementos de 100mg a cada 1-2 semanas",
        alvo: "300mg/dia a partir da semana 6, podendo chegar a 400mg na semana 7 (fracionado)",
      },
    ],
    ajustes: [
      {
        quando: ["valproato"],
        titulo: "Ao ACRESCENTAR valproato em quem já está estabilizado",
        texto: "Reduzir a dose de estabilização da lamotrigina à METADE na primeira semana e manter: 200→100, 300→150, 400→200mg/dia.",
      },
      {
        quando: ["valproato"],
        titulo: "Ao RETIRAR o valproato",
        texto: "Dobrar a dose de estabilização, sem subir mais de 100mg por semana: 100→200mg/dia na semana 1, e manter.",
      },
      {
        quando: ["carbamazepina", "fenitoina", "fenobarbital", "oxcarbazepina"],
        titulo: "Ao ACRESCENTAR um indutor em quem já está estabilizado",
        texto: "Manter a dose atual na semana 1 e então escalonar em 3 etapas: de 200 → 200, 300, 400; de 150 → 150, 225, 300; de 100 → 100, 150, 200mg/dia.",
      },
      {
        quando: ["carbamazepina", "fenitoina", "fenobarbital", "oxcarbazepina"],
        titulo: "Ao RETIRAR o indutor",
        texto: "Reduzir ao longo de 3 semanas: de 400 → 300 → 200; de 300 → 225 → 150; de 200 → 150 → 100mg/dia.",
      },
    ],
  },
  clozapina: {
    ini: "12,5mg (meio comprimido de 25mg) 1-2x no dia 1; 25mg 1-2x no dia 2",
    passo: "Acréscimos de 25-50mg/dia até 300mg/dia em 2-3 semanas; depois 50-100mg a cada 3-4 dias, ou de preferência a cada 1 semana",
    alvo: "300-450mg/dia fracionado",
    teto: "900mg/dia, em incrementos de no máximo 100mg por vez — acima de 450mg/dia a taxa de eventos adversos, sobretudo convulsão, aumenta",
    obs: "Mais de 2 dias sem tomar: reiniciar de 12,5mg. Psicose na doença de Parkinson: teto de 100mg/dia.",
  },
  carbamazepina: {
    ini: "200mg/dia",
    passo: "+200mg/dia a cada semana",
    alvo: "600-1200mg/dia",
    obs: "Autoindução derruba o nível com a dose mantida: redosar em 3-4 semanas antes de considerar a dose insuficiente.",
  },
  litio: {
    ini: "300mg 2x/dia",
    passo: "Ajuste por nível sérico, dosado 5-7 dias após cada mudança (12h após a última dose)",
    alvo: "Nível de 0,6-1,0 mEq/L na manutenção; 0,8-1,2 mEq/L na mania aguda",
    obs: "Titulação guiada por nível, não por dose. Depuração muda com função renal, sódio, hidratação e AINE/IECA/diurético.",
  },
  quetiapina: {
    ini: "25mg 2x/dia (liberação imediata) ou 50mg/dia (XR)",
    passo: "+25-50mg por tomada a cada 1-2 dias na fase inicial",
    alvo: "300-800mg/dia na psicose; 150-300mg/dia na depressão bipolar; 50-100mg/dia para insônia/sedação",
    teto: "800mg/dia",
  },
  risperidona: {
    ini: "1-2mg/dia",
    passo: "+1-2mg/dia a cada 1-2 dias, respeitando a hipotensão postural",
    alvo: "2-6mg/dia",
    teto: "16mg/dia — acima de 6mg/dia o ganho é pequeno e o risco extrapiramidal sobe",
  },
  olanzapina: {
    ini: "5-10mg/dia",
    passo: "+5mg/dia a intervalos não menores que 24h (bula: reavaliar a cada 5-7 dias)",
    alvo: "10-20mg/dia",
    teto: "20mg/dia",
  },
  aripiprazol: {
    ini: "10-15mg/dia",
    passo: "+5mg/dia, não antes de 2 semanas (meia-vida de ~75h; o equilíbrio só chega em ~14 dias)",
    alvo: "10-30mg/dia",
    teto: "30mg/dia",
    obs: "Antes de 2 semanas, o nível ainda sobe sozinho.",
  },
  lurasidona: {
    ini: "40mg/dia, com alimento (≥350kcal)",
    passo: "+20-40mg/dia a cada 7 dias",
    alvo: "40-80mg/dia na depressão bipolar; 40-160mg/dia na esquizofrenia",
    teto: "160mg/dia",
  },
  topiramato: {
    ini: "25mg/dia à noite",
    passo: "+25-50mg/dia a cada semana",
    alvo: "100-200mg/dia (enxaqueca 100mg/dia; epilepsia até 400mg/dia)",
    obs: "Subida rápida troca eficácia por lentificação cognitiva e parestesia.",
  },
  venlafaxina: {
    ini: "37,5-75mg/dia",
    passo: "+37,5-75mg/dia a cada 4-7 dias",
    alvo: "75-225mg/dia — a inibição noradrenérgica só aparece de forma relevante acima de 150mg/dia",
    teto: "375mg/dia (formulação de liberação imediata)",
  },
  duloxetina: {
    ini: "30mg/dia por 1 semana",
    passo: "+30mg/dia a cada 1-2 semanas",
    alvo: "60mg/dia",
    teto: "120mg/dia — acima de 60mg/dia sem ganho consistente de eficácia",
  },
  bupropiona: {
    ini: "150mg/dia pela manhã (XL) por 3-7 dias",
    passo: "+150mg/dia após 3-7 dias",
    alvo: "300mg/dia",
    teto: "450mg/dia — risco de convulsão é dose-dependente; respeitar o intervalo mínimo de 8h entre tomadas na apresentação SR",
  },
  mirtazapina: {
    ini: "15mg/dia à noite",
    passo: "+15mg a cada 1-2 semanas",
    alvo: "30-45mg/dia",
    teto: "45mg/dia",
    obs: "Seda MAIS em dose baixa: sonolência em 15mg é motivo para subir, não para reduzir.",
  },
  atomoxetina: {
    ini: "0,5mg/kg/dia (adulto: 40mg/dia)",
    passo: "Após no mínimo 7 dias, subir para 1,2mg/kg/dia (adulto: 80mg/dia)",
    alvo: "1,2mg/kg/dia (adulto 80mg/dia)",
    teto: "1,4mg/kg/dia ou 100mg/dia, o que for menor",
    obs: "Resposta plena em 4-6 semanas — não tem efeito no mesmo dia.",
  },
  memantina: {
    ini: "5mg/dia",
    passo: "+5mg/dia a cada semana",
    alvo: "20mg/dia (10mg 2x/dia)",
    teto: "20mg/dia",
  },
  donepezila: {
    ini: "5mg/dia à noite",
    passo: "+5mg/dia após 4-6 semanas",
    alvo: "10mg/dia",
    teto: "23mg/dia (apresentação de liberação prolongada; ganho marginal com mais efeito colinérgico)",
  },
  rivastigmina: {
    ini: "1,5mg 2x/dia (oral) ou adesivo de 4,6mg/24h",
    passo: "+1,5mg por tomada a cada 2 semanas (oral); +4,6mg/24h a cada 4 semanas (adesivo)",
    alvo: "3-6mg 2x/dia (oral) ou adesivo de 9,5mg/24h",
    teto: "12mg/dia (oral) ou adesivo de 13,3mg/24h",
  },
  galantamina: {
    ini: "8mg/dia (liberação prolongada)",
    passo: "+8mg/dia a cada 4 semanas",
    alvo: "16-24mg/dia",
    teto: "24mg/dia",
  },
  "guanfacina-er": {
    ini: "1mg/dia",
    passo: "+1mg/dia a cada semana",
    alvo: "1-4mg/dia (0,05-0,12mg/kg/dia)",
    teto: "4mg/dia (até 7mg/dia em adolescentes, conforme peso)",
    obs: "Retirada abrupta causa hipertensão de rebote: reduzir 1mg a cada 3-7 dias.",
  },
  pregabalina: {
    ini: "75mg 2x/dia",
    passo: "+150mg/dia após 1 semana",
    alvo: "300-450mg/dia",
    teto: "600mg/dia",
  },
  gabapentina: {
    ini: "300mg no dia 1; 300mg 2x/dia no dia 2; 300mg 3x/dia no dia 3",
    passo: "+300mg/dia conforme tolerância",
    alvo: "900-1800mg/dia fracionado em 3 tomadas",
    teto: "3600mg/dia — a biodisponibilidade cai de 60% para 33% com o aumento da dose, então o ganho por mg diminui",
  },
  tranilcipromina: {
    ini: "10mg 2x/dia",
    passo: "+10mg/dia a cada 1-3 semanas",
    alvo: "30mg/dia",
    teto: "60mg/dia",
    obs: "Restrição de tiramina desde a 1ª dose. Wash-out de ~2 semanas em qualquer troca (5 semanas se vinha de fluoxetina).",
  },
  clobazam: {
    ini: "5-10mg/dia",
    passo: "+5-10mg/dia a cada semana",
    alvo: "20-30mg/dia",
    teto: "40mg/dia (adjuvante em epilepsia)",
    obs: "Metabolizador lento de CYP2C19 acumula norclobazam: titular mais devagar.",
  },
  fenitoina: {
    ini: "100mg 3x/dia",
    passo: "Até 300mg/dia, ajustes de 100mg; ACIMA de 300mg/dia, incrementos de apenas 25-50mg, com nível sérico a cada 1-2 semanas",
    alvo: "300-400mg/dia (nível 10-20 mcg/mL)",
    teto: "600mg/dia",
    obs: "Hidroxilação saturável: acima de 300mg/dia, +100mg pode dobrar o nível.",
  },
  fenobarbital: {
    ini: "2-3mg/kg/dia",
    passo: "Reavaliar e ajustar somente após 15 dias (bula) — a meia-vida de ~79h faz o equilíbrio levar 2-3 semanas",
    alvo: "Nível sérico de 15-30 mg/L",
    obs: "Antes de 15 dias o nível ainda não estabilizou.",
  },
  viloxazina: {
    ini: "100mg/dia (crianças 6-11 anos) ou 200mg/dia (12-17 anos e adultos)",
    passo: "+100mg/dia a cada semana",
    alvo: "200-400mg/dia conforme faixa etária",
    teto: "400mg/dia (6-11 anos) / 600mg/dia (adultos)",
  },
  naltrexona: {
    ini: "25mg/dia (meio comprimido) no primeiro dia",
    passo: "Subir para 50mg/dia no dia 2 se tolerado",
    alvo: "50mg/dia",
    obs: "Exige 7-10 dias sem opioide antes de iniciar (abstinência precipitada). Conferir transaminases.",
  },
  sertralina: {
    ini: "50mg/dia (25mg/dia se pânico ou ansiedade proeminente)",
    passo: "+25-50mg/dia a cada 1-2 semanas",
    alvo: "50-150mg/dia",
    teto: "200mg/dia",
  },
  escitalopram: {
    ini: "10mg/dia (5mg/dia em idoso ou ansiedade proeminente)",
    passo: "+5-10mg/dia após 1-2 semanas",
    alvo: "10-20mg/dia",
    teto: "20mg/dia (10mg/dia acima de 65 anos ou em metabolizador lento de CYP2C19 — risco de QT)",
  },
  fluoxetina: {
    ini: "20mg/dia",
    passo: "+20mg/dia a cada 2-4 semanas (meia-vida longa da norfluoxetina: o equilíbrio leva 4-5 semanas)",
    alvo: "20-60mg/dia",
    teto: "80mg/dia",
  },
  paroxetina: {
    ini: "20mg/dia (10mg/dia em idoso)",
    passo: "+10mg/dia a cada semana",
    alvo: "20-50mg/dia",
    teto: "60mg/dia",
    obs: "Autoinibição de CYP2D6: o mesmo +10mg pesa mais em dose alta. Retirada exige desmame lento.",
  },
  vortioxetina: {
    ini: "10mg/dia",
    passo: "+5-10mg/dia após 1-2 semanas, conforme tolerância",
    alvo: "10-20mg/dia",
    teto: "20mg/dia (10mg/dia em metabolizador lento de CYP2D6)",
  },
};


/* ---------------- esquemas de troca / conversão ----------------
   Formato pontual: cada campo é um parâmetro de prescrição, não texto corrido.
   Fator de conversão oral→LAI do haloperidol: 20x a dose oral diária como
   dose MENSAL de equivalência. */
const ESQUEMAS = {
  haloperidol: [
    {
      titulo: "Haloperidol oral → Haldol Decanoato",
      campos: [
        ["Pré-requisito", "Já estabilizado e tolerante ao haloperidol oral. A transição não é início de tratamento."],
        ["Dose de ataque", "20x a dose oral diária, no 1º mês, dividida em 2 injeções (teto de 100mg por injeção; 2ª injeção em 3-7 dias). Ex.: 10mg/dia oral → 200mg = 100mg + 100mg."],
        ["Dose de manutenção", "20x a dose oral diária, começando 2 semanas após a 2ª injeção de ataque. Faixa usual 50-150mg; volume acima de 3mL não recomendado."],
        ["Intervalo", "4 semanas (t½ aparente 21 dias; Tmax 7 dias)."],
        ["Desmame oral", "Manter o oral em sobreposição por 2-4 semanas e retirar. Sem sobreposição, o nível fica baixo nas primeiras semanas."],
        ["Reavaliação", "Tende a cair abaixo do valor calculado ao longo do 1º ano (saturação tecidual) — dosar nível sérico e reduzir."],
      ],
    },
  ],
  risperidona: [
    {
      titulo: "Risperidona oral → Risperdal Consta",
      campos: [
        ["Dose de ataque", "Não há — 25mg IM desde a 1ª aplicação."],
        ["Dose de manutenção", "25mg IM; 37,5 ou 50mg se necessário. Acima de 50mg/2 semanas não recomendado."],
        ["Intervalo", "2 semanas."],
        ["Desmame oral", "Sobreposição OBRIGATÓRIA nas 3 primeiras semanas; suspender o oral ao fim da 3ª."],
        ["Disponibilidade", "Risperdal Consta em descontinuação no Brasil desde 2025 — alternativa: paliperidona mensal."],
      ],
      nota: "A liberação inicial é <1% da dose, seguida de intervalo inativo de 3 semanas. Sem a cobertura oral, o paciente fica descoberto por 3 semanas.",
    },
  ],
  paliperidona: [
    {
      titulo: "Oral → Invega Sustenna / Vegapali (mensal)",
      campos: [
        ["Dose de ataque", "150mg no dia 1 + 100mg no dia 8, ambas no DELTOIDE."],
        ["Dose de manutenção", "75mg/mês (faixa 50-150mg), a partir de 1 mês após a dose do dia 8; deltoide ou glúteo."],
        ["Intervalo", "4 semanas."],
        ["Desmame oral", "Não requer — suspender o oral ao iniciar. A dupla dose inicial cobre o período."],
        ["Conversão", "Paliperidona oral: 3mg/dia→50mg · 6→75 · 9→100 · 12→150mg/mês. Vindo de risperidona injetável: 25mg/2sem→50 · 37,5→75 · 50→100mg/mês, sem dose do dia 8."],
        ["Agulha", "Deltoide: 23G de 1 polegada (abaixo de 90kg) ou 22G de 1½ polegada (90kg ou mais). Glúteo: 22G de 1½ polegada."],
        ["Se perder o dia 8", "Até 4 semanas da 1ª injeção: aplicar os 100mg no deltoide o quanto antes e 75mg na 5ª semana contada da 1ª. De 4 a 7 semanas: duas injeções de 100mg no deltoide, com 1 semana de intervalo. Acima de 7 semanas: reiniciar o esquema de início."],
      ],
    },
    {
      titulo: "Invega Sustenna → Invega Trinza (trimestral)",
      campos: [
        ["Pré-requisito", "≥4 meses de Sustenna, com as 2 últimas doses na mesma dosagem."],
        ["Dose", "3,5x a dose mensal: 50→175 · 75→263 · 100→350 · 150→525mg."],
        ["Intervalo", "3 meses. 1ª aplicação no lugar da dose mensal prevista (janela ±7 dias)."],
      ],
      nota: "Conversão a partir da dose mensal mais baixa não foi estudada.",
    },
  ],
  clozapina: [
    {
      titulo: "Reinício após interrupção",
      campos: [
        ["Gatilho", "Mais de 2 dias sem tomar."],
        ["Conduta", "Retitular desde 12,5mg 1-2x no dia 1. NÃO retomar a dose anterior."],
        ["Reescalonamento", "Como na titulação inicial."],
        ["Suspensão planejada", "Reduzir ao longo de 1-2 semanas."],
      ],
      nota: "O risco na reexposição rápida é hipotensão, bradicardia e parada respiratória.",
    },
  ],
  lamotrigina: [
    {
      titulo: "Reintrodução após interrupção",
      campos: [
        ["Gatilho", "Interrupção maior que 5 dias (5 meias-vidas)."],
        ["Conduta", "Retitular desde o início, pelo esquema que corresponde à coprescrição atual."],
        ["Vedação", "Não reexpor quem suspendeu por exantema."],
      ],
    },
  ],
};

/* LAI + indutor enzimático: a dose não é corrigível depois de aplicada. */
const LAI_INDUTORES = ["carbamazepina", "fenitoina", "fenobarbital", "oxcarbazepina"];
const LAI_FARMACOS = ["haloperidol", "risperidona", "paliperidona", "aripiprazol"];


/* Seleciona o esquema de titulação válido para a combinação atual. */
function titulacaoPara(drugId, selectedIds) {
  const t = TITULACAO[drugId];
  if (!t) return null;
  const outros = (selectedIds || []).filter((x) => x !== drugId);
  const v = (t.variantes || []).find((x) => x.quando.some((q) => outros.includes(q)));
  const base = v ? { ...t, ...v } : t;
  const ajustes = (t.ajustes || []).filter((a) => a.quando.some((q) => outros.includes(q)));
  return { ...base, variante: v || null, ajustesAtivos: ajustes };
}

/* Correspondência de enzima entre perpetrador e vítima.
   Casamento exato por padrão; para UGT, a string genérica "UGT" casa com
   qualquer isoforma (UGT1A4, UGT2B7, ...) em qualquer dos dois lados —
   evita falso negativo quando um fármaco traz a família e o outro a isoforma. */
function enzymeMatches(effectEnzyme, victimEnzyme) {
  if (effectEnzyme === victimEnzyme) return true;
  const isUgt = (s) => typeof s === "string" && s.indexOf("UGT") === 0;
  if (isUgt(effectEnzyme) && isUgt(victimEnzyme)) {
    return effectEnzyme === "UGT" || victimEnzyme === "UGT";
  }
  return false;
}

function enzymeEffectsAgainst(perpetrator, victimEnzymes) {
  const effects = ENZYME_EFFECTS[perpetrator.id] || [];
  return effects.filter((e) => (victimEnzymes || []).some((v) => enzymeMatches(e.enzyme, v)));
}

/* Notas de par — acrescentadas ao alerta metabólico quando o par específico
   tem magnitude ou conduta descrita em bula/literatura. Chave: ids em ordem alfabética. */
const PAIR_NOTES = {
  "lorazepam|valproato":
    "Depuração total do lorazepam reduzida em 40% e formação do glucuronídeo em 55%; níveis ~2x mais altos por pelo menos 12 h. Bula recomenda reduzir o lorazepam a 50% da dose usual nessa associação.",
  "asenapina|valproato":
    "A redução da glicuronidação é mensurável, mas não alterou as concentrações plasmáticas de asenapina nos estudos — relevância clínica limitada.",
};
function pairNote(a, b) {
  return PAIR_NOTES[[a.id, b.id].sort().join("|")];
}

/* Interações possíveis que o motor por enzima não expressa — descritas como
   possibilidade, com o que há de evidência, sem inferir conduta. */
const PAIR_POSSIBLE = [
  {
    ids: ["sertralina", "lamotrigina"],
    titulo: "Sertralina + Lamotrigina — interação possível (glicuronidação)",
    texto:
      "A sertralina participa de vias de glicuronidação (UGT2B7) e a lamotrigina depende de UGT1A4, mas a sertralina não está estabelecida como inibidora de UGT. Há relatos de caso de duplicação do nível de lamotrigina com toxicidade após associação; série retrospectiva encontrou apenas +18% no nível corrigido por dose, sem significância. Razoável acompanhar nível e clínica da lamotrigina ao introduzir ou subir a sertralina.",
  },
];

/* ícone standalone (sem hooks) para favicon / apple-touch-icon / manifest */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#0a0c11"/>
  <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#e3a73b" stroke-opacity="0.4"/>
  <g transform="rotate(40 32 32)">
    <rect x="8" y="24" width="48" height="16" rx="8" fill="#f2e9d8"/>
    <path d="M8 24 h24 v16 h-24 a8 8 0 0 1 0 -16 z" fill="#e3a73b"/>
    <rect x="8" y="24" width="48" height="16" rx="8" fill="none" stroke="rgba(0,0,0,0.3)"/>
  </g>
  <g transform="rotate(-50 32 32)">
    <circle cx="32" cy="32" r="13" fill="#f2e9d8" stroke="rgba(0,0,0,0.3)"/>
    <line x1="22" y1="32" x2="42" y2="32" stroke="rgba(0,0,0,0.3)" stroke-width="1.6"/>
  </g>
</svg>`;

const GROUP_ORDER = [
  "Serotoninérgicos",
  "Dopaminérgicos",
  "Transportadores",
  "Adrenérgicos",
  "Histaminérgicos",
  "Muscarínicos",
  "Melatoninérgicos",
  "Outros",
];

const TIPO_LABEL = DATA.tipoLabels;

/* alertas farmacodinâmicos — regras conservadoras, nível textbook */
const RECEPTOR_ALERT_RULES = [
  {
    receptor: "SERT",
    tipos: ["ant", "inib", "agt", "agp"],
    minCount: 2,
    texto: (drugs) =>
      `Sobreposição serotoninérgica (${drugs.join(" + ")}) — atenção a sinais de síndrome serotoninérgica (agitação, hipertermia, clônus, diaforese), sobretudo com escores de afinidade elevados ou associação a outros agentes serotoninérgicos (ex. IMAO, tramadol, linezolida).`,
  },
  {
    receptor: "H1",
    tipos: ["ant"],
    minCount: 2,
    texto: (drugs) =>
      `Antagonismo histaminérgico H1 aditivo (${drugs.join(" + ")}) — maior risco de sedação, ganho de peso e efeito hipnótico somado.`,
  },
  {
    receptor: "M1",
    tipos: ["ant"],
    minCount: 2,
    texto: (drugs) =>
      `Carga anticolinérgica (M1) aditiva (${drugs.join(" + ")}) — atenção a boca seca, constipação, retenção urinária, turvação visual e prejuízo cognitivo (risco maior em idosos).`,
  },
  {
    receptor: "D2",
    tipos: ["ant"],
    minCount: 2,
    texto: (drugs) =>
      `Antagonismo D2 aditivo (${drugs.join(" + ")}) — maior risco de sintomas extrapiramidais e hiperprolactinemia com a combinação.`,
  },
  {
    receptor: "α1",
    tipos: ["ant"],
    minCount: 2,
    texto: (drugs) =>
      `Antagonismo α1 aditivo (${drugs.join(" + ")}) — maior risco de hipotensão ortostática e tontura, especialmente na titulação.`,
  },
  {
    receptor: "GABA-A",
    tipos: ["ant", "agp", "agt", "mod"],
    minCount: 2,
    texto: (drugs) =>
      `Potencialização gabaérgica somada (${drugs.join(" + ")}) — maior risco de sedação excessiva e, em combinação com opioides/álcool, depressão respiratória.`,
  },
];

/* ---------------- efeitos ADVERSOS por receptor: curto x longo prazo ----------------
   Não presente na planilha original — avaliado à parte, a pedido do usuário.
   Escopo restrito a efeitos ADVERSOS (não ao efeito terapêutico/mecanismo).
   Organizado por RECEPTOR (não por fármaco): o perfil de toxicidade aguda vs.
   cumulativa é uma propriedade do alvo, não de cada fármaco individualmente.
   Cobertura deliberadamente seletiva e prática: um campo (curto ou longo) só
   aparece quando há algo realmente informativo a dizer — nada de "sem dado
   relevante" ou equivalente. Vários alvos foram deixados de fora inteiramente
   (5-HT7, D1, D3, α2B, α2C, M2-M5, δ-opioide, nAChR α7, BuChE, σ1 e ~30 outros
   majoritariamente pré-clínicos/moleculares) por não haver, nem em curto nem
   em longo prazo, um efeito adverso específico e bem estabelecido a relatar. */
const RECEPTOR_TIMECOURSE = {
  "5-HT1A": {
    curto: "Tontura, náusea e, por vezes, piora transitória da ansiedade/agitação (\"jitteriness\") no início do tratamento ou na titulação.",
  },
  "5-HT2A": {
    curto: "Sedação e hipotensão ortostática, mais notáveis no início ou em combinação com outros depressores/hipotensores.",
  },
  "5-HT2C": {
    curto: "Aumento do apetite perceptível já nas primeiras semanas.",
    longo: "Ganho de peso sustentado e risco metabólico (dislipidemia, resistência à insulina) com uso prolongado — um dos principais mecanismos de síndrome metabólica associada a antipsicóticos atípicos.",
  },
  "5-HT3": {
    curto: "Constipação e cefaleia como efeitos adversos iniciais mais comuns.",
  },
  D2: {
    curto: "Distonia aguda e acatisia podem surgir já nas primeiras horas a dias; sedação e elevação da prolactina começam precocemente.",
    longo: "Discinesia tardia (geralmente após meses a anos de bloqueio sustentado, por vezes irreversível), hiperprolactinemia crônica (galactorreia, disfunção sexual, risco de osteoporose com exposição prolongada) e parkinsonismo persistente. Agonistas parciais D2 têm menor risco de discinesia tardia a longo prazo, mas podem causar acatisia mais precocemente.",
  },
  SERT: {
    curto: "Náusea, diarreia, cefaleia e insônia são comuns na primeira semana; piora inicial da ansiedade e, em jovens (<25 anos), risco aumentado de ideação suicida no início do tratamento (alerta de bula).",
    longo: "Disfunção sexual pode persistir mesmo após a suspensão em uma minoria de pacientes (achado ainda debatido); risco aumentado de sangramento (efeito antiplaquetário) e de hiponatremia (sobretudo em idosos) com uso continuado; síndrome de descontinuação ao suspender abruptamente após uso prolongado.",
  },
  NAT: {
    curto: "Aumento de frequência cardíaca e pressão arterial, além de insônia/ativação, mais proeminentes nos primeiros dias.",
    longo: "Risco cardiovascular (hipertensão sustentada) exige monitorização contínua da PA/FC ao longo do tratamento.",
  },
  DAT: {
    curto: "Redução do apetite, insônia, taquicardia e irritabilidade no início do tratamento ou da titulação.",
    longo: "Possível impacto discreto no crescimento em crianças (achado modesto e debatido) e risco de dependência/abuso mais relevante em formulações de ação rápida.",
  },
  "α1": {
    curto: "Hipotensão ortostática, tontura e taquicardia reflexa — mais intensas na titulação inicial ou após aumento de dose.",
    longo: "Tende a haver alguma tolerância parcial ao efeito hipotensor com uso continuado, mas o risco de queda (sobretudo em idosos) permanece relevante.",
  },
  "α2": {
    curto: "Sedação, hipotensão e bradicardia, mais intensas no início do tratamento.",
    longo: "Suspensão abrupta após uso prolongado pode causar rebote hipertensivo — exige retirada gradual.",
  },
  "α2A": {
    curto: "Sedação, hipotensão e bradicardia, mais intensas no início do tratamento.",
    longo: "Suspensão abrupta após uso prolongado pode causar rebote hipertensivo — exige retirada gradual.",
  },
  H1: {
    curto: "Sedação proeminente, mais forte nos primeiros dias — costuma haver alguma tolerância parcial a esse efeito em 1-2 semanas.",
    longo: "Ganho de peso sustentado (↓ taxa metabólica basal, ↑ apetite) — esse efeito metabólico tende a ser mais persistente do que a sedação e menos sujeito a tolerância.",
  },
  H3: {
    curto: "Insônia é o efeito adverso mais relatado com antagonistas H3 (pitolisanto).",
  },
  M1: {
    curto: "Boca seca, constipação, visão turva, retenção urinária e confusão aguda (sobretudo em idosos) já nos primeiros dias.",
    longo: "Carga anticolinérgica cumulativa associada a maior risco de comprometimento cognitivo sustentado e demência em idosos — achado bem documentado em estudos observacionais.",
  },
  MT1: {
    curto: "Cefaleia e tontura leves são os efeitos adversos mais comuns, e pouco frequentes.",
    longo: "Sem sinais de tolerância ou dependência com uso prolongado — diferencial importante frente a benzodiazepínicos/Z-drugs.",
  },
  MT2: {
    curto: "Cefaleia e tontura leves são os efeitos adversos mais comuns, e pouco frequentes.",
    longo: "Sem sinais de tolerância ou dependência com uso prolongado — diferencial importante frente a benzodiazepínicos/Z-drugs.",
  },
  "GABA-A": {
    curto: "Sedação, incoordenação motora e amnésia anterógrada; risco de depressão respiratória, sobretudo associado a opioides/álcool.",
    longo: "Tolerância farmacodinâmica (doses maiores necessárias com o tempo), dependência física e risco real de convulsão na retirada abrupta após uso prolongado; risco aumentado de quedas e efeitos cognitivos em uso crônico, especialmente em idosos.",
  },
  NMDA: {
    curto: "Sintomas dissociativos/psicotomiméticos e elevação transitória de PA/FC durante a administração (cetamina/escetamina).",
    longo: "Uso repetido de cetamina carrega risco de cistite (uso crônico em alta dose) e potencial de abuso/dependência. Memantina, em uso crônico para demência, tem perfil de efeitos adversos comparativamente mais benigno.",
  },
  "κ-opioide": {
    curto: "Disforia é o efeito adverso agudo mais característico do agonismo neste receptor.",
  },
  "μ-opioide": {
    curto: "Antagonismo agudo (naltrexona) pode precipitar síndrome de abstinência grave em usuários ativos de opioides, além de náusea.",
    longo: "Risco de hepatotoxicidade em doses altas (alerta de bula); fora isso, geralmente bem tolerado a longo prazo.",
  },
  OX1: {
    curto: "Sonolência e fadiga são os efeitos adversos agudos mais comuns.",
    longo: "Sonolência residual diurna é o principal risco a longo prazo; relatos raros de paralisia do sono/alucinações hipnagógicas.",
  },
  OX2: {
    curto: "Sonolência e fadiga são os efeitos adversos agudos mais comuns.",
    longo: "Sonolência residual diurna é o principal risco a longo prazo; relatos raros de paralisia do sono/alucinações hipnagógicas.",
  },
  VMAT2: {
    curto: "Sedação e acatisia podem surgir já no início do tratamento.",
    longo: "Risco bem documentado de depressão (alerta de bula em alguns agentes), sintomas parkinsonianos e prolongamento de QT com uso sustentado — exige monitorização contínua do humor.",
  },
  CB1: {
    curto: "Ansiedade, taquicardia, incoordenação e, em predispostos, sintomas psicóticos agudos transitórios.",
    longo: "Risco de transtorno por uso de canabis (dependência); associação com maior risco de sintomas psicóticos em indivíduos predispostos; possível impacto cognitivo sustentado com uso pesado e precoce (adolescência).",
  },
  nAChR: {
    curto: "Náusea e cefaleia são comuns no início da exposição/titulação.",
  },
  "nAChR α4β2": {
    curto: "Náusea é o efeito adverso mais comum; distúrbios do sono e sonhos vívidos também são relatados no início.",
    longo: "Geralmente bem tolerado ao longo do curso padrão de tratamento (~12 semanas); sintomas neuropsiquiátricos foram motivo de alerta de bula no passado, revisado após dados adicionais de segurança.",
  },
  AChE: {
    curto: "Náusea, vômitos, diarreia e cãibras são comuns no início/titulação; bradicardia também pode ocorrer.",
    longo: "Risco de síncope, quedas e bradiarritmias com uso sustentado, sobretudo em idosos; risco raro de sangramento gastrointestinal.",
  },
  "MAO-A": {
    curto: "Hipotensão ortostática (frequente e muitas vezes limitante), insônia e cefaleia no início; crise hipertensiva se houver ingestão de tiramina ou simpatomiméticos desde a primeira dose.",
    longo: "Ganho de peso e edema com uso prolongado; a restrição dietética de tiramina e o intervalo de wash-out permanecem obrigatórios durante todo o tratamento e por ~2 semanas após a suspensão, até a ressíntese da enzima.",
  },
  "MAO-B": {
    curto: "Insônia e ativação/agitação, mais intensas com doses vespertinas.",
    longo: "Relatos de dependência farmacológica e de síndrome de retirada (agitação, confusão, alucinações) após interrupção abrupta de uso prolongado — retirada deve ser gradual.",
  },
  "Canal Na+": {
    curto: "Tontura, diplopia e ataxia são comuns na titulação; risco de rash cutâneo (incluindo Stevens-Johnson) nas primeiras semanas, especialmente com lamotrigina em titulação rápida.",
    longo: "Hiponatremia com uso continuado (mais descrita com carbamazepina/oxcarbazepina) e redução da densidade óssea associada a uso prolongado de alguns anticonvulsivantes.",
  },
};

function timecourseFor(receptor) {
  return RECEPTOR_TIMECOURSE[receptor] || null;
}

/* ---------------- helpers ---------------- */
function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hueFor(tipo) {
  if (tipo === "ant" || tipo === "inib") return 355; // vermelho — antagonista / inibidor de recaptação
  if (tipo === "agp") return 214; // azul — agonista parcial
  if (tipo === "agt") return 226; // azul escuro — agonista total
  if (tipo === "mod") return 152; // verde — modulador alostérico
  return 38; // âmbar — outro
}

function colorFor(tipo, score) {
  const h = hueFor(tipo);
  if (tipo === "agt") return `hsl(${h} 58% 52%)`;
  const s = Math.min(40 + score * 10, 92);
  const l = Math.min(34 + score * 6, 66);
  return `hsl(${h} ${s}% ${l}%)`;
}

function bgFor(tipo) {
  const h = hueFor(tipo);
  return `hsla(${h}, 55%, 50%, 0.13)`;
}

function borderFor(tipo) {
  const h = hueFor(tipo);
  return `hsla(${h}, 55%, 55%, 0.35)`;
}

function drugById(id) {
  return DATA.drugs.find((d) => d.id === id);
}

function sortedGroupsFor(receptores) {
  const byGroup = {};
  for (const rx of receptores) {
    const g = DATA.receptorGroups[rx.r] || "Outros";
    (byGroup[g] = byGroup[g] || []).push(rx);
  }
  return GROUP_ORDER.filter((g) => byGroup[g]).map((g) => ({
    group: g,
    items: byGroup[g].sort(
      (a, b) => DATA.receptorOrder.indexOf(a.r) - DATA.receptorOrder.indexOf(b.r)
    ),
  }));
}

function topEffects(drug, n = 4) {
  return [...drug.rx]
    .filter((r) => r.et || r.ea)
    .sort((a, b) => b.s - a.s)
    .slice(0, n);
}

/* ============================================================
   ÍCONES DE MARCA
   ============================================================ */

let _uid = 0;
function useUid(prefix) {
  const [id] = useState(() => `${prefix}-${(_uid++).toString(36)}`);
  return id;
}

function Capsule({ w = 64, h = 64, tone1 = "#D6902A", tone2 = "#F7EFDF", rot = 45, shadow = false }) {
  const cx = w / 2,
    cy = h / 2;
  const pw = w * 0.82,
    ph = h * 0.34;
  const px = cx - pw / 2,
    py = cy - ph / 2;
  const clipId = useUid("cap-clip");
  const gradA = useUid("cap-ga");
  const gradB = useUid("cap-gb");
  const shadowId = useUid("cap-sh");
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`} filter={shadow ? `url(#${shadowId})` : undefined}>
      <defs>
        <clipPath id={clipId}>
          <rect x={cx} y={0} width={w} height={h} />
        </clipPath>
        <linearGradient id={gradA} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone2} />
          <stop offset="55%" stopColor={tone2} stopOpacity="0.92" />
          <stop offset="100%" stopColor="#DDD0B4" />
        </linearGradient>
        <linearGradient id={gradB} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0BE63" />
          <stop offset="45%" stopColor={tone1} />
          <stop offset="100%" stopColor="#B87418" />
        </linearGradient>
        {shadow && (
          <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.3" floodColor="#000" floodOpacity="0.4" />
          </filter>
        )}
      </defs>
      <rect x={px} y={py} width={pw} height={ph} rx={ph / 2} fill={`url(#${gradA})`} />
      <rect x={px} y={py} width={pw} height={ph} rx={ph / 2} fill={`url(#${gradB})`} clipPath={`url(#${clipId})`} />
      <rect x={px + pw * 0.06} y={py + ph * 0.14} width={pw * 0.86} height={ph * 0.22} rx={ph * 0.11} fill="#fff" opacity="0.16" />
      <line x1={cx} y1={py + 1} x2={cx} y2={py + ph - 1} stroke="rgba(0,0,0,0.28)" strokeWidth="1" />
      <rect x={px} y={py} width={pw} height={ph} rx={ph / 2} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
    </g>
  );
}

function Tablet({ w = 64, h = 64, tone = "#F7EFDF", rot = -45, size = 0.46, shadow = false }) {
  const cx = w / 2,
    cy = h / 2;
  const r = (w * size) / 2;
  const gradId = useUid("tab-g");
  const shadowId = useUid("tab-sh");
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`} filter={shadow ? `url(#${shadowId})` : undefined}>
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="35%" stopColor={tone} stopOpacity="0" />
        </radialGradient>
        {shadow && (
          <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.3" floodColor="#000" floodOpacity="0.4" />
          </filter>
        )}
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={tone} stroke="rgba(0,0,0,0.32)" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="0.8" />
      <line x1={cx - r + r * 0.24} y1={cy} x2={cx + r - r * 0.24} y2={cy} stroke="rgba(0,0,0,0.3)" strokeWidth="1.3" />
    </g>
  );
}

/* logotipo — cápsula e comprimido cruzados em fundo preto */
function LogoMark({ size = 72, rounded = 22, glow = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="PsyCore">
      <defs>
        <radialGradient id="pf-bg-sheen" cx="30%" cy="18%" r="75%">
          <stop offset="0%" stopColor="#20242c" />
          <stop offset="100%" stopColor="#05060a" />
        </radialGradient>
        <linearGradient id="glossTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {glow && (
          <filter id="pf-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        )}
      </defs>
      {glow && <circle cx="32" cy="32" r="26" fill="var(--accent)" opacity="0.35" filter="url(#pf-glow)" />}
      <rect x="0" y="0" width="64" height="64" rx={rounded} fill="url(#pf-bg-sheen)" />
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx={rounded - 0.5} fill="none" stroke="rgba(227,167,59,0.3)" strokeWidth="1" />
      <rect x="1.5" y="1.5" width="61" height="30" rx={rounded - 1} fill="url(#glossTop)" opacity="0.5" />
      <g transform="translate(0,1)">
        <Capsule w={64} h={64} rot={40} shadow />
        <Tablet w={64} h={64} rot={-50} size={0.42} shadow />
      </g>
    </svg>
  );
}

/* cápsula + lupa — Buscar Fármaco */
function IconCapsuleSearch({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <Capsule w={64} h={64} rot={35} shadow />
      <circle cx="45" cy="45" r="12" fill="var(--bg-elev-2)" stroke="var(--accent-2)" strokeWidth="2.5" />
      <circle cx="43" cy="43" r="5.5" fill="none" stroke="var(--accent-2)" strokeWidth="2.4" />
      <line x1="47" y1="47" x2="52" y2="52" stroke="var(--accent-2)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* cápsula + "+" — Formar Composição */
function IconCapsulePlus({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <Capsule w={64} h={64} rot={35} shadow />
      <circle cx="46" cy="46" r="13" fill="var(--accent-2)" stroke="var(--bg)" strokeWidth="2.5" />
      <line x1="46" y1="40" x2="46" y2="52" stroke="#3a2a0c" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="46" x2="52" y2="46" stroke="#3a2a0c" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   ÁTOMOS DE UI
   ============================================================ */

function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div className="topbar">
      <div className="topbar-row">
        {onBack ? (
          <button className="icon-btn" onClick={onBack} aria-label="Voltar">
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <div className="topbar-title">
          <div className="topbar-title-main">{title}</div>
          {subtitle && <div className="topbar-title-sub">{subtitle}</div>}
        </div>
        <div style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>{right}</div>
      </div>
    </div>
  );
}

function ScoreDots({ tipo, score }) {
  if (tipo === "agt") {
    return (
      <span className="score-total" style={{ color: colorFor("agt", 5), borderColor: borderFor("agt") }}>
        total
      </span>
    );
  }
  const bars = [];
  const active = colorFor(tipo, score);
  for (let i = 1; i <= 5; i++) {
    bars.push(
      <span
        key={i}
        className="bar"
        style={{
          height: `${5 + i * 2.4}px`,
          background: i <= score ? active : "var(--border)",
          boxShadow: i <= score ? `0 0 6px -1px ${active}` : "none",
        }}
      />
    );
  }
  return <span className="meter" role="img" aria-label={`afinidade ${score} de 5`}>{bars}</span>;
}

/* ---------------- calculadoras de conversão ---------------- */

/* Haldol Decanoato: ampola de 1mL com 50mg. Teto de 100mg na 1ª injeção;
   teto de volume de 3mL por sítio em qualquer injeção. */
const HAL_AMP_MG = 50;
const HAL_VOL_MAX = 3;

/* Número no formato brasileiro, sem zero decimal à direita: 2 -> "2", 2,5 -> "2,5". */
function num(v) {
  return String(Math.round(v * 100) / 100).replace(".", ",");
}

function formataVolume(mg, mgPorMl, ampolaMg) {
  const ml = mg / mgPorMl;
  const amp = mg / ampolaMg;
  const partes = [`${num(amp)} ${amp === 1 ? "ampola" : "ampolas"}`, `${num(ml)}mL`];
  partes.push(ml > HAL_VOL_MAX ? `2 sítios — ${num(ml / 2)}mL em cada glúteo` : "injeção única");
  return partes.join(" · ");
}

function DoseStepper({ valor, setValor, passo, min, max, unidade }) {
  const ajusta = (delta) => {
    const n = Math.round((valor + delta) * 10) / 10;
    setValor(Math.min(max, Math.max(min, n)));
  };
  return (
    <div className="calc-input">
      <button className="calc-step" onClick={() => ajusta(-passo)} aria-label="Diminuir">−</button>
      <div className="calc-valor">
        <span className="calc-numero">{num(valor)}</span>
        <span className="calc-unidade">{unidade}</span>
      </div>
      <button className="calc-step" onClick={() => ajusta(passo)} aria-label="Aumentar">+</button>
    </div>
  );
}

function CalcLinha({ rotulo, quando, dose, detalhe, aviso }) {
  return (
    <div className="calc-linha">
      <div className="calc-linha-topo">
        <span className="calc-linha-rotulo">{rotulo}</span>
        <span className="calc-linha-quando">{quando}</span>
      </div>
      <div className="calc-linha-dose">{dose}</div>
      {detalhe && <div className="calc-linha-detalhe">{detalhe}</div>}
      {aviso && <div className="calc-aviso">{aviso}</div>}
    </div>
  );
}

function CalculadoraHaloperidol() {
  const [oral, setOral] = useState(5);
  const alvo = Math.round(oral * 20 * 10) / 10;
  const ataque = Math.min(100, alvo);
  const reposicao = Math.max(0, Math.round((alvo - 100) * 10) / 10);
  const avisoAlvo =
    alvo > 450
      ? "Acima de 450mg/4 semanas a experiência clínica é limitada — reavaliar a dose oral de partida."
      : alvo > 300
      ? "Acima de 300mg/4 semanas sai da faixa da bula — reavaliar a dose oral de partida."
      : null;
  return (
    <Card title="Calculadora — conversão haloperidol">
      <div className="calc-label">Dose oral diária atual</div>
      <DoseStepper valor={oral} setValor={setOral} passo={0.5} min={0.5} max={20} unidade="mg/dia" />
      <div className="calc-alvo">
        Alvo mensal (20x) = <b>{num(alvo)}mg</b>
      </div>
      <div className="calc-saida">
        <CalcLinha
          rotulo="Dose de ataque"
          quando="Dia 1"
          dose={`${num(ataque)}mg`}
          detalhe={formataVolume(ataque, HAL_AMP_MG, HAL_AMP_MG)}
          aviso={alvo > 100 ? "Teto de 100mg na 1ª injeção, qualquer que seja a dose oral prévia." : null}
        />
        {reposicao > 0 ? (
          <CalcLinha
            rotulo="Reposição"
            quando="Dia 8 (janela 3-7 dias)"
            dose={`${num(reposicao)}mg`}
            detalhe={formataVolume(reposicao, HAL_AMP_MG, HAL_AMP_MG)}
          />
        ) : (
          <CalcLinha
            rotulo="Reposição"
            quando="—"
            dose="Não necessária"
            detalhe="O alvo mensal cabe na 1ª injeção."
          />
        )}
        <CalcLinha
          rotulo="Manutenção"
          quando={reposicao > 0 ? "14 dias após a reposição, repetir a cada 28 dias" : "14 dias após a 1ª injeção, repetir a cada 28 dias"}
          dose={`${num(alvo)}mg`}
          detalhe={formataVolume(alvo, HAL_AMP_MG, HAL_AMP_MG)}
          aviso={avisoAlvo}
        />
      </div>
      <p className="p dim" style={{ marginTop: 12 }}>
        IM profunda em região glútea, técnica Z, agulha 21G de 38-50mm, alternando o lado a cada ciclo.
        Oral mantido em sobreposição por 2-4 semanas. A manutenção tende a cair abaixo do alvo calculado
        no primeiro ano — dosar nível de vale e reduzir.
      </p>
    </Card>
  );
}

/* Invega Sustenna: seringa preenchida, 100mg/mL, dose em paliperidona base.
   Dosagens registradas no Brasil: 50, 75, 100 e 150mg. Ataque é FIXO
   (150mg no dia 1 + 100mg no dia 8, deltoide) — a dose oral prévia define
   apenas a manutenção. */
const PALI_ORIGENS = [
  {
    id: "pali-oral",
    rotulo: "Paliperidona oral (OROS)",
    unidade: "mg/dia",
    opcoes: [3, 6, 9, 12],
    mapa: { 3: 50, 6: 75, 9: 100, 12: 150 },
    ataque: true,
  },
  {
    id: "risp-oral",
    rotulo: "Risperidona oral",
    unidade: "mg/dia",
    opcoes: [1, 2, 3, 4, 6],
    mapa: { 1: 25, 2: 50, 3: 75, 4: 100, 6: 150 },
    ataque: true,
    nota: "Equivalência por modelagem farmacocinética — a bula brasileira não traz tabela para risperidona oral, apenas exige tolerância prévia comprovada.",
  },
  {
    id: "risp-lai",
    rotulo: "Risperidona injetável (LAI)",
    unidade: "mg/2 semanas",
    opcoes: [25, 37.5, 50],
    mapa: { 25: 50, 37.5: 75, 50: 100 },
    ataque: false,
    nota: "Já em estado de equilíbrio: aplicar a 1ª dose de Sustenna no lugar da próxima injeção prevista. Não há dose do dia 8.",
  },
];
const PALI_DISPONIVEIS = [50, 75, 100, 150];

function CalculadoraPaliperidona() {
  const [origemId, setOrigemId] = useState("risp-oral");
  const origem = PALI_ORIGENS.find((o) => o.id === origemId);
  const [idx, setIdx] = useState(1);
  const dose = origem.opcoes[Math.min(idx, origem.opcoes.length - 1)];
  const manut = origem.mapa[dose];
  const indisponivel = !PALI_DISPONIVEIS.includes(manut);
  const vol = (mg) => `${num(mg / 100)}mL (seringa de ${mg}mg)`;
  return (
    <Card title="Calculadora — conversão paliperidona">
      <div className="calc-label">Esquema de origem</div>
      <div className="chip-row wrap" style={{ marginBottom: 14 }}>
        {PALI_ORIGENS.map((o) => (
          <button
            key={o.id}
            className={"chip" + (o.id === origemId ? " chip-active" : "")}
            onClick={() => {
              setOrigemId(o.id);
              setIdx(Math.min(idx, o.opcoes.length - 1));
            }}
          >
            {o.rotulo}
          </button>
        ))}
      </div>
      <div className="calc-label">Dose atual</div>
      <div className="chip-row wrap" style={{ marginBottom: 14 }}>
        {origem.opcoes.map((v, i) => (
          <button
            key={v}
            className={"chip" + (v === dose ? " chip-active" : "")}
            onClick={() => setIdx(i)}
          >
            {num(v)} {origem.unidade}
          </button>
        ))}
      </div>
      <div className="calc-saida">
        {origem.ataque ? (
          <Fragment>
            <CalcLinha rotulo="Dose de ataque" quando="Dia 1" dose="150mg" detalhe={vol(150) + " · DELTOIDE"} />
            <CalcLinha
              rotulo="2ª dose de ataque"
              quando="Dia 8 (janela ±2 dias)"
              dose="100mg"
              detalhe={vol(100) + " · DELTOIDE"}
              aviso="O ataque é fixo, não depende da dose oral prévia. Dispensa sobreposição oral — suspender o oral ao iniciar."
            />
            <CalcLinha
              rotulo="Manutenção"
              quando="1 mês após a dose do dia 8, repetir a cada 28 dias (janela ±7 dias)"
              dose={`${manut}mg`}
              detalhe={(indisponivel ? "" : vol(manut) + " · ") + "deltoide ou glúteo"}
              aviso={indisponivel ? `Dosagem de ${manut}mg não registrada no Brasil (disponíveis: 50, 75, 100 e 150mg) — a menor dose viável é 50mg.` : null}
            />
          </Fragment>
        ) : (
          <CalcLinha
            rotulo="Manutenção"
            quando="No lugar da próxima injeção prevista, repetir a cada 28 dias"
            dose={`${manut}mg`}
            detalhe={vol(manut) + " · deltoide ou glúteo"}
            aviso="Sem dose de ataque e sem dose do dia 8."
          />
        )}
      </div>
      {origem.nota && <p className="p dim" style={{ marginTop: 12 }}>{origem.nota}</p>}
      <p className="p dim" style={{ marginTop: 8 }}>
        Manutenção usual 75mg/mês (faixa 50-150mg). Ajustes mensais, mas o efeito pleno de uma mudança
        leva alguns meses. Agulha no deltoide: 23G de 1 polegada, ou 22G de 1½ polegada a partir de 90kg.
      </p>
      <p className="p dim" style={{ marginTop: 8 }}>
        <b>ClCr 50-80mL/min:</b> ataque de 100mg no dia 1 e 75mg no dia 8, manutenção de 50mg/mês
        (ajustável até 100mg). Abaixo de 50mL/min o uso não é recomendado.
      </p>
    </Card>
  );
}

function RiscoCard({ titulo, dado }) {
  if (!dado) return null;
  const nivel = RISCO_NIVEIS[dado.n];
  return (
    <div className={"gest-card gest-" + nivel.tier}>
      <AlertTriangle size={16} />
      <div>
        <div className="gest-rotulo">
          {titulo} — {nivel.rotulo}
        </div>
        <div className="gest-texto">{dado.t}</div>
      </div>
    </div>
  );
}

function Card({ title, children, style }) {
  return (
    <div className="card" style={style}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}

function Tag({ children, tone }) {
  return (
    <span className="tag" style={tone ? { color: tone, borderColor: tone } : undefined}>
      {children}
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <svg width="40" height="40" viewBox="0 0 64 64" style={{ opacity: 0.5 }}>
        <Capsule w={64} h={64} rot={45} tone1="#5c6472" tone2="#333a45" />
      </svg>
      <div className="empty-state-text">{text}</div>
    </div>
  );
}

/* ============================================================
   TELA: HOME
   ============================================================ */

function HomeScreen({ onNavigate, onInfo }) {
  return (
    <div className="screen home-screen">
      <div className="home-top">
        <button className="icon-btn info-btn" onClick={onInfo} aria-label="Sobre / legenda">
          <Info size={19} />
        </button>
      </div>
      <div className="home-hero fade-in-up">
        <div className="logo-wrap"><LogoMark size={92} /></div>
        <h1 className="home-title">
          <span className="wm-light">Psy</span><span className="wm-accent">Core</span>
          <span className="version-badge">V1.7</span>
        </h1>
        <p className="home-tagline">Referência rápida de psicofarmacologia</p>
      </div>

      <div className="home-actions fade-in-up delay-1">
        <button className="action-card" onClick={() => onNavigate("search")}>
          <div className="action-icon"><IconCapsuleSearch size={34} /></div>
          <div className="action-copy">
            <div className="action-title">Buscar fármaco</div>
            <div className="action-sub">Posologia, receptores, metabolismo e meia-vida de um fármaco</div>
          </div>
          <ChevronLeft size={18} className="action-chevron" />
        </button>

        <button className="action-card" onClick={() => onNavigate("compose")}>
          <div className="action-icon"><IconCapsulePlus size={34} /></div>
          <div className="action-copy">
            <div className="action-title">Formar composição de tratamento</div>
            <div className="action-sub">Combine fármacos e veja interações metabólicas e receptores em comum</div>
          </div>
          <ChevronLeft size={18} className="action-chevron" />
        </button>
      </div>

      <div className="home-footer fade-in-up delay-2">
        <div className="credits">
          <div className="credits-name">João V S Melo</div>
          <div className="credits-line">Residente de Psiquiatria do CHC-UFPR</div>
          <div className="credits-line">Instagram: <span className="credits-handle">@drjoamelopsiq</span></div>
          <div className="credits-line">João Melo Ltda</div>
          <div className="credits-year">2026</div>
        </div>
      </div>
    </div>
  );
}

function InfoModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <div className="modal-title">Legenda &amp; sobre</div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="legend-row">
            <span className="dot" style={{ background: colorFor("ant", 4) }} />
            <div>
              <b>Antagonista / inibidor de recaptação</b>
              <div className="legend-sub">escala vermelha, afinidade de + (baixa) a +++++ (extrema)</div>
            </div>
          </div>
          <div className="legend-row">
            <span className="dot" style={{ background: colorFor("agp", 4) }} />
            <div>
              <b>Agonista parcial</b>
              <div className="legend-sub">escala azul, + (quase antagonista) a +++++ (quase agonista total)</div>
            </div>
          </div>
          <div className="legend-row">
            <span className="score-total" style={{ color: colorFor("agt", 5), borderColor: borderFor("agt") }}>total</span>
            <div>
              <b>Agonista total</b>
              <div className="legend-sub">sem escore — ativação máxima do receptor</div>
            </div>
          </div>
          <div className="legend-row">
            <span className="dot" style={{ background: colorFor("mod", 4) }} />
            <div>
              <b>Modulador alostérico</b>
              <div className="legend-sub">escala verde, + (leve) a +++++ (muito alto)</div>
            </div>
          </div>
          <div className="divider" />
          <p className="modal-text modal-disclaimer">
            Ferramenta de apoio educacional para ensino de residentes/estudantes — não substitui bula,
            julgamento clínico ou literatura primária.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TELA: BUSCAR (single-select)
   ============================================================ */

const QUICK_FILTERS = [
  { label: "Antipsicóticos", test: (c) => normalize(c).includes("antipsicotico") },
  { label: "ISRS", test: (c) => normalize(c) === "isrs" },
  { label: "IRSN", test: (c) => normalize(c).includes("irsn") },
  { label: "Tricíclicos", test: (c) => normalize(c).includes("triciclico") },
  { label: "Benzodiazepínicos", test: (c) => normalize(c).includes("benzodiazepinico") },
  { label: "Estabilizadores", test: (c) => normalize(c).includes("estabilizador") || normalize(c).includes("anticonvulsivante") },
  { label: "Estimulantes", test: (c) => normalize(c).includes("estimulante") },
];

function useFilteredDrugs(query, classFilter) {
  return useMemo(() => {
    const q = normalize(query);
    return DATA.drugs
      .filter((d) => {
        if (classFilter) {
          const f = QUICK_FILTERS.find((f) => f.label === classFilter);
          if (f && !f.test(d.classe || "")) return false;
        }
        if (!q) return true;
        return (
          normalize(d.nome).includes(q) ||
          normalize(d.nc).includes(q) ||
          normalize(d.classe).includes(q)
        );
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [query, classFilter]);
}

function DrugRow({ drug, onClick, selected, mode }) {
  return (
    <button className="drug-row" onClick={onClick}>
      {mode === "compose" && (
        <span className={"check-circle" + (selected ? " checked" : "")}>
          {selected && <Check size={13} strokeWidth={3} />}
        </span>
      )}
      <div className="drug-row-main">
        <div className="drug-row-name">{drug.nome}</div>
        <div className="drug-row-sub">
          {drug.classe}
          {drug.nc ? " · " + drug.nc.split(/[\/\(]/)[0].trim() : ""}
        </div>
      </div>
      {mode !== "compose" && <ChevronLeft size={16} className="drug-row-chevron" />}
    </button>
  );
}

function SearchScreen({ onBack, onSelect }) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState(null);
  const results = useFilteredDrugs(query, classFilter);

  return (
    <div className="screen">
      <TopBar title="Buscar fármaco" onBack={onBack} />
      <div className="search-bar-wrap">
        <div className="search-bar">
          <SearchIcon size={17} className="search-bar-icon" />
          <input
            autoFocus
            placeholder="Nome, classe ou nome comercial..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="icon-btn small" onClick={() => setQuery("")}>
              <X size={15} />
            </button>
          )}
        </div>
        <div className="chip-row">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.label}
              className={"chip" + (classFilter === f.label ? " chip-active" : "")}
              onClick={() => setClassFilter(classFilter === f.label ? null : f.label)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="scroll-area">
        {results.length === 0 ? (
          <EmptyState text="Nenhum fármaco encontrado. Tente outro termo." />
        ) : (
          <div className="drug-list">
            {results.map((d) => (
              <DrugRow key={d.id} drug={d} onClick={() => onSelect(d.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TELA: DETALHE DO FÁRMACO
   ============================================================ */

function ReceptorGroupAccordion({ group, items, open, onToggle }) {
  const [expandedRow, setExpandedRow] = useState(null);
  return (
    <div className="rx-group">
      <button className="rx-group-header" onClick={onToggle}>
        <span>{group}</span>
        <span className="rx-group-meta">
          <span className="rx-group-count">{items.length}</span>
          <ChevronDown size={16} className={"chev" + (open ? " chev-open" : "")} />
        </span>
      </button>
      {open && (
        <div className="rx-group-body">
          {items.map((rx) => {
            const isOpen = expandedRow === rx.r;
            return (
              <div key={rx.r} className="rx-row-wrap">
                <button
                  className="rx-row"
                  onClick={() => setExpandedRow(isOpen ? null : rx.r)}
                  style={{ background: bgFor(rx.t), borderColor: borderFor(rx.t) }}
                >
                  <span className="rx-code">{rx.r}</span>
                  <span className="rx-tipo">{TIPO_LABEL[rx.t]}</span>
                  <ScoreDots tipo={rx.t} score={rx.s} />
                </button>
                {isOpen && (rx.et || rx.ea || timecourseFor(rx.r)) && (
                  <div className="rx-detail">
                    {rx.et && (
                      <div className="rx-detail-row">
                        <span className="rx-detail-label ok">Efeito esperado</span>
                        <span>{rx.et}</span>
                      </div>
                    )}
                    {rx.ea && (
                      <div className="rx-detail-row">
                        <span className="rx-detail-label warn">Efeito adverso / risco</span>
                        <span>{rx.ea}</span>
                      </div>
                    )}
                    {timecourseFor(rx.r) && (
                      <>
                        {timecourseFor(rx.r).curto && (
                          <div className="rx-detail-row">
                            <span className="rx-detail-label time-short">Efeito adverso — curto prazo</span>
                            <span>{timecourseFor(rx.r).curto}</span>
                          </div>
                        )}
                        {timecourseFor(rx.r).longo && (
                          <div className="rx-detail-row">
                            <span className="rx-detail-label time-long">Efeito adverso — longo prazo</span>
                            <span>{timecourseFor(rx.r).longo}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DrugDetailScreen({ drugId, onBack, onOpenDrug }) {
  const drug = drugById(drugId);
  const [tab, setTab] = useState("resumo");
  const [openGroups, setOpenGroups] = useState({});
  const groups = useMemo(() => sortedGroupsFor(drug.rx), [drug]);
  const allOpen = groups.length > 0 && groups.every((g) => openGroups[g.group]);

  if (!drug) return null;

  function toggleAll() {
    const next = {};
    if (!allOpen) groups.forEach((g) => (next[g.group] = true));
    setOpenGroups(next);
  }

  const isValproato = drug.id === "valproato";

  return (
    <div className="screen">
      <TopBar title={drug.nome} subtitle={drug.classe} onBack={onBack} />
      <div className="tabs">
        {[
          ["resumo", "Resumo"],
          ["receptores", "Receptores"],
          ["metabolismo", "Metabolismo"],
        ].map(([key, label]) => (
          <button key={key} className={"tab" + (tab === key ? " tab-active" : "")} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {tab === "resumo" && (
          <div className="pad">
            {drug.nc && (
              <Card title="Nome comercial">
                <p className="p">{drug.nc}</p>
              </Card>
            )}
            {drug.pos?.ap && (
              <Card title="Apresentações no Brasil (Anvisa)">
                <p className="p">{drug.pos.ap}</p>
              </Card>
            )}
            {drug.pos?.mv && (
              <Card title="Meia-vida">
                <p className="p mono">{drug.pos.mv}</p>
              </Card>
            )}
            {drug.pos?.pos && (
              <Card title="Posologia">
                <p className="p">{drug.pos.pos}</p>
                {drug.pos.iv && <Tag>{drug.pos.iv}</Tag>}
              </Card>
            )}
            {TITULACAO[drug.id] && (
              <Card title="Plano de otimização de dose">
                <div className="tit-grid">
                  <div className="tit-rotulo">Inicial</div>
                  <div className="tit-valor">{TITULACAO[drug.id].ini}</div>
                  <div className="tit-rotulo">Otimização</div>
                  <div className="tit-valor">{TITULACAO[drug.id].passo}</div>
                  <div className="tit-rotulo">Alvo</div>
                  <div className="tit-valor">{TITULACAO[drug.id].alvo}</div>
                  {TITULACAO[drug.id].teto && (
                    <Fragment>
                      <div className="tit-rotulo">Teto</div>
                      <div className="tit-valor">{TITULACAO[drug.id].teto}</div>
                    </Fragment>
                  )}
                </div>
                {TITULACAO[drug.id].obs && (
                  <p className="p dim" style={{ marginTop: 12 }}>{TITULACAO[drug.id].obs}</p>
                )}
                {(TITULACAO[drug.id].variantes || []).map((v, vi) => (
                  <div className="tit-variante" key={vi}>
                    <div className="tit-variante-titulo">{v.rotulo}</div>
                    <div className="tit-grid">
                      <div className="tit-rotulo">Inicial</div>
                      <div className="tit-valor">{v.ini}</div>
                      <div className="tit-rotulo">Otimização</div>
                      <div className="tit-valor">{v.passo}</div>
                      <div className="tit-rotulo">Alvo</div>
                      <div className="tit-valor">{v.alvo}</div>
                    </div>
                  </div>
                ))}
                {(TITULACAO[drug.id].ajustes || []).map((a, ai) => (
                  <div className="tit-ajuste" key={ai}>
                    <div className="tit-ajuste-titulo">{a.titulo}</div>
                    <div className="tit-ajuste-texto">{a.texto}</div>
                  </div>
                ))}
              </Card>
            )}
            {(ESQUEMAS[drug.id] || []).map((e, ei) => (
              <Card title={ei === 0 ? "Esquemas de troca e conversão" : null} key={ei}>
                <div className="esq-titulo">{e.titulo}</div>
                <div className="tit-grid" style={{ marginTop: 12 }}>
                  {e.campos.map(([rotulo, valor], ci) => (
                    <Fragment key={ci}>
                      <div className="tit-rotulo">{rotulo}</div>
                      <div className="tit-valor">{valor}</div>
                    </Fragment>
                  ))}
                </div>
                {e.nota && <div className="esq-nota">{e.nota}</div>}
                
              </Card>
            ))}
            {drug.obs && (
              <Card title="Observação">
                <p className="p">{drug.obs}</p>
              </Card>
            )}
            {isValproato && (
              <Card title="Ligação proteica (albumina)" style={{ borderColor: "var(--accent)" }}>
                <p className="p">{ALBUMIN.geral}</p>
                <p className="p dim">{ALBUMIN.risco}</p>
              </Card>
            )}
            {drug.id === "haloperidol" && <CalculadoraHaloperidol />}
            {drug.id === "paliperidona" && <CalculadoraPaliperidona />}
            <RiscoCard titulo="Gestação" dado={GESTACAO[drug.id]} />
            <RiscoCard titulo="Amamentação" dado={AMAMENTACAO[drug.id]} />
            {!drug.pos?.pos && !drug.pos?.mv && !drug.pos?.ap && (
              <EmptyState text="Sem dados de posologia cadastrados para este fármaco." />
            )}
          </div>
        )}

        {tab === "receptores" && (
          <div className="pad">
            {groups.length === 0 ? (
              <EmptyState text="Sem perfil de receptores cadastrado." />
            ) : (
              <>
                <div className="toolbar-row">
                  <span className="dim-sm">{drug.rx.length} alvos com dados</span>
                  <button className="link-btn" onClick={toggleAll}>
                    {allOpen ? "Recolher tudo" : "Expandir tudo"}
                  </button>
                </div>
                {groups.map((g) => (
                  <ReceptorGroupAccordion
                    key={g.group}
                    group={g.group}
                    items={g.items}
                    open={!!openGroups[g.group]}
                    onToggle={() => setOpenGroups((s) => ({ ...s, [g.group]: !s[g.group] }))}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {tab === "metabolismo" && (
          <div className="pad">
            {drug.met?.tp && (
              <Card title="Via de eliminação">
                <Tag>{drug.met.tp}</Tag>
                {drug.met.vr && <p className="p dim" style={{ marginTop: 10 }}>{drug.met.vr}</p>}
              </Card>
            )}
            {drug.met?.en?.length > 0 && (
              <Card title="Enzimas envolvidas">
                <div className="enzyme-list">
                  {drug.met.en.map((e) => (
                    <div className="enzyme-item" key={e}>
                      <span className="enzyme-chip">{e}</span>
                      {drug.met.pc?.[e] && <span className="enzyme-share">{drug.met.pc[e]}</span>}
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {drug.met?.tx && (
              <Card title="Notas de metabolismo">
                <p className="p">{drug.met.tx}</p>
              </Card>
            )}
            {(ENZYME_EFFECTS[drug.id] || []).length > 0 && (
              <Card title="Efeito sobre outras enzimas">
                {ENZYME_EFFECTS[drug.id].map((e, i) => (
                  <p className="p" key={i} style={{ marginBottom: i < ENZYME_EFFECTS[drug.id].length - 1 ? 8 : 0 }}>
                    <b style={{ textTransform: "capitalize" }}>{e.effect}</b> {e.strength} de <span className="mono-inline">{e.enzyme}</span>
                    {e.obs ? " — " + e.obs : ""}
                  </p>
                ))}
              </Card>
            )}
            {isValproato && (
              <Card title="Ligação proteica (albumina)" style={{ borderColor: "var(--accent)" }}>
                <p className="p">{ALBUMIN.geral}</p>
                <p className="p dim">{ALBUMIN.risco}</p>
                {Object.values(ALBUMIN.specific).map((tx, ti) => (
                  <p className="p dim" key={ti}>{tx}</p>
                ))}
              </Card>
            )}
            {!drug.met?.tx && !drug.met?.en?.length && (
              <EmptyState text="Sem dados de metabolismo cadastrados." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TELA: FORMAR COMPOSIÇÃO
   ============================================================ */

function ComposeScreen({ selected, setSelected, onBack, onAnalyze }) {
  const [query, setQuery] = useState("");
  const results = useFilteredDrugs(query, null);
  const selectedDrugs = selected.map(drugById).filter(Boolean);

  function toggle(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="screen">
      <TopBar title="Formar composição" subtitle={`${selected.length} fármaco${selected.length === 1 ? "" : "s"} selecionado${selected.length === 1 ? "" : "s"}`} onBack={onBack} />

      {selectedDrugs.length > 0 && (
        <div className="selected-chip-row">
          {selectedDrugs.map((d) => (
            <span key={d.id} className="selected-chip">
              {d.nome}
              <button onClick={() => toggle(d.id)} aria-label={`Remover ${d.nome}`}>
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="search-bar-wrap">
        <div className="search-bar">
          <SearchIcon size={17} className="search-bar-icon" />
          <input
            placeholder="Adicionar fármaco à composição..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="icon-btn small" onClick={() => setQuery("")}>
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="scroll-area" style={{ paddingBottom: 96 }}>
        <div className="drug-list">
          {results.map((d) => (
            <DrugRow key={d.id} drug={d} mode="compose" selected={selected.includes(d.id)} onClick={() => toggle(d.id)} />
          ))}
        </div>
      </div>

      <div className="sticky-cta">
        <button className="btn-primary" disabled={selected.length < 2} onClick={onAnalyze}>
          Analisar interação {selected.length >= 2 ? `(${selected.length})` : ""}
        </button>
        {selected.length < 2 && <div className="cta-hint">Selecione ao menos 2 fármacos</div>}
      </div>
    </div>
  );
}

/* ============================================================
   TELA: RESULTADO DA COMPOSIÇÃO
   ============================================================ */

function useComposeAnalysis(selected) {
  return useMemo(() => {
    const drugs = selected.map(drugById).filter(Boolean);

    // interações metabólicas — enzima em comum (amarelo) ou inibição/indução (vermelho)
    const metabolic = [];
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const a = drugs[i],
          b = drugs[j];
        const enzA = new Set(a.met?.en || []);
        const shared = (b.met?.en || []).filter((e) => enzA.has(e));
        const aOnB = enzymeEffectsAgainst(a, b.met?.en); // a inibe/induz enzima que metaboliza b
        const bOnA = enzymeEffectsAgainst(b, a.met?.en); // b inibe/induz enzima que metaboliza a
        const perpetrator = [
          ...aOnB.map((e) => ({ who: a, whom: b, ...e })),
          ...bOnA.map((e) => ({ who: b, whom: a, ...e })),
        ];
        if (perpetrator.length === 0 && shared.length === 0) continue;
        const tier = perpetrator.length > 0 ? "red" : "yellow";
        metabolic.push({ a, b, shared, perpetrator, tier, nota: pairNote(a, b) });
      }
    }
    metabolic.sort((m1, m2) => (m1.tier === m2.tier ? 0 : m1.tier === "red" ? -1 : 1));

    // matriz de receptores
    const byReceptor = {};
    drugs.forEach((d) => {
      d.rx.forEach((rx) => {
        (byReceptor[rx.r] = byReceptor[rx.r] || []).push({ drug: d, ...rx });
      });
    });
    const groups = GROUP_ORDER.map((g) => {
      const receptors = DATA.receptorOrder.filter(
        (r) => DATA.receptorGroups[r] === g && byReceptor[r]
      );
      return { group: g, receptors };
    }).filter((g) => g.receptors.length > 0);

    // alertas de receptor compartilhado
    const receptorAlerts = [];
    RECEPTOR_ALERT_RULES.forEach((rule) => {
      const hits = (byReceptor[rule.receptor] || []).filter((e) => rule.tipos.includes(e.t));
      const uniqueDrugs = [...new Set(hits.map((h) => h.drug.nome))];
      if (uniqueDrugs.length >= rule.minCount) {
        receptorAlerts.push({ key: rule.receptor, texto: rule.texto(uniqueDrugs) });
      }
    });

    // IMAO — regra de segurança transversal (não depende de receptor idêntico)
    let maoAlerts = [];
    const maoDrugs = drugs.filter((d) => d.rx.some((r) => (r.r === "MAO-A" || r.r === "MAO-B") && r.t === "ant"));
    if (maoDrugs.length > 0 && drugs.length > 1) {
      const outros = drugs.filter((d) => !maoDrugs.some((m) => m.id === d.id));
      const serot = outros.filter((d) => d.rx.some((r) => r.r === "SERT"));
      const simpat = outros.filter((d) =>
        d.rx.some((r) => (r.r === "NAT" || r.r === "DAT" || r.r === "TAAR1") && (r.t === "inib" || r.t === "agt"))
      );
      const nomesMao = maoDrugs.map((d) => d.nome).join(" + ");
      if (serot.length > 0) {
        maoAlerts.push({
          key: "mao-serot",
          titulo: `${nomesMao} + ${serot.map((d) => d.nome).join(", ")} — CONTRAINDICAÇÃO (síndrome serotoninérgica)`,
          texto:
            `Associação de IMAO com agente serotoninérgico é contraindicação formal — risco de síndrome serotoninérgica grave, potencialmente fatal. ` +
            `A inibição da MAO é IRREVERSÍVEL: exige wash-out de ~2 semanas após suspender o IMAO antes de iniciar o serotoninérgico, e de ~2 semanas ` +
            `(5 semanas se o fármaco prévio for fluoxetina, pela meia-vida da norfluoxetina) antes de iniciar o IMAO.`,
        });
      }
      if (simpat.length > 0) {
        maoAlerts.push({
          key: "mao-simpat",
          titulo: `${nomesMao} + ${simpat.map((d) => d.nome).join(", ")} — CONTRAINDICAÇÃO (crise hipertensiva)`,
          texto:
            `Associação de IMAO com agente noradrenérgico/dopaminérgico (estimulantes, IRND, IRSN, tricíclicos) — risco de crise hipertensiva por ` +
            `acúmulo de catecolaminas não degradadas. Mesmo wash-out de ~2 semanas se aplica.`,
        });
      }
      if (maoAlerts.length === 0) {
        maoAlerts.push({
          key: "mao-geral",
          titulo: `${nomesMao} — IMAO em associação`,
          texto:
            `Revisar caso a caso: IMAO exige restrição dietética de tiramina e wash-out de ~2 semanas para qualquer troca. ` +
            `Confirmar que o fármaco associado não é serotoninérgico nem simpatomimético antes de manter a combinação.`,
        });
      }
    }

    // titulação ajustada pela própria associação
    const titulacoes = drugs
      .map((d) => ({ drug: d, t: titulacaoPara(d.id, selected) }))
      .filter((x) => x.t && (x.t.variante || x.t.ajustesAtivos.length > 0));

    // LAI + indutor enzimático — a dose não é corrigível rápido
    const laiAlerts = [];
    const laiPresentes = drugs.filter((d) => LAI_FARMACOS.includes(d.id) && ESQUEMAS[d.id]);
    const indutoresPresentes = drugs.filter((d) => LAI_INDUTORES.includes(d.id));
    if (laiPresentes.length > 0 && indutoresPresentes.length > 0) {
      laiAlerts.push({
        key: "lai-indutor",
        titulo: `${laiPresentes.map((d) => d.nome).join(", ")} em formulação de longa ação + ${indutoresPresentes
          .map((d) => d.nome)
          .join(", ")}`,
        texto:
          `O indutor derruba o nível do antipsicótico, e em formulação de longa ação essa queda não é corrigível na hora: ` +
          `a dose já está aplicada e a meia-vida é de semanas. Definir a dose do LAI JÁ considerando a indução, e nunca ` +
          `iniciar ou suspender o indutor sem replanejar o LAI — suspender o indutor eleva o nível com o depósito ainda liberando.`,
      });
    }

    // interações possíveis (pares específicos, fora do motor por enzima)
    const possibleAlerts = PAIR_POSSIBLE.filter((p) => p.ids.every((id) => selected.includes(id))).map((p) => ({
      key: p.ids.join("-"),
      titulo: p.titulo,
      texto: p.texto,
    }));

    // albumina / valproato
    let albuminAlert = null;
    if (selected.includes("valproato") && drugs.length > 1) {
      const hits = drugs.filter((d) => d.id !== "valproato" && ALBUMIN.specific[d.id]);
      albuminAlert = {
        specific: hits.length > 0,
        tier: hits.length > 0 ? "red" : "amber",
        textos: hits.length > 0 ? hits.map((d) => ALBUMIN.specific[d.id]) : [ALBUMIN.generico],
      };
    }

    return { drugs, metabolic, byReceptor, groups, receptorAlerts, albuminAlert, maoAlerts, possibleAlerts, titulacoes, laiAlerts };
  }, [selected]);
}

function ResultsScreen({ selected, setSelected, onBack, onOpenDrug }) {
  const { drugs, metabolic, groups, byReceptor, receptorAlerts, albuminAlert, maoAlerts, possibleAlerts, titulacoes, laiAlerts } =
    useComposeAnalysis(selected);
  const [expandedProfile, setExpandedProfile] = useState(null);
  const alertCount =
    metabolic.length + receptorAlerts.length + maoAlerts.length + possibleAlerts.length + laiAlerts.length +
    (albuminAlert ? 1 : 0);

  function removeDrug(id) {
    setSelected((s) => s.filter((x) => x !== id));
  }

  return (
    <div className="screen">
      <TopBar title="Composição" subtitle={drugs.map((d) => d.nome).join(" + ")} onBack={onBack} />

      <div className="selected-chip-row">
        {drugs.map((d) => (
          <span key={d.id} className="selected-chip">
            {d.nome}
            <button onClick={() => removeDrug(d.id)} aria-label={`Remover ${d.nome}`}>
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        ))}
      </div>

      <div className="scroll-area">
        <div className="pad">
          {drugs.length < 2 ? (
            <EmptyState text="Selecione ao menos 2 fármacos para ver a análise." />
          ) : (
            <>
              <div className="section-label">
                Alertas {alertCount > 0 && <span className="count-badge">{alertCount}</span>}
              </div>
              {alertCount === 0 && (
                <Card>
                  <p className="p dim">
                    Nenhuma via metabólica comum nem sobreposição de receptor-alvo relevante identificada
                    entre os fármacos selecionados (checagem mecânica — sempre revisar caso a caso).
                  </p>
                </Card>
              )}

              {maoAlerts.map((a) => (
                <div className="alert-card alert-red" key={a.key}>
                  <AlertTriangle size={16} />
                  <div>
                    <div className="alert-title">{a.titulo}</div>
                    <div className="alert-text">{a.texto}</div>
                  </div>
                </div>
              ))}

              {laiAlerts.map((a) => (
                <div className="alert-card alert-orange" key={a.key}>
                  <AlertTriangle size={16} />
                  <div>
                    <div className="alert-title">{a.titulo}</div>
                    <div className="alert-text">{a.texto}</div>
                  </div>
                </div>
              ))}

              {albuminAlert && (
                <div className={"alert-card alert-" + albuminAlert.tier}>
                  <AlertTriangle size={16} />
                  <div>
                    <div className="alert-title">Valproato — ligação à albumina{albuminAlert.specific ? " (interação documentada)" : ""}</div>
                    <div className="alert-text">{ALBUMIN.geral}</div>
                    {albuminAlert.textos.map((tx, ti) => (
                      <div className="alert-text" style={{ marginTop: 6 }} key={ti}>{tx}</div>
                    ))}
                  </div>
                </div>
              )}

              {metabolic.map((m, i) => {
                const titleByTier = {
                  red: "inibição/indução enzimática",
                  yellow: "enzima em comum",
                };
                return (
                  <div className={"alert-card alert-" + m.tier} key={"met" + i}>
                    <AlertTriangle size={16} />
                    <div>
                      <div className="alert-title">
                        {m.a.nome} + {m.b.nome} — {titleByTier[m.tier]}
                      </div>
                      {m.perpetrator.length > 0 && (
                        <div className="alert-text">
                          {m.perpetrator.map((p, pi) => (
                            <div key={pi} style={{ marginBottom: pi < m.perpetrator.length - 1 ? 6 : 0 }}>
                              <b>{p.who.nome}</b> é {p.effect} {p.strength} de <span className="mono-inline">{p.enzyme}</span> → afeta o metabolismo de <b>{p.whom.nome}</b>
                              {p.obs ? " — " + p.obs : ""}.
                            </div>
                          ))}
                        </div>
                      )}
                      {m.shared.length > 0 && (
                        <div className="alert-text" style={{ marginTop: m.perpetrator.length > 0 ? 8 : 0 }}>
                          {m.tier === "yellow"
                            ? `Ambos metabolizados por ${m.shared.join(", ")} → possível interação por via comum.`
                            : `Também compartilham ${m.shared.join(", ")} como via de eliminação.`}
                        </div>
                      )}
                      {m.nota && (
                        <div className="alert-text" style={{ marginTop: 8 }}>
                          {m.nota}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {possibleAlerts.map((a) => (
                <div className="alert-card alert-amber" key={a.key}>
                  <Info size={16} />
                  <div>
                    <div className="alert-title">{a.titulo}</div>
                    <div className="alert-text">{a.texto}</div>
                  </div>
                </div>
              ))}

              {receptorAlerts.map((a) => (
                <div className="alert-card alert-orange" key={a.key}>
                  <AlertTriangle size={16} />
                  <div>
                    <div className="alert-title">Alvo receptor em comum — {a.key}</div>
                    <div className="alert-text">{a.texto}</div>
                  </div>
                </div>
              ))}

              {titulacoes.length > 0 && (
                <Fragment>
                  <div className="section-label" style={{ marginTop: 20 }}>
                    Titulação ajustada por esta associação
                  </div>
                  {titulacoes.map(({ drug: d, t }) => (
                    <Card title={d.nome} key={d.id}>
                      {t.variante && (
                        <Fragment>
                          <div className="tit-variante-titulo">{t.variante.rotulo}</div>
                          <div className="tit-grid">
                            <div className="tit-rotulo">Inicial</div>
                            <div className="tit-valor">{t.ini}</div>
                            <div className="tit-rotulo">Otimização</div>
                            <div className="tit-valor">{t.passo}</div>
                            <div className="tit-rotulo">Alvo</div>
                            <div className="tit-valor">{t.alvo}</div>
                          </div>
                        </Fragment>
                      )}
                      {t.ajustesAtivos.map((a, ai) => (
                        <div className="tit-ajuste" key={ai}>
                          <div className="tit-ajuste-titulo">{a.titulo}</div>
                          <div className="tit-ajuste-texto">{a.texto}</div>
                        </div>
                      ))}
                    </Card>
                  ))}
                </Fragment>
              )}

              {drugs.some((d) => ESQUEMAS[d.id]) && (
                <Fragment>
                  <div className="section-label" style={{ marginTop: 20 }}>
                    Esquemas de troca disponíveis
                  </div>
                  <Card>
                    {drugs
                      .filter((d) => ESQUEMAS[d.id])
                      .map((d) => (
                        <div className="meta-compare-row" key={d.id}>
                          <div className="meta-compare-name">{d.nome}</div>
                          <ul className="esq-lista">
                            {ESQUEMAS[d.id].map((e, ei) => (
                              <li key={ei}>{e.titulo}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    <p className="p dim" style={{ marginTop: 10 }}>
                      O passo a passo de cada esquema está na aba Posologia do fármaco.
                    </p>
                  </Card>
                </Fragment>
              )}

              {[["Gestação", GESTACAO], ["Amamentação", AMAMENTACAO]].map(([rotulo, tabela]) => (
                <Fragment key={rotulo}>
                  <div className="section-label" style={{ marginTop: 20 }}>{rotulo}</div>
                  {[...drugs]
                    .filter((d) => tabela[d.id])
                    .sort((a, b) => {
                      const ord = { contra: 0, relativa: 1, sem: 2 };
                      return ord[tabela[a.id].n] - ord[tabela[b.id].n];
                    })
                    .map((d) => (
                      <RiscoCard key={d.id} titulo={d.nome} dado={tabela[d.id]} />
                    ))}
                </Fragment>
              ))}

              <div className="section-label" style={{ marginTop: 20 }}>Metabolismo comparado</div>
              <Card>
                {drugs.map((d) => (
                  <div key={d.id} className="meta-compare-row">
                    <div className="meta-compare-name">{d.nome}</div>
                    {(d.met?.en || []).length === 0 && (
                      <span className="dim-sm">{d.met?.vr || "sem enzima cadastrada"}</span>
                    )}
                    <div className="enzyme-list">
                      {(d.met?.en || []).map((e) => {
                        const shared = drugs.some((o) => o.id !== d.id && (o.met?.en || []).includes(e));
                        return (
                          <div className="enzyme-item" key={e}>
                            <span className={"enzyme-chip" + (shared ? " enzyme-chip-shared" : "")}>{e}</span>
                            {d.met?.pc?.[e] && <span className="enzyme-share">{d.met.pc[e]}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </Card>

              <div className="section-label" style={{ marginTop: 20 }}>Receptores — mapa de sobreposição</div>
              <div className="matrix-wrap">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th className="matrix-corner">Alvo</th>
                      {drugs.map((d) => (
                        <th key={d.id}>{d.nome.split(/[\/(]/)[0].trim().slice(0, 10)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <Fragment key={g.group}>
                        <tr className="matrix-group-row">
                          <td colSpan={drugs.length + 1}>{g.group}</td>
                        </tr>
                        {g.receptors.map((r) => (
                          <tr key={r}>
                            <td className="matrix-rx">{r}</td>
                            {drugs.map((d) => {
                              const hit = (byReceptor[r] || []).find((h) => h.drug.id === d.id);
                              return (
                                <td key={d.id} className="matrix-cell">
                                  {hit ? (
                                    <span
                                      className="matrix-dot"
                                      style={{
                                        background: colorFor(hit.t, hit.s),
                                        width: hit.t === "agt" ? 13 : 5 + hit.s * 1.7,
                                        height: hit.t === "agt" ? 13 : 5 + hit.s * 1.7,
                                        boxShadow: `0 0 5px -1px ${colorFor(hit.t, hit.s)}`,
                                      }}
                                      title={`${TIPO_LABEL[hit.t]}${hit.t !== "agt" ? " · " + hit.s : ""}`}
                                    />
                                  ) : (
                                    <span className="matrix-dash">·</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="section-label" style={{ marginTop: 20 }}>Perfil por fármaco</div>
              {drugs.map((d) => {
                const open = expandedProfile === d.id;
                const eff = topEffects(d);
                return (
                  <div key={d.id} className="profile-card">
                    <button className="profile-header" onClick={() => setExpandedProfile(open ? null : d.id)}>
                      <div>
                        <div className="profile-name">{d.nome}</div>
                        <div className="dim-sm">{d.classe} · meia-vida {d.pos?.mv || "—"}</div>
                      </div>
                      <ChevronDown size={16} className={"chev" + (open ? " chev-open" : "")} />
                    </button>
                    {open && (
                      <div className="profile-body">
                        {eff.map((e, idx) => (
                          <div key={idx} className="profile-effect">
                            <div className="profile-effect-rx">
                              {e.r} <span className="dim-sm">· {TIPO_LABEL[e.t]}</span>
                            </div>
                            {e.et && <div className="p small">{e.et}</div>}
                            {e.ea && <div className="p small dim">{e.ea}</div>}
                          </div>
                        ))}
                        <button className="link-btn" onClick={() => onOpenDrug(d.id)}>
                          Ver ficha completa →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */

/* ============================================================
   REDE DE SEGURANÇA — mostra o erro na tela em vez de ficar em
   branco (essencial para depurar em celular, sem devtools)
   ============================================================ */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    // eslint-disable-next-line no-console
    console.error("PsyCore crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      const { error, info } = this.state;
      return (
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            background: "#0a0c11",
            color: "#eef0f3",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "24px 18px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#e3a73b", marginBottom: 10 }}>
            PsyCore — erro ao carregar
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 14, color: "#eef0f3" }}>
            {String(error && (error.message || error))}
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.6, color: "#9aa3b2", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "ui-monospace, monospace", background: "#12161d", border: "1px solid #262c37", borderRadius: 12, padding: 12 }}>
            {(error && error.stack) || ""}
            {info && info.componentStack ? "\n\n" + info.componentStack : ""}
          </div>
          <div style={{ fontSize: 11, color: "#5c6472", marginTop: 16 }}>
            Tire um print desta tela e envie — ela mostra exatamente onde travou.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PsyCoreApp() {
  const [stack, setStack] = useState([{ screen: "home" }]);
  const [composeSelected, setComposeSelected] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  /* metadados de "app instalável" — só têm efeito quando a página é servida
     a partir de um host real (fora do iframe do artifact) */
  useEffect(() => {
    const created = [];
    let manifestUrl = null;
    try {
      const setMeta = (name, content, attr = "name") => {
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, name);
          document.head.appendChild(el);
          created.push(el);
        }
        el.setAttribute("content", content);
      };
      document.title = "PsyCore";
      setMeta("viewport", "width=device-width, initial-scale=1, viewport-fit=cover");
      setMeta("theme-color", "#0a0c11");
      setMeta("apple-mobile-web-app-capable", "yes");
      setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
      setMeta("apple-mobile-web-app-title", "PsyCore");
      setMeta("description", "Referência rápida de psicofarmacologia — receptores, posologia, metabolismo e interações.");

      const iconHref = "data:image/svg+xml," + encodeURIComponent(FAVICON_SVG);
      const iconLink = document.createElement("link");
      iconLink.rel = "icon";
      iconLink.type = "image/svg+xml";
      iconLink.href = iconHref;
      document.head.appendChild(iconLink);
      created.push(iconLink);

      const touchIcon = document.createElement("link");
      touchIcon.rel = "apple-touch-icon";
      touchIcon.href = iconHref;
      document.head.appendChild(touchIcon);
      created.push(touchIcon);

      const manifest = {
        name: "PsyCore",
        short_name: "PsyCore",
        start_url: ".",
        display: "standalone",
        background_color: "#0a0c11",
        theme_color: "#0a0c11",
        icons: [{ src: iconHref, sizes: "64x64", type: "image/svg+xml", purpose: "any" }],
      };
      manifestUrl = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: "application/json" }));
      const manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = manifestUrl;
      document.head.appendChild(manifestLink);
      created.push(manifestLink);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("PsyCore: head metadata injection skipped —", e);
    }

    return () => {
      created.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
      if (manifestUrl) URL.revokeObjectURL(manifestUrl);
    };
  }, []);

  const navigate = useCallback((screen, params = {}) => {
    setStack((s) => [...s, { screen, ...params }]);
  }, []);
  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const goHome = useCallback(() => {
    setStack([{ screen: "home" }]);
    setComposeSelected([]);
  }, []);

  const current = stack[stack.length - 1];

  let body = null;
  if (current.screen === "home") {
    body = <HomeScreen onNavigate={(s) => (s === "compose" ? (setComposeSelected([]), navigate("compose")) : navigate(s))} onInfo={() => setShowInfo(true)} />;
  } else if (current.screen === "search") {
    body = <SearchScreen onBack={goBack} onSelect={(id) => navigate("detail", { drugId: id })} />;
  } else if (current.screen === "detail") {
    body = <DrugDetailScreen drugId={current.drugId} onBack={goBack} />;
  } else if (current.screen === "compose") {
    body = (
      <ComposeScreen
        selected={composeSelected}
        setSelected={setComposeSelected}
        onBack={goBack}
        onAnalyze={() => navigate("results")}
      />
    );
  } else if (current.screen === "results") {
    body = (
      <ResultsScreen
        selected={composeSelected}
        setSelected={setComposeSelected}
        onBack={goBack}
        onOpenDrug={(id) => navigate("detail", { drugId: id })}
      />
    );
  }

  return (
    <div className="pf-root">
      <style>{CSS}</style>
      <div className="pf-frame">
        {body}
        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PsyCoreApp />
    </ErrorBoundary>
  );
}

/* ============================================================
   ESTILOS
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  background: #0a0c11;
  min-height: 100%;
}
#root {
  min-height: 100vh;
}

.pf-root {
  --bg: #0a0c11;
  --bg-elev: #12161d;
  --bg-elev-2: #1a1f28;
  --bg-elev-3: #222835;
  --border: #262c37;
  --border-soft: #1c222c;
  --text: #eef0f3;
  --text-dim: #9aa3b2;
  --text-faint: #5c6472;
  --accent: #e3a73b;
  --accent-hi: #f2c065;
  --accent-2: #f2e9d8;
  --accent-soft: rgba(227,167,59,0.14);
  --red: hsl(355 70% 58%);
  --r-sm: 10px; --r-md: 14px; --r-lg: 18px; --r-xl: 22px;
  --shadow-card: 0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 24px -16px rgba(0,0,0,0.7);
  --shadow-pop: 0 20px 48px -16px rgba(0,0,0,0.65);
  --ease: cubic-bezier(.22,.9,.32,1);
  --font-sans: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace;

  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse 120% 60% at 50% -10%, #161c26 0%, var(--bg) 55%);
  display: flex;
  justify-content: center;
  font-family: var(--font-sans);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.pf-root * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.pf-root button, .pf-root input { font-family: inherit; color: inherit; }
.pf-root button { cursor: pointer; appearance: none; -webkit-appearance: none; }
.pf-root ::selection { background: var(--accent); color: #1a1206; }
.pf-root button, .pf-root input, .pf-root [tabindex] { transition: background-color .15s var(--ease), border-color .15s var(--ease), color .15s var(--ease), transform .12s var(--ease), opacity .15s var(--ease); }
.pf-root button:active { transform: scale(0.98); }
.pf-root button:disabled:active { transform: none; }
.pf-root button:focus-visible, .pf-root input:focus-visible {
  outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px;
}
@media (prefers-reduced-motion: reduce) {
  .pf-root *, .pf-root *::before, .pf-root *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}

.pf-frame {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-soft);
  border-right: 1px solid var(--border-soft);
}
.screen { display: flex; flex-direction: column; height: 100vh; }
.scroll-area { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.pad { padding: 14px 16px 32px; }

@keyframes pf-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-in-up { animation: pf-fade-up .55s var(--ease) both; }
.fade-in-up.delay-1 { animation-delay: .08s; }
.fade-in-up.delay-2 { animation-delay: .16s; }

/* topbar */
.topbar { padding: calc(14px + env(safe-area-inset-top)) 8px 10px; border-bottom: 1px solid var(--border-soft); background: var(--bg); position: relative; z-index: 3; }
.topbar-row { display: flex; align-items: center; gap: 4px; }
.topbar-title { flex: 1; text-align: center; overflow: hidden; }
.topbar-title-main { font-weight: 600; font-size: 16px; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-title-sub { font-size: 11.5px; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.icon-btn { width: 36px; height: 36px; border-radius: var(--r-sm); border: none; background: transparent; color: var(--text); display: flex; align-items: center; justify-content: center; }
.icon-btn:active { background: var(--bg-elev-2); }
.icon-btn.small { width: 28px; height: 28px; }

/* home */
.home-screen { padding: 0 22px 28px; justify-content: space-between; height: 100vh; overflow-y: auto; }
.home-top { display: flex; justify-content: flex-end; padding-top: calc(14px + env(safe-area-inset-top)); }
.info-btn { background: var(--bg-elev); border: 1px solid var(--border); box-shadow: var(--shadow-card); }
.home-hero { text-align: center; padding: 22px 0 30px; }
.logo-wrap { display: inline-flex; }
.home-title { font-family: var(--font-mono); font-weight: 700; font-size: 32px; letter-spacing: -0.02em; margin: 18px 0 7px; display: flex; align-items: baseline; justify-content: center; gap: 8px; }
.home-title .wm-light { color: var(--text); font-weight: 500; }
.home-title .wm-accent { color: var(--accent); font-weight: 700; }
.version-badge { font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--accent); background: var(--accent-soft); border: 1px solid rgba(227,167,59,0.4); border-radius: 999px; padding: 2px 7px; letter-spacing: 0.03em; align-self: center; }
.home-tagline { color: var(--text-dim); font-size: 13.5px; margin: 0; letter-spacing: 0.01em; }
.home-actions { display: flex; flex-direction: column; gap: 12px; }
.action-card {
  position: relative;
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-elev); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 16px; text-align: left;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.action-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--accent); transform: scaleY(0); transform-origin: center;
  transition: transform .18s var(--ease);
}
.action-card:active { background: var(--bg-elev-2); border-color: #3a3220; }
.action-card:active::before { transform: scaleY(1); }
.action-icon {
  flex-shrink: 0; width: 50px; height: 50px; border-radius: var(--r-md);
  background: radial-gradient(circle at 35% 30%, var(--bg-elev-3), var(--bg-elev-2));
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
}
.action-copy { flex: 1; min-width: 0; }
.action-title { font-weight: 600; font-size: 15px; margin-bottom: 3px; letter-spacing: -0.005em; }
.action-sub { font-size: 12px; color: var(--text-dim); line-height: 1.45; }
.action-chevron { transform: rotate(180deg); color: var(--text-faint); flex-shrink: 0; }
.home-footer { text-align: center; padding-top: 22px; padding-bottom: env(safe-area-inset-bottom); }
.credits { display: inline-flex; flex-direction: column; gap: 2px; }
.credits-name { font-size: 12px; font-weight: 600; color: var(--text-dim); letter-spacing: 0.01em; }
.credits-line { font-size: 10.5px; color: var(--text-faint); }
.credits-handle { color: var(--text-dim); }
.credits-year { font-size: 10px; color: var(--text-faint); font-family: var(--font-mono); margin-top: 4px; opacity: 0.7; }

/* search */
.search-bar-wrap { padding: 12px 16px 8px; border-bottom: 1px solid var(--border-soft); }
.search-bar { display: flex; align-items: center; gap: 8px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 12px; padding: 11px 12px; box-shadow: var(--shadow-card); }
.search-bar:focus-within { border-color: var(--accent); }
.search-bar-icon { color: var(--text-faint); flex-shrink: 0; }
.search-bar input { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-size: 14.5px; font-family: var(--font-sans); caret-color: var(--accent); }
.search-bar input::placeholder { color: var(--text-faint); }
.chip-row { display: flex; gap: 8px; overflow-x: auto; padding: 10px 2px 2px; scrollbar-width: none; }
.chip-row::-webkit-scrollbar { display: none; }
.chip-row.wrap { flex-wrap: wrap; overflow: visible; }
.chip { flex-shrink: 0; padding: 6.5px 13px; border-radius: 999px; background: var(--bg-elev); border: 1px solid var(--border); color: var(--text-dim); font-size: 12.5px; font-weight: 500; white-space: nowrap; }
.chip:active { background: var(--bg-elev-2); }
.chip-active { background: var(--accent-soft); border-color: var(--accent); color: var(--accent-hi); font-weight: 600; }

.drug-list { display: flex; flex-direction: column; }
.drug-row { display: flex; align-items: center; gap: 12px; width: 100%; padding: 13px 16px; background: transparent; border: none; border-bottom: 1px solid var(--border-soft); text-align: left; }
.drug-row:active { background: var(--bg-elev); }
.drug-row-main { flex: 1; min-width: 0; }
.drug-row-name { font-weight: 600; font-size: 14.5px; letter-spacing: -0.005em; }
.drug-row-sub { font-size: 12px; color: var(--text-dim); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.drug-row-chevron { transform: rotate(180deg); color: var(--text-faint); flex-shrink: 0; }
.check-circle { width: 21px; height: 21px; border-radius: 999px; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--bg); background: var(--bg-elev-2); }
.check-circle.checked { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }

.empty-state { padding: 52px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.empty-state-text { color: var(--text-faint); font-size: 13.5px; max-width: 240px; line-height: 1.5; }

/* tabs */
.tabs { display: flex; padding: 10px 16px 0; gap: 4px; border-bottom: 1px solid var(--border-soft); }
.tab { flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--text-faint); font-size: 13px; font-weight: 600; letter-spacing: 0.01em; border-bottom: 2px solid transparent; }
.tab:active { color: var(--text-dim); }
.tab-active { color: var(--accent); border-bottom-color: var(--accent); }

/* cards */
.card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 15px 16px; margin-bottom: 12px; box-shadow: var(--shadow-card); }
.card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-faint); margin-bottom: 9px; }
.p { font-size: 13.5px; line-height: 1.6; color: var(--text); margin: 0 0 6px; }
.p:last-child { margin-bottom: 0; }
.p.dim { color: var(--text-dim); }
.p.small { font-size: 12.5px; }
.p.mono { font-family: var(--font-mono); font-size: 13px; letter-spacing: -0.01em; }
.tag { display: inline-block; padding: 4px 11px; border-radius: 999px; border: 1px solid var(--border); background: var(--bg-elev-2); font-size: 11.5px; font-weight: 500; color: var(--text-dim); margin-top: 4px; }
.source-note { font-size: 10.5px; color: var(--text-faint); margin-top: 9px; font-style: italic; line-height: 1.5; }

/* receptor accordion */
.toolbar-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.dim-sm { font-size: 11.5px; color: var(--text-faint); }
.link-btn { background: none; border: none; color: var(--accent); font-size: 12.5px; font-weight: 600; padding: 4px; }
.link-btn:active { color: var(--accent-hi); }
.rx-group { margin-bottom: 8px; border: 1px solid var(--border-soft); border-radius: var(--r-lg); overflow: hidden; }
.rx-group-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--bg-elev); border: none; color: var(--text); font-size: 13.5px; font-weight: 600; }
.rx-group-header:active { background: var(--bg-elev-2); }
.rx-group-meta { display: flex; align-items: center; gap: 8px; color: var(--text-faint); }
.rx-group-count { font-family: var(--font-mono); font-size: 11px; background: var(--bg-elev-2); padding: 1px 7px; border-radius: 999px; }
.chev { transition: transform .18s var(--ease); }
.chev-open { transform: rotate(180deg); }
.rx-group-body { padding: 8px; background: var(--bg); display: flex; flex-direction: column; gap: 6px; }
.rx-row-wrap { display: flex; flex-direction: column; }
.rx-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--r-md); border: 1px solid; background: var(--bg-elev); text-align: left; }
.rx-row:active { filter: brightness(1.15); }
.rx-code { font-family: var(--font-mono); font-weight: 600; font-size: 12.5px; width: 78px; flex-shrink: 0; letter-spacing: -0.01em; }
.rx-tipo { flex: 1; font-size: 11.5px; color: var(--text-dim); }
.meter { display: flex; align-items: flex-end; gap: 2.5px; flex-shrink: 0; height: 17px; }
.meter .bar { width: 4px; border-radius: 1.5px; display: inline-block; transition: background-color .2s var(--ease); }
.dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; flex-shrink: 0; }
.score-total { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid; border-radius: 999px; padding: 3px 9px; flex-shrink: 0; }
.rx-detail { padding: 11px 13px; background: var(--bg-elev); border-radius: var(--r-md); margin-top: 4px; display: flex; flex-direction: column; gap: 9px; border: 1px solid var(--border-soft); }
.rx-detail-row { font-size: 12.5px; line-height: 1.55; }
.rx-detail-label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
.rx-detail-label.ok { color: hsl(152 55% 55%); }
.rx-detail-label.warn { color: hsl(355 70% 62%); }
.rx-detail-label.time-short { color: hsl(190 65% 60%); }
.rx-detail-label.time-long { color: hsl(265 55% 68%); }

/* metabolism chips */
.enzyme-chip { font-family: var(--font-mono); font-size: 11.5px; padding: 5px 11px; border-radius: 8px; background: var(--bg-elev-2); border: 1px solid var(--border); color: var(--text); letter-spacing: -0.01em; }
.enzyme-chip-shared { border-color: var(--accent); color: var(--accent-hi); background: var(--accent-soft); font-weight: 600; }
.enzyme-list { display: flex; flex-direction: column; gap: 7px; }
.enzyme-item { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
.enzyme-item .enzyme-chip { flex-shrink: 0; }
.enzyme-share { font-size: 11.5px; color: var(--text-faint); line-height: 1.4; }
.tit-grid { display: grid; grid-template-columns: auto 1fr; gap: 7px 12px; align-items: baseline; }
.tit-rotulo { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-faint); white-space: nowrap; }
.tit-valor { font-size: 13px; line-height: 1.5; color: var(--text); }
.tit-variante { margin-top: 14px; padding: 12px; border-radius: var(--r-md); background: var(--bg-elev-2); border: 1px solid var(--border-soft); border-left: 3px solid var(--accent); }
.tit-variante-titulo { font-size: 12px; font-weight: 600; color: var(--accent-hi); margin-bottom: 10px; line-height: 1.45; }
.tit-ajuste { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-soft); }
.tit-ajuste-titulo { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.tit-ajuste-texto { font-size: 12.5px; line-height: 1.55; color: var(--text-dim); }
.esq-titulo { font-size: 13.5px; font-weight: 600; color: var(--text); line-height: 1.45; }
.esq-passos { margin: 12px 0 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
.esq-passos li { font-size: 12.5px; line-height: 1.55; color: var(--text-dim); }
.esq-passos li::marker { color: var(--accent); font-weight: 700; font-variant-numeric: tabular-nums; }
.calc-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-faint); margin-bottom: 9px; }
.calc-input { display: flex; align-items: stretch; gap: 10px; }
.calc-step { width: 46px; flex-shrink: 0; border-radius: var(--r-md); border: 1px solid var(--border); background: var(--bg-elev-2); color: var(--accent-hi); font-size: 21px; font-weight: 600; line-height: 1; display: flex; align-items: center; justify-content: center; }
.calc-step:active { filter: brightness(1.3); }
.calc-valor { flex: 1; display: flex; align-items: baseline; justify-content: center; gap: 6px; padding: 12px 8px; border-radius: var(--r-md); border: 1px solid var(--border); background: var(--bg-elev-2); }
.calc-numero { font-family: var(--font-mono); font-size: 25px; font-weight: 600; color: var(--text); letter-spacing: -0.02em; }
.calc-unidade { font-size: 12px; color: var(--text-faint); }
.calc-alvo { margin-top: 12px; padding: 10px 12px; border-radius: var(--r-md); background: var(--accent-soft); border: 1px solid rgba(227,167,59,0.3); font-size: 13px; color: var(--accent-hi); text-align: center; }
.calc-saida { margin-top: 14px; display: flex; flex-direction: column; gap: 9px; }
.calc-linha { padding: 11px 13px; border-radius: var(--r-md); background: var(--bg-elev-2); border: 1px solid var(--border-soft); border-left: 3px solid var(--accent); }
.calc-linha-topo { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.calc-linha-rotulo { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-faint); }
.calc-linha-quando { font-size: 11px; color: var(--text-faint); text-align: right; line-height: 1.4; }
.calc-linha-dose { font-family: var(--font-mono); font-size: 19px; font-weight: 600; color: var(--text); margin-top: 5px; letter-spacing: -0.01em; }
.calc-linha-detalhe { font-size: 12px; color: var(--text-dim); margin-top: 3px; line-height: 1.5; }
.calc-aviso { font-size: 11.5px; line-height: 1.5; color: hsl(28 85% 70%); margin-top: 7px; padding-top: 7px; border-top: 1px solid var(--border-soft); }
.gest-card { display: flex; gap: 11px; align-items: flex-start; padding: 13px 14px; border-radius: var(--r-md); border: 1px solid; border-left-width: 3px; margin-top: 10px; }
.gest-card svg { flex-shrink: 0; margin-top: 1px; }
.gest-rotulo { font-size: 12.5px; font-weight: 700; letter-spacing: -0.01em; }
.gest-texto { font-size: 12.5px; line-height: 1.55; color: var(--text-dim); margin-top: 4px; }
.gest-red { background: hsla(355,70%,55%,0.07); border-color: hsla(355,70%,55%,0.25); border-left-color: hsl(355 70% 58%); color: hsl(355 70% 65%); }
.gest-amber { background: rgba(227,167,59,0.07); border-color: rgba(227,167,59,0.3); border-left-color: var(--accent); color: var(--accent-hi); }
.gest-green { background: hsla(150,55%,45%,0.08); border-color: hsla(150,55%,45%,0.28); border-left-color: hsl(150 55% 45%); color: hsl(150 60% 62%); }
.esq-lista { margin: 4px 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
.esq-lista li { font-size: 12.5px; line-height: 1.5; color: var(--text-dim); }
.esq-lista li::marker { color: var(--accent); }
.esq-nota { margin-top: 12px; padding: 10px 12px; border-radius: var(--r-md); font-size: 12.5px; line-height: 1.55; background: hsla(28,80%,55%,0.08); border: 1px solid hsla(28,80%,55%,0.28); border-left: 3px solid hsl(28 80% 55%); color: hsl(28 85% 70%); }

/* compose */
.selected-chip-row { display: flex; gap: 8px; flex-wrap: wrap; padding: 12px 16px 0; }
.selected-chip { display: inline-flex; align-items: center; gap: 7px; background: var(--accent-soft); color: var(--accent-2); border: 1px solid var(--accent); border-radius: 999px; padding: 6px 8px 6px 13px; font-size: 12.5px; font-weight: 600; }
.selected-chip button { background: rgba(0,0,0,0.3); border: none; width: 17px; height: 17px; border-radius: 999px; color: var(--accent-2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.selected-chip button:active { background: rgba(0,0,0,0.5); }
.sticky-cta { position: sticky; bottom: 0; padding: 16px 16px calc(14px + env(safe-area-inset-bottom)); background: linear-gradient(0deg, var(--bg) 65%, transparent); }
.btn-primary {
  width: 100%; padding: 15px; border-radius: var(--r-md); border: none;
  background: linear-gradient(180deg, var(--accent-hi), var(--accent));
  box-shadow: 0 1px 0 rgba(255,255,255,0.35) inset, 0 10px 22px -8px rgba(227,167,59,0.45);
  color: #241a06; font-weight: 700; font-size: 14.5px; letter-spacing: 0.01em;
}
.btn-primary:active { box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset; }
.btn-primary:disabled { background: var(--bg-elev-2); color: var(--text-faint); box-shadow: none; }
.cta-hint { text-align: center; font-size: 11px; color: var(--text-faint); margin-top: 8px; }

/* results */
.section-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-faint); margin: 6px 0 10px; display: flex; align-items: center; gap: 9px; }
.section-label::before { content: ''; width: 3px; height: 12px; border-radius: 2px; background: var(--accent); display: inline-block; flex-shrink: 0; }
.count-badge { background: var(--accent); color: #241a06; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; padding: 1px 7px; border-radius: 999px; }
.alert-card { display: flex; gap: 11px; padding: 13px 14px; border-radius: var(--r-md); border: 1px solid; border-left-width: 3px; margin-bottom: 10px; box-shadow: var(--shadow-card); }
.alert-card svg { flex-shrink: 0; margin-top: 2px; }
.alert-title { font-weight: 700; font-size: 13px; margin-bottom: 4px; letter-spacing: -0.005em; }
.alert-text { font-size: 12.5px; line-height: 1.55; color: var(--text-dim); }
.alert-amber { background: rgba(227,167,59,0.07); border-color: rgba(227,167,59,0.3); border-left-color: var(--accent); color: var(--accent-hi); }
.alert-yellow { background: hsla(48,75%,55%,0.08); border-color: hsla(48,75%,55%,0.3); border-left-color: hsl(48 75% 55%); color: hsl(48 80% 68%); }
.alert-orange { background: hsla(28,80%,55%,0.08); border-color: hsla(28,80%,55%,0.3); border-left-color: hsl(28 80% 55%); color: hsl(28 85% 68%); }
.alert-red { background: hsla(355,70%,55%,0.07); border-color: hsla(355,70%,55%,0.25); border-left-color: hsl(355 70% 58%); color: hsl(355 70% 65%); }
.mono-inline { font-family: var(--font-mono); font-size: 12px; background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 5px; }

.meta-compare-row { padding: 9px 0; border-bottom: 1px solid var(--border-soft); }
.meta-compare-row:last-child { border-bottom: none; }
.meta-compare-name { font-weight: 600; font-size: 13px; margin-bottom: 7px; letter-spacing: -0.005em; }

.matrix-wrap { position: relative; overflow-x: auto; border: 1px solid var(--border-soft); border-radius: var(--r-lg); margin-bottom: 14px; box-shadow: var(--shadow-card); -webkit-overflow-scrolling: touch; }
.matrix { border-collapse: collapse; width: 100%; font-size: 11.5px; }
.matrix th { position: sticky; top: 0; background: var(--bg-elev); padding: 9px 11px; text-align: center; font-size: 10px; font-weight: 700; letter-spacing: 0.02em; color: var(--text-dim); white-space: nowrap; border-bottom: 1px solid var(--border); z-index: 1; }
.matrix-corner { position: sticky; left: 0; z-index: 2; text-align: left !important; background: var(--bg-elev) !important; }
.matrix-rx { position: sticky; left: 0; background: var(--bg-elev); font-family: var(--font-mono); font-weight: 600; font-size: 11.5px; padding: 8px 11px; white-space: nowrap; border-right: 1px solid var(--border-soft); z-index: 1; }
.matrix-group-row td { background: var(--bg-elev-2); color: var(--text-faint); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 11px; position: sticky; left: 0; }
.matrix-cell { text-align: center; padding: 7px; border-bottom: 1px solid var(--border-soft); }
.matrix-dot { display: inline-block; border-radius: 999px; transition: width .2s var(--ease), height .2s var(--ease); }
.matrix-dash { color: var(--border); font-size: 13px; }

.profile-card { border: 1px solid var(--border-soft); border-radius: var(--r-lg); margin-bottom: 10px; overflow: hidden; box-shadow: var(--shadow-card); }
.profile-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 13px 14px; background: var(--bg-elev); border: none; text-align: left; }
.profile-header:active { background: var(--bg-elev-2); }
.profile-name { font-weight: 600; font-size: 13.5px; letter-spacing: -0.005em; }
.profile-body { padding: 4px 14px 14px; display: flex; flex-direction: column; gap: 10px; }
.profile-effect { padding-top: 9px; border-top: 1px solid var(--border-soft); }
.profile-effect-rx { font-family: var(--font-mono); font-size: 12px; font-weight: 600; margin-bottom: 3px; letter-spacing: -0.01em; }

/* modal */
@keyframes pf-sheet-up { from { transform: translateY(16px); opacity: 0.6; } to { transform: translateY(0); opacity: 1; } }
@keyframes pf-fade { from { opacity: 0; } to { opacity: 1; } }
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(5,6,9,0.6); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center; z-index: 50;
  animation: pf-fade .18s var(--ease) both;
}
.modal-sheet {
  width: 100%; max-width: 480px; background: var(--bg-elev); border-radius: var(--r-xl) var(--r-xl) 0 0;
  max-height: 82vh; display: flex; flex-direction: column; border: 1px solid var(--border); border-bottom: none;
  box-shadow: var(--shadow-pop);
  animation: pf-sheet-up .28s var(--ease) both;
  padding-bottom: env(safe-area-inset-bottom);
}
.modal-handle { width: 36px; height: 4px; background: var(--border); border-radius: 999px; margin: 10px auto 0; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; }
.modal-title { font-weight: 700; font-size: 15px; letter-spacing: -0.01em; }
.modal-body { padding: 4px 18px 26px; overflow-y: auto; }
.legend-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; font-size: 13px; border-bottom: 1px solid var(--border-soft); }
.legend-row:last-of-type { border-bottom: none; }
.legend-row .dot { width: 13px; height: 13px; margin-top: 4px; }
.legend-row .score-total { margin-top: 1px; }
.legend-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 2px; line-height: 1.5; }
.divider { height: 1px; background: var(--border-soft); margin: 12px 0; }
.modal-text { font-size: 12.5px; line-height: 1.65; color: var(--text-dim); }
.modal-disclaimer { color: var(--text-faint); font-style: italic; }

@media (min-width: 481px) {
  .pf-frame { margin: 20px 0; min-height: calc(100vh - 40px); border-radius: 30px; overflow: hidden; box-shadow: 0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04); }
  .screen { height: calc(100vh - 40px); }
}
`;