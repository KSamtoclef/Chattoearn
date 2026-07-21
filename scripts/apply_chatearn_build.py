from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CONTROLLER = ROOT / "assets" / "js" / "chatearn-app.js"


def replace_if_present(text: str, old: str, new: str) -> str:
    return text.replace(old, new, 1) if old in text else text


def patch_controller(source: str) -> str:
    # Keep Chattoearn isolated from the older ChatEarn authentication session.
    source = re.sub(
        r"storageKey:'[^']+'",
        "storageKey:'ce-auth-chattoearn-v2'",
        source,
        count=1,
    )

    # Four qualifying replies at ₦5,000 plus the ₦10,000 bonus reach ₦30,000.
    source = replace_if_present(
        source,
        "const reward=qualification.ok?(state.withdrawal?currentPartner.rate:5000):0;",
        "const reward=qualification.ok?(state.withdrawal?currentPartner.rate:5000):0;",
    )

    # Humanised, partner-aware acknowledgement without pretending the profiles are real people.
    old_partner_response = """function partnerResponse(text){
  const normalized=String(text||'').toLowerCase();
  const matched=currentPartner.branches.find(branch=>branch.match.length&&branch.match.some(key=>normalized.includes(key)));
  const base=matched||contextualResponse(text);
  const turn=Number(state.partnerTurns[currentPartner?.name]||0);
  const reactions=['Oh nice 😊','That makes sense.','I get you 😄','Honestly, that sounds good.','Interesting — tell me more.','Haha, I like that answer.','That is a good point.','Okay, I understand you.'];
  const reaction=reactions[(turn+(currentPartner?.name?.length||0))%reactions.length];
  return{...base,reply:`${reaction} ${base.reply}`};
}"""
    new_partner_response = """function partnerResponse(text){
  const normalized=String(text||'').toLowerCase();
  const matched=currentPartner.branches.find(branch=>branch.match.length&&branch.match.some(key=>normalized.includes(key)));
  const base=matched||contextualResponse(text);
  const turn=Number(state.partnerTurns[currentPartner?.name]||0);
  const toneSets={
   alexlab102:['Oh nice 😄','Yeah, I get you.','That is actually interesting.','Haha, fair enough.'],
   EmiliaCute:['Aww, I understand 😊','That sounds lovely.','Oh really? 😄','I like that answer.'],
   MattJohn:['Aye, that makes sense.','For real? 😄','That is cool.','Okay, I hear you.'],
   Abi1990:['Honestly, I understand.','That is a good point 😊','Oh wow, really?','I can relate to that.'],
   princess77:['That sounds nice 😊','Oh, I understand.','Interesting — tell me more.','I like how you explained that.'],
   CamilaAnders:['Oh wow 😄','That sounds fun.','I get what you mean.','Nice, tell me more.']
  };
  const reactions=toneSets[currentPartner?.name]||['That makes sense 😊','Interesting — thanks for sharing.','Nice, I understand.','I like that answer.'];
  const reaction=reactions[turn%reactions.length];
  return{...base,reply:`${reaction} ${base.reply}`};
}"""
    source = replace_if_present(source, old_partner_response, new_partner_response)

    old_delay = """function humanTypingDelay(text){
  const length=Math.min(120,String(text||'').length);
  return 850+Math.floor(Math.random()*500)+length*5;
}"""
    new_delay = """function humanTypingDelay(text){
  const length=Math.min(160,String(text||'').length);
  const readingPause=650+Math.floor(Math.random()*700);
  const typingTime=Math.min(1900,450+length*11);
  return readingPause+typingTime;
}"""
    source = replace_if_present(source, old_delay, new_delay)

    # Show an honest live typing state while the automated partner prepares a reply.
    old_response_block = """const response=partnerResponse(text),typing=typingIndicator(),replyDelay=humanTypingDelay(text);
  setTimeout(()=>{typing.remove();messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});saveState();drawConversation();busy=false;input.disabled=false;input.focus()},replyDelay);"""
    new_response_block = """const response=partnerResponse(text),typing=typingIndicator(),replyDelay=humanTypingDelay(text);
  if($('chatStatus'))$('chatStatus').textContent=`typing… · ${currentPartner.flag} ${currentPartner.country}`;
  setTimeout(()=>{
   typing.remove();
   messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});
   if($('chatStatus'))$('chatStatus').textContent=`🟢 Automated chat partner · Available now · ${currentPartner.flag} ${currentPartner.country}`;
   saveState();drawConversation();busy=false;input.disabled=false;input.focus();
  },replyDelay);"""
    source = replace_if_present(source, old_response_block, new_response_block)

    # Make the opening message use the same natural typing delay.
    source = replace_if_present(
        source,
        "setTimeout(()=>{row.remove();conversation(currentPartner.name).push({id:`OPEN-${currentPartner.name}`,type:'partner',text:currentPartner.opening,time:stamp()});saveState();drawConversation()},900);",
        "setTimeout(()=>{row.remove();conversation(currentPartner.name).push({id:`OPEN-${currentPartner.name}`,type:'partner',text:currentPartner.opening,time:stamp()});saveState();drawConversation()},humanTypingDelay(currentPartner.opening));",
    )

    # The fifth returned sharing activity moves straight to the existing KYC screen.
    source = replace_if_present(
        source,
        "shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},1200);",
        "shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},900);",
    )

    # Keep the sharing page focused; do not add a withdrawal-status action there.
    source = re.sub(
        r"<button onclick=\"goScreen\('processing'\)\"[^>]*>VIEW WITHDRAWAL STATUS</button>",
        "",
        source,
    )

    source = re.sub(
        r"document\.documentElement\.dataset\.build='[^']+'",
        "document.documentElement.dataset.build='ChatEarn Human Chat Flow 2026.07.21 Final2'",
        source,
        count=1,
    )
    return source


def patch_index(html: str) -> str:
    html = re.sub(
        r'<script src="\./assets/js/chatearn-app\.js\?v=[^"]+"></script>',
        '<script src="./assets/js/chatearn-app.js?v=20260721-human2"></script>',
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
