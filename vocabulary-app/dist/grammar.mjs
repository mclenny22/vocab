// App-authored sentences and explanations; topics follow the VHS A1/A2 outlines.
export const grammarWords = [];
function add(topic, level, rows) {
  rows.trim().split('\n').forEach((row, index) => {
    const [prompt, answer, wrong1, wrong2, english, explanation] = row.split('|');
    grammarWords.push({ id: `grammar-${topic}-${level}-${index}`, kind: 'grammar', topic, level,
      prompt, answer, options: [answer, wrong1, wrong2], english, explanation });
  });
}
add('articles', 'A1', `
___ Tisch ist neu.|Der|Die|Das|The table is new.|Tisch is masculine: der Tisch.
___ Wohnung ist klein.|Die|Der|Das|The apartment is small.|Wohnung is feminine: die Wohnung.
___ Kind spielt.|Das|Der|Die|The child is playing.|Kind is neuter: das Kind.
Das ist ___ Lampe.|eine|ein|einen|That is a lamp.|Lampe is feminine nominative: eine Lampe.
Ich kaufe ___ Apfel.|einen|ein|einem|I am buying an apple.|Apfel is masculine accusative: einen Apfel.
Hier sind zwei ___. (das Buch)|Bücher|Buchen|Buchs|Here are two books.|The plural of Buch is Bücher, with an umlaut and -er.
Hier stehen drei ___. (der Stuhl)|Stühle|Stuhlen|Stuhls|There are three chairs here.|The plural of Stuhl is Stühle, with an umlaut and -e.
Die ___ sind offen. (das Fenster)|Fenster|Fenstern|Fensters|The windows are open.|Fenster has no change in the nominative plural.
`);
add('articles', 'A2', `
Ich brauche zwei ___. (der Termin)|Termine|Terminen|Termins|I need two appointments.|The accusative plural of Termin is Termine.
Die ___ kommen heute. (der Zug)|Züge|Zugen|Zugs|The trains are coming today.|The plural of Zug is Züge.
Die ___ sind lang. (die Nacht)|Nächte|Nachten|Nachts|The nights are long.|The plural of Nacht is Nächte.
Die ___ schlafen. (das Kind)|Kinder|Kindern|Kinds|The children are sleeping.|The nominative plural of Kind is Kinder.
Ich spreche mit den ___. (das Kind)|Kindern|Kinder|Kindes|I am speaking with the children.|Dative plural usually adds -n: mit den Kindern.
Ich habe zwei ___. (das Auto)|Autos|Auten|Autoen|I have two cars.|The plural of Auto is Autos; dative plural also keeps Autos.
`);
add('relatives', 'A2', `
Das ist der Mann, ___ hier wohnt.|der|den|dem|That is the man who lives here.|The relative pronoun is masculine nominative because it is the subject of wohnt.
Das ist die Frau, ___ ich kenne.|die|der|den|That is the woman whom I know.|The relative pronoun is feminine accusative because kennen takes an object.
Das ist das Kind, ___ im Garten spielt.|das|dem|den|That is the child who is playing in the garden.|The relative pronoun is neuter nominative because it is the subject of spielt.
Das ist der Nachbar, ___ ich helfe.|dem|den|der|That is the neighbour whom I help.|Helfen takes dative, so the masculine relative pronoun is dem.
Weißt du, wo der Bahnhof ___?|ist|sein|bist|Do you know where the station is?|In an indirect question, the finite verb goes to the end.
Kannst du mir sagen, wann der Kurs ___?|beginnt|beginnen|beginnst|Can you tell me when the course starts?|The embedded question ends with beginnt, matching der Kurs.
Ich weiß nicht, ___ er heute kommt.|ob|wenn|weil|I do not know whether he is coming today.|An indirect yes/no question uses ob.
Das ist der Film, ___ wir gestern gesehen haben.|den|der|dem|That is the film which we saw yesterday.|Film is masculine and the object of gesehen: den.
`);
add('pronouns', 'A1', `
Alex und ich lernen Deutsch. ___ lernen zusammen.|Wir|Ihr|Sie|Alex and I study German. We study together.|Alex und ich is first-person plural: wir.
Woher kommst ___?|du|ich|er|Where do you come from? (informal)|Kommst is the du form.
Das ist Maria. ___ wohnt in Berlin.|Sie|Er|Es|This is Maria. She lives in Berlin.|Maria is replaced by sie (she).
Das ist mein Buch. ___ ist neu.|Es|Er|Sie|This is my book. It is new.|Buch is neuter: es.
Alex und Sam, lernt ___ Deutsch?|ihr|wir|du|Alex and Sam, are you learning German?|Addressing several people informally uses ihr.
Frau Müller, kommen ___ aus Köln?|Sie|du|ihr|Ms Müller, do you come from Cologne?|Formal you is capitalized Sie and takes kommen.
`);
add('pronouns', 'A2', `
Ich sehe den Mann. Ich sehe ___.|ihn|ihm|er|I see the man. I see him.|Sehen takes an accusative object: ihn.
Kannst du ___ helfen? Ich verstehe das nicht.|mir|mich|ich|Can you help me? I do not understand this.|Helfen takes dative: mir.
Ich gebe dem Kind das Buch. Ich gebe ___ das Buch.|ihm|ihn|es|I give the child the book. I give it the book.|The recipient is dative. Das Kind becomes ihm.
Wir besuchen euch. Besucht ihr ___ auch?|uns|wir|unser|We visit you. Do you visit us too?|The accusative object for wir is uns.
Guten Tag, Frau Koch. Wie geht es ___?|Ihnen|ihnen|Sie|Hello, Ms Koch. How are you? (formal)|Wie geht es takes dative. Formal Ihnen is capitalized.
Die Kinder spielen. Ich gebe ___ einen Ball.|ihnen|sie|ihr|The children are playing. I give them a ball.|The plural dative recipient is ihnen.
`);
add('questions', 'A1', `
___ heißt du?|Wie|Wo|Wann|What is your name? (informal)|German asks Wie heißt du? Literally: How are you called?
___ wohnst du?|Wo|Wohin|Woher|Where do you live?|Wo asks for a location.
___ kommst du? – Aus Italien.|Woher|Wo|Wohin|Where do you come from? From Italy.|Woher asks about origin.
___ fährt der Zug? – Um neun.|Wann|Wer|Was|When does the train leave? At nine.|Wann asks about time.
Ich habe ___ Auto.|kein|nicht|keine|I do not have a car.|Use kein before an indefinite noun. Auto is neuter accusative.
Ich komme heute ___.|nicht|kein|keine|I am not coming today.|Nicht negates the statement; there is no noun requiring kein.
Das ist ___ Tasche.|keine|kein|nicht|That is not a bag.|Tasche is feminine nominative: keine.
___ kostet das Brot? – Zwei Euro.|Wie viel|Wie alt|Wie lange|How much does the bread cost? Two euros.|Wie viel asks about a price or amount.
`);
add('questions', 'A2', `
___ fährst du? – Nach Hamburg.|Wohin|Woher|Wo|Where are you going? To Hamburg.|Wohin asks about a destination.
___ lernst du Deutsch? – Weil ich hier arbeite.|Warum|Wer|Woher|Why are you learning German? Because I work here.|Warum asks for a reason.
Ich habe ___ Hund.|keinen|kein|keinem|I do not have a dog.|Hund is masculine and haben takes accusative: keinen.
Hast du keine Zeit? – ___, ich habe Zeit.|Doch|Nein|Nicht|Do you have no time? Yes, I do have time.|Doch contradicts a negative question.
___ dauert der Kurs? – Drei Monate.|Wie lange|Wie oft|Wie viele|How long does the course last? Three months.|Wie lange asks about duration.
___ besuchst du? – Meinen Bruder.|Wen|Wer|Wem|Whom are you visiting? My brother.|Besuchen takes accusative, so ask wen.
`);
add('prepositions', 'A1', `
Ich fahre ___ dem Bus.|mit|für|ohne|I travel by bus.|Mit takes dative: mit dem Bus.
Der Kurs beginnt ___ neun Uhr.|um|am|im|The course starts at nine o'clock.|Clock times use um.
Wir treffen uns ___ Montag.|am|um|im|We meet on Monday.|Days use am.
Mein Geburtstag ist ___ Mai.|im|am|um|My birthday is in May.|Months use im.
Ich komme ___ Spanien.|aus|zu|bei|I come from Spain.|Origin from a country uses aus.
Ich fahre ___ Berlin.|nach|zu|bei|I am travelling to Berlin.|Cities without an article use nach for destinations.
Das Geschenk ist ___ dich.|für|mit|bei|The gift is for you.|Für takes accusative: für dich.
Ich wohne ___ meinen Eltern.|bei|für|ohne|I live with my parents.|Bei takes dative and describes being at someone's home.
`);
add('prepositions', 'A2', `
Das Buch liegt auf ___ Tisch.|dem|den|der|The book is lying on the table.|Location with auf takes dative: auf dem Tisch.
Ich lege das Buch auf ___ Tisch.|den|dem|der|I put the book on the table.|A destination with auf takes accusative: auf den Tisch.
Wir gehen in ___ Park.|den|dem|der|We are going into the park.|Movement into a destination uses accusative: in den Park.
Wir sitzen in ___ Park.|dem|den|das|We are sitting in the park.|A location uses dative: in dem Park.
Ich lerne ___ einem Jahr Deutsch.|seit|vor|um|I have been learning German for one year.|Seit with present tense describes an ongoing period and takes dative.
___ zwei Jahren war ich in Rom.|Vor|Seit|Für|Two years ago I was in Rome.|Vor with dative means ago in this time expression.
Ich warte ___ den Bus.|auf|mit|aus|I am waiting for the bus.|Warten auf takes an accusative object.
Das Bild hängt ___ der Wand.|an|nach|zu|The picture hangs on the wall.|An describes contact with a vertical surface; location takes dative.
`);
add('modals', 'A1', `
Ich ___ heute arbeiten. Es ist Pflicht.|muss|darf|mag|I must work today. It is compulsory.|Müssen expresses obligation. Ich takes muss.
Hier ___ man nicht rauchen. Es ist verboten.|darf|muss|will|You may not smoke here. It is prohibited.|Nicht dürfen expresses prohibition.
Ich ___ gut schwimmen.|kann|könnt|können|I can swim well.|Können expresses ability. Ich takes kann.
Du ___ mehr Wasser trinken, sagt der Arzt.|sollst|sollen|soll|The doctor says you should drink more water.|Du takes sollst. Sollen reports advice or instructions.
Wir ___ heute ins Kino gehen.|wollen|will|wollt|We want to go to the cinema today.|Wir takes wollen. The second verb stays in the infinitive.
Ich stehe jeden Tag um sieben ___.|auf|an|ein|I get up at seven every day.|Aufstehen separates: ich stehe ... auf.
`);
add('modals', 'A2', `
Ich rufe dich morgen ___.|an|auf|aus|I will call you tomorrow.|Anrufen separates: ich rufe ... an.
Wann ___ der Film an?|fängt|fängst|fangen|When does the film start?|Anfangen changes a to ä in third-person singular: fängt an.
Du musst heute nicht ___.|arbeiten|arbeitest|gearbeitet|You do not have to work today.|After a modal verb, the other verb is an infinitive at the end.
Ich möchte dich ___.|einladen|lade ein|eingeladen|I would like to invite you.|The separable verb stays joined in the infinitive after möchte.
Er ___ hier nicht parken. Es ist verboten.|darf|muss|kannst|He may not park here. It is forbidden.|Er takes darf. Nicht dürfen expresses prohibition.
Wir müssen morgen früh ___.|aufstehen|stehen auf|aufgestanden|We must get up early tomorrow.|After müssen, aufstehen remains a joined infinitive.
`);
add('perfect', 'A1', `
Ich ___ gestern Deutsch gelernt.|habe|bin|ist|I studied German yesterday.|Lernen forms the Perfekt with haben.
Wir haben Pizza ___.|gegessen|geessen|essen|We ate pizza.|The participle of essen is gegessen.
Er ist nach Hause ___.|gegangen|gegeht|gehen|He went home.|Gehen forms the Perfekt with sein; its participle is gegangen.
Sie ___ gestern nach Berlin gefahren.|ist|hat|haben|She travelled to Berlin yesterday.|Fahren with a change of location takes sein.
Hast du den Film ___?|gesehen|geseht|sehen|Have you seen the film?|The participle of sehen is gesehen.
Ich habe lange ___.|geschlafen|geschlaft|schlafen|I slept for a long time.|The participle of schlafen is geschlafen.
`);
add('perfect', 'A2', `
Wir haben im Supermarkt ___.|eingekauft|geeinkauft|einkaufen|We shopped at the supermarket.|Separable participles place ge between prefix and stem: eingekauft.
Ich bin um sieben ___.|aufgestanden|geaufstanden|aufgesteht|I got up at seven.|Aufstehen takes sein and the participle aufgestanden.
Sie hat ihre Freundin ___.|besucht|gebesucht|besuchen|She visited her friend.|An inseparable be- prefix does not add ge-: besucht.
Wir haben gestern ___.|telefoniert|getelefoniert|telefonieren|We spoke on the phone yesterday.|Verbs ending in -ieren have no ge- in the participle.
Er hat die Tür ___.|geöffnet|geöffnen|öffnen|He opened the door.|Öffnen takes haben; its participle is geöffnet.
Ich habe meinen Schlüssel ___.|verloren|geverloren|verlieren|I lost my key.|The participle of verlieren is verloren, without ge-.
Der Zug ist pünktlich ___.|angekommen|geankommen|ankommen|The train arrived on time.|Ankommen takes sein and the participle angekommen.
Hast du die Hausaufgaben ___?|gemacht|gemachen|machen|Have you done the homework?|Machen is regular: ge + mach + t.
`);
add('past', 'A1', `
Gestern ___ ich krank.|war|waren|wart|I was ill yesterday.|Ich takes war in the Präteritum of sein.
Wir ___ letzte Woche in Hamburg.|waren|war|wart|We were in Hamburg last week.|Wir takes waren in the Präteritum of sein.
Ich ___ gestern keine Zeit.|hatte|hatten|hattet|I had no time yesterday.|Ich takes hatte in the Präteritum of haben.
___ du gestern zu Hause?|Warst|Wart|Waren|Were you at home yesterday? (informal singular)|Du takes warst in the Präteritum of sein.
`);
add('past', 'A2', `
Als Kind ___ ich nicht schwimmen.|konnte|könnte|können|As a child I could not swim.|Past ability uses konnte. Könnte is a different mood.
Wir ___ gestern lange arbeiten.|mussten|müssen|müssten|We had to work late yesterday.|The Präteritum of müssen loses the umlaut: mussten.
Er ___ Arzt werden.|wollte|will|wollten|He wanted to become a doctor.|Er takes wollte in the Präteritum of wollen.
Du ___ früher hier nicht parken.|durftest|darfst|dürftest|You were not allowed to park here before.|Past permission uses durftest, without an umlaut.
Ihr ___ gestern einen Termin.|hattet|hatten|hatte|You had an appointment yesterday. (plural)|Ihr takes hattet in the Präteritum of haben.
Sie ___ ihre Mutter anrufen, hat der Vater gesagt.|sollte|sollten|sollen|She was supposed to call her mother, her father said.|Reported past obligation with sie (she) uses sollte.
`);
add('comparisons', 'A1', `
Mein Bruder ist ___ als ich.|älter|alt|am ältesten|My brother is older than me.|Alt has the irregular comparative älter; als introduces the comparison.
Dieses Auto ist ___ als das andere.|billiger|billig|am billigsten|This car is cheaper than the other one.|The comparative adds -er: billiger.
Ich trinke ___ Tee als Kaffee.|lieber|gern|am liebsten|I prefer tea to coffee.|Gern has the comparative lieber.
Der Bus ist so schnell ___ die Bahn.|wie|als|denn|The bus is as fast as the train.|Equality uses so ... wie.
`);
add('comparisons', 'A2', `
Dieses Buch gefällt mir am ___.|besten|besser|gut|I like this book best.|Gut becomes besser, am besten.
Im Sommer ist es ___ als im Winter.|wärmer|warm|am wärmsten|It is warmer in summer than in winter.|Warm adds an umlaut and -er: wärmer.
Alex läuft am ___.|schnellsten|schneller|schnell|Alex runs fastest.|The adverbial superlative uses am ... -sten.
Ich habe ___ Zeit als gestern.|mehr|viel|am meisten|I have more time than yesterday.|Viel has the irregular comparative mehr.
Der Zug fährt ___ als der Bus.|schneller|schnellsten|schnell|The train travels faster than the bus.|A comparison with als uses the comparative schneller.
Dieses Zimmer ist ___ als unseres.|größer|groß|am größten|This room is bigger than ours.|Groß has the comparative größer.
`);
add('adjectives', 'A1', `
Das Haus ist ___.|groß|große|großen|The house is big.|A predicate adjective after sein has no ending.
Die Kinder sind ___.|müde|müden|müdes|The children are tired.|Predicate adjectives do not change for plural subjects.
`);
add('adjectives', 'A2', `
Der ___ Mann wohnt hier.|alte|alten|alter|The old man lives here.|After der in masculine nominative, the adjective takes -e.
Ich sehe den ___ Mann.|alten|alte|alter|I see the old man.|After den in masculine accusative, the adjective takes -en.
Das ist ein ___ Hund.|kleiner|kleine|kleinen|That is a small dog.|Ein does not show masculine nominative gender, so the adjective takes -er.
Ich kaufe ein ___ Buch.|neues|neue|neuen|I am buying a new book.|Neuter accusative after ein requires the adjective ending -es.
Sie trägt eine ___ Jacke.|rote|roten|roter|She is wearing a red jacket.|After eine in feminine accusative, the adjective takes -e.
Die ___ Schuhe sind teuer.|neuen|neue|neues|The new shoes are expensive.|After the plural definite article die, the adjective takes -en.
Ich trinke ___ Kaffee.|heißen|heißer|heißes|I am drinking hot coffee.|Without an article, masculine accusative has the strong ending -en.
Wir helfen dem ___ Nachbarn.|netten|nette|netter|We help the nice neighbour.|After dem in dative, the adjective takes -en.
`);
add('word-order', 'A1', `
Heute ___ ich Deutsch.|lerne|lernen|lernst|Today I am studying German.|The conjugated verb stays in second position, after Heute.
Am Montag ___ wir ins Kino.|gehen|geht|gehst|On Monday we are going to the cinema.|A time phrase can come first; the finite verb still comes second.
___ du aus Berlin?|Kommst|Kommen|Kommt|Do you come from Berlin?|A yes/no question starts with the finite verb; du takes kommst.
Ich ___ heute nicht kommen.|kann|können|kannst|I cannot come today.|The modal takes second position; the infinitive kommen goes at the end.
`);
add('word-order', 'A2', `
Ich bleibe zu Hause, weil ich krank ___.|bin|sein|bist|I am staying home because I am ill.|Weil sends the finite verb to the end of its clause.
Ich glaube, dass er morgen ___.|kommt|kommen|kommst|I think that he is coming tomorrow.|Dass sends the conjugated verb to the end; er takes kommt.
Wenn es regnet, ___ wir zu Hause.|bleiben|bleibt|bleibe|If it rains, we stay at home.|The whole wenn clause fills position one; bleiben comes next.
Ich bin müde. Deshalb ___ ich früh ins Bett.|gehe|gehen|gehst|I am tired. Therefore I am going to bed early.|Deshalb fills position one; the finite verb follows immediately.
Ich komme nicht, denn ich ___ krank.|bin|sein|bist|I am not coming because I am ill.|Denn joins main clauses and does not move the verb to the end.
Sie sagt, dass sie heute arbeiten ___.|muss|müssen|musst|She says that she has to work today.|In a dass clause, the finite modal comes after the infinitive.
Ich habe wenig Zeit, ___ ich helfe dir.|aber|weil|dass|I have little time, but I will help you.|Aber joins main clauses with the normal verb position.
Es regnet. Trotzdem ___ wir spazieren.|gehen|geht|gehst|It is raining. Nevertheless we are going for a walk.|After Trotzdem, the finite verb comes before the subject.
`);
add('requests', 'A1', `
___ Sie bitte langsam!|Sprechen|Sprich|Sprecht|Please speak slowly. (formal)|The formal imperative uses infinitive + Sie.
___ bitte die Tür! (du)|Öffne|Öffnet|Öffnen|Please open the door. (informal singular)|The du imperative of öffnen is öffne.
___ bitte leise! (ihr)|Seid|Sei|Sind|Please be quiet. (informal plural)|The ihr imperative of sein is seid.
___ bitte Platz! (du)|Nimm|Nehmt|Nehmen|Please take a seat. (informal singular)|Nehmen has the irregular du imperative nimm.
`);
add('requests', 'A2', `
___ Sie mir bitte helfen?|Könnten|Könntest|Könnte|Could you please help me? (formal)|A polite request to Sie uses könnten.
Ich ___ gern einen Tee.|hätte|hätten|hättest|I would like a tea, please.|Ich hätte gern is a polite way to ask for something.
Du ___ mehr schlafen.|solltest|sollten|solltet|You should sleep more.|Solltest is a common way to give advice to du.
Ich freue ___ auf den Urlaub.|mich|mir|sich|I am looking forward to the holiday.|Sich freuen uses an accusative reflexive pronoun: ich freue mich.
Wir treffen ___ um acht.|uns|euch|sich|We are meeting at eight.|The reflexive/reciprocal pronoun for wir is uns.
Beeilt ___ bitte! (ihr)|euch|uns|sich|Please hurry! (informal plural)|The plural informal imperative uses beeilt euch.
Er interessiert ___ für Musik.|sich|ihn|ihm|He is interested in music.|Sich interessieren uses sich for er.
Ich wasche ___ die Hände.|mir|mich|sich|I wash my hands.|With die Hände as accusative object, the reflexive pronoun is dative: mir.
`);
