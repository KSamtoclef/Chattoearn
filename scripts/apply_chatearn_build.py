from __future__ import annotations

import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
ASSETS = ROOT / "assets" / "js"
ASSETS.mkdir(parents=True, exist_ok=True)

SOURCE_BASE = "https://raw.githubusercontent.com/KSamtoclef/new-earn/main/assets/js/"
CHATTOEARN_SUPABASE_URL = "https://dtjxcgzpwemdgdeinkcl.supabase.co"
CHATTOEARN_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0anhjZ3pwd2VtZGdkZWlua2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDg0ODQsImV4cCI6MjA5MzQ4NDQ4NH0.kGjtOZfK7onzr-3FVMuSljiJ3emllxtGdepxrFVUPPM"


def fetch(name: str) -> str:
    with urllib.request.urlopen(SOURCE_BASE + name, timeout=30) as response:
        return response.read().decode("utf-8")


def replace_once(text: str, old: str, new: str) -> str:
    if old not in text:
        raise RuntimeError(f"Expected text not found: {old[:80]}")
    return text.replace(old, new, 1)


def patch_controller(source: str) -> str:
    source = re.sub(
        r"const SUPABASE_URL='[^']+';",
        f"const SUPABASE_URL='{CHATTOEARN_SUPABASE_URL}';",
        source,
        count=1,
    )
    source = re.sub(
        r"const SUPABASE_ANON_KEY='[^']+';",
        f"const SUPABASE_ANON_KEY='{CHATTOEARN_SUPABASE_ANON_KEY}';",
        source,
        count=1,
    )
    source = source.replace("storageKey:'ce-auth-v6'", "storageKey:'ce-auth-chattoearn-v1'")

    source = source.replace(
        "const FIRST_WITHDRAWAL_THRESHOLD=60000;",
        "const FIRST_WITHDRAWAL_MINIMUM=30000;\nconst FIRST_WITHDRAWAL_MAXIMUM=50000;",
    )
    source = source.replace("FIRST_WITHDRAWAL_THRESHOLD", "FIRST_WITHDRAWAL_MINIMUM")

    rate_map = {7000: 5000, 6000: 4000, 5000: 3500, 8000: 5000}
    source = re.sub(
        r"rate:(7000|6000|5000|8000)",
        lambda match: f"rate:{rate_map[int(match.group(1))]}",
        source,
    )

    source = source.replace("const AD_CONFIG={", "const AD_MANAGER={")
    source = source.replace("AD_CONFIG", "AD_MANAGER")

    extra_partners = r'''
{name:'MayaBright',initials:'MB',flag:'🇫🇷',country:'France',language:'English',rate:3500,opening:'Hi 😊 What is something good that happened to you today?',branches:[
 {match:['school','class','exam'],reply:'School can be intense. Which subject are you enjoying most?',suggestions:['Computer science','Business','Creative subjects']},
 {match:['work','business','online'],reply:'That sounds productive. What part of the work interests you most?',suggestions:['The creativity','The income potential','Learning new skills']},
 {match:[],reply:'What do you normally do when you want to relax?',suggestions:['Listen to music','Watch movies','Spend time with friends']}
]},
{name:'LiamTalks',initials:'LT',flag:'🇮🇪',country:'Ireland',language:'English',rate:4000,opening:'Hey 👋 Are you having a busy or relaxed day?',branches:[
 {match:['busy'],reply:'What has kept you busiest today?',suggestions:['School work','My job','A personal project']},
 {match:['relaxed','calm'],reply:'Nice. How do you like spending a calm day?',suggestions:['Watching films','Listening to music','Sleeping and resting']},
 {match:[],reply:'What is one goal you are working toward right now?',suggestions:['Finishing school','Growing a business','Learning a digital skill']}
]},
{name:'NoraConnect',initials:'NC',flag:'🇳🇱',country:'Netherlands',language:'English',rate:4500,opening:'Hello 😊 What topic can you talk about for hours?',branches:[
 {match:['music'],reply:'Music says a lot about people. Which artist is always on your playlist?',suggestions:['Burna Boy','Davido','Wizkid']},
 {match:['tech','computer','coding'],reply:'Technology is moving fast. What would you like to build someday?',suggestions:['A mobile app','A useful website','An online business']},
 {match:[],reply:'What is something you would love to become better at?',suggestions:['Communication','Technology','Business']}
]},
{name:'EthanDaily',initials:'ED',flag:'🇳🇿',country:'New Zealand',language:'English',rate:3000,opening:'Hey there 😄 What is the weather like where you are?',branches:[
 {match:['sunny','hot','warm'],reply:'That sounds nice. What do you enjoy doing on sunny days?',suggestions:['Going out','Staying indoors','Meeting friends']},
 {match:['rain','raining','cold'],reply:'Rainy days can be peaceful. What do you normally do indoors?',suggestions:['Watch movies','Work online','Sleep']},
 {match:[],reply:'Which season do you enjoy most?',suggestions:['Dry season','Rainy season','I like both']}
]},
{name:'OliviaNow',initials:'ON',flag:'🇸🇪',country:'Sweden',language:'English',rate:4000,opening:'Hi! 😊 What kind of skills are you learning at the moment?',branches:[
 {match:['design'],reply:'Design is a useful skill. What kind of design interests you?',suggestions:['Graphics design','UI design','Brand design']},
 {match:['web','coding','programming'],reply:'That is exciting. What would you like to create first?',suggestions:['A portfolio','A business website','A mobile app']},
 {match:[],reply:'What skill would help you most this year?',suggestions:['Digital marketing','Web development','Communication']}
]},
{name:'NoahChats',initials:'NC',flag:'🇧🇪',country:'Belgium',language:'English',rate:3500,opening:'Hello 👋 What is your favourite thing about Nigeria?',branches:[
 {match:['food','jollof','suya'],reply:'Nigerian food looks amazing. Which meal should a visitor try first?',suggestions:['Jollof rice','Suya','Egusi soup']},
 {match:['music','afrobeats'],reply:'Afrobeats is popular here too. Who should I listen to next?',suggestions:['Burna Boy','Asake','Tems']},
 {match:[],reply:'What place in Nigeria would you recommend to a visitor?',suggestions:['Lagos','Abuja','Ogun State']}
]},
{name:'GraceWorld',initials:'GW',flag:'🇸🇬',country:'Singapore',language:'English',rate:5000,opening:'Hi 😊 Are you more interested in business, technology, or creativity?',branches:[
 {match:['business'],reply:'Business can create many opportunities. What kind would you like to build?',suggestions:['An online brand','A tech startup','A service business']},
 {match:['technology','tech'],reply:'Technology changes everything. Which area interests you most?',suggestions:['Artificial intelligence','Web development','Cybersecurity']},
 {match:['creative','creativity'],reply:'Creative work is powerful. What do you enjoy creating?',suggestions:['Graphics','Videos','Written content']},
 {match:[],reply:'What type of opportunity are you looking for right now?',suggestions:['A job opportunity','A business idea','A learning opportunity']}
]},
{name:'LeoFriendly',initials:'LF',flag:'🇨🇭',country:'Switzerland',language:'English',rate:4500,opening:'Hey 😊 If you could travel anywhere next year, where would you go?',branches:[
 {match:['canada'],reply:'Canada is a popular choice. What attracts you there?',suggestions:['The opportunities','The cities','Education']},
 {match:['uk','london'],reply:'London has a lot of energy. What would you want to see first?',suggestions:['The city centre','A football match','The museums']},
 {match:[],reply:'What is the main reason you would like to travel?',suggestions:['Education','Work opportunities','Tourism']}
]}
'''

    markers = [
        "\n];\n\n\nconst PERSONALITY_OPENERS=",
        "\n];\n\nconst PERSONALITY_OPENERS=",
        "\n];\n\nlet authUser=",
    ]
    for marker in markers:
        if marker in source:
            suffix = marker[4:]
            source = source.replace(marker, ",\n" + extra_partners + "];\n" + suffix, 1)
            break
    else:
        raise RuntimeError("Could not locate partner-list closing marker")

    cap_guard = """
  if(!state.withdrawal&&state.availableBalance>=FIRST_WITHDRAWAL_MAXIMUM){
   toast('You have reached your first earning limit. Complete your withdrawal setup to continue earning.',true);
   withdrawalUnlockCard();busy=false;input.disabled=false;return;
  }
"""
    source = replace_once(
        source,
        " const qualification=qualifiesForReward(text);",
        cap_guard + " const qualification=qualifiesForReward(text);",
    )

    source = source.replace(
        "state.chatEarnings+=reward;",
        "state.chatEarnings+=state.withdrawal?reward:Math.min(reward,Math.max(0,FIRST_WITHDRAWAL_MAXIMUM-state.availableBalance));",
    )
    source = source.replace("Withdrawal Unlocked 🎉", "First Withdrawal Ready 🎉")
    source = source.replace(
        "You can withdraw now or continue chatting to earn more.",
        "You have reached your first earning limit. Complete your withdrawal setup to continue earning without this first-stage limit.",
    )
    source = source.replace("VIEW MY EARNINGS", "WITHDRAW MY EARNINGS")
    source = source.replace("KEEP CHATTING", "VIEW MY BALANCE")

    old_catch = "}catch(error){toast(error.message||'Registration failed.',true)}"
    new_catch = """}catch(error){
   const message=String(error?.message||'Registration failed.');
   if(/already|registered|exists/i.test(message)){
    if($('loginEmail'))$('loginEmail').value=email;
    openLogin();toast('This email already has an account. Log in to continue.',true);
   }else toast(message,true)
  }"""
    source = source.replace(old_catch, new_catch)

    source = source.replace(
        "document.documentElement.dataset.build='ChatEarn Complete Directive 2026.07.21'",
        "document.documentElement.dataset.build='ChatEarn Production 2026.07.21 Chattoearn Auth1'",
    )
    return source


