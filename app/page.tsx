"use client";

import { useMemo, useState } from "react";

type Person = { id:string; name:string; role:string; group:"职场"|"私人"|"家庭"; strength:"弱关系"|"正在建立"|"中等"|"未知"; strengthKey:"weak"|"emerging"|"moderate"|"unknown"; summary:string; facts:string[]; inference?:{text:string;confidence:"中"|"低"|"高";basis:string}; links:{label:string;value:string}[]; boundaries:string[]; questions:string[] };
type RelationProfile={formal:string;interaction:string;trust:string;influence:string;reciprocity:string;trend:string;trendKey:"up"|"stable"|"unknown";evidence:string;track:string};

const people: Person[] = [
  {id:"liu",name:"刘部长",role:"北一电厂计划经营部负责人",group:"职场",strength:"正在建立",strengthKey:"emerging",summary:"对用户表达过接收意向，可能成为未来重要的直属领导关系。",facts:["被描述为北一电厂计划经营部负责人。","曾主动联系并表达愿意接收用户进入计划经营部。","用户与他曾通过电话确认过相关事项。"],inference:{text:"目前对用户有一定程度的积极评价或接纳意愿。",confidence:"中",basis:"主动联系、表达接收意向，以及此前存在正面推荐。"},links:[{label:"工作",value:"潜在部门负责人 / 直属领导"},{label:"信息",value:"计划经营岗位与组织安排"},{label:"互惠",value:"以可靠表现和清晰沟通建立信任"}],boundaries:["不把接收意向夸大为稳固认可或私人偏爱。","岗位承诺与组织安排以正式信息为准。"],questions:["全名、当前准确职务与汇报关系？","电话日期、原话和已确认事项？","岗位安排是否已经正式确定？"]},
  {id:"long",name:"龙哥",role:"班助 / 职场前辈",group:"职场",strength:"中等",strengthKey:"moderate",summary:"提供过较多一手信息，并愿意帮助推动岗位事项。",facts:["被描述为班助或前辈，熟悉企业运营相关岗位。","给过用户较多一手信息，并表示愿意帮助推动岗位。"],inference:{text:"可能是当前较重要的信息来源和内部引导者。",confidence:"中",basis:"多次提供一手信息并愿意协助。"},links:[{label:"信任",value:"已有实际帮助，稳定程度仍待验证"},{label:"信息",value:"企业运营与岗位相关一手信息"},{label:"互惠",value:"感谢、反馈结果、不过度索取"}],boundaries:["非正式信息不等同于组织正式决定。","避免只在需要帮助时联系。"],questions:["真实姓名、具体岗位与正式关系？","曾在哪些时间点提供哪些关键信息？"]},
  {id:"hr",name:"人力方向的前辈/负责人",role:"身份待确认",group:"职场",strength:"未知",strengthKey:"unknown",summary:"曾希望用户往人力方向发展；用户后来倾向没有选择。",facts:["有一位人力方向的前辈或负责人曾希望用户往人力方向发展。","用户后来倾向没有选择人力方向。"],links:[{label:"工作",value:"职业方向建议或岗位关联"}],boundaries:["未确认具体人物前，不与其他人力相关人物合并。"],questions:["对方是谁、具体职位是什么？","建议、用户回应及后续互动是什么？"]},
  {id:"ops",name:"北一运行方向的班主任/领导",role:"化学运行相关 · 身份待确认",group:"职场",strength:"未知",strengthKey:"unknown",summary:"用户认为此前岗位选择时没有充分征求其意见。",facts:["用户近期意识到此前岗位选择没有充分征求该人物意见。"],inference:{text:"用户可能在意该人物对岗位选择过程的感受或评价。",confidence:"中",basis:"用户事后注意到未充分征求意见。"},links:[{label:"工作",value:"化学运行、岗位选择或培训管理"}],boundaries:["不预设对方因此不满，需以实际互动验证。"],questions:["班主任和领导是否为同一人？","对方身份、意见和后续反应？"]},
  {id:"chem",name:"化学副值长",role:"化学运行 · 姓名待确认",group:"职场",strength:"弱关系",strengthKey:"weak",summary:"刚开始建立联系，已经见面和打过招呼。",facts:["用户与化学副值长见过并打过招呼，关系刚开始建立。"],links:[{label:"工作",value:"化学运行工作网络"}],boundaries:["以自然熟悉和正常工作互动为主，不急于寻求帮助。"],questions:["姓名、具体职责和首次互动日期？"]},
  {id:"jiao",name:"焦琪姐",role:"培训或工作中的前辈/同事",group:"职场",strength:"未知",strengthKey:"unknown",summary:"培训或工作中可以请教、协助看材料的人。",facts:["被描述为可以请教、帮助用户看材料的人。"],links:[{label:"信息",value:"培训、工作材料反馈"},{label:"互惠",value:"请求具体适量，并反馈采纳结果"}],boundaries:["尚无证据表明关系强度或帮助承诺的范围。"],questions:["全名、岗位、认识经过和实际帮助记录？"]},
  {id:"director",name:"刘部长背后的厂长",role:"组织管理链条 · 身份待确认",group:"职场",strength:"未知",strengthKey:"unknown",summary:"仅作为计划经营部相关组织网络中的潜在人物被提及。",facts:["此人物在此前助手概括的组织网络中被提及。"],links:[{label:"工作",value:"组织管理链条"}],boundaries:["不假定用户与其已有直接关系。"],questions:["具体是谁？与刘部长、用户的实际关系？"]},
  {id:"dept",name:"计划经营部同事",role:"潜在同事群体",group:"职场",strength:"未知",strengthKey:"unknown",summary:"尚未逐一建立或记录具体关系。",facts:["被描述为可能即将进入、但尚未真正建立关系的网络。"],links:[{label:"工作",value:"潜在日常协作网络"}],boundaries:["不把群体印象套到具体成员；出现具体人物后单独建档。"],questions:["是否已经正式进入该部门？","已经认识哪些成员？"]},
  {id:"suo",name:"锁丹丹",role:"私人关系人物",group:"私人",strength:"未知",strengthKey:"unknown",summary:"她的反馈会明显影响用户的情绪和注意力；用户会主动分享生活并关注回应。",facts:["用户会主动向锁丹丹分享生活并关注她的反馈。","双方聊天中曾出现需要避免让对方持续‘接用户的球’的议题。"],inference:{text:"用户对这段关系的投入或期待可能高于普通弱关系。",confidence:"中",basis:"对方反馈明显影响用户情绪和注意力。"},links:[{label:"情感",value:"对用户情绪与注意力有明显影响"},{label:"互惠",value:"关注分享、回应和主动性的平衡"}],boundaries:["不根据回复速度或单次互动过度推断感情态度。","尊重对方不持续承接话题的权利，也保护用户的情绪边界。"],questions:["双方具体关系、认识经过与当前状态？","哪些互动体现了主动性或回应不平衡？"]},
  {id:"schoolmate",name:"前女友的闺蜜 / 高中同校同学",role:"重新建立的旧关系 · 姓名待确认",group:"私人",strength:"弱关系",strengthKey:"weak",summary:"多年未联系后重新聊天；其父亲据称与用户在同一集团。",facts:["与用户高中同校，也是用户前女友的闺蜜，多年未联系后重新聊天。","其父亲与用户在同一集团、可能处于一定管理层级——尚未充分确认。"],inference:{text:"用户曾考虑自然恢复关系，同时意识到潜在职业关联。",confidence:"中",basis:"此前对话摘要的直接概括。"},links:[{label:"情感",value:"旧同学与前任社交圈关联"},{label:"工作",value:"未经充分确认的间接集团关联"},{label:"互惠",value:"以真实旧识互动为核心"}],boundaries:["不利用私人关系绕行接近其父亲或索取资源。","其父亲职位为待核实信息。"],questions:["姓名、重新联系的时间与原因？","其父亲的职务信息是否准确且相关？"]},
  {id:"sister",name:"姐姐",role:"家庭成员",group:"家庭",strength:"未知",strengthKey:"unknown",summary:"用户会与姐姐交流，也曾分享她与 GPT 的聊天内容。",facts:["用户有一位姐姐，会与她交流，并曾向助手展示她与 GPT 的聊天内容。"],links:[{label:"家庭",value:"手足关系"},{label:"信息",value:"可能交流想法与聊天内容，具体范围未知"}],boundaries:["姐姐的私人聊天只在用户提供且与当前问题相关时使用。","不从亲属身份自动推断亲密度、支持度或家庭立场。"],questions:["日常关系、沟通模式和她在决策中的角色？"]}
];

