import json
V = """imp1 _rp0R6G8-r4;imp2 jnFDa6QZZz8;imp3 jCbiGkhK_18;imp4 AQv3_YfyWlo;imp5 GEYPgxZSvQg;imp6 9AtpjSqq98I;imp7 noBDTD1jPBI;imp8 wcQNY7hZK5E;imp9 xjjSM0AOh7E;imp10 mK3sV02Gfl0;imp11 0Y_h0eILVYQ;imp12 vtzddyJEKnw;imp13 ytExMpdagTs;imp14 rXIAIu37yCI;imp15 L5nE7uralRA;imp16 q-kAveL5480;imp17 5cep_Wg3uFc;imp18 iCT7ikeFlrw;imp19 BkQzjS-8hoo;imp20 hwWswTGI8jU;imp21 H5-zD7-EYhs;imp22 e2aWiJXCfgs;imp23 KGpUpnWBdEc;imp24 z_07nrDBz1g;imp25 LsJg36JJoMA;imp26 z1bX0aMiy2Y;imp28 8XtdnUYxLL4;imp29 6owoRt-Dv4g;imp31 yAXntlIs7YA;imp32 Eu6eJ3E5H4A;imp33 zjufbOxNGQg;imp34 UEo4-oapj3k;imp35 yEptmmeofDA;imp36 DGbjoU_J1ss;imp37 RmMByBXt5M8;imp38 mLxeCurfWwo;imp39 ZjO_U47zpHc;cat1 bu1JmXSh6oQ;cat2 bk7sjAgQif8;cat3 AShcKF6mUDg;cat4 MQtYHSujnI8;cat5 AQWYODK8qgw;cat6 N6L1kYhrO1M;cat7 OqMB8bKNqRw;cat8 uhElmK3-WyU;cat9 Yhz4XBn8hcE;cat10 pzDAhWzncvE;cat11 61QzsnOLQ3w;cat13 M0epCn7HbYA;cat15 n_JxP6WE2HI;cat16 Dia_m5r9yC0;cat18 -qUFmouSnqU;cat19 7XkB8D-mYNM;cat21 iRBADLG4F_Y;cat22 oEUXJoFxQ5w;cat24 aGiLNWO2Gjg;cat25 dZKMRzEwNDg;cat27 xiQghfc3d1Y;cat28 UmpGudmwQKo;cat29 DsxA5vRiH4c;cat30 mc-xOPhankE;cat32 CRza9WVy1EA;cat33 KCWK20QXz8s;cat34 A9CFqHcFYTM;cat35 EO9r1Dc8Vso;cat36 8Ghkc3vcdEI;cat37 0MVAe2JiTQQ;cat38 sKAmf-BQ6Yw;cat39 PuGomLw-a08;cat40 rd2w7M3q7U8;cat41 aflmUS2y0S8;cat42 EsEstOE21_M;cat43 tq2tgALLWo0;cat44 iQ90arzm2eE;cat45 H3z1eXufzPw;cat47 AJikC2j9ZYc;cat48 iQVGMu6Z3Hk;cat50 vSsPLaB2hMA;cat51 ZQlWlcQRVpU"""
mapa = {}
for par in V.split(';'):
    tag, vid = par.split(' '); nome = tag[:3]; n = int(tag[3:]); mapa[f'mat-{nome}-{n:03d}'] = vid
p = '/home/claude/proftiagogomes-site/trilha-app/src/dados/provas-material.json'
d = json.load(open(p)); k = 0
for q in d['questoes']:
    if q['id'] in mapa: q['video'] = mapa[q['id']]; k += 1
d['fonte'] += '. Vídeos de resolução do canal do professor ligados às questões das playlists dos e-books.'
json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)
print('com vídeo:', k, 'de', len(d['questoes']))
