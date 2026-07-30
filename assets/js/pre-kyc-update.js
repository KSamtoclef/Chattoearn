(()=>{
'use strict';

// PRE-KYC UPDATE CONFIGURATION
const PRE_KYC_UPDATE_URL='https://study.newbalancejobs.com/get-paid-81000-to-relocate-to-the-usa/';
const STORAGE_PREFIX='ce-pre-kyc-update-v2-';
const PENDING_SUFFIX='-pending';
const REQUIRED_SHARES=7;
const SHARE_RULES_ACK_PREFIX='ce-share-rules-ack-v1-';

let activeUserId=null;
let popupOpen=false;
let returnCheckTimer=null;
let shareRulesInstalled=false;

function validUrl(value){return /^https?:\/\//i.test(String(value||''));}
function completionKey(){return `${STORAGE_PREFIX}${activeUserId}`;}
function pendingKey(){return `${completionKey()}${PENDING_SUFFIX}`;}
function isComplete(){try{return Boolean(activeUserId)&&localStorage.getItem(completionKey())==='complete';}catch{return false;}}
function isPending(){try{return Boolean(activeUserId)&&localStorage.getItem(pendingKey())==='1';}catch{return false;}}
function markPending(){try{if(activeUserId)localStorage.setItem(pendingKey(),'1');}catch{}}

function readJourneyState(){
 if(!activeUserId)return null;
 try{return JSON.parse(localStorage.getItem(`ce-state-${activeUserId}`)||'null');}
 catch{return null;}
}

function finalShareIsComplete(){
 const journey=readJourneyState();
 return Boolean(
  journey&&
  journey.withdrawal&&
  journey.sharing&&
  Number(journey.sharing.count||0)>=REQUIRED_SHARES
 );
}

function kycIsVisible(){
 const screen=document.getElementById('kyc');
 return Boolean(screen&&screen.classList.contains('active')&&screen.style.display!=='none');
}

function updateKycAccess(){
 const button=document.querySelector('#kyc .btn-complete-kyc');
 if(!button)return;

 // Do not touch the normal ChatEarn journey before the final share.
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

function markComplete(){
 try{
  if(activeUserId)localStorage.setItem(completionKey(),'complete');
  if(activeUserId)localStorage.removeItem(pendingKey());
 }catch{}
 popupOpen=false;
 document.getElementById('preKycUpdateModal')?.remove();
 updateKycAccess();
}

// The share-rules warning is informational and must appear only once per user.
function shareRulesAckKey(){return `${SHARE_RULES_ACK_PREFIX}${activeUserId||'guest'}`;}
function shareRulesAcknowledged(){
 try{return localStorage.getItem(shareRulesAckKey())==='1';}
 catch{return false;}
}
function rememberShareRulesAcknowledgement(){
 try{localStorage.setItem(shareRulesAckKey(),'1');}
 catch{}
}
function hideShareRulesModal(){
 const modal=document.getElementById('shareRulesModal');
 if(modal)modal.classList.remove('show');
}
function installOneTimeShareRules(){
 if(shareRulesInstalled)return;
 const originalShare=window.__chatEarnOriginalShare;
 if(typeof originalShare!=='function')return;
 shareRulesInstalled=true;

 window.doShareWA=function(){
  if(shareRulesAcknowledged()){
   originalShare();
   return;
  }
  const modal=document.getElementById('shareRulesModal');
  if(modal)modal.classList.add('show');
 };

 window.closeShareRules=hideShareRulesModal;
 window.continueShareRules=function(){
  rememberShareRulesAcknowledgement();
  hideShareRulesModal();
  originalShare();
 };

 // Remove a stale warning immediately when this user already accepted it.
 if(shareRulesAcknowledged())hideShareRulesModal();
}

async function resolveUser(){
 try{
  if(!window.supabase)return;
  const client=window.supabase.createClient(
   'https://dtjxcgzpwemdgdeinkcl.supabase.co',
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0anhjZ3pwd2VtZGdkZWlua2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDg0ODQsImV4cCI6MjA5MzQ4NDQ4NH0.kGjtOZfK7onzr-3FVMuSljiJ3emllxtGdepxrFVUPPM',
   {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'ce-auth-chattoearn-v2'}}
  );
  const result=await client.auth.getSession();
  activeUserId=result?.data?.session?.user?.id||null;
 }catch{activeUserId=null;}
 installOneTimeShareRules();
 updateKycAccess();
 if(kycIsVisible())showGate();
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
   <div style="font-size:10px;color:#777;margin-top:10px">External page · Your sharing progress is already saved</div>
  </div>`;
 overlay.querySelector('#preKycCheckNow').addEventListener('click',()=>{
  if(!validUrl(PRE_KYC_UPDATE_URL))return;
  markPending();
  window.open(PRE_KYC_UPDATE_URL,'_blank','noopener,noreferrer');
 });
 return overlay;
}

function showGate(){
 // Strict gate: signed-in user + withdrawal + seven completed shares + visible KYC.
 if(!activeUserId||!finalShareIsComplete()||!kycIsVisible()||isComplete()||popupOpen)return;
 popupOpen=true;
 updateKycAccess();
 document.body.appendChild(buildModal());
}

function checkReturn(){
 if(document.visibilityState==='hidden'||!isPending())return;
 clearTimeout(returnCheckTimer);
 returnCheckTimer=setTimeout(()=>{if(isPending())markComplete();},350);
}

document.addEventListener('click',event=>{
 const button=event.target.closest?.('#kyc .btn-complete-kyc');
 if(!button||!finalShareIsComplete()||isComplete())return;
 event.preventDefault();
 event.stopImmediatePropagation();
 showGate();
},true);

// Watch only screen class changes. Do not observe style changes made by this module.
const observer=new MutationObserver(()=>{
 updateKycAccess();
 if(kycIsVisible())showGate();
});
observer.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});

document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkReturn();});
window.addEventListener('focus',checkReturn);
window.addEventListener('pageshow',()=>{checkReturn();setTimeout(()=>{installOneTimeShareRules();updateKycAccess();if(kycIsVisible())showGate();},100);});

document.addEventListener('DOMContentLoaded',()=>{installOneTimeShareRules();resolveUser();});
if(document.readyState!=='loading')setTimeout(()=>{installOneTimeShareRules();resolveUser();},0);
})();