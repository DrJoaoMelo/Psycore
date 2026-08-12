import React, { useState, useMemo, useCallback, useEffect, Fragment, Component } from "react";
import { ChevronLeft, ChevronDown, X, Check, Info, AlertTriangle, Search as SearchIcon } from "lucide-react";

/* ============================================================
   PsyCore — referência rápida de psicofarmacologia
   Dados extraídos da planilha do usuário (85 fármacos, 68 alvos)
   ============================================================ */

const DATA = {"receptorGroups":{"5-HT1A":"Serotoninérgicos","5-HT1B":"Serotoninérgicos","5-HT1D":"Serotoninérgicos","5-HT1E":"Serotoninérgicos","5-HT2A":"Serotoninérgicos","5-HT2B":"Serotoninérgicos","5-HT2C":"Serotoninérgicos","5-HT3":"Serotoninérgicos","5HT-4":"Serotoninérgicos","5HT-5":"Serotoninérgicos","5-HT6":"Serotoninérgicos","5-HT7":"Serotoninérgicos","D1":"Dopaminérgicos","D2":"Dopaminérgicos","D3":"Dopaminérgicos","D4":"Dopaminérgicos","D5":"Dopaminérgicos","SERT":"Transportadores","NAT":"Transportadores","DAT":"Transportadores","α1":"Adrenérgicos","α2":"Adrenérgicos","α2A":"Adrenérgicos","α2B":"Adrenérgicos","α2C":"Adrenérgicos","H1":"Histaminérgicos","H2":"Histaminérgicos","H3":"Histaminérgicos","M1":"Muscarínicos","M2":"Muscarínicos","M3":"Muscarínicos","M4":"Muscarínicos","M5":"Muscarínicos","MT1":"Melatoninérgicos","MT2":"Melatoninérgicos","MT3":"Melatoninérgicos","σ1":"Outros","NOS":"Outros","nAChR":"Outros","NMDA":"Outros","GABA-A":"Outros","GABA-T":"Outros","R- Adenosina A1":"Outros","Canal Na+":"Outros","Canal Ca2+":"Outros","Canal de K+":"Outros","GSK-3β":"Outros","IPPase":"Outros","IMPase":"Outros","HDAC":"Outros","HCN (Ih)":"Outros","Anidrase Carbônica":"Outros","Receptor Caianato":"Outros","κ-opioide":"Outros","μ-opioide":"Outros","δ-opioide":"Outros","OX1":"Outros","OX2":"Outros","GHB":"Outros","VMAT2":"Outros","TAAR1":"Outros","Imidazolina I (I1)":"Outros","AChE":"Outros","BuChE":"Outros","nAChR α4β2":"Outros","nAChR α7":"Outros","CB1":"Outros","CB2":"Outros"},"receptorOrder":["5-HT1A","5-HT1B","5-HT1D","5-HT1E","5-HT2A","5-HT2B","5-HT2C","5-HT3","5HT-4","5HT-5","5-HT6","5-HT7","D1","D2","D3","D4","D5","SERT","NAT","DAT","α1","α2","α2A","α2B","α2C","H1","H2","H3","M1","M2","M3","M4","M5","MT1","MT2","MT3","σ1","NOS","nAChR","NMDA","GABA-A","GABA-T","R- Adenosina A1","Canal Na+","Canal Ca2+","Canal de K+","GSK-3β","IPPase","IMPase","HDAC","HCN (Ih)","Anidrase Carbônica","Receptor Caianato","κ-opioide","μ-opioide","δ-opioide","OX1","OX2","GHB","VMAT2","TAAR1","Imidazolina I (I1)","AChE","BuChE","nAChR α4β2","nAChR α7","CB1","CB2"],"tipoLabels":{"ant":"Antagonista","agp":"Agonista parcial","agt":"Agonista total","mod":"Modulador alostérico","inib":"Inibidor (transportador)","outro":"Outro"},"drugs":[{"id":"trazodona","nome":"Trazodona","classe":"AIRS","nc":"Donaren / Inseris XR","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 (principal), CYP2D6 (menor). Metabólito ativo mCPP (menos potente, atividade 5-HT2C própria)."},"pos":{"mv":"Bifásica: ~3-6h (fase inicial) + 5-9h (fase terminal), IR; XR tem perfil de absorção mais lento","pos":"Insônia: 25-100mg; Depressão: inicial 150mg/dia, usual 150-400mg/dia, máximo 400mg/d (ambulatorial) ou 600mg/d (internado)","iv":"1x/dia (à noite) para insônia; 2-3x/dia para depressão","ap":"Donaren/Donaren XR — comprimidos 50mg e 100mg (liberação imediata); XR 150mg"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"SERT","t":"inib","s":1,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":1,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"buspirona","nome":"Buspirona","classe":"Ansiolítico não-BZD (azapirona)","nc":"Ansitec","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Alta sensibilidade a inibidores/indutores (ex. toranja, cetoconazol)."},"pos":{"mv":"2-11h em média (variação individual ampla, 2-33h)","pos":"Inicial 5mg 2-3x/dia; titular a cada 2-3 dias; usual 20-30mg/dia; máximo 60mg/dia","iv":"2-3x/dia","ap":"Ansitec — comprimidos 5mg e 10mg"},"rx":[{"r":"5-HT1A","t":"agp","s":3,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"D2","t":"agp","s":1,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":2,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"α1","t":"ant","s":1,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"}]},{"id":"cetamina-escetamina","nome":"Cetamina/Escetamina","classe":"Antagonista não competitivo do receptor NMDA","nc":"Ketamin/Ketalar/**Spravato (esquetamina)","obs":"R-cetamina (arcetamina) > S-cetamina (escetamina) em afinidade σ1","met":{"tp":"Hepático","en":["CYP3A4","CYP2B6","CYP2C9"],"tx":"Hepático — CYP3A4 e CYP2B6 (principais), CYP2C9 (menor). Metabólitos ativos: norcetamina (1/3-1/5 da potência no NMDA) e HNK (mecanismo distinto, sem efeito dissociativo)."},"pos":{"mv":"Cetamina IV: ~2-3h; Escetamina intranasal: ~7-12h","pos":"Escetamina (Spravato) intranasal: 56mg dose inicial, depois 56-84mg 2x/semana (indução, sem. 1-4), depois semanal/quinzenal (manutenção). Cetamina IV (off-label): ~0,5mg/kg em infusão de 40min","iv":"Escetamina: 2x/semana (indução) → semanal/quinzenal (manutenção)","ap":"Spravato (escetamina) — spray nasal 28mg/dispositivo, aprovado pela Anvisa. Cetamina racêmica — injetável (uso anestésico/off-label)"},"rx":[{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":2,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"σ1","t":"agp","s":1,"et":"Contribuição para efeito dissociativo/neuroplástico, mecanismo secundário ao antagonismo NMDA (cetamina)","ea":"Mesmo perfil do agonismo total, não caracterizado isoladamente"},{"r":"NMDA","t":"ant","s":5,"et":"Antidepressivo (incluindo efeito antissuicida rápido — cetamina/escetamina); neuroproteção","ea":"Dissociação; hipertensão; náuseas; risco de abuso (cetamina)"},{"r":"κ-opioide","t":"agp","s":1,"et":"Analgesia","ea":"Disforia; alucinações em doses altas"},{"r":"μ-opioide","t":"agp","s":2,"et":"Analgesia potente (referência de classe, fora do escopo desta planilha de psicofármacos)","ea":"Depressão respiratória, dependência, constipação, sedação"}]},{"id":"clozapina","nome":"Clozapina","classe":"Antipsicótico atípico","nc":"Leponex","obs":" Metabólito norclozapina: Ag.Parc. M4 (hipersalivação)","met":{"tp":"Hepático","en":["CYP1A2","CYP3A4","CYP2D6"],"tx":"Hepático — CYP1A2 (principal; tabagismo induz CYP1A2 e reduz níveis), CYP3A4 e CYP2D6 (menores)."},"pos":{"mv":"~12h (8-16h)","pos":"Inicial 12,5mg 1-2x/dia; titular lentamente; usual 300-450mg/dia; máximo 900mg/dia","iv":"2-3x/dia (maior parte à noite)","ap":"Leponex — comprimidos 25mg e 100mg"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":3,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT6","t":"ant","s":3,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":1,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":1,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":2,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":4,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":4,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":1,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"M3","t":"ant","s":3,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":2,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"}]},{"id":"olanzapina","nome":"Olanzapina","classe":"Antipsicótico atípico","nc":"Zyprexa","obs":null,"met":{"tp":"Hepático","en":["UGT1A4","CYP1A2","CYP2D6"],"tx":"Hepático — UGT1A4 (principal) + CYP1A2 (mesma interação com tabagismo da clozapina), CYP2D6 (menor)."},"pos":{"mv":"~30h (21-54h)","pos":"Inicial 5-10mg/dia; usual 10-20mg/dia; máximo 20mg/dia (oral)","iv":"1x/dia","ap":"Zyprexa — comprimidos 2,5/5/10mg; Zyprexa Zydis (dispersível) 5/10mg; injetável IM (uso agudo)"},"rx":[{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":4,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":2,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT6","t":"ant","s":4,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":3,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":2,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":5,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":4,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":2,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"M3","t":"ant","s":3,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":2,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"}]},{"id":"paliperidona","nome":"Paliperidona","classe":"Antipsicótico atípico","nc":"Invega - tem oral e im XR","obs":null,"met":{"tp":"Predominantemente renal","en":["CYP2D6","CYP3A4","glicoproteína-P"],"tx":"Predominantemente renal — 59% excretado inalterado (é o próprio metabólito ativo da risperidona). Hepático mínimo (CYP2D6/CYP3A4, <10%). Substrato de glicoproteína-P."},"pos":{"mv":"~23h (oral ER); formulação injetável de ação prolongada (LAI) tem meia-vida efetiva de semanas","pos":"Oral: 3-12mg/dia. LAI mensal (Invega Sustenna): 39-234mg. LAI trimestral (Invega Trinza) também disponível após estabilização com a mensal","iv":"1x/dia oral; mensal ou trimestral (LAI)","ap":"Invega — comprimidos ER 3/6/9mg; Invega Sustenna injetável mensal; Invega Trinza injetável trimestral"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":2,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":2,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"α2A","t":"ant","s":2,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":4,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"quetiapina","nome":"Quetiapina","classe":"Antipsicótico atípico","nc":"Seroquel","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 (principal), CYP2D6 (menor). Metabólito ativo norquetiapina (mais potente na inibição de NAT, relevante em dose alta)."},"pos":{"mv":"~6-7h (IR); XR tem perfil de absorção mais lento, mesma meia-vida de eliminação","pos":"Inicial 25-50mg/dia; titular; usual 300-800mg/dia (psicose) ou 50-300mg/dia (depressão bipolar/potencialização); máximo 800mg/dia","iv":"2x/dia (IR) ou 1x/dia à noite (XR)","ap":"Seroquel — comprimidos 25/100/200/300mg; Seroquel XRO 50/200/300/400mg"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT6","t":"ant","s":1,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":1,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":1,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":1,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":1,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":1,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M2","t":"ant","s":1,"et":"Contribui pouco especificamente a um efeito terapêutico isolado — subtipo predominantemente cardíaco (vagal)","ea":"Taquicardia (M2 é o subtipo predominante no controle vagal cardíaco)"},{"r":"M3","t":"ant","s":1,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":1,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"}]},{"id":"risperidona","nome":"Risperidona","classe":"Antipsicótico atípico","nc":"Riss, Risperidon, Risperdal (R)","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 (principal; polimorfismo relevante), CYP3A4 (menor). Metabólito ativo paliperidona (potência semelhante)."},"pos":{"mv":"~3-20h (variável por polimorfismo de CYP2D6); considerando a paliperidona (metabólito ativo), meia-vida efetiva combinada ~20h","pos":"Inicial 1-2mg/dia; titular; usual 2-6mg/dia; máximo 16mg/dia. LAI quinzenal (Risperdal Consta) também disponível","iv":"1-2x/dia oral; quinzenal (LAI)","ap":"Risperdal — comprimidos 1/2/3mg; solução oral 1mg/mL; Risperdal Consta injetável quinzenal"},"rx":[{"r":"5-HT1A","t":"agp","s":1,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT7","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":3,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":5,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"asenapina","nome":"Asenapina","classe":"Antipsicótico atípico","nc":"Saprhis - Produção suspensa pela fabricante","obs":null,"met":{"tp":"Hepático","en":["UGT1A4","CYP1A2"],"tx":"Hepático — UGT1A4 (~50%) + CYP1A2. Inibidor fraco-moderado de CYP2D6."},"pos":{"mv":"~24h","pos":"5-10mg 2x/dia (sublingual); máximo 20mg/dia","iv":"2x/dia","ap":"SEM REGISTRO ATIVO NA ANVISA — não é comercializada no Brasil (Saphris não disponível no mercado brasileiro)"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":2,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":3,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":5,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5HT-5","t":"ant","s":3,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT6","t":"ant","s":4,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":5,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":4,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":5,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":5,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":4,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"aripiprazol","nome":"Aripiprazol","classe":"Antipsicótico atípico","nc":"Aristab / Arpejo / Toarip / Arbify","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 (duplo; ajuste de dose por genótipo/inibidores, conforme bula). Metabólito ativo desidro-aripiprazol (potência semelhante)."},"pos":{"mv":"~75h (droga-mãe); metabólito ativo desidro-aripiprazol ~94h","pos":"Oral: inicial 10-15mg/dia; usual 10-30mg/dia; máximo 30mg/dia. LAI mensal (Abilify Maintena) também disponível","iv":"1x/dia oral; mensal (LAI)","ap":"Abilify — comprimidos 10/15/20/30mg; solução oral 1mg/mL; Abilify Maintena injetável mensal"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":5,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT6","t":"ant","s":1,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D2","t":"agp","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"agp","s":2,"et":"Depressão bipolar; anedonia; sintomas negativos da esquizofrenia; possível efeito pró-cognitivo (D3 preferencial — cariprazina)","ea":"Sonolência, acatisia (menos proeminente que agonistas D2-preferenciais)"},{"r":"D4","t":"ant","s":1,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"brexpiprazol","nome":"Brexpiprazol","classe":"Antipsicótico atípico","nc":"Rexulti","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 (duplo, mesmo padrão do aripiprazol)."},"pos":{"mv":"~91h (mais longa da classe — 2-4 dias)","pos":"Inicial 0,5-1mg/dia (potencialização de antidepressivo) ou 1-2mg/dia (esquizofrenia); usual 1-3mg/dia (potencialização) ou 2-4mg/dia (esquizofrenia); máximo 4mg/dia","iv":"1x/dia","ap":"Rexulti (Lundbeck Brasil) — comprimidos 0,5/1/2/3mg, registrado na Anvisa"},"rx":[{"r":"5-HT1A","t":"agp","s":5,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":3,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":3,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":3,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"agp","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"agp","s":4,"et":"Depressão bipolar; anedonia; sintomas negativos da esquizofrenia; possível efeito pró-cognitivo (D3 preferencial — cariprazina)","ea":"Sonolência, acatisia (menos proeminente que agonistas D2-preferenciais)"},{"r":"D4","t":"ant","s":4,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":5,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2C","t":"ant","s":5,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"cariprazina","nome":"Cariprazina","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 (principal), CYP2D6 (menor). Metabólito ativo DDCAR (potência semelhante, meia-vida de 1-3 semanas)."},"pos":{"mv":"2-4 dias (droga-mãe); metabólitos ativos (DCAR/DDCAR) 1-3 SEMANAS","pos":"Inicial 1,5mg/dia; usual 1,5-6mg/dia; máximo 6mg/dia","iv":"1x/dia","ap":"SEM COMERCIALIZAÇÃO REGULAR NO BRASIL — Reagila/Vraylar disponível apenas por importação (via empresas especializadas), sem previsão de registro Anvisa"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D2","t":"agp","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"agp","s":5,"et":"Depressão bipolar; anedonia; sintomas negativos da esquizofrenia; possível efeito pró-cognitivo (D3 preferencial — cariprazina)","ea":"Sonolência, acatisia (menos proeminente que agonistas D2-preferenciais)"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":2,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"α2A","t":"ant","s":2,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"ziprasidona","nome":"Ziprasidona","classe":"Antipsicótico atípico","nc":"Geodon","obs":null,"met":{"tp":"Hepático","en":["aldeído oxidase","CYP3A4"],"tx":"Hepático — aldeído oxidase (2/3 da dose, via não-CYP) + CYP3A4 (1/3)."},"pos":{"mv":"~7h (droga-mãe); metabólito ativo pouco relevante","pos":"Inicial 20mg/dia (com alimento, ≥500kcal); usual 40-80mg/dia; máximo 80mg/dia (oral). Também disponível IM (uso agudo/agitação)","iv":"1x/dia (com alimento) ou 2x/dia dividida","ap":"Geodon — cápsulas 20/40/60/80mg; injetável IM"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":4,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":4,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5HT-5","t":"ant","s":1,"et":"Papel pouco caracterizado clinicamente; hipótese de envolvimento em ritmo circadiano e regulação do sono","ea":"Não caracterizado isoladamente"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":1,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"SERT","t":"inib","s":1,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"iloperidona","nome":"Iloperidona","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP3A4 (duplo, mesmo padrão do aripiprazol/brexpiprazol)."},"pos":{"mv":"~18-33h","pos":"Inicial 1mg 2x/dia; titular; usual 6-12mg/dia dividido; máximo 24mg/dia","iv":"2x/dia","ap":"SEM REGISTRO ATIVO NA ANVISA — Fanapt não comercializado no Brasil"},"rx":[{"r":"5-HT1A","t":"agp","s":2,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT1B","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":2,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":5,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"lumateperona","nome":"Lumateperona","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — múltiplas vias sem CYP dominante (CYP3A4 parcial + redutases + glicuronidação) — reduz risco de interação, segundo a bula."},"pos":{"mv":"~18h","pos":"42mg 1x/dia à noite (dose fixa, sem titulação necessária); não requer ajuste por função renal/hepática leve-moderada","iv":"1x/dia (à noite)","ap":"SEM REGISTRO NA ANVISA — Caplyta (aprovação muito recente nos EUA, 2019) não disponível no Brasil"},"rx":[{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"D1","t":"ant","s":3,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":2,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"α1","t":"ant","s":1,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"}]},{"id":"pimavanserina","nome":"Pimavanserina","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP3A5","CYP2J2"],"tx":"Hepático — CYP3A4/CYP3A5 (principal), CYP2J2 (menor). Sensível a inibidores/indutores de CYP3A4."},"pos":{"mv":"~57h","pos":"34mg 1x/dia (dose fixa); indicado para psicose associada à Doença de Parkinson","iv":"1x/dia","ap":"SEM REGISTRO NA ANVISA — Nuplazid não comercializado no Brasil"},"rx":[{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":4,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"}]},{"id":"blonanserona","nome":"Blonanserona","classe":"Antipsicótico atípico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Dados farmacocinéticos limitados (uso concentrado na Ásia)."},"pos":{"mv":"~68-142h (variável, fármaco pouco caracterizado em população ocidental)","pos":"Inicial 4mg/dia; usual 8-16mg/dia; máximo 24mg/dia (dados de bula japonesa/coreana)","iv":"1-2x/dia","ap":"SEM REGISTRO NA ANVISA — uso concentrado no Japão e Coreia do Sul, não disponível no Brasil"},"rx":[{"r":"5-HT2A","t":"ant","s":5,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"D2","t":"ant","s":5,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":5,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"α2A","t":"ant","s":2,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"}]},{"id":"lurasidona","nome":"Lurasidona","classe":"Antipsicótico atípico","nc":"Latuda / Lutab / Lupib","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Tomar com alimento (absorção); ajuste de dose com inibidores/indutores de CYP3A4."},"pos":{"mv":"~18h","pos":"Inicial 40mg/dia (com alimento, ≥350kcal); usual 40-80mg/dia; máximo 160mg/dia (esquizofrenia) ou 120mg/dia (depressão bipolar)","iv":"1x/dia (com alimento)","ap":"SEM REGISTRO NA ANVISA — Latuda não comercializado no Brasil"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2B","t":"ant","s":4,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":5,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":4,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":1,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2C","t":"ant","s":3,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"}]},{"id":"amilssulprida","nome":"Amilssulprida","classe":"Antipsicótico atípico (AP 2ª G)","nc":"Social","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — hepático mínimo, 50% excretado inalterado (padrão típico das benzamidas)."},"pos":{"mv":"~12h (dose baixa) a ~17h (dose alta) — farmacocinética não-linear","pos":"Baixa dose (efeito antidepressivo/pré-sináptico): 50mg/dia. Alta dose (antipsicótico): 400-800mg/dia","iv":"1x/dia (baixa dose) ou 2x/dia (alta dose)","ap":"Socian — comprimidos 50/100/200mg (disponibilidade pode variar por região/importação)"},"rx":[{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT7","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"}]},{"id":"sulpirida","nome":"Sulpirida","classe":"Antipsicótico atípico (AP 2ª G)","nc":"Equilid","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — mesmo padrão da amissulprida, hepático mínimo."},"pos":{"mv":"~8h","pos":"Baixa dose (efeito antidepressivo/dispepsia funcional): 50-150mg/dia. Alta dose (antipsicótico): 400-800mg/dia; máximo 1600mg/dia","iv":"1-2x/dia (dose baixa) ou 2-3x/dia (dose alta)","ap":"Equilid, Dogmatil — comprimidos 50mg e 200mg"},"rx":[{"r":"D2","t":"ant","s":2,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":2,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"}]},{"id":"levomepromazina","nome":"Levomepromazina","classe":"Antipsicótico típico","nc":"Neozine/Amplictil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 (metabolismo amplo, semelhante à clorpromazina). Inibidor leve de CYP2D6."},"pos":{"mv":"~15-30h","pos":"Baixa dose (sedação/insônia): 3-25mg à noite. Alta dose (antipsicótico): 25-200mg/dia, máximo 1000mg/dia (uso hospitalar)","iv":"1x/dia (dose baixa) a 2-3x/dia (dose alta)","ap":"Neozine, Levozine — comprimidos 25/100mg; solução oral; injetável"},"rx":[{"r":"5-HT2A","t":"ant","s":4,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":3,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":3,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":3,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"}]},{"id":"haloperidol","nome":"Haloperidol","classe":"Antipsicótico típico (AP 1ª G)","nc":"Haldol","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2D6"],"tx":"Hepático — CYP3A4 e CYP2D6 + glicuronidação. Inibidor moderado de CYP2D6."},"pos":{"mv":"~14-26h (variável por polimorfismo de CYP2D6)","pos":"Oral: inicial 0,5-5mg/dia; usual 2-20mg/dia; máximo 100mg/dia (psicose). Também LAI mensal (Haldol Decanoato)","iv":"1-3x/dia oral; mensal (LAI)","ap":"Haldol — comprimidos 1/5mg; solução oral; injetável; Haldol Decanoato injetável mensal"},"rx":[{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT2A","t":"ant","s":1,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT7","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":1,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":4,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":2,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"α1","t":"ant","s":4,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":1,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":1,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"M5","t":"ant","s":1,"et":"Papel clínico independente pouco caracterizado — geralmente coocupado com M1 em antipsicóticos de perfil pan-muscarínico (clozapina, olanzapina, haloperidol, flufenazina, clorpromazina)","ea":"Contribui de forma pouco específica ao perfil anticolinérgico geral"},{"r":"σ1","t":"ant","s":4,"et":"Ansiolítico; auxilia em sintomas depressivos psicóticos; papel clínico menos claro que o dos agonistas — pode até reduzir os benefícios pró-cognitivos observados com agonistas σ1 em combinação (sertralina)","ea":"Não caracterizado isoladamente"}]},{"id":"vilazodona","nome":"Vilazodona","classe":"APIRS","nc":"Aymee / Viibryd","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2C19","CYP2D6"],"tx":"Hepático — CYP3A4 (70%), CYP2C19 e CYP2D6 (menores). Tomar com alimento (absorção)."},"pos":{"mv":"~25h","pos":"Inicial 10mg/dia (com alimento); usual 20-40mg/dia; máximo 40mg/dia","iv":"1x/dia (com alimento)","ap":"Aprovado pela Anvisa (Viibryd) — comprimidos 10/20/40mg; disponibilidade comercial pode ser limitada/intermitente no mercado brasileiro"},"rx":[{"r":"5-HT1A","t":"agp","s":4,"et":"Redução do parkinsonismo por fármaco (aumento de DA); ansiolítico; potencializa efeito antidepressivo do ISRS/IRSN (aumento da liberação de 5-HT e NA); efeito pró-cognitivo (aumento de NA, DA, ACh no CPF); redução da disfunção sexual (aumento de DA/NA no CPF sem downregulation por ausência de agonismo total)","ea":"Cefaleia leve, náusea (aumento de 5-HT geral, com maior ocupação em 5-HT3)"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"}]},{"id":"clonazepam","nome":"Clonazepam","classe":"Benzodiazepínico","nc":"Rivotril","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — nitrorredução (via não-CYP, principal) a 7-amino-clonazepam, com participação parcial de CYP3A4."},"pos":{"mv":"~30-40h","pos":"Ansiedade: 0,25-2mg 2-3x/dia. Pânico: até 4mg/dia. Máximo 20mg/dia (situações especiais)","iv":"2-3x/dia","ap":"Rivotril — comprimidos 0,5/2mg; solução oral (gotas) 2,5mg/mL"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"diazepam","nome":"Diazepam","classe":"Benzodiazepínico","nc":"Valium","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2C19"],"tx":"Hepático — CYP3A4 e CYP2C19. Metabólitos ativos em cascata: nordiazepam → temazepam → oxazepam (meia-vida longa, duração de ação prolongada)."},"pos":{"mv":"~20-100h (droga-mãe + metabólitos ativos em cascata — duração muito prolongada)","pos":"Ansiedade: 5-10mg 2-4x/dia, máximo 40mg/dia. Abstinência alcoólica: doses maiores sob protocolo hospitalar","iv":"2-4x/dia (ou dose única à noite em uso crônico)","ap":"Valium, Diempax — comprimidos 5/10mg; solução oral; injetável"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"bromazepam","nome":"Bromazepam","classe":"Benzodiazepínico","nc":"Lexotan","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4 (hidroxilação) seguida de glicuronidação."},"pos":{"mv":"~10-20h","pos":"Ansiedade: 3-6mg/dia, dividido; máximo 18mg/dia (uso hospitalar)","iv":"1-3x/dia","ap":"Lexotan — comprimidos 3/6mg; solução oral (gotas)"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"alprazolam","nome":"Alprazolam","classe":"Benzodiazepínico","nc":"Frontal, Xanax, Apraz","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4. Alta sensibilidade a inibidores de CYP3A4 (ex. azólicos, macrolídeos)."},"pos":{"mv":"~11-15h","pos":"Ansiedade: 0,25-0,5mg 3x/dia; Pânico: inicial 0,5mg 3x/dia, usual 4-6mg/dia dividido; máximo 10mg/dia","iv":"3x/dia (ou 2x/dia para XR)","ap":"Frontal, Apraz — comprimidos 0,25/0,5/1/2mg; Frontal XR (liberação prolongada) 0,5/1/2/3mg"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"lorazepam","nome":"Lorazepam","classe":"Benzodiazepínico","nc":"Lorax","obs":null,"met":{"tp":"Hepático","en":[],"tx":"Hepático — glicuronidação direta (não-CYP), como oxazepam e temazepam (grupo \"LOT\"). Mais seguro em insuficiência hepática."},"pos":{"mv":"~10-20h (não sofre oxidação hepática — vantagem em hepatopatas/idosos)","pos":"Ansiedade/insônia: 1-4mg/dia dividido; máximo 10mg/dia (ambulatorial, uso não crônico)","iv":"2-3x/dia","ap":"Lorax — comprimidos 1/2mg"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"}]},{"id":"lamotrigina","nome":"Lamotrigina","classe":"Estabilizador / Anticonvulsivante","nc":"Lamictal","obs":null,"met":{"tp":"Hepático","en":["UGT1A4"],"tx":"Hepático — UGT1A4 (não-CYP). Valproato INIBE essa via (aumenta muito níveis de lamotrigina); carbamazepina/fenitoína INDUZEM (reduzem níveis)."},"pos":{"mv":"~25h","pos":"Epilepsia/estabilizador de humor: titulação lenta obrigatória (risco de rash grave) — inicial 25mg em dias alternados (associado a valproato) ou 25mg/dia (sem valproato); titular ao longo de 6 semanas; usual 100-400mg/dia; máximo 400-700mg/dia","iv":"1-2x/dia","ap":"Lamictal — comprimidos 25/50/100/200mg"},"rx":[{"r":"Canal Na+","t":"ant","s":3,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"valproato","nome":"Valproato","classe":"Estabilizador / Anticonvulsivante","nc":"Depakene/Torval/Depakote** (forma ativa divalproato)","obs":null,"met":{"tp":"Hepático","en":["UGT","CYP2C9","CYP2C19","CYP2A6","epóxido-hidrolase"],"tx":"Hepático — glicuronidação (UGT, 30-50%), beta-oxidação mitocondrial (40%), CYP2C9/2C19/2A6 (10-15%). Inibidor de UGT (↑ lamotrigina), de epóxido-hidrolase (↑ carbamazepina-10,11-epóxido) e inibidor fraco de CYP2C9."},"pos":{"mv":"~9-16h","pos":"Estabilizador de humor: inicial 250-500mg/dia; titular; usual 1000-2000mg/dia (15-60mg/kg/dia); monitorização de nível sérico recomendada","iv":"2-3x/dia (ou 1x/dia para ER)","ap":"Depakene, Depakote (divalproato) — comprimidos/cápsulas 250/500mg; Depakote ER 250/500mg; xarope"},"rx":[{"r":"GABA-T","t":"ant","s":1,"et":"Aumenta a disponibilidade de GABA ao inibir sua degradação enzimática — contribui para o efeito anticonvulsivante/estabilizador do valproato","ea":"Efeito mecanístico modesto frente aos demais mecanismos do valproato — sem perfil adverso isolado bem caracterizado"},{"r":"Canal Na+","t":"ant","s":2,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"GSK-3β","t":"ant","s":1,"et":"Neuroplasticidade; neuroproteção (lítio, valproato)","ea":"Anomalia de Ebstein — má formação da válvula tricúspide fetal (lítio, teratogenicidade)"},{"r":"HDAC","t":"ant","s":2,"et":"Contribui para o efeito estabilizador de humor e neuroplástico do valproato (mecanismo epigenético — acetilação de histonas)","ea":"Hipótese de contribuição para teratogenicidade (defeitos de tubo neural)"}]},{"id":"litio","nome":"Lítio","classe":"Estabilizador do humor","nc":"Carbonato de lítio // Carbolitium CR","obs":null,"met":{"tp":"Nenhum (excreção renal integral)","en":[],"tx":"Sem metabolismo — excreção renal integral, forma inalterada. Compete com sódio na reabsorção tubular proximal (interação com diuréticos, IECA/BRA, AINEs)."},"pos":{"mv":"~24h (dose única); pode chegar a ~58h em uso crônico/idosos","pos":"Estabilizador de humor: inicial 300-600mg/dia dividido; titular conforme litemia (alvo 0,6-1,2 mEq/L); usual 900-1800mg/dia; monitorização de nível sérico obrigatória","iv":"2-3x/dia (ou 1x/dia à noite para liberação controlada)","ap":"Carbolitium — comprimidos 300mg; Carbolitium CR (liberação controlada) 450mg"},"rx":[{"r":"GSK-3β","t":"ant","s":2,"et":"Neuroplasticidade; neuroproteção (lítio, valproato)","ea":"Anomalia de Ebstein — má formação da válvula tricúspide fetal (lítio, teratogenicidade)"},{"r":"IPPase","t":"ant","s":3,"et":"Neuroplasticidade e neuroproteção (via depleção de inositol — lítio)","ea":"Acne/psoríase"},{"r":"IMPase","t":"ant","s":2,"et":"Mesmo mecanismo de depleção de inositol do IPPase (lítio)","ea":"Acne/psoríase"}]},{"id":"brexanolona","nome":"Brexanolona","classe":"Esteroide Neuroativo","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":[],"tx":"Hepático — vias não-CYP (3α/3β-hidroxiesteroide desidrogenases, sulfatação, glicuronidação — como esteroides endógenos)."},"pos":{"mv":"~9h","pos":"Depressão pós-parto grave: infusão IV contínua por 60h em ambiente hospitalar monitorado, dose ajustada por peso (protocolo específico)","iv":"Infusão única de 60h (uso hospitalar)","ap":"SEM COMERCIALIZAÇÃO NO BRASIL — Zulresso disponível apenas por importação pessoa física; via IV, não oral"},"rx":[{"r":"GABA-A","t":"mod","s":4,"et":"Efeito ansiolítico/hipnótico intenso e rápido; uso aprovado para depressão pós-parto grave (modulação GABAérgica rápida e profunda)","ea":"Sedação intensa, tontura; risco de perda de consciência em infusão rápida — administração exige monitorização hospitalar controlada"}]},{"id":"metilfenidato","nome":"Metilfenidato","classe":"Estimulante SNC","nc":"Ritalina, Converta, Foq, Rilalina LA","obs":null,"met":{"tp":"Hepático","en":["CES1A1"],"tx":"Hepático — carboxilesterase CES1A1 (não-CYP) a ácido ritalínico (inativo). Participação mínima de CYP450."},"pos":{"mv":"~2-4h (IR); ~3-4h (OROS/ER, absorção prolongada)","pos":"TDAH: inicial 5-10mg 2x/dia (IR) ou 18-36mg/dia (OROS); usual 20-60mg/dia; máximo 60-108mg/dia conforme formulação","iv":"2-3x/dia (IR) ou 1x/dia (OROS/ER)","ap":"Ritalina, Ritalina LA — comprimidos 10mg; cápsulas LA 10/20/30/40mg; Concerta (OROS) 18/36/54mg"},"rx":[{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"clorpromazina","nome":"Clorpromazina","classe":"Fenotiazinas (AP 1ºG)","nc":"Largacil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP1A2","CYP3A4"],"tx":"Hepático — múltiplas vias (CYP2D6, CYP1A2, CYP3A4 + glicuronidação/sulfatação; >10 metabólitos). Inibidor leve de CYP2D6."},"pos":{"mv":"~30h","pos":"Baixa dose (sedação/ansiedade): 25-100mg/dia. Alta dose (psicose): 300-800mg/dia; máximo 1000mg/dia","iv":"1-3x/dia","ap":"Amplictil, Longactil — comprimidos 25/100mg; solução oral; injetável"},"rx":[{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":2,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":2,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":3,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":3,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D5","t":"ant","s":1,"et":"Papel clínico independente não caracterizado (geralmente coocupado com D1)","ea":"Não caracterizado isoladamente"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2","t":"ant","s":1,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"M3","t":"ant","s":2,"et":"Contribui para o perfil metabólico adverso de antipsicóticos (M3 pancreático relacionado à secreção de insulina) e para efeitos anticolinérgicos periféricos","ea":"Desregulação metabólica (redução da secreção de insulina mediada por M3 pancreático — ligação com ganho de peso/diabetes de antipsicóticos como olanzapina/clozapina); boca seca; constipação; visão turva; retenção urinária"},{"r":"M4","t":"ant","s":2,"et":"Contribui ao perfil antipsicótico geral quando associado ao M1 (antagonismo pan-muscarínico de clozapina/olanzapina/quetiapina/clorpromazina); mecanismo isolado pouco distinto do M1","ea":"Mesmo perfil anticolinérgico geral (boca seca, constipação, prejuízo cognitivo)"},{"r":"M5","t":"ant","s":2,"et":"Papel clínico independente pouco caracterizado — geralmente coocupado com M1 em antipsicóticos de perfil pan-muscarínico (clozapina, olanzapina, haloperidol, flufenazina, clorpromazina)","ea":"Contribui de forma pouco específica ao perfil anticolinérgico geral"}]},{"id":"flufenazina","nome":"Flufenazina","classe":"Fenotiazinas (AP 1ºG)","nc":"Flufenan","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP1A2"],"tx":"Hepático — CYP2D6 e CYP1A2 (mesmo padrão da clorpromazina, dose menor)."},"pos":{"mv":"~15-30h","pos":"Oral: 2,5-20mg/dia. Também LAI quinzenal/mensal (Flufenazina Decanoato)","iv":"1-3x/dia oral; quinzenal-mensal (LAI)","ap":"SEM REGISTRO COMERCIAL ATIVO ATUALMENTE NO BRASIL — presença histórica no mercado brasileiro, disponibilidade atual deve ser confirmada por farmácia de manipulação/distribuidor"},"rx":[{"r":"5-HT1A","t":"ant","s":1,"et":"Sem efeito terapêutico independente estabelecido — ocupação de baixa afinidade, tipicamente sem consequência clínica isolada distinta (típico da classe dos antipsicóticos típicos)","ea":"Nenhum efeito adverso independente bem estabelecido"},{"r":"5-HT1B","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":1,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1E","t":"ant","s":1,"et":"Papel clínico independente não caracterizado","ea":"Não caracterizado isoladamente"},{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT6","t":"ant","s":2,"et":"Pró-cognitivo, antidepressivo","ea":"—"},{"r":"5-HT7","t":"ant","s":3,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"D1","t":"ant","s":3,"et":"Contribui para o efeito antipsicótico quando associado ao antagonismo D2 (clozapina, quetiapina); papel isolado pouco caracterizado clinicamente","ea":"Pode contribuir para sedação e efeitos cognitivos negativos; hipótese de contribuição para discinesia tardia (menos estabelecida que para D2)"},{"r":"D2","t":"ant","s":4,"et":"Antipsicótico; antimaníaco","ea":"Parkinsonismo induzido por fármaco, hiperprolactinemia, anedonia, discinesia tardia"},{"r":"D3","t":"ant","s":4,"et":"Baixas doses: bloqueio pré-sináptico → antidepressivo; tratamento de sintomas negativos","ea":"Altas doses: bloqueio pós-sináptico → antipsicótico; antimaníaco; redução do craving | Não leva a hiperprolactinemia ou parkinsonismo induzido por fármaco"},{"r":"D4","t":"ant","s":3,"et":"Papel isolado pouco caracterizado clinicamente; hipótese histórica de contribuição da clozapina não confirmada de forma consistente","ea":"Sem perfil adverso independente bem caracterizado"},{"r":"D5","t":"ant","s":2,"et":"Papel clínico independente não caracterizado (geralmente coocupado com D1)","ea":"Não caracterizado isoladamente"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"α2A","t":"ant","s":1,"et":"Contribui ao perfil de sedação/hipotensão em antipsicóticos com alta afinidade nesse subtipo (ex. asenapina); papel isolado pouco distinto do α1","ea":"Hipotensão, sedação — potencializa os efeitos do bloqueio α1"},{"r":"α2B","t":"ant","s":2,"et":"Papel clínico isolado pouco caracterizado — geralmente coocupado com α2A/α2C nos antipsicóticos de perfil amplo","ea":"Não caracterizado isoladamente"},{"r":"α2C","t":"ant","s":2,"et":"Diferencial farmacológico importante da risperidona/asenapina/brexpiprazol/paliperidona (afinidade muito alta) — hipótese de contribuição para efeito ansiolítico e pró-cognitivo (modulação da resposta ao estresse no CPF); possível contribuição ao efeito em sintomas negativos","ea":"Hipotensão; possível contribuição para sedação"},{"r":"H2","t":"ant","s":1,"et":"Sem efeito terapêutico psiquiátrico independente estabelecido","ea":"Não caracterizado isoladamente em psicofarmacologia"},{"r":"M5","t":"ant","s":1,"et":"Papel clínico independente pouco caracterizado — geralmente coocupado com M1 em antipsicóticos de perfil pan-muscarínico (clozapina, olanzapina, haloperidol, flufenazina, clorpromazina)","ea":"Contribui de forma pouco específica ao perfil anticolinérgico geral"}]},{"id":"bupropiona","nome":"Bupropiona","classe":"IRND","nc":"Wellbutrin / Bup / Zyban / Alpes","obs":null,"met":{"tp":"Hepático","en":["CYP2B6"],"tx":"Hepático — CYP2B6 (metabólito ativo hidroxibupropiona, mais potente). Inibidor potente de CYP2D6 (ex.: reduz conversão de tamoxifeno em endoxifeno)."},"pos":{"mv":"~21h (droga-mãe); hidroxibupropiona ~20h","pos":"Depressão: inicial 150mg/dia; usual 300mg/dia; máximo 450mg/dia (XL). Cessação tabágica: 150mg/dia por 3 dias, depois 150mg 2x/dia","iv":"1x/dia (XL) ou 2x/dia (SR)","ap":"Wellbutrin XL, Zetron, Bup — comprimidos XL 150/300mg; SR 150mg"},"rx":[{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"nAChR","t":"ant","s":2,"et":"Contribui para a eficácia na cessação tabágica (reduz o reforço da nicotina) — mecanismo adicional da bupropiona além da inibição de NAT/DAT","ea":"Convulsões em dose alta (risco aumentado, contraindicado em epilepsia/transtornos alimentares)"}]},{"id":"duloxetina","nome":"Duloxetina","classe":"IRSN","nc":"Cymbalta / Cymbi / Dual","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2D6"],"tx":"Hepático — CYP1A2 (principal) e CYP2D6 (menor). Tabagismo induz CYP1A2 (↓ níveis); fluvoxamina ↑ muito os níveis. Inibidor moderado de CYP2D6."},"pos":{"mv":"~12h","pos":"Depressão/dor neuropática: inicial 30-60mg/dia; usual 60mg/dia; máximo 120mg/dia","iv":"1x/dia","ap":"Cymbalta, Velija — cápsulas 30/60mg"},"rx":[{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"venlafaxina","nome":"Venlafaxina","classe":"IRSN","nc":"Efexor / Venforin / Alenthus XR","obs":"Relação Ki SERT:NAT ≈30:1 — em baixa dose (≤150mg/d) comporta-se essencialmente como ISRS; inibição de NAT clinicamente relevante só surge em doses mais altas (ocupação de NAT não aumenta além de ~150mg/d)","met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 (metabólito ativo desvenlafaxina, potência semelhante) e CYP3A4 (menor). Inibidor fraco de CYP2D6."},"pos":{"mv":"~5h (droga-mãe); desvenlafaxina ~11h","pos":"Inicial 37,5-75mg/dia (XR); usual 75-225mg/dia; máximo 375mg/dia","iv":"1x/dia (XR)","ap":"Efexor XR, Venlaxin — cápsulas XR 37,5/75/150mg"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"desvenlafaxina","nome":"Desvenlafaxina","classe":"IRSN","nc":"Pristiq / Desve","obs":"Diferente da venlafaxina: perfil SERT:NAT próximo de 1:1 (levemente NAT-preferencial em alguns estudos de ocupação PET) — IRSN mais \"balanceado\"","met":{"tp":"Hepático","en":["UGT","CYP3A4"],"tx":"Hepático — UGT (não-CYP, principal) + CYP3A4 (menor). Menos dependente de CYP que a venlafaxina."},"pos":{"mv":"~11h","pos":"Inicial 50mg/dia; usual 50mg/dia (a maioria não se beneficia de doses maiores); máximo 100mg/dia","iv":"1x/dia","ap":"Pristiq — comprimidos 50/100mg"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"minalciprana","nome":"Minalciprana","classe":"IRSN","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 50% excretado inalterado; glicuronidação (não-CYP) para o restante."},"pos":{"mv":"~8h","pos":"Dor crônica/fibromialgia: inicial 12,5mg 1x/dia, titular; usual 100mg/dia dividido; máximo 200mg/dia. Uso como antidepressivo é off-label no Brasil (aprovação primária é para fibromialgia)","iv":"2x/dia","ap":"Dalcipran, Coreg (verificar nome comercial atual) — disponibilidade no Brasil deve ser confirmada; a indicação aprovada no país é fibromialgia, não depressão"},"rx":[{"r":"SERT","t":"inib","s":1,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"levominalciprana","nome":"Levominalciprana","classe":"IRSN","nc":"Não tem no Brasil","obs":"Levomilnaciprana é o IRSN mais \"noradrenérgico-preferencial\" da classe — potência funcional ~2x maior para NAT que para SERT (IC50 NE=10,5nM vs 5-HT=19,0nM), confirmado in vivo por teste pressor de tiramina em humanos; ~10-17x mais seletiva para NAT que venlafaxina/duloxetina/desvenlafax,ina","met":{"tp":"Predominantemente renal","en":["CYP3A4"],"tx":"Predominantemente renal — 55% excretado inalterado; CYP3A4 (menor) para o restante."},"pos":{"mv":"~12h","pos":"Inicial 20mg/dia; usual 40-80mg/dia; máximo 120mg/dia","iv":"1x/dia","ap":"SEM CONFIRMAÇÃO DE COMERCIALIZAÇÃO NO BRASIL — Fetzima é o nome nos EUA; disponibilidade no mercado brasileiro incerta, verificar com distribuidor/Anvisa antes de prescrever"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"atomoxetina","nome":"Atomoxetina","classe":"ISRN (não-estimulante)","nc":"Atentah","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP2C19"],"tx":"Hepático — CYP2D6 (polimorfismo muito relevante: metabolizadores lentos têm exposição ~10x maior). CYP2C19 (menor)."},"pos":{"mv":"~5h (mas o efeito farmacodinâmico dura mais, por ligação prolongada a NAT)","pos":"TDAH: inicial 40mg/dia (adultos) ou 0,5mg/kg/dia (crianças); titular após 3 dias; usual 80-100mg/dia; máximo 100mg/dia (adultos) ou 1,4mg/kg/dia (crianças)","iv":"1-2x/dia","ap":"Strattera — cápsulas 10/18/25/40/60/80mg"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":5,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"escitalopram","nome":"Escitalopram","classe":"ISRS","nc":"Lexapro / Esc / Exodus","obs":null,"met":{"tp":"Hepático","en":["CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP2C19 (principal), CYP3A4 e CYP2D6 (menores). Inibidor fraco-moderado de CYP2D6."},"pos":{"mv":"~27-32h","pos":"Inicial 10mg/dia; usual 10-20mg/dia; máximo 20mg/dia","iv":"1x/dia","ap":"Lexapro, Reconter — comprimidos 10/15/20mg; solução oral (gotas)"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"}]},{"id":"fluoxetina","nome":"Fluoxetina","classe":"ISRS","nc":"Prozac / Daforin","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático — CYP2D6 (metabólito ativo norfluoxetina, meia-vida muito mais longa). Fluoxetina/norfluoxetina são inibidores potentes de CYP2D6, e moderados de CYP2C9, CYP2C19 e CYP3A4."},"pos":{"mv":"~1-4 dias (droga-mãe); norfluoxetina ~4-16 dias","pos":"Inicial 20mg/dia; usual 20-40mg/dia; máximo 80mg/dia","iv":"1x/dia","ap":"Prozac, Daforin — cápsulas 20mg; solução oral (gotas) 20mg/mL"},"rx":[{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"fluvoxamina","nome":"Fluvoxamina","classe":"ISRS","nc":"Revoc","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2D6"],"tx":"Hepático — CYP1A2 e CYP2D6. Inibidor potente de CYP1A2 (o mais forte entre os ISRS) e CYP2C19, e moderado de CYP3A4/2C9 (↑ muito clozapina, teofilina, cafeína)."},"pos":{"mv":"~15h","pos":"Inicial 50mg/dia (à noite); usual 100-200mg/dia; máximo 300mg/dia","iv":"1x/dia (à noite)","ap":"Luvox — comprimidos 50/100mg"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"σ1","t":"agp","s":2,"et":"Contribuição para efeito dissociativo/neuroplástico, mecanismo secundário ao antagonismo NMDA (cetamina)","ea":"Mesmo perfil do agonismo total, não caracterizado isoladamente"}]},{"id":"paroxetina","nome":"Paroxetina","classe":"ISRS","nc":"Pondera","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático — CYP2D6 (satura em doses maiores, por autoinibição). É o inibidor mais potente de CYP2D6 entre os ISRS (ex.: tamoxifeno)."},"pos":{"mv":"~21h","pos":"Inicial 20mg/dia; usual 20-50mg/dia; máximo 60mg/dia","iv":"1x/dia","ap":"Aropax, Pondera — comprimidos 20/25mg; comprimidos CR"},"rx":[{"r":"SERT","t":"inib","s":5,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"M1","t":"ant","s":1,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"NOS","t":"ant","s":1,"et":"Sem efeito terapêutico central estabelecido de forma isolada","ea":"Disfunção erétil (efeito periférico — ex. paroxetina)"}]},{"id":"sertralina","nome":"Sertralina","classe":"ISRS","nc":"Zoloft / Assert / Tolrest","obs":null,"met":{"tp":"Hepático","en":["CYP2C19","CYP2B6","CYP2D6","CYP2C9","CYP3A4"],"tx":"Hepático — CYP2C19 e CYP2B6 (N-desmetilação), CYP2D6/2C9/3A4 (menores). Inibidor leve-moderado de CYP2D6 em doses altas."},"pos":{"mv":"~26h","pos":"Inicial 50mg/dia; usual 50-200mg/dia; máximo 200mg/dia","iv":"1x/dia","ap":"Zoloft, Assert — comprimidos 25/50/100mg; solução oral (gotas)"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"DAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"σ1","t":"ant","s":3,"et":"Ansiolítico; auxilia em sintomas depressivos psicóticos; papel clínico menos claro que o dos agonistas — pode até reduzir os benefícios pró-cognitivos observados com agonistas σ1 em combinação (sertralina)","ea":"Não caracterizado isoladamente"}]},{"id":"citalopram","nome":"Citalopram","classe":"ISRS","nc":"Cipramil","obs":null,"met":{"tp":"Hepático","en":["CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP2C19 e CYP3A4 (principais), CYP2D6 (menor)."},"pos":{"mv":"~35h","pos":"Inicial 20mg/dia; usual 20-40mg/dia; máximo 40mg/dia (redução de dose acima de 60 anos, risco de prolongamento de QT)","iv":"1x/dia","ap":"Cipramil — comprimidos 20/40mg; solução oral (gotas)"},"rx":[{"r":"SERT","t":"ant","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"H1","t":"outro","s":1,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"agomelatina","nome":"Agomelatina","classe":"Melatoninérgico","nc":"Valdoxan","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C9","CYP2C19"],"tx":"Hepático — CYP1A2 (90%). Contraindicado com inibidores potentes de CYP1A2 (ex. fluvoxamina — risco de hepatotoxicidade). CYP2C9 e CYP2C19 (menores)."},"pos":{"mv":"~1-2h (droga-mãe); primeira passagem muito extensa","pos":"Inicial 25mg/dia (à noite); usual 25-50mg/dia; máximo 50mg/dia. CONTRAINDICADO com fluvoxamina","iv":"1x/dia (à noite)","ap":"Valdoxan — comprimidos 25mg"},"rx":[{"r":"5-HT2B","t":"ant","s":1,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"ant","s":1,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"MT1","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — induz sono por inibição do núcleo supraquiasmático","ea":"—"},{"r":"MT2","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — regula transcrição genética para regularização do sono (atrasa a fase pela manhã, induz à noite)","ea":"—"}]},{"id":"vortioxetina","nome":"Vortioxetina","classe":"Multimodal serotoninérgico","nc":"Brintelix / Vortulix","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4","CYP3A5","CYP2C9","CYP2C19","CYP2A6","CYP2C8","CYP2B6"],"tx":"Hepático — CYP2D6 (principal), com CYP3A4, CYP3A5, CYP2C9, CYP2C19, CYP2A6, CYP2C8 e CYP2B6 (vias secundárias — reduz dependência de uma única via)."},"pos":{"mv":"~66h","pos":"Inicial 10mg/dia; usual 10-20mg/dia; máximo 20mg/dia","iv":"1x/dia","ap":"Brintellix — comprimidos 5/10/15/20mg"},"rx":[{"r":"5-HT1A","t":"agt","s":6,"et":"Mesmo espectro de efeito do agonismo parcial, com eficácia intrínseca máxima — potencial ganho pró-cognitivo/antidepressivo adicional","ea":"Mesmo perfil do agonismo parcial; risco teórico maior de contribuir para síndrome serotoninérgica em associação com outros serotoninérgicos"},{"r":"5-HT1B","t":"agp","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT1D","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo","ea":"Cefaleia"},{"r":"5-HT3","t":"ant","s":4,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"5-HT7","t":"ant","s":2,"et":"Possível efeito pró-cognitivo e antidepressivo (aumento de 5-HT e glutamato no CPF); possível papel em ritmo circadiano","ea":"—"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"}]},{"id":"mirtazapina","nome":"Mirtazapina","classe":"NaSSA","nc":"Rameron / Menelate / Razapina","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP1A2","CYP3A4"],"tx":"Hepático — CYP2D6, CYP1A2 e CYP3A4 (múltiplas vias)."},"pos":{"mv":"~20-40h","pos":"Inicial 15mg/dia (à noite); usual 15-45mg/dia; máximo 45mg/dia","iv":"1x/dia (à noite)","ap":"Remeron — comprimidos 15/30/45mg; comprimidos dispersíveis (SolTab)"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"5-HT2C","t":"ant","s":2,"et":"Antidepressivo com aumento do afeto positivo (age na fadiga, hipersonia, retardo psicomotor, apatia — aumento de DA/NA); auxilia em impulsividade/bulimia (aumento de DA/NA no CPF); auxílio na insônia (latência do sono, por atraso do núcleo supraquiasmático — ciclo circadiano)","ea":"Ganho de peso, aumento de apetite"},{"r":"5-HT3","t":"ant","s":3,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"α2","t":"ant","s":3,"et":"Efeito antidepressivo (aumenta liberação de NA e 5-HT ao bloquear autorreceptores/heterorreceptores pré-sinápticos — ex. mirtazapina)","ea":"Ansiedade inicial, ativação"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"}]},{"id":"amitriptilina","nome":"Amitriptilina","classe":"Tricíclico","nc":"Amytril","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP2C19","CYP1A2","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP2C19/1A2/3A4 (metabólito ativo nortriptilina). Inibidor leve de CYP2D6."},"pos":{"mv":"~10-25h (droga-mãe); nortriptilina (metabólito) ~18-44h","pos":"Inicial 25-50mg/dia; usual 100-150mg/dia; máximo 300mg/dia (uso hospitalar)","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Amytril, Tryptanol — comprimidos 25/75mg"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":3,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"nortriptilina","nome":"Nortriptilina","classe":"Tricíclico","nc":"Pamelor","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático — CYP2D6 (polimorfismo relevante; monitorização de nível sérico usada na prática)."},"pos":{"mv":"~18-44h","pos":"Inicial 25mg/dia; usual 75-150mg/dia; máximo 150mg/dia (ambulatorial); monitorização de nível sérico disponível","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Pamelor — cápsulas 10/25/50/75mg; solução oral"},"rx":[{"r":"5-HT2A","t":"ant","s":3,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":2,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":3,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"clomipramina","nome":"Clomipramina","classe":"Tricíclico","nc":"Anafranil","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP1A2, CYP2C19 e CYP3A4 (metabólito ativo desmetilclomipramina, mais noradrenérgico) + CYP2D6. Inibidor leve de CYP2D6."},"pos":{"mv":"~19-37h","pos":"Inicial 25mg/dia; usual 100-150mg/dia; máximo 250mg/dia (oral) — protocolo IV disponível para TOC refratário em alguns serviços","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Anafranil — comprimidos 10/25mg; solução injetável"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":4,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":3,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":3,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":3,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"imipramina","nome":"Imipramina","classe":"Tricíclico","nc":"Imipra","obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C19","CYP3A4","CYP2D6"],"tx":"Hepático — CYP1A2, CYP2C19 e CYP3A4 (metabólito ativo desipramina, mais noradrenérgico) + CYP2D6. Inibidor leve de CYP2D6."},"pos":{"mv":"~11-25h (droga-mãe); desipramina (metabólito) ~12-24h","pos":"Inicial 25-75mg/dia; usual 100-200mg/dia; máximo 300mg/dia (uso hospitalar)","iv":"1x/dia (à noite) ou 2-3x/dia","ap":"Tofranil — comprimidos 10/25mg"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":2,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":2,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"doxepina","nome":"Doxepina","classe":"Tricíclico","nc":"Só tem sob manipulação","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP2C19"],"tx":"Hepático — CYP2D6 e CYP2C19. Inibidor leve de CYP2D6."},"pos":{"mv":"~8-24h","pos":"Inicial 25-75mg/dia; usual 75-150mg/dia; máximo 300mg/dia. Em dose baixa (3-6mg), uso off-label específico para insônia","iv":"1x/dia (à noite)","ap":"SEM APRESENTAÇÃO COMERCIAL REGULAR NO BRASIL — disponível majoritariamente via manipulação (farmácia de manipulação), não como especialidade farmacêutica industrializada"},"rx":[{"r":"5-HT2A","t":"ant","s":2,"et":"Antipsicótico no parkinsonismo; antipsicótico na demência; reduz parkinsonismo induzido por fármaco; reduz sintomas negativos na esquizofrenia; possível estabilização do humor e efeito antidepressivo na bipolaridade; melhora da insônia (sono N3 — fadiga ao despertar e formação de memória) e ansiedade; reduz produção de prolactina; reduz parkinsonismo induzido por fármaco","ea":"—"},{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"α1","t":"ant","s":2,"et":"Melhora do sono (pesadelos, ex. prazosina no TEPT); melhora da agitação no Alzheimer","ea":"Hipotensão ortostática; possível sedação; taquicardia reflexa; priapismo (raro)"},{"r":"H1","t":"ant","s":4,"et":"Efeito terapêutico na ansiedade e insônia","ea":"Sedação, letargia, ganho de peso — redução da taxa metabólica basal e ativação do ciclo de vigília"},{"r":"M1","t":"ant","s":2,"et":"Sedação; redução do parkinsonismo induzido por fármaco","ea":"Prejuízos de memória; constipação; boca seca; visão turva"},{"r":"Canal Na+","t":"ant","s":1,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"}]},{"id":"carbamazepina","nome":"Carbamazepina","classe":"Anticonvulsivante","nc":"Tegretol","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","epóxido-hidrolase"],"tx":"Hepático — CYP3A4 (metabólito ativo carbamazepina-10,11-epóxido, depois via epóxido-hidrolase). Indutor potente de CYP3A4 (também CYP1A2, CYP2C9, CYP2C19 e UGT); autoindução nas primeiras semanas."},"pos":{"mv":"~12-17h (dose única); ~5-14h em uso crônico (autoindução do próprio metabolismo)","pos":"Estabilizador de humor/epilepsia: inicial 200mg/dia; titular; usual 600-1200mg/dia; monitorização de nível sérico disponível","iv":"2-4x/dia (ou 1-2x/dia para CR)","ap":"Tegretol — comprimidos 200/400mg; Tegretol CR 200/400mg; suspensão oral"},"rx":[{"r":"R- Adenosina A1","t":"ant","s":1,"et":"Upregulation compensatória de receptores — menor excitabilidade em grandes ondas por mais receptores de um sinalizador inibitório; efeito antimaníaco e neuroprotetor hipotético","ea":"—"},{"r":"Canal Na+","t":"ant","s":4,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"},{"r":"Canal de K+","t":"ant","s":3,"et":"—","ea":"Alargamento do QT (hERG) — risco de arritmia, classe de efeito adverso, não terapêutico"}]},{"id":"topiramato","nome":"Topiramato","classe":"Anticonvulsivante","nc":"Amato, Égide, Sygmax","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 70% inalterado em dose baixa; hepático ganha relevância em dose alta. Inibidor fraco de CYP2C19 e indutor fraco/dose-dependente de CYP3A4."},"pos":{"mv":"~21h","pos":"Epilepsia/enxaqueca: inicial 25mg/dia; titular lentamente (1-2 semanas); usual 100-400mg/dia; máximo 400mg/dia","iv":"1-2x/dia","ap":"Topamax — comprimidos 25/50/100mg"},"rx":[{"r":"GABA-A","t":"agp","s":2,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"},{"r":"Canal Na+","t":"ant","s":4,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"},{"r":"Canal de K+","t":"ant","s":3,"et":"—","ea":"Alargamento do QT (hERG) — risco de arritmia, classe de efeito adverso, não terapêutico"},{"r":"Anidrase Carbônica","t":"ant","s":4,"et":"Perda de peso; perda de apetite (efeito colateral às vezes usado terapeuticamente — ex. topiramato para obesidade off-label)","ea":"Parestesia; acidose metabólica; nefrolitíase"},{"r":"Receptor Caianato","t":"ant","s":4,"et":"Redução da neurotransmissão glutamatérgica excitatória — contribui para o efeito anticonvulsivante e estabilizador de humor do topiramato","ea":"Lentificação cognitiva, parestesias (mecanismo compartilhado com outros efeitos do topiramato)"}]},{"id":"oxcarbazepina","nome":"Oxcarbazepina","classe":"Anticonvulsivante","nc":"Trileptal","obs":null,"met":{"tp":"Hepático","en":[],"tx":"Hepático — arilcetona-redutase (não-CYP) ao metabólito ativo eslicarbazepina (MHD — principal responsável pelo efeito). Indutor moderado de CYP3A4/UGT e inibidor leve de CYP2C19."},"pos":{"mv":"~2h (droga-mãe); eslicarbazepina (MHD, metabólito ativo) ~9h","pos":"Epilepsia: inicial 300mg/dia; titular; usual 600-1200mg/dia; máximo 2400mg/dia","iv":"2x/dia","ap":"Trileptal — comprimidos 300/600mg; suspensão oral"},"rx":[{"r":"GABA-A","t":"agp","s":1,"et":"α2,α3 — ansiolítico; α2,α3 — miorrelaxante (corno anterior da medula e núcleo motor); α1 — hipnótico; α1 — anticonvulsivante; α1,α5 — amnésico","ea":"Tolerância; dependência; risco de quedas; sedação (α1); prejuízo de memória (α1, α5); α2,α3 — potencializa efeitos do álcool"},{"r":"R- Adenosina A1","t":"outro","s":0,"et":"Upregulation compensatória de receptores — menor excitabilidade em grandes ondas por mais receptores de um sinalizador inibitório; efeito antimaníaco e neuroprotetor hipotético","ea":"—"},{"r":"Canal Na+","t":"ant","s":3,"et":"Redução da transmissão neuronal repetitiva — efeito anticonvulsivante, antimaníaco, estabilizador de humor, analgésico (dor neuropática)","ea":"Se bloqueio excessivo (ex. intoxicação por tricíclico) — arritmia, alargamento do QRS"},{"r":"Canal Ca2+","t":"ant","s":1,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"},{"r":"Canal de K+","t":"ant","s":2,"et":"—","ea":"Alargamento do QT (hERG) — risco de arritmia, classe de efeito adverso, não terapêutico"}]},{"id":"zolpidem","nome":"Zolpidem","classe":"Fármaco Z","nc":"Stilnox","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP1A2","CYP2C9"],"tx":"Hepático — CYP3A4 (principal), CYP1A2/2C9 (menores)."},"pos":{"mv":"~2,5h","pos":"Insônia: 5-10mg imediatamente antes de deitar (dose reduzida para 5mg em mulheres, por metabolismo mais lento); máximo 10mg/dia","iv":"1x/dia (ao deitar)","ap":"Stilnox — comprimidos 10mg; Stilnox CR (liberação controlada) 6,25/12,5mg"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"Efeito hipnótico com menor efeito ansiolítico/miorrelaxante que os BZDs clássicos (seletividade α1 — zolpidem/zaleplona); eszopiclona menos seletiva, mais próxima do perfil clássico","ea":"Sonolência residual, amnésia anterógrada em dose alta, parassonias (sonambulismo)"}]},{"id":"eszopiclona","nome":"Eszopiclona","classe":"Fármaco Z","nc":"Prysma","obs":null,"met":{"tp":"Hepático","en":["CYP3A4","CYP2E1"],"tx":"Hepático — CYP3A4 e CYP2E1 (menor)."},"pos":{"mv":"~6h","pos":"Insônia: 1-3mg imediatamente antes de deitar; máximo 3mg/dia","iv":"1x/dia (ao deitar)","ap":"Lunesta — disponibilidade comercial no Brasil deve ser confirmada; presença histórica limitada no mercado"},"rx":[{"r":"GABA-A","t":"mod","s":3,"et":"Efeito hipnótico com menor efeito ansiolítico/miorrelaxante que os BZDs clássicos (seletividade α1 — zolpidem/zaleplona); eszopiclona menos seletiva, mais próxima do perfil clássico","ea":"Sonolência residual, amnésia anterógrada em dose alta, parassonias (sonambulismo)"}]},{"id":"suvorexant","nome":"Suvorexant","classe":"Inibidor Orexinas","nc":"Não tem no Brasil","obs":"Ki OX1R=0,55nM / Ki OX2R=0,35nM — afinidades praticamente equivalentes (diferença <2x), antagonista duplo não-seletivo","met":{"tp":"Hepático","en":["CYP3A4","CYP2C19"],"tx":"Hepático — CYP3A4 (ajuste de dose com inibidores, conforme bula), CYP2C19 (menor)."},"pos":{"mv":"~12h","pos":"Insônia: 10-20mg imediatamente antes de deitar; máximo 20mg/dia","iv":"1x/dia (ao deitar)","ap":"APROVADO PELA ANVISA mas AINDA SEM COMERCIALIZAÇÃO CONFIRMADA — Belsomra disponível majoritariamente por importação até o momento"},"rx":[{"r":"OX1","t":"ant","s":5,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"},{"r":"OX2","t":"ant","s":5,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"}]},{"id":"lemborexant","nome":"Lemborexant","classe":"Inibidor Orexinas","nc":"Não tem no Brasil","obs":"v Ki OX1R=6,1nM vs OX2R=2,6nM — lemborexanta tem preferência documentada pelo OX2R (~2x), diferente da suvorexanta (não-seletiva)","met":{"tp":"Hepático","en":["CYP3A4","CYP3A5"],"tx":"Hepático — CYP3A4 (mesmo ajuste da suvorexanta), CYP3A5 (menor)."},"pos":{"mv":"~17-19h (5mg) a ~55h (10mg) — farmacocinética não-linear","pos":"Insônia: 5-10mg imediatamente antes de deitar; máximo 10mg/dia","iv":"1x/dia (ao deitar)","ap":"REGISTRO APROVADO PELA ANVISA (2025) mas SEM PREÇO/COMERCIALIZAÇÃO DEFINIDOS AINDA — Dayvigo aguardando aprovação de preço pela CMED"},"rx":[{"r":"OX1","t":"ant","s":4,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"},{"r":"OX2","t":"ant","s":5,"et":"Hipnótico para insônia — redução de neurotransmissão da vigília (efeito reversível, segue o ciclo circadiano); ação principalmente via OX2","ea":"Sonolência residual diurna; paralisia do sono, alucinações hipnagógicas (raras)"}]},{"id":"melatonina","nome":"Melatonina","classe":"Agonista melatoninérgico","nc":null,"obs":null,"met":{"tp":"Hepático","en":["CYP1A2","CYP2C19","CYP1A1"],"tx":"Hepático — CYP1A2 (principal) e CYP2C19/1A1 (menores). Biodisponibilidade oral baixa (15%). Sensível a inibidores de CYP1A2 (fluvoxamina ↑ muito os níveis)."},"pos":{"mv":"~45min-1h (efeito rápido, meia-vida curta)","pos":"Insônia/jet lag: 0,5-5mg (uso não regulado como medicamento em muitos países — suplemento em alguns mercados)","iv":"1x/dia (30-60min antes de deitar)","ap":"Disponível no Brasil majoritariamente como SUPLEMENTO ALIMENTAR (não como medicamento registrado), em diversas concentrações (0,21mg a 10mg)"},"rx":[{"r":"MT1","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — induz sono por inibição do núcleo supraquiasmático","ea":"—"},{"r":"MT2","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — regula transcrição genética para regularização do sono (atrasa a fase pela manhã, induz à noite)","ea":"—"},{"r":"MT3","t":"agt","s":6,"et":"Reduz formação de radicais livres (efeito antioxidante)","ea":"—"}]},{"id":"rameltonina","nome":"Rameltonina","classe":"Agonista melatoninérgico","nc":"Rahime","obs":" Ki MT1=14pM vs MT2=112pM — rameltona tem preferência ~8x pelo MT1 (ao contrário da agomelatina/melatonina, que não diferenciam)","met":{"tp":"Hepático","en":["CYP1A2","CYP2C9","CYP3A4"],"tx":"Hepático — CYP1A2 (90%, primeira passagem extensa, biodisponibilidade <2%), CYP2C9/3A4 (menores). Contraindicado com fluvoxamina."},"pos":{"mv":"~1-2,6h","pos":"Insônia: 8mg, 30 minutos antes de deitar; máximo 8mg/dia","iv":"1x/dia (ao deitar)","ap":"SEM REGISTRO NA ANVISA — Rozerem não comercializado no Brasil"},"rx":[{"r":"MT1","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — induz sono por inibição do núcleo supraquiasmático","ea":"—"},{"r":"MT2","t":"agt","s":6,"et":"Melhora da insônia e do ritmo circadiano — regula transcrição genética para regularização do sono (atrasa a fase pela manhã, induz à noite)","ea":"—"}]},{"id":"modafinila","nome":"Modafinila","classe":"Inibidor Atípico do Transportador de Dopamina","nc":"Stavigile","obs":" Ki in vitro fraco (~4µM, mais fraco que cocaína/metilfenidato), mas ocupação por PET in vivo de 51-57% do DAT estriatal em doses clínicas (200-300mg) — divergência Ki-fraco/ocupação-relevante. Modo de ligação \"atípico\": estabiliza conformação DAT voltada para dentro (inward-facing), diferente de cocaína/metilfenidato (voltada para fora) — correlaciona com menor potencial de abuso apesar do bloqueio real do DAT (Schmitt & Reith 2011)","met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — hidrólise amídica (não-CYP) + CYP3A4 (menor). Indutor moderado de CYP3A4 e CYP1A2 e inibidor fraco-moderado de CYP2C19."},"pos":{"mv":"~15h","pos":"TDAH/sonolência excessiva: inicial 100-200mg/dia (manhã); usual 200mg/dia; máximo 400mg/dia","iv":"1x/dia (manhã) ou dividido manhã/meio-dia","ap":"Stavigile — comprimidos 100/200mg"},"rx":[{"r":"DAT","t":"inib","s":2,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"solrianfetol","nome":"Solrianfetol","classe":"IRND","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 95% excretado inalterado. Hepático mínimo."},"pos":{"mv":"~7,1h","pos":"Sonolência excessiva (narcolepsia/apneia do sono): inicial 75mg/dia (manhã); titular; usual 75-150mg/dia; máximo 150mg/dia","iv":"1x/dia (manhã)","ap":"SEM REGISTRO NA ANVISA — Sunosi não comercializado no Brasil, confirmado pela Associação Brasileira de Narcolepsia (ABRANHI)"},"rx":[{"r":"NAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":1,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"pitolisanto","nome":"Pitolisanto","classe":"Inibidor H3","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4","FMO"],"tx":"Hepático — CYP2D6 e CYP3A4 + FMO (menor)."},"pos":{"mv":"~20h","pos":"Sonolência excessiva (narcolepsia): inicial 8,9mg/dia (manhã); titular; usual 17,8-35,6mg/dia; máximo 35,6mg/dia","iv":"1x/dia (manhã)","ap":"SEM REGISTRO NA ANVISA — Wakix não comercializado no Brasil, confirmado pela ABRANHI"},"rx":[{"r":"H3","t":"ant","s":4,"et":"Melhora da sonolência diurna (pitolisanto)","ea":"Insônia, cefaleia"}]},{"id":"oxibato-de-sodio","nome":"Oxibato de sódio","classe":"Depressor do sistema nervoso central","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Não-hepático","en":[],"tx":"Via não-hepática — semialdeído succínico desidrogenase converte a succinato (ciclo de Krebs), sem passar por CYP450."},"pos":{"mv":"~0,5-1h (bem curta — por isso a dose noturna dividida)","pos":"Cataplexia/narcolepsia: inicial 4,5g/noite (dividido em 2 doses, 1ª ao deitar + 2ª 2,5-4h depois); titular; usual 6-9g/noite; máximo 9g/noite","iv":"2x/noite (regime fracionado obrigatório, por meia-vida curta)","ap":"SEM COMERCIALIZAÇÃO REGULAR NO BRASIL — Xyrem disponível apenas por importação controlada (substância sujeita a controle especial)"},"rx":[{"r":"GHB","t":"agp","s":3,"et":"Potencializa efeito sedativo; tratamento da cataplexia/narcolepsia (oxibato de sódio)","ea":"Depressão respiratória em dose alta; potencial de abuso; sonambulismo"}]},{"id":"lisdexanfetamina-anfetaminas","nome":"Lisdexanfetamina/anfetaminas","classe":"Estimulante SNC","nc":"Venvanse","obs":"Mecanismo não é bloqueio clássico de sítio, e sim substrato do VMAT2: a anfetamina entra na vesícula sináptica e, como amina terciária protonável, colapsa o gradiente de pH vesicular, causando efluxo de dopamina por um mecanismo de troca (exchange-diffusion) — efeito funcional final é redução do armazenamento vesicular normal, daí a manutenção na escala de \"antagonismo\" funcional","met":{"tp":"Outro/Indefinido","en":["CYP2D6"],"tx":"Lisdexanfetamina é pró-fármaco inativo — convertida a dextroanfetamina por hidrólise nas hemácias (não-hepática). Dextroanfetamina: parcialmente CYP2D6, parcialmente renal (dependente de pH). Inibidor fraco de CYP2D6."},"pos":{"mv":"Lisdexanfetamina (pró-fármaco) ~1h; dextroanfetamina (ativa) ~10-13h","pos":"TDAH: inicial 30mg/dia (manhã); titular semanalmente; usual 30-70mg/dia; máximo 70mg/dia","iv":"1x/dia (manhã)","ap":"Venvanse — cápsulas 30/50/70mg (também 20/40/60mg em algumas apresentações)"},"rx":[{"r":"NAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"},{"r":"VMAT2","t":"ant","s":4,"et":"Tratamento da discinesia tardia e coreia (tetrabenazina-símile); reduz liberação dopaminérgica quando usado como substrato de troca (anfetaminas)","ea":"Sedação, depressão, acatisia, prolongamento do QT (classe tetrabenazina)"},{"r":"TAAR1","t":"agt","s":6,"et":"Inverte a direção do DAT/NAT (efluxo em vez de captação) e diminui a exposição extracelular de D2 → reduz fissura; reduz sintomas psicóticos; melhora atenção no TDAH","ea":"Taquicardia, ansiedade, insônia (classe estimulante)"}]},{"id":"clonidina","nome":"Clonidina","classe":"Alfa 2 agonista","nc":"Atensina ; Clonidin","obs":null,"met":{"tp":"Hepático","en":["CYP2D6"],"tx":"Hepático parcial (50%, via CYP2D6) + renal do restante (40-60%, inalterado)."},"pos":{"mv":"~12-16h","pos":"Hipertensão/TDAH (off-label)/Tourette: inicial 0,1mg 2x/dia; titular; usual 0,2-0,6mg/dia dividido; máximo 2,4mg/dia (hipertensão)","iv":"2-3x/dia (ou 1x/semana para adesivo transdérmico)","ap":"Atensina — comprimidos 0,100/0,150/0,200mg; adesivo transdérmico (Catapres-TTS) disponibilidade variável"},"rx":[{"r":"α2A","t":"agp","s":5,"et":"Melhora da cognição e do comportamento no TDAH — ação pós-sináptica no córtex pré-frontal (fortalece conexões dendríticas em sinais de baixa intensidade); subtipo mais seletivamente visado pela guanfacina","ea":"Sedação leve, hipotensão, bradicardia"},{"r":"α2B","t":"agp","s":4,"et":"Sedação (redução da atividade simpática) — subtipo mais associado ao efeito sedativo/hipnótico da clonidina","ea":"Sonolência excessiva, hipotensão"},{"r":"α2C","t":"agp","s":4,"et":"Modulação de catecolaminas (reduz liberação); potencializa sedação; possível papel em impulsividade","ea":"Potencializa sedação e hipotensão dos demais subtipos"},{"r":"Imidazolina I (I1)","t":"agp","s":5,"et":"Hipotensão; sedação (contribui para o efeito da clonidina, distinto do efeito α2)","ea":"Mesmo perfil do agonismo α2 — sedação, hipotensão"}]},{"id":"guanfacina-er","nome":"Guanfacina ER","classe":"Alfa 2 agonista","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP3A4"],"tx":"Hepático — CYP3A4 (ajuste de dose com inibidores/indutores, conforme bula)."},"pos":{"mv":"~17h","pos":"TDAH: inicial 1mg/dia (à noite); titular semanalmente; usual 1-4mg/dia (conforme peso); máximo 4mg/dia","iv":"1x/dia","ap":"SEM CONFIRMAÇÃO DE COMERCIALIZAÇÃO REGULAR NO BRASIL — Intuniv/guanfacina ER de disponibilidade limitada/incerta; verificar registro Anvisa atualizado antes de prescrever"},"rx":[{"r":"α2A","t":"agp","s":4,"et":"Melhora da cognição e do comportamento no TDAH — ação pós-sináptica no córtex pré-frontal (fortalece conexões dendríticas em sinais de baixa intensidade); subtipo mais seletivamente visado pela guanfacina","ea":"Sedação leve, hipotensão, bradicardia"},{"r":"α2B","t":"agp","s":1,"et":"Sedação (redução da atividade simpática) — subtipo mais associado ao efeito sedativo/hipnótico da clonidina","ea":"Sonolência excessiva, hipotensão"},{"r":"α2C","t":"agp","s":1,"et":"Modulação de catecolaminas (reduz liberação); potencializa sedação; possível papel em impulsividade","ea":"Potencializa sedação e hipotensão dos demais subtipos"}]},{"id":"viloxazina","nome":"Viloxazina","classe":"IRSN com inibição 5ht","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","UGT1A9","UGT2B15"],"tx":"Hepático — CYP2D6 (<50%, polimorfismo com impacto modesto) + UGT1A9/UGT2B15. Inibidor potente de CYP1A2, moderado de CYP2D6 e fraco-moderado de CYP3A4 (ex.: teofilina, contraindicada)."},"pos":{"mv":"IR: 2-5h; ER (Qelbree): ~7h","pos":"TDAH: inicial 100mg/dia (crianças) ou 200mg/dia (adultos); titular; usual 100-400mg/dia (crianças) ou 200-600mg/dia (adultos); máximo 400mg/dia (crianças) ou 600mg/dia (adultos)","iv":"1x/dia (manhã)","ap":"SEM REGISTRO CONFIRMADO NA ANVISA — Qelbree é aprovação recente nos EUA (2021), disponibilidade no Brasil não confirmada"},"rx":[{"r":"5-HT2B","t":"ant","s":2,"et":"Modula liberação de 5-HT (reduz riscos); ansiolítico periférico (redução de espasmos vasculares centrais e intestinais); antimigranoso (redução da vasodilatação central)","ea":"Constipação a curto prazo"},{"r":"5-HT2C","t":"agp","s":4,"et":"Contribui para efeito no TDAH/humor via modulação da liberação de NE/DA no córtex pré-frontal (mecanismo da viloxazina, distinto do antagonismo clássico usado por outros agentes)","ea":"Perfil adverso menos caracterizado isoladamente que o do antagonismo"},{"r":"NAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"}]},{"id":"mazindol","nome":"Mazindol","classe":"IRD","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Outro/Indefinido","en":[],"tx":"Dados limitados (fármaco antigo) — hepático oxidativo, sem isoenzima bem caracterizada."},"pos":{"mv":"Dados limitados","pos":"Histórico: 1-2mg/dia como anorexígeno (uso para TDAH é off-label/investigacional, sem posologia padronizada estabelecida)","iv":"1-2x/dia (uso histórico)","ap":"RETIRADO DO MERCADO BRASILEIRO PELA ANVISA em 04/10/2011 (produtos Absten S, Fagolipo, Moderine) — não disponível atualmente"},"rx":[{"r":"SERT","t":"inib","s":2,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":5,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"centanafadina","nome":"Centanafadina","classe":"IRSND","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Outro/Indefinido","en":["CYP2D6","UGT"],"tx":"Aprovação recente — dados em consolidação; eliminação parcialmente renal com participação hepática (CYP2D6/UGT)."},"pos":{"mv":"Dados de fase 3 (ainda não aprovado)","pos":"TDAH: doses estudadas em ensaios clínicos de fase 3 até 400mg/dia dividido — sem posologia comercial estabelecida, medicamento ainda não aprovado por nenhuma agência regulatória","iv":"2x/dia (estudos clínicos)","ap":"NÃO APROVADO PELA ANVISA (nem pelo FDA até o momento) — ainda em desenvolvimento clínico, não comercializado em nenhum país"},"rx":[{"r":"SERT","t":"inib","s":3,"et":"Antidepressivo; ansiolítico; anorexígeno (via 5-HT1A, 5-HT1B)","ea":"Náuseas (5-HT3 — dessensibiliza, efeito melhora com o tempo); diarreia (5-HT3 e 5-HT4 — melhora parcial com o tempo); disfunção sexual (5-HT2A, 5-HT2C); insônia (5-HT2A, 5-HT2C); sudorese; agitação/ansiedade inicial (5-HT2A, 5-HT2C); saciedade a curto prazo (5-HT2C) com redução posterior por downregulation"},{"r":"NAT","t":"inib","s":5,"et":"Tratamento do TDAH; antidepressivo; pró-cognitivo","ea":"Taquicardia e elevação da PA, sudorese, insônia, supressão do apetite, ansiedade, retenção urinária, disfunção erétil"},{"r":"DAT","t":"inib","s":4,"et":"Tratamento do TDAH; antidepressivo (bupropiona, em menor grau)","ea":"Insônia, supressão do apetite; potencial de abuso proporcional à velocidade de ocupação (não apenas ao grau — ocupação rápida por via IV/inalada tem maior risco que a mesma ocupação por via oral)"}]},{"id":"xanomelina","nome":"Xanomelina","classe":"Agonista colinérgico","nc":"Não tem no Brasil","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Hepático e renal combinados (uso associado à trospiquina, predominantemente renal). Isoenzima CYP ainda pouco caracterizada."},"pos":{"mv":"Dados de xanomelina isolada: ~3-4h; formulação combinada com trospiquina tem perfil próprio","pos":"Esquizofrenia: inicial 50mg/20mg (xanomelina/trospiquina) 2x/dia; titular; usual 125mg/30mg 2x/dia; máximo 125mg/30mg 2x/dia","iv":"2x/dia","ap":"SEM REGISTRO NA ANVISA — Cobenfy (aprovação FDA 2024) disponível apenas por importação, sem previsão de chegada ao Brasil"},"rx":[{"r":"M1","t":"agp","s":4,"et":"Pró-cognitivo (memória); antipsicótico (xanomelina)","ea":"Náuseas; dispepsia; sudorese"},{"r":"M2","t":"agp","s":1,"et":"Papel secundário frente ao M1/M4 no mecanismo pró-cognitivo/antipsicótico da xanomelina","ea":"Mesmo perfil colinérgico (náusea, sudorese), com possível bradicardia paradoxal"},{"r":"M3","t":"agp","s":1,"et":"Papel secundário frente ao M1/M4 no mecanismo da xanomelina","ea":"Mesmo perfil colinérgico (náusea, sudorese)"},{"r":"M4","t":"agp","s":4,"et":"Antipsicótico (reduz atividade dopaminérgica na via mesolímbica) — mecanismo central da xanomelina; também descrito no metabólito norclozapina (hipersalivação paradoxal da clozapina)","ea":"Náuseas; dispepsia; sudorese; hipersalivação (efeito paradoxal descrito com norclozapina)"},{"r":"M5","t":"agp","s":1,"et":"Papel pouco caracterizado clinicamente","ea":"Não caracterizado isoladamente"}]},{"id":"donepezila","nome":"Donepezila","classe":"Inibidor AChE","nc":"Eraz, Donila, Epez","obs":null,"met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP3A4 + glicuronidação."},"pos":{"mv":"~70h","pos":"Alzheimer leve-moderado: inicial 5mg/dia (à noite); após 4-6 semanas pode titular para 10mg/dia; Alzheimer moderado-grave: pode titular para 23mg/dia","iv":"1x/dia (à noite)","ap":"Eranz, Donepezila — comprimidos 5/10mg; comprimidos 23mg (liberação prolongada) disponibilidade pode variar"},"rx":[{"r":"σ1","t":"agt","s":6,"et":"Neuroproteção; neurogênese; possível efeito antipsicótico em depressão psicótica; potencial ansiolítico/antidepressivo adicional (fluvoxamina, fluoxetina, escitalopram)","ea":"Efeitos adversos específicos do σ1 pouco caracterizados isoladamente em humanos — a maior parte dos dados é pré-clínica"},{"r":"AChE","t":"ant","s":4,"et":"Aumento da ACh → melhora da função cognitiva e da memória","ea":"Relaxamento de esfíncter; diarreia; aumento de secreções (sudorese, sialorreia); bradicardia"}]},{"id":"galantamina","nome":"Galantamina","classe":"Inibibidor AChE e agonista nicotínico","nc":"Reminyl ER, Coglive, Elantium","obs":" Ligante potencializador alostérico (APL) — não ativa o canal diretamente, mas aumenta a resposta do receptor à ACh endógena; mecanismo adicional e distinto da inibição da AChE, característico da galantamina entre os inibidores de colinesterase","met":{"tp":"Hepático","en":["CYP2D6","CYP3A4"],"tx":"Hepático — CYP2D6 e CYP3A4 + glicuronidação."},"pos":{"mv":"~7h (IR); ER tem perfil de absorção mais lento, meia-vida de eliminação similar","pos":"Alzheimer leve-moderado: inicial 8mg/dia; titular a cada 4 semanas; usual 16-24mg/dia; máximo 24mg/dia","iv":"2x/dia (IR) ou 1x/dia (ER)","ap":"Reminyl — comprimidos 8/16/24mg (ER); solução oral"},"rx":[{"r":"nAChR","t":"mod","s":2,"et":"Potencializa a resposta colinérgica endógena ao acetilcolina — contribui para o efeito pró-cognitivo em conjunto com a inibição de AChE","ea":"Mesmo perfil colinérgico da inibição de AChE (náusea, diarreia, cãibras)"},{"r":"AChE","t":"ant","s":3,"et":"Aumento da ACh → melhora da função cognitiva e da memória","ea":"Relaxamento de esfíncter; diarreia; aumento de secreções (sudorese, sialorreia); bradicardia"},{"r":"nAChR α4β2","t":"mod","s":3,"et":"Potencializa a resposta colinérgica endógena à acetilcolina — contribui para o efeito pró-cognitivo em conjunto com a inibição de AChE","ea":"Mesmo perfil colinérgico da inibição de AChE (náusea, diarreia, cãibras)"},{"r":"nAChR α7","t":"mod","s":3,"et":"Potencializa a resposta colinérgica endógena — contribuição pró-cognitiva adicional da galantamina frente aos demais inibidores de AChE","ea":"Mesmo perfil colinérgico geral"}]},{"id":"memantina","nome":"Memantina","classe":"Antagonista NMDA","nc":"Ebix, Aloiz, Ebixa, Zeider, Heimer","obs":null,"met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 48-80% inalterado, dependente de pH urinário (como as anfetaminas)."},"pos":{"mv":"~60-80h","pos":"Alzheimer moderado-grave: inicial 5mg/dia; titular semanalmente; usual 20mg/dia (10mg 2x/dia ou 28mg 1x/dia ER); máximo 28mg/dia (ER) ou 20mg/dia (IR)","iv":"2x/dia (IR) ou 1x/dia (ER)","ap":"Alois, Ebix — comprimidos 5/10mg; comprimidos ER 14/28mg"},"rx":[{"r":"5-HT3","t":"ant","s":2,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"NMDA","t":"ant","s":3,"et":"Antidepressivo (incluindo efeito antissuicida rápido — cetamina/escetamina); neuroproteção","ea":"Dissociação; hipertensão; náuseas; risco de abuso (cetamina)"},{"r":"nAChR α7","t":"ant","s":1,"et":"Contribuição secundária/pouco caracterizada ao mecanismo da memantina","ea":"Não caracterizado isoladamente"}]},{"id":"rivastigmina","nome":"Rivastigmina","classe":"Inibidor AChE","nc":"Exelon, Cognive, Vivencia","obs":" Mecanismo pseudo-irreversível (carbamilação) — forma complexo covalente transitório com a enzima, hidrolisado lentamente ao longo de horas; farmacologicamente distinto da inibição reversível clássica de donepezila/galantamina","met":{"tp":"Não-hepático","en":["colinesterases"],"tx":"Não-hepático — hidrólise pelas colinesterases no local de ação. Participação hepática mínima."},"pos":{"mv":"~1-2h (mas efeito farmacodinâmico prolongado, pela ligação à colinesterase)","pos":"Alzheimer/Parkinson leve-moderado: inicial 1,5mg 2x/dia; titular a cada 2 semanas; usual 6-12mg/dia dividido; máximo 12mg/dia (oral) ou 13,3mg/dia (adesivo transdérmico)","iv":"2x/dia (oral) ou 1x/dia (adesivo transdérmico)","ap":"Exelon — cápsulas 1,5/3/4,5/6mg; solução oral; Exelon Patch (adesivo) 4,6/9,5/13,3mg/24h"},"rx":[{"r":"AChE","t":"ant","s":4,"et":"Aumento da ACh → melhora da função cognitiva e da memória","ea":"Relaxamento de esfíncter; diarreia; aumento de secreções (sudorese, sialorreia); bradicardia"},{"r":"BuChE","t":"ant","s":4,"et":"Aumento do ACh central → melhora da função cognitiva e da memória (papel maior conforme a doença avança e a AChE perde densidade)","ea":"Náuseas; êmese; diarreia; tontura; cefaleia"}]},{"id":"vareniclina","nome":"Vareniclina","classe":"Antitabágico (agonista nicotínico)","nc":"Não tem no Brasil","obs":" Ki subnanomolar (afinidade extrema) — mecanismo terapêutico central (cessação tabágica): eficácia parcial de ~20-45% relativa à nicotina/epibatidina, permitindo alívio de fissura/abstinência (ativação parcial) e bloqueio competitivo da ativação total por nicotina se o paciente fumar","met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal — 92% excretado inalterado. Hepático mínimo."},"pos":{"mv":"~24h","pos":"Cessação tabágica: inicial 0,5mg 1x/dia (dias 1-3), depois 0,5mg 2x/dia (dias 4-7), depois 1mg 2x/dia (a partir do dia 8); duração usual de 12 semanas","iv":"1-2x/dia (titulação inicial)","ap":"Champix — comprimidos 0,5mg e 1mg (embalagem de início de tratamento combinando as duas dosagens)"},"rx":[{"r":"5-HT3","t":"ant","s":1,"et":"Antiemético; pró-cognitivo/antidepressivo (aumenta glutamato, DA, HA, ACh e NA)","ea":"Constipação"},{"r":"nAChR α4β2","t":"agp","s":5,"et":"Alívio parcial da fissura/abstinência de nicotina + bloqueio competitivo do reforço se o paciente fumar (mecanismo central da vareniclina na cessação tabágica)","ea":"Náusea (efeito mais comum); alterações de humor/ideação (alerta pós-comercialização); sonhos vívidos, insônia"},{"r":"nAChR α7","t":"agt","s":6,"et":"Papel secundário/menos caracterizado clinicamente na cessação tabágica; possível contribuição cognitiva","ea":"Não bem caracterizado isoladamente"}]},{"id":"naltrexona","nome":"Naltrexona","classe":"Antagonista opioide","nc":"Revia, Contrave, Uninaltrex","obs":null,"met":{"tp":"Hepático","en":[],"tx":"Hepático — di-hidrodiol desidrogenase (não-CYP) ao metabólito ativo 6-beta-naltrexol (um pouco menos potente, meia-vida mais longa)."},"pos":{"mv":"~4h (via oral); ~5-10 dias (injetável de liberação prolongada, Vivitrol)","pos":"Transtorno por uso de álcool/opioides: 50mg/dia (oral); também injetável IM mensal (380mg)","iv":"1x/dia (oral) ou mensal (injetável)","ap":"Revia — comprimidos 50mg. Formulação injetável de liberação prolongada (Vivitrol) sem confirmação de disponibilidade comercial no Brasil"},"rx":[{"r":"κ-opioide","t":"ant","s":3,"et":"Bloqueio do craving por álcool e opioides; possível efeito antidepressivo em protocolos experimentais de antagonismo κ isolado (naltrexona)","ea":"Precipitação de abstinência em usuários de opioides; hepatotoxicidade em dose alta"},{"r":"μ-opioide","t":"ant","s":4,"et":"Tratamento do transtorno por uso de álcool e de opioides; reduz o reforço/prazer associado ao consumo (naltrexona)","ea":"Precipita abstinência grave em usuários de opioides; hepatotoxicidade; disforia; náuseas"},{"r":"δ-opioide","t":"ant","s":2,"et":"Contribuição secundária ao efeito da naltrexona no transtorno por uso de substâncias","ea":"Não caracterizado isoladamente"}]},{"id":"thc","nome":"THC","classe":"Agonista canabinoide","nc":"Mevatyl","obs":" Ki na faixa nM — agonista parcial de eficácia intrínseca baixa-moderada em relação aos endocanabinoides (anandamida, 2-AG) e a agonistas sintéticos de referência (CP55940)","met":{"tp":"Hepático","en":["CYP2C9","CYP3A4"],"tx":"Hepático — CYP2C9 e CYP3A4. Metabólito ativo 11-OH-THC (mais potente por via oral — explica a diferença entre uso inalado e oral). Inibição fraca-moderada de CYP3A4/2C9 relatada em alguns estudos."},"pos":{"mv":"~1-3h (fumado/vaporizado); ~4-6h se ingerido por via oral (mas efeito clínico pode ser mais prolongado pelo metabólito ativo 11-OH-THC)","pos":"Uso medicinal (produtos à base de Cannabis): dose extremamente variável conforme formulação e indicação; sem posologia padronizada única — depende do produto registrado/prescrito individualmente","iv":"Variável conforme via de administração e produto","ap":"Produtos à base de Cannabis (óleos, extratos) disponíveis no Brasil via prescrição e importação/RDC específica da Anvisa (não como \"THC\" isolado com apresentação padronizada)"},"rx":[{"r":"CB1","t":"agp","s":3,"et":"Analgesia, redução das náuseas, aumento do apetite; sonolência","ea":"Prejuízo de memória; prejuízo de função executiva; prejuízo de atenção; aumento de ansiedade; paranoia; dependência; lentificação psicomotora; sonolência"},{"r":"CB2","t":"agp","s":2,"et":"Papel predominantemente imunomodulador/anti-inflamatório periférico; contribuição central pouco caracterizada","ea":"Não bem caracterizado isoladamente"}]},{"id":"gabapentina","nome":"Gabapentina","classe":"Anticonvulsivante / Gabapentinoide","nc":"Neurontin, Progresse","obs":"reduz influxo de Ca2+ e liberação pré-sináptica de glutamato/substância P/noradrenalina","met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal. Absorção não linear -> biodisponibilidade 60% para 33% com aumento da dose."},"pos":{"mv":"~5-7h (função renal normal)","pos":"Neuropatia/dor: inicial 300mg 1x/dia (dia 1), 300mg 2x/dia (dia 2), 300mg 3x/dia (dia 3); titular; usual 900-3600mg/dia dividido; máximo 3600mg/dia","iv":"3x/dia (intervalo máximo entre doses de 12h, por causa da absorção saturável)","ap":"Neurontin, Progresse — cápsulas 300/400mg; comprimidos 600/800mg"},"rx":[{"r":"Canal Ca2+","t":"ant","s":3,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]},{"id":"pregabalina","nome":"Pregabalina","classe":"Anticonvulsivante / Gabapentinoide","nc":"Lyrica, Pregantil","obs":"reduz influxo de Ca2+ e liberação pré-sináptica de glutamato/substância P/noradrenalina","met":{"tp":"Predominantemente renal","en":[],"tx":"Predominantemente renal. Absorção linear, biodisponibilidade ≥90% independente da dose (diferencial frente à gabapentina)."},"pos":{"mv":"~6,3h (função renal normal)","pos":"Neuropatia/dor/TAG: inicial 75mg 2x/dia (150mg/dia); pode iniciar em dose terapêutica sem titulação longa; usual 150-300mg/dia dividido; máximo 600mg/dia","iv":"2x/dia (ou 3x/dia para dor neuropática, conforme bula)","ap":"Lyrica, Pregantil — cápsulas 25/50/75/150/200/300mg"},"rx":[{"r":"Canal Ca2+","t":"ant","s":4,"et":"Redução da liberação de neurotransmissor excitatório; efeito estabilizador de humor e anticonvulsivante (lamotrigina, valproato, topiramato — subtipos L e R)","ea":"Tontura, ataxia (dose-dependente)"}]}]};

/* ---------------- informação adicional (fora da planilha) ----------------
   Ligação à albumina do ácido valproico — pesquisado especificamente a
   pedido do usuário. Fontes: Patel et al. 1979 (Epilepsia); Dhillon &
   Richens 1982 (Br J Clin Pharmacol); bula/FDA label do divalproato;
   revisões sobre deslocamento proteico (Sellers 1979; Rowland & Matin 1973). */
const ALBUMIN = {
  geral:
    "O valproato liga-se fortemente à albumina (~90% ligado), mas de forma saturável e não-linear: em concentrações mais altas os sítios de ligação se saturam e a fração livre (ativa) sobe desproporcionalmente — de ~10% para até ~50% dentro da faixa terapêutica alta. Ocupa dois sítios na albumina, compartilhados com outros fármacos: o \"sítio da varfarina\" e o \"sítio do diazepam\".",
  risco:
    "Hipoalbuminemia (hepatopatia, doença renal, desnutrição, idosos, gestação) reduz a proteína disponível e eleva a fração livre de valproato mesmo com nível sérico total \"normal\" — risco de toxicidade não detectado se só o total for dosado.",
  specific: {
    diazepam:
      "Diazepam compete pelo mesmo sítio de ligação (\"sítio do diazepam\") na albumina — interação documentada em humanos (Dhillon & Richens, 1982): deslocamento mútuo aumenta a fração livre de ambos, com risco de potencialização do efeito sedativo, especialmente em uso agudo ou hipoalbuminemia.",
  },
  generico:
    "Este par não tem deslocamento por albumina descrito especificamente na literatura revisada. Ainda assim, vale lembrar do princípio geral: valproato pode deslocar (e ser deslocado por) outros fármacos de alta ligação proteica pelo mesmo mecanismo — classicamente descrito com fenitoína (↑ fração livre de fenitoína em até 60-100%), ácido acetilsalicílico/salicilatos (↑ até 4x a fração livre do próprio valproato, com inibição adicional da beta-oxidação) e varfarina. Nenhum desses é psicofármaco desta lista, mas a coprescrição é comum na prática clínica.",
};

/* ---------------- inibição / indução enzimática hepática ----------------
   Estruturado a partir do próprio texto de Metabolismo já presente na
   planilha (coluna livre, em prosa) — nada inventado aqui, só organizado
   em {enzima, efeito, força} para alimentar o motor de alertas. A relação
   valproato→CYP2C9 foi conferida contra a literatura: inibição preferencial
   in vitro (Wen et al. 2001, Ki ≈ 600 µM, na faixa de concentração
   plasmática clínica) e confirmada in vivo com sonda de losartana
   (Gunes et al. 2007) — fraca a moderada e dose/concentração-dependente. */
const ENZYME_EFFECTS = {
  valproato: [
    { enzyme: "UGT1A4", effect: "inibidor", strength: "moderado-forte", obs: "aumenta muito os níveis de lamotrigina — costuma exigir redução de dose" },
    { enzyme: "epóxido-hidrolase", effect: "inibidor", strength: "moderado", obs: "acúmulo do metabólito ativo/tóxico carbamazepina-10,11-epóxido" },
    { enzyme: "CYP2C9", effect: "inibidor", strength: "fraco-moderado", obs: "dose/concentração-dependente (Wen 2001; Gunes 2007)" },
  ],
  carbamazepina: [
    { enzyme: "CYP3A4", effect: "indutor", strength: "forte", obs: "autoindução nas primeiras semanas de uso" },
    { enzyme: "CYP1A2", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C9", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C19", effect: "indutor", strength: "moderado" },
    { enzyme: "UGT1A4", effect: "indutor", strength: "moderado", obs: "reduz níveis de lamotrigina em até ~40%" },
  ],
  oxcarbazepina: [
    { enzyme: "CYP3A4", effect: "indutor", strength: "moderado" },
    { enzyme: "UGT1A4", effect: "indutor", strength: "moderado" },
    { enzyme: "CYP2C19", effect: "inibidor", strength: "fraco" },
  ],
  topiramato: [
    { enzyme: "CYP2C19", effect: "inibidor", strength: "fraco" },
    { enzyme: "CYP3A4", effect: "indutor", strength: "fraco", obs: "dose-dependente, relevante em dose alta" },
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
  thc: [
    { enzyme: "CYP3A4", effect: "inibidor", strength: "fraco-moderado", obs: "evidência limitada (poucos estudos)" },
    { enzyme: "CYP2C9", effect: "inibidor", strength: "fraco-moderado", obs: "evidência limitada (poucos estudos)" },
  ],
};

function enzymeEffectsAgainst(perpetrator, victimEnzymes) {
  const effects = ENZYME_EFFECTS[perpetrator.id] || [];
  return effects.filter((e) => (victimEnzymes || []).includes(e.enzyme));
}

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

/* ---------------- curso temporal por receptor (curto x longo prazo) ----------------
   Não presente na planilha original — avaliado à parte, a pedido do usuário.
   Organizado por RECEPTOR (não por fármaco): o mecanismo de adaptação aguda
   vs. crônica é uma propriedade do alvo, não de cada fármaco individualmente,
   e repetir por fármaco só duplicaria texto sem agregar informação.
   Cobertura deliberadamente seletiva: incluídos os alvos com narrativa
   curto/longo prazo bem estabelecida na literatura humana e de real peso
   didático. Ficaram de fora ~30 alvos majoritariamente pré-clínicos/moleculares
   (GSK-3β, IPPase, IMPase, HDAC, HCN, anidrase carbônica, receptor cainato,
   NOS, GABA-T, adenosina A1, imidazolina I1, TAAR1, GHB, CB2, subtipos
   serotoninérgicos de uso muito restrito) por não haver base humana robusta
   o bastante para essa distinção sem especular. */
const RECEPTOR_TIMECOURSE = {
  "5-HT1A": {
    curto: "Agonismo direto (ex. buspirona) tem efeito ansiolítico discreto desde o início. Já a desinibição indireta por ISRS/IRSN (via ↑ 5-HT sináptica) esbarra num autorreceptor 5-HT1A somatodendrítico ainda sensível — por isso o efeito antidepressivo pleno não aparece de imediato.",
    longo: "A dessensibilização do autorreceptor 5-HT1A ao longo de 2-4 semanas é considerada um dos mecanismos centrais do efeito antidepressivo tardio dos ISRS/IRSN (Blier & de Montigny). Agonismo parcial crônico (buspirona) mantém eficácia sem tolerância significativa bem documentada.",
  },
  "5-HT2A": {
    curto: "Antagonismo agudo contribui para sedação/efeito hipnótico (trazodona em dose baixa) e para o perfil antipsicótico complementar ao D2 nos atípicos.",
    longo: "Antagonismo crônico está associado a menor risco de SEP/discinesia tardia comparado ao antagonismo D2 isolado — um dos racionais por trás da classe dos antipsicóticos atípicos.",
  },
  "5-HT2C": {
    curto: "Antagonismo agudo já aumenta o apetite de forma perceptível (mirtazapina, agomelatina) e contribui para efeito ansiolítico.",
    longo: "Antagonismo sustentado é um dos principais mecanismos por trás do ganho de peso e risco metabólico (síndrome metabólica) associado ao uso prolongado de antipsicóticos atípicos.",
  },
  "5-HT3": {
    curto: "Antagonismo agudo tem efeito antiemético rápido; constipação é um efeito adverso precoce comum.",
    longo: "Pouca evidência de tolerância farmacodinâmica relevante com uso prolongado neste contexto (diferente do uso antiemético isolado, mais estudado).",
  },
  "5-HT7": {
    curto: "Antagonismo agudo é hipotetizado como contribuinte para efeito antidepressivo e pró-cognitivo em alguns fármacos (ex. vortioxetina), além de participar da regulação do ritmo circadiano.",
    longo: "Evidência humana ainda menos robusta que para 5-HT1A/5-HT2A — papel a longo prazo permanece parcialmente hipotético, sem marcadores de adaptação crônica bem estabelecidos.",
  },
  D1: {
    curto: "Ativação aguda relacionada a efeitos cognitivos/motivacionais no córtex pré-frontal; a maioria dos fármacos desta lista não é seletiva para D1.",
    longo: "Adaptação crônica em humanos pouco caracterizada isoladamente — a maior parte dos dados vem de modelos animais.",
  },
  D2: {
    curto: "A ocupação do receptor é praticamente imediata, mas a resposta antipsicótica plena tipicamente só emerge após 1-3 semanas de bloqueio sustentado — um dos pontos clássicos de ensino (ocupação ≠ resposta clínica). Bloqueio intenso desde o início já traz risco de distonia aguda e acatisia.",
    longo: "Bloqueio D2 crônico é o principal mecanismo por trás de discinesia tardia (geralmente após meses a anos), hiperprolactinemia sustentada e parkinsonismo persistente. Agonistas parciais D2 (aripiprazol, brexpiprazol, cariprazina) têm menor risco de discinesia tardia a longo prazo, mas podem trazer acatisia mais cedo no tratamento.",
  },
  D3: {
    curto: "Coativado com D2 na maior parte dos fármacos desta lista — contribuição isolada de curto prazo pouco caracterizada clinicamente.",
    longo: "Hipotetizado como relevante para sintomas negativos e craving (maior densidade em áreas límbicas), mas a evidência de um efeito D3-específico a longo prazo, independente do D2, ainda é limitada em humanos.",
  },
  SERT: {
    curto: "O aumento de 5-HT sináptica é imediato, mas na primeira semana predominam efeitos colaterais gastrointestinais e, às vezes, piora inicial da ansiedade — antes do efeito terapêutico aparecer.",
    longo: "O efeito antidepressivo/ansiolítico pleno costuma emergir em 2-6 semanas. Uso prolongado pode se associar a disfunção sexual persistente em uma minoria mesmo após a suspensão (achado ainda debatido na literatura). Descontinuação abrupta após uso prolongado pode causar síndrome de descontinuação, mais notável em fármacos de meia-vida curta.",
  },
  NAT: {
    curto: "Inibição aguda traz efeitos simpaticomiméticos (↑ FC, ↑ PA) e, com frequência, ativação/insônia nos primeiros dias.",
    longo: "Efeito terapêutico (TDAH, depressão) costuma se manter sem tolerância farmacodinâmica franca documentada, mas o risco cardiovascular (PA/FC) é sustentado e exige monitorização contínua.",
  },
  DAT: {
    curto: "Inibição aguda tem efeito estimulante/euforizante — quanto mais rápido o bloqueio, maior o potencial de abuso associado.",
    longo: "Uso crônico de estimulantes de ação rápida carrega risco relevante de tolerância parcial e dependência; formulações de liberação controlada (lisdexanfetamina, metilfenidato XR) têm perfil mais favorável nesse sentido.",
  },
  "α1": {
    curto: "Antagonismo agudo causa hipotensão ortostática e tontura, mais proeminentes na titulação inicial ou ao trocar de dose.",
    longo: "Costuma haver alguma tolerância parcial ao efeito hipotensor com uso continuado, mas o efeito sedativo associado pode persistir.",
  },
  "α2": {
    curto: "Agonismo agudo (clonidina, guanfacina) causa sedação, hipotensão e bradicardia, mais intensas no início do tratamento.",
    longo: "Tolerância parcial ao efeito sedativo/hipotensor é comum com uso continuado. A suspensão abrupta após uso prolongado pode causar rebote hipertensivo — relevante clinicamente, exige retirada gradual.",
  },
  "α2A": {
    curto: "Agonismo agudo causa sedação, hipotensão e bradicardia, mais intensas no início do tratamento (subtipo mais implicado nos efeitos pró-cognitivos/TDAH da guanfacina).",
    longo: "Tolerância parcial ao efeito sedativo/hipotensor é comum com uso continuado. Suspensão abrupta após uso prolongado pode causar rebote hipertensivo.",
  },
  "α2B": {
    curto: "Contribui para os efeitos hemodinâmicos agudos (hipotensão, bradicardia) quando coativado com α2A/α2C pelos mesmos fármacos.",
    longo: "Papel isolado a longo prazo pouco distinguido do restante da família α2 na prática clínica.",
  },
  "α2C": {
    curto: "Contribui para os efeitos hemodinâmicos agudos (hipotensão, bradicardia) quando coativado com α2A/α2B pelos mesmos fármacos.",
    longo: "Papel isolado a longo prazo pouco distinguido do restante da família α2 na prática clínica.",
  },
  H1: {
    curto: "Antagonismo agudo causa sedação proeminente, mais forte nos primeiros dias — costuma haver alguma tolerância parcial a esse efeito em 1-2 semanas.",
    longo: "Contribui de forma sustentada para ganho de peso (↓ taxa metabólica basal, ↑ apetite) — esse efeito metabólico tende a ser mais persistente do que a sedação.",
  },
  H3: {
    curto: "Antagonismo agudo tem efeito pró-cognitivo/pró-vigília (pitolisanto).",
    longo: "Evidência ainda limitada sobre adaptação crônica específica a este alvo em humanos.",
  },
  M1: {
    curto: "Antagonismo agudo causa boca seca, constipação, visão turva e retenção urinária, além de prejuízo cognitivo agudo (mais notável em idosos).",
    longo: "Bloqueio M1 crônico está associado a maior risco de comprometimento cognitivo sustentado e demência em idosos — a carga anticolinérgica cumulativa é bem documentada em estudos observacionais.",
  },
  M2: {
    curto: "Antagonismo agudo pode contribuir para taquicardia (efeito cardíaco, menos proeminente que M1/M3 na maioria dos psicofármacos desta lista).",
    longo: "Papel isolado a longo prazo pouco caracterizado fora do contexto cardiológico.",
  },
  M3: {
    curto: "Antagonismo agudo contribui para os efeitos periféricos clássicos: boca seca, constipação, retenção urinária.",
    longo: "Contribui, junto ao M1, para a carga anticolinérgica cumulativa associada a risco cognitivo a longo prazo em idosos.",
  },
  M4: {
    curto: "Papel menos proeminente entre os efeitos anticolinérgicos periféricos clássicos.",
    longo: "Adaptação crônica pouco caracterizada isoladamente em humanos.",
  },
  M5: {
    curto: "Papel menos proeminente entre os efeitos anticolinérgicos periféricos clássicos.",
    longo: "Adaptação crônica pouco caracterizada isoladamente em humanos.",
  },
  MT1: {
    curto: "Agonismo agudo tem efeito hipnótico/cronobiótico relativamente rápido, com boa tolerabilidade geral.",
    longo: "Diferencial importante frente a benzodiazepínicos/Z-drugs: sem evidência robusta de tolerância ou dependência física significativas com uso prolongado.",
  },
  MT2: {
    curto: "Agonismo agudo contribui para o ajuste de fase do ciclo sono-vigília.",
    longo: "Mesmo perfil favorável do MT1 quanto à ausência de tolerância/dependência documentada.",
  },
  "GABA-A": {
    curto: "Potencialização aguda tem efeito rápido e dose-dependente: sedação, ansiólise, ação anticonvulsivante e relaxamento muscular.",
    longo: "Uso crônico leva a tolerância farmacodinâmica (doses maiores necessárias com o tempo) e dependência física — a retirada abrupta após uso prolongado carrega risco real de convulsão. Um dos pontos mais importantes de ensino sobre benzodiazepínicos.",
  },
  NMDA: {
    curto: "Antagonismo agudo (cetamina/escetamina) tem efeito antidepressivo rápido (horas a dias), mas também pode causar sintomas dissociativos/psicotomiméticos transitórios durante a infusão.",
    longo: "Uso repetido de cetamina carrega potencial de abuso/dependência e risco de cistite com uso crônico em alta dose. Memantina (uso crônico em demência) tem, na prática, perfil mais benigno a longo prazo.",
  },
  "κ-opioide": {
    curto: "Agonismo agudo tem efeito disfórico/aversivo (relevante para o desenvolvimento de antagonistas kappa como antidepressivos); antagonismo agudo bloqueia parte do reforço relacionado ao uso de álcool.",
    longo: "Pouca tolerância descrita para o componente disfórico do agonismo kappa a longo prazo.",
  },
  "μ-opioide": {
    curto: "Antagonismo agudo (naltrexona) precipita síndrome de abstinência em usuários ativos de opioides — por isso exige período de abstinência prévio antes de iniciar.",
    longo: "Bloqueio crônico reduz o reforço associado ao uso de álcool/opioides (base do uso em transtornos por uso de substâncias), sem tolerância significativa ao bloqueio em si.",
  },
  "δ-opioide": {
    curto: "Papel menos caracterizado clinicamente que κ/μ nesta lista de fármacos.",
    longo: "Adaptação crônica pouco estabelecida em humanos para os fármacos aqui presentes.",
  },
  OX1: {
    curto: "Antagonismo agudo tem efeito hipnótico ao suprimir o sistema de vigília orexinérgico.",
    longo: "Dados de uso muito prolongado ainda são relativamente recentes; sonolência residual diurna é o principal risco identificado até o momento, sem sinais robustos de tolerância ao efeito hipnótico.",
  },
  OX2: {
    curto: "Antagonismo agudo tem efeito hipnótico ao suprimir o sistema de vigília orexinérgico.",
    longo: "Mesmo perfil do OX1 — dados de longo prazo ainda relativamente recentes na literatura.",
  },
  VMAT2: {
    curto: "Inibição aguda deplecionando monoaminas vesiculares tem efeito antidiscinético/anticoreico relativamente rápido.",
    longo: "Uso sustentado carrega risco bem documentado de depressão, sedação e sintomas parkinsonianos — motivo de monitorização contínua do humor com tetrabenazina/valbenazina/deutetrabenazina.",
  },
  CB1: {
    curto: "Agonismo agudo (THC) causa efeitos psicoativos, podendo gerar tanto ansiólise quanto ansiedade paradoxal, além de alterações cognitivas transitórias.",
    longo: "Uso crônico leva a tolerância ao efeito psicoativo e síndrome de abstinência à suspensão; associado a maior risco de sintomas psicóticos em indivíduos predispostos e possível impacto cognitivo sustentado quando o uso é precoce/intenso.",
  },
  nAChR: {
    curto: "Agonismo agudo tem efeito estimulante/pró-cognitivo leve; náusea é um efeito adverso inicial comum.",
    longo: "Uso crônico de nicotina classicamente causa dessensibilização seguida de upregulation de receptores nicotínicos — fenômeno central na dependência. Para agonistas parciais terapêuticos, o perfil de tolerância é diferente e menos estabelecido.",
  },
  "nAChR α4β2": {
    curto: "Agonismo parcial agudo reduz o craving por nicotina desde as primeiras semanas de uso.",
    longo: "Perfil de segurança a longo prazo bem estabelecido para cessação tabágica; não é indicado para uso indefinido.",
  },
  "nAChR α7": {
    curto: "Papel relacionado a efeitos pró-cognitivos hipotéticos; menos caracterizado clinicamente que α4β2 nesta lista.",
    longo: "Adaptação crônica pouco estabelecida em humanos para os fármacos aqui presentes.",
  },
  AChE: {
    curto: "Inibição aguda causa efeitos colinérgicos periféricos (náusea, diarreia, cãibras), mais proeminentes no início/titulação.",
    longo: "Efeito pró-cognitivo sustentado, porém moderado, em demência — a eficácia tende a se atenuar com a progressão da doença de base, o que não é propriamente tolerância farmacológica.",
  },
  BuChE: {
    curto: "Contribui para os mesmos efeitos colinérgicos periféricos agudos da inibição da AChE.",
    longo: "Papel relativo à AChE varia conforme a doença progride (BuChE ganha importância relativa em fases mais avançadas de demência).",
  },
  "σ1": {
    curto: "Modulação aguda hipotetizada como contribuinte para efeitos ansiolíticos/antidepressivos em alguns fármacos.",
    longo: "Evidência humana ainda limitada — mecanismo de adaptação crônica não bem estabelecido; incluído aqui com essa ressalva.",
  },
  "Canal Na+": {
    curto: "Bloqueio agudo reduz excitabilidade neuronal — base do efeito anticonvulsivante e estabilizador do humor de início relativamente rápido.",
    longo: "Efeito costuma se manter sem tolerância franca relevante a longo prazo; o principal risco de longo prazo é relacionado a toxicidade/overdose, não a perda de eficácia.",
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
          <span className="version-badge">V1</span>
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
                        <div className="rx-detail-row">
                          <span className="rx-detail-label time-short">Curto prazo</span>
                          <span>{timecourseFor(rx.r).curto}</span>
                        </div>
                        <div className="rx-detail-row">
                          <span className="rx-detail-label time-long">Longo prazo</span>
                          <span>{timecourseFor(rx.r).longo}</span>
                        </div>
                        <div className="source-note">curso temporal pesquisado à parte — não presente na planilha original</div>
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
            {drug.pos?.ap && (
              <Card title="Apresentações no Brasil (Anvisa)">
                <p className="p">{drug.pos.ap}</p>
              </Card>
            )}
            {drug.obs && (
              <Card title="Observação">
                <p className="p">{drug.obs}</p>
              </Card>
            )}
            {isValproato && (
              <Card title="Ligação proteica (albumina)" style={{ borderColor: "var(--accent)" }}>
                <p className="p">{ALBUMIN.geral}</p>
                <p className="p dim">{ALBUMIN.risco}</p>
                <div className="source-note">não presente na planilha original — pesquisado à parte</div>
              </Card>
            )}
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
              </Card>
            )}
            {drug.met?.en?.length > 0 && (
              <Card title="Enzimas envolvidas">
                <div className="chip-row wrap">
                  {drug.met.en.map((e) => (
                    <span className="enzyme-chip" key={e}>{e}</span>
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
                <p className="p dim">{ALBUMIN.specific.diazepam}</p>
                <div className="source-note">
                  Fontes: Patel et al. 1979 (Epilepsia); Dhillon &amp; Richens 1982 (Br J Clin Pharmacol) — não presente na planilha original.
                </div>
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
        metabolic.push({ a, b, shared, perpetrator, tier });
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

    // albumina / valproato
    let albuminAlert = null;
    if (selected.includes("valproato") && drugs.length > 1) {
      const others = drugs.filter((d) => d.id !== "valproato");
      const hasDiazepam = others.some((d) => d.id === "diazepam");
      albuminAlert = {
        specific: hasDiazepam,
        tier: hasDiazepam ? "red" : "amber",
        texto: hasDiazepam ? ALBUMIN.specific.diazepam : ALBUMIN.generico,
      };
    }

    return { drugs, metabolic, byReceptor, groups, receptorAlerts, albuminAlert };
  }, [selected]);
}

function ResultsScreen({ selected, setSelected, onBack, onOpenDrug }) {
  const { drugs, metabolic, groups, byReceptor, receptorAlerts, albuminAlert } = useComposeAnalysis(selected);
  const [expandedProfile, setExpandedProfile] = useState(null);
  const alertCount = metabolic.length + receptorAlerts.length + (albuminAlert ? 1 : 0);

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

              {albuminAlert && (
                <div className={"alert-card alert-" + albuminAlert.tier}>
                  <AlertTriangle size={16} />
                  <div>
                    <div className="alert-title">Valproato — ligação à albumina{albuminAlert.specific ? " (interação documentada)" : ""}</div>
                    <div className="alert-text">{ALBUMIN.geral}</div>
                    <div className="alert-text" style={{ marginTop: 6 }}>{albuminAlert.texto}</div>
                    <div className="source-note">informação pesquisada à parte — não consta na planilha original</div>
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
                    </div>
                  </div>
                );
              })}

              {receptorAlerts.map((a) => (
                <div className="alert-card alert-orange" key={a.key}>
                  <AlertTriangle size={16} />
                  <div>
                    <div className="alert-title">Alvo receptor em comum — {a.key}</div>
                    <div className="alert-text">{a.texto}</div>
                  </div>
                </div>
              ))}

              <div className="section-label" style={{ marginTop: 20 }}>Metabolismo comparado</div>
              <Card>
                {drugs.map((d) => (
                  <div key={d.id} className="meta-compare-row">
                    <div className="meta-compare-name">{d.nome}</div>
                    <div className="chip-row wrap">
                      {(d.met?.en || []).length === 0 && <span className="dim-sm">sem enzima cadastrada</span>}
                      {(d.met?.en || []).map((e) => {
                        const shared = drugs.some((o) => o.id !== d.id && (o.met?.en || []).includes(e));
                        return (
                          <span key={e} className={"enzyme-chip" + (shared ? " enzyme-chip-shared" : "")}>
                            {e}
                          </span>
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