def ensure_login_ui(html: str) -> str:
    phone_block = '''    <div class="form-group">
      <label class="form-label">Phone Number (WhatsApp)</label>
      <input class="form-input" id="regPhone" type="tel" placeholder="e.g. 08012345678" maxlength="14">
    </div>
'''
    html = html.replace(phone_block, "")
    html = html.replace(
        '<button class="btn-register" onclick="doRegister()">Create Account & Get ₦10,000 →</button>',
        '<button class="btn-register" id="regSubmitBtn" onclick="doRegister()">Create Account & Get ₦10,000 →</button>',
    )
    html = html.replace(
        '<div class="reg-login">Already have an account? <span>Log In</span></div>',
        '<div class="reg-login">Already have an account? <span onclick="openLogin()" role="button" tabindex="0">Log In</span></div>',
    )

    modal_css = '''
.login-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.78);display:none;align-items:flex-end;justify-content:center;padding:16px;backdrop-filter:blur(5px)}
.login-modal.show{display:flex}
.login-sheet{width:min(100%,420px);background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px;position:relative;animation:slideUp .25s ease}
.login-close{position:absolute;right:14px;top:10px;border:0;background:transparent;color:var(--w);font-size:28px;cursor:pointer}
.login-title{font-size:22px;font-weight:900;margin-bottom:5px}
.login-sub{font-size:13px;color:var(--text);margin-bottom:20px}
.login-error{display:none;color:var(--red);font-size:12px;margin-bottom:10px}
.reg-login span{cursor:pointer}
'''
    if ".login-modal{" not in html:
        html = html.replace("</style>", modal_css + "\n</style>", 1)

    modal_html = '''
<div class="login-modal" id="loginModal" aria-hidden="true">
  <div class="login-sheet">
    <button type="button" class="login-close" onclick="closeLogin()" aria-label="Close login">×</button>
    <div class="login-title">Welcome Back</div>
    <div class="login-sub">Log in and continue your chats and earnings.</div>
    <div class="login-error" id="loginError"></div>
    <div class="form-group"><label class="form-label">Email Address</label><input class="form-input" id="loginEmail" type="email" autocomplete="email" placeholder="Enter your email"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="loginPass" type="password" autocomplete="current-password" placeholder="Enter your password"></div>
    <button class="btn-register" id="loginBtn" onclick="doLogin()">Log In & Continue →</button>
  </div>
</div>
'''
    if 'id="loginModal"' not in html:
        html = html.replace('<div class="page-wrap">', modal_html + '\n<div class="page-wrap">', 1)
    return html


