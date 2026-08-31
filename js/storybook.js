'use strict';
(() => {
  const levels=window.SNAKES_REVENGE_LEVELS;
  const KEY='snakes_revenge_story_progress_v2';
  const $=id=>document.getElementById(id);
  let saved={completed:[],run:null},run=null,level=null;
  try { const data=JSON.parse(localStorage.getItem(KEY)||'null'); if(data&&Array.isArray(data.completed))saved=data; } catch (_) {}
  const image=$('story-image');
  image.addEventListener('error',()=>{
    if(image.dataset.fallback!=='yes') { image.dataset.fallback='yes';image.src='assets/story/level-01/01-patrol.webp';$('image-status').textContent='The scene artwork could not load. The briefing below still contains everything needed.'; }
  });
  function save() { try{localStorage.setItem(KEY,JSON.stringify(saved));}catch(_){$('progress-status').textContent='Progress could not be saved on this browser. Keep this page open to continue.';} }
  function levelMenu() {
    $('level-select').replaceChildren();
    levels.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=`Level ${item.id}: ${item.title}${saved.completed.includes(item.id)?' · complete':''}`;$('level-select').append(option);});
    $('completed-count').textContent=`${saved.completed.length} of ${levels.length} available levels completed · 20 of 100 scenes built`;
    const resume=saved.run&&levels.find(item=>item.id===saved.run.levelId);
    $('resume-game').hidden=!resume;
    if(resume){$('resume-game').textContent=`RESUME LEVEL ${resume.id} · SCENE ${Math.min(10,saved.run.index+1)}`;$('level-select').value=resume.id;}
  }
  function setImage(scene) {delete image.dataset.fallback;image.src=scene.image;image.alt=scene.title;$('image-status').textContent='';}
  function render() {
    const scene=level.scenes[run.index];
    setImage(scene);
    $('scene-badge').textContent=`LEVEL ${level.id} · SCENE ${run.index+1} OF 10`;
    $('level-label').textContent=`LEVEL ${level.id} · ${level.title.toUpperCase()}`;
    $('question-count').textContent=`SCENE ${run.index+1} OF 10`;
    $('music-era').textContent=level.era;
    $('progress-fill').style.width=`${(run.index+1)*10}%`;
    $('scene-title').textContent=scene.title;
    $('scene-briefing').textContent=scene.briefing;
    $('question-text').textContent=scene.q;
    $('answer-list').replaceChildren();
    const solved=run.solved.includes(run.index);
    scene.opts.forEach((option,i)=>{
      const button=document.createElement('button');button.type='button';button.className='answer-button';button.textContent=`${String.fromCharCode(65+i)}. ${option}`;
      if(solved){button.disabled=true;if(i===scene.correct)button.classList.add('correct');}
      button.addEventListener('click',()=>answer(i,button));$('answer-list').append(button);
    });
    $('answer-feedback').hidden=!solved;$('answer-feedback').textContent=solved?scene.hint:'';
    $('next-scene').hidden=!solved;$('next-scene').textContent=run.index===9?'COMPLETE LEVEL':'NEXT SCENE';
    window.SNAKES_REVENGE_SOUNDTRACK?.setScene(level.trackOffset+run.index);
    const next=level.scenes[run.index+1];if(next){const preload=new Image();preload.src=next.image;}
    saved.run=run;save();window.scrollTo({top:0,behavior:'smooth'});
  }
  function answer(i,button) {
    if(run.solved.includes(run.index))return;
    const scene=level.scenes[run.index];const first=!run.attempted.includes(run.index);
    if(first)run.attempted.push(run.index);
    $('answer-feedback').hidden=false;
    if(i!==scene.correct){button.classList.add('wrong');button.disabled=true;$('answer-feedback').textContent='Try again. '+scene.hint;save();return;}
    run.solved.push(run.index);if(first)run.score+=100;
    $('answer-feedback').textContent='Correct. '+scene.hint;
    [...$('answer-list').children].forEach((item,j)=>{item.disabled=true;if(j===scene.correct)item.classList.add('correct');});
    $('next-scene').hidden=false;save();
    if(run.solved.length===10) {
      if(!saved.completed.includes(level.id)) saved.completed.push(level.id);
      save(); rewardLevel();
    }
  }
  function start(id,resume=false) {
    level=levels.find(item=>item.id===Number(id));if(!level)return;
    const candidate=saved.run;
    const valid=resume&&candidate?.levelId===level.id&&Number.isInteger(candidate.index)&&candidate.index>=0&&candidate.index<10&&Array.isArray(candidate.solved)&&Array.isArray(candidate.attempted);
    run=valid?candidate:{levelId:level.id,index:0,score:0,solved:[],attempted:[]};
    $('start-panel').hidden=true;$('complete-panel').hidden=true;$('question-panel').hidden=false;
    saved.run=run;render();window.SNAKES_REVENGE_SOUNDTRACK?.enable();
  }
  function rewardLevel() {
    if(!run||run.solved.length!==10)return;
    window.SNAKES_REVENGE_REWARDS?.earn('LEVEL_COMPLETED',`level-${level.id}`,{solved:10,firstTry:run.score/100,contentVersion:'20260831-level2'});
  }
  function next() {
    if(!run||!run.solved.includes(run.index))return;
    if(run.index<9){run.index++;render();return;}
    $('question-panel').hidden=true;$('complete-panel').hidden=false;
    $('scene-badge').textContent=`LEVEL ${level.id} COMPLETE`;
    $('complete-label').textContent=`LEVEL ${level.id} · ${level.era}`;
    $('complete-title').textContent=level.id===1?'The rooftop route is open.':'You reached the harbor.';
    $('final-score').textContent=`All 10 challenges solved. ${run.score/100} answered correctly on the first try.`;
    if(!saved.completed.includes(level.id))saved.completed.push(level.id);
    saved.run=null;save();levelMenu();rewardLevel();
    const following=levels.find(item=>item.id===level.id+1);
    $('next-level').hidden=!following;
    $('next-level').textContent=following?`START LEVEL ${following.id} · ${following.era.toUpperCase()}`:'';
    $('more-levels').textContent=following?'Next: ten new scenes and ten 1990s alternative songs.':'Levels 1 and 2 are complete. The next 80 scenes will be added in later releases.';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $('start-game').addEventListener('click',()=>start($('level-select').value));
  $('resume-game').addEventListener('click',()=>start(saved.run?.levelId,true));
  $('next-scene').addEventListener('click',next);
  $('play-again').addEventListener('click',()=>start(level.id));
  $('next-level').addEventListener('click',()=>start(level.id+1));
  $('claim-level-reward').addEventListener('click',rewardLevel);
  $('choose-level').addEventListener('click',()=>{
    $('question-panel').hidden=true;$('complete-panel').hidden=true;$('start-panel').hidden=false;levelMenu();
    window.scrollTo({top:0,behavior:'smooth'});
  });
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,select,button,a')||$('question-panel').hidden)return;
    if(/^[1-4]$/.test(event.key))$('answer-list').children[Number(event.key)-1]?.click();
    else if(event.key==='Enter'&&!$('next-scene').hidden)next();
  });
  levelMenu();
  window.__storybookGame={getState:()=>({levelId:level?.id,index:run?.index,score:run?.score,solved:run?.solved?.length,total:20}),sceneFiles:levels.flatMap(item=>item.scenes.map(scene=>scene.image))};
})();
