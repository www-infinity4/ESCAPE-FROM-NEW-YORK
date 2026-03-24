'use strict';
/* =====================================================
   ESCAPE FROM NEW YORK – Game Data
   10 levels × 10 trivia questions + scene configs
   ===================================================== */

const GAME_DATA = {
    title:    'ESCAPE FROM NEW YORK',
    subtitle: 'THE GAME',
    version:  '1.0',

    levels: [
        /* ── LEVEL 1 ──────────────────────────────────── */
        {
            id: 1,
            name: 'THE PRISON ISLAND',
            scene: 'MANHATTAN MAX-SECURITY PRISON · 1997',
            synopsis:
                'THE YEAR IS 1997. CRIME HAS RISEN 400%.\n' +
                'THE ENTIRE ISLAND OF MANHATTAN HAS BEEN\n' +
                'WALLED OFF AND CONVERTED INTO THE WORLD\'S\n' +
                'LARGEST MAXIMUM SECURITY PRISON.\n\n' +
                'ONCE YOU GO IN… YOU NEVER COME OUT.',
            palette: {
                sky: '#0a0a2e', ground: '#1a1a3e',
                accent: '#0044cc', hi: '#4488ff', dark: '#050510'
            },
            enemy: { count: 1, speed: 180, health: 1, name: 'PRISONER' },
            questions: [
                {
                    q: 'What year is "Escape from New York" set in?',
                    opts: ['1984', '1990', '1997', '2001'],
                    correct: 2,
                    hint: 'Sixteen years after the film\'s 1981 release.'
                },
                {
                    q: 'What has Manhattan Island been converted into?',
                    opts: ['A military base', 'A maximum security prison', 'An abandoned city', 'A theme park'],
                    correct: 1,
                    hint: 'Manhattan became the world\'s largest walled prison.'
                },
                {
                    q: 'By how much did the U.S. crime rate rise before 1988?',
                    opts: ['200%', '300%', '400%', '500%'],
                    correct: 2,
                    hint: 'A fourfold increase led to the radical solution.'
                },
                {
                    q: 'Who plays the iconic Snake Plissken?',
                    opts: ['Harrison Ford', 'Sylvester Stallone', 'Kurt Russell', 'Clint Eastwood'],
                    correct: 2,
                    hint: 'He also played the title role in Big Trouble in Little China.'
                },
                {
                    q: 'What is Snake Plissken\'s most distinctive physical feature?',
                    opts: ['A metal hand', 'A scar on his face', 'An eye patch', 'A shaved head'],
                    correct: 2,
                    hint: 'He covers his left eye with it.'
                },
                {
                    q: 'Who directed "Escape from New York"?',
                    opts: ['George Romero', 'Wes Craven', 'James Cameron', 'John Carpenter'],
                    correct: 3,
                    hint: 'He also directed Halloween and The Thing.'
                },
                {
                    q: 'What branch of service was Snake Plissken?',
                    opts: ['Navy SEALs', 'Green Berets', 'Special Forces', 'Army Rangers'],
                    correct: 2,
                    hint: 'He was a highly decorated U.S. Special Forces soldier.'
                },
                {
                    q: 'What crime is Snake being sent to prison for?',
                    opts: ['Robbing the Federal Reserve', 'Murder', 'Terrorism', 'Drug trafficking'],
                    correct: 0,
                    hint: 'He tried to rob the most secure bank in the country.'
                },
                {
                    q: 'What is the name of the law-enforcement agency guarding the prison?',
                    opts: ['FBI', 'CIA', 'USPF', 'NYPD'],
                    correct: 2,
                    hint: 'United States Police Force — think future militarised law enforcement.'
                },
                {
                    q: 'What tattoo is visible on Snake\'s body?',
                    opts: ['An eagle', 'A cobra snake', 'A skull', 'A dragon'],
                    correct: 1,
                    hint: 'It coils across his abdomen and gave him his nickname.'
                }
            ]
        },

        /* ── LEVEL 2 ──────────────────────────────────── */
        {
            id: 2,
            name: 'AIR FORCE ONE DOWN',
            scene: 'CRASH SITE · LOWER MANHATTAN',
            synopsis:
                'AIR FORCE ONE HAS BEEN HIJACKED AND CRASHED\n' +
                'INTO THE STREETS OF MANHATTAN.\n\n' +
                'THE PRESIDENT — CARRYING A CASSETTE TAPE\n' +
                'VITAL TO WORLD PEACE — IS NOW HELD HOSTAGE\n' +
                'INSIDE THE PRISON ISLAND.',
            palette: {
                sky: '#2a0800', ground: '#1a0000',
                accent: '#ff3300', hi: '#ff6600', dark: '#0d0000'
            },
            enemy: { count: 1, speed: 170, health: 1, name: 'HIJACKER' },
            questions: [
                {
                    q: 'What aircraft crashes into Manhattan?',
                    opts: ['Air Force Two', 'Air Force One', 'A military bomber', 'A passenger jet'],
                    correct: 1,
                    hint: 'The presidential aircraft itself.'
                },
                {
                    q: 'What critical item is the President carrying?',
                    opts: ['Nuclear launch codes', 'A cassette tape', 'Classified war plans', 'A diplomatic passport'],
                    correct: 1,
                    hint: 'It contains recordings vital to preventing World War III.'
                },
                {
                    q: 'Who is the USPF Commissioner who recruits Snake?',
                    opts: ['Frank Miller', 'Bob Hauk', 'John Matrix', 'Samuel Drake'],
                    correct: 1,
                    hint: 'Played by spaghetti-western legend Lee Van Cleef.'
                },
                {
                    q: 'What actor played Commissioner Hauk?',
                    opts: ['Charles Bronson', 'Clint Eastwood', 'Lee Van Cleef', 'James Coburn'],
                    correct: 2,
                    hint: 'Famous for For a Few Dollars More.'
                },
                {
                    q: 'How does Hauk ensure Snake will complete the mission?',
                    opts: [
                        'By paying him a million dollars',
                        'By holding a loved one hostage',
                        'By implanting explosive charges in his arteries',
                        'By threatening to increase his sentence'
                    ],
                    correct: 2,
                    hint: 'Microscopic capsules in his carotid arteries will detonate if not deactivated in time.'
                },
                {
                    q: 'How many hours does Snake have to complete the mission?',
                    opts: ['12 hours', '18 hours', '22 hours', '24 hours'],
                    correct: 2,
                    hint: 'Less than a full day — every second counts.'
                },
                {
                    q: 'What does Hauk promise Snake if he succeeds?',
                    opts: ['A million dollars', 'A new identity', 'A full presidential pardon', 'Safe passage abroad'],
                    correct: 2,
                    hint: 'Wipe his record clean.'
                },
                {
                    q: 'What does Snake use to enter Manhattan?',
                    opts: ['A submarine', 'A hang-glider / sailplane', 'He swims', 'A sewer tunnel'],
                    correct: 1,
                    hint: 'Silent entry from the air — no engine noise.'
                },
                {
                    q: 'Which building does Snake land on?',
                    opts: ['The Empire State Building', 'Rockefeller Center', 'The Chrysler Building', 'The World Trade Center'],
                    correct: 3,
                    hint: 'Twin towers — one served as Snake\'s rooftop landing strip.'
                },
                {
                    q: 'What summit is the cassette tape needed for?',
                    opts: [
                        'A NATO meeting',
                        'A nuclear/energy technology summit',
                        'A trade conference',
                        'A UN General Assembly'
                    ],
                    correct: 1,
                    hint: 'It holds the key to preventing a nuclear conflict.'
                }
            ]
        },

        /* ── LEVEL 3 ──────────────────────────────────── */
        {
            id: 3,
            name: 'THE STREETS OF MANHATTAN',
            scene: 'DARK STREETS · GANG TERRITORY',
            synopsis:
                'SNAKE DESCENDS INTO THE HELLISH STREETS.\n' +
                'GANGS RULE EVERY BLOCK. DANGER LURKS\n' +
                'AROUND EVERY CORNER.\n\n' +
                'HE MUST FIND ALLIES FAST OR HE WON\'T\n' +
                'LAST LONG ENOUGH TO RESCUE ANYONE.',
            palette: {
                sky: '#111111', ground: '#1a1a1a',
                accent: '#ffcc00', hi: '#ffffff', dark: '#000000'
            },
            enemy: { count: 2, speed: 160, health: 1, name: 'GANG MEMBER' },
            questions: [
                {
                    q: 'What is the name of the eccentric taxi driver who helps Snake?',
                    opts: ['Jimmy', 'Cabbie', 'Taxi Bob', 'Wheels'],
                    correct: 1,
                    hint: 'He\'s been driving a cab in Manhattan long after everyone else left.'
                },
                {
                    q: 'What actor played Cabbie?',
                    opts: ['Walter Matthau', 'Ernest Borgnine', 'Jack Lemmon', 'Burgess Meredith'],
                    correct: 1,
                    hint: 'Academy-Award winner famous for Marty (1955).'
                },
                {
                    q: 'What is Cabbie\'s taxi decorated with?',
                    opts: ['Neon lights', 'Christmas lights', 'American flags', 'Graffiti'],
                    correct: 1,
                    hint: 'Festive decorations even in the apocalypse.'
                },
                {
                    q: 'Who is "Brain"?',
                    opts: [
                        'The Duke\'s chief enforcer',
                        'A prison doctor',
                        'Snake\'s former partner who now lives inside Manhattan',
                        'A government spy'
                    ],
                    correct: 2,
                    hint: 'He has inside knowledge of escape routes.'
                },
                {
                    q: 'What actor played Brain?',
                    opts: ['Dennis Hopper', 'John Hurt', 'Harry Dean Stanton', 'Donald Sutherland'],
                    correct: 2,
                    hint: 'Also appeared in Alien and Paris, Texas.'
                },
                {
                    q: 'Who is Maggie?',
                    opts: [
                        'The President\'s aide',
                        'Brain\'s tough, loyal girlfriend',
                        'A USPF undercover agent',
                        'The Duke\'s sister'
                    ],
                    correct: 1,
                    hint: 'She protects Brain with skill and devotion.'
                },
                {
                    q: 'What actress played Maggie?',
                    opts: ['Jamie Lee Curtis', 'Linda Hamilton', 'Adrienne Barbeau', 'Sigourney Weaver'],
                    correct: 2,
                    hint: 'She was also Carpenter\'s wife at the time.'
                },
                {
                    q: 'What are the tunnel-dwelling gang members called?',
                    opts: ['The Mole Men', 'The Forgotten', 'The Crazies', 'The Underground'],
                    correct: 2,
                    hint: 'They live in the subway tunnels and attack without warning.'
                },
                {
                    q: 'How does Snake initially track the President\'s location?',
                    opts: [
                        'A radio broadcast',
                        'Information from Cabbie',
                        'A locator bracelet signal',
                        'An old city map'
                    ],
                    correct: 2,
                    hint: 'The President was given a tracking device before the crash.'
                },
                {
                    q: 'What famous response does Snake give when told he was believed dead?',
                    opts: [
                        '"Reports of my death are exaggerated."',
                        '"I\'m already dead."',
                        '"Not yet."',
                        '"I\'m hard to kill."'
                    ],
                    correct: 1,
                    hint: 'One of the most quoted lines from the film.'
                }
            ]
        },

        /* ── LEVEL 4 ──────────────────────────────────── */
        {
            id: 4,
            name: 'THE DUKE\'S EMPIRE',
            scene: 'DUKE\'S TERRITORY · MIDTOWN MANHATTAN',
            synopsis:
                'THE DUKE OF NEW YORK — SELF-PROCLAIMED\n' +
                'RULER OF MANHATTAN PRISON — HOLDS THE\n' +
                'PRESIDENT CAPTIVE.\n\n' +
                'HIS ARMY IS LOYAL AND DANGEROUS.\n' +
                'TO REACH THE PRESIDENT, SNAKE MUST\n' +
                'ENTER THE LION\'S DEN.',
            palette: {
                sky: '#1a0033', ground: '#0d001a',
                accent: '#cc00cc', hi: '#ff66ff', dark: '#060006'
            },
            enemy: { count: 2, speed: 155, health: 2, name: 'DUKE\'S SOLDIER' },
            questions: [
                {
                    q: 'What is the Duke of New York\'s self-given title?',
                    opts: ['The King', 'A-Number-One', 'The Emperor', 'The Boss'],
                    correct: 1,
                    hint: 'He bellows it constantly with great pride.'
                },
                {
                    q: 'What actor played the Duke of New York?',
                    opts: ['James Brown', 'Curtis Mayfield', 'Barry White', 'Isaac Hayes'],
                    correct: 3,
                    hint: 'Soul-music legend famous for the Shaft soundtrack.'
                },
                {
                    q: 'What does the Duke\'s limousine have on its hood?',
                    opts: ['Machine guns', 'Chandeliers', 'Spotlights', 'A golden statue'],
                    correct: 1,
                    hint: 'Flamboyant lighting fixtures meant to impress and intimidate.'
                },
                {
                    q: 'What does the Duke plan to use the President for?',
                    opts: [
                        'To gain legal control of the prison',
                        'To negotiate with foreign powers himself',
                        'As a hostage / bargaining chip',
                        'As a slave labourer'
                    ],
                    correct: 2,
                    hint: 'He wants leverage against the U.S. government.'
                },
                {
                    q: 'What entertainment does the Duke force Snake into?',
                    opts: ['A car race', 'Gladiatorial arena combat', 'A card game', 'A shooting contest'],
                    correct: 1,
                    hint: 'Fight or die in front of the Duke\'s cheering crowd.'
                },
                {
                    q: 'What is the name of Snake\'s arena opponent?',
                    opts: ['Bull', 'Tank', 'Crusher', 'Slag'],
                    correct: 3,
                    hint: 'A giant, seemingly unbeatable fighter.'
                },
                {
                    q: 'What improvised weapon does Snake grab in the arena?',
                    opts: ['A broken pipe', 'A chain', 'A nail-studded baseball bat', 'A glass bottle'],
                    correct: 2,
                    hint: 'Classic improvised weaponry — baseball bat with barbed nails.'
                },
                {
                    q: 'What injury accounts for Snake\'s eye patch?',
                    opts: [
                        'A knife fight in prison',
                        'A battlefield wound during the war',
                        'An arena fight gone wrong',
                        'Never explicitly explained in the film'
                    ],
                    correct: 3,
                    hint: 'Carpenter deliberately left it mysterious.'
                },
                {
                    q: 'How does the Duke communicate his power across Manhattan?',
                    opts: [
                        'Via a radio station',
                        'Through messenger pigeons',
                        'Through his limousine public-address system',
                        'Via graffiti orders'
                    ],
                    correct: 2,
                    hint: 'His voice booms across the streets from speakers on his car.'
                },
                {
                    q: 'What is distinctive about the Duke\'s overall style?',
                    opts: [
                        'Military uniform and helmet',
                        'Flamboyant, elaborate robes and jewellery',
                        'He wears a mask',
                        'All black tactical gear'
                    ],
                    correct: 1,
                    hint: 'Isaac Hayes played the role with maximum theatrical flair.'
                }
            ]
        },

        /* ── LEVEL 5 ──────────────────────────────────── */
        {
            id: 5,
            name: 'UNDERGROUND CITY',
            scene: 'SUBWAY TUNNELS · BELOW MANHATTAN',
            synopsis:
                'BENEATH THE RUINED STREETS LIES A\n' +
                'LABYRINTH OF TUNNELS INHABITED BY THE\n' +
                'MOST DANGEROUS CRIMINALS OF ALL.\n\n' +
                'THE CRAZIES HUNT ANYTHING THAT MOVES.\n' +
                'SNAKE MUST FIND BRAIN — AND THE WAY OUT.',
            palette: {
                sky: '#001100', ground: '#000d00',
                accent: '#00bb00', hi: '#00ff00', dark: '#000400'
            },
            enemy: { count: 2, speed: 150, health: 2, name: 'TUNNEL CRAWLER' },
            questions: [
                {
                    q: 'Where does Brain set up his operations inside Manhattan?',
                    opts: ['A hospital', 'A bank vault', 'An old public library', 'A police station'],
                    correct: 2,
                    hint: 'Books and maps surround his makeshift headquarters.'
                },
                {
                    q: 'What has Brain secretly been stockpiling for an escape plan?',
                    opts: ['Weapons and ammo', 'Money and gold', 'Fuel and escape-route maps', 'Food and medicine'],
                    correct: 2,
                    hint: 'He needs both the means to travel and the knowledge of where to go.'
                },
                {
                    q: 'What is Brain\'s unique value to Snake\'s mission?',
                    opts: [
                        'Medical expertise',
                        'Explosives knowledge',
                        'His intelligence and knowledge of escape routes',
                        'Combat skills'
                    ],
                    correct: 2,
                    hint: 'His brain — hence the nickname — is his greatest weapon.'
                },
                {
                    q: 'What do the Crazies primarily do in the tunnels?',
                    opts: [
                        'Mine for valuables',
                        'Build weapons to sell',
                        'Attack and kill anyone who ventures down there',
                        'Worship the Duke'
                    ],
                    correct: 2,
                    hint: 'Feral and violent — they are the most feared inhabitants of the prison.'
                },
                {
                    q: 'How does Maggie defend Brain against the Crazies?',
                    opts: ['Martial arts', 'A flamethrower', 'A crossbow and firearms', 'Trap systems she builds'],
                    correct: 2,
                    hint: 'She is a crack shot and never far from Brain\'s side.'
                },
                {
                    q: 'What complicates Snake\'s initial tracking of the President?',
                    opts: [
                        'His tracker runs out of battery',
                        'The President\'s bracelet is found on a Crazy — not the President',
                        'The Duke jams the signal',
                        'The tracker was destroyed in the crash'
                    ],
                    correct: 1,
                    hint: 'Someone stripped the bracelet from the President before Snake could reach him.'
                },
                {
                    q: 'What hazard fills many of the underground tunnels?',
                    opts: [
                        'Toxic gas',
                        'Tripwire explosives',
                        'Flooding water',
                        'Darkness and ambush points'
                    ],
                    correct: 3,
                    hint: 'No light, no mercy — the Crazies know every inch.'
                },
                {
                    q: 'What happened to Snake\'s old military unit that contributed to his cynicism?',
                    opts: [
                        'They became prison wardens',
                        'They retired with full honours',
                        'They were sacrificed / betrayed by the government',
                        'They all went AWOL'
                    ],
                    correct: 2,
                    hint: 'Snake learned the hard way that the government treats soldiers as disposable.'
                },
                {
                    q: 'How does Brain initially react to Snake\'s arrival?',
                    opts: [
                        'Excited and welcoming',
                        'Fearful and suspicious',
                        'Angry and ready to fight',
                        'He pretends not to know him'
                    ],
                    correct: 1,
                    hint: 'Snake\'s reputation precedes him — Brain knows what Snake is capable of.'
                },
                {
                    q: 'What war is referenced in Snake\'s backstory?',
                    opts: ['The Vietnam War', 'The Gulf War', 'A fictional World War III', 'The Korean War'],
                    correct: 2,
                    hint: 'Snake fought in the Leningrad campaign of a future third world war.'
                }
            ]
        },

        /* ── LEVEL 6 ──────────────────────────────────── */
        {
            id: 6,
            name: 'THE RESCUE PLAN',
            scene: 'THE PRESIDENT\'S PRISON TOWER',
            synopsis:
                'WITH TIME TICKING DOWN, SNAKE, CABBIE,\n' +
                'BRAIN AND MAGGIE MUST WORK IN PERFECT\n' +
                'UNISON TO FREE THE PRESIDENT.\n\n' +
                'ONE MISTAKE. ONE BETRAYAL.\n' +
                'AND EVERYTHING FALLS APART.',
            palette: {
                sky: '#1a1a00', ground: '#0d0d00',
                accent: '#cccc00', hi: '#ffff00', dark: '#050500'
            },
            enemy: { count: 3, speed: 145, health: 2, name: 'ELITE GUARD' },
            questions: [
                {
                    q: 'What actor played the President of the United States?',
                    opts: ['Peter Sellers', 'Donald Pleasence', 'Christopher Plummer', 'Alec Guinness'],
                    correct: 1,
                    hint: 'Famous for playing Blofeld in the Bond film You Only Live Twice.'
                },
                {
                    q: 'How does the President behave once Snake reaches him?',
                    opts: [
                        'Bravely and cooperatively',
                        'He immediately takes charge',
                        'Mainly concerned with recovering the cassette tape',
                        'He tries to escape on his own'
                    ],
                    correct: 2,
                    hint: 'The tape matters far more to him than the people risking their lives.'
                },
                {
                    q: 'Who in the group briefly contemplates betraying Snake to save themselves?',
                    opts: ['Cabbie', 'Maggie', 'Brain', 'The President'],
                    correct: 2,
                    hint: 'Self-preservation instinct vs loyalty — Brain wrestles with both.'
                },
                {
                    q: 'What happens to Cabbie during the escape?',
                    opts: [
                        'He escapes safely first',
                        'He is captured by the Duke',
                        'He is killed',
                        'He decides to stay in Manhattan'
                    ],
                    correct: 2,
                    hint: 'One of the saddest moments in the film — a friendly presence lost.'
                },
                {
                    q: 'What happens to Brain during the escape?',
                    opts: [
                        'He escapes with the President',
                        'He is killed by the Duke\'s men',
                        'He becomes a hostage',
                        'He escapes first and waits outside'
                    ],
                    correct: 1,
                    hint: 'His death makes the mined bridge even more dangerous.'
                },
                {
                    q: 'What does Maggie do when Brain is killed?',
                    opts: [
                        'She flees with Snake',
                        'She surrenders to the Duke',
                        'She disappears into the tunnels',
                        'She stays to fight and is killed'
                    ],
                    correct: 3,
                    hint: 'She refuses to leave Brain\'s side — even in death.'
                },
                {
                    q: 'How does the group get into the President\'s tower?',
                    opts: [
                        'A frontal assault',
                        'Stealth, using Brain\'s inside knowledge of the layout',
                        'They bribe one of the Duke\'s men',
                        'Snake tunnels in alone'
                    ],
                    correct: 1,
                    hint: 'Brain\'s preparation is what makes the mission even partially possible.'
                },
                {
                    q: 'What growing realisation does Snake have about the government?',
                    opts: [
                        'That they are honourable and will keep their word',
                        'That they are using him as a disposable tool',
                        'That Hauk is secretly a good man',
                        'That the President deserves saving'
                    ],
                    correct: 1,
                    hint: 'Snake sees the mission for exactly what it is — exploitation.'
                },
                {
                    q: 'What injury does Snake sustain during the mission that slows him down?',
                    opts: [
                        'A gunshot to the arm',
                        'He is poisoned',
                        'A stab wound to the leg',
                        'He is hit by the Duke\'s car'
                    ],
                    correct: 0,
                    hint: 'He keeps going regardless — that\'s Snake Plissken.'
                },
                {
                    q: 'What is Snake\'s primary motivation for completing the mission?',
                    opts: [
                        'Patriotism — he wants to serve his country',
                        'He genuinely cares about the President',
                        'The pardon — and removing the charges from his neck',
                        'Revenge against the Duke'
                    ],
                    correct: 2,
                    hint: 'Survival first, pardon second — nothing more.'
                }
            ]
        },

        /* ── LEVEL 7 ──────────────────────────────────── */
        {
            id: 7,
            name: 'GLADIATOR ARENA',
            scene: 'OLD MADISON SQUARE GARDEN · ARENA PIT',
            synopsis:
                'THE DUKE HOSTS BRUTAL GLADIATORIAL COMBAT\n' +
                'FOR HIS ARMY\'S ENTERTAINMENT.\n\n' +
                'SNAKE IS THROWN INTO THE PIT.\n' +
                'ONLY ONE FIGHTER WALKS OUT ALIVE.\n' +
                'MAKE IT SNAKE.',
            palette: {
                sky: '#1a0000', ground: '#0d0000',
                accent: '#cc2200', hi: '#ff4400', dark: '#050000'
            },
            enemy: { count: 3, speed: 140, health: 3, name: 'ARENA FIGHTER' },
            questions: [
                {
                    q: 'Where is the Duke\'s gladiatorial arena located?',
                    opts: [
                        'Below Central Park',
                        'In the old Madison Square Garden',
                        'At the old Yankee Stadium',
                        'In the subway tunnels'
                    ],
                    correct: 1,
                    hint: 'One of New York\'s most famous sporting venues repurposed for blood sport.'
                },
                {
                    q: 'What weapon does Snake improvise in the arena?',
                    opts: [
                        'A length of steel chain',
                        'A broken glass bottle',
                        'A nail-studded baseball bat',
                        'A knife from a fallen guard'
                    ],
                    correct: 2,
                    hint: 'Blunt force, multiplied by nails.'
                },
                {
                    q: 'How does Snake defeat the much larger Slag?',
                    opts: [
                        'By outrunning him until he tires',
                        'By outsmarting him and using his improvised weapon decisively',
                        'With help from Brain',
                        'By bribing a guard to trip Slag'
                    ],
                    correct: 1,
                    hint: 'Snake\'s Special Forces training is about using every advantage available.'
                },
                {
                    q: 'How does the crowd react to Snake\'s victory?',
                    opts: [
                        'Dead silence — they are shocked',
                        'They boo and throw things',
                        'They cheer wildly',
                        'They immediately attack Snake'
                    ],
                    correct: 2,
                    hint: 'Even hardened criminals appreciate a great upset.'
                },
                {
                    q: 'How does the Duke react when his champion is defeated?',
                    opts: [
                        'He congratulates Snake on a fair fight',
                        'He laughs it off — it was just entertainment',
                        'He is furious and orders Snake killed immediately',
                        'He recruits Snake into his inner circle'
                    ],
                    correct: 2,
                    hint: 'Pride and power — the Duke cannot tolerate losing.'
                },
                {
                    q: 'What does winning the arena fight give Snake?',
                    opts: [
                        'Immediate freedom from Manhattan',
                        'The President\'s location',
                        'Time alive and a reputation that gives some leverage',
                        'Access to Brain\'s maps'
                    ],
                    correct: 2,
                    hint: 'It keeps him alive a little longer and earns reluctant respect.'
                },
                {
                    q: 'What classic cinematic theme does the arena sequence echo?',
                    opts: [
                        'Western showdowns at high noon',
                        'Ancient gladiatorial combat',
                        'Medieval jousting tournaments',
                        'Pirate ship battles'
                    ],
                    correct: 1,
                    hint: 'Ancient Rome lives on in John Carpenter\'s dystopian future.'
                },
                {
                    q: 'What is the atmosphere of the arena like?',
                    opts: [
                        'Bright, festive and cheerful',
                        'Silent and clinical',
                        'Formal and orderly',
                        'Dark, brutal and torchlit chaos'
                    ],
                    correct: 3,
                    hint: 'Torchlight, screaming crowds, and raw brutality.'
                },
                {
                    q: 'What does Snake\'s fighting style reveal about his character?',
                    opts: [
                        'He relies purely on brute strength',
                        'He is a trained martial artist with a formal style',
                        'He is cunning, adaptable and improvises under pressure',
                        'He is reckless and lucky'
                    ],
                    correct: 2,
                    hint: 'Snake turns every situation to his advantage — the mark of a survivor.'
                },
                {
                    q: 'What year was "Escape from New York" released in cinemas?',
                    opts: ['1979', '1980', '1981', '1982'],
                    correct: 2,
                    hint: 'Same year as Raiders of the Lost Ark and Das Boot.'
                }
            ]
        },

        /* ── LEVEL 8 ──────────────────────────────────── */
        {
            id: 8,
            name: 'THE GREAT ESCAPE',
            scene: 'NIGHT PURSUIT · MANHATTAN STREETS',
            synopsis:
                'PRESIDENT IN HAND. CLOCK ALMOST AT ZERO.\n' +
                'THE DUKE AND HIS ENTIRE ARMY ARE IN PURSUIT.\n\n' +
                'SNAKE MUST REACH THE BRIDGE BEFORE TIME\n' +
                'RUNS OUT — OR THE CAPSULES DETONATE.',
            palette: {
                sky: '#00001a', ground: '#00000d',
                accent: '#0033ff', hi: '#4466ff', dark: '#000005'
            },
            enemy: { count: 3, speed: 135, health: 3, name: 'DUKE\'S PURSUER' },
            questions: [
                {
                    q: 'Which bridge is the escape route out of Manhattan?',
                    opts: [
                        'The Brooklyn Bridge',
                        'The Manhattan Bridge',
                        'The George Washington Bridge',
                        'The Queensboro (59th Street) Bridge'
                    ],
                    correct: 3,
                    hint: 'Also known as the 59th Street Bridge — connecting Manhattan to Queens.'
                },
                {
                    q: 'What makes the bridge so deadly to cross?',
                    opts: [
                        'Police snipers on both sides',
                        'Landmines planted by criminals',
                        'The bridge is partially collapsed',
                        'Armed USPF checkpoints'
                    ],
                    correct: 1,
                    hint: 'Every step could be your last.'
                },
                {
                    q: 'Who holds the only map showing where the mines are?',
                    opts: ['Hauk', 'Snake', 'Cabbie', 'Brain'],
                    correct: 3,
                    hint: 'He spent years preparing for this very escape.'
                },
                {
                    q: 'What composer created the famous score for the film?',
                    opts: ['Ennio Morricone', 'James Horner', 'John Carpenter himself', 'Giorgio Moroder'],
                    correct: 2,
                    hint: 'Carpenter famously composed his own electronic synthesizer soundtracks.'
                },
                {
                    q: 'How does the Duke pursue Snake on the bridge approach?',
                    opts: [
                        'By helicopter',
                        'On foot with armed men',
                        'In his chandelier limousine with armed escorts',
                        'Through the tunnels to cut them off'
                    ],
                    correct: 2,
                    hint: 'Even in a high-speed chase, the Duke travels in style.'
                },
                {
                    q: 'What is Snake\'s greatest personal concern during the chase?',
                    opts: [
                        'Getting the President to safety',
                        'Protecting the cassette tape',
                        'Reaching safety before the neck capsules detonate',
                        'Avenging the deaths of Cabbie and Brain'
                    ],
                    correct: 2,
                    hint: 'Tick tock — 22 hours is almost up.'
                },
                {
                    q: 'What does the loss of Brain make more dangerous?',
                    opts: [
                        'They have no driver for the escape vehicle',
                        'No one knows the mine map, making the bridge crossing lethal',
                        'The Duke now knows their escape route',
                        'They lose their fuel supply'
                    ],
                    correct: 1,
                    hint: 'Brain was the only one who memorised the safe path.'
                },
                {
                    q: 'What city was used for most of the Manhattan exteriors?',
                    opts: ['New York City itself', 'Chicago', 'Detroit', 'East St. Louis, Illinois'],
                    correct: 3,
                    hint: 'The abandoned East St. Louis streets doubled convincingly for a ruined Manhattan.'
                },
                {
                    q: 'What does the Duke yell as his signature while pursuing Snake?',
                    opts: [
                        '"You\'ll never leave Manhattan!"',
                        '"Stop him — he\'s mine!"',
                        '"I\'m the Duke! I\'m A-Number-One!"',
                        '"Manhattan is mine forever!"'
                    ],
                    correct: 2,
                    hint: 'His personal motto, shouted at maximum volume.'
                },
                {
                    q: 'What is the approximate budget of "Escape from New York"?',
                    opts: ['$1 million', '$6 million', '$15 million', '$30 million'],
                    correct: 1,
                    hint: 'A lean budget that Carpenter stretched brilliantly with creative filmmaking.'
                }
            ]
        },

        /* ── LEVEL 9 ──────────────────────────────────── */
        {
            id: 9,
            name: 'THE BRIDGE',
            scene: 'QUEENSBORO BRIDGE · ALMOST FREE',
            synopsis:
                'SNAKE IS ON THE BRIDGE. THE DUKE IS\n' +
                'RIGHT BEHIND HIM. MINES BENEATH HIS FEET.\n\n' +
                'ONE FINAL CONFRONTATION STANDS BETWEEN\n' +
                'SNAKE AND FREEDOM.\n' +
                'BUT CAN HE TRUST THE SYSTEM THAT SENT HIM?',
            palette: {
                sky: '#0a1520', ground: '#060f18',
                accent: '#1a5080', hi: '#4499bb', dark: '#030810'
            },
            enemy: { count: 4, speed: 130, health: 3, name: 'BRIDGE SNIPER' },
            questions: [
                {
                    q: 'How does Snake deal with the Duke at the end of the bridge?',
                    opts: [
                        'He negotiates a truce',
                        'He tricks him into a minefield',
                        'He shoots and kills him',
                        'He leaves him to the police'
                    ],
                    correct: 2,
                    hint: 'Quick and final — Snake doesn\'t negotiate with people who tried to kill him.'
                },
                {
                    q: 'What does Hauk do the moment Snake returns with the President?',
                    opts: [
                        'Thanks him and shakes his hand warmly',
                        'Arrests him anyway',
                        'Deactivates the explosive charges in Snake\'s neck',
                        'Announces the pardon on national television'
                    ],
                    correct: 2,
                    hint: 'The first thing on Snake\'s list was always his own survival.'
                },
                {
                    q: 'What does Snake hand Hauk once the explosives are removed?',
                    opts: [
                        'The real cassette tape',
                        'A fake / wrong cassette tape',
                        'Evidence of government corruption',
                        'Nothing — he keeps everything'
                    ],
                    correct: 1,
                    hint: 'Snake had been planning this switch for a while.'
                },
                {
                    q: 'What tape did Snake swap in to replace the real one?',
                    opts: [
                        'A blank tape',
                        'A military briefing recording',
                        'A country music tape from Cabbie\'s collection',
                        'A tape of Snake\'s own voice'
                    ],
                    correct: 2,
                    hint: 'Cabbie\'s beloved country music finally serves one last purpose.'
                },
                {
                    q: 'Why does Snake swap the tapes?',
                    opts: [
                        'As a practical joke',
                        'As revenge and distrust of the government that used him',
                        'By accident — he mixed them up',
                        'To sell the real tape to a foreign power'
                    ],
                    correct: 1,
                    hint: 'Snake\'s one act of defiance against a system that sees him as expendable.'
                },
                {
                    q: 'What happens at the international summit when the tape is played?',
                    opts: [
                        'It plays the real speech and peace is secured',
                        'The tape is blank and nothing happens',
                        'The President confesses to the switch',
                        'Country music plays — humiliating the President'
                    ],
                    correct: 3,
                    hint: 'Diplomacy derailed by Cabbie\'s country playlist.'
                },
                {
                    q: 'What does Snake do with the real tape at the very end of the film?',
                    opts: [
                        'He sells it',
                        'He gives it to a journalist',
                        'He slowly pulls the magnetic tape out of the cassette, destroying it',
                        'He buries it'
                    ],
                    correct: 2,
                    hint: 'A quiet but powerful final act of rebellion.'
                },
                {
                    q: 'What does Snake\'s destruction of the tape imply for the world?',
                    opts: [
                        'World peace is still possible via other means',
                        'Nothing — it was just a copy',
                        'Nuclear war may no longer be preventable',
                        'The government will cover it up easily'
                    ],
                    correct: 2,
                    hint: 'The film ends on a deeply pessimistic note about governments and power.'
                },
                {
                    q: 'What is the final image of the film?',
                    opts: [
                        'The President giving a victory speech',
                        'An explosion over Manhattan',
                        'Snake walking alone into the darkness',
                        'A USPF helicopter leaving Manhattan'
                    ],
                    correct: 2,
                    hint: 'The ultimate anti-hero exit — free, but utterly alone.'
                },
                {
                    q: 'What theme does Snake\'s final act encapsulate?',
                    opts: [
                        'That heroism always triumphs',
                        'That crime never pays',
                        'That the system cannot be trusted and individuals are disposable',
                        'That government ultimately means well'
                    ],
                    correct: 2,
                    hint: 'Carpenter\'s cynical dystopian vision at its most potent.'
                }
            ]
        },

        /* ── LEVEL 10 ─────────────────────────────────── */
        {
            id: 10,
            name: 'FINAL COUNTDOWN',
            scene: 'FREEDOM CHECKPOINT · THE LAST STAND',
            synopsis:
                'THIS IS IT.\n' +
                'THE FINAL CONFRONTATION.\n\n' +
                'SNAKE HAS FOUGHT THROUGH EVERYTHING\n' +
                'MANHATTAN COULD THROW AT HIM.\n\n' +
                'THE CLOCK IS AT ZERO.\n' +
                'WILL SNAKE ESCAPE… OR WILL THE SYSTEM WIN?',
            palette: {
                sky: '#1a0000', ground: '#0d0000',
                accent: '#ff0000', hi: '#ff3300', dark: '#050000'
            },
            enemy: { count: 4, speed: 120, health: 4, name: 'FINAL GUARD' },
            questions: [
                {
                    q: 'What is the full name of the sequel to this film?',
                    opts: [
                        'Return to New York',
                        'Snake Lives',
                        'Escape from L.A.',
                        'Escape from Chicago'
                    ],
                    correct: 2,
                    hint: 'Set on the West Coast — also directed by Carpenter with Kurt Russell (1996).'
                },
                {
                    q: 'What is Snake Plissken\'s rank in his Special Forces background?',
                    opts: ['Sergeant', 'Captain', 'Colonel', 'First Lieutenant'],
                    correct: 3,
                    hint: 'His rank and medals make his fall from grace all the more tragic.'
                },
                {
                    q: 'How much did "Escape from New York" gross at the worldwide box office?',
                    opts: ['Under $5 million', 'About $25 million', 'About $75 million', 'Over $100 million'],
                    correct: 1,
                    hint: 'More than four times its $6 million budget — a solid hit and future cult classic.'
                },
                {
                    q: 'What genre best describes "Escape from New York"?',
                    opts: [
                        'Pure horror',
                        'Romantic thriller',
                        'Sci-fi action / dystopian thriller',
                        'War film'
                    ],
                    correct: 2,
                    hint: 'A genre-defining blend with strong Western anti-hero DNA.'
                },
                {
                    q: 'What real New York landmark featured most prominently in the story?',
                    opts: [
                        'Times Square',
                        'The Brooklyn Bridge',
                        'Central Park',
                        'The World Trade Center'
                    ],
                    correct: 3,
                    hint: 'The Twin Towers served as Snake\'s landing strip.'
                },
                {
                    q: 'What makes Snake Plissken such an enduring pop-culture icon?',
                    opts: [
                        'Supernatural powers and invincibility',
                        'His patriotism and military loyalty',
                        'His anti-hero complexity and refusal to be anyone\'s pawn',
                        'His sense of humour'
                    ],
                    correct: 2,
                    hint: 'He\'s the quintessential "I don\'t play by your rules" archetype.'
                },
                {
                    q: 'Which video-game character was heavily inspired by Snake Plissken?',
                    opts: ['Master Chief', 'Duke Nukem', 'Solid Snake from Metal Gear', 'Sam Fisher from Splinter Cell'],
                    correct: 2,
                    hint: 'Hideo Kojima has openly acknowledged the debt — even the name is a nod.'
                },
                {
                    q: 'Complete the iconic exchange: "The name\'s Plissken." / "I heard you were dead." / Snake replies:',
                    opts: [
                        '"Not yet."',
                        '"I\'m already dead."',
                        '"Hard to kill."',
                        '"You wish."'
                    ],
                    correct: 1,
                    hint: 'His nihilistic worldview summed up in three words.'
                },
                {
                    q: 'What awards recognition did "Escape from New York" receive?',
                    opts: [
                        'Won the Academy Award for Best Picture',
                        'Won three Saturn Awards (sci-fi/horror genre awards)',
                        'No major awards — only recognised later as a cult classic',
                        'Won the Cannes Palme d\'Or'
                    ],
                    correct: 2,
                    hint: 'Like many influential films, it was overlooked at the time but beloved forever after.'
                },
                {
                    q: 'What is the very last thing Snake does as the end credits approach?',
                    opts: [
                        'He radios Hauk with a final insult',
                        'He hands himself in to the authorities',
                        'He slowly unspools the real cassette tape, destroying it',
                        'He rides off on a motorcycle'
                    ],
                    correct: 2,
                    hint: 'A quiet, deliberate act of defiance — the perfect final statement.'
                }
            ]
        }
    ] /* end levels */
}; /* end GAME_DATA */
