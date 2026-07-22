from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CONTROLLER = ROOT / "assets" / "js" / "chatearn-app.js"
CACHE_VERSION = "20260722-long-chat-opportunities1"


def replace_ad(source: str, ad_id: str, *, label: str, title: str, description: str,
               button: str, theme: str, icon: str) -> str:
    pattern = rf"\{{id:'{re.escape(ad_id)}'.*?url:'([^']*)'(.*?active:true.*?)\}}"

    def repl(match: re.Match[str]) -> str:
        url = match.group(1).replace("httpsr://", "https://")
        tail = match.group(2)
        extras = ""
        if "minimumMessages:" in tail:
            value = re.search(r"minimumMessages:(\d+)", tail)
            if value:
                extras += f",minimumMessages:{value.group(1)}"
        if "maximumShowsPerSession:" in tail:
            value = re.search(r"maximumShowsPerSession:(\d+)", tail)
            if value:
                extras += f",maximumShowsPerSession:{value.group(1)}"
        return (
            "{" + f"id:'{ad_id}',label:'{label}',title:'{title}',"
            f"description:'{description}',buttonText:'{button}',url:'{url}',active:true,"
            f"theme:'{theme}',icon:'{icon}'{extras}" + "}"
        )

    return re.sub(pattern, repl, source, count=1)


