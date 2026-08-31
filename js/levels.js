'use strict';
window.SNAKES_REVENGE_LEVELS = [
  {
    id: 1, title: 'The Prison Maze', era: 'Classic rock · 1970s–1980s', trackOffset: 0,
    intro: 'Read the maze, guide the team, and reach the city rooftops.',
    scenes: ['01-patrol','02-landmarks','03-gate-release','04-yard-cover','05-rally-point','06-dead-end','07-searchlight','08-symbol-key','09-unstable-ground','10-extraction-run'].map((file,index) => ({
      ...GAME_DATA.levels[0].questions[index], image: `assets/story/level-01/${file}.webp`,
      title: `The Prison Maze · scene ${index + 1}`, briefing: 'Study the scene and choose the safest route.'
    }))
  },
  {
    id: 2, title: 'Rooftops to the Harbor', era: '1990s alternative', trackOffset: 10,
    intro: 'Use geometry, energy, machines, and code to cross the city and reach the harbor.',
    scenes: [
      {id:'11-rooftop-ramp',title:'The Rooftop Ramp',briefing:'Right-angle ramp: vertical rise 3 m; horizontal run 4 m. Use the briefing dimensions, not the drawing scale.',q:'How long must the straight ramp be to connect these two points?',opts:['4 m','5 m','7 m','12 m'],correct:1,hint:'Pythagoras: length² = 3² + 4² = 25. The straight ramp is 5 m long.'},
      {id:'12-subway-battery',title:'Power for the Radio',briefing:'Battery energy: 24 Wh. Radio power: 6 W. Assume constant power and no losses.',q:'How long can the battery power the radio?',opts:['30 minutes','2 hours','4 hours','144 hours'],correct:2,hint:'Time = energy ÷ power = 24 Wh ÷ 6 W = 4 hours. Real batteries and radios can have losses.'},
      {id:'13-freight-lever',title:'The Freight Lever',briefing:'Ideal lever: Snake applies 100 N at 2 m from the pivot. The crate is 0.5 m from the pivot. Ignore friction and lever weight.',q:'What crate weight can this lever balance?',opts:['25 N','100 N','200 N','400 N'],correct:3,hint:'Balance the moments: 100 × 2 = crate weight × 0.5. The crate weight is 400 N.'},
      {id:'14-pump-room',title:'Drain the Pump Chamber',briefing:'Water to remove: 120 L. Pump rate: 15 L per minute. No new water enters.',q:'How many minutes will it take to remove the water?',opts:['8 minutes','15 minutes','18 minutes','105 minutes'],correct:0,hint:'Time = volume ÷ flow rate = 120 ÷ 15 = 8 minutes.'},
      {id:'15-cable-tram',title:'Across the Skyline',briefing:'Tram route length: 240 m. Constant speed: 3 m/s. Ignore acceleration and stops.',q:'How long does the tram take to reach the next roof?',opts:['60 seconds','80 seconds','237 seconds','720 seconds'],correct:1,hint:'Time = distance ÷ speed = 240 m ÷ 3 m/s = 80 seconds.'},
      {id:'16-radio-relay',title:'The Four-Light Signal',briefing:'Read the signal left to right: ON, OFF, ON, OFF. ON = 1; OFF = 0. Binary place values: 8, 4, 2, 1.',q:'Which decimal channel number does the binary signal 1010 represent?',opts:['5','8','10','12'],correct:2,hint:'Only the 8 and 2 positions are on: 8 + 0 + 2 + 0 = 10.'},
      {id:'17-rooftop-garden',title:'The Greenhouse Refuge',briefing:'Rectangular planting bed: 6 m long and 4 m wide. We are measuring area, not the path around it.',q:'What is the planting area?',opts:['10 m²','20 m²','24 m²','48 m²'],correct:2,hint:'Rectangle area = length × width = 6 × 4 = 24 square metres.'},
      {id:'18-cooling-station',title:'Balance the Water Temperature',briefing:'Mix equal masses of liquid water at 20°C and 40°C. Assume no heat loss, no phase change, and the same heat capacity.',q:'What is the final temperature after they mix?',opts:['20°C','30°C','40°C','60°C'],correct:1,hint:'With equal masses of the same material, the final temperature is the average: (20 + 40) ÷ 2 = 30°C.'},
      {id:'19-signal-circuit',title:'Restore the Signal Lamp',briefing:'This low-voltage teaching circuit has a working battery, intact wires, a working lamp, and an open switch.',q:'What completes the circuit so current can flow through the lamp?',opts:['Close the switch','Remove a wire','Disconnect the battery','Open another gap'],correct:0,hint:'A closed switch completes the conducting loop. An open gap prevents current. This is a teaching model, not an instruction to touch railway equipment.'},
      {id:'20-harbor-extraction',title:'The Harbor Crossing',briefing:'Boat journey: 18 km. Fuel economy: 6 km per litre. Find the theoretical fuel use before adding a safety reserve.',q:'How much fuel does the calculation require?',opts:['2 L','3 L','6 L','108 L'],correct:1,hint:'Fuel = distance ÷ fuel economy = 18 ÷ 6 = 3 litres. A real journey needs an appropriate reserve and operating checks.'}
    ].map(scene => ({...scene,image:`assets/story/level-02/${scene.id}.png`}))
  }
];
