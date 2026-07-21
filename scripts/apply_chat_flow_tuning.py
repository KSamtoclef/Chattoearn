from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
app_path = root / 'assets' / 'js' / 'chatearn-app.js'
index_path = root / 'index.html'
app = app_path.read_text(encoding='utf-8')
index = index_path.read_text(encoding='utf-8')

# Keep the first earning stage short: ₦10,000 bonus + 4 x ₦5,000 replies = ₦30,000.
app = re.sub(
    r"const reward=qualification\.ok\?\(state\.withdrawal\?currentPartner\.rate:\d+\):0;",
    "const reward=qualification.ok?(state.withdrawal?currentPartner.rate:5000):0;",
    app,
    count=1,
)

# More human typing pace and partner presence state.
app = re.sub(
    r"function humanTypingDelay\(text\)\{.*?\n\}",
    "function humanTypingDelay(text){\n const length=Math.min(180,String(text||'').length);\n const readingPause=900+Math.floor(Math.random()*650);\n return Math.min(3200,readingPause+length*9);\n}",
    app,
    count=1,
    flags=re.S,
)

app = app.replace(
    "function openingMessage(){\n if(conversation(currentPartner.name).length)return drawConversation();\n drawConversation();const row=typingIndicator();\n setTimeout(()=>{row.remove();conversation(currentPartner.name).push({id:`OPEN-${currentPartner.name}`,type:'partner',text:currentPartner.opening,time:stamp()});saveState();drawConversation()},900);\n}",
    "function openingMessage(){\n if(conversation(currentPartner.name).length)return drawConversation();\n drawConversation();if($('chatStatus'))$('chatStatus').textContent=`${currentPartner.name} is typing…`;const row=typingIndicator();\n setTimeout(()=>{row.remove();conversation(currentPartner.name).push({id:`OPEN-${currentPartner.name}`,type:'partner',text:currentPartner.opening,time:stamp()});if($('chatStatus'))$('chatStatus').textContent=`🟢 Automated chat partner · Available now · ${currentPartner.flag} ${currentPartner.country}`;saveState();drawConversation()},humanTypingDelay(currentPartner.opening));\n}",
)

app = app.replace(
    "const response=partnerResponse(text),typing=typingIndicator(),replyDelay=humanTypingDelay(text);",
    "const response=partnerResponse(text);if($('chatStatus'))$('chatStatus').textContent=`${currentPartner.name} is typing…`;const typing=typingIndicator(),replyDelay=humanTypingDelay(response.reply);",
)
app = app.replace(
    "setTimeout(()=>{typing.remove();messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});saveState();drawConversation();busy=false;input.disabled=false;input.focus()},replyDelay);",
    "setTimeout(()=>{typing.remove();messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});if($('chatStatus'))$('chatStatus').textContent=`🟢 Automated chat partner · Available now · ${currentPartner.flag} ${currentPartner.country}`;saveState();drawConversation();busy=false;input.disabled=false;input.focus()},replyDelay);",
)

# Remove any status shortcut from the sharing screen and make KYC auto-advance obvious.
app = re.sub(r"<button[^>]*>VIEW WITHDRAWAL STATUS</button>", "", app, flags=re.I)
app = app.replace("shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},1200);", "shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},700);")
app = app.replace("Opening your KYC step now…", "Sharing complete. Opening your KYC page…")

# Build marker and cache bump.
app = re.sub(r"document\.documentElement\.dataset\.build='[^']+'", "document.documentElement.dataset.build='ChatEarn Human Chat Flow 2026.07.21 v2'", app, count=1)
index = re.sub(r"chatearn-app\.js\?v=[^\"']+", "chatearn-app.js?v=20260721-human2", index, count=1)

app_path.write_text(app, encoding='utf-8')
index_path.write_text(index, encoding='utf-8')