def patch_controller(source: str) -> str:
    # Keep the user's configured KYC and advertisement URLs. Only repair malformed httpsr:// URLs.
    source = source.replace("httpsr://", "https://")

    ad_copy = {
        "inline_chat_1": dict(
            label="Quick Task", title="Complete Today’s 60-Second Challenge",
            description="Open this quick activity and collect 10 Activity Points for participating.",
            button="START QUICK TASK →", theme="emerald", icon="⚡",
        ),
        "inline_chat_2": dict(
            label="Daily Discovery", title="A New Opportunity Just Unlocked",
            description="Take a look at today’s featured activity before it rotates out of your chat.",
            button="SEE WHAT UNLOCKED →", theme="violet", icon="✨",
        ),
        "partner_list_1": dict(
            label="Community Pick", title="Popular With Active Members Today",
            description="Explore the opportunity other ChatEarn members are opening right now.",
            button="EXPLORE COMMUNITY PICK →", theme="blue", icon="🔥",
        ),
        "inpage_1": dict(
            label="Point Mission", title="Complete This Optional Activity",
            description="Open the task, check what is available, and receive 10 Activity Points.",
            button="COMPLETE THE MISSION →", theme="gold", icon="🎯",
        ),
        "inpage_2": dict(
            label="Surprise Unlock", title="Your Next Discovery Is Ready",
            description="A fresh activity has been selected for your current chat session.",
            button="REVEAL THE SURPRISE →", theme="rose", icon="🎁",
        ),
        "button_ad_1": dict(
            label="Fast Action", title="One Tap Away From Your Next Task",
            description="Open this short activity without leaving your conversation progress behind.",
            button="OPEN THE TASK →", theme="orange", icon="🚀",
        ),
        "button_ad_2": dict(
            label="Member Access", title="An Extra Opportunity Is Available",
            description="Available to members who completed their first withdrawal journey.",
            button="ACCESS OPPORTUNITY →", theme="cyan", icon="🔓",
        ),
        "half_screen_1": dict(
            label="Featured Challenge", title="Ready for a Different Kind of Task?",
            description="Pause for a moment, explore this featured activity, then continue your chat.",
            button="VIEW FEATURED CHALLENGE →", theme="indigo", icon="🏆",
        ),
        "popup_1": dict(
            label="Limited Discovery", title="This Opportunity May Rotate Soon",
            description="Check the current activity while it is still available in this session.",
            button="CHECK IT NOW →", theme="magenta", icon="⏳",
        ),
        "earnings_ad_1": dict(
            label="Activity Centre", title="Build Your Activity Point Balance",
            description="Explore the current task and collect 10 Activity Points when you open it.",
            button="OPEN ACTIVITY →", theme="teal", icon="💎",
        ),
    }
    for ad_id, config in ad_copy.items():
        source = replace_ad(source, ad_id, **config)

    chat_engine = r"""const PERSONALITY_STYLES=[
 {tone:'warm',openers:['That makes sense.','I get what you mean 😊','That is interesting.','Honestly, I like that answer.'],quirks:['I tend to notice small details.','I always enjoy hearing how other people see things.']},
 {tone:'playful',openers:['Haha, fair answer 😄','Okay, that made me smile.','You know what? I like that.','Wait, that is actually a good point.'],quirks:['I ask too many questions sometimes 😂','My curiosity always wins.']},
 {tone:'thoughtful',openers:['I have been thinking about that.','That is a thoughtful answer.','There is more to that than people realize.','I understand your point.'],quirks:['I enjoy conversations that go beyond small talk.','Different opinions make chats more interesting.']},
 {tone:'direct',openers:['Fair enough.','I understand.','Good answer.','That is clear.'],quirks:['I usually say exactly what I think.','I prefer honest answers over perfect ones.']},
 {tone:'curious',openers:['Now I am curious.','That caught my attention.','Tell me something—','Interesting. Let me ask you this:'],quirks:['I can turn almost anything into a question.','Learning about people is genuinely interesting.']}
];
const CHAT_STAGES=[
 {name:'daily life',questions:['What has taken most of your attention today?','What part of your day has been unexpectedly good?','What usually helps you start a difficult day?','Are your days normally planned or spontaneous?','What is one small thing that improved your mood recently?','What do you normally do immediately after waking up?','Which part of the day feels most productive to you?','What has been keeping you busy this week?']},
 {name:'personality',questions:['What is something people usually misunderstand about you?','Are you naturally quiet or more talkative around people you trust?','What quality do you value most in yourself?','What kind of situation brings out your confidence?','Do you make decisions quickly or think for a long time?','What is one habit you are trying to improve?','What type of person do you find easiest to talk to?','Would your friends describe you as serious or playful?']},
 {name:'interests',questions:['What topic can keep you talking for a long time?','What hobby would you try if time and money were not a problem?','What have you learned recently just because you were curious?','What kind of content do you enjoy watching online?','Is there a skill you wish came naturally to you?','What activity makes time pass quickly for you?','What interest have you had since childhood?','What is something popular that you personally do not enjoy?']},
 {name:'music and entertainment',questions:['Which song can instantly improve your mood?','Do you enjoy discovering new artists or replaying favourites?','What movie or series stayed in your mind after you finished it?','Which artist would you like to see perform live?','Do you prefer comedy, action, drama, or documentaries?','What kind of video always makes you stop scrolling?','Would you rather attend a concert or watch a major football match?','What fictional character do you find memorable?']},
 {name:'food and culture',questions:['Which meal feels like comfort food to you?','What Nigerian food should every visitor try?','Do you enjoy cooking or do you prefer someone else handling it?','What food combination do you love that other people might question?','Is there a meal connected to a good memory for you?','What local tradition do you appreciate most?','Which city has the best food in your opinion?','What dish would you confidently serve to a foreign visitor?']},
 {name:'friends and community',questions:['What makes someone a genuinely good friend?','Do you prefer a small close circle or many friends?','What is the nicest thing a friend has done for you?','How do you normally handle disagreements with people you care about?','What makes you trust someone?','Are you usually the adviser in your friend group?','What kind of support matters most when life gets stressful?','What does loyalty mean to you?']},
 {name:'goals and growth',questions:['What goal matters most to you this year?','What skill could change your future if you mastered it?','What usually keeps you going when progress feels slow?','Where would you like to be two years from now?','What is one small action you can take toward your goal this week?','Would you rather build a business or grow in a career?','What achievement would make you proud of yourself?','Who inspires the way you think about success?']},
 {name:'travel and places',questions:['Which country would you visit first if travel was free?','Do you prefer busy cities or peaceful natural places?','What place in Nigeria would you recommend to someone visiting for the first time?','Would you rather travel alone or with people close to you?','What would you want to experience on your dream trip?','Which city looks interesting to you even though you have never been there?','Would you live abroad permanently or eventually return home?','What is the longest journey you have taken?']},
 {name:'opinions and choices',questions:['Would you choose more free time or more money?','Do you think talent or consistency matters more?','Is it better to plan carefully or learn while doing?','Would you rather be respected or widely liked?','Do social media platforms connect people or distract them more?','What is one opinion you have changed recently?','Would you choose a stable path or a risky opportunity with greater potential?','What everyday rule do you think makes little sense?']},
 {name:'stories and imagination',questions:['What is one funny thing that happened to you recently?','What childhood memory still makes you smile?','If you could repeat one day from your life, which would it be?','What would you do first if you woke up with one million naira?','If you could instantly master one skill, what would you choose?','What is the most unexpected compliment you have received?','If your life this month had a title, what would it be?','What is a harmless mistake you can laugh about now?']},
 {name:'future conversation',questions:['What would a genuinely good life look like to you?','What do you hope never changes about your personality?','What do you want people to remember about you?','Which future technology are you most curious about?','What is something you hope to understand better as you grow older?','What kind of home or environment would make you happiest?','What is one experience you definitely want to have someday?','What does success mean to you personally?']}
];
const CONTEXT_LIBRARY=[
 {keys:['school','student','university','course','study','exam'],followups:['Which part of your studies interests you most?','What subject has challenged you recently?','What would make this school year successful for you?'],suggestions:['I enjoy practical projects','Some courses are challenging','Finishing well is my goal']},
 {keys:['work','job','business','online','career'],followups:['What part of that work interests you most?','What are you currently trying to improve?','What kind of opportunity would help you move forward?'],suggestions:['I enjoy solving problems','I am building something new','I want more opportunities']},
 {keys:['music','song','artist','afrobeats'],followups:['Which artist have you played most lately?','What kind of song improves your mood?','Which song would you recommend to me?'],suggestions:['I listen to Afrobeats','Gospel lifts my mood','I have several favourites']},
 {keys:['food','meal','rice','suya','jollof','amala','egusi'],followups:['What makes that meal special to you?','Do you prefer cooking it or buying it?','What other Nigerian meal would you recommend?'],suggestions:['Jollof rice is a favourite','I enjoy local meals','Suya is a good choice']},
 {keys:['lagos','ogun','abuja','nigeria','city','state'],followups:['What do you enjoy most about living there?','What would you show a first-time visitor?','Is your area usually calm or busy?'],suggestions:['The people are welcoming','It is usually lively','The community feels familiar']},
 {keys:['goal','future','dream','plan'],followups:['What is the next realistic step toward that?','What could make that goal difficult?','Who supports you with that plan?'],suggestions:['I want to grow my skills','I want to build a business','Consistency is my next step']}
];
function partnerMemory(){
 const name=currentPartner?.name||'default';
 state.chatMemory??={};
 state.chatMemory[name]??={facts:{},recentQuestions:[],topicCounts:{},lastUserText:'',stage:0};
 return state.chatMemory[name];
}
function rememberUser(text){
 const memory=partnerMemory(),raw=String(text||'').trim(),lower=raw.toLowerCase();memory.lastUserText=raw;
 const patterns=[
  ['location',/(?:i(?:'m| am)? from|i live in|i stay in)\s+([a-z ]{2,30})/i],
  ['study',/(?:i study|i'm studying|i am studying)\s+([a-z0-9 &-]{2,45})/i],
  ['work',/(?:i work as|my job is|i work in)\s+([a-z0-9 &-]{2,45})/i],
  ['favourite',/(?:my favou?rite (?:is|artist is|food is)|i love)\s+([a-z0-9 '&-]{2,40})/i],
  ['goal',/(?:my goal is|i want to|i hope to)\s+([a-z0-9 ,'-]{3,60})/i]
 ];
 patterns.forEach(([key,pattern])=>{const match=raw.match(pattern);if(match)memory.facts[key]=match[1].trim().replace(/[.!?]+$/,'')});
 return memory;
}
function memoryReference(memory,turn){
 const facts=Object.entries(memory.facts||{});if(!facts.length||turn%4!==0)return'';
 const [key,value]=facts[turn%facts.length];
 const refs={location:`You mentioned ${value} earlier.`,study:`Earlier you said you study ${value}.`,work:`You told me you work in ${value}.`,favourite:`I remember you said you like ${value}.`,goal:`I remember your goal is to ${value}.`};
 return refs[key]||'';
}
function chooseFreshQuestion(memory,candidates,turn){
 const recent=memory.recentQuestions||[];
 const available=candidates.filter(question=>!recent.includes(question));
 const pool=available.length?available:candidates;
 const question=pool[(turn*3+(currentPartner?.name?.length||0))%pool.length];
 memory.recentQuestions=[...recent.slice(-11),question];return question;
}
function currentTimeGreeting(){
 const hour=new Date().getHours();
 if(hour<11)return 'How is your morning going so far?';
 if(hour<17)return 'How has your day been going?';
 return 'How has your evening been?';
}
function contextualResponse(text){
 const memory=rememberUser(text),normalized=String(text||'').toLowerCase(),turn=Number(state.partnerTurns[currentPartner?.name]||0);
 const personality=PERSONALITY_STYLES[(currentPartner?.name?.length||0)%PERSONALITY_STYLES.length];
 const context=CONTEXT_LIBRARY.find(item=>item.keys.some(key=>normalized.includes(key)));
 const stageIndex=Math.floor(turn/7)%CHAT_STAGES.length,stage=CHAT_STAGES[stageIndex];memory.stage=stageIndex;
 let candidates=context?.followups||stage.questions;
 if(turn===0)candidates=[currentTimeGreeting(),...candidates];
 const question=chooseFreshQuestion(memory,candidates,turn);
 const opener=personality.openers[turn%personality.openers.length];
 const reference=memoryReference(memory,turn);
 const quirk=turn>0&&turn%9===0?personality.quirks[turn%personality.quirks.length]:'';
 const reply=[opener,reference,quirk,question].filter(Boolean).join(' ');
 const suggestions=context?.suggestions||['That is a good question','Let me think about it','How about you?'];
 saveState();return{reply,suggestions};
}"""

    source = re.sub(
        r"const PERSONALITY_OPENERS=\[.*?function contextualResponse\(text\)\{.*?\n\}",
        chat_engine,
        source,
        count=1,
        flags=re.S,
    )

    source = source.replace(
        "referralCode:'',unlockShown:false,adsUnlocked:false,activityPoints:0,ad:",
        "referralCode:'',unlockShown:false,adsUnlocked:false,activityPoints:0,chatMemory:{},ad:",
        1,
    )
    source = source.replace(
        "state.ad={...freshState().ad,...(state.ad||{})};",
        "state.ad={...freshState().ad,...(state.ad||{})};state.chatMemory={...(state.chatMemory||{})};",
        1,
    )

    partner_response = r"""function partnerResponse(text){
 const turn=Number(state.partnerTurns[currentPartner?.name]||0),base=contextualResponse(text);
 const direct=String(text||'').toLowerCase();
 if(/how about you|what about you|and you\??$/.test(direct)){
  const profile=[
   `I enjoy learning how people live in different places. ${base.reply}`,
   `I am usually curious and a little playful once I am comfortable 😄 ${base.reply}`,
   `Music, travel stories, and honest conversations are easy topics for me. ${base.reply}`
  ][turn%3];return{...base,reply:profile};
 }
 return base;
}"""
    source = re.sub(
        r"function partnerResponse\(text\)\{.*?\n\}
function humanTypingDelay",
        partner_response + "\nfunction humanTypingDelay",
        source,
        count=1,
        flags=re.S,
    )
    source = re.sub(
        r"function humanTypingDelay\(text\)\{.*?\n\}",
        """function humanTypingDelay(text){
 const length=Math.min(420,String(text||'').length),jitter=Math.floor(Math.random()*1300);
 return Math.min(6800,1100+jitter+length*12);
}""",
        source,
        count=1,
        flags=re.S,
    )

    themed_card = r"""function adCard(ad,placement){
 const themes={
  emerald:{accent:'#00E676',soft:'rgba(0,230,118,.12)',border:'rgba(0,230,118,.42)',text:'#001b0b'},
  violet:{accent:'#B388FF',soft:'rgba(179,136,255,.13)',border:'rgba(179,136,255,.42)',text:'#16052b'},
  blue:{accent:'#64B5F6',soft:'rgba(100,181,246,.13)',border:'rgba(100,181,246,.42)',text:'#041725'},
  gold:{accent:'#FFD54F',soft:'rgba(255,213,79,.13)',border:'rgba(255,213,79,.42)',text:'#241900'},
  rose:{accent:'#FF80AB',soft:'rgba(255,128,171,.13)',border:'rgba(255,128,171,.42)',text:'#290611'},
  orange:{accent:'#FFAB40',soft:'rgba(255,171,64,.13)',border:'rgba(255,171,64,.42)',text:'#251100'},
  cyan:{accent:'#18FFFF',soft:'rgba(24,255,255,.11)',border:'rgba(24,255,255,.38)',text:'#002020'},
  indigo:{accent:'#8C9EFF',soft:'rgba(140,158,255,.13)',border:'rgba(140,158,255,.42)',text:'#080d2b'},
  magenta:{accent:'#EA80FC',soft:'rgba(234,128,252,.13)',border:'rgba(234,128,252,.42)',text:'#25052a'},
  teal:{accent:'#64FFDA',soft:'rgba(100,255,218,.12)',border:'rgba(100,255,218,.40)',text:'#00251d'}
 };
 const theme=themes[ad.theme]||themes.gold,card=document.createElement('div');card.dataset.adId=ad.id;
 card.style.cssText=`margin:14px 0;padding:16px;border:1px solid ${theme.border};background:${theme.soft};border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.18)`;
 card.innerHTML=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:20px">${esc(ad.icon||'✨')}</span><span style="font-size:10px;color:${theme.accent};font-weight:950;letter-spacing:.8px;text-transform:uppercase">${esc(ad.label||'Featured')}</span></div><b style="display:block;font-size:15px;line-height:1.35">${esc(ad.title)}</b>${ad.description?`<p style="font-size:12px;color:#c1cac4;line-height:1.55;margin:7px 0 12px">${esc(ad.description)}</p>`:''}<button style="width:100%;padding:12px;border:0;border-radius:11px;background:${theme.accent};color:${theme.text};font-weight:950">${esc(ad.buttonText)}</button><div style="font-size:9px;color:#8f9992;text-align:center;margin-top:7px">Optional external activity · Activity Points are not cash</div>`;
 card.querySelector('button').onclick=()=>{awardActivityPoints();window.open(ad.url,'_blank','noopener,noreferrer')};return card;
}"""
    source = re.sub(
        r"function adCard\(ad,placement\)\{.*?\n\}
function showOverlayAd",
        themed_card + "\nfunction showOverlayAd",
        source,
        count=1,
        flags=re.S,
    )

    source = re.sub(
        r"document\.documentElement\.dataset\.build='[^']+'",
        "document.documentElement.dataset.build='ChatEarn Long Chat Opportunities 2026.07.22'",
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
