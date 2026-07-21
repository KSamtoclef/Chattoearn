from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CONTROLLER = ROOT / "assets" / "js" / "chatearn-app.js"
CACHE_VERSION = "20260721-postkyc-ads1"


def patch_controller(source: str) -> str:
    source = re.sub(
        r"const KYC_CONFIG=\{url:'[^']*',active:(?:true|false)\};",
        "const KYC_CONFIG={url:'https://example.com',active:true};",
        source,
        count=1,
    )

    ad_manager = """const AD_MANAGER={
 inlineChat:[
  {id:'inline_chat_1',label:'Sponsored',title:'Featured Opportunity',description:'Explore today’s featured opportunity.',buttonText:'VIEW OPPORTUNITY',url:'https://example.com',active:true,minimumMessages:3,maximumShowsPerSession:4},
  {id:'inline_chat_2',label:'Sponsored Reward',title:'Today’s Sponsored Offer',description:'See another featured opportunity selected for active users.',buttonText:'OPEN OFFER',url:'https://example.com',active:true,minimumMessages:3,maximumShowsPerSession:4}
 ],
 partnerList:[{id:'partner_list_1',label:'Sponsored',title:'Featured Opportunity',description:'See today’s sponsored opportunity.',buttonText:'OPEN',url:'https://example.com',active:true}],
 inPage:[
  {id:'inpage_1',label:'Sponsored',title:'Featured In-Page Offer',description:'Explore this sponsored opportunity while you continue chatting.',buttonText:'VIEW OFFER',url:'https://example.com',active:true},
  {id:'inpage_2',label:'Sponsored Reward',title:'Active User Opportunity',description:'A featured sponsored opportunity for active ChatEarn users.',buttonText:'OPEN NOW',url:'https://example.com',active:true}
 ],
 buttonAds:[
  {id:'button_ad_1',label:'Sponsored',title:'Sponsored Opportunity',description:'Open this featured sponsored offer.',buttonText:'VIEW SPONSORED OFFER',url:'https://example.com',active:true},
  {id:'button_ad_2',label:'Sponsored Reward',title:'Featured Reward Opportunity',description:'Explore another sponsored opportunity.',buttonText:'OPEN OPPORTUNITY',url:'https://example.com',active:true}
 ],
 halfScreen:[{id:'half_screen_1',label:'Sponsored',title:'Featured Sponsored Opportunity',description:'Explore this featured opportunity.',buttonText:'VIEW OPPORTUNITY',url:'https://example.com',active:true,maximumShowsPerSession:1}],
 popup:[{id:'popup_1',label:'Sponsored',title:'Sponsored Reward',description:'See today’s sponsored opportunity.',buttonText:'OPEN OPPORTUNITY',url:'https://example.com',active:true,maximumShowsPerSession:1}],
 earnings:[{id:'earnings_ad_1',label:'Sponsored',title:'Earnings Opportunity',description:'Explore today’s sponsored reward.',buttonText:'OPEN OPPORTUNITY',url:'https://example.com',active:true}]
};"""
    source = re.sub(
        r"const AD_MANAGER=\{.*?\n\};",
        ad_manager,
        source,
        count=1,
        flags=re.S,
    )

    source = source.replace(
        "referralCode:'',unlockShown:false,ad:",
        "referralCode:'',unlockShown:false,adsUnlocked:false,activityPoints:0,ad:",
        1,
    )
    source = source.replace(
        "function randomInterval(){return 3+Math.floor(Math.random()*3)}",
        "function randomInterval(){return 3+Math.floor(Math.random()*2)}",
        1,
    )

    source = source.replace(
        "const ad=AD_MANAGER.inlineChat.find(item=>item.id===message.adId);if(ad)body.appendChild(adCard(ad,'inlineChat'));return;",
        "const ad=findAdById(message.adId);if(ad)body.appendChild(adCard(ad,message.placement||'inlineChat'));return;",
        1,
    )

    ad_functions = """function eligibleAds(group){return(group||[]).filter(ad=>ad.active&&validUrl(ad.url))}
function allAds(){return[...AD_MANAGER.inlineChat,...AD_MANAGER.partnerList,...AD_MANAGER.inPage,...AD_MANAGER.buttonAds,...AD_MANAGER.halfScreen,...AD_MANAGER.popup,...AD_MANAGER.earnings]}
function findAdById(id){return allAds().find(ad=>ad.id===id)}
function awardActivityPoints(){state.activityPoints=Number(state.activityPoints||0)+10;saveState();toast('+10 Activity Points added. Activity Points are not cash or payment approval.')}
function adCard(ad,placement){
 const card=document.createElement('div');card.dataset.adId=ad.id;card.style.cssText='margin:14px 0;padding:14px;border:1px solid rgba(255,215,0,.28);background:rgba(255,215,0,.07);border-radius:14px';
 card.innerHTML=`<div style="font-size:10px;color:#FFD54F;font-weight:900">${esc(ad.label||'Sponsored')}</div><b style="display:block;margin-top:3px">${esc(ad.title)}</b>${ad.description?`<p style="font-size:12px;color:#b7c0ba;margin:5px 0 10px">${esc(ad.description)}</p>`:''}<button style="width:100%;padding:11px;border:0;border-radius:10px;background:#FFD54F;color:#171300;font-weight:900">${esc(ad.buttonText)}</button>`;
 card.querySelector('button').onclick=()=>{awardActivityPoints();window.open(ad.url,'_blank','noopener,noreferrer')};return card;
}
function showOverlayAd(ad,placement){
 const overlay=document.createElement('div');overlay.dataset.adOverlay=placement;overlay.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.76);display:grid;place-items:center;padding:20px';
 const card=adCard(ad,placement);card.style.cssText+=';width:min(100%,420px);max-height:55vh;overflow:auto;position:relative';
 const close=document.createElement('button');close.textContent='×';close.setAttribute('aria-label','Close sponsored panel');close.style.cssText='position:absolute;right:9px;top:6px;width:34px;height:34px;border:0;background:#242424;color:#fff;border-radius:50%;font-size:23px;z-index:2';close.onclick=()=>overlay.remove();card.prepend(close);overlay.appendChild(card);document.body.appendChild(overlay);
}
function showFeedAd(ad,placement){const body=$('chatBody');if(!body)return;const card=adCard(ad,placement);card.dataset.temporaryAd='1';body.appendChild(card);body.scrollTop=body.scrollHeight}
function chooseAd(group){const ads=eligibleAds(group);if(!ads.length)return null;const last=state.ad.lastAdId;return ads.find(ad=>ad.id!==last)||ads[0]}
function maybeShowAd(){
 if(!state.adsUnlocked||state.ad.replyCounter<state.ad.nextInterval)return;
 const placements=['inlineChat','inPage','buttonAds','popup','halfScreen'];
 const available=placements.filter(name=>eligibleAds(AD_MANAGER[name]).length&&name!==state.ad.lastPlacement);
 if(!available.length)return;
 const placement=available[Math.floor(Math.random()*available.length)],ad=chooseAd(AD_MANAGER[placement]);if(!ad)return;
 if(placement==='popup'&&sessionStorage.getItem('ce-popup-shown'))return resetAdCycle();
 if(placement==='halfScreen'&&sessionStorage.getItem('ce-half-screen-shown'))return resetAdCycle();
 if(placement==='inlineChat'){
  conversation(currentPartner.name).push({id:`AD-${ad.id}-${Date.now()}`,type:'ad',adId:ad.id,placement,time:stamp()});saveState();drawConversation();
 }else if(placement==='inPage'||placement==='buttonAds')showFeedAd(ad,placement);
 else{
  sessionStorage.setItem(placement==='popup'?'ce-popup-shown':'ce-half-screen-shown','1');showOverlayAd(ad,placement);
 }
 state.ad.shown[ad.id]=Number(state.ad.shown[ad.id]||0)+1;state.ad.lastAdId=ad.id;state.ad.lastPlacement=placement;resetAdCycle();
}
function resetAdCycle(){state.ad.replyCounter=0;state.ad.nextInterval=randomInterval();saveState()}
function maybeHalfScreen(){}
function mountPartnerAd(){if(!state.adsUnlocked)return;const ad=chooseAd(AD_MANAGER.partnerList),host=document.querySelector('#dashboard .foreigner-list');if(!ad||!host||$('partnerListAd'))return;const wrapper=adCard(ad,'partnerList');wrapper.id='partnerListAd';host.prepend(wrapper)}
function mountEarningsAd(){if(!state.adsUnlocked)return;const ad=chooseAd(AD_MANAGER.earnings),host=document.querySelector('#earnings');if(!ad||!host||$('earningsAd'))return;const wrapper=adCard(ad,'earnings');wrapper.id='earningsAd';host.appendChild(wrapper)}"""

    source = re.sub(
        r"function eligibleAds\(group\)\{.*?function mountEarningsAd\(\)\{.*?\n\}",
        ad_functions,
        source,
        count=1,
        flags=re.S,
    )

    source = re.sub(
        r"let actions=\$\('processingActions'\);.*?actions\.innerHTML='.*?';",
        """let actions=$('processingActions');
 if(!actions){actions=document.createElement('div');actions.id='processingActions';const title=document.querySelector('#processing .pp-title');title?.after(actions)}
 actions.style.cssText='width:calc(100% - 32px);max-width:440px;margin:18px auto 24px;padding:18px;border:2px solid rgba(0,230,118,.55);border-radius:18px;background:rgba(0,200,83,.12);display:grid;gap:10px;order:-1';
 actions.innerHTML='<div style="text-align:center;font-size:15px;font-weight:900;color:#69F0AE">Continue chatting and keep earning</div><button onclick="returnToChat()" style="width:100%;padding:19px 14px;border:0;border-radius:14px;background:#00C853;color:#001b0b;font-size:17px;font-weight:950;box-shadow:0 8px 24px rgba(0,200,83,.28)">RETURN TO CHAT & CONTINUE EARNING</button>';""",
        source,
        count=1,
        flags=re.S,
    )

    source = re.sub(
        r"window\.returnToChat=\(\)=>\{continueLastChat\(\);toast\('Your withdrawal request is awaiting review\. Continue chatting and earning while you wait\.'\)\};",
        "window.returnToChat=()=>{state.adsUnlocked=true;state.ad.replyCounter=0;state.ad.nextInterval=randomInterval();saveState();continueLastChat();toast('Your withdrawal request is awaiting review. Continue chatting and earning while you wait.')} ;",
        source,
        count=1,
    )

    source = re.sub(
        r"document\.documentElement\.dataset\.build='[^']+'",
        "document.documentElement.dataset.build='ChatEarn Post-KYC Ads 2026.07.21'",
        source,
        count=1,
    )
    return source


def patch_index(html: str) -> str:
    html = re.sub(
        r'<script src="\./assets/js/chatearn-app\.js\?v=[^"]+"></script>',
        f'<script src="./assets/js/chatearn-app.js?v={CACHE_VERSION}"></script>',
        html,
        count=1,
    )
    return html


def main() -> None:
    controller = CONTROLLER.read_text(encoding="utf-8")
    index = INDEX.read_text(encoding="utf-8")
    CONTROLLER.write_text(patch_controller(controller), encoding="utf-8")
    INDEX.write_text(patch_index(index), encoding="utf-8")


if __name__ == "__main__":
    main()
