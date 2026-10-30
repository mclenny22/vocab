// Independently authored vocabulary and translations. See ../VOCABULARY.md.
// Compact rows: nouns are article|German|English; other words are kind|German|English.
// Repeated headwords tag the same entry in more than one everyday topic.
const sections = [];
const add = (topic, level, rows) => sections.push({ topic, level, rows: rows.trim().split('\n').map(row => row.split('|')) });

add('introductions', 'A1', `
der|Name|name
der|Vorname|first name
der|Nachname|surname
die|Adresse|address
die|Straße|street
die|Hausnummer|house number
die|Postleitzahl|postcode
der|Wohnort|place of residence
das|Alter|age
der|Geburtstag|birthday
das|Geburtsdatum|date of birth
das|Telefon|telephone
die|Telefonnummer|telephone number
die|Person|person
der|Mann|man
die|Frau|woman
der|Herr|gentleman
das|Kind|child
das|Baby|baby
der|Mensch|human being
phrase|Hallo!|Hello! (informal)
phrase|Guten Morgen!|Good morning!
phrase|Guten Tag!|Good day!
phrase|Guten Abend!|Good evening!
phrase|Gute Nacht!|Good night!
phrase|Auf Wiedersehen!|Goodbye! (formal)
phrase|Tschüss!|Bye! (informal)
phrase|Bis bald!|See you soon!
phrase|Wie heißen Sie?|What is your name? (formal)
phrase|Ich heiße Alex.|My name is Alex.
phrase|Wie geht es dir?|How are you? (informal)
phrase|Danke, gut.|Fine, thanks.
phrase|Vielen Dank!|Thank you very much!
phrase|Bitte schön!|Here you are!
phrase|Entschuldigung!|Excuse me!
phrase|Es tut mir leid.|I am sorry.
phrase|Herzlich willkommen!|Welcome!
adjective|alt|old
adjective|jung|young
`);
add('introductions', 'A2', `
das|Geschlecht|gender
der|Familienstand|marital status
der|Geburtsort|place of birth
die|Unterschrift|signature
die|Staatsangehörigkeit|nationality (citizenship)
der|Jugendliche|adolescent (male)
adjective|erwachsen|adult / grown-up
phrase|Freut mich, Sie kennenzulernen.|Pleased to meet you. (formal)
phrase|Darf ich mich vorstellen?|May I introduce myself?
`);
add('countries', 'A1', `
das|Land|country
die|Sprache|language
die|Heimat|home country
term|Deutschland|Germany
term|Österreich|Austria
term|die Schweiz|Switzerland
term|England|England
term|Frankreich|France
term|Spanien|Spain
term|Italien|Italy
term|Polen|Poland
term|die Türkei|Turkey
term|Deutsch|German (language)
term|Englisch|English (language)
term|Französisch|French (language)
term|Spanisch|Spanish (language)
adjective|deutsch|German (adjective)
adjective|international|international
phrase|Woher kommen Sie?|Where do you come from? (formal)
phrase|Ich komme aus Deutschland.|I come from Germany.
phrase|Ich spreche ein bisschen Deutsch.|I speak a little German.
`);
add('countries', 'A2', `
das|Ausland|foreign countries / abroad
der|Ausländer|foreigner (male)
die|Ausländerin|foreigner (female)
term|Europa|Europe
term|die USA|the USA
term|China|China
term|die Ukraine|Ukraine
adjective|ausländisch|foreign
adjective|europäisch|European
phrase|Was ist deine Muttersprache?|What is your native language?
`);
add('family', 'A1', `
die|Familie|family
die|Eltern|parents
die|Mutter|mother
der|Vater|father
die|Tochter|daughter
der|Sohn|son
die|Schwester|sister
der|Bruder|brother
die|Geschwister|siblings
die|Großeltern|grandparents
die|Großmutter|grandmother
der|Großvater|grandfather
die|Oma|grandma
der|Opa|grandpa
die|Tante|aunt
der|Onkel|uncle
der|Freund|friend (male)
die|Freundin|friend (female)
der|Partner|partner (male)
die|Partnerin|partner (female)
die|Leute|people
adjective|ledig|single / unmarried
adjective|verheiratet|married
adjective|allein|alone
phrase|Ich bin verheiratet.|I am married.
`);
add('family', 'A2', `
der|Cousin|cousin (male)
die|Cousine|cousin (female)
der|Enkel|grandson
die|Enkelin|granddaughter
der|Verwandte|relative (male)
die|Beziehung|relationship
die|Hochzeit|wedding
die|Geburt|birth
die|Kindheit|childhood
das|Ehepaar|married couple
der|Nachbar|neighbour (male)
die|Nachbarin|neighbour (female)
adjective|geschieden|divorced
adjective|getrennt|separated
adjective|zusammen|together
adjective|schwanger|pregnant
`);
add('home', 'A1', `
das|Haus|house
die|Wohnung|apartment
das|Zimmer|room
der|Raum|room / space
die|Küche|kitchen
das|Bad|bathroom
das|Schlafzimmer|bedroom
das|Wohnzimmer|living room
die|Toilette|toilet
der|Flur|hallway
der|Balkon|balcony
der|Garten|garden
die|Tür|door
das|Fenster|window
der|Schlüssel|key
der|Tisch|table
der|Stuhl|chair
das|Bett|bed
der|Schrank|cupboard / wardrobe
das|Sofa|sofa
die|Lampe|lamp
das|Regal|shelf / shelving unit
das|Bild|picture
die|Miete|rent
adjective|groß|big
adjective|klein|small
adjective|hell|bright
adjective|dunkel|dark
adjective|ruhig|quiet
`);
add('home', 'A2', `
die|Möbel|furniture
der|Teppich|carpet
der|Spiegel|mirror
die|Wand|wall
der|Boden|floor / ground
das|Dach|roof
die|Decke|ceiling / blanket
die|Treppe|stairs
der|Aufzug|lift / elevator
der|Keller|cellar
die|Heizung|heating
der|Strom|electricity
das|Gas|gas
der|Vermieter|landlord
die|Vermieterin|landlady
der|Mieter|tenant (male)
die|Nebenkosten|additional housing costs
der|Umzug|house move
die|Wohnungsanzeige|housing advertisement
die|Einrichtung|furnishings
adjective|gemütlich|cosy
adjective|zentral|central
phrase|Die Heizung funktioniert nicht.|The heating does not work.
`);
add('routine', 'A1', `
der|Tag|day
der|Morgen|morning
der|Abend|evening
die|Nacht|night
die|Arbeit|work
das|Frühstück|breakfast
die|Dusche|shower
die|Seife|soap
das|Handtuch|towel
der|Kühlschrank|fridge
die|Waschmaschine|washing machine
der|Herd|cooker / stove
adverb|zuerst|first / first of all
adverb|dann|then
adverb|danach|after that
adverb|früh|early
adverb|spät|late
phrase|Ich stehe um sieben Uhr auf.|I get up at seven o'clock.
`);
add('routine', 'A2', `
der|Haushalt|household
die|Wäsche|laundry
das|Geschirr|dishes
der|Müll|rubbish
die|Spülmaschine|dishwasher
der|Staubsauger|vacuum cleaner
die|Bürste|brush
der|Wecker|alarm clock
die|Gewohnheit|habit
der|Alltag|everyday life
adjective|sauber|clean
adjective|schmutzig|dirty
adjective|kaputt|broken
adjective|fertig|finished / ready
adverb|schließlich|finally
`);
add('food', 'A1', `
das|Essen|food / meal
das|Wasser|water
der|Kaffee|coffee
der|Tee|tea
die|Milch|milk
der|Saft|juice
das|Bier|beer
der|Wein|wine
das|Brot|bread
das|Brötchen|bread roll
die|Butter|butter
der|Käse|cheese
das|Ei|egg
die|Wurst|sausage
das|Fleisch|meat
der|Fisch|fish
der|Reis|rice
die|Nudeln|noodles / pasta
die|Kartoffel|potato
das|Gemüse|vegetables
das|Obst|fruit
der|Apfel|apple
die|Banane|banana
die|Orange|orange (fruit)
die|Birne|pear
die|Erdbeere|strawberry
die|Tomate|tomato
der|Salat|salad / lettuce
die|Suppe|soup
der|Zucker|sugar
das|Salz|salt
der|Kuchen|cake
die|Schokolade|chocolate
das|Mittagessen|lunch
das|Abendessen|dinner
der|Hunger|hunger
der|Durst|thirst
adjective|lecker|delicious
adjective|frisch|fresh
`);
add('food', 'A2', `
die|Zwiebel|onion
der|Knoblauch|garlic
die|Karotte|carrot
die|Gurke|cucumber
die|Zitrone|lemon
die|Traube|grape
der|Pilz|mushroom
das|Hähnchen|chicken (food)
der|Schinken|ham
der|Joghurt|yoghurt
die|Sahne|cream
das|Mehl|flour
das|Öl|oil
der|Essig|vinegar
der|Pfeffer|pepper (spice)
das|Gewürz|spice
die|Marmelade|jam
der|Honig|honey
das|Eis|ice cream / ice
das|Rezept|recipe
die|Zutat|ingredient
die|Mahlzeit|meal
adjective|süß|sweet
adjective|sauer|sour
adjective|salzig|salty
adjective|scharf|spicy / sharp
adjective|vegetarisch|vegetarian
adjective|reif|ripe
`);
add('restaurant', 'A1', `
das|Restaurant|restaurant
das|Café|café
die|Speisekarte|menu
das|Getränk|drink
die|Rechnung|bill / invoice
der|Kellner|waiter
die|Kellnerin|waitress
der|Gast|guest
der|Teller|plate
das|Glas|drinking glass
die|Tasse|cup
die|Flasche|bottle
das|Messer|knife
die|Gabel|fork
der|Löffel|spoon
phrase|Guten Appetit!|Enjoy your meal!
phrase|Die Rechnung, bitte.|The bill, please.
phrase|Ich möchte einen Kaffee.|I would like a coffee.
phrase|Ich hätte gern ein Wasser.|I would like a water, please.
phrase|Zum Wohl!|Cheers!
`);
add('restaurant', 'A2', `
das|Trinkgeld|tip / gratuity
die|Reservierung|reservation
die|Portion|portion
das|Gericht|dish (prepared food)
die|Vorspeise|starter (meal)
das|Dessert|dessert
die|Serviette|napkin
phrase|Zusammen oder getrennt?|Together or separately? (paying)
phrase|Stimmt so.|Keep the change.
phrase|Ist dieser Platz noch frei?|Is this seat still free?
phrase|Ich habe einen Tisch reserviert.|I have reserved a table.
`);
add('shopping', 'A1', `
der|Supermarkt|supermarket
das|Geschäft|shop
der|Laden|store
der|Markt|market
die|Bäckerei|bakery
die|Kasse|checkout / till
der|Preis|price
das|Geld|money
der|Euro|euro
der|Cent|cent
das|Angebot|offer
die|Tasche|bag
der|Kunde|customer (male)
die|Kundin|customer (female)
adjective|teuer|expensive
adjective|billig|cheap
adjective|günstig|inexpensive / good value
adjective|offen|open
adjective|geschlossen|closed
phrase|Wie viel kostet das?|How much does that cost?
phrase|Kann ich mit Karte bezahlen?|Can I pay by card?
`);
add('shopping', 'A2', `
das|Kaufhaus|department store
die|Drogerie|drugstore (toiletries)
die|Metzgerei|butcher's shop
das|Bargeld|cash
die|Kreditkarte|credit card
der|Kassenbon|till receipt
die|Quittung|receipt
der|Rabatt|discount
die|Ware|goods
das|Produkt|product
die|Qualität|quality
die|Auswahl|selection
die|Verpackung|packaging
die|Tüte|carrier bag
die|Lieferung|delivery
adjective|kostenlos|free of charge
adjective|gebraucht|second-hand / used
phrase|Ich möchte das umtauschen.|I would like to exchange this.
`);
add('clothes', 'A1', `
die|Kleidung|clothing
die|Hose|trousers
das|Hemd|shirt
das|T-Shirt|T-shirt
der|Pullover|jumper / sweater
die|Jacke|jacket
der|Mantel|coat
das|Kleid|dress
der|Rock|skirt
der|Schuh|shoe
die|Socke|sock
der|Hut|hat
die|Größe|size
die|Farbe|colour
adjective|rot|red
adjective|blau|blue
adjective|grün|green
adjective|gelb|yellow
adjective|schwarz|black
adjective|weiß|white
adjective|braun|brown
adjective|grau|grey
adjective|lang|long
adjective|kurz|short
adjective|neu|new
`);
add('clothes', 'A2', `
die|Bluse|blouse
der|Anzug|suit
der|Schal|scarf
die|Mütze|cap / beanie
der|Handschuh|glove
der|Gürtel|belt
die|Brille|glasses
der|Schmuck|jewellery
der|Ring|ring
die|Uhr|clock / watch
die|Umkleidekabine|changing room
das|Aussehen|appearance
adjective|rosa|pink
adjective|lila|purple
adjective|orange|orange (colour)
adjective|bunt|colourful
adjective|eng|tight / narrow
adjective|weit|wide / loose
adjective|hübsch|pretty
adjective|blond|blond
phrase|Das passt mir nicht.|That does not fit me.
`);
add('city', 'A1', `
die|Stadt|city
das|Dorf|village
der|Ort|place
der|Platz|square / space
der|Weg|path / way
die|Kirche|church
die|Bank|bank
die|Post|post office / post
die|Apotheke|pharmacy
das|Krankenhaus|hospital
die|Schule|school
der|Park|park
das|Zentrum|centre
die|Haltestelle|bus / tram stop
adverb|links|on the left
adverb|rechts|on the right
adverb|geradeaus|straight ahead
adverb|hier|here
adverb|dort|there
adverb|oben|upstairs / above
adverb|unten|downstairs / below
phrase|Wo ist der Bahnhof?|Where is the train station?
`);
add('city', 'A2', `
das|Rathaus|town hall
die|Bibliothek|library
das|Museum|museum
die|Brücke|bridge
die|Kreuzung|crossroads
die|Ampel|traffic lights
die|Ecke|corner
der|Eingang|entrance
der|Ausgang|exit
die|Fußgängerzone|pedestrian area
die|Umgebung|surroundings
der|Stadtplan|city map
die|Richtung|direction
der|Norden|north
der|Süden|south
der|Osten|east
der|Westen|west
adverb|gegenüber|opposite
adverb|nebenan|next door
adverb|draußen|outside
adverb|drinnen|inside
`);
add('transport', 'A1', `
das|Auto|car
der|Bus|bus
der|Zug|train
die|Bahn|railway / train
die|Straßenbahn|tram
die|U-Bahn|underground train
das|Fahrrad|bicycle
das|Taxi|taxi
der|Bahnhof|train station
die|Fahrkarte|ticket (transport)
das|Ticket|ticket
der|Flughafen|airport
das|Flugzeug|aeroplane
adjective|schnell|fast
adjective|langsam|slow
phrase|Ich fahre mit dem Bus.|I travel by bus.
phrase|Wann fährt der Zug ab?|When does the train leave?
phrase|zu Fuß|on foot
`);
add('transport', 'A2', `
der|Fahrplan|timetable
das|Gleis|railway track / platform number
der|Bahnsteig|train platform
die|Abfahrt|departure
die|Ankunft|arrival
die|Verspätung|delay
der|Anschluss|connection (transport)
die|Verbindung|connection
der|Verkehr|traffic
der|Stau|traffic jam
der|Unfall|accident
der|Führerschein|driving licence
die|Tankstelle|petrol station
der|Parkplatz|parking space
das|Motorrad|motorcycle
das|Schiff|ship
die|Fahrt|journey / ride
adjective|pünktlich|punctual
adjective|direkt|direct
phrase|Muss ich umsteigen?|Do I have to change trains?
phrase|Der Zug hat Verspätung.|The train is delayed.
`);
add('travel', 'A1', `
die|Reise|trip
der|Urlaub|holiday
die|Ferien|school holidays
das|Hotel|hotel
das|Zimmer|room
der|Pass|passport
der|Koffer|suitcase
das|Gepäck|luggage
die|Karte|card / map
das|Meer|sea
der|Strand|beach
adjective|frei|free / available
phrase|Ich habe eine Reservierung.|I have a reservation.
phrase|Ein Zimmer für zwei Nächte, bitte.|A room for two nights, please.
`);
add('travel', 'A2', `
die|Unterkunft|accommodation
das|Einzelzimmer|single room
das|Doppelzimmer|double room
die|Rezeption|reception (hotel)
die|Pension|guesthouse
die|Jugendherberge|youth hostel
der|Campingplatz|campsite
die|Übernachtung|overnight stay
die|Buchung|booking
der|Reiseführer|travel guide
die|Sehenswürdigkeit|sight / tourist attraction
die|Insel|island
die|Grenze|border
das|Visum|visa
die|Versicherung|insurance
der|Rucksack|rucksack
phrase|Ist das Frühstück inklusive?|Is breakfast included?
phrase|Wann muss ich auschecken?|When do I have to check out?
`);
add('work', 'A1', `
der|Beruf|profession
die|Arbeit|work
die|Firma|company
das|Büro|office
der|Chef|boss (male)
die|Chefin|boss (female)
der|Kollege|colleague (male)
die|Kollegin|colleague (female)
der|Mitarbeiter|employee (male)
der|Arzt|doctor (male)
die|Ärztin|doctor (female)
der|Lehrer|teacher (male)
die|Lehrerin|teacher (female)
der|Verkäufer|salesperson (male)
die|Verkäuferin|salesperson (female)
der|Fahrer|driver (male)
der|Koch|cook (male)
die|Köchin|cook (female)
der|Student|university student (male)
die|Studentin|university student (female)
die|Pause|break
adjective|arbeitslos|unemployed
phrase|Was sind Sie von Beruf?|What do you do for a living? (formal)
`);
add('work', 'A2', `
der|Arbeitsplatz|workplace
die|Stelle|job / position
die|Bewerbung|job application
der|Lebenslauf|CV / résumé
das|Vorstellungsgespräch|job interview
der|Vertrag|contract
das|Gehalt|salary
der|Lohn|wages
die|Arbeitszeit|working hours
die|Teilzeit|part-time work
die|Vollzeit|full-time work
die|Erfahrung|experience
das|Team|team
das|Projekt|project
die|Besprechung|meeting (work)
der|Termin|appointment
die|Fabrik|factory
die|Werkstatt|workshop / garage
der|Bäcker|baker (male)
die|Bäckerin|baker (female)
der|Friseur|hairdresser (male)
die|Friseurin|hairdresser (female)
der|Handwerker|tradesperson (male)
der|Mechaniker|mechanic (male)
der|Polizist|police officer (male)
die|Polizistin|police officer (female)
der|Rentner|pensioner (male)
die|Rentnerin|pensioner (female)
adjective|beruflich|professional / work-related
adjective|selbstständig|self-employed / independent
`);
add('education', 'A1', `
die|Schule|school
der|Schüler|school pupil (male)
die|Schülerin|school pupil (female)
der|Kurs|course
der|Deutschkurs|German course
der|Unterricht|lesson / instruction
die|Klasse|school class
das|Buch|book
das|Heft|exercise book
der|Stift|pen
der|Bleistift|pencil
das|Papier|paper
die|Tafel|board (classroom)
das|Wort|word
der|Satz|sentence
die|Frage|question
die|Antwort|answer
die|Aufgabe|task
das|Beispiel|example
die|Seite|page / side
die|Hausaufgabe|homework task
adjective|richtig|correct
adjective|falsch|wrong
adjective|einfach|easy / simple
adjective|schwer|difficult / heavy
phrase|Ich verstehe das nicht.|I do not understand that.
phrase|Können Sie das bitte wiederholen?|Could you repeat that, please? (formal)
phrase|Wie schreibt man das?|How do you spell that?
phrase|Was bedeutet das?|What does that mean?
`);
add('education', 'A2', `
die|Ausbildung|vocational training
die|Universität|university
das|Studium|university studies
die|Prüfung|exam
der|Test|test
die|Note|grade / mark
das|Zeugnis|school report / certificate
der|Abschluss|qualification / graduation
das|Wörterbuch|dictionary
die|Grammatik|grammar
die|Aussprache|pronunciation
die|Übung|exercise
der|Fehler|mistake
die|Lösung|solution
der|Text|text
das|Thema|topic
der|Teil|part
der|Punkt|point
die|Gruppe|group
das|Fach|school subject
die|Mathematik|mathematics
die|Geschichte|history / story
die|Biologie|biology
die|Klassenfahrt|school trip
der|Kindergarten|nursery / kindergarten
adjective|schriftlich|in writing / written
adjective|mündlich|oral / spoken
adjective|deutlich|clear / distinct
`);
add('health', 'A1', `
der|Körper|body
der|Kopf|head
das|Auge|eye
das|Ohr|ear
die|Nase|nose
der|Mund|mouth
der|Zahn|tooth
der|Hals|throat / neck
der|Arm|arm
die|Hand|hand
der|Finger|finger
der|Bauch|belly
der|Rücken|back (body)
das|Bein|leg
der|Fuß|foot
das|Haar|hair
der|Arzt|doctor (male)
die|Apotheke|pharmacy
das|Krankenhaus|hospital
der|Schmerz|pain
das|Fieber|fever
adjective|krank|ill
adjective|gesund|healthy
adjective|müde|tired
phrase|Gute Besserung!|Get well soon!
phrase|Ich habe Kopfschmerzen.|I have a headache.
`);
add('health', 'A2', `
die|Gesundheit|health
die|Krankheit|illness
die|Erkältung|cold (illness)
der|Husten|cough
der|Schnupfen|runny nose / head cold
die|Allergie|allergy
das|Medikament|medicine
die|Tablette|tablet / pill
das|Rezept|prescription
die|Praxis|doctor's practice
der|Patient|patient (male)
die|Patientin|patient (female)
die|Untersuchung|medical examination
die|Krankenkasse|health insurance provider
der|Notfall|emergency
die|Verletzung|injury
das|Blut|blood
die|Haut|skin
das|Herz|heart
das|Gewicht|weight
adjective|fit|fit / in good shape
adjective|schwach|weak
phrase|Mir ist schlecht.|I feel sick.
phrase|Mein Rücken tut weh.|My back hurts.
`);
add('leisure', 'A1', `
das|Hobby|hobby
die|Freizeit|free time
der|Sport|sport
die|Musik|music
der|Film|film
das|Kino|cinema
das|Spiel|game
der|Fußball|football
das|Schwimmbad|swimming pool
das|Foto|photo
das|Buch|book
der|Spaß|fun
das|Interesse|interest
adjective|interessant|interesting
adjective|langweilig|boring
phrase|Was machst du gern?|What do you like doing?
`);
add('leisure', 'A2', `
das|Theater|theatre
das|Konzert|concert
die|Ausstellung|exhibition
die|Kultur|culture
der|Künstler|artist (male)
die|Künstlerin|artist (female)
der|Sänger|singer (male)
die|Sängerin|singer (female)
der|Schauspieler|actor
die|Schauspielerin|actress
der|Autor|author (male)
die|Autorin|author (female)
der|Verein|association / club
der|Club|club
die|Mannschaft|sports team
das|Training|training
der|Wettbewerb|competition
der|Spaziergang|walk / stroll
der|Ausflug|day trip
das|Fahrrad|bicycle
die|Gitarre|guitar
das|Klavier|piano
adjective|spannend|exciting / gripping
adjective|beliebt|popular
`);
add('social', 'A1', `
der|Termin|appointment
die|Party|party
der|Geburtstag|birthday
das|Geschenk|gift
der|Besuch|visit
der|Freund|friend (male)
das|Wochenende|weekend
adjective|frei|free / available
phrase|Alles Gute zum Geburtstag!|Happy birthday!
phrase|Viel Glück!|Good luck!
phrase|Viel Spaß!|Have fun!
phrase|Hast du Zeit?|Do you have time?
phrase|Kommst du mit?|Are you coming along?
phrase|Bis morgen!|See you tomorrow!
`);
add('social', 'A2', `
die|Einladung|invitation
die|Feier|celebration
das|Fest|festival / celebration
die|Veranstaltung|event
die|Verabredung|social appointment
der|Kalender|calendar
der|Plan|plan
der|Wunsch|wish
die|Idee|idea
der|Vorschlag|suggestion
term|Weihnachten|Christmas
term|Ostern|Easter
term|Silvester|New Year's Eve
term|Neujahr|New Year's Day
phrase|Herzlichen Glückwunsch!|Congratulations!
phrase|Danke für die Einladung.|Thank you for the invitation.
phrase|Das passt mir gut.|That suits me well.
phrase|Leider kann ich nicht kommen.|Unfortunately I cannot come.
phrase|Wollen wir uns um acht treffen?|Shall we meet at eight?
`);
add('media', 'A1', `
das|Handy|mobile phone
das|Telefon|telephone
der|Computer|computer
das|Internet|internet
die|E-Mail|email
die|Nachricht|message / news
das|Radio|radio
der|Fernseher|television set
die|Zeitung|newspaper
das|Foto|photo
phrase|Wie ist deine Telefonnummer?|What is your phone number?
`);
add('media', 'A2', `
die|Webseite|web page
das|Programm|program
die|Datei|file (computer)
das|Passwort|password
der|Bildschirm|screen
die|Tastatur|keyboard
die|Maus|mouse (computer / animal)
der|Drucker|printer
der|Laptop|laptop
das|Netz|network
der|Akku|rechargeable battery
die|App|app
der|Anruf|phone call
die|Anzeige|advertisement
die|Werbung|advertising
die|Zeitschrift|magazine
der|Artikel|article
der|Bericht|report
die|Sendung|broadcast / programme
die|Information|information
das|Gespräch|conversation
der|Kontakt|contact
adjective|online|online
phrase|Kannst du mir eine Nachricht schicken?|Can you send me a message?
`);
add('nature', 'A1', `
das|Wetter|weather
die|Sonne|sun
der|Regen|rain
der|Schnee|snow
der|Wind|wind
der|Himmel|sky
die|Wolke|cloud
die|Blume|flower
der|Baum|tree
das|Tier|animal
der|Hund|dog
die|Katze|cat
der|Vogel|bird
der|Frühling|spring
der|Sommer|summer
der|Herbst|autumn
der|Winter|winter
adjective|warm|warm
adjective|kalt|cold
adjective|heiß|hot
adjective|sonnig|sunny
phrase|Es regnet.|It is raining.
phrase|Es schneit.|It is snowing.
`);
add('nature', 'A2', `
die|Natur|nature
die|Umwelt|environment
die|Welt|world
der|Wald|forest
der|Berg|mountain
der|See|lake
der|Fluss|river
die|Wiese|meadow
das|Feld|field
die|Pflanze|plant
das|Pferd|horse
die|Kuh|cow
das|Schwein|pig
das|Schaf|sheep
die|Temperatur|temperature
das|Gewitter|thunderstorm
der|Sturm|storm
der|Nebel|fog
das|Klima|climate
adjective|trocken|dry
adjective|nass|wet
adjective|windig|windy
adjective|bewölkt|cloudy
adjective|kühl|cool (temperature)
phrase|Wie wird das Wetter morgen?|What will the weather be like tomorrow?
`);
add('time', 'A1', `
die|Zeit|time
die|Uhr|clock / watch
die|Sekunde|second (time)
die|Minute|minute
die|Stunde|hour
der|Tag|day
die|Woche|week
der|Monat|month
das|Jahr|year
das|Datum|date
der|Montag|Monday
der|Dienstag|Tuesday
der|Mittwoch|Wednesday
der|Donnerstag|Thursday
der|Freitag|Friday
der|Samstag|Saturday
der|Sonntag|Sunday
das|Wochenende|weekend
der|Januar|January
der|Februar|February
der|März|March
der|April|April
der|Mai|May
der|Juni|June
der|Juli|July
der|August|August
der|September|September
der|Oktober|October
der|November|November
der|Dezember|December
der|Mittag|midday
der|Nachmittag|afternoon
adverb|heute|today
adverb|morgen|tomorrow
adverb|gestern|yesterday
adverb|jetzt|now
adverb|bald|soon
adverb|immer|always
adverb|oft|often
adverb|manchmal|sometimes
adverb|nie|never
phrase|Wie spät ist es?|What time is it?
phrase|Es ist halb drei.|It is half past two.
phrase|Viertel nach zwei|quarter past two
phrase|Viertel vor drei|quarter to three
phrase|um acht Uhr|at eight o'clock
`);
add('time', 'A2', `
der|Vormittag|late morning / before noon
der|Feiertag|public holiday
der|Alltag|everyday life
der|Anfang|beginning
das|Ende|end
die|Zukunft|future
die|Vergangenheit|past
adverb|übermorgen|the day after tomorrow
adverb|vorgestern|the day before yesterday
adverb|damals|back then
adverb|früher|formerly / in the past
adverb|später|later
adverb|vorher|beforehand
adverb|nachher|afterwards
adverb|gerade|right now / just
adverb|schon|already
adverb|noch|still
adverb|erst|only / not until
adverb|meistens|mostly / usually
adverb|selten|rarely
adverb|täglich|daily
adverb|wöchentlich|weekly
adverb|regelmäßig|regularly
phrase|nächste Woche|next week
phrase|letzten Monat|last month
phrase|seit zwei Jahren|for two years (since then)
`);
add('numbers', 'A1', `
die|Zahl|number
der|Euro|euro
der|Cent|cent
das|Kilo|kilo
der|Liter|litre
der|Meter|metre
term|null|zero
term|eins|one (counting)
term|zwei|two
term|drei|three
term|vier|four
term|fünf|five
term|sechs|six
term|sieben|seven
term|acht|eight
term|neun|nine
term|zehn|ten
term|elf|eleven
term|zwölf|twelve
term|dreizehn|thirteen
term|vierzehn|fourteen
term|fünfzehn|fifteen
term|sechzehn|sixteen
term|siebzehn|seventeen
term|achtzehn|eighteen
term|neunzehn|nineteen
term|zwanzig|twenty
term|einundzwanzig|twenty-one
term|dreißig|thirty
term|vierzig|forty
term|fünfzig|fifty
term|sechzig|sixty
term|siebzig|seventy
term|achtzig|eighty
term|neunzig|ninety
term|hundert|one hundred
term|tausend|one thousand
adverb|viel|a lot / much
adverb|wenig|little / not much
adverb|mehr|more
adverb|genug|enough
adverb|etwas|something / some
`);
add('numbers', 'A2', `
die|Million|million
das|Gramm|gram
das|Kilogramm|kilogram
der|Kilometer|kilometre
der|Zentimeter|centimetre
das|Prozent|percent
der|Grad|degree (temperature)
die|Hälfte|half (noun)
das|Viertel|quarter (noun)
die|Menge|amount / quantity
das|Stück|piece
die|Packung|packet
die|Dose|tin / can
term|erste|first (ordinal stem + e)
term|zweite|second (ordinal stem + e)
term|dritte|third (ordinal stem + e)
term|vierte|fourth (ordinal stem + e)
term|fünfte|fifth (ordinal stem + e)
term|sechste|sixth (ordinal stem + e)
term|siebte|seventh (ordinal stem + e)
term|achte|eighth (ordinal stem + e)
term|neunte|ninth (ordinal stem + e)
term|zehnte|tenth (ordinal stem + e)
adverb|ungefähr|approximately
adverb|mindestens|at least
adverb|fast|almost
`);
add('feelings', 'A1', `
adjective|gut|good
adjective|schlecht|bad
adjective|schön|beautiful / nice
adjective|nett|nice / kind
adjective|freundlich|friendly
adjective|glücklich|happy
adjective|traurig|sad
adjective|müde|tired
adjective|hungrig|hungry
adjective|durstig|thirsty
adjective|leicht|light / easy
adjective|schwer|difficult / heavy
adjective|laut|loud
adjective|leise|quiet (sound)
adjective|wichtig|important
adjective|richtig|correct
adjective|falsch|wrong
adverb|sehr|very
adverb|gern|gladly / with pleasure
adverb|lieber|preferably
phrase|Das gefällt mir.|I like that.
`);
add('feelings', 'A2', `
das|Gefühl|feeling
die|Angst|fear
die|Freude|joy
die|Liebe|love
die|Hoffnung|hope
die|Meinung|opinion
das|Problem|problem
die|Situation|situation
die|Sache|thing / matter
das|Leben|life
das|Ziel|goal
adjective|zufrieden|satisfied
adjective|nervös|nervous
adjective|aufgeregt|excited / agitated
adjective|überrascht|surprised
adjective|enttäuscht|disappointed
adjective|wütend|angry
adjective|einsam|lonely
adjective|ehrlich|honest
adjective|höflich|polite
adjective|unhöflich|impolite
adjective|lustig|funny
adjective|ernst|serious
adjective|stark|strong
adjective|schwach|weak
adjective|sicher|safe / certain
adjective|gefährlich|dangerous
adjective|möglich|possible
adjective|unmöglich|impossible
adjective|notwendig|necessary
adjective|bequem|comfortable
adjective|gleich|same / equal
adjective|anders|different
phrase|Ich bin anderer Meinung.|I have a different opinion.
`);
add('services', 'A1', `
die|Post|post office / post
der|Brief|letter
die|Briefmarke|postage stamp
das|Paket|parcel
die|Bank|bank
die|Polizei|police
die|Hilfe|help
das|Formular|form
der|Ausweis|identity card
phrase|Hilfe!|Help!
phrase|Können Sie mir helfen?|Can you help me? (formal)
`);
add('services', 'A2', `
das|Amt|government office
die|Behörde|public authority
das|Bürgeramt|citizens' registration office
die|Anmeldung|registration
der|Antrag|application (official request)
das|Dokument|document
die|Bescheinigung|official confirmation / certificate
der|Schalter|service counter / switch
die|Öffnungszeit|opening time
die|Unterschrift|signature
das|Konto|bank account
die|Kontonummer|account number
die|Überweisung|bank transfer
der|Geldautomat|cash machine
die|Reparatur|repair
der|Kundendienst|customer service
die|Feuerwehr|fire brigade
der|Krankenwagen|ambulance
der|Notruf|emergency call
der|Dieb|thief (male)
die|Fundsache|lost property item
phrase|Ich möchte ein Konto eröffnen.|I would like to open a bank account.
phrase|Rufen Sie bitte einen Krankenwagen!|Please call an ambulance!
`);
add('connections', 'A1', `
term|ich|I
term|du|you (informal singular, subject)
term|er|he
term|sie|she / they (subject)
term|es|it
term|wir|we
term|ihr|you (informal plural, subject)
term|Sie|you (formal, subject)
term|wer|who
term|was|what
term|wo|where (location)
term|woher|where from
term|wohin|where to
term|wann|when (question)
term|wie|how
term|warum|why
term|und|and
term|oder|or
term|aber|but
term|nicht|not
term|kein|no / not a (masculine nominative)
term|ja|yes
term|nein|no (answer)
term|auch|also / too
term|nur|only
term|bitte|please
term|mit|with
term|ohne|without
term|für|for
term|aus|from / out of
term|bei|at / with (a person)
term|nach|to (cities / most countries) / after
term|zu|to (a person / destination)
`);
add('connections', 'A2', `
term|mich|me (accusative)
term|dich|you (informal singular, accusative)
term|ihn|him (accusative)
term|uns|us (accusative / dative)
term|euch|you (informal plural, accusative / dative)
term|mir|me (dative)
term|dir|you (informal singular, dative)
term|ihm|him / it (dative)
term|ihnen|them (dative)
term|Ihnen|you (formal, dative)
term|man|one / people in general
term|jemand|someone
term|niemand|nobody
term|alles|everything
term|nichts|nothing
term|weil|because (subordinating)
term|denn|because (coordinating)
term|dass|that (conjunction)
term|wenn|if / whenever
term|deshalb|therefore
term|trotzdem|nevertheless
term|ob|whether
term|sondern|but rather
term|als|than (comparison)
term|seit|since / for (ongoing time)
term|bis|until / up to
term|gegen|against / around (time)
term|zwischen|between
term|über|above / about
term|unter|under
term|vor|in front of / before
term|hinter|behind
term|neben|next to
term|an|at / on (vertical contact)
term|auf|on (surface)
term|in|in / into
adverb|vielleicht|perhaps
adverb|leider|unfortunately
adverb|wirklich|really
adverb|natürlich|of course / naturally
adverb|besonders|especially
adverb|sogar|even
adverb|doch|yes (contradicting a negative question)
`);

