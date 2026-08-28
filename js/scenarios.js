'use strict';
/* Scenario decisions replace film-trivia questions. Each level has ten
   practical escape choices; correct choices reward observation, planning,
   teamwork, navigation, and safe problem-solving. */

const SCENARIO_QUESTIONS = [
  [
    ['A patrol blocks the only lit corridor. What gives you the safest route?', ['Rush the patrol','Study its timing and use cover','Shout a warning','Wait in the open'],1,'Observe first; move during the patrol gap.'],
    ['Your map and the wall signs disagree. What should you trust first?', ['The loudest teammate','A random turn','Two fixed landmarks you can verify','The oldest sign'],2,'Verified landmarks prevent a bad route from compounding.'],
    ['A locked gate has power but no guard nearby. What is the smart first check?', ['Kick it','Touch exposed wiring','Look for a marked release or control panel','Climb the sharp fence'],2,'Use the designed control before taking physical risks.'],
    ['You hear boots approaching while crossing an open yard. What now?', ['Freeze in the open','Sprint without looking','Move to the nearest planned cover','Drop the map'],2,'A short move to known cover limits exposure.'],
    ['Your teammate loses sight of you in the maze. What was missing?', ['A louder weapon','A rally point and signal','More speed','A longer route'],1,'Agree on rally points before separating.'],
    ['A corridor ends at a vent too small to enter. Best response?', ['Force it','Mark the dead end and backtrack','Keep waiting','Destroy the map'],1,'Marking dead ends makes the maze easier.'],
    ['A guard tower light sweeps left to right. When do you cross?', ['While it points at you','Immediately after it passes','At a random moment','Never'],1,'Move just after the beam passes to gain the longest interval.'],
    ['You find two keys with different symbols. How do you avoid wasting time?', ['Try them everywhere','Match the gate symbol to the key','Throw both away','Split the keys'],1,'Visual matching is faster and quieter.'],
    ['Your exit route crosses unstable ground. What is safest?', ['Test each step and use the marked edge','Run through the center','Jump blindly','Follow the heaviest person'],0,'Controlled testing reduces the chance of collapse.'],
    ['The extraction gate is visible. What should happen before the final run?', ['Forget the team','Check the route, patrol, and rally signal','Drop supplies','Announce your position'],1,'Confirm route and timing before committing.']
  ],
  [
    ['Smoke hides the crash-site street. How should you move?', ['Follow the wall and check low visibility','Run down the center','Close your eyes','Follow sparks'],0,'A wall gives orientation when visibility disappears.'],
    ['A fuel smell is getting stronger. Which route is safest?', ['Toward the smell','Past open flames','Upwind and away from ignition','Through the wreck'],2,'Increase distance from fuel and ignition sources.'],
    ['You need a case from the wreckage. What comes first?', ['Enter immediately','Check fire, stability, and exits','Move debris alone','Turn off your light'],1,'Assess hazards and a retreat route first.'],
    ['A radio message is broken and repeats coordinates. What should you do?', ['Guess the missing numbers','Confirm the full message before moving','Ignore all radio traffic','Broadcast your location'],1,'A confirmed coordinate beats a dangerous guess.'],
    ['Two streets lead around the fire. One is shorter but exposed. Choose:', ['The covered route with known exits','The exposed shortcut','The route with falling debris','No route'],0,'Cover and escape options matter more than a few seconds.'],
    ['A trapped survivor can identify the safe alley. Best action?', ['Leave without looking','Help only if the scene is safe, then ask','Demand information first','Create more debris'],1,'Protect both people, then use their local knowledge.'],
    ['The compass is affected by metal wreckage. What replaces it?', ['A coin toss','Building numbers and the moon position','More magnets','Running faster'],1,'Independent landmarks can restore direction.'],
    ['A door is hot to the touch. What does that suggest?', ['A safe shortcut','Possible fire behind it—use another route','A cold room','No danger'],1,'Heat warns of fire or hot gases.'],
    ['Your timer is falling, but a route is unknown. Best balance?', ['Move fast without checking','Make a brief hazard check, then commit','Stop forever','Split with no plan'],1,'A short deliberate check prevents a costly mistake.'],
    ['You recovered the objective. What is the next priority?', ['Explore more','Move to the preplanned extraction route','Drop it','Return to the fire'],1,'Once the objective is secured, unnecessary exposure adds risk.']
  ],
  [
    ['A street gang controls the intersection. What is the best first move?', ['Challenge them','Observe from concealment and find a bypass','Walk into the center','Reveal your destination'],1,'Information and an alternate route preserve options.'],
    ['A local offers directions for supplies. How do you verify the deal?', ['Hand over everything','Ask for one checkable landmark first','Threaten them','Ignore all help'],1,'A small verifiable detail tests reliability.'],
    ['Broken glass covers the direct route. Choose:', ['Run barefoot','Use protected footing and the clear edge','Crawl through it','Make more noise'],1,'Good footing prevents injury and noise.'],
    ['A rooftop route avoids patrols but has gaps. What decides?', ['Looks exciting','You can verify load, gaps, and a descent point','It is higher','A stranger dares you'],1,'A route needs a safe entry and exit, not just cover.'],
    ['A decoy noise pulls guards away. When should you move?', ['Before checking their movement','After confirming the route actually cleared','Toward the guards','Never'],1,'Confirm the decoy worked before leaving cover.'],
    ['You must cross a dark building. Best light discipline?', ['Bright light at all times','Short, directed checks while preserving night vision','No awareness','Signal from every window'],1,'Controlled light reveals hazards without advertising continuously.'],
    ['A barricade has a narrow opening. What should the team do?', ['All enter at once','Check the far side, then pass one at a time','Push blindly','Separate permanently'],1,'Control the choke point and maintain contact.'],
    ['The safehouse marker has been altered. What now?', ['Enter anyway','Use the backup recognition signal','Shout names','Wait in the doorway'],1,'A prearranged backup signal detects a compromised location.'],
    ['You hear movement behind and ahead. Best position?', ['Stay centered in open ground','Move to cover with two visible exits','Run at the sound','Drop communication'],1,'Two exits prevent being trapped.'],
    ['The bridge route opens for one minute. What must be ready?', ['Only the fastest runner','Everyone, the objective, and the next rally point','Extra noise','No plan'],1,'A timed opening requires the whole plan staged in advance.']
  ],
  [
    ['A leader controls the only obvious road. Your advantage is:', ['Using a less predictable service route','Demanding the road','Following the crowd','Waiting in headlights'],0,'Predictability helps the opposing force.'],
    ['A checkpoint asks for a code phrase you do not know. Best choice?', ['Invent one loudly','Avoid the checkpoint and gather information','Attack immediately','Repeat your name'],1,'Do not gamble at a controlled choke point.'],
    ['You can disable a searchlight briefly. When is it useful?', ['Before your team is positioned','When the route and timing are ready','During daylight','After crossing'],1,'Coordinate the disruption with movement.'],
    ['A map shows a maintenance tunnel but no exit. What should you find first?', ['Its paint color','A confirmed second opening','A longer tunnel','More people'],1,'Never enter a confined route without knowing the way out.'],
    ['A convoy creates noise and cover. Safest use?', ['Stand in front','Move parallel behind solid cover','Climb aboard blindly','Signal the driver'],1,'Use its distraction without entering its danger zone.'],
    ['A guard offers passage if you surrender the objective. Best response?', ['Surrender immediately','Preserve the objective and seek another route','Explain the mission','Drop all tools'],1,'The mission fails if the objective is lost.'],
    ['You need to cross a camera zone. What reduces detection?', ['Random zigzags','Understand the sweep and cross once','Wave at cameras','Stop under one'],1,'One timed crossing is better than repeated exposure.'],
    ['A teammate suggests splitting up to go faster. When is that acceptable?', ['Always','Only with communications, roles, and rally time','Without maps','During confusion'],1,'Separation needs redundancy and a reunion plan.'],
    ['An enemy route suddenly looks empty. What should you suspect?', ['Guaranteed safety','A change, trap, or redirected patrol','A holiday','Nothing'],1,'Unexpected emptiness deserves a quick reassessment.'],
    ['You reach the territory edge. What confirms success?', ['A feeling','The planned landmark and team count','A rumor','A loud celebration'],1,'Verify location and people before moving on.']
  ],
  [
    ['The subway map is damaged. How can you choose direction?', ['Track station sequence and tunnel grade','Spin around','Follow rats only','Ignore signs'],0,'Station order and physical slope provide independent clues.'],
    ['Water is rising in the tunnel. Choose:', ['The lowest passage','Higher ground with a visible exit','A sealed room','The deepest track bed'],1,'Rising water demands elevation and an exit.'],
    ['A third rail may still be live. What is the rule?', ['Touch to test','Treat it as energized and keep clear','Step across casually','Use wet metal'],1,'Unknown electrical equipment must be treated as live.'],
    ['A train blocks the tunnel. Best route check?', ['Crawl beneath it','Find a marked side passage or platform access','Climb moving parts','Wait on the track'],1,'Use designed access paths instead of unstable machinery.'],
    ['Echoes make a patrol sound closer. How do you locate it?', ['Run toward it','Pause and compare sound from two positions','Shout','Ignore it'],1,'Multiple observations reduce echo confusion.'],
    ['Your flashlight begins failing. What should you do?', ['Use it continuously','Save it for hazards and junctions','Throw it away','Run faster'],1,'Conserve limited light for decisions.'],
    ['A service door is labeled ventilation control. Why may it matter?', ['It is decorative','It can indicate maintained access routes','It is always locked','It leads nowhere'],1,'Maintained systems often connect to safer service corridors.'],
    ['A tunnel forks with fresh footprints on one side. What do they tell you?', ['Everything','Recent traffic, but not whether it is safe','The exit exactly','Nothing at all'],1,'Evidence helps, but must be combined with the map and objective.'],
    ['A teammate is exhausted. Best decision?', ['Leave them','Use a protected pause and redistribute load','Push until collapse','Split without contact'],1,'A controlled pause prevents a larger failure.'],
    ['You see daylight through a grate. Before climbing:', ['Assume freedom','Observe the street above and check the grate','Make noise','Drop equipment'],1,'The exit itself may be watched.']
  ],
  [
    ['The hostage room has two doors. Which entry is safer?', ['The one with no view','The one you can observe and withdraw from','Both at once alone','The loudest'],1,'Visibility and a retreat path reduce surprise.'],
    ['A camera watches the stairwell. What should happen first?', ['Ignore it','Find its blind interval or alternate stairs','Break it loudly','Stand beneath it'],1,'Avoid creating an alarm when timing or routing can work.'],
    ['You find the target but no clear exit. What was missed?', ['More speed','Planning extraction before entry','A larger bag','A speech'],1,'Rescue planning includes getting everyone out.'],
    ['A key card may open several floors. Best use?', ['Try every door','Use signs and the mission map to limit attempts','Discard it','Give it to a guard'],1,'Fewer tests save time and avoid alerts.'],
    ['An alarm begins. What should the team follow?', ['Individual guesses','The preplanned emergency route','The crowd','The elevator only'],1,'A rehearsed alternate route prevents panic.'],
    ['The elevator status is unknown. Choose:', ['Force entry','Use stairs unless the elevator is confirmed safe','Jump the shaft','Wait inside doors'],1,'Stairs provide predictable control during an emergency.'],
    ['The rescued person cannot move quickly. Adjust by:', ['Abandoning them','Choosing cover, shorter stages, and support','Running separately','Removing communication'],1,'The plan must match the slowest essential person.'],
    ['A guard radio reveals a sweep pattern. Use it to:', ['Argue on the radio','Time movement around the sweep','Broadcast your route','Stay put forever'],1,'Information is valuable when converted into timing.'],
    ['A stairwell door locks behind you. What precaution helps?', ['No precaution','Wedge or verify re-entry before everyone passes','Break all doors','Separate'],1,'Preserve retreat options until the next route is secure.'],
    ['The rescue team reaches ground level. What confirms readiness?', ['One person says go','People, objective, route, and signal are checked','The lights fail','A door opens'],1,'A short final check prevents leaving someone or something behind.']
  ],
  [
    ['You enter an arena with multiple gates. First priority?', ['Fight immediately','Identify the exit gate and its trigger','Stand at center','Drop the map'],1,'Escape is the objective; identify the route before engaging.'],
    ['A stronger opponent charges directly. Best response?', ['Meet force head-on','Use obstacles and change direction','Stop moving','Close your eyes'],1,'Position and obstacles can defeat raw strength.'],
    ['The crowd noise hides signals. What works?', ['Long speeches','Simple visual signals','Whispering','No coordination'],1,'Use communication suited to the environment.'],
    ['A gate opens only after three switches. Best plan?', ['One person searches randomly','Assign sectors and a rally point','Wait at one switch','Break the floor'],1,'Parallel searching works when roles and reunion are clear.'],
    ['Loose debris can trip anyone. How should it be used?', ['Scatter it everywhere','Mark it and route around it','Carry all of it','Ignore it'],1,'Uncontrolled hazards hurt both sides.'],
    ['A high platform offers visibility but little cover. Use it for:', ['A permanent position','A quick observation, then move','Calling attention','Dropping supplies'],1,'Gain information without becoming exposed.'],
    ['The exit mechanism is across open ground. Safest approach?', ['One unplanned sprint','Use moving cover and timed stages','Walk slowly in center','Send everyone separately'],1,'Break exposure into controlled movements.'],
    ['An opponent stops pursuing unexpectedly. What now?', ['Assume victory','Check for an ambush near the exit','Return to them','Celebrate loudly'],1,'A retreat can be bait.'],
    ['The final switch is damaged. Best first response?', ['Hit it repeatedly','Inspect for a manual release or redundant control','Touch bare wires','Quit'],1,'Safety systems often include a manual or backup path.'],
    ['The arena gate opens. What is the winning move?', ['Stay for points','Exit with the team and objective','Explore seats','Split directions'],1,'Do not trade mission success for unnecessary risk.']
  ],
  [
    ['You are pursued through narrow streets. What creates distance safely?', ['Random turns','Turns chosen from a known route with barriers','Stopping in open ground','Dropping the objective'],1,'Planned turns and obstacles slow pursuit without losing direction.'],
    ['A vehicle is available but its condition is unknown. First check?', ['Maximum speed','Controls, fuel, tires, and escape route','Horn volume','Paint'],1,'A fast vehicle is useless if it cannot be controlled.'],
    ['The direct road has a roadblock. Best decision?', ['Accelerate blindly','Use the mapped secondary route','Stop beside it','Announce arrival'],1,'Preplanned alternatives preserve momentum.'],
    ['Your route passes beneath unstable scaffolding. Choose:', ['The shortest line','A wider route outside the fall zone','Wait underneath','Climb it'],1,'Distance from overhead hazards is safer than saving seconds.'],
    ['A pursuer follows your exact turns. How can you test that?', ['Stop in open ground','Use a safe deliberate route change and observe','Drive faster forever','Turn off awareness'],1,'A controlled change distinguishes pursuit from coincidence.'],
    ['Your teammate calls a shortcut you cannot verify. Respond:', ['Take it instantly','Ask for the next landmark and exit','Ignore them forever','Split'],1,'A useful route description includes checkable points.'],
    ['A narrow alley may trap the vehicle. What measurement matters?', ['Color','Width, clearance, and an exit','Noise','Age'],1,'Confirm the entire passage, not just the entrance.'],
    ['The pursuit closes in near a crowded area. Priority?', ['Use people as obstacles','Slow and choose a route that protects bystanders','Increase risk','Abandon control'],1,'Escape does not justify harming uninvolved people.'],
    ['You lose radio contact. Follow:', ['A random voice','The last confirmed plan and rally point','The pursuer','No route'],1,'A fallback plan keeps the team coordinated without radio.'],
    ['You reach the bridge approach. Before entering:', ['Commit without looking','Confirm the bridge status and far-side exit','Stop under lights','Discard the map'],1,'A bridge is a choke point; verify it before commitment.']
  ],
  [
    ['The bridge deck has missing sections. Best route method?', ['Follow speed alone','Mark a continuous safe line before moving','Jump randomly','Use the darkest lane'],1,'Plan the full path across discontinuous ground.'],
    ['Crosswind affects balance. What should change?', ['Nothing','Speed, spacing, and use of handholds','Close your eyes','Carry more weight high'],1,'Adjust movement to the environmental force.'],
    ['A sniper position overlooks the center lane. Choose:', ['Center lane','Covered edge with brief crossings','Stand still','Wave'],1,'Reduce time and visibility in the exposed line.'],
    ['An abandoned vehicle blocks cover. Before using it:', ['Assume it is stable','Check fire, movement, and what lies behind it','Crawl under immediately','Start it'],1,'Cover must not become a new hazard.'],
    ['The team must cross one at a time. Who goes first?', ['Whoever shouts','A capable scout who can secure the far side','The injured person alone','Nobody'],1,'The first person establishes safety and support.'],
    ['A warning sign marks structural damage. Best action?', ['Ignore it','Reduce load and use the verified supported path','Gather together','Jump on the deck'],1,'Damaged structures require spacing and load control.'],
    ['The far gate begins closing. What is better than panic?', ['Everyone rushes blindly','Use the rehearsed order and communication','Drop teammates','Change routes mid-crossing'],1,'Order prevents collisions at a narrowing exit.'],
    ['A dropped supply blocks the route. Decide based on:', ['Its price only','Whether recovery risks the mission or people','Who dropped it','Its color'],1,'Essential safety and objective outrank replaceable equipment.'],
    ['You see movement beneath the bridge. What should you avoid?', ['Observation','Leaning into an exposed unstable position','Using cover','Alerting teammates'],1,'Do not create a fall hazard to investigate.'],
    ['Everyone reaches the far side. What closes the level?', ['Run separately','Count the team and move beyond the choke point','Stay at the gate','Celebrate on the bridge'],1,'Clear the danger area and verify the team.']
  ],
  [
    ['The final checkpoint has several lanes. Which one is best?', ['The busiest','The one matching your verified clearance and exit','A closed lane','A random lane'],1,'Match the plan to visible checkpoint information.'],
    ['Your deadline is close. What should not be skipped?', ['A long speech','Final identity, objective, and route check','All communication','The exit'],1,'A ten-second check can prevent total failure.'],
    ['A guard gives a command that conflicts with your safe route. First response?', ['Panic','Pause in cover and verify authority and conditions','Rush them','Drop everything'],1,'Conflicting information needs verification.'],
    ['The objective copy and original look identical. How do you choose?', ['Guess','Use the known verification mark','Take neither','Destroy both'],1,'Predefined authentication resolves look-alike items.'],
    ['An ally arrives late at the rally point. Best action?', ['Leave instantly','Use the agreed grace period while maintaining cover','Shout continuously','Return through every hazard'],1,'A rally plan should include time and contingency.'],
    ['The final gate loses power. What should the team seek?', ['Bare wires','The marked mechanical release','A fight','A new mission'],1,'Emergency exits should have a safe manual control.'],
    ['An enemy tries to lure you away from extraction. Remember:', ['Every challenge must be accepted','The objective is escape, not winning every fight','Points matter most','The route no longer matters'],1,'Mission focus prevents needless detours.'],
    ['You cross the boundary but the objective is missing. Is the mission complete?', ['Yes','No—people and objective must both be verified','Only if time expired','Only if score is high'],1,'Extraction requires the complete mission package.'],
    ['The route behind is compromised. What protects the next team?', ['Silence','Report the hazard without exposing sensitive details','Erase all signs','Send them into it'],1,'Useful debriefing prevents repeated mistakes.'],
    ['What makes the final escape successful?', ['Luck alone','Observation, planning, teamwork, and adaptation','Maximum fighting','Ignoring new information'],1,'The whole game rewards deliberate problem-solving.']
  ]
];

GAME_DATA.levels.forEach((level, index) => {
  level.questions = SCENARIO_QUESTIONS[index].map(([q, opts, correct, hint]) => ({q, opts, correct, hint}));
});

const SCENE_CARD_IMAGES = {};
const levelOneCard = new Image();
levelOneCard.src = 'assets/scenes/level-01-prison-maze.png';
SCENE_CARD_IMAGES[1] = levelOneCard;
