/* tuto-guides.js — Données des guides d'installation XENON TV (in-app).
   Utilisé par xenontv-tutoriels.html et xenontv-bug.html.
   Le texte des étapes vient des tutoriels officiels. credentialStep = index
   (base 1) de l'étape où le client saisit ses identifiants (on y injecte ses
   vrais codes). */
window.TUTO_GUIDES = {
  "fire-stick": {
    title: "Installer sur Fire Stick",
    subtitle: "6 étapes, captures réelles",
    steps: [
      {t:"Autorisez les applications inconnues", d:"Réglages → Mon Fire TV → Options pour développeurs → activez « Installer applications inconnues » pour Downloader."},
      {t:"Installez « Downloader »", d:"Depuis l'Appstore Amazon, recherchez et installez l'application orange « Downloader »."},
      {t:"Entrez le code 250931 dans Downloader", d:"Ouvrez Downloader et saisissez le code 250931 : il télécharge directement IPTV Smarters Pro. Installez-la."},
      {t:"Ouvrez l'appli → « Login with Xtream Codes API »", d:"Au lancement, choisissez le mode Xtream Codes API — surtout pas M3U : il configure chaînes, VOD et guide TV d'un coup."},
      {t:"Saisissez vos identifiants XENON", d:"Nom (libre), puis l'URL du serveur avec son port (:8080), l'identifiant et le mot de passe — sans espace avant/après."},
      {t:"Laissez charger, puis profitez", d:"Chaînes, VOD et guide TV se synchronisent (≈ 1 min la première fois). Épinglez XENON en façade — le VPN inclus est déjà actif côté serveur."}
    ],
    credentialStep: 5
  },
  "smart-tv": {
    title: "Installer sur Smart TV",
    subtitle: "Choisissez votre application — Samsung · LG · Hisense · Philips",
    steps: [
      {t:"IPTV Smarters Pro", d:"Guide par marque (Samsung, LG, Hisense, Philips) — reconnaître la vraie application (développeur WHMCS Smarters) et se connecter en Xtream."},
      {t:"Smart One IPTV", d:"Très stable. Configuration par adresse MAC + lien M3U via le portail web. Licence 2€/an."},
      {t:"HOT IPTV", d:"La meilleure interface du marché. Configuration par code MAC + lien M3U. Activation 10€. Recommandée au quotidien sur Samsung, LG et Hisense."}
    ],
    credentialStep: null
  },
  "smart-tv-smarters": {
    title: "IPTV Smarters Pro sur Smart TV",
    subtitle: "5 étapes · Samsung, LG, Hisense, Philips",
    steps: [
      {t:"Reconnaître la bonne application", d:"Attention aux copies : de nombreuses applications imitent IPTV Smarters Pro et sont payantes ou malveillantes. N'installez que la version officielle (développeur WHMCS Smarters). Samsung → « IPTV Smarters Pro » dans le Smart Hub (logo « IPTV Smarters Player ») ; LG → « IPTVSmartersPro » (sans espace) dans le LG Content Store ; Hisense / Philips (VIDAA) → « IPTV Smarters » dans le store VIDAA."},
      {t:"Installez et lancez l'application", d:"Depuis le store de votre TV, installez IPTV Smarters Pro puis lancez l'application."},
      {t:"Acceptez les conditions d'utilisation", d:"Au premier lancement, appuyez sur « Accept » pour continuer vers l'écran de connexion."},
      {t:"Entrez vos codes de connexion XENON TV", d:"Nom du profil (ex : XENONTV), URL du serveur, Username et Password de votre abonnement. ⚠️ Identifiant non reconnu ? Vérifiez/corrigez votre URL ici — c'est la cause la plus fréquente ; sinon essayez une autre application (page Tutoriels)."},
      {t:"Support et dépannage", d:"• Application introuvable : cherchez dans le store et vérifiez le développeur WHMCS Smarters. • Problèmes de connexion : vérifiez vos identifiants et votre abonnement. • Mauvaise qualité : Ethernet ou Wi-Fi 5GHz recommandé."}
    ],
    credentialStep: 4
  },
  "android": {
    title: "Installer sur Android",
    subtitle: "Choisissez votre application — smartphone & tablette",
    steps: [
      {t:"IPTV Smarters Pro", d:"La référence sur Android via Downloader (code 250931). Connexion Xtream complète : chaînes, VOD et guide TV."},
      {t:"Zen IPTV Player", d:"Design premium. Installation par APK officiel, compte à créer, connexion Xtream identique."}
    ],
    credentialStep: null
  },
  "android-smarters": {
    title: "IPTV Smarters Pro sur Android",
    subtitle: "9 étapes détaillées",
    steps: [
      {t:"Installez Downloader depuis le Google Play Store", d:"Downloader permet de télécharger et installer des APK, dont IPTV Smarters Pro qui n'est pas sur le Play Store. Installez-la gratuitement."},
      {t:"Activez les sources inconnues", d:"Autorisez les applications de sources inconnues : • Samsung : Paramètres → Applications → ⋮ → Accès spéciaux → Installation applis inconnues → Downloader → Autoriser • Xiaomi/MIUI : Paramètres → Confidentialité → Sources inconnues → Activer • Huawei : Paramètres → Sécurité → Sources inconnues → Activer • Android stock : Paramètres → Applications → Downloader → Installer applis inconnues → Autoriser"},
      {t:"Ouvrez Downloader et entrez le code 250931", d:"Ouvrez Downloader, tapez le code 250931 dans la barre de recherche et appuyez sur Go."},
      {t:"Naviguez vers IPTV Smarters Pro et cliquez sur Download", d:"Faites défiler jusqu'à IPTV Smarters Pro puis appuyez sur « Download »."},
      {t:"Laissez l'application s'installer et ouvrez-la", d:"Appuyez sur « Installer », puis « Ouvrir »."},
      {t:"Lancez l'application et acceptez les conditions", d:"Appuyez sur « Agree » / « J'accepte »."},
      {t:"Sélectionnez la connexion Xtream Codes API", d:"Choisissez « Login with Xtream Codes API »."},
      {t:"Entrez vos codes de connexion XENON TV", d:"Nom du profil (ex : XENONTV), URL du serveur, Username et Password reçus avec votre abonnement."},
      {t:"Support et dépannage", d:"• Installation bloquée : vérifiez les sources inconnues pour Downloader. • Connexion : vérifiez vos identifiants et abonnement. • Qualité : Wi-Fi stable / Ethernet. • Plantage : réinstallez via Downloader."}
    ],
    credentialStep: 8
  },
  "android-zen": {
    title: "Zen IPTV Player sur Android",
    subtitle: "8 étapes détaillées",
    steps: [
      {t:"Téléchargez Zen IPTV Player sur Android", d:"Zen IPTV n'est pas sur le Play Store : téléchargez l'APK depuis le site officiel puis « Télécharger l'APK »."},
      {t:"Activez les sources inconnues", d:"Autorisez les sources inconnues pour votre gestionnaire de fichiers (Samsung/Xiaomi/Huawei/Android stock — chemin selon la marque)."},
      {t:"Installez le fichier APK depuis vos téléchargements", d:"Ouvrez le dossier « Téléchargements », appuyez sur zen-iptv.apk puis « Installer »."},
      {t:"Créez votre compte", d:"Ouvrez Zen IPTV Player → « S'inscrire » : e-mail + mot de passe (ou compte Google)."},
      {t:"Ajoutez une source IPTV", d:"« Ajouter une source » → « Xtream Codes »."},
      {t:"Entrez vos codes de connexion XENON TV", d:"Nom de la source (ex : XENONTV), URL du serveur, Username et Password."},
      {t:"Votre liste est chargée — profitez !", d:"Zen IPTV charge chaînes, films et séries en 4K/HD."},
      {t:"Support et dépannage", d:"• Installation bloquée : sources inconnues. • Connexion : vérifiez identifiants et abonnement. • Liste vide : vérifiez l'URL. • Qualité : Wi-Fi stable ou 4G/5G."}
    ],
    credentialStep: 6
  },
  "android-tv": {
    title: "Installer sur Android TV",
    subtitle: "Choisissez votre application — Android TV & Google TV",
    steps: [
      {t:"IPTV Smarters Pro", d:"Installation via Downloader (code 250931). Le plus simple sur Android TV."},
      {t:"Zen IPTV Player", d:"Design premium. Installation via Downloader (code 725409), compte à créer, connexion Xtream."}
    ],
    credentialStep: null
  },
  "android-tv-smarters": {
    title: "IPTV Smarters Pro sur Android TV",
    subtitle: "9 étapes détaillées",
    steps: [
      {t:"Installez Downloader depuis le Google Play Store", d:"Downloader installe des APK dont IPTV Smarters Pro (absent du Play Store). Installez-la gratuitement."},
      {t:"Activez les sources inconnues", d:"Android TV / Google TV : Paramètres → Applications → Sécurité et restrictions → Sources inconnues → Downloader → Autoriser (Samsung Tizen / Xiaomi / Nvidia Shield : chemin équivalent)."},
      {t:"Ouvrez Downloader et entrez le code 250931", d:"Tapez 250931 dans la barre de recherche, appuyez sur Go."},
      {t:"Naviguez vers IPTV Smarters Pro et cliquez sur Download", d:"Faites défiler jusqu'à IPTV Smarters Pro puis « Download »."},
      {t:"Laissez l'application s'installer et ouvrez-la", d:"« Installer » puis « Ouvrir »."},
      {t:"Lancez l'application et acceptez les conditions", d:"« Agree » / « J'accepte »."},
      {t:"Sélectionnez « Login with Xtream Codes API »", d:"Choisissez le mode Xtream Codes API."},
      {t:"Entrez vos codes de connexion XENON TV", d:"Nom du profil (ex : XENONTV), URL du serveur, Username et Password."},
      {t:"Support et dépannage", d:"• Installation bloquée : sources inconnues pour Downloader. • Connexion : identifiants + abonnement. • Qualité : Ethernet/Wi-Fi 5GHz. • Plantage : réinstallez via Downloader."}
    ],
    credentialStep: 8
  },
  "android-tv-zen": {
    title: "Zen IPTV Player sur Android TV",
    subtitle: "9 étapes détaillées",
    steps: [
      {t:"Installez Downloader sur votre Android TV", d:"Recherchez « Downloader » sur le Play Store de votre TV et installez-la."},
      {t:"Activez les sources inconnues", d:"Paramètres → Applications → Sécurité et restrictions → Sources inconnues → Downloader → Autoriser (selon la marque)."},
      {t:"Ouvrez Downloader et entrez le code 725409", d:"Tapez 725409, appuyez sur Go — le téléchargement de Zen IPTV démarre."},
      {t:"Installez l'application et lancez-la", d:"« Installer » puis « Ouvrir »."},
      {t:"Créez votre compte", d:"« Inscription » : e-mail + mot de passe (ou compte Google)."},
      {t:"Ajoutez une source IPTV", d:"« Ajouter une source » → « Xtream Codes »."},
      {t:"Entrez vos codes de connexion XENON TV", d:"Nom de la source (ex : XENONTV), URL du serveur, Username et Password."},
      {t:"Validez et profitez de votre contenu", d:"Zen IPTV charge chaînes, films et séries en 4K/HD."},
      {t:"Support et dépannage", d:"• Installation bloquée : sources inconnues. • Connexion : identifiants + abonnement. • Liste vide : vérifiez l'URL. • Qualité : Ethernet/Wi-Fi 5GHz."}
    ],
    credentialStep: 7
  },
  "iphone-ipad": {
    title: "Installer sur iPhone / iPad",
    subtitle: "Choisissez votre application — iPhone · iPad · Apple TV",
    steps: [
      {t:"Smarters Player Lite", d:"L'application la plus populaire sur iPhone, iPad et Apple TV. Rendu optimisé, connexion Xtream simple."},
      {t:"Zen IPTV Player", d:"Nouvelle application au design premium. Interface soignée et fluide, connexion Xtream identique."},
      {t:"IPTVX", d:"Design façon Netflix, recommandée surtout sur Apple TV. Payante et assez chère."}
    ],
    credentialStep: null
  },
  "iphone-smarters": {
    title: "Smarters Player Lite sur iPhone",
    subtitle: "4 étapes détaillées",
    steps: [
      {t:"Téléchargez Smarters Player Lite", d:"Depuis l'App Store, recherchez « Smarters Player Lite ». Gratuite et conçue pour iOS, pour une lecture fluide de vos flux IPTV."},
      {t:"Lancez l'application et sélectionnez « Xtream Code »", d:"Ouvrez l'app, acceptez les conditions, puis appuyez sur « Xtream Code »."},
      {t:"Saisissez vos informations de connexion IPTV", d:"Nom du profil (ex : XENONTV), Username, Password et URL du serveur de votre abonnement XENON TV."},
      {t:"Support et dépannage", d:"• Connexion : vérifiez vos identifiants et que l'abonnement est actif. • Qualité : Wi-Fi stable ou 4G/5G. • Compatibilité : mettez iOS à jour."}
    ],
    credentialStep: 3
  },
  "iphone-zen": {
    title: "Zen IPTV Player sur iPhone",
    subtitle: "7 étapes détaillées",
    steps: [
      {t:"Téléchargez Zen IPTV Player", d:"App Store → « Zen IPTV Player ». Gratuite, interface digne des grandes plateformes, iPhone et iPad."},
      {t:"Installez et ouvrez l'application", d:"Ouvrez Zen IPTV Player : créez un compte ou connectez-vous pour profiter de toutes les fonctionnalités."},
      {t:"Créez votre compte", d:"« S'inscrire » : e-mail + mot de passe, ou identifiant Apple en un clic."},
      {t:"Ajoutez une source IPTV", d:"« Ajouter une source » → « Xtream Codes »."},
      {t:"Entrez vos codes de connexion XENON TV", d:"Nom de la source (ex : XENONTV), URL du serveur, Username et Password."},
      {t:"Votre liste est chargée — profitez !", d:"Zen IPTV charge chaînes, films et séries en 4K/HD après quelques secondes de synchronisation."},
      {t:"Support et dépannage", d:"• Connexion : identifiants + état de l'abonnement. • Liste vide : vérifiez l'URL et la connexion. • Qualité : Wi-Fi stable ou 4G/5G. • iOS 13 minimum."}
    ],
    credentialStep: 5
  },
  "pc-mac": {
    title: "Installer sur PC / Mac",
    subtitle: "6 étapes — Windows & macOS",
    steps: [
      {t:"Installez l'application depuis le site de l'éditeur", d:"Téléchargez IPTV Smarters (Windows ou macOS) depuis le site officiel. Alternative sans installation : VLC → Média → « Ouvrir un flux réseau », collez votre lien M3U complet (get.php…)."},
      {t:"Ouvrez l'application et acceptez", d:"Acceptez les conditions et choisissez le français si demandé."},
      {t:"Choisissez « Login with Xtream Codes API »", d:"Surtout pas le mode M3U : Xtream configure chaînes, films, séries ET guide TV d'un coup."},
      {t:"Saisissez vos identifiants XENON", d:"Nom (libre), URL du serveur avec son port (:8080), identifiant et mot de passe — sans espace avant/après."},
      {t:"Laissez la liste se charger", d:"Validez (Add Playlist / Ajouter). Synchronisation ≈ 1 min la première fois."},
      {t:"Organisez vos favoris et profitez", d:"Ajoutez vos chaînes en favoris. Le VPN inclus est déjà actif côté serveur."}
    ],
    credentialStep: 4
  },
  "smart-one": {
    title: "Smart One IPTV sur Smart TV",
    subtitle: "7 étapes · licence 2€ / an",
    steps: [
      {t:"Installez Smart One IPTV sur votre TV", d:"Store de votre TV → « Smart One IPTV » (Samsung Apps, LG Content Store, Google Play, App Store, VIDAA)."},
      {t:"Lancez l'app et notez votre adresse MAC", d:"Votre adresse MAC s'affiche au lancement (encadrée en rouge en haut ou en bleu au centre)."},
      {t:"Ouvrez le site Smart One IPTV depuis votre mobile", d:"Depuis votre smartphone, ouvrez le portail de configuration Smart One IPTV."},
      {t:"Faites défiler et cliquez sur « M3U Playlist »", d:"En bas de la page, cliquez sur « M3U Playlist »."},
      {t:"Remplissez les informations de votre playlist", d:"TV MAC : l'adresse de votre TV (étape 2) · Playlist Name : XENONTV · Playlist M3U : votre lien M3U XENON TV · EPG : laisser vide."},
      {t:"Activez l'application (licence 1 an — 2€)", d:"Page d'activation : entrez l'adresse MAC de votre TV, sélectionnez « 1 YEAR » à 2€."},
      {t:"Support et dépannage", d:"• MAC introuvable : Settings → Info. • Playlist non chargée : vérifiez le lien M3U. • Qualité : Ethernet/Wi-Fi 5GHz. • Licence expirée : renouvelez pour 2€/an."}
    ],
    credentialStep: 5
  },
  "hot-iptv": {
    title: "HOT IPTV sur Smart TV",
    subtitle: "7 étapes · activation 10€ · recommandée",
    steps: [
      {t:"Installez HOT IPTV sur votre TV", d:"Store de votre TV → « HOT IPTV » (Samsung, LG, Google Play, VIDAA ; Fire TV : via Downloader code 395800)."},
      {t:"Lancez l'app et notez votre code MAC", d:"Un code MAC unique s'affiche sur l'écran d'accueil."},
      {t:"Ouvrez le portail HOT IPTV depuis votre mobile", d:"Depuis votre smartphone, ouvrez le portail d'activation HOT IPTV."},
      {t:"Entrez votre adresse MAC", d:"Renseignez le champ « Votre adresse MAC » avec le code de votre TV (étape 2)."},
      {t:"Ajoutez votre lien M3U XENON TV", d:"Type « Link » puis : Lien M3U = votre lien M3U XENON TV · Name = XENONTV."},
      {t:"Activez l'application (10€)", d:"Page d'activation : entrez l'adresse MAC de votre TV, tarif 10€."},
      {t:"Support et dépannage", d:"• MAC introuvable : relancez l'app. • Playlist non chargée : le lien M3U doit commencer par http://. • Qualité : Ethernet/Wi-Fi 5GHz. • Activation : hotplayer.app/fr/activation."}
    ],
    credentialStep: 5
  }
};
window.TUTO_CATALOG = [
  { category: "Téléviseurs connectés", items: [
    { slug:"smart-tv", label:"Smart TV · Samsung, LG, Hisense…", emoji:"📺" },
    { slug:"smart-tv-smarters", label:"Smart TV · IPTV Smarters Pro", emoji:"📺" },
    { slug:"smart-one", label:"Smart TV · Smart One IPTV", emoji:"📡" },
    { slug:"hot-iptv", label:"Smart TV · HOT IPTV", emoji:"🔥" },
    { slug:"android-tv", label:"Android TV / Google TV", emoji:"🖥️" },
    { slug:"android-tv-smarters", label:"Android TV · IPTV Smarters Pro", emoji:"🖥️" },
    { slug:"android-tv-zen", label:"Android TV · Zen IPTV", emoji:"🖥️" }
  ]},
  { category: "Box & lecteurs", items: [
    { slug:"fire-stick", label:"Amazon Fire Stick", emoji:"🔥" }
  ]},
  { category: "Mobile & ordinateur", items: [
    { slug:"iphone-ipad", label:"iPhone / iPad", emoji:"📱" },
    { slug:"iphone-smarters", label:"iPhone · Smarters Player Lite", emoji:"📱" },
    { slug:"iphone-zen", label:"iPhone · Zen IPTV", emoji:"📱" },
    { slug:"android", label:"Android · smartphone & tablette", emoji:"📱" },
    { slug:"android-smarters", label:"Android · IPTV Smarters Pro", emoji:"📱" },
    { slug:"android-zen", label:"Android · Zen IPTV", emoji:"📱" },
    { slug:"pc-mac", label:"PC / Mac (Windows & macOS)", emoji:"💻" }
  ]}
];