// Existing verbs retain their original six forms and English cues.
const verbGroups = [
  ['introductions', 'A1', 'sein|haben|heißen|kommen|wohnen|leben|sprechen|sagen|fragen|antworten'],
  ['education', 'A1', 'lernen|lesen|schreiben|verstehen|hören|fragen|zeigen|erklären|wissen|kennen|brauchen'],
  ['education', 'A2', 'bestehen|bedeuten|beschreiben|nennen|berichten|diskutieren|versuchen|schaffen'],
  ['routine', 'A1', 'machen|gehen|schlafen|stehen|sitzen|liegen|stellen|legen|nehmen|geben|bringen|bleiben|öffnen|schließen|tun|lassen|bekommen|benutzen'],
  ['food', 'A1', 'essen|trinken|kaufen'],
  ['restaurant', 'A1', 'bestellen|zahlen|mögen|wollen'],
  ['shopping', 'A2', 'verkaufen|kosten|sparen|wählen|liefern|anbieten|passen'],
  ['clothes', 'A1', 'tragen'],
  ['transport', 'A1', 'fahren|laufen|warten'],
  ['travel', 'A2', 'erreichen|suchen|finden|sich informieren|planen|empfehlen|bestätigen'],
  ['work', 'A1', 'arbeiten|beginnen|können|müssen|sollen|dürfen'],
  ['work', 'A2', 'herstellen|bauen|ändern|fehlen|erlauben'],
  ['family', 'A1', 'lieben|besuchen|treffen|helfen'],
  ['family', 'A2', 'gehören|erzählen|sich erinnern|sich freuen|vorstellen|wünschen|teilen'],
  ['feelings', 'A2', 'denken|glauben|meinen|hoffen|sich fühlen|vergessen'],
  ['leisure', 'A1', 'spielen|sehen'],
  ['leisure', 'A2', 'gewinnen|verlieren|sammeln'],
  ['social', 'A1', 'feiern'],
  ['social', 'A2', 'stattfinden|bitten|rufen'],
  ['nature', 'A2', 'scheinen|fallen|werden'],
  ['health', 'A2', 'sich setzen|halten|passieren']
];

