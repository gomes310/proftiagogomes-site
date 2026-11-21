import re, json, subprocess, sys
BASE='/mnt/user-data/uploads/0000000 Curso de Raciocínio Lógico/'
ARQ={'cat':BASE+'05 Proposições Categóricas/Hotmart/E-Book - 100 Questões Proposições Categóticas Equivalências, negações, diagramas lógicos e argumentos válidos.pdf',
     'imp':BASE+'07 Implicação Lógica/100 questões - implicação lógica tipo 1 e 2.pdf',
     'pfc':BASE+'09 Princípios da Contagem/Ebook - 50 Questões PFC e Anagramas - Hotmart.pdf'}
for nome,arq in ARQ.items():
    raw=subprocess.run(['pdftotext',arq,'-'],capture_output=True,text=True).stdout
    i=raw.rindex('Gabarito'); corpo,gab=raw[:i],raw[i:]
    G=dict(re.findall(r'(\d+)\)\s*(Certo|Errado|Anulada|[A-E])\b',gab))
    partes=re.split(r'\n?Questão (\d+):\s*',corpo)
    out=[]
    for k in range(1,len(partes),2):
        n=int(partes[k]); txt=partes[k+1]
        cab,resto=(txt.split('\n',1)+[''])[:2]
        L=[]
        for l in resto.split('\n'):
            s=l.strip()
            if not s or 'tecconcursos' in s or 'TEC Concursos' in s or s.startswith('Email:') or re.match(r'^\d+/\d+$',s) or 'Raciocínio Lógico'==s or s.startswith('EbooK') or s.startswith('Ebook') or 'Esta questão possui' in s or re.match(r'^\d\d/\d\d/\d{4}',s): continue
            L.append(s)
        alts=[];enun=[];ce=False
        for s in L:
            m=re.match(r'^([a-e])\)\s*(.*)$',s)
            if m: alts.append([m.group(1),m.group(2)]); continue
            if s in('Certo','Errado'): ce=True; continue
            if alts: alts[-1][1]+=' '+s
            else: enun.append(s)
        out.append(dict(n=n,cab=cab.strip(),enun='\n'.join(enun),alts=alts,ce=ce,gab=G.get(str(n))))
    json.dump(out,open(f'{nome}.json','w'),ensure_ascii=False,indent=1)
    print(nome,len(out),sum(1 for q in out if q['gab'] in(None,'Anulada')))
