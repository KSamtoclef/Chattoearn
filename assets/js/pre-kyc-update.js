(()=>{
'use strict';

// PRE-KYC UPDATE CONFIGURATION
const PRE_KYC_UPDATE_URL='https://jikgykm.com/cl/d2043286aec4e80a';
const STORAGE_PREFIX='ce-pre-kyc-update-v5-';
const REQUIRED_SHARES=7;
const SHARE_RULES_ACK_PREFIX='ce-share-rules-ack-v1-';

let activeUserId=null;
let popupOpen=false;
let returnCheckTimer=null;
let shareRulesInstalled=false;
let lastObservedShareCount=-1;
let authClient=null;
let authListenerInstalled=false;

function validUrl(value){return /^https?:\/\//i.test(String(value||''));}
function completionKey(){return `${STORAGE_PREFIX}${activeUserId}-complete`;}
function pendingKey(){return `${STORAGE_PREFIX}${activeUserId}-pending`;}
function isComplete(){try{return Boolean(activeUserId)&&localStorage.getItem(completionKey())==='1';}catch{return false;}}
function pendingRecord(){
 try{
  if(!activeUserId)return null;
  const value=JSON.parse(localStorage.getItem(pendingKey())||'null');
  return value&&typeof value==='object'?value:null;
 }catch{return null;}
}

// Registration/login can happen after this file loads. Recover the active user
// from ChatEarn's per-user journey key so the final-share popup still works.
function inferActiveUserIdFromJourney(){
 try{
  const keys=Object.keys(localStorage).filter(key=>key.startsWith('ce-state-')&&key!=='ce-state-guest');
  if(!keys.length)return null;
  const matching=keys.find(key=>{
   try{
    const journey=JSON.parse(localStorage.getItem(key)||'null');
    return Boolean(journey?.withdrawal||Number(journey?.sharing?.count||0)>0);
   }catch{return false;}
  })||keys.at(-1);
  return matching.slice('ce-state-'.length)||null;
 }catch{return null;}
}

function ensureActiveUser(){
 if(activeUserId)return activeUserId;
 activeUserId=inferActiveUserIdFromJourney();
 return activeUserId;
}

function readJourneyState(){
 if(!ensureActiveUser())return null;
 try{return JSON.parse(localStorage.getItem(`ce-state-${activeUserId}`)||'null');}
 catch{return null;}
}

function finalShareIsComplete(){
 const journey=readJourneyState();
 return Boolean(journey&&journey.withdrawal&&journey.sharing&&Number(journey.sharing.count||0)>=REQUIRED_SHARES);
}

function activeScreenId(){return document.querySelector('.screen.active')?.id||'';}
function kycIsVisible(){
 const screen=document.getElementById('kyc');
 return Boolean(screen&&screen.classList.contains('active')&&screen.style.display!=='none');
}

function updateKycAccess(){
 const button=document.querySelector('#kyc .btn-complete-kyc');
 if(!button)return;
 if(!finalShareIsComplete()){
  button.disabled=false;
  button.removeAttribute('aria-disabled');
  button.style.opacity='';
  button.style.cursor='';
  button.title='';
  return;
 }
 const complete=isComplete();
 button.disabled=!complete;
 button.setAttribute('aria-disabled',complete?'false':'true');
 button.style.opacity=complete?'1':'.55';
 button.style.cursor=complete?'pointer':'not-allowed';
 button.title=complete?'':'Review the important update first.';
}

function markPending(){
 if(!ensureActiveUser()||!finalShareIsComplete())return false;
 try{
  localStorage.setItem(pendingKey(),JSON.stringify({openedAt:new Date().toISOString(),shareCount:REQUIRED_SHARES}));
  return true;
 }catch{return false;}
}

function markComplete(){
 const pending=pendingRecord();
 if(!pending||Number(pending.shareCount||0)<REQUIRED_SHARES||!finalShareIsComplete())return;
 try{
  localStorage.setItem(completionKey(),'1');
  localStorage.removeItem(pendingKey());
 }catch{}
 popupOpen=false;
 document.getElementById('preKycUpdateModal')?.remove();
 updateKycAccess();
}

// The share-rules warning is informational only and appears on the first share tap.
function shareRulesAckKey(){return `${SHARE_RULES_ACK_PREFIX}${ensureActiveUser()||'guest'}`;}
function shareRulesAcknowledged(){try{return localStorage.getItem(shareRulesAckKey())==='1';}catch{return false;}}
function rememberShareRulesAcknowledgement(){try{localStorage.setItem(shareRulesAckKey(),'1');}catch{}}
function hideShareRulesModal(){document.getElementById('shareRulesModal')?.classList.remove('show');}
function installOneTimeShareRules(){
 if(shareRulesInstalled)return;
 const originalShare=window.__chatEarnOriginalShare;
 if(typeof originalShare!=='function')return;
 shareRulesInstalled=true;
 window.doShareWA=function(){
  if(shareRulesAcknowledged())return originalShare();
  document.getElementById('shareRulesModal')?.classList.add('show');
 };
 window.closeShareRules=hideShareRulesModal;
 window.continueShareRules=function(){rememberShareRulesAcknowledgement();hideShareRulesModal();originalShare();};
 if(shareRulesAcknowledged())hideShareRulesModal();
}

async function resolveUser(){
 try{
  if(!window.supabase){ensureActiveUser();return;}
  if(!authClient){
   authClient=window.supabase.createClient(
    'https://dtjxcgzpwemdgdeinkcl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoiZHRqeGNnenB3ZW1kZ2RlaW5rY2wiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3NzkwODQ4NCwiZXhwIjoyMDkzNDg0NDg0fQ.kGjtOZfK7onzr-3FVMuSljiJ3emllxtGdepxrFVUPPM',
    {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'ce-auth-chattoearn-v2'}}
   );
  }
  const result=await authClient.auth.getSession();
  activeUserId=result?.data?.session?.user?.id||inferActiveUserIdFromJourney();
  if(!authListenerInstalled){
   authListenerInstalled=true;
   authClient.auth.onAuthStateChange((_event,session)=>{
    activeUserId=session?.user?.id||inferActiveUserIdFromJourney();
    lastObservedShareCount=-1;
    installOneTimeShareRules();
    updateKycAccess();
    handleFinalShareTransition();
   });
  }
 }catch{activeUserId=inferActiveUserIdFromJourney();}
 installOneTimeShareRules();
 updateKycAccess();
 handleFinalShareTransition();
}

function buildModal(){
 const overlay=document.createElement('div');
 overlay.id='preKycUpdateModal';
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-labelledby','preKycUpdateTitle');
 overlay.style.cssText='position:fixed;inset:0;z-index:12000;background:rgba(0,0,0,.88);display:grid;place-items:center;padding:18px';
 overlay.innerHTML=`
  <div style="width:min(100%,390px);background:#171717;border:2px solid #FFD600;border-radius:20px;padding:24px 20px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,.55)">
   <div style="font-size:40px;margin-bottom:8px">⚠️</div>
   <h2 id="preKycUpdateTitle" style="font-size:24px;line-height:1.2;margin:0 0 12px;color:#fff;font-weight:950">Important Update</h2>
   <p style="font-size:16px;color:#fff;font-weight:800;margin:0 0 10px">Please don’t skip this page.</p>
   <p style="font-size:14px;color:#bdbdbd;line-height:1.65;margin:0 0 20px">An important update is available. Before you continue, take 30 seconds to review it below.</p>
   <button id="preKycCheckNow" type="button" style="width:100%;min-height:62px;border:0;border-radius:14px;background:#FFD600;color:#111;font-size:20px;font-weight:1000;letter-spacing:.5px;box-shadow:0 10px 28px rgba(255,214,0,.30);cursor:pointer">CHECK NOW</button>
   <div style="font-size:10px;color:#777;margin-top:10px">External page · Your seven-share progress is saved</div>
  </div>`;
 overlay.querySelector('#preKycCheckNow').addEventListener('click',()=>{
  if(!validUrl(PRE_KYC_UPDATE_URL)||!finalShareIsComplete()||!markPending())return;
  window.open(PRE_KYC_UPDATE_URL,'_blank','noopener,noreferrer');
 });
 return overlay;
}

function showGate(){
 if(!ensureActiveUser()||!finalShareIsComplete()||!kycIsVisible()||isComplete()||popupOpen)return;
 popupOpen=true;
 updateKycAccess();
 document.body.appendChild(buildModal());
}

// Explicit final-share transition: Share 7 -> KYC screen -> Important Update.
function handleFinalShareTransition(){
 if(!ensureActiveUser())return;
 const journey=readJourneyState();
 const count=Number(journey?.sharing?.count||0);
 const pending=Boolean(journey?.sharing?.pending);
 const screen=activeScreenId();
 const crossedFinalShare=lastObservedShareCount<REQUIRED_SHARES&&count>=REQUIRED_SHARES;
 lastObservedShareCount=count;

 if(count<REQUIRED_SHARES||pending||isComplete())return;
 if(screen==='sharewall'||screen==='kyc'||crossedFinalShare){
  if(!kycIsVisible()&&typeof window.goScreen==='function')window.goScreen('kyc');
  setTimeout(()=>{updateKycAccess();showGate();},60);
 }
}

function checkReturn(){
 if(document.visibilityState==='hidden'||!pendingRecord())return;
 clearTimeout(returnCheckTimer);
 returnCheckTimer=setTimeout(markComplete,400);
}

document.addEventListener('click',event=>{
 const button=event.target.closest?.('#kyc .btn-complete-kyc');
 if(!button||!finalShareIsComplete()||isComplete())return;
 event.preventDefault();
 event.stopImmediatePropagation();
 showGate();
},true);

const observer=new MutationObserver(()=>{
 updateKycAccess();
 handleFinalShareTransition();
 if(kycIsVisible())showGate();
});
observer.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});

setInterval(()=>{
 if(!activeUserId)resolveUser();
 handleFinalShareTransition();
},250);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){resolveUser();checkReturn();handleFinalShareTransition();}});
window.addEventListener('focus',()=>{resolveUser();checkReturn();handleFinalShareTransition();});
window.addEventListener('pageshow',()=>{resolveUser();checkReturn();setTimeout(()=>{installOneTimeShareRules();updateKycAccess();handleFinalShareTransition();},120);});

document.addEventListener('DOMContentLoaded',()=>{installOneTimeShareRules();resolveUser();});
if(document.readyState!=='loading')setTimeout(()=>{installOneTimeShareRules();resolveUser();},0);
})();