const filters=["全部","职场","私人","家庭"] as const;
const nodePositions:Record<string,{x:number;y:number}>={
 liu:{x:70,y:20},long:{x:82,y:37},hr:{x:65,y:48},ops:{x:82,y:61},chem:{x:66,y:72},jiao:{x:86,y:82},director:{x:55,y:12},dept:{x:54,y:32},
 suo:{x:18,y:28},schoolmate:{x:10,y:56},sister:{x:28,y:75}
};
const profiles:Record<string,RelationProfile>={
 liu:{formal:"潜在直属领导 / 岗位接收方",interaction:"发生过主动联系与电话沟通；频率未知",trust:"工作信任正在形成；私人信任无证据",influence:"对岗位接收可能有直接影响；正式权限待确认",reciprocity:"对方表达接收意向；用户侧回馈与履约记录待补",trend:"发展中",trendKey:"up",evidence:"3条二手摘要事实 · 1项中置信度推断",track:"计划经营线 · 管理决策"},
 long:{formal:"职场前辈 / 班助；具体岗位待确认",interaction:"曾提供多次信息并表达协助意愿；时间点待补",trust:"信息信任正在形成；稳定性仍待长期验证",influence:"具有内部信息和潜在引荐影响；无正式决定权证据",reciprocity:"对方已有信息投入；用户的感谢与结果反馈待记录",trend:"发展中",trendKey:"up",evidence:"2条二手摘要事实 · 1项中置信度推断",track:"企业运营与内部信息线 · 引荐推动"},
 hr:{formal:"人力方向前辈或负责人；身份未解析",interaction:"曾提出人力发展方向；后续互动未知",trust:"未知",influence:"曾影响职业路径选择；当前实际影响未知",reciprocity:"对方提出建议；用户倾向未选择，回应方式未知",trend:"未知",trendKey:"unknown",evidence:"2条二手摘要事实 · 无动机推断",track:"人力与职业发展线"},
 ops:{formal:"运行方向班主任或领导；是否同一人待确认",interaction:"用户认为此前未充分征求其意见；实际反应未知",trust:"未知",influence:"可能涉及培养、管理或职业评价；权限待确认",reciprocity:"用户在意程序与礼节；对方投入未知",trend:"待验证",trendKey:"unknown",evidence:"1条二手摘要事实 · 1项中置信度推断",track:"化学运行线 · 培养管理"},
 chem:{formal:"化学副值长；姓名与具体职责待确认",interaction:"见过并打过招呼",trust:"尚无足够互动形成判断",influence:"现场工作影响可能存在；尚无直接证据",reciprocity:"处于自然熟悉阶段",trend:"刚开始",trendKey:"up",evidence:"1条二手摘要事实",track:"化学运行线 · 现场协作"},
 jiao:{formal:"培训或工作前辈/同事；岗位待确认",interaction:"可请教、可协助看材料；实际次数待补",trust:"专业信任可能萌芽；证据不足",influence:"对材料质量和学习可能有支持作用",reciprocity:"请求应具体适量；实际回馈未知",trend:"未知",trendKey:"unknown",evidence:"1条二手摘要事实",track:"培训与专业支持线"},
 director:{formal:"组织管理链上层；具体身份待确认",interaction:"尚无直接互动证据",trust:"不适用 / 未建立",influence:"组织层面的潜在决策影响；与用户的实际关联未知",reciprocity:"无直接关系证据",trend:"未建立",trendKey:"unknown",evidence:"1条低信息量二手摘要",track:"计划经营线 · 上层管理"},
 dept:{formal:"计划经营部潜在同事群体",interaction:"尚未逐一记录具体互动",trust:"必须按具体成员分别判断",influence:"未来可能形成日常协作网络",reciprocity:"尚未发生或未记录",trend:"待进入 / 待确认",trendKey:"unknown",evidence:"1条群体性二手摘要",track:"计划经营线 · 潜在协作"},
 suo:{formal:"私人关系；具体关系性质未确认",interaction:"用户主动分享并关注回应；双方主动性数据不足",trust:"情感关注较明显；信任深度未知",influence:"对用户情绪和注意力有可观察影响",reciprocity:"可能存在承接话题不平衡；尚需具体互动验证",trend:"未知",trendKey:"unknown",evidence:"2条二手摘要事实 · 1项中置信度推断",track:"私人关系 · 情感关注"},
 schoolmate:{formal:"旧同学 / 前女友的闺蜜",interaction:"多年未联系后重新聊天；频率与主动性未知",trust:"旧识基础存在；当前信任需重新建立",influence:"其父亲的职业关联未经确认，不计入实际影响",reciprocity:"应以真实叙旧为核心；双方投入未知",trend:"重新建立",trendKey:"up",evidence:"2条二手摘要，其中1条不确定",track:"私人关系 · 旧识重连"},
 sister:{formal:"家庭成员 / 姐姐",interaction:"会交流；具体频率和主题未知",trust:"不能仅凭亲属身份推定",influence:"可能参与想法交流；对决策的实际影响未知",reciprocity:"家庭互动模式尚未记录",trend:"未知",trendKey:"unknown",evidence:"1条二手摘要事实",track:"家庭关系"}
};
export default function Home(){
 const [query,setQuery]=useState(""); const [filter,setFilter]=useState<(typeof filters)[number]>("全部"); const [selectedId,setSelectedId]=useState("liu");
 const filtered=useMemo(()=>people.filter(p=>(filter==="全部"||p.group===filter)&&`${p.name}${p.role}${p.summary}`.includes(query.trim())),[query,filter]);
 const selected=people.find(p=>p.id===selectedId)||filtered[0]||people[0]; const known=people.filter(p=>p.strengthKey!=="unknown").length;
 return <main><header className="topbar"><div><div className="eyebrow"><span className="live-dot"/>持续维护中 · 更新于 2026.08.21</div><h1>人物关系脉络</h1><p>从你出发，看见关系如何生长、交叠与延伸。</p></div><div className="principle"><span>阅读方法</span><strong>点击节点，展开脉络</strong><small>线条只表示关联，不等于亲疏</small></div></header>
 <section className="toolbar"><div className="search-wrap"><span>⌕</span><input aria-label="搜索人物" placeholder="搜索人物、身份或关系…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="filters" role="group" aria-label="人物分类">{filters.map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="mini-stats"><span><b>{people.length}</b> 个节点</span><span><b>{known}</b> 条关系已有强度判断</span></div></section>
 <section className="network-workspace"><div className="map-scroll"><div className="network-map">
   <div className="map-grain"/><div className="trunk workplace"/><div className="trunk private"/><div className="trunk family"/>
   <div className="branch-label workplace-label">职场脉络 <small>8</small></div><div className="branch-label private-label">私人关系 <small>2</small></div><div className="branch-label family-label">家庭 <small>1</small></div>
   <button className="self-node" aria-label="关系网中心：我"><span>我</span><small>关系中心</small></button>
   {people.map(p=>{const visible=filtered.some(x=>x.id===p.id);const pos=nodePositions[p.id];return <button key={p.id} style={{left:`${pos.x}%`,top:`${pos.y}%`}} className={`network-node ${p.group} ${p.strengthKey} ${selected.id===p.id?"selected":""} ${visible?"":"dimmed"}`} onClick={()=>setSelectedId(p.id)} aria-label={`查看${p.name}的关系档案`}><span className="node-dot">{p.name.slice(0,1)}</span><span className="node-copy"><strong>{p.name}</strong><small>{p.role}</small></span><i>{p.strength}</i></button>})}
   {filtered.length===0&&<div className="map-empty">没有找到匹配人物</div>}
   <div className="map-legend"><span><i className="legend-dot work"/>职场</span><span><i className="legend-dot personal"/>私人</span><span><i className="legend-dot home"/>家庭</span></div>
 </div></div>
 <aside className="inspector"><div className="profile-head"><div className={`avatar hero ${selected.group}`}>{selected.name.slice(0,1)}</div><div><div className="name-line"><h2>{selected.name}</h2><span className="type-chip">{selected.group}</span></div><p>{selected.role}</p></div></div><div className="track-label">{profiles[selected.id].track}</div><p className="summary">{selected.summary}</p>
 <section className="profile-matrix" aria-label="多维关系剖面"><Metric label="正式位置" value={profiles[selected.id].formal}/><Metric label="互动状态" value={profiles[selected.id].interaction}/><Metric label="信任结构" value={profiles[selected.id].trust}/><Metric label="影响方式" value={profiles[selected.id].influence}/><Metric label="互惠状态" value={profiles[selected.id].reciprocity}/><Metric label="变化趋势" value={profiles[selected.id].trend} tone={profiles[selected.id].trendKey}/></section>
 <div className="evidence-strip"><span>证据基础</span><p>{profiles[selected.id].evidence}</p></div>
 <section className="compact-section facts"><Title mark="F" kind="fact" title="已确认事实" sub="现有资料中的直接信息"/><ol>{selected.facts.map((f,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{f}</p></li>)}</ol></section>
 {selected.inference&&<section className="compact-section inference"><Title mark="I" kind="inference" title="当前推断" sub="不是确定事实" extra={`${selected.inference.confidence}置信度`}/><blockquote>{selected.inference.text}</blockquote><div className="basis"><strong>依据</strong><p>{selected.inference.basis}</p></div></section>}
 <details open><summary>关联维度 <span>{selected.links.length}</span></summary><div className="link-list">{selected.links.map(x=><div key={x.label}><span>{x.label}</span><p>{x.value}</p></div>)}</div></details>
 <details><summary>边界提醒 <span>{selected.boundaries.length}</span></summary><ul className="plain-list">{selected.boundaries.map((x,i)=><li key={i}>{x}</li>)}</ul></details>
 <details><summary>待验证信息 <span>{selected.questions.length}</span></summary><ul className="question-list">{selected.questions.map((x,i)=><li key={i}><b>Q{i+1}</b>{x}</li>)}</ul></details>
 </aside></section>
 <footer><span>人物关系脉络 · v1.1</span><p>节点会随新人物与关键互动持续生长</p></footer></main>
}
function Title({mark,kind,title,sub,extra}:{mark:string;kind:string;title:string;sub:string;extra?:string}){return <div className="section-title"><span className={`mark ${kind}-mark`}>{mark}</span><div><h3>{title}</h3><p>{sub}</p></div>{extra&&<span className="confidence">{extra}</span>}</div>}
function Metric({label,value,tone}:{label:string;value:string;tone?:string}){return <div className={`metric ${tone||""}`}><span>{label}</span><p>{value}</p></div>}
