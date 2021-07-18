
# Québec COVID QR Code Decoder (Check mon vax)

Application web statique **non-officielle** pour décoder et vérifier l'authenticité des QR codes envoyés au Québec après l'administration d'un des vaccins Covid 19.

[EN] **Unofficial** static web application to decode and verify the authenticity of QR codes sent in Quebec after the administration of one of the Covid 19 vaccines.

[Cliquer ici pour une DEMONSTRATION](https://www.checkmonvax.net)

![Demo](doc/johnDoeVax.png)

## Fonctionnalitées :
 - Entièrement statique, pas de serveur, ni d'envoi de données à l'extérieur du navigateur
 - Conçu pour être utilisé par les mobiles (Android, iOS), les tablettes et les PC/Mac
 - Peut lire les QR codes à partir de:
	 - La **caméra des cellulaires**
	 - Les **PNG**, **JPEG**
	 - Les **PDF** avec un QR code sur la première page
- Affiche différents états pour les QR codes lus :
	- Un message vert si la personne a reçu deux dose
	- Un message orange si la personne a reçu une dose
	- Un message d'erreur si l'authenticité du QR Code n'a pas été validée contre la clé publique (beta)
- Lecture de la donnée brute JSON
- Traductions:
	- Français
	 - Anglais
- Fait entièrement en Vue.Js

 ## Notice sur la sécurité des données
Bien que les données contenues dans les QR codes Covid-19 soient lisibles et non encodées par nature (elles suivent le protocole Smart Health Card (SHC), qui lui même utilise le JWT), il convient de rappeler que:

 - Les données personnelles contenues dans ces QR codes sont sensibles et vous devez impérativement obtenir le **consentement** de/des personne(s) concernée(s) par le QR code **pour décoder, consulter, collecter et stocker ces données.**
 - Même si le projet valide la signature du QR code contre une clé publique, le projet ne saurait se porter responsable d'erreurs de validation de l'authenticité.
-   Cette application fonctionne côté client (site web statique), ce qui signifie que **les données insérées ne sont PAS envoyées à un serveur ou à un tiers.**
 
## Installation et développement:

#### Project setup

```

npm install

```
  

#### Compiles and hot-reloads for development

```

npm run serve:https

```
For the webcam QR code reading development, the page is served as HTTPS without certificate (hence the certificate errors).
  

#### Compiles and minifies for production

```

npm run build

```