// Explicit present-indicative forms, including detachable prefixes and reflexives.
// Infinitive|English|six German forms|six matching English cues are generated from an authored English predicate.
const extraVerbs = [];
const verbs = (topic, level, rows) => {
  for (const row of rows.trim().split('\n')) {
    const [infinitive, english, forms, predicate, third] = row.split('|');
    extraVerbs.push({ topic, level, infinitive, english: `to ${english}`, forms: forms.split(','),
      englishForms: ['I', 'You', 'He', 'We', 'You', 'They'].map((subject, index) => `${subject} ${index === 2 ? third : predicate}`) });
  }
};
verbs('routine', 'A1', `
aufstehen|get up|stehe auf,stehst auf,steht auf,stehen auf,steht auf,stehen auf|get up|gets up
aufwachen|wake up|wache auf,wachst auf,wacht auf,wachen auf,wacht auf,wachen auf|wake up|wakes up
duschen|shower|dusche,duschst,duscht,duschen,duscht,duschen|shower|showers
frühstücken|have breakfast|frühstücke,frühstückst,frühstückt,frühstücken,frühstückt,frühstücken|have breakfast|has breakfast
einkaufen|shop for groceries|kaufe ein,kaufst ein,kauft ein,kaufen ein,kauft ein,kaufen ein|shop for groceries|shops for groceries
aufräumen|tidy up|räume auf,räumst auf,räumt auf,räumen auf,räumt auf,räumen auf|tidy up|tidies up
putzen|clean|putze,putzt,putzt,putzen,putzt,putzen|clean|cleans
waschen|wash|wasche,wäschst,wäscht,waschen,wascht,waschen|wash|washes
`);
verbs('routine', 'A2', `
abwaschen|wash the dishes|wasche ab,wäschst ab,wäscht ab,waschen ab,wascht ab,waschen ab|wash the dishes|washes the dishes
einschlafen|fall asleep|schlafe ein,schläfst ein,schläft ein,schlafen ein,schlaft ein,schlafen ein|fall asleep|falls asleep
anmachen|switch on|mache an,machst an,macht an,machen an,macht an,machen an|switch it on|switches it on
ausmachen|switch off|mache aus,machst aus,macht aus,machen aus,macht aus,machen aus|switch it off|switches it off
sich anziehen|get dressed|ziehe mich an,ziehst dich an,zieht sich an,ziehen uns an,zieht euch an,ziehen sich an|get dressed|gets dressed
sich ausziehen|get undressed|ziehe mich aus,ziehst dich aus,zieht sich aus,ziehen uns aus,zieht euch aus,ziehen sich aus|get undressed|gets undressed
sich beeilen|hurry|beeile mich,beeilst dich,beeilt sich,beeilen uns,beeilt euch,beeilen sich|hurry|hurries
`);
verbs('food', 'A1', `
kochen|cook|koche,kochst,kocht,kochen,kocht,kochen|cook|cooks
`);
verbs('food', 'A2', `
backen|bake|backe,backst,backt,backen,backt,backen|bake|bakes
schneiden|cut|schneide,schneidest,schneidet,schneiden,schneidet,schneiden|cut the bread|cuts the bread
braten|fry / roast|brate,brätst,brät,braten,bratet,braten|fry vegetables|fries vegetables
probieren|try / taste|probiere,probierst,probiert,probieren,probiert,probieren|try the soup|tries the soup
`);
verbs('shopping', 'A1', `
bezahlen|pay|bezahle,bezahlst,bezahlt,bezahlen,bezahlt,bezahlen|pay|pays
`);
verbs('shopping', 'A2', `
umtauschen|exchange goods|tausche um,tauschst um,tauscht um,tauschen um,tauscht um,tauschen um|exchange the shirt|exchanges the shirt
anprobieren|try on|probiere an,probierst an,probiert an,probieren an,probiert an,probieren an|try on the coat|tries on the coat
`);
verbs('transport', 'A1', `
einsteigen|get in / board|steige ein,steigst ein,steigt ein,steigen ein,steigt ein,steigen ein|board the train|boards the train
aussteigen|get out / alight|steige aus,steigst aus,steigt aus,steigen aus,steigt aus,steigen aus|get out|gets out
`);
verbs('transport', 'A2', `
umsteigen|change trains|steige um,steigst um,steigt um,steigen um,steigt um,steigen um|change trains|changes trains
abfahren|depart|fahre ab,fährst ab,fährt ab,fahren ab,fahrt ab,fahren ab|depart|departs
ankommen|arrive|komme an,kommst an,kommt an,kommen an,kommt an,kommen an|arrive|arrives
abholen|pick up / collect|hole ab,holst ab,holt ab,holen ab,holt ab,holen ab|pick up the parcel|picks up the parcel
parken|park|parke,parkst,parkt,parken,parkt,parken|park the car|parks the car
`);
verbs('travel', 'A1', `
reisen|travel|reise,reist,reist,reisen,reist,reisen|travel|travels
`);
verbs('travel', 'A2', `
buchen|book|buche,buchst,bucht,buchen,bucht,buchen|book a room|books a room
reservieren|reserve|reserviere,reservierst,reserviert,reservieren,reserviert,reservieren|reserve a table|reserves a table
übernachten|stay overnight|übernachte,übernachtest,übernachtet,übernachten,übernachtet,übernachten|stay overnight|stays overnight
mitnehmen|take along|nehme mit,nimmst mit,nimmt mit,nehmen mit,nehmt mit,nehmen mit|take a bag along|takes a bag along
einpacken|pack|packe ein,packst ein,packt ein,packen ein,packt ein,packen ein|pack a suitcase|packs a suitcase
`);
verbs('education', 'A1', `
antworten|answer|antworte,antwortest,antwortet,antworten,antwortet,antworten|answer|answers
buchstabieren|spell|buchstabiere,buchstabierst,buchstabiert,buchstabieren,buchstabiert,buchstabieren|spell the name|spells the name
wiederholen|repeat|wiederhole,wiederholst,wiederholt,wiederholen,wiederholt,wiederholen|repeat|repeats
`);
verbs('education', 'A2', `
üben|practise|übe,übst,übt,üben,übt,üben|practise|practises
studieren|study at university|studiere,studierst,studiert,studieren,studiert,studieren|study at university|studies at university
markieren|mark / highlight|markiere,markierst,markiert,markieren,markiert,markieren|mark the answer|marks the answer
ankreuzen|tick / mark with a cross|kreuze an,kreuzt an,kreuzt an,kreuzen an,kreuzt an,kreuzen an|tick the box|ticks the box
`);
verbs('work', 'A2', `
verdienen|earn|verdiene,verdienst,verdient,verdienen,verdient,verdienen|earn money|earns money
sich bewerben|apply for a job|bewerbe mich,bewirbst dich,bewirbt sich,bewerben uns,bewerbt euch,bewerben sich|apply for a job|applies for a job
unterschreiben|sign|unterschreibe,unterschreibst,unterschreibt,unterschreiben,unterschreibt,unterschreiben|sign the form|signs the form
anfangen|start|fange an,fängst an,fängt an,fangen an,fangt an,fangen an|start work|starts work
aufhören|stop|höre auf,hörst auf,hört auf,hören auf,hört auf,hören auf|stop working|stops working
`);
verbs('home', 'A2', `
umziehen|move house|ziehe um,ziehst um,zieht um,ziehen um,zieht um,ziehen um|move house|moves house
mieten|rent|miete,mietest,mietet,mieten,mietet,mieten|rent a flat|rents a flat
reparieren|repair|repariere,reparierst,repariert,reparieren,repariert,reparieren|repair the chair|repairs the chair
hängen|hang (be suspended)|hänge,hängst,hängt,hängen,hängt,hängen|hang from a rope|hangs from a rope
`);
verbs('leisure', 'A1', `
schwimmen|swim|schwimme,schwimmst,schwimmt,schwimmen,schwimmt,schwimmen|swim|swims
tanzen|dance|tanze,tanzt,tanzt,tanzen,tanzt,tanzen|dance|dances
singen|sing|singe,singst,singt,singen,singt,singen|sing|sings
`);
verbs('leisure', 'A2', `
wandern|hike|wandere,wanderst,wandert,wandern,wandert,wandern|hike|hikes
spazieren gehen|go for a walk|gehe spazieren,gehst spazieren,geht spazieren,gehen spazieren,geht spazieren,gehen spazieren|go for a walk|goes for a walk
fernsehen|watch television|sehe fern,siehst fern,sieht fern,sehen fern,seht fern,sehen fern|watch television|watches television
trainieren|train / exercise|trainiere,trainierst,trainiert,trainieren,trainiert,trainieren|train|trains
zeichnen|draw|zeichne,zeichnest,zeichnet,zeichnen,zeichnet,zeichnen|draw|draws
`);
verbs('social', 'A2', `
einladen|invite|lade ein,lädst ein,lädt ein,laden ein,ladet ein,laden ein|invite friends|invites friends
mitkommen|come along|komme mit,kommst mit,kommt mit,kommen mit,kommt mit,kommen mit|come along|comes along
absagen|cancel|sage ab,sagst ab,sagt ab,sagen ab,sagt ab,sagen ab|cancel the appointment|cancels the appointment
vereinbaren|arrange|vereinbare,vereinbarst,vereinbart,vereinbaren,vereinbart,vereinbaren|arrange an appointment|arranges an appointment
gratulieren|congratulate|gratuliere,gratulierst,gratuliert,gratulieren,gratuliert,gratulieren|congratulate Alex|congratulates Alex
`);
verbs('media', 'A1', `
telefonieren|make a phone call|telefoniere,telefonierst,telefoniert,telefonieren,telefoniert,telefonieren|make a phone call|makes a phone call
`);
verbs('media', 'A2', `
anrufen|call on the phone|rufe an,rufst an,ruft an,rufen an,ruft an,rufen an|call Alex|calls Alex
schicken|send|schicke,schickst,schickt,schicken,schickt,schicken|send a message|sends a message
senden|send / broadcast|sende,sendest,sendet,senden,sendet,senden|send an email|sends an email
speichern|save a file|speichere,speicherst,speichert,speichern,speichert,speichern|save a file|saves a file
drucken|print|drucke,druckst,druckt,drucken,druckt,drucken|print a page|prints a page
herunterladen|download|lade herunter,lädst herunter,lädt herunter,laden herunter,ladet herunter,laden herunter|download a file|downloads a file
`);
verbs('health', 'A2', `
sich waschen|wash oneself|wasche mich,wäschst dich,wäscht sich,waschen uns,wascht euch,waschen sich|wash myself / yourself / ourselves|washes himself
sich erholen|recover / relax|erhole mich,erholst dich,erholt sich,erholen uns,erholt euch,erholen sich|recover|recovers
rauchen|smoke|rauche,rauchst,raucht,rauchen,raucht,rauchen|smoke|smokes
untersuchen|examine|untersuche,untersuchst,untersucht,untersuchen,untersucht,untersuchen|examine a patient|examines a patient
`);
verbs('services', 'A2', `
ausfüllen|fill in a form|fülle aus,füllst aus,füllt aus,füllen aus,füllt aus,füllen aus|fill in a form|fills in a form
sich anmelden|register|melde mich an,meldest dich an,meldet sich an,melden uns an,meldet euch an,melden sich an|register|registers
abgeben|hand in|gebe ab,gibst ab,gibt ab,geben ab,gebt ab,geben ab|hand in the form|hands in the form
`);

