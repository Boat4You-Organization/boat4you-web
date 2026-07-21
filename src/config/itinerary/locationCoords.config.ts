/**
 * Canonical lat/lon for every European yacht charter destination
 * referenced by EY route configs. Combined Croatia + Italy + Greece
 * + Spain + Turkey coverage. The lookup function below normalises
 * route-day labels and returns matching coords — or null if no anchor
 * fits, in which case the Leaflet map silently skips the pin.
 *
 * Source: OpenStreetMap canonical coordinates + national hydrographic
 * charts (HHI Croatia, IIM Italy, HSGS Greece, IHO Spain, Turkish
 * Naval Forces). Good enough for route map zoom 9-11; not survey-grade.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const LOCATION_COORDS: Record<string, LatLng> = {
  // ───────── Istra / Kvarner ─────────
  pula: { lat: 44.8666, lng: 13.8496 },
  medulin: { lat: 44.8186, lng: 13.9341 },
  rovinj: { lat: 45.0811, lng: 13.6387 },
  porec: { lat: 45.2272, lng: 13.5961 },
  vrsar: { lat: 45.149, lng: 13.6064 },
  novigrad: { lat: 45.3197, lng: 13.5575 },
  opatija: { lat: 45.3387, lng: 14.3088 },
  rijeka: { lat: 45.3271, lng: 14.4422 },
  rabac: { lat: 45.0801, lng: 14.1583 },
  valbandon: { lat: 44.9081, lng: 13.8211 },
  'portic bay': { lat: 44.7531, lng: 13.9011 }, // Cape Kamenjak
  'cape kamenjak': { lat: 44.7531, lng: 13.9011 },
  pomer: { lat: 44.8244, lng: 13.9197 },
  'marina pomer': { lat: 44.8244, lng: 13.9197 },

  // ───────── Krk / Cres / Lošinj / Susak / Unije ─────────
  krk: { lat: 45.0274, lng: 14.5747 },
  punat: { lat: 45.0173, lng: 14.6247 },
  baska: { lat: 44.9701, lng: 14.7559 },
  malinska: { lat: 45.118, lng: 14.5274 },
  crikvenica: { lat: 45.1762, lng: 14.6915 },
  cres: { lat: 44.9609, lng: 14.4072 },
  'mali losinj': { lat: 44.5343, lng: 14.4691 },
  'veli losinj': { lat: 44.5128, lng: 14.5005 },
  losinj: { lat: 44.5343, lng: 14.4691 },
  susak: { lat: 44.5103, lng: 14.307 },
  ilovik: { lat: 44.4626, lng: 14.544 },
  'sveti petar': { lat: 44.4595, lng: 14.5553 },
  unije: { lat: 44.6469, lng: 14.2435 },
  martinscica: { lat: 44.819, lng: 14.3401 }, // Cres Island Martinšćica
  'vele srakane': { lat: 44.6121, lng: 14.3247 },
  valun: { lat: 44.8344, lng: 14.3275 },
  'ustrine west': { lat: 44.7466, lng: 14.4128 },

  // ───────── Rab / Pag ─────────
  rab: { lat: 44.7569, lng: 14.7607 },
  lopar: { lat: 44.833, lng: 14.73 },
  pag: { lat: 44.4441, lng: 15.0584 },
  novalja: { lat: 44.5563, lng: 14.8852 },
  simuni: { lat: 44.4666, lng: 14.9698 },
  senj: { lat: 44.9908, lng: 14.9043 },

  // ───────── Zadar / Dugi Otok / North Dalmatia ─────────
  zadar: { lat: 44.1194, lng: 15.2314 },
  sukosan: { lat: 44.0468, lng: 15.301 },
  sali: { lat: 43.9384, lng: 15.164 },
  'dugi otok': { lat: 43.9384, lng: 15.164 },
  bozava: { lat: 44.1414, lng: 14.9069 },
  brbinj: { lat: 44.0747, lng: 15.0083 }, // Dugi Otok NE — twin wooded coves
  zaglav: { lat: 43.9494, lng: 15.1186 }, // Dugi Otok — fuel quay next to Sali
  'pantera bay': { lat: 44.1217, lng: 14.8525 },
  telascica: { lat: 43.8941, lng: 15.175 },
  iz: { lat: 44.0444, lng: 15.1389 },
  'veli iz': { lat: 44.0573, lng: 15.1241 },
  olib: { lat: 44.3653, lng: 14.7811 },
  silba: { lat: 44.3737, lng: 14.6896 },
  premuda: { lat: 44.3327, lng: 14.611 },
  molat: { lat: 44.2225, lng: 14.8475 },
  zapuntel: { lat: 44.2649, lng: 14.7795 },
  'biograd na moru': { lat: 43.9387, lng: 15.4458 },
  biograd: { lat: 43.9387, lng: 15.4458 },
  vrgada: { lat: 43.8487, lng: 15.5099 },

  // ───────── Kornati ─────────
  kornati: { lat: 43.7705, lng: 15.3556 },
  piskera: { lat: 43.7705, lng: 15.3556 },
  levrnaka: { lat: 43.816, lng: 15.345 },
  zut: { lat: 43.873, lng: 15.283 },
  'island zut': { lat: 43.873, lng: 15.283 },
  'ravni zakan': { lat: 43.7517, lng: 15.3076 },
  vrulja: { lat: 43.8335, lng: 15.3142 },
  'vrulja bay': { lat: 43.8335, lng: 15.3142 },
  brovinje: { lat: 43.8245, lng: 15.3358 },

  // ───────── Murter / Šibenik ─────────
  murter: { lat: 43.8225, lng: 15.5917 },
  jezera: { lat: 43.7864, lng: 15.6393 },
  skradin: { lat: 43.8221, lng: 15.9233 },
  'np krka': { lat: 43.8058, lng: 15.9645 }, // Skradinski Buk falls
  krka: { lat: 43.8058, lng: 15.9645 },
  sibenik: { lat: 43.735, lng: 15.8952 },
  tijat: { lat: 43.665, lng: 15.827 },
  tribunj: { lat: 43.7588, lng: 15.7472 },
  primosten: { lat: 43.5851, lng: 15.9265 },
  rogoznica: { lat: 43.5258, lng: 15.9707 },
  kaprije: { lat: 43.7089, lng: 15.7095 },
  zlarin: { lat: 43.7036, lng: 15.8408 },

  // ───────── Pašman / Ugljan / Dugi Otok side bays ─────────
  zdrelac: { lat: 43.9608, lng: 15.3088 },
  sutomiscica: { lat: 44.064, lng: 15.246 },
  'sutomiscica bay': { lat: 44.064, lng: 15.246 },

  // ───────── Split / Trogir / Kaštela / Šolta / Brač ─────────
  split: { lat: 43.5081, lng: 16.4402 },
  trogir: { lat: 43.5165, lng: 16.251 },
  kastela: { lat: 43.5469, lng: 16.3239 },
  'krknjasi bay': { lat: 43.4422, lng: 16.0928 },
  'veli drvenik': { lat: 43.4385, lng: 16.1066 },
  'plaza luka': { lat: 43.4385, lng: 16.1066 }, // beach near Veli Drvenik
  solta: { lat: 43.397, lng: 16.2138 },
  maslinica: { lat: 43.397, lng: 16.2138 },
  'maslinica bay': { lat: 43.397, lng: 16.2138 },
  brac: { lat: 43.326, lng: 16.4505 },
  milna: { lat: 43.326, lng: 16.4505 },
  lucice: { lat: 43.2983, lng: 16.676 },
  'lucice bay': { lat: 43.2983, lng: 16.676 },

  // ───────── Hvar / Pakleni / Vis ─────────
  hvar: { lat: 43.1729, lng: 16.4413 },
  'hvar town': { lat: 43.1729, lng: 16.4413 },
  palmizana: { lat: 43.1656, lng: 16.393 },
  pakleni: { lat: 43.1656, lng: 16.393 },
  'stari grad': { lat: 43.1834, lng: 16.598 },
  jelsa: { lat: 43.162, lng: 16.6907 },
  scedro: { lat: 43.0966, lng: 16.7053 },
  vis: { lat: 43.0617, lng: 16.1858 },
  'vis town': { lat: 43.0617, lng: 16.1858 },
  komiza: { lat: 43.0438, lng: 16.0902 },
  bisevo: { lat: 42.9858, lng: 16.0231 },
  'blue cave': { lat: 42.9858, lng: 16.0231 },
  'green cave': { lat: 43.0211, lng: 16.0664 }, // Ravnik
  ravnik: { lat: 43.0211, lng: 16.0664 },
  budihovac: { lat: 43.0386, lng: 16.2347 },
  'islet budihovac': { lat: 43.0386, lng: 16.2347 },

  // ───────── Korčula / Lastovo ─────────
  korcula: { lat: 42.9596, lng: 17.1351 },
  'korcula town': { lat: 42.9596, lng: 17.1351 },
  'vela luka': { lat: 42.9589, lng: 16.7195 },
  proizd: { lat: 42.9851, lng: 16.6792 },
  lastovo: { lat: 42.7647, lng: 16.8915 },
  zaklopatica: { lat: 42.7647, lng: 16.8915 },
  'skrivena luka': { lat: 42.7235, lng: 16.8857 },
  'uvala lisky': { lat: 42.766, lng: 16.85 },
  'prva draga': { lat: 42.762, lng: 16.83 },

  // ───────── Mljet / Pelješac / Dubrovnik / Slano ─────────
  mljet: { lat: 42.782, lng: 17.3398 },
  pomena: { lat: 42.782, lng: 17.3398 },
  polace: { lat: 42.7903, lng: 17.39 },
  okuklje: { lat: 42.7588, lng: 17.5566 },
  saplunara: { lat: 42.7106, lng: 17.733 },
  'saplunara bay': { lat: 42.7106, lng: 17.733 },
  pelješac: { lat: 42.865, lng: 17.643 },
  peljesac: { lat: 42.865, lng: 17.643 },
  kobas: { lat: 42.865, lng: 17.643 },
  'kobas bay': { lat: 42.865, lng: 17.643 },
  slano: { lat: 42.7849, lng: 17.8889 },
  lopud: { lat: 42.6838, lng: 17.9433 },
  sipan: { lat: 42.728, lng: 17.8569 },
  dubrovnik: { lat: 42.6507, lng: 18.0944 },

  // ───────── ITALY ─────────
  // ───────── Liguria coast (Genova → Imperia) ─────────
  genova: { lat: 44.4056, lng: 8.9463 },
  arenzano: { lat: 44.4044, lng: 8.6816 },
  cogoleto: { lat: 44.3899, lng: 8.6408 },
  varazze: { lat: 44.3567, lng: 8.5775 },
  savona: { lat: 44.3094, lng: 8.481 },
  'vado ligure': { lat: 44.2706, lng: 8.4339 },
  albenga: { lat: 44.0507, lng: 8.2173 },
  imperia: { lat: 43.8836, lng: 8.0269 },

  // ───────── Liguria — Cinque Terre / Tigullio ─────────
  portofino: { lat: 44.3038, lng: 9.2095 },
  lavagna: { lat: 44.3074, lng: 9.3486 },
  'sestri levante': { lat: 44.2719, lng: 9.3984 },
  moneglia: { lat: 44.2374, lng: 9.4867 },
  bonassola: { lat: 44.1817, lng: 9.5825 },
  monterosso: { lat: 44.1456, lng: 9.6543 },
  vernazza: { lat: 44.1349, lng: 9.6839 },
  'anzo-setta': { lat: 44.32, lng: 9.36 }, // small bay near Sestri Levante
  anzo: { lat: 44.32, lng: 9.36 },

  // ───────── Corsica anchorages reachable from Liguria/Sardinia ─────────
  bonifacio: { lat: 41.3873, lng: 9.1601 },
  'porto vecchio': { lat: 41.5891, lng: 9.2796 },

  // ───────── Sardinia (Olbia / Costa Smeralda / Maddalena) ─────────
  olbia: { lat: 40.923, lng: 9.4983 },
  'golfo aranci': { lat: 40.9892, lng: 9.6178 },
  portisco: { lat: 41.008, lng: 9.552 },
  'porto rotondo': { lat: 41.0307, lng: 9.5421 },
  'porto cervo': { lat: 41.1369, lng: 9.535 },
  palau: { lat: 41.1796, lng: 9.3833 },
  'santa teresa': { lat: 41.2403, lng: 9.1872 },
  'santa teresa gallura': { lat: 41.2403, lng: 9.1872 },
  'la maddalena': { lat: 41.2106, lng: 9.4032 },
  caprera: { lat: 41.2078, lng: 9.4685 },
  spargi: { lat: 41.2452, lng: 9.3343 },
  'cala santa maria': { lat: 41.27, lng: 9.455 }, // Caprera archipelago
  mortorio: { lat: 41.0881, lng: 9.6217 },
  'mortorio island': { lat: 41.0881, lng: 9.6217 },
  tavolara: { lat: 40.8978, lng: 9.7044 },
  'tavolara island': { lat: 40.8978, lng: 9.7044 },
  molara: { lat: 40.8704, lng: 9.7325 },
  'molara island': { lat: 40.8704, lng: 9.7325 },
  'porto san paolo': { lat: 40.8823, lng: 9.6419 },

  // ───────── Campania / Amalfi Coast ─────────
  naples: { lat: 40.8518, lng: 14.2681 },
  napoli: { lat: 40.8518, lng: 14.2681 },
  ischia: { lat: 40.74, lng: 13.945 },
  'casamicciola terme': { lat: 40.7449, lng: 13.9112 },
  sorrento: { lat: 40.6263, lng: 14.3759 },
  positano: { lat: 40.628, lng: 14.4842 },
  praiano: { lat: 40.6126, lng: 14.5298 },
  conca: { lat: 40.6149, lng: 14.5689 }, // Conca dei Marini
  amalfi: { lat: 40.634, lng: 14.6027 },
  minori: { lat: 40.65, lng: 14.6256 },
  maiori: { lat: 40.65, lng: 14.6398 },
  cetara: { lat: 40.6473, lng: 14.7016 },
  vietri: { lat: 40.6722, lng: 14.7259 },
  'vietri sul mare': { lat: 40.6722, lng: 14.7259 },
  salerno: { lat: 40.6824, lng: 14.7681 },
  agropoli: { lat: 40.3522, lng: 14.9929 },
  acciaroli: { lat: 40.1772, lng: 15.0237 },
  'marina di casalvelino': { lat: 40.1812, lng: 15.0789 },
  palinuro: { lat: 40.0349, lng: 15.2814 },
  'marina di camerota': { lat: 40.0073, lng: 15.3739 },

  // ───────── Sicily mainland (Palermo / Cefalù / San Vito) ─────────
  palermo: { lat: 38.1157, lng: 13.3613 },
  mondello: { lat: 38.2003, lng: 13.3211 },
  terrasini: { lat: 38.1518, lng: 13.0858 },
  cefalu: { lat: 38.0392, lng: 14.0241 },
  'san vito': { lat: 38.1721, lng: 12.7359 },
  'san vito lo capo': { lat: 38.1721, lng: 12.7359 },
  portorosa: { lat: 38.0867, lng: 15.4361 },

  // ───────── Egadi Islands ─────────
  favignana: { lat: 37.9337, lng: 12.3266 },
  levanzo: { lat: 38.0085, lng: 12.3402 },
  marettimo: { lat: 37.9762, lng: 12.057 },

  // ───────── Aeolian Islands ─────────
  ustica: { lat: 38.7066, lng: 13.1937 },
  lipari: { lat: 38.4665, lng: 14.9533 },
  vulcano: { lat: 38.4078, lng: 14.9618 },
  'vulcano porto': { lat: 38.4078, lng: 14.9618 },
  stromboli: { lat: 38.7929, lng: 15.2123 },
  salina: { lat: 38.5772, lng: 14.8589 },
  'santa marina salina': { lat: 38.5772, lng: 14.8589 },
  filicudi: { lat: 38.5778, lng: 14.5851 },
  'filicudi porto': { lat: 38.5778, lng: 14.5851 },
  panarea: { lat: 38.6383, lng: 15.0726 },
  "capo d'orlando": { lat: 38.158, lng: 14.738 },
  'capo d orlando': { lat: 38.158, lng: 14.738 },
  tono: { lat: 38.157, lng: 14.706 },

  // ───────── GREECE ─────────
  // ───────── Attica / Saronic Gulf ─────────
  athens: { lat: 37.9105, lng: 23.7016 },
  alimos: { lat: 37.9105, lng: 23.7016 },
  'marina alimos': { lat: 37.9105, lng: 23.7016 },
  lavrion: { lat: 37.7144, lng: 24.0556 },
  laurium: { lat: 37.7144, lng: 24.0556 },
  piraeus: { lat: 37.9396, lng: 23.651 },
  aegina: { lat: 37.7466, lng: 23.4258 },
  hydra: { lat: 37.3478, lng: 23.4671 },
  spetses: { lat: 37.262, lng: 23.1597 },
  poros: { lat: 37.5018, lng: 23.4487 },
  ermioni: { lat: 37.3884, lng: 23.2495 },
  epidaurus: { lat: 37.6364, lng: 23.1605 },
  porto_heli: { lat: 37.3217, lng: 23.1456 },
  'porto heli': { lat: 37.3217, lng: 23.1456 },
  agkistri: { lat: 37.7163, lng: 23.3548 },
  agistri: { lat: 37.7163, lng: 23.3548 },
  methana: { lat: 37.58, lng: 23.3756 },

  // ───────── Cyclades ─────────
  mykonos: { lat: 37.4467, lng: 25.3289 },
  paros: { lat: 37.0852, lng: 25.15 },
  parikia: { lat: 37.0852, lng: 25.15 },
  naoussa: { lat: 37.1247, lng: 25.2374 },
  naxos: { lat: 37.1042, lng: 25.376 },
  santorini: { lat: 36.3932, lng: 25.4615 },
  thira: { lat: 36.3932, lng: 25.4615 },
  vlychada: { lat: 36.3505, lng: 25.4476 },
  ios: { lat: 36.7299, lng: 25.2823 },
  folegandros: { lat: 36.616, lng: 24.909 },
  sifnos: { lat: 36.9785, lng: 24.7211 },
  kamares: { lat: 36.9914, lng: 24.6707 },
  milos: { lat: 36.7235, lng: 24.4337 },
  adamantas: { lat: 36.7235, lng: 24.4337 },
  kimolos: { lat: 36.7895, lng: 24.5689 },
  serifos: { lat: 37.1505, lng: 24.5117 },
  kythnos: { lat: 37.4017, lng: 24.4142 },
  tinos: { lat: 37.5365, lng: 25.1604 },
  syros: { lat: 37.4448, lng: 24.9416 },
  ermoupoli: { lat: 37.4448, lng: 24.9416 },
  delos: { lat: 37.4007, lng: 25.2693 },
  koufonisia: { lat: 36.9379, lng: 25.5878 },
  schinoussa: { lat: 36.8689, lng: 25.5183 },
  iraklia: { lat: 36.8451, lng: 25.4543 },
  amorgos: { lat: 36.839, lng: 25.9001 },
  donousa: { lat: 37.1098, lng: 25.8128 },
  anafi: { lat: 36.359, lng: 25.77 },
  andros: { lat: 37.8367, lng: 24.9376 },
  kea: { lat: 37.6125, lng: 24.3393 },

  // ───────── Ionian ─────────
  corfu: { lat: 39.6502, lng: 19.853 },
  gouvia: { lat: 39.6532, lng: 19.848 },
  kerkyra: { lat: 39.6243, lng: 19.9217 },
  lefkada: { lat: 38.8311, lng: 20.711 },
  preveza: { lat: 38.955, lng: 20.7548 },
  kefalonia: { lat: 38.1735, lng: 20.4858 },
  argostoli: { lat: 38.1735, lng: 20.4858 },
  zakynthos: { lat: 37.7889, lng: 20.8957 },
  zante: { lat: 37.7889, lng: 20.8957 },
  ithaca: { lat: 38.3675, lng: 20.7193 },
  ithaki: { lat: 38.3675, lng: 20.7193 },
  vathy: { lat: 38.3675, lng: 20.7193 },
  paxos: { lat: 39.2055, lng: 20.1848 },
  paxoi: { lat: 39.2055, lng: 20.1848 },
  antipaxos: { lat: 39.1422, lng: 20.2375 },
  meganisi: { lat: 38.652, lng: 20.7758 },
  kalamos: { lat: 38.6273, lng: 20.9314 },
  kastos: { lat: 38.5772, lng: 20.9089 },
  fiskardo: { lat: 38.4596, lng: 20.5786 },
  sami: { lat: 38.2528, lng: 20.647 },
  sivota: { lat: 39.4083, lng: 20.2253 }, // Sivota (Epirus) — svi Ionian routovi misle na epirsku; Lefkada varijanta dolje
  'sivota (lefkada)': { lat: 38.6218, lng: 20.6851 },
  syvota: { lat: 38.6085, lng: 20.6951 },
  nidri: { lat: 38.7, lng: 20.7115 },

  // ───────── Dodecanese ─────────
  rhodes: { lat: 36.4517, lng: 28.2238 },
  rodos: { lat: 36.4517, lng: 28.2238 },
  mandraki: { lat: 36.4517, lng: 28.2238 },
  kos: { lat: 36.8932, lng: 27.287 },
  symi: { lat: 36.6105, lng: 27.8389 },
  kalymnos: { lat: 36.9468, lng: 26.9871 },
  leros: { lat: 37.1297, lng: 26.8507 },
  lakki: { lat: 37.1297, lng: 26.8507 },
  patmos: { lat: 37.3084, lng: 26.5454 },
  lipsi: { lat: 37.2986, lng: 26.7626 },
  nisyros: { lat: 36.5848, lng: 27.1668 },
  tilos: { lat: 36.4178, lng: 27.3514 },
  astypalaia: { lat: 36.5536, lng: 26.3499 },
  karpathos: { lat: 35.5089, lng: 27.2138 },

  // ───────── Sporades / Volos ─────────
  skiathos: { lat: 39.162, lng: 23.49 },
  skopelos: { lat: 39.1232, lng: 23.7274 },
  alonissos: { lat: 39.1525, lng: 23.8589 },
  volos: { lat: 39.3625, lng: 22.9426 },
  pelion: { lat: 39.4039, lng: 23.0822 },
  trikeri: { lat: 39.0951, lng: 23.0691 },

  // Greek port-name additions (route configs reference these)
  frikes: { lat: 38.4528, lng: 20.6692 },
  merihas: { lat: 37.4011, lng: 24.4022 },
  mirsini: { lat: 36.8678, lng: 25.5039 },
  koukounaires: { lat: 39.1495, lng: 23.4231 }, // alt spelling of Koukounaries
  marathonisi: { lat: 37.7228, lng: 20.8775 }, // turtle islet in Laganas Bay, Zakynthos
  tsilivi: { lat: 37.7969, lng: 20.8639 }, // east-coast beach Zakynthos

  // ───────── Crete ─────────
  heraklion: { lat: 35.3387, lng: 25.1442 },
  chania: { lat: 35.5174, lng: 24.0144 },
  rethymno: { lat: 35.3719, lng: 24.4797 },
  agios_nikolaos: { lat: 35.1894, lng: 25.716 },
  'agios nikolaos': { lat: 37.9046, lng: 20.7075 }, // Agios Nikolaos (Zakynthos) — jedina ruta koja ga koristi; Kreta varijanta dolje
  'agios nikolaos (crete)': { lat: 35.1894, lng: 25.716 },
  // ───────── Peloponnese (Saronic-east mainland) ─────────
  'cape sounion': { lat: 37.6502, lng: 24.0247 },
  sounion: { lat: 37.6502, lng: 24.0247 },
  'palaia epidavros': { lat: 37.6326, lng: 23.1551 },
  dokos: { lat: 37.3379, lng: 23.33 },
  dhokos: { lat: 37.3379, lng: 23.33 },
  nafplio: { lat: 37.5676, lng: 22.8011 },
  monemvasia: { lat: 36.6868, lng: 23.051 },
  gerakas: { lat: 36.8044, lng: 22.9888 },
  kiparissi: { lat: 36.9853, lng: 22.9981 },
  leonidio: { lat: 37.1639, lng: 22.8475 },
  sampatiki: { lat: 37.4042, lng: 22.88 },

  // ───────── Ionian / Epirus mainland (Corfu approaches) ─────────
  sagiada: { lat: 39.55, lng: 20.1822 },
  ereikoussa: { lat: 39.8806, lng: 19.5722 },
  erikoussa: { lat: 39.8806, lng: 19.5722 },
  kassiopi: { lat: 39.7898, lng: 19.9221 },
  mourtos: { lat: 39.4166, lng: 20.2326 },
  parga: { lat: 39.2814, lng: 20.4019 },
  plataria: { lat: 39.45, lng: 20.2667 },
  asos: { lat: 38.3811, lng: 20.5619 },
  astakos: { lat: 38.5294, lng: 21.0875 },
  lixouri: { lat: 38.2, lng: 20.4361 },
  vasiliki: { lat: 38.63, lng: 20.6011 },
  kyllini: { lat: 37.9347, lng: 21.1442 },
  patras: { lat: 38.2466, lng: 21.7346 },

  // ───────── Zakynthos coves & Ionian small ─────────
  'porto koukla': { lat: 37.7058, lng: 20.9016 },
  'keri bay': { lat: 37.6717, lng: 20.8275 },
  'vromi bay': { lat: 37.85, lng: 20.6225 },
  'agios nikolaos zakynthos': { lat: 37.8853, lng: 20.7414 },

  // ───────── Dodecanese add-ons ─────────
  arki: { lat: 37.3933, lng: 26.73 },
  fourni: { lat: 37.58, lng: 26.4847 },
  chalki: { lat: 36.2225, lng: 27.6 },
  halki: { lat: 36.2225, lng: 27.6 },
  levitha: { lat: 37.0, lng: 26.45 },
  lindos: { lat: 36.0917, lng: 28.0871 },

  // ───────── Sporades add-ons ─────────
  'kyra panagia': { lat: 39.33, lng: 24.07 },
  'kira panagia': { lat: 39.33, lng: 24.07 },
  skyros: { lat: 38.9078, lng: 24.565 },
  'agia kiriaki': { lat: 39.095, lng: 23.07 },
  'tzortzi bay': { lat: 39.1525, lng: 23.8589 }, // Alonissos
  koukounaries: { lat: 39.1495, lng: 23.4231 }, // Skiathos beach

  // ───────── Cycladic small ─────────
  karavostasi: { lat: 36.616, lng: 24.909 }, // Folegandros harbour

  // ───────── SPAIN — Catalonia ─────────
  barcelona: { lat: 41.3851, lng: 2.1734 },
  badalona: { lat: 41.4502, lng: 2.247 },
  'el masnou': { lat: 41.4815, lng: 2.3128 },
  mataro: { lat: 41.5388, lng: 2.4449 },
  'arenys de mar': { lat: 41.5814, lng: 2.5497 },
  calella: { lat: 41.6147, lng: 2.6647 },
  'santa susanna': { lat: 41.6342, lng: 2.7113 },
  'malgrat de mar': { lat: 41.6463, lng: 2.744 },
  blanes: { lat: 41.6747, lng: 2.79 },
  'lloret de mar': { lat: 41.6986, lng: 2.8453 },
  lloret: { lat: 41.6986, lng: 2.8453 },
  tossa: { lat: 41.7194, lng: 2.9322 },
  'tossa de mar': { lat: 41.7194, lng: 2.9322 },
  'sant feliu': { lat: 41.7811, lng: 3.0289 },
  'sant feliu de guixols': { lat: 41.7811, lng: 3.0289 },
  "platja d'aro": { lat: 41.8175, lng: 3.0639 },
  sitges: { lat: 41.2376, lng: 1.8059 },
  garraf: { lat: 41.2638, lng: 1.9072 },
  castelldefels: { lat: 41.2789, lng: 1.975 },
  cadaques: { lat: 42.2885, lng: 3.2772 },
  'cala montgo': { lat: 42.1085, lng: 3.1614 },
  roses: { lat: 42.2628, lng: 3.1764 },
  palamos: { lat: 41.8474, lng: 3.1294 },
  'cap de creus': { lat: 42.319, lng: 3.319 },
  'illes medes': { lat: 42.0494, lng: 3.2244 },

  // ───────── SPAIN — Costa del Sol (Andalucia) ─────────
  malaga: { lat: 36.7213, lng: -4.4216 },
  marbella: { lat: 36.5108, lng: -4.8856 },
  fuengirola: { lat: 36.5402, lng: -4.6243 },
  benalmadena: { lat: 36.5957, lng: -4.5167 },
  torremolinos: { lat: 36.6202, lng: -4.4994 },
  'torre de benagalbon': { lat: 36.7286, lng: -4.2858 },
  'puerto de cabopino': { lat: 36.4792, lng: -4.7456 },
  churriana: { lat: 36.6772, lng: -4.5097 },

  // ───────── SPAIN — Balearics ─────────
  'palma de mallorca': { lat: 39.5696, lng: 2.6502 },
  palma: { lat: 39.5696, lng: 2.6502 },
  mallorca: { lat: 39.6953, lng: 3.0176 },
  andratx: { lat: 39.5409, lng: 2.3955 },
  'port andratx': { lat: 39.5454, lng: 2.3858 },
  soller: { lat: 39.7657, lng: 2.7152 },
  'port de soller': { lat: 39.7964, lng: 2.6921 },
  'cala figuera': { lat: 39.3303, lng: 3.1745 },
  'porto colom': { lat: 39.418, lng: 3.2683 },
  portocolom: { lat: 39.418, lng: 3.2683 },
  'porto cristo': { lat: 39.5384, lng: 3.3349 },
  'cala dor': { lat: 39.3756, lng: 3.234 },
  cabrera: { lat: 39.1469, lng: 2.9466 },
  'sa rapita': { lat: 39.3596, lng: 2.9577 },
  'cala pi': { lat: 39.3631, lng: 2.8417 },
  'cala santanyi': { lat: 39.3372, lng: 3.1297 },
  'es trenc': { lat: 39.3478, lng: 2.9875 },
  "ca'n pastilla": { lat: 39.5267, lng: 2.7325 },
  'can pastilla': { lat: 39.5267, lng: 2.7325 },
  'el toro': { lat: 39.4983, lng: 2.4836 },
  'colonia de sant pere': { lat: 39.7325, lng: 3.2697 },
  alcudia: { lat: 39.8533, lng: 3.1206 },
  'port de pollenca': { lat: 39.9094, lng: 3.0833 },
  pollensa: { lat: 39.8767, lng: 3.0156 },
  'cala sant vicenc': { lat: 39.9181, lng: 3.0586 },
  'cala ratjada': { lat: 39.7058, lng: 3.4636 },
  ibiza: { lat: 38.9067, lng: 1.4206 },
  'ibiza town': { lat: 38.9067, lng: 1.4206 },
  eivissa: { lat: 38.9067, lng: 1.4206 },
  'marina eivissa': { lat: 38.9067, lng: 1.4206 },
  'sant antoni': { lat: 38.9803, lng: 1.3038 },
  'sant antoni de portmany': { lat: 38.9803, lng: 1.3038 },
  'san antonio': { lat: 38.9803, lng: 1.3038 },
  'santa eulalia': { lat: 38.9849, lng: 1.5346 },
  'santa eularia': { lat: 38.9849, lng: 1.5346 },
  'santa eularia des riu': { lat: 38.9849, lng: 1.5346 },
  portinatx: { lat: 39.1136, lng: 1.5167 },
  'cala vedella': { lat: 38.8847, lng: 1.2156 },
  'platja de ses salines': { lat: 38.8367, lng: 1.4022 },
  'ses salines': { lat: 38.8367, lng: 1.4022 },
  formentera: { lat: 38.7051, lng: 1.4316 },
  'puerto formentera': { lat: 38.7359, lng: 1.4185 },
  'la savina': { lat: 38.7359, lng: 1.4185 },
  'es vedra': { lat: 38.8722, lng: 1.1972 },
  'cala saona': { lat: 38.7058, lng: 1.4011 },
  espalmador: { lat: 38.7858, lng: 1.4435 },
  menorca: { lat: 39.9495, lng: 4.1102 },
  mahon: { lat: 39.8893, lng: 4.2634 },
  mao: { lat: 39.8893, lng: 4.2634 },
  'mao-mahon': { lat: 39.8893, lng: 4.2634 },
  ciutadella: { lat: 40.0019, lng: 3.8398 },
  'cala galdana': { lat: 39.9374, lng: 3.969 },
  'cala en bosch': { lat: 39.9264, lng: 3.7683 },
  'son saura': { lat: 39.9086, lng: 3.8747 },
  'son bou': { lat: 39.9111, lng: 4.0828 },
  'cala en porter': { lat: 39.8703, lng: 4.1267 },
  "port d'addaia": { lat: 39.9947, lng: 4.1864 },

  // ───────── TURKEY — Bodrum / Gulf of Gökova ─────────
  bodrum: { lat: 37.0344, lng: 27.4308 },
  kairos: { lat: 36.9853, lng: 28.1004 }, // Gökova anchorage between Mersincik and Karaca
  'kapı creek': { lat: 36.6247, lng: 28.8608 }, // Fethiye gulf
  'kızıkuyruk koyu': { lat: 36.5675, lng: 28.873 },
  kusadası: { lat: 37.8622, lng: 27.2571 },
  'yalıkavak & gol turkbuku': { lat: 37.1054, lng: 27.287 }, // composite label — full-key match
  'kara ada': { lat: 37.0153, lng: 27.4258 },
  karaada: { lat: 37.0153, lng: 27.4258 },
  yalikavak: { lat: 37.1148, lng: 27.2828 },
  'gol turkbuku': { lat: 37.1304, lng: 27.3201 },
  turkbuku: { lat: 37.1304, lng: 27.3201 },
  turgutreis: { lat: 37.0224, lng: 27.2538 },
  gumusluk: { lat: 37.0566, lng: 27.231 },
  gulluk: { lat: 37.2447, lng: 27.5985 },
  didim: { lat: 37.3667, lng: 27.2667 },
  kusadasi: { lat: 37.8595, lng: 27.2569 },
  ozdere: { lat: 38.0294, lng: 27.0526 },
  mersincik: { lat: 37.0011, lng: 27.8328 },
  akyaka: { lat: 37.0473, lng: 28.3486 },
  oren: { lat: 37.0426, lng: 27.9714 },
  karaca: { lat: 36.928, lng: 28.1842 },
  karacasogut: { lat: 36.928, lng: 28.1842 },
  'gulf of gokova': { lat: 36.9, lng: 28.05 },
  gokova: { lat: 36.9, lng: 28.05 },
  cleopatra: { lat: 36.8456, lng: 28.0764 },
  'cleopatra island': { lat: 36.8456, lng: 28.0764 },
  'sedir island': { lat: 36.8456, lng: 28.0764 },
  bencik: { lat: 36.7894, lng: 28.0917 },
  longoz: { lat: 36.78, lng: 28.18 },
  knidos: { lat: 36.6843, lng: 27.3725 },
  'knidos harbour': { lat: 36.6843, lng: 27.3725 },
  datca: { lat: 36.7325, lng: 27.6885 },
  palamutbuku: { lat: 36.6915, lng: 27.5234 },
  cokertme: { lat: 37.0142, lng: 27.7558 },

  // ───────── TURKEY — Göcek / Turquoise Coast ─────────
  gocek: { lat: 36.7464, lng: 28.9419 },
  fethiye: { lat: 36.6212, lng: 29.1162 },
  oludeniz: { lat: 36.5511, lng: 29.1289 },
  'kapi creek': { lat: 36.7222, lng: 28.8967 },
  'wall bay': { lat: 36.7233, lng: 28.9722 },
  'sarsala bay': { lat: 36.7372, lng: 28.9239 },
  'tomb bay': { lat: 36.7461, lng: 28.8678 },
  ekincik: { lat: 36.8214, lng: 28.5417 },
  gemiler: { lat: 36.5567, lng: 29.0567 },
  'gemiler island': { lat: 36.5567, lng: 29.0567 },
  'kizikuyruk koyu': { lat: 36.6717, lng: 28.7706 },
  kizilkuyruk: { lat: 36.6717, lng: 28.7706 },
  'ruin bay': { lat: 36.7367, lng: 28.9036 },
  'butterfly valley': { lat: 36.5311, lng: 29.1106 },
  'coldwater bay': { lat: 36.7128, lng: 28.7944 },
  kas: { lat: 36.2014, lng: 29.6364 },
  kekova: { lat: 36.1844, lng: 29.8758 },
  demre: { lat: 36.246, lng: 29.985 },
  marmaris: { lat: 36.8551, lng: 28.2666 },
  orhaniye: { lat: 36.7719, lng: 28.1308 },
  selimiye: { lat: 36.7333, lng: 28.0783 },
  bozburun: { lat: 36.6814, lng: 28.0444 },
  // Symi + Rhodes već u Greek bloku (cross-region nautical destinations)

  // ───────── CARIBBEAN — British Virgin Islands ─────────
  tortola: { lat: 18.4207, lng: -64.6399 },
  'the baths': { lat: 18.4287, lng: -64.4453 },
  'spanish town': { lat: 18.4478, lng: -64.4304 },
  'north sound': { lat: 18.4989, lng: -64.3712 },
  'leverick bay': { lat: 18.4972, lng: -64.3853 },
  anegada: { lat: 18.727, lng: -64.3944 },
  'rodney bay': { lat: 14.0755, lng: -60.9498 },
  'marigot bay': { lat: 13.9662, lng: -61.0249 }, // St. Lucia — NE St-Martin Marigot
  soufriere: { lat: 13.856, lng: -61.0573 },
  'pigeon island': { lat: 14.0922, lng: -60.9682 },
  grenada: { lat: 12.1165, lng: -61.679 },
  'cane garden bay': { lat: 18.4274, lng: -64.6628 },
  'jost van dyke': { lat: 18.4486, lng: -64.7508 },
  'norman island': { lat: 18.3247, lng: -64.6175 },
  'peter island': { lat: 18.3672, lng: -64.5775 },
  'cooper island': { lat: 18.3833, lng: -64.5333 },
  'scrub island': { lat: 18.4869, lng: -64.5347 },
  'virgin gorda': { lat: 18.4419, lng: -64.4406 },

  // ───────── CARIBBEAN — Bahamas (Abacos) ─────────
  'marsh harbour': { lat: 26.5412, lng: -77.0636 },
  'hope town': { lat: 26.5363, lng: -76.9606 },
  'great guana cay': { lat: 26.6606, lng: -77.1253 },
  'green turtle cay': { lat: 26.7644, lng: -77.3372 },
  'man-o-war cay': { lat: 26.5908, lng: -77.0036 },
  nassau: { lat: 25.0443, lng: -77.3504 },

  // ───────── CARIBBEAN — Sint Maarten / Saint Martin / St. Barths ─────────
  philipsburg: { lat: 18.0263, lng: -63.0458 },
  marigot: { lat: 18.0708, lng: -63.0867 },
  'anse marcel': { lat: 18.1147, lng: -63.0533 },
  'tintamarre island': { lat: 18.1228, lng: -62.9789 },
  gustavia: { lat: 17.8975, lng: -62.8511 },
  'st barthélemy': { lat: 17.8975, lng: -62.8511 },
  'st barthelemy': { lat: 17.8975, lng: -62.8511 },
  'île fourchue': { lat: 17.9572, lng: -62.8911 },
  'ile fourchue': { lat: 17.9572, lng: -62.8911 },

  // ───────── CARIBBEAN — Martinique ─────────
  'le marin': { lat: 14.4736, lng: -60.8703 },
  'saint-anne': { lat: 14.4406, lng: -60.8842 },
  'sainte-anne': { lat: 14.4406, lng: -60.8842 },
  "grande anse d'arlet": { lat: 14.4936, lng: -61.0856 },
  'grande anse darlet': { lat: 14.4936, lng: -61.0856 },
  "anse d'arlet": { lat: 14.4936, lng: -61.0856 },
  "anses d'arlet": { lat: 14.4936, lng: -61.0856 },
  'saint-pierre': { lat: 14.7383, lng: -61.1747 },
  'anse couleuvre': { lat: 14.8447, lng: -61.2231 },
  'anse dufour': { lat: 14.5306, lng: -61.0853 },

  // ───────── CARIBBEAN — Grenada / Carriacou / Tobago Cays ─────────
  "st. george's": { lat: 12.0561, lng: -61.7488 },
  'st. georges': { lat: 12.0561, lng: -61.7488 },
  "saint george's": { lat: 12.0561, lng: -61.7488 },
  'port louis marina': { lat: 12.05, lng: -61.7567 },
  'dragon bay': { lat: 12.0792, lng: -61.7533 },
  'tyrrel bay': { lat: 12.4561, lng: -61.4828 },
  'tyrell bay': { lat: 12.4561, lng: -61.4828 },
  carriacou: { lat: 12.4583, lng: -61.45 },
  'sandy island': { lat: 12.4933, lng: -61.4942 },
  'tobago cays': { lat: 12.6333, lng: -61.35 },
  'salt whistle bay': { lat: 12.6447, lng: -61.4014 },
  mayreau: { lat: 12.6383, lng: -61.3947 },
  // ───────── Wave 2: France / Seychelles / Montenegro (21.7.2026) ─────────
  cannes: { lat: 43.549, lng: 7.017 },
  'iles de lerins': { lat: 43.52, lng: 7.045 },
  antibes: { lat: 43.585, lng: 7.129 },
  'saint-tropez': { lat: 43.272, lng: 6.64 },
  'port grimaud': { lat: 43.273, lng: 6.58 },
  cavalaire: { lat: 43.17, lng: 6.53 },
  porquerolles: { lat: 43.001, lng: 6.2 },
  'port-cros': { lat: 43.008, lng: 6.383 },
  'le lavandou': { lat: 43.136, lng: 6.368 },
  frejus: { lat: 43.423, lng: 6.751 },
  'theoule-sur-mer': { lat: 43.507, lng: 6.94 },
  monaco: { lat: 43.735, lng: 7.421 },
  'villefranche-sur-mer': { lat: 43.703, lng: 7.311 },
  'saint-raphael': { lat: 43.421, lng: 6.768 },
  agay: { lat: 43.432, lng: 6.857 },
  ajaccio: { lat: 41.92, lng: 8.738 },
  'porto pollo': { lat: 41.707, lng: 8.797 },
  propriano: { lat: 41.677, lng: 8.9 },
  campomoro: { lat: 41.634, lng: 8.81 },
  tizzano: { lat: 41.543, lng: 8.85 },
  'iles lavezzi': { lat: 41.336, lng: 9.257 },
  'porto-vecchio': { lat: 41.59, lng: 9.279 },
  rondinara: { lat: 41.47, lng: 9.275 },
  girolata: { lat: 42.349, lng: 8.612 },
  calvi: { lat: 42.568, lng: 8.757 },
  cargese: { lat: 42.134, lng: 8.596 },
  'capo rosso': { lat: 42.23, lng: 8.54 },
  sagone: { lat: 42.115, lng: 8.698 },
  'le crouesty': { lat: 47.542, lng: -2.895 },
  'ile aux moines': { lat: 47.596, lng: -2.851 },
  vannes: { lat: 47.655, lng: -2.76 },
  'belle-ile': { lat: 47.348, lng: -3.152 },
  'belle-ile (le palais)': { lat: 47.348, lng: -3.152 },
  'le palais': { lat: 47.348, lng: -3.152 },
  sauzon: { lat: 47.372, lng: -3.219 },
  houat: { lat: 47.39, lng: -2.955 },
  hoedic: { lat: 47.34, lng: -2.878 },
  'la trinite-sur-mer': { lat: 47.585, lng: -3.028 },
  'ile de groix': { lat: 47.645, lng: -3.45 },
  lorient: { lat: 47.745, lng: -3.365 },
  'la rochelle': { lat: 46.158, lng: -1.152 },
  'ile de re': { lat: 46.203, lng: -1.365 },
  'ile de re (saint-martin)': { lat: 46.203, lng: -1.365 },
  'saint-martin': { lat: 46.203, lng: -1.365 },
  'ile d aix': { lat: 46.01, lng: -1.175 },
  boyardville: { lat: 45.968, lng: -1.245 },
  'ile d oleron': { lat: 45.968, lng: -1.245 },
  'ile d oleron (boyardville)': { lat: 45.968, lng: -1.245 },
  rochefort: { lat: 45.942, lng: -0.958 },
  castelnaudary: { lat: 43.318, lng: 1.954 },
  bram: { lat: 43.244, lng: 2.115 },
  carcassonne: { lat: 43.213, lng: 2.351 },
  trebes: { lat: 43.21, lng: 2.445 },
  homps: { lat: 43.267, lng: 2.72 },
  'le somail': { lat: 43.256, lng: 2.865 },
  capestang: { lat: 43.328, lng: 3.046 },
  beziers: { lat: 43.341, lng: 3.216 },
  agde: { lat: 43.311, lng: 3.466 },
  'port cassafieres': { lat: 43.291, lng: 3.372 },
  marseillan: { lat: 43.353, lng: 3.531 },
  hesse: { lat: 48.694, lng: 7.052 },
  lutzelbourg: { lat: 48.732, lng: 7.254 },
  saverne: { lat: 48.741, lng: 7.362 },
  niderviller: { lat: 48.714, lng: 7.098 },
  lagarde: { lat: 48.678, lng: 6.717 },
  xouaxange: { lat: 48.69, lng: 6.994 },
  'saint-jean-de-losne': { lat: 47.102, lng: 5.263 },
  auxonne: { lat: 47.194, lng: 5.387 },
  dole: { lat: 47.093, lng: 5.49 },
  'verdun-sur-le-doubs': { lat: 46.898, lng: 5.021 },
  seurre: { lat: 46.998, lng: 5.152 },
  'saint-symphorien': { lat: 47.078, lng: 5.29 },
  'eden island': { lat: -4.633, lng: 55.474 },
  'eden island (mahe)': { lat: -4.633, lng: 55.474 },
  mahe: { lat: -4.633, lng: 55.474 },
  'sainte anne': { lat: -4.61, lng: 55.5 },
  'baie ternay': { lat: -4.643, lng: 55.375 },
  'baie sainte anne': { lat: -4.352, lng: 55.76 },
  praslin: { lat: -4.352, lng: 55.76 },
  'praslin (baie sainte anne)': { lat: -4.352, lng: 55.76 },
  'anse lazio': { lat: -4.293, lng: 55.696 },
  curieuse: { lat: -4.283, lng: 55.727 },
  'la digue': { lat: -4.358, lng: 55.83 },
  felicite: { lat: -4.32, lng: 55.868 },
  'grande soeur': { lat: -4.293, lng: 55.867 },
  cousin: { lat: -4.33, lng: 55.662 },
  aride: { lat: -4.213, lng: 55.665 },
  silhouette: { lat: -4.48, lng: 55.245 },
  'ile cocos': { lat: -4.325, lng: 55.87 },
  marianne: { lat: -4.348, lng: 55.913 },
  'porto montenegro': { lat: 42.434, lng: 18.691 },
  'porto montenegro (tivat)': { lat: 42.434, lng: 18.691 },
  tivat: { lat: 42.434, lng: 18.691 },
  kotor: { lat: 42.425, lng: 18.769 },
  perast: { lat: 42.487, lng: 18.699 },
  'herceg novi': { lat: 42.452, lng: 18.537 },
  rose: { lat: 42.425, lng: 18.567 },
  zanjice: { lat: 42.397, lng: 18.565 },
  bigova: { lat: 42.355, lng: 18.703 },
  budva: { lat: 42.278, lng: 18.837 },
  'sveti stefan': { lat: 42.256, lng: 18.891 },
  petrovac: { lat: 42.205, lng: 18.941 },
  bar: { lat: 42.098, lng: 19.09 },
  'lustica bay': { lat: 42.383, lng: 18.64 },

  // ───────── Wave 3: Thailand / Netherlands / German Baltic (21.7.2026) ─────────
  phuket: { lat: 8.176, lng: 98.343 },
  'yacht haven': { lat: 8.176, lng: 98.343 },
  'yacht haven (phuket)': { lat: 8.176, lng: 98.343 },
  'ko phanak': { lat: 8.196, lng: 98.489 },
  'ko hong': { lat: 8.229, lng: 98.501 },
  'ko hong (phang nga)': { lat: 8.229, lng: 98.501 },
  'phang nga': { lat: 8.229, lng: 98.501 },
  'ko yao noi': { lat: 8.109, lng: 98.6 },
  krabi: { lat: 8.01, lng: 98.837 },
  railay: { lat: 8.01, lng: 98.837 },
  'railay (krabi)': { lat: 8.01, lng: 98.837 },
  'ko phi phi don': { lat: 7.741, lng: 98.778 },
  'ko phi phi le': { lat: 7.677, lng: 98.766 },
  'ko rang yai': { lat: 7.96, lng: 98.451 },
  'ko lanta': { lat: 7.649, lng: 99.038 },
  'ko muk': { lat: 7.363, lng: 99.288 },
  'ko kradan': { lat: 7.31, lng: 99.256 },
  lemmer: { lat: 52.846, lng: 5.71 },
  urk: { lat: 52.663, lng: 5.6 },
  enkhuizen: { lat: 52.704, lng: 5.293 },
  hoorn: { lat: 52.641, lng: 5.061 },
  volendam: { lat: 52.495, lng: 5.07 },
  medemblik: { lat: 52.772, lng: 5.107 },
  stavoren: { lat: 52.881, lng: 5.362 },
  makkum: { lat: 53.055, lng: 5.402 },
  marken: { lat: 52.458, lng: 5.103 },
  monnickendam: { lat: 52.462, lng: 5.038 },
  muiden: { lat: 52.333, lng: 5.07 },
  heiligenhafen: { lat: 54.374, lng: 10.98 },
  burgtiefe: { lat: 54.4, lng: 11.204 },
  'burgtiefe (fehmarn)': { lat: 54.4, lng: 11.204 },
  fehmarn: { lat: 54.4, lng: 11.204 },
  grossenbrode: { lat: 54.383, lng: 11.088 },
  bagenkop: { lat: 54.752, lng: 10.672 },
  marstal: { lat: 54.851, lng: 10.518 },
  aeroskobing: { lat: 54.888, lng: 10.41 },
  svendborg: { lat: 55.056, lng: 10.61 },
  faaborg: { lat: 55.095, lng: 10.243 },
  sonderborg: { lat: 54.913, lng: 9.78 },
  dyvig: { lat: 54.973, lng: 9.687 },
};

const ALIAS_MAP: Record<string, string> = {
  'cres town': 'cres',
  'cres island': 'cres',
  'island cres': 'cres',
  'olib island': 'olib',
  'unije island': 'unije',
  'premuda island': 'premuda',
  'murter island': 'murter',
  'solta island': 'solta',
  sukošan: 'sukosan',
  'mljet (polace)': 'polace',
  'mljet (pomena)': 'pomena',
  'mljet (okuklje)': 'okuklje',
  'mljet (saplunara)': 'saplunara',
  'mljet (mljet national park)': 'pomena',
  'mljet national park': 'pomena',
  'krka national park': 'skradin',
  'krka np': 'skradin',
  'np krka': 'skradin',
  'kornati national park': 'kornati',
  'kornati np': 'kornati',
  'np kornati': 'kornati',
  'nature park telascica': 'telascica',
  'telascica nature park': 'telascica',
  'pag island': 'pag',
  'pelješac peninsula': 'peljesac',
  'peljesac peninsula': 'peljesac',
  'novalja, pag island': 'novalja',
  'novalja (pag)': 'novalja',
  'kobas (pelješac peninsula)': 'kobas',
  'lopar (rab)': 'lopar',
  'milna, brač': 'milna',
  'milna (brač island)': 'milna',
  'island žut': 'zut',
  'island Žut': 'zut',
  brovinje: 'brovinje',

  // Greek alternative spellings (English/older forms vs official)
  ithaka: 'ithaca',
  irakleia: 'iraklia',
  lefkas: 'lefkada',
  koufonissi: 'koufonisia',
  schoinousa: 'schinoussa',
  donoussa: 'donousa',
  kithnos: 'kythnos',
  mykanos: 'mykonos', // typo in route config
  fiscardo: 'fiskardo', // typo in route config
  nikoaos: 'agios nikolaos', // typo in route config
  'lefkas (d-marin)': 'lefkada',
  'lefkas (nidri port)': 'nidri',
  'lefkas (vasiliki port)': 'vasiliki',
  'ithaka (frikes harbor)': 'frikes',
  'kithnos (merihas)': 'merihas',
  'schoinousa (mirsini harbor)': 'mirsini',

  // Italy / Turkey misc
  sorento: 'sorrento', // typo in config; Sorrento is the canonical
  sarsala: 'sarsala bay',
  "tono - capo d'orlando": 'tono',
  'tono - capo d orlando': 'tono',
  'marathonisi (laganas bay)': 'marathonisi',
  'yalikavak & gol turkbuku': 'yalikavak', // combined label, primary anchor is Yalıkavak

  // Caribbean aliases
  'st barths': 'gustavia',
  'st-barths': 'gustavia',
  'saint barthelemy': 'gustavia',
  'sint maarten': 'philipsburg',
  'sint maarten dutch side': 'philipsburg',
  'saint martin french side': 'marigot',
  'st martin': 'marigot',
  // Country-name fallbacks so `${spot}, Grenada` style labels resolve
  // even after the comma split — Grenada → St. George's, Bahamas → Nassau.
  grenada: "st. george's",
  bahamas: 'nassau',
  'st vincent': 'mayreau',
  'saint vincent': 'mayreau',
};

/** Strip diacritics (š→s, ć→c, ž→z, đ→d, ı→i) and lowercase.
 *  Turkish dotless ı is its own codepoint and does NOT decompose under
 *  NFD, so it needs a manual pass. Curly apostrophes (’) are folded to
 *  the regular ' as well — Catalan place names like "Platja d'Aro" use
 *  the curly variant in source data. */
