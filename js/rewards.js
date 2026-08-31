'use strict';
(() => {
  const KEY = 'snakes_revenge_pending_rewards_v1';
  const GAME = 'SNAKES_REVENGE';
  const $ = id => document.getElementById(id);
  let queue = Promise.resolve();
  let shareBusy = false;
  let copyConfirmation = null;
  function pending() {
    const records = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(records)) throw new Error('Pending reward data needs review.');
    return records;
  }
  function engine() {
    if (!window.InfinityUnifiedWallet?.UnifiedInfinityWallet) throw new Error('Wallet could not load. Reload to reconnect.');
    return new window.InfinityUnifiedWallet.UnifiedInfinityWallet();
  }
  function walletId() { try { return engine().state.currentWalletId || null; } catch (_) { return null; } }
  function save(records) { localStorage.setItem(KEY, JSON.stringify(records)); }
  function status(message) { $('reward-status').textContent = message; }
  function render() {
    try {
      const wallet = engine(), id = wallet.state.currentWalletId;
      const balance = id ? wallet.balance(id, 'STAR_COIN').toFixed(2) : '0.00';
      $('starcoin-balance').textContent = balance;
      $('game-starcoin-balance').textContent = balance;
      $('connect-rewards').textContent = id ? 'Sync pending rewards' : 'Connect unified wallet';
      $('reward-wallet-id').textContent = id ? 'Wallet: ' + id : 'Use the same browser wallet linked from StarQuest.';
      $('pending-count').textContent = `${pending().length} pending reward${pending().length === 1 ? '' : 's'}`;
      document.dispatchEvent(new CustomEvent('infinity:wallet-updated'));
    } catch (error) { status(error.message); }
  }
  function exclusive(fn) {
    const run = () => navigator.locks ? navigator.locks.request('snakes-revenge-pending-rewards', fn) : fn();
    const result = queue.then(run, run); queue = result.catch(() => {}); return result;
  }
  async function flush() {
    let active = walletId();
    if (!active && pending().some(item => !item.walletId)) {
      const wallet = engine();
      active = wallet.createWallet({displayName:'Unified Infinity Wallet'}).walletId;
    }
    if (!active) { status('Reward saved as pending. Connect the unified wallet below to collect it.'); render(); return; }
    const records = pending();
    let credited = 0, duplicates = 0;
    for (const record of records) {
      // An award bound to another wallet must never move when accounts switch.
      if (record.walletId && record.walletId !== active) continue;
      record.walletId = active;
      save(records);
      const wallet = engine();
      if (!wallet.creditStarCoinReward) throw new Error('Wallet reward support is not loaded yet. Reload, then sync pending rewards.');
      const result = await wallet.creditStarCoinReward({walletId:active, gameId:GAME,
        rewardKind:record.kind, rewardId:record.id, proof:record.proof});
      if (result.credited) credited += 1; else duplicates += 1;
      record.done = true;
      save(records.filter(item => !item.done));
    }
    status(credited ? `Added ${(credited / 10).toFixed(1)} StarCoin to your unified wallet.`
      : duplicates ? 'This reward is already in your wallet; it was not added twice.' : 'No pending rewards for this wallet.');
    render();
  }
  function earn(kind, id, proof = {}) {
    return exclusive(async () => {
      const records = pending(), active = walletId();
      if (!records.some(item => item.kind === kind && item.id === id && item.walletId === active)) {
        records.push({kind, id, walletId:active, proof, createdAt:new Date().toISOString()}); save(records);
      }
      await flush();
    }).catch(error => { status('Reward not confirmed: ' + error.message + ' Use Sync pending rewards to retry.'); render(); });
  }
  $('connect-rewards').addEventListener('click', () => exclusive(async () => {
    const wallet = engine();
    if (!wallet.state.currentWalletId) wallet.createWallet({displayName:'Unified Infinity Wallet'});
    await flush();
  }).catch(error => status('Could not connect: ' + error.message)));
  async function share(kind, id, data) {
    if (shareBusy) return;
    shareBusy = true;
    copyConfirmation = null;
    $('confirm-shared').hidden = true;
    const output = $('share-status');
    try {
      if (navigator.share) {
        await navigator.share(data);
        output.textContent = 'Share action completed.';
        await earn(kind, id, {method:'native-share', confirmation:'client-confirmed', url:data.url});
      } else {
        await navigator.clipboard.writeText(data.url);
        copyConfirmation = {kind,id,url:data.url};
        output.textContent = 'Link copied. Paste and share it, then confirm below. Copying alone earns no reward.';
        $('confirm-shared').hidden = false;
      }
    } catch (error) {
      output.textContent = error.name === 'AbortError' ? 'Share canceled. No reward added.' : 'Sharing did not finish. No reward added.';
    } finally { shareBusy = false; }
  }
  $('share-game').addEventListener('click', () => share('GAME_SHARED','game',{
    title:"Snake's Revenge",url:'https://www-infinity4.github.io/ESCAPE-FROM-NEW-YORK/?v=level2'}));
  $('share-song').addEventListener('click', () => {
    const track=window.SNAKES_REVENGE_SOUNDTRACK?.currentTrack();
    if (track) share('SONG_SHARED',track.videoId,{title:`${track.title} — ${track.artist}`,url:`https://www.youtube.com/watch?v=${track.videoId}`});
  });
  $('confirm-shared').addEventListener('click', () => {
    if (!copyConfirmation) return;
    const receipt=copyConfirmation;copyConfirmation=null;$('confirm-shared').hidden=true;
    $('share-status').textContent='Your share confirmation was recorded.';
    earn(receipt.kind,receipt.id,{method:'clipboard-user-confirmed',confirmation:'self-reported',url:receipt.url});
  });
  function recover() {
    return exclusive(async () => {
      const progress = JSON.parse(localStorage.getItem('snakes_revenge_story_progress_v2') || 'null');
      const completed = new Set((progress?.completed || []).filter(id => id === 1 || id === 2));
      const run = progress?.run;
      if ([1,2].includes(run?.levelId) && Array.isArray(run.solved) && Array.from({length:10},(_,i)=>i).every(i=>run.solved.includes(i))) completed.add(run.levelId);
      const records = pending();
      const wallet = engine(), active = wallet.state.currentWalletId;
      for (const id of completed) {
        const rewardId = `level-${id}`;
        const eventId = 'game-reward:' + [active,GAME,'LEVEL_COMPLETED',rewardId].map(encodeURIComponent).join(':');
        if (!wallet.processedEventIds.has(eventId) && !records.some(item=>item.kind==='LEVEL_COMPLETED' && item.id===rewardId && (!item.walletId || item.walletId===active)))
          records.push({kind:'LEVEL_COMPLETED',id:rewardId,walletId:active,proof:{recoveredFromSavedProgress:true},createdAt:new Date().toISOString()});
      }
      save(records);
      if (records.length) await flush(); else render();
    }).catch(error=>status('Could not recover rewards: '+error.message));
  }
  window.addEventListener('storage', render);
  window.addEventListener('focus', recover);
  window.SNAKES_REVENGE_REWARDS = {earn,render};
  render();
  recover();
})();