const slug = value => value.normalize('NFC').toLocaleLowerCase('de').replace(/[^a-zäöüß0-9]+/gu, '-').replace(/^-|-$/g, '');
const keyOf = word => word.noun ? `noun:${word.noun}` : word.infinitive ? `verb:${word.infinitive}` : `${word.kind}:${word.german}`;

export function buildVocabulary(originals) {
  const byKey = new Map(originals.map(word => [keyOf(word), { ...word, topics: [], level: 'A2' }]));
  const merge = (candidate, topic, level) => {
    const key = keyOf(candidate);
    const word = byKey.get(key) ?? candidate;
    word.topics ??= [];
    if (!word.topics.includes(topic)) word.topics.push(topic);
    if (level === 'A1' || !word.level) word.level = level;
    byKey.set(key, word);
  };
  for (const { topic, level, rows } of sections) {
    for (const [kind, german, english] of rows) {
      const noun = ['der', 'die', 'das'].includes(kind);
      merge(noun ? { id: `curr-noun-${slug(german)}`, noun: german, article: kind, english: `the ${english}` }
        : { id: `curr-${kind}-${slug(german)}${german === 'Sie' || german === 'Ihnen' ? '-formal' : ''}`, kind, german, english }, topic, level);
    }
  }
  for (const [topic, level, infinitives] of verbGroups) {
    for (const infinitive of infinitives.split('|')) {
      const word = byKey.get(`verb:${infinitive}`);
      if (word) merge(word, topic, level);
    }
  }
  for (const { topic, level, ...verb } of extraVerbs) merge({ ...verb, kind: 'verb', id: `curr-verb-${slug(verb.infinitive)}` }, topic, level);
  // Rezept is deliberately two different senses in two different contexts.
  const recipe = byKey.get('noun:Rezept');
  recipe.english = 'the recipe / the prescription';
  const wash = byKey.get('verb:sich waschen');
  wash.englishForms = ['I wash myself', 'You wash yourself', 'He washes himself', 'We wash ourselves', 'You wash yourselves', 'They wash themselves'];
  for (const word of byKey.values()) {
    if (!word.topics.length) throw new Error(`Missing teaching topic: ${keyOf(word)}`);
    if (word.kind === 'term' && ['sie', 'Sie', 'ihnen', 'Ihnen'].includes(word.german)) word.caseSensitive = true;
  }
  return [...byKey.values()];
}