function normaliseDiacritics(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/ı/g, 'i')
    .replace(/[’‘`]/g, "'");
}

/** Strip parenthetical context. e.g. "Hvar (Palmižana)" → "Hvar". */
function stripParentheses(s: string): string {
  return s.replace(/\s*\(.*?\)\s*/g, ' ').trim();
}

/** Strip noise suffixes (Bay, Town, Island, etc.) for fallback matching. */
function stripSuffixes(s: string): string {
  return s
    .replace(/\b(bay|town|island|harbour|harbor|marina|peninsula|nature park|national park)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolve any route-day label to its canonical lat/lon. Tries a series
 * of progressively looser matches: exact key → alias → strip parens →
 * strip suffixes → first word. Returns null when nothing fits, leaving
 * the map to render the route without that pin (rare on curated routes).
 */
export function resolveLocationCoords(label: string): LatLng | null {
  if (!label) return null;

  const tryLookup = (key: string): LatLng | null => {
    const normalised = normaliseDiacritics(key).trim();

    if (LOCATION_COORDS[normalised]) return LOCATION_COORDS[normalised];

    const aliased = ALIAS_MAP[normalised];

    if (aliased && LOCATION_COORDS[aliased]) return LOCATION_COORDS[aliased];

    return null;
  };

  // 1. Exact match (post-diacritic-normalise) on the full label
  let hit = tryLookup(label);

  if (hit) return hit;

  // 2. Strip parenthetical contextualiser, e.g. "Hvar (Palmižana)"
  const noParens = stripParentheses(label);

  if (noParens !== label) {
    hit = tryLookup(noParens);

    if (hit) return hit;

    // 3. Inside-the-parens lookup, e.g. "(Palmižana)" → "palmizana"
    const insideMatch = label.match(/\(([^)]+)\)/);

    if (insideMatch) {
      hit = tryLookup(insideMatch[1]);

      if (hit) return hit;
    }
  }

  // 4. Strip suffix words like "Bay" / "Town" / "Island"
  const noSuffix = stripSuffixes(noParens);

  if (noSuffix !== noParens) {
    hit = tryLookup(noSuffix);

    if (hit) return hit;
  }

  // 5. Comma-separated context — "NP Kornati, Piškera" → try each segment.
  if (noSuffix.includes(',')) {
    // eslint-disable-next-line no-restricted-syntax -- early-return lookup over comma segments
    for (const part of noSuffix
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)) {
      hit = tryLookup(part);

      if (hit) return hit;

      const partNoSuffix = stripSuffixes(part);

      if (partNoSuffix !== part) {
        hit = tryLookup(partNoSuffix);

        if (hit) return hit;
      }
    }
  }

  // 6. First word — last-resort, catches "Krknjaši Bay (Veli Drvenik)" → "krknjasi"
  const firstWord = noSuffix.split(/[\s,]+/)[0];

  if (firstWord) {
    hit = tryLookup(firstWord);

    if (hit) return hit;
  }

  return null;
}
