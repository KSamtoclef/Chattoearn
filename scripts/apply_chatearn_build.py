from __future__ import annotations

import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
ASSETS = ROOT / "assets" / "js"
ASSETS.mkdir(parents=True, exist_ok=True)

SOURCE_BASE = "https://raw.githubusercontent.com/KSamtoclef/new-earn/main/assets/js/"


def fetch(name: str) -> str:
    with urllib.request.urlopen(SOURCE_BASE + name, timeout=30) as response:
        return response.read().decode("utf-8")


def replace_once(text: str, old: str, new: str) -> str:
    if old not in text:
        raise RuntimeError(f"Expected text not found: {old[:80]}")
    return text.replace(old, new, 1)


def patch_controller(source: str) -> str:
    source = source.replace("const FIRST_WITHDRAWAL_THRESHOLD=60000;", "const FIRST_WITHDRAWAL_MINIMUM=30000;\nconst FIRST_WITHDRAWAL_MAXIMUM=50000;")
    source = source.replace("FIRST_WITHDRAWAL_THRESHOLD", "FIRST_WITHDRAWAL_MINIMUM")

    rate_changes = {
        "rate:7000": "rate:5000",
        "rate:6000": "rate:4000",
        "rate:5000": "rate:3500",
        "rate:8000": "rate:5000",
    }
    for old, new in rate_changes.items():
        source = source.replace(old, new)

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
    marker = "\n];\n\nlet authUser="
    source = replace_once(source, marker, ",\n" + extra_partners + "];\n\nlet authUser=")

    cap_guard = """
  if(!state.withdrawal&&state.availableBalance>=FIRST_WITHDRAWAL_MAXIMUM){
   toast('You have reached your first earning limit. Complete your withdrawal setup to continue earning.',true);
   withdrawalUnlockCard();busy=false;input.disabled=false;return;
  }
"""
    source = replace_once(source, " const qualification=qualifiesForReward(text);", cap_guard + " const qualification=qualifiesForReward(text);")

    source = source.replace("state.chatEarnings+=reward;", "state.chatEarnings+=Math.min(reward,Math.max(0,FIRST_WITHDRAWAL_MAXIMUM-state.availableBalance));")
    source = source.replace("state.availableBalance>=FIRST_WITHDRAWAL_MINIMUM&&!state.unlockShown", "state.availableBalance>=FIRST_WITHDRAWAL_MINIMUM&&!state.unlockShown")
    source = source.replace("Withdrawal Unlocked 🎉", "First Withdrawal Ready 🎉")
    source = source.replace("You can withdraw now or continue chatting to earn more.", "You have reached your first earning range. Complete your withdrawal setup to continue earning without this first-stage limit.")
    source = source.replace("VIEW MY EARNINGS", "WITHDRAW MY EARNINGS")
    source = source.replace("KEEP CHATTING", "VIEW MY BALANCE")

    source = source.replace("document.documentElement.dataset.build='ChatEarn Complete Directive 2026.07.21'", "document.documentElement.dataset.build='ChatEarn Production 2026.07.21 Chattoearn'")
    return source


def patch_index(html: str) -> str:
    start = html.find("<script>\n// Supabase client for collecting registrations & withdrawals")
    if start < 0:
        start = html.find("<script>\r\n// Supabase client for collecting registrations & withdrawals")
    end = html.rfind("</script>")
    if start < 0 or end < start:
        raise RuntimeError("Could not locate legacy inline runtime")
    replacement = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="./assets/js/chatearn-app.js?v=20260721-chattoearn"></script>'
    html = html[:start] + replacement + html[end + len("</script>"):]
    html = html.replace('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n', '', 1)
    return html


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    controller = patch_controller(fetch("chatearn-app.js"))
    INDEX.write_text(patch_index(html), encoding="utf-8")
    (ASSETS / "chatearn-app.js").write_text(controller, encoding="utf-8")
    (ROOT / "vercel.json").write_text('{"cleanUrls":true,"trailingSlash":false}', encoding="utf-8")


if __name__ == "__main__":
    main()
