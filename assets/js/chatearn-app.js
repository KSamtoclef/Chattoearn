(()=>{'use strict';

const SUPABASE_URL='https://dtjxcgzpwemdgdeinkcl.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0anhjZ3pwd2VtZGdkZWlua2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDg0ODQsImV4cCI6MjA5MzQ4NDQ4NH0.kGjtOZfK7onzr-3FVMuSljiJ3emllxtGdepxrFVUPPM';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'ce-auth-chattoearn-v2'}});

const SIGNUP_BONUS=10000;
const FIRST_WITHDRAWAL_MINIMUM=30000;
const FIRST_WITHDRAWAL_MAXIMUM=50000;
const REQUIRED_SHARE_ACTIONS=7;
const SHARE_COOLDOWN_MS=2000;
const KYC_CONFIG={url:'https://jikgykm.com/cl/a9f1535a330a2652',active:true};
const AD_MANAGER={
 inlineChat:[
  {id:'inline_chat_1',label:'Quick Task',title:'Complete Today’s 60-Second Challenge',description:'Open this quick activity and collect 10 Activity Points for participating.',buttonText:'START QUICK TASK →',url:'https://oatstuckalfred.com/s16jgyby6?key=c00293cc40e08e6d40264506f115e024',active:true,theme:'emerald',icon:'⚡',minimumMessages:3,maximumShowsPerSession:4},
  {id:'inline_chat_2',label:'Daily Discovery',title:'A New Opportunity Just Unlocked',description:'Take a look at today’s featured activity before it rotates out of your chat.',buttonText:'SEE WHAT UNLOCKED →',url:'https://omg10.com/4/11279843',active:true,theme:'violet',icon:'✨',minimumMessages:3,maximumShowsPerSession:4},
  {id:'inline_chat_3',label:'Featured Opportunity',title:'Another Activity Is Available',description:'Open this optional activity and return to continue your chat.',buttonText:'OPEN FEATURED ACTIVITY →',url:'https://oatstuckalfred.com/trxz4e2k9?key=e5fca8368b788c42dc7608d035de37f0',active:true,theme:'blue',icon:'🌟',minimumMessages:3,maximumShowsPerSession:4}
 ],
 partnerList:[{id:'partner_list_1',label:'Community Pick',title:'Popular With Active Members Today',description:'Explore the opportunity other ChatEarn members are opening right now.',buttonText:'EXPLORE COMMUNITY PICK →',url:'https://www.effectivecpmnetwork.com/t7jwkt8bc4?key=1d77add4feba7fc9852d1b354879b329',active:true,theme:'blue',icon:'🔥'}],
 inPage:[
  {id:'inpage_1',label:'Point Mission',title:'Complete This Optional Activity',description:'Open the task, check what is available, and receive 10 Activity Points.',buttonText:'COMPLETE THE MISSION →',url:'https://www.effectivecpmnetwork.com/t7jwkt8bc4?key=1d77add4feba7fc9852d1b354879b329',active:true,theme:'gold',icon:'🎯'},
  {id:'inpage_2',label:'Surprise Unlock',title:'Your Next Discovery Is Ready',description:'A fresh activity has been selected for your current chat session.',buttonText:'REVEAL THE SURPRISE →',url:'https://omg10.com/4/11279843',active:true,theme:'rose',icon:'🎁'},
   {id:'inpage_3',label:'Extra Discovery',title:'A New Optional Activity Is Ready',description:'Check the current activity, then return to continue using ChatEarn.',buttonText:'VIEW EXTRA ACTIVITY →',url:'https://oatstuckalfred.com/zkfsiqgma3?key=7fcbfd99661ec943edc23caf2592add8',active:true,theme:'emerald',icon:'🎯'}
 ],
 buttonAds:[
  {id:'button_ad_1',label:'Fast Action',title:'One Tap Away From Your Next Task',description:'Open this short activity without losing your conversation progress.',buttonText:'OPEN THE TASK →',url:'https://omg10.com/4/11279843',active:true,theme:'orange',icon:'🚀'},
  {id:'button_ad_2',label:'Member Access',title:'An Extra Opportunity Is Available',description:'Available to members who completed their first withdrawal journey.',buttonText:'ACCESS OPPORTUNITY →',url:'https://oatstuckalfred.com/s16jgyby6?key=c00293cc40e08e6d40264506f115e024',active:true,theme:'cyan',icon:'🔓'}
 ],
 halfScreen:[{id:'half_screen_1',label:'Featured Challenge',title:'Ready for a Different Kind of Task?',description:'Pause for a moment, explore this featured activity, then continue your chat.',buttonText:'VIEW FEATURED CHALLENGE →',url:'https://omg10.com/4/11279843',active:true,theme:'indigo',icon:'🏆',maximumShowsPerSession:1}],
 popup:[{id:'popup_1',label:'Limited Discovery',title:'This Opportunity May Rotate Soon',description:'Check the current activity while it is still available in this session.',buttonText:'CHECK IT NOW →',url:'https://www.effectivecpmnetwork.com/t7jwkt8bc4?key=1d77add4feba7fc9852d1b354879b329',active:true,theme:'magenta',icon:'⏳',maximumShowsPerSession:1}],
 earnings:[{id:'earnings_ad_1',label:'Activity Centre',title:'Build Your Activity Point Balance',description:'Explore the current task and collect 10 Activity Points when you open it.',buttonText:'OPEN ACTIVITY →',url:'https://omg10.com/4/11279843',active:true,theme:'teal',icon:'💎'}]
};
window.CHATEARN_CONFIG=Object.freeze({FIRST_WITHDRAWAL_MINIMUM,REQUIRED_SHARE_ACTIONS,KYC_CONFIG,AD_MANAGER,contextualCombinations:512});

