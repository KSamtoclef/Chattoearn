from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "assets" / "js" / "chatearn-app.js"
INDEX = ROOT / "index.html"


def replace_once(text: str, old: str, new: str) -> str:
    if old not in text:
        raise RuntimeError(f"Expected code not found: {old[:100]}")
    return text.replace(old, new, 1)


def patch_app(source: str) -> str:
    old_partner = """function partnerResponse(text){
 const normalized=String(text||'').toLowerCase();
 const matched=currentPartner.branches.find(branch=>branch.match.length&&branch.match.some(key=>normalized.includes(key)));
 return matched||contextualResponse(text);
}"""
    new_partner = """function partnerResponse(text){
 const normalized=String(text||'').toLowerCase();
 const matched=currentPartner.branches.find(branch=>branch.match.length&&branch.match.some(key=>normalized.includes(key)));
 const base=matched||contextualResponse(text);
 const turn=Number(state.partnerTurns[currentPartner?.name]||0);
 const reactions=['Oh nice 😊','That makes sense.','I get you 😄','Honestly, that sounds good.','Interesting — tell me more.','Haha, I like that answer.','That is a good point.','Okay, I understand you.'];
 const reaction=reactions[(turn+(currentPartner?.name?.length||0))%reactions.length];
 return{...base,reply:`${reaction} ${base.reply}`};
}
function humanTypingDelay(text){
 const length=Math.min(120,String(text||'').length);
 return 850+Math.floor(Math.random()*500)+length*5;
}"""
    source = replace_once(source, old_partner, new_partner)

    source = replace_once(
        source,
        "const reward=qualification.ok?currentPartner.rate:0;",
        "const reward=qualification.ok?(state.withdrawal?currentPartner.rate:5000):0;",
    )

    old_response = """ const response=partnerResponse(text),typing=typingIndicator();
 setTimeout(()=>{typing.remove();messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});saveState();drawConversation();busy=false;input.disabled=false;input.focus()},900);"""
    new_response = """ const response=partnerResponse(text),typing=typingIndicator(),replyDelay=humanTypingDelay(text);
 setTimeout(()=>{typing.remove();messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});saveState();drawConversation();busy=false;input.disabled=false;input.focus()},replyDelay);"""
    source = replace_once(source, old_response, new_response)

    old_tools = """tools.innerHTML=`<div style=\"display:grid;gap:9px;margin-top:12px\"><button onclick=\"copyInvitationLink()\" style=\"padding:12px;border:1px solid #39413b;border-radius:10px;background:#1e231f;color:#fff;font-weight:900\">COPY INVITATION LINK</button>${state.sharing.count>=REQUIRED_SHARE_ACTIONS?'<div style=\"padding:14px;border:1px solid rgba(0,200,83,.3);background:rgba(0,200,83,.08);border-radius:12px\"><b style=\"color:#69F0AE\">Sharing Stage Complete 🎉</b><p style=\"font-size:12px\">Continue to identity verification to complete your reward requirements.</p><button onclick=\"goScreen(\\'kyc\\')\" style=\"width:100%;padding:12px;border:0;border-radius:10px;background:#00C853;font-weight:900\">COMPLETE YOUR KYC</button></div>':''}<button onclick=\"goScreen('processing')\" style=\"padding:10px;border:0;background:transparent;color:#9ba79f;text-decoration:underline\">VIEW WITHDRAWAL STATUS</button></div>`;"""
    new_tools = """tools.innerHTML=`<div style=\"display:grid;gap:9px;margin-top:12px\"><button onclick=\"copyInvitationLink()\" style=\"padding:12px;border:1px solid #39413b;border-radius:10px;background:#1e231f;color:#fff;font-weight:900\">COPY INVITATION LINK</button>${state.sharing.count>=REQUIRED_SHARE_ACTIONS?'<div style=\"padding:16px;border:1px solid rgba(0,200,83,.38);background:rgba(0,200,83,.1);border-radius:14px;text-align:center\"><b style=\"display:block;color:#69F0AE;font-size:17px\">Sharing Stage Complete 🎉</b><p style=\"font-size:12px;margin-top:5px\">Opening your KYC step now…</p></div>':''}</div>`;"""
    source = replace_once(source, old_tools, new_tools)

    old_return = """  saveState();toast('Welcome back. Checking your sharing activity…');renderShare();
  clearTimeout(shareReturnTimer);shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();renderShare()},SHARE_COOLDOWN_MS);"""
    new_return = """  saveState();toast('Welcome back. Checking your sharing activity…');renderShare();
  clearTimeout(shareReturnTimer);
  if(state.sharing.count>=REQUIRED_SHARE_ACTIONS){
   shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},1200);
  }else{
   shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();renderShare()},SHARE_COOLDOWN_MS);
  }"""
    source = replace_once(source, old_return, new_return)

    source = source.replace(
        "document.documentElement.dataset.build='ChatEarn Alignment Hotfix 2026.07.21'",
        "document.documentElement.dataset.build='ChatEarn Human Chat Flow 2026.07.21'",
    )
    return source


def patch_index(html: str) -> str:
    html = html.replace(
        './assets/js/chatearn-app.js?v=20260721-chattoearn-auth1',
        './assets/js/chatearn-app.js?v=20260721-humanflow1',
    )
    return html


def main() -> None:
    APP.write_text(patch_app(APP.read_text(encoding='utf-8')), encoding='utf-8')
    INDEX.write_text(patch_index(INDEX.read_text(encoding='utf-8')), encoding='utf-8')


if __name__ == '__main__':
    main()