def patch_index(html: str) -> str:
    start = html.find("<script>\n// Supabase client for collecting registrations & withdrawals")
    if start < 0:
        start = html.find("<script>\r\n// Supabase client for collecting registrations & withdrawals")
    end = html.rfind("</script>")

    replacement = (
        '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n'
        '<script src="./assets/js/chatearn-app.js?v=20260721-chattoearn-auth1"></script>'
    )
    if start >= 0 and end > start:
        html = html[:start] + replacement + html[end + len("</script>"):]
        html = html.replace(
            '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n',
            "",
            1,
        )
    else:
        html = re.sub(
            r'<script src="\./assets/js/chatearn-app\.js\?v=[^"]+"></script>',
            '<script src="./assets/js/chatearn-app.js?v=20260721-chattoearn-auth1"></script>',
            html,
            count=1,
        )

    visible_rate_changes = {
        "₦15,000/reply": "₦5,000/reply",
        "₦12,000/reply": "₦4,500/reply",
        "₦10,000/reply": "₦4,000/reply",
        "₦8,000/reply": "₦3,500/reply",
        "₦15K/reply": "₦5K/reply",
        "₦12K/reply": "₦4.5K/reply",
        "₦10K/reply": "₦4K/reply",
        "₦8K/reply": "₦3.5K/reply",
        "+₦15K/reply": "+₦5K/reply",
        "+₦8,000 Earned!": "+₦4,000 Earned!",
    }
    for old, new in visible_rate_changes.items():
        html = html.replace(old, new)

    return ensure_login_ui(html)


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    controller = patch_controller(fetch("chatearn-app.js"))
    INDEX.write_text(patch_index(html), encoding="utf-8")
    (ASSETS / "chatearn-app.js").write_text(controller, encoding="utf-8")
    (ROOT / "vercel.json").write_text(
        '{"cleanUrls":true,"trailingSlash":false}',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