const PARTNERS=[
{name:'alexlab102',initials:'AL',flag:'🇺🇸',country:'United States',language:'English',rate:5000,opening:'Hey! 👋 I just got matched with you. How is your day going?',branches:[
 {match:['good','well','fine'],reply:'Nice 😊 Which part of Nigeria are you chatting from?',suggestions:['I’m from Lagos','I’m from Ogun State','I’m in Abuja']},
 {match:['lagos'],reply:'Lagos sounds lively! What do you enjoy most about living there?',suggestions:['The energy is amazing','I enjoy the opportunities','The food and music']},
 {match:['ogun'],reply:'Nice 😊 What do you enjoy most about living in Ogun State?',suggestions:['It is peaceful','I like the community','School keeps me busy']},
 {match:['abuja'],reply:'Abuja looks beautiful in photos. What is your favourite place there?',suggestions:['The city centre','The parks','I’m still exploring']},
 {match:['music','afrobeats','burna'],reply:'Afrobeats has become huge here. Who is your favourite artist?',suggestions:['Burna Boy','Davido','Wizkid']},
 {match:[],reply:'That’s interesting 😊 Tell me a little more about yourself.',suggestions:['I’m a student','I work online','I enjoy learning new things']}
]},
{name:'EmiliaCute',initials:'EC',flag:'🇬🇧',country:'United Kingdom',language:'English',rate:4000,opening:'Hellooo 😊 I just got matched with you! How are you doing today?',branches:[
 {match:['good','fine','well'],reply:'Lovely! Where in Nigeria are you?',suggestions:['Lagos','Ogun State','Abuja']},
 {match:['lagos','ogun','abuja'],reply:'What is the weather like there today?',suggestions:['It is sunny','It is raining','It is quite warm']},
 {match:['sunny','raining','warm'],reply:'London has been unpredictable lately 😂 What is your favourite Nigerian meal?',suggestions:['Jollof rice','Pounded yam','Suya']},
 {match:['jollof','pounded','suya'],reply:'That sounds delicious. What music do you enjoy?',suggestions:['Afrobeats','Gospel music','A mix of everything']},
 {match:[],reply:'That sounds interesting 😊 What do you enjoy doing in your free time?',suggestions:['Watching movies','Learning online','Spending time with friends']}
]},
{name:'MattJohn',initials:'MJ',flag:'🇨🇦',country:'Canada',language:'English',rate:3500,opening:'Hey there! I’m Matt 👋 How are you?',branches:[
 {match:['good','fine','well'],reply:'Which part of Nigeria are you chatting from?',suggestions:['Lagos','Ogun State','Abuja']},
 {match:['lagos','ogun','abuja'],reply:'What kind of work or study do you do?',suggestions:['I study computer science','I work online','I’m learning digital skills']},
 {match:['computer','online','digital'],reply:'That sounds cool. What do you enjoy most about it?',suggestions:['Solving problems','Building things','Learning new skills']},
 {match:[],reply:'Would you ever want to visit Canada?',suggestions:['Yes, definitely','Maybe someday','I would love to visit']}
]},
{name:'Abi1990',initials:'AB',flag:'🇺🇸',country:'United States',language:'English',rate:5000,opening:'Hey 😊 How’s your day?',branches:[
 {match:['good','fine','well'],reply:'Where in Nigeria are you from?',suggestions:['Lagos','Ogun State','Abuja']},
 {match:['lagos','ogun','abuja'],reply:'What’s the best thing about your city?',suggestions:['The people','The opportunities','The food and culture']},
 {match:['people','opportunities','food','culture'],reply:'Nice 😄 What music are you listening to lately?',suggestions:['Afrobeats','Gospel','Hip-hop']},
 {match:[],reply:'That’s a good choice 😊 What do you do for work or school?',suggestions:['I’m a student','I work online','I’m building a business']}
]},
{name:'princess77',initials:'PR',flag:'🇩🇪',country:'Germany',language:'English',rate:3500,opening:'Hello 😊 Nice to meet you!',branches:[
 {match:['hello','hi','nice'],reply:'Which state are you from in Nigeria?',suggestions:['Lagos','Ogun State','Abuja']},
 {match:['lagos','ogun','abuja'],reply:'What is your favourite Nigerian meal?',suggestions:['Jollof rice','Amala','Egusi soup']},
 {match:['jollof','amala','egusi'],reply:'I need to try that someday. Do you get much time to relax?',suggestions:['Sometimes','Not really','Mostly on weekends']},
 {match:[],reply:'What do you wish visitors understood about Nigeria?',suggestions:['The people are welcoming','Nigeria is very diverse','There is a lot of creativity']}
]},
{name:'CamilaAnders',initials:'CA',flag:'🇦🇺',country:'Australia',language:'English',rate:4000,opening:'G’day!! 😄 Are you really in Nigeria?',branches:[
 {match:['yes','nigeria'],reply:'That’s so far from me! Which part are you in?',suggestions:['Lagos','Ogun State','Abuja']},
 {match:['lagos','ogun','abuja'],reply:'What’s the vibe where you are?',suggestions:['Busy and energetic','Calm and friendly','A mix of both']},
 {match:['busy','calm','mix'],reply:'Do you enjoy road trips?',suggestions:['Yes, I love them','Sometimes','I prefer staying close to home']},
 {match:[],reply:'Nigeria must have beautiful scenery. What place would you recommend?',suggestions:['Lagos beaches','Olumo Rock','Abuja city']}
]},
{name:'SophiaWave',initials:'SW',flag:'🇿🇦',country:'South Africa',language:'English',rate:4000,opening:'Hi 😊 I’m available for a chat. How has your week been?',branches:[
 {match:['good','fine','busy'],reply:'What has kept you busiest this week?',suggestions:['School','Work','Personal projects']},
 {match:['school','work','project'],reply:'That sounds productive. What are you hoping to achieve next?',suggestions:['Finish an important task','Learn a new skill','Take some rest']},
 {match:[],reply:'What is one thing you are looking forward to?',suggestions:['A new opportunity','Finishing school','Growing my skills']}
]},
{name:'DanielConnect',initials:'DC',flag:'🇰🇪',country:'Kenya',language:'English',rate:3500,opening:'Hello from Kenya 👋 What are you working on today?',branches:[
 {match:['school','work','project','business'],reply:'Nice. What part of it do you enjoy most?',suggestions:['The creativity','The challenge','Seeing progress']},
 {match:[],reply:'What digital skill would you like to improve?',suggestions:['Web development','Design','Digital marketing']}
]},

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
];

const PERSONALITY_STYLES=[
 {openers:['That makes sense.','I get what you mean 😊','That is interesting.','Honestly, I like that answer.'],quirks:['I tend to notice small details.','I enjoy hearing how other people see things.']},
 {openers:['Haha, fair answer 😄','Okay, that made me smile.','You know what? I like that.','Wait, that is a good point.'],quirks:['I ask too many questions sometimes 😂','My curiosity usually wins.']},
 {openers:['I have been thinking about that.','That is a thoughtful answer.','There is more to that than people realize.','I understand your point.'],quirks:['I enjoy conversations that go beyond small talk.','Different opinions make chats interesting.']},
 {openers:['Fair enough.','I understand.','Good answer.','That is clear.'],quirks:['I usually say exactly what I think.','I prefer honest answers over perfect ones.']},
 {openers:['Now I am curious.','That caught my attention.','Tell me something—','Interesting. Let me ask you this:'],quirks:['I can turn almost anything into a question.','Learning about people is genuinely interesting.']}
];
const CHAT_STAGES=[
 {name:'daily life',questions:['What has taken most of your attention today?','What part of your day has been unexpectedly good?','What usually helps you start a difficult day?','Are your days normally planned or spontaneous?','What is one small thing that improved your mood recently?','What do you normally do immediately after waking up?','Which part of the day feels most productive to you?','What has been keeping you busy this week?']},
 {name:'personality',questions:['What is something people usually misunderstand about you?','Are you naturally quiet or more talkative around people you trust?','What quality do you value most in yourself?','What kind of situation brings out your confidence?','Do you make decisions quickly or think for a long time?','What is one habit you are trying to improve?','What type of person do you find easiest to talk to?','Would your friends describe you as serious or playful?']},
 {name:'interests',questions:['What topic can keep you talking for a long time?','What hobby would you try if time and money were not a problem?','What have you learned recently just because you were curious?','What kind of content do you enjoy watching online?','Is there a skill you wish came naturally to you?','What activity makes time pass quickly for you?','What interest have you had since childhood?','What is something popular that you personally do not enjoy?']},
 {name:'entertainment',questions:['Which song can instantly improve your mood?','Do you enjoy discovering new artists or replaying favourites?','What movie or series stayed in your mind after you finished it?','Which artist would you like to see perform live?','Do you prefer comedy, action, drama, or documentaries?','What kind of video always makes you stop scrolling?','Would you rather attend a concert or watch a major football match?','What fictional character do you find memorable?']},
 {name:'food and culture',questions:['Which meal feels like comfort food to you?','What Nigerian food should every visitor try?','Do you enjoy cooking or prefer someone else handling it?','What food combination do you love that other people might question?','Is there a meal connected to a good memory for you?','What local tradition do you appreciate most?','Which city has the best food in your opinion?','What dish would you confidently serve to a foreign visitor?']},
 {name:'friends',questions:['What makes someone a genuinely good friend?','Do you prefer a small close circle or many friends?','What is the nicest thing a friend has done for you?','How do you handle disagreements with people you care about?','What makes you trust someone?','Are you usually the adviser in your friend group?','What kind of support matters most when life gets stressful?','What does loyalty mean to you?']},
 {name:'goals',questions:['What goal matters most to you this year?','What skill could change your future if you mastered it?','What keeps you going when progress feels slow?','Where would you like to be two years from now?','What small action can you take toward your goal this week?','Would you rather build a business or grow in a career?','What achievement would make you proud of yourself?','Who inspires the way you think about success?']},
 {name:'travel',questions:['Which country would you visit first if travel was free?','Do you prefer busy cities or peaceful natural places?','What place in Nigeria would you recommend to a first-time visitor?','Would you rather travel alone or with people close to you?','What would you want to experience on your dream trip?','Which city looks interesting even though you have never been there?','Would you live abroad permanently or eventually return home?','What is the longest journey you have taken?']},
 {name:'opinions',questions:['Would you choose more free time or more money?','Do you think talent or consistency matters more?','Is it better to plan carefully or learn while doing?','Would you rather be respected or widely liked?','Do social platforms connect people or distract them more?','What is one opinion you have changed recently?','Would you choose stability or a risky opportunity with more potential?','What everyday rule do you think makes little sense?']},
 {name:'stories',questions:['What is one funny thing that happened to you recently?','What childhood memory still makes you smile?','If you could repeat one day from your life, which would it be?','What would you do first with one million naira?','If you could instantly master one skill, what would you choose?','What is the most unexpected compliment you have received?','If your life this month had a title, what would it be?','What harmless mistake can you laugh about now?']},
 {name:'future',questions:['What would a genuinely good life look like to you?','What do you hope never changes about your personality?','What do you want people to remember about you?','Which future technology are you most curious about?','What do you hope to understand better as you grow older?','What kind of environment would make you happiest?','What experience do you definitely want to have someday?','What does success mean to you personally?']}
];
const CONTEXT_LIBRARY=[
 {keys:['school','student','university','course','study','exam'],followups:['Which part of your studies interests you most?','What subject has challenged you recently?','What would make this school year successful for you?'],suggestions:['I enjoy practical projects','Some courses are challenging','Finishing well is my goal']},
 {keys:['work','job','business','online','career'],followups:['What part of that work interests you most?','What are you currently trying to improve?','What opportunity would help you move forward?'],suggestions:['I enjoy solving problems','I am building something new','I want more opportunities']},
 {keys:['music','song','artist','afrobeats'],followups:['Which artist have you played most lately?','What kind of song improves your mood?','Which song would you recommend to me?'],suggestions:['I listen to Afrobeats','Gospel lifts my mood','I have several favourites']},
 {keys:['food','meal','rice','suya','jollof','amala','egusi'],followups:['What makes that meal special to you?','Do you prefer cooking it or buying it?','What other Nigerian meal would you recommend?'],suggestions:['Jollof rice is a favourite','I enjoy local meals','Suya is a good choice']},
 {keys:['lagos','ogun','abuja','nigeria','city','state'],followups:['What do you enjoy most about living there?','What would you show a first-time visitor?','Is your area usually calm or busy?'],suggestions:['The people are welcoming','It is usually lively','The community feels familiar']},
 {keys:['goal','future','dream','plan'],followups:['What is the next realistic step toward that?','What could make that goal difficult?','Who supports you with that plan?'],suggestions:['I want to grow my skills','I want to build a business','Consistency is my next step']}
];
function partnerMemory(){
 const name=currentPartner?.name||'default';state.chatMemory??={};
 state.chatMemory[name]??={facts:{},recentQuestions:[],lastUserText:'',stage:0};return state.chatMemory[name];
}
function rememberUser(text){
 const memory=partnerMemory(),raw=String(text||'').trim();memory.lastUserText=raw;
 const patterns=[
  ['location',/(?:i(?:'m| am)? from|i live in|i stay in)\s+([a-z ]{2,30})/i],
  ['study',/(?:i study|i'm studying|i am studying)\s+([a-z0-9 &-]{2,45})/i],
  ['work',/(?:i work as|my job is|i work in)\s+([a-z0-9 &-]{2,45})/i],
  ['favourite',/(?:my favou?rite (?:is|artist is|food is)|i love)\s+([a-z0-9 '&-]{2,40})/i],
  ['goal',/(?:my goal is|i want to|i hope to)\s+([a-z0-9 ,'-]{3,60})/i]
 ];
 patterns.forEach(([key,pattern])=>{const match=raw.match(pattern);if(match)memory.facts[key]=match[1].trim().replace(/[.!?]+$/,'')});return memory;
}
function memoryReference(memory,turn){
 const facts=Object.entries(memory.facts||{});if(!facts.length||turn%4!==0)return'';
 const [key,value]=facts[turn%facts.length];
 const refs={location:`You mentioned ${value} earlier.`,study:`Earlier you said you study ${value}.`,work:`You told me you work in ${value}.`,favourite:`I remember you said you like ${value}.`,goal:`I remember your goal is to ${value}.`};return refs[key]||'';
}
function chooseFreshQuestion(memory,candidates,turn){
 const recent=memory.recentQuestions||[],available=candidates.filter(question=>!recent.includes(question)),pool=available.length?available:candidates;
 const question=pool[(turn*3+(currentPartner?.name?.length||0))%pool.length];memory.recentQuestions=[...recent.slice(-11),question];return question;
}
function currentTimeGreeting(){const hour=new Date().getHours();if(hour<11)return'How is your morning going so far?';if(hour<17)return'How has your day been going?';return'How has your evening been?'}
function contextualResponse(text){
 const memory=rememberUser(text),normalized=String(text||'').toLowerCase(),turn=Number(state.partnerTurns[currentPartner?.name]||0);
 const personality=PERSONALITY_STYLES[(currentPartner?.name?.length||0)%PERSONALITY_STYLES.length],context=CONTEXT_LIBRARY.find(item=>item.keys.some(key=>normalized.includes(key)));
 const stageIndex=Math.floor(turn/7)%CHAT_STAGES.length,stage=CHAT_STAGES[stageIndex];memory.stage=stageIndex;
 let candidates=context?.followups||stage.questions;if(turn===0)candidates=[currentTimeGreeting(),...candidates];
 const question=chooseFreshQuestion(memory,candidates,turn),opener=personality.openers[turn%personality.openers.length],reference=memoryReference(memory,turn),quirk=turn>0&&turn%9===0?personality.quirks[turn%personality.quirks.length]:'';
 const reply=[opener,reference,quirk,question].filter(Boolean).join(' '),suggestions=context?.suggestions||['That is a good question','Let me think about it','How about you?'];saveState();return{reply,suggestions};
}

let authUser=null,currentPartner=null,currentScreen='landing',busy=false,selectedBank='opay',state=freshState();
let shareReturnTimer=null;

const $=id=>document.getElementById(id);
const money=n=>`₦${Number(n||0).toLocaleString('en-NG')}`;
const nowISO=()=>new Date().toISOString();
const stamp=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
const validUrl=url=>Boolean(url&&!url.includes('PASTE_')&&/^https?:\/\//i.test(url));

function freshState(){return{
 name:'User',bonusCredited:false,totalBalance:0,chatEarnings:0,sponsoredEarnings:0,lifetimeEarnings:0,
 amountUnderReview:0,newEarnings:0,availableBalance:0,withdrawal:null,sharing:{count:0,pending:false,openedAt:null,returnedAt:null,cooldownUntil:0,events:[]},
 kyc:{status:'not_started',openedAt:null,returnedAt:null,withdrawalId:null},paymentStatus:'not_started',
 lastPartner:null,partnerTurns:{},conversations:{},rewardedMessageIds:{},lastRewardText:'',lastRewardAt:0,
 referralCode:'',unlockShown:false,adsUnlocked:false,activityPoints:0,chatMemory:{},ad:{replyCounter:0,nextInterval:randomInterval(),shown:{},lastAdId:null,events:[]}
}}
function storageKey(){return`ce-state-${authUser?.id||'guest'}`}
function navKey(){return`ce-nav-${authUser?.id||'guest'}`}
function loadState(){
 try{state={...freshState(),...JSON.parse(localStorage.getItem(storageKey())||'')}}catch{state=freshState()}
 state.sharing={...freshState().sharing,...(state.sharing||{})};
 state.kyc={...freshState().kyc,...(state.kyc||{})};
 state.ad={...freshState().ad,...(state.ad||{})};state.chatMemory={...(state.chatMemory||{})};
 if(!state.referralCode)state.referralCode=`CE${(authUser?.id||crypto.randomUUID()).replaceAll('-','').slice(0,8).toUpperCase()}`;
 syncBalances();
}
function saveState(){
 syncBalances();
 localStorage.setItem(storageKey(),JSON.stringify(state));
 localStorage.setItem(navKey(),JSON.stringify({screen:currentScreen,partner:currentPartner?.name||state.lastPartner}));
 renderBalances();
}
function syncBalances(){
 const requested=Number(state.amountUnderReview||state.withdrawal?.amount||0);
 const lifetime=SIGNUP_BONUS*(state.bonusCredited?1:0)+Number(state.chatEarnings||0)+Number(state.sponsoredEarnings||0);
 state.lifetimeEarnings=Math.max(Number(state.lifetimeEarnings||0),lifetime);
 state.newEarnings=Math.max(0,state.lifetimeEarnings-requested);
 state.availableBalance=state.withdrawal?state.newEarnings:state.lifetimeEarnings;
 state.totalBalance=state.availableBalance;
}
function creditSignupOnce(){if(state.bonusCredited)return;state.bonusCredited=true;state.lifetimeEarnings+=SIGNUP_BONUS;saveState()}
function toast(text,bad=false){const e=$('toast');if(!e)return;e.textContent=text;e.className=bad?'toast show error':'toast show';clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='toast',3000)}
function esc(text){const d=document.createElement('div');d.textContent=String(text);return d.innerHTML}
function randomInterval(){return 3+Math.floor(Math.random()*2)}
function transactionId(){return`CHAT-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`}

function showScreen(id){
 document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active');s.style.display='none'});
 const target=$(id);if(!target)return;
 target.classList.add('active');target.style.display=['loading','processing'].includes(id)?'flex':'block';
 currentScreen=id;
 if(id==='dashboard')renderDashboard();
 if(id==='earnings')renderEarnings();
 if(id==='withdraw')renderWithdraw();
 if(id==='sharewall')renderShare();
 if(id==='kyc')renderKYC();
 if(id==='processing')renderProcessing();
 saveState();scrollTo({top:0,behavior:'instant'});
}
window.goScreen=showScreen;

function renderBalances(){
 const map={
  dashBalance:money(state.availableBalance),earnPageAmount:Number(state.availableBalance).toLocaleString('en-NG'),
  chatEarnBreakdown:money(state.chatEarnings),totalEarnBreakdown:money(state.lifetimeEarnings),
  wdAmount:money(state.withdrawal?.amount||state.availableBalance),ppAmount:money(state.withdrawal?.amount||state.amountUnderReview)
 };
 Object.entries(map).forEach(([id,text])=>{if($(id))$(id).textContent=text});
 const sub=$('wdTeaserSub'),btn=$('wdTeaserBtn');
 if(sub)sub.textContent=state.availableBalance>=FIRST_WITHDRAWAL_MINIMUM?`${money(state.availableBalance)} available for withdrawal`:`Withdrawal Progress ${money(state.availableBalance)} / ${money(FIRST_WITHDRAWAL_MINIMUM)}`;
 if(btn){btn.textContent=state.availableBalance>=FIRST_WITHDRAWAL_MINIMUM?'Withdraw →':'Locked 🔒';btn.disabled=state.availableBalance<FIRST_WITHDRAWAL_MINIMUM}
}

function syncPartnerCards(){
 document.querySelectorAll('#foreignerList .foreigner-card').forEach((card,index)=>{
  const partner=PARTNERS[index];if(!partner)return;
  const rate=card.querySelector('.fc-earn');if(rate)rate.textContent=`₦${partner.rate/1000}K/reply`;
 });
 const badge=document.querySelector('#dashboard .st-badge');if(badge)badge.textContent='Automated partners available';
}
function renderDashboard(){
 if($('dashName'))$('dashName').textContent=`Welcome, ${String(state.name||'User').split(' ')[0]}!`;
 renderBalances();syncPartnerCards();
 let card=$('statusCard');
 if(state.withdrawal){
  if(!card){card=document.createElement('div');card.id='statusCard';document.querySelector('#dashboard .bonus-banner')?.after(card)}
  card.style.cssText='margin:0 16px 14px;padding:14px;border-radius:14px;background:rgba(0,200,83,.08);border:1px solid rgba(0,200,83,.22)';
  card.innerHTML=`<b style="color:#69F0AE">Welcome back 🎉</b><p style="font-size:12px;color:#aebbb3">Your withdrawal request is awaiting review. Continue chatting and earning while you wait.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button onclick="continueLastChat()" style="padding:11px;border:0;border-radius:10px;background:#00C853;font-weight:900">CONTINUE LAST CHAT</button><button onclick="goScreen('processing')" style="padding:11px;border:1px solid #39413b;border-radius:10px;background:#1d221e;color:#fff;font-weight:800">VIEW STATUS</button></div>`;
 }
 mountPartnerAd();
}
function renderEarnings(){
 renderBalances();
 const host=document.querySelector('#earnings .earn-breakdown');if(!host)return;
 let extra=$('extraEarnings');
 if(!extra){extra=document.createElement('div');extra.id='extraEarnings';host.appendChild(extra)}
 extra.innerHTML=`
 <div class="eb-row"><span class="eb-key">Sponsored Earnings</span><span class="eb-val">${money(state.sponsoredEarnings)}</span></div>
 <div class="eb-row"><span class="eb-key">Amount Under Processing</span><span class="eb-val">${money(state.amountUnderReview)}</span></div>
 <div class="eb-row"><span class="eb-key">New Earnings</span><span class="eb-val">${money(state.newEarnings)}</span></div>
 <div class="eb-row"><span class="eb-key">Available for Withdrawal</span><span class="eb-val">${money(state.availableBalance)}</span></div>
 <div class="eb-row"><span class="eb-key">Lifetime Earnings</span><span class="eb-val">${money(state.lifetimeEarnings)}</span></div>`;
 mountEarningsAd();
}
function renderWithdraw(){renderBalances()}

window.openLogin=()=>$('loginModal')?.classList.add('show');
window.closeLogin=()=>$('loginModal')?.classList.remove('show');

window.doRegister=async()=>{
 const name=$('regName')?.value.trim(),email=$('regEmail')?.value.trim(),password=$('regPass')?.value||'',button=$('regSubmitBtn');
 if(!name||!email||password.length<6)return toast('Complete all fields correctly.',true);
 if(button){button.disabled=true;button.textContent='Creating account…'}
 try{
  let result=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});if(result.error)throw result.error;
  let session=result.data.session;
  if(!session){result=await sb.auth.signInWithPassword({email,password});if(result.error)throw result.error;session=result.data.session}
  authUser=session?.user||result.data.user;if(!authUser)throw Error('Session could not start');
  loadState();state.name=name;creditSignupOnce();runSetup(true);
 }catch(error){
   const message=String(error?.message||'Registration failed.');
   if(/already|registered|exists/i.test(message)){
    if($('loginEmail'))$('loginEmail').value=email;
    openLogin();toast('This email already has an account. Log in to continue.',true);
   }else toast(message,true)
  }
 finally{if(button){button.disabled=false;button.textContent='Create Account & Get ₦10,000 →'}}
};
window.doLogin=async()=>{
 const email=$('loginEmail')?.value.trim(),password=$('loginPass')?.value||'',button=$('loginBtn');
 if(!email||!password)return toast('Enter your email and password.',true);
 if(button){button.disabled=true;button.textContent='Logging in…'}
 try{
  const result=await sb.auth.signInWithPassword({email,password});if(result.error)throw result.error;
  authUser=result.data.user;loadState();state.name=state.name||authUser.user_metadata?.full_name||email.split('@')[0];closeLogin();restoreJourney();
 }catch(error){toast(error.message||'Login failed.',true)}
 finally{if(button){button.disabled=false;button.textContent='Log In & Continue →'}}
};

window.userLogout=()=>showLogoutConfirm();
function showLogoutConfirm(){
 let modal=$('logoutConfirm');
 if(!modal){modal=document.createElement('div');modal.id='logoutConfirm';modal.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.72);display:grid;place-items:center;padding:20px';modal.innerHTML=`<div style="width:min(100%,380px);background:#171b18;border:1px solid #303832;border-radius:18px;padding:20px"><h3>Log out of ChatEarn?</h3><p style="color:#aebbb3;font-size:13px;line-height:1.5">Your account and progress will remain saved. You can log in again with your email and password.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button onclick="document.getElementById('logoutConfirm').remove()" style="padding:12px;border:1px solid #39413b;border-radius:10px;background:#1d221e;color:#fff;font-weight:900">CANCEL</button><button onclick="confirmLogout()" style="padding:12px;border:0;border-radius:10px;background:#00C853;font-weight:900">LOG OUT</button></div></div>`;document.body.appendChild(modal)}
}
window.confirmLogout=async()=>{await sb.auth.signOut();authUser=null;state=freshState();$('logoutConfirm')?.remove();showScreen('landing')};

function runSetup(isNew){
 showScreen('loading');
 if($('ldTitle'))$('ldTitle').textContent=isNew?'Setting Up Your Account':'Welcome Back';
 if($('ldSub'))$('ldSub').textContent='Matching you with an available guided chat…';
 let progress=0;clearInterval(runSetup.timer);
 runSetup.timer=setInterval(()=>{progress+=20;if($('ldFill'))$('ldFill').style.width=`${progress}%`;if(progress>=100){clearInterval(runSetup.timer);openChat(Math.floor(Math.random()*PARTNERS.length),true)}},250);
}
function conversation(name){state.conversations[name]??=[];return state.conversations[name]}
function lastPartnerMessage(){return conversation(currentPartner.name).filter(m=>m.type==='partner').at(-1)?.text||currentPartner.opening}
function partnerResponse(text){
 const turn=Number(state.partnerTurns[currentPartner?.name]||0),base=contextualResponse(text),direct=String(text||'').toLowerCase();
 if(/how about you|what about you|and you\??$/.test(direct)){
  const profile=[`I enjoy learning how people live in different places. ${base.reply}`,`I am usually curious and a little playful once I am comfortable 😄 ${base.reply}`,`Music, travel stories, and honest conversations are easy topics for me. ${base.reply}`][turn%3];return{...base,reply:profile};
 }
 return base;
}
function humanTypingDelay(text){
 const length=Math.min(420,String(text||'').length),jitter=Math.floor(Math.random()*1300);
 return Math.min(6800,1100+jitter+length*12);
}
function messageBubble(message){
 const body=$('chatBody');
 if(message.type==='ad'){
  const ad=findAdById(message.adId);if(ad)body.appendChild(adCard(ad,message.placement||'inlineChat'));return;
 }
 const row=document.createElement('div');row.className=`msg-row ${message.type==='user'?'mine':''}`;
 row.innerHTML=`<div class="msg-bubble ${message.type==='user'?'msg-mine':'msg-theirs'}"><div>${esc(message.text)}</div><div style="font-size:9px;opacity:.65;text-align:right;margin-top:5px">${message.time||stamp()}${message.type==='user'?' ✓✓':''}</div></div>${message.reward?`<div style="font-size:11px;color:#00E676;font-weight:800;margin-top:5px">+${money(message.reward)} earned! 💰</div>`:''}`;
 body.appendChild(row);
}
function showRewardToast(amount){
 const old=document.getElementById('rewardToast');if(old)old.remove();
 const badge=document.createElement('div');badge.id='rewardToast';badge.textContent=`+${money(amount)} Earned! 💰`;
 badge.style.cssText='position:fixed;right:14px;top:110px;z-index:5000;background:#00C853;color:#001b0b;padding:13px 18px;border-radius:16px;font-weight:900;box-shadow:0 10px 28px rgba(0,0,0,.35);animation:earnPop .28s ease';
 document.body.appendChild(badge);setTimeout(()=>badge.remove(),1800);
}
function typingIndicator(){const body=$('chatBody'),row=document.createElement('div');row.className='msg-row';row.id='typingRow';row.innerHTML='<div class="msg-bubble msg-theirs"><span class="typing-dots">•••</span></div>';body.appendChild(row);body.scrollTop=body.scrollHeight;return row}
function suggestions(items){
 const host=$('quickReplies');if(!host)return;host.innerHTML='';
 (items||['That’s interesting 😊','Tell me more','How about you?']).forEach(text=>{const button=document.createElement('button');button.type='button';button.className='quick-reply';button.textContent=text;button.onclick=()=>{if($('chatInput'))$('chatInput').value=text;sendMsg()};host.appendChild(button)});
}
function drawConversation(){
 const body=$('chatBody');if(!body||!currentPartner)return;
 body.innerHTML='<div class="chat-day">TODAY</div>';
 conversation(currentPartner.name).forEach(messageBubble);
 const latestUser=conversation(currentPartner.name).filter(m=>m.type==='user').at(-1)?.text||'';
 suggestions(partnerResponse(latestUser).suggestions);
 withdrawalUnlockCard();
 body.scrollTop=body.scrollHeight;
}
function openingMessage(){
 if(conversation(currentPartner.name).length)return drawConversation();
 drawConversation();if($('chatStatus'))$('chatStatus').textContent=`${currentPartner.name} is typing…`;const row=typingIndicator();
 setTimeout(()=>{row.remove();conversation(currentPartner.name).push({id:`OPEN-${currentPartner.name}`,type:'partner',text:currentPartner.opening,time:stamp()});if($('chatStatus'))$('chatStatus').textContent=`🟢 Automated chat partner · Available now · ${currentPartner.flag} ${currentPartner.country}`;saveState();drawConversation()},humanTypingDelay(currentPartner.opening));
}
function openChat(index,first=false){
 currentPartner=PARTNERS[Number(index)]||PARTNERS[0];state.lastPartner=currentPartner.name;
 if($('chatName'))$('chatName').textContent=currentPartner.name;
 if($('chatAv'))$('chatAv').textContent=currentPartner.initials;
 if($('chatStatus'))$('chatStatus').textContent=`🟢 Automated chat partner · Available now · ${currentPartner.flag} ${currentPartner.country}`;
 if($('chatEarnBadge'))$('chatEarnBadge').textContent=`+${money(currentPartner.rate)}/reply`;
 showScreen('chat');first?openingMessage():drawConversation();setTimeout(()=>$('chatInput')?.focus(),100);
}
window.openChat=openChat;
window.handleEnter=event=>{if(event.key==='Enter'){event.preventDefault();sendMsg()}};

function qualifiesForReward(text){
 const trimmed=text.trim(),now=Date.now();
 if(trimmed.length<2)return{ok:false,reason:'Write a meaningful reply.'};
 if(state.lastRewardText&&trimmed.toLowerCase()===state.lastRewardText.toLowerCase())return{ok:false,reason:'Repeated replies are not rewarded.'};
 if(now-Number(state.lastRewardAt||0)<1200)return{ok:false,reason:'Please wait before sending another rewarded reply.'};
 return{ok:true};
}
function sendMsg(){
 if(busy||!currentPartner)return;
 const input=$('chatInput'),text=input?.value.trim();if(!text)return;

  if(!state.withdrawal&&state.availableBalance>=FIRST_WITHDRAWAL_MAXIMUM){
   toast('You have reached your first earning limit. Complete your withdrawal setup to continue earning.',true);
   withdrawalUnlockCard();busy=false;input.disabled=false;return;
  }
 const qualification=qualifiesForReward(text);
 busy=true;input.disabled=true;input.value='';
 const id=transactionId(),messages=conversation(currentPartner.name);
 const reward=qualification.ok?(state.withdrawal?currentPartner.rate:5000):0;
 messages.push({id,type:'user',text,time:stamp(),reward,transactionRef:reward?id:null});
 if(reward&&!state.rewardedMessageIds[id]){
  state.rewardedMessageIds[id]=true;state.chatEarnings+=state.withdrawal?reward:Math.min(reward,Math.max(0,FIRST_WITHDRAWAL_MAXIMUM-state.availableBalance));state.lastRewardText=text;state.lastRewardAt=Date.now();
  state.ad.replyCounter+=1;
 }
 saveState();drawConversation();if(reward)showRewardToast(reward);
 if(!qualification.ok)toast(qualification.reason,true);
 if(state.availableBalance>=FIRST_WITHDRAWAL_MINIMUM&&!state.unlockShown){state.unlockShown=true;saveState();toast('Withdrawal unlocked 🎉 You can withdraw now or keep chatting.')}
 maybeShowAd();
 const turn=(state.partnerTurns[currentPartner.name]||0)+1;state.partnerTurns[currentPartner.name]=turn;
 const response=partnerResponse(text);if($('chatStatus'))$('chatStatus').textContent=`${currentPartner.name} is typing…`;const typing=typingIndicator(),replyDelay=humanTypingDelay(response.reply);
 setTimeout(()=>{typing.remove();messages.push({id:`P-${currentPartner.name}-${Date.now()}`,type:'partner',text:response.reply,time:stamp()});if($('chatStatus'))$('chatStatus').textContent=`🟢 Automated chat partner · Available now · ${currentPartner.flag} ${currentPartner.country}`;saveState();drawConversation();busy=false;input.disabled=false;input.focus()},replyDelay);
}
window.sendMsg=sendMsg;

function withdrawalUnlockCard(){
 const body=$('chatBody');body?.querySelector('[data-unlock]')?.remove();
 if(!body||state.availableBalance<FIRST_WITHDRAWAL_MINIMUM||state.withdrawal)return;
 const card=document.createElement('div');card.dataset.unlock='1';
 card.style.cssText='margin:18px 0;padding:22px 18px;border-radius:18px;background:rgba(0,200,83,.10);border:1px solid rgba(0,200,83,.42);text-align:center';
 card.innerHTML=`<div style="font-size:30px;margin-bottom:8px">🎉</div><b style="display:block;color:#00E676;font-size:21px">${money(state.availableBalance)} Earned!</b><p style="color:#b8c2bc;font-size:13px;margin:7px 0 14px">Withdrawal available! Withdraw now.</p><button onclick="goScreen('earnings')" style="padding:13px 28px;border:0;border-radius:12px;background:#00C853;color:#001b0b;font-size:15px;font-weight:900">Withdraw Now →</button>`;
 body.appendChild(card);
}
window.tryWithdraw=()=>state.availableBalance<FIRST_WITHDRAWAL_MINIMUM?toast(`${money(FIRST_WITHDRAWAL_MINIMUM-state.availableBalance)} remaining before withdrawal.`,true):showScreen('earnings');
window.selectBank=value=>{selectedBank=value;$('bankOpay')?.classList.toggle('selected',value==='opay');$('bankPalmpay')?.classList.toggle('selected',value==='palmpay')};
window.triggerBankVerify=value=>{const status=$('bankVerifyStatus');if(status){status.style.display=String(value).length===10?'block':'none';status.textContent=String(value).length===10?'Account details entered. Confirm the account name before submitting.':''}};

window.placeWithdrawal=()=>{
 if(state.withdrawal)return toast('A withdrawal request already exists. View its status instead.',true);
 const accountNumber=String($('wdAccNo')?.value||''),accountName=$('wdAccName')?.value.trim();
 if(accountNumber.length!==10||!accountName)return toast('Enter a valid account number and account name.',true);
 const amount=state.availableBalance;
 state.withdrawal={id:`WD-${Date.now()}`,amount,bank:selectedBank==='opay'?'OPay':'PalmPay',accountNumber,accountName,submittedAt:nowISO(),status:'requirements_in_progress'};
 state.amountUnderReview=amount;state.paymentStatus='requirements_in_progress';saveState();
 toast('Withdrawal request created. Continue with the sharing stage.');
 showScreen('sharewall');
};

function referralLink(){return`${location.origin}${location.pathname}?ref=${encodeURIComponent(state.referralCode)}`}
function buildWhatsAppMessage(){
 return `💰 I just earned ${money(state.lifetimeEarnings)} on ChatEarn chatting!\nChatEarn gives users access to chat-based earning activities.\n✅ Free to join\n✅ Earn from approved replies\n✅ Withdraw through supported Nigerian banks\nSign up here 👇\n${referralLink()}\nMy withdrawal journey is currently in progress 🔥`;
}
function shareCooldownRemaining(){return Math.max(0,Number(state.sharing.cooldownUntil||0)-Date.now())}
function renderShare(){
 if($('swHeroTitle'))$('swHeroTitle').textContent='Complete Your Sharing Stage';
 if($('swHeroSub'))$('swHeroSub').textContent='Share your ChatEarn invitation through WhatsApp and return to continue.';
 const waiting=document.querySelector('#sharewall .sw-body > div[style*="255,215,0"]');if(waiting)waiting.innerHTML=`⚡ <strong>Your ${money(state.withdrawal?.amount||state.amountUnderReview)} request is recorded.</strong> Complete the sharing stage to continue.`;
 const note=document.querySelector('#sharewall .sw-note');if(note)note.textContent='Each action records that the WhatsApp share interface was opened and you returned.';
 const shareProgressSteps=[0,10,30,55,70,80,95,100];
  const percent=shareProgressSteps[Math.min(state.sharing.count,REQUIRED_SHARE_ACTIONS)]||0;
 if($('swPct'))$('swPct').textContent=`${percent}%`;
 if($('swFill'))$('swFill').style.width=`${percent}%`;
 if($('swStatus'))$('swStatus').textContent=state.sharing.count>=REQUIRED_SHARE_ACTIONS?'Sharing Stage Complete 🎉':`Progress: ${percent}%`;
 if($('swBtnText'))$('swBtnText').textContent=state.sharing.pending?'Share activity opened — return here':'SHARE ON WHATSAPP';
 const main=$('btnShareWA');if(main){main.disabled=state.sharing.pending||shareCooldownRemaining()>0||state.sharing.count>=REQUIRED_SHARE_ACTIONS}
 let tools=$('shareTools');
 if(!tools){tools=document.createElement('div');tools.id='shareTools';document.querySelector('#sharewall .sw-body')?.appendChild(tools)}
 tools.innerHTML=`<div style="display:grid;gap:9px;margin-top:12px"><button onclick="copyInvitationLink()" style="padding:12px;border:1px solid #39413b;border-radius:10px;background:#1e231f;color:#fff;font-weight:900">COPY INVITATION LINK</button></div>`;
}
window.doShareWA=()=>{
 if(!state.withdrawal)return toast('Submit your bank details first.',true);
 if(state.sharing.pending||shareCooldownRemaining()>0)return toast('Please wait before starting another share activity.',true);
 if(state.sharing.count>=REQUIRED_SHARE_ACTIONS)return renderShare();
 state.sharing.pending=true;state.sharing.openedAt=nowISO();state.sharing.events.push({type:'whatsapp_share_opened',at:state.sharing.openedAt});saveState();renderShare();
 toast('Share activity opened. Please complete your invitation in WhatsApp, then return here.');
 window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(buildWhatsAppMessage())}`,'_blank','noopener,noreferrer');
};
window.copyInvitationLink=async()=>{try{await navigator.clipboard.writeText(referralLink());state.sharing.events.push({type:'invitation_link_copied',at:nowISO()});saveState();toast('Invitation link copied.')}catch{toast('Copy failed.',true)}};
window.copyReferral=window.copyInvitationLink;
window.shareAgain=window.doShareWA;

function handleReturn(){
 if(state.sharing.pending&&document.visibilityState==='visible'){
  state.sharing.pending=false;state.sharing.returnedAt=nowISO();state.sharing.cooldownUntil=Date.now()+SHARE_COOLDOWN_MS;
  state.sharing.count=Math.min(REQUIRED_SHARE_ACTIONS,state.sharing.count+1);
  state.sharing.events.push({type:'user_returned',at:state.sharing.returnedAt},{type:'share_action_recorded',at:nowISO()});
  saveState();toast('Welcome back. Checking your sharing activity…');renderShare();
  clearTimeout(shareReturnTimer);
  if(state.sharing.count>=REQUIRED_SHARE_ACTIONS){
   shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();showScreen('kyc')},500);
  }else{
   shareReturnTimer=setTimeout(()=>{state.sharing.cooldownUntil=0;saveState();renderShare()},SHARE_COOLDOWN_MS);
  }
 }
 if(state.kyc.openedAt&&!state.kyc.returnedAt&&document.visibilityState==='visible'){
  state.kyc.returnedAt=nowISO();state.kyc.status='returned_from_kyc';state.paymentStatus='pending_review';saveState();showScreen('processing');
 }
}
document.addEventListener('visibilitychange',handleReturn);
window.addEventListener('pageshow',handleReturn);

function renderKYC(){
 const hero=document.querySelector('#kyc .kyc-hero p');if(hero)hero.textContent='Continue to identity verification to complete your reward requirements.';
 const statuses=document.querySelectorAll('#kyc .ks-status');
 if(statuses[2])statuses[2].textContent=`${state.sharing.count}/${REQUIRED_SHARE_ACTIONS}`;
 if(statuses[3])statuses[3].textContent=state.kyc.status.replaceAll('_',' ');
 const button=document.querySelector('.btn-complete-kyc');
 if(button){button.textContent='COMPLETE YOUR KYC';button.disabled=false}
}
window.doKYC=()=>{
 if(!state.withdrawal)return toast('Create a withdrawal request first.',true);
 if(!validUrl(KYC_CONFIG.url))return toast('KYC destination has not been configured yet.',true);
 state.kyc.status='kyc_link_opened';state.kyc.openedAt=nowISO();state.kyc.returnedAt=null;state.kyc.withdrawalId=state.withdrawal.id;currentScreen='kyc_external';saveState();
 window.open(KYC_CONFIG.url,'_blank','noopener,noreferrer');
};

function maskedAccount(){const number=String(state.withdrawal?.accountNumber||'');return number?`${'*'.repeat(Math.max(0,number.length-4))}${number.slice(-4)}`:'—'}
function renderProcessing(){
 const w=state.withdrawal;
 if($('ppAmount'))$('ppAmount').textContent=money(w?.amount||state.amountUnderReview);
 if($('ppBank'))$('ppBank').textContent=w?.bank||'Selected bank';
 if($('ppRef'))$('ppRef').textContent=w?.id||'—';
 const title=document.querySelector('#processing .pp-title');if(title)title.textContent=state.kyc.openedAt?'Withdrawal Request Under Review':'Withdrawal Request Submitted';
 const sub=document.querySelector('#processing .pp-sub');
 if(sub)sub.innerHTML=`Amount: <b>${money(w?.amount||0)}</b><br>Bank: <b>${esc(w?.bank||'—')}</b><br>Account: <b>${maskedAccount()}</b><br>Sharing: <b>${state.sharing.count>=REQUIRED_SHARE_ACTIONS?'Completed':`${state.sharing.count} of ${REQUIRED_SHARE_ACTIONS}`}</b><br>KYC: <b>${state.kyc.openedAt?'Opened / Under Review':'Not Started'}</b><br>Payment: <b>Pending Approval</b>`;
 if($('ppBankNote'))$('ppBankNote').textContent='Only the future backend or Admin Panel can approve, process or complete this request.';
 const timeline=document.querySelectorAll('#processing .pt-title');
 if(timeline[0])timeline[0].textContent='Withdrawal Submitted ✓';
 if(timeline[1])timeline[1].textContent=state.kyc.openedAt?'KYC Link Opened':'KYC Not Started';
 if(timeline[2])timeline[2].textContent='Payment Pending Approval';
 let actions=$('processingActions');
 if(!actions){actions=document.createElement('div');actions.id='processingActions';const title=document.querySelector('#processing .pp-title');title?.after(actions)}
 actions.style.cssText='width:calc(100% - 28px);max-width:440px;margin:18px auto 22px;padding:20px 16px;border:2px solid rgba(0,230,118,.72);border-radius:20px;background:rgba(0,200,83,.16);display:grid;gap:12px;box-shadow:0 10px 34px rgba(0,200,83,.20)';
 actions.innerHTML='<div style="text-align:center;font-size:17px;font-weight:950;color:#69F0AE">Continue chatting and keep earning</div><button onclick="returnToChat()" style="width:100%;min-height:64px;padding:18px 14px;border:0;border-radius:15px;background:#00C853;color:#001b0b;font-size:18px;font-weight:950;line-height:1.25;box-shadow:0 10px 28px rgba(0,200,83,.35)">RETURN TO CHAT & CONTINUE EARNING</button>';
}
window.returnToChat=()=>{state.adsUnlocked=true;state.ad.replyCounter=0;state.ad.nextInterval=randomInterval();saveState();continueLastChat();toast('Your withdrawal request is awaiting review. Continue chatting and earning while you wait.')} ;
window.continueLastChat=()=>{const index=PARTNERS.findIndex(p=>p.name===state.lastPartner);index>=0?openChat(index):showScreen('dashboard')};

function eligibleAds(group){return(group||[]).filter(ad=>ad.active&&validUrl(ad.url))}
function allAds(){return[...AD_MANAGER.inlineChat,...AD_MANAGER.partnerList,...AD_MANAGER.inPage,...AD_MANAGER.buttonAds,...AD_MANAGER.halfScreen,...AD_MANAGER.popup,...AD_MANAGER.earnings]}
function findAdById(id){return allAds().find(ad=>ad.id===id)}
function awardActivityPoints(){state.activityPoints=Number(state.activityPoints||0)+10;saveState();toast('+10 Activity Points added. Activity Points are not cash or payment approval.')}
function adCard(ad,placement){
 const themes={emerald:{accent:'#00E676',soft:'rgba(0,230,118,.12)',border:'rgba(0,230,118,.42)',text:'#001b0b'},violet:{accent:'#B388FF',soft:'rgba(179,136,255,.13)',border:'rgba(179,136,255,.42)',text:'#16052b'},blue:{accent:'#64B5F6',soft:'rgba(100,181,246,.13)',border:'rgba(100,181,246,.42)',text:'#041725'},gold:{accent:'#FFD54F',soft:'rgba(255,213,79,.13)',border:'rgba(255,213,79,.42)',text:'#241900'},rose:{accent:'#FF80AB',soft:'rgba(255,128,171,.13)',border:'rgba(255,128,171,.42)',text:'#290611'},orange:{accent:'#FFAB40',soft:'rgba(255,171,64,.13)',border:'rgba(255,171,64,.42)',text:'#251100'},cyan:{accent:'#18FFFF',soft:'rgba(24,255,255,.11)',border:'rgba(24,255,255,.38)',text:'#002020'},indigo:{accent:'#8C9EFF',soft:'rgba(140,158,255,.13)',border:'rgba(140,158,255,.42)',text:'#080d2b'},magenta:{accent:'#EA80FC',soft:'rgba(234,128,252,.13)',border:'rgba(234,128,252,.42)',text:'#25052a'},teal:{accent:'#64FFDA',soft:'rgba(100,255,218,.12)',border:'rgba(100,255,218,.40)',text:'#00251d'}};
 const theme=themes[ad.theme]||themes.gold,card=document.createElement('div');card.dataset.adId=ad.id;
 card.style.cssText=`margin:14px 0;padding:16px;border:1px solid ${theme.border};background:${theme.soft};border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.18)`;
 card.innerHTML=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:20px">${esc(ad.icon||'✨')}</span><span style="font-size:10px;color:${theme.accent};font-weight:950;letter-spacing:.8px;text-transform:uppercase">${esc(ad.label||'Featured')}</span></div><b style="display:block;font-size:15px;line-height:1.35">${esc(ad.title)}</b>${ad.description?`<p style="font-size:12px;color:#c1cac4;line-height:1.55;margin:7px 0 12px">${esc(ad.description)}</p>`:''}<button style="width:100%;padding:12px;border:0;border-radius:11px;background:${theme.accent};color:${theme.text};font-weight:950">${esc(ad.buttonText)}</button><div style="font-size:9px;color:#8f9992;text-align:center;margin-top:7px">Optional external activity · Activity Points are not cash</div>`;
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
 }else if(placement==='inPage'||placement==='buttonAds'){conversation(currentPartner.name).push({id:`AD-${ad.id}-${Date.now()}`,type:'ad',adId:ad.id,placement,time:stamp()});saveState();drawConversation();}
 else{
  sessionStorage.setItem(placement==='popup'?'ce-popup-shown':'ce-half-screen-shown','1');showOverlayAd(ad,placement);
 }
 state.ad.shown[ad.id]=Number(state.ad.shown[ad.id]||0)+1;state.ad.lastAdId=ad.id;state.ad.lastPlacement=placement;resetAdCycle();
}
function resetAdCycle(){state.ad.replyCounter=0;state.ad.nextInterval=randomInterval();saveState()}
function maybeHalfScreen(){}
function mountPartnerAd(){if(!state.adsUnlocked)return;const ad=chooseAd(AD_MANAGER.partnerList),host=document.querySelector('#dashboard .foreigner-list');if(!ad||!host||$('partnerListAd'))return;const wrapper=adCard(ad,'partnerList');wrapper.id='partnerListAd';host.prepend(wrapper)}
function mountEarningsAd(){if(!state.adsUnlocked)return;const ad=chooseAd(AD_MANAGER.earnings),host=document.querySelector('#earnings');if(!ad||!host||$('earningsAd'))return;const wrapper=adCard(ad,'earnings');wrapper.id='earningsAd';host.appendChild(wrapper)}

window.claimStreak=()=>{$('streakModal')&&($('streakModal').style.display='none')};
window.closeBackWarn=()=>$('backWarn')?.classList.remove('show');
window.trackClick=()=>true;

function injectCSS(){
 const style=document.createElement('style');style.textContent=`#chat{height:100dvh;overflow:hidden}.chat-header{position:sticky;top:0;z-index:100;padding-top:env(safe-area-inset-top)}.chat-body{height:calc(100dvh - 145px - env(safe-area-inset-bottom));overflow-y:auto;padding:14px 12px 150px!important;scroll-behavior:smooth}.chat-input-wrap{position:fixed;left:0;right:0;bottom:0;max-width:480px;margin:auto;padding-bottom:calc(10px + env(safe-area-inset-bottom));background:#111511}.msg-row{display:flex;flex-direction:column;align-items:flex-start;margin:8px 0}.msg-row.mine{align-items:flex-end}.msg-bubble{max-width:82%;padding:10px 12px;border-radius:18px;line-height:1.45}.msg-theirs{background:#242824;border-bottom-left-radius:5px}.msg-mine{background:#075e54;border-bottom-right-radius:5px}.chat-day{text-align:center;font-size:10px;color:#7c8880;margin:10px 0}.quick-replies{bottom:78px}.quick-reply:disabled{opacity:.45}`;
 document.head.appendChild(style);document.documentElement.dataset.build='ChatEarn Long Chat Opportunities 2026.07.22';
}
function restoreJourney(){
 let nav={};try{nav=JSON.parse(localStorage.getItem(navKey())||'{}')}catch{}
 if(state.kyc.openedAt&&!state.kyc.returnedAt){handleReturn();return}
 if(nav.screen==='chat'&&nav.partner){const index=PARTNERS.findIndex(p=>p.name===nav.partner);openChat(index>=0?index:0)}
 else if(state.withdrawal&&['sharewall','kyc','processing'].includes(nav.screen))showScreen(nav.screen)
 else if(state.lastPartner){showScreen('dashboard')}
 else runSetup(false);
}
async function boot(){
 injectCSS();const result=await sb.auth.getSession();authUser=result.data.session?.user||null;
 if(!authUser)return showScreen('landing');
 loadState();state.name=state.name||authUser.user_metadata?.full_name||authUser.email?.split('@')[0]||'User';creditSignupOnce();restoreJourney();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
