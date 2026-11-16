"use strict";
const directItems=[
["乗務員給与","固定給・歩合給・手当・賞与引当",1200],
["ハイヤー担当人件費","契約運送の担当乗務員",90],
["法定福利費","乗務員等の会社負担分",210],
["燃料費","LPG・ガソリン等",160],
["車両修繕費","整備・車検・故障修理",55],
["車両減価償却費","購入車両の期間配分",70],
["車両保険料","自賠責・任意保険",60],
["車両関連税金","自動車税・重量税等",20],
["洗車・消耗品","タイヤ・オイル・清掃用品等",15],
["配車・決済手数料","配車アプリ・決済関連費",90],
["道路・施設利用料","高速道路・乗り場使用料等",15],
["車庫・駐車場代","車両保管場所",60]
];
const overheadItems=[
["管理部門人件費","運行管理・所長・事務等（福利費込）",150],
["事務所賃料","営業所・事務室",35],
["水道光熱費","電気・水道・空調",20],
["通信・システム費","電話・会計・勤怠・ネット",15],
["専門家費用","税理士・社労士・法務",15],
["採用・広告・雑費","求人・教育・備品など",10]
];
const $=id=>document.getElementById(id);
const defaults={drivers:30,shifts:12,fare:60000,charter:200,payRatio:55,variableRatio:5,upliftInput:500};
const yen = n=>Math.round(n).toLocaleString("ja-JP")+"円";
const man = n=> (Math.round(n*10)/10).toLocaleString("ja-JP",{maximumFractionDigits:1})+"万円";
const pct = n=>Number.isFinite(n)?n.toFixed(1)+"%":"—";
const val=id=>Math.max(0,Number($(id).value)||0);
function buildRows(tbodyId,items,prefix){
  const tbody=$(tbodyId);
  for(let i=0;i<items.length;i++){
    const [name,desc,amount]=items[i];
    const tr=document.createElement("tr");
    const nameCell=document.createElement("td");nameCell.textContent=name;
    const descCell=document.createElement("td");descCell.textContent=desc;descCell.className="muted";
    const cell=document.createElement("td");
    const input=document.createElement("input");input.type="number";input.min="0";input.step="1";input.value=amount;input.id=prefix+i;input.setAttribute("aria-label",name+" 万円/月");
    input.addEventListener("input",calculate);
    cell.append(input);tr.append(nameCell,descCell,cell);tbody.append(tr);
  }
}
function sum(items,prefix){return items.reduce((s,_,i)=>s+val(prefix+i),0)}
function show(id,value){$(id).textContent=value}
function calculate(){
  const drivers=val("drivers"),shifts=val("shifts"),fare=val("fare"),charter=val("charter");
  const taxi=drivers*shifts*fare/10000, revenue=taxi+charter;
  const direct=sum(directItems,"direct"),overhead=sum(overheadItems,"overhead");
  const gross=revenue-direct,operating=gross-overhead;
  show("taxiRevenue",man(taxi));show("charterRevenue",man(charter));show("totalRevenue",man(revenue));
  show("directTotal",man(direct));show("overheadTotal",man(overhead));
  show("grossProfit",man(gross));show("grossMargin",revenue?pct(gross/revenue*100):"—");
  show("operatingProfit",man(operating));show("operatingMargin",revenue?pct(operating/revenue*100):"—");
  $("operatingCard").classList.toggle("negative",operating<0);$("marginCard").classList.toggle("negative",operating<0);
  const base=Math.max(revenue,direct+overhead,0.01);
  $("barDirect").style.width=(direct/base*100)+"%";
  $("barOverhead").style.width=(overhead/base*100)+"%";
  $("barProfit").style.width=(Math.max(0,operating)/base*100)+"%";
  const uplift=val("upliftInput"), pay=val("payRatio"),variable=val("variableRatio");
  const extra=drivers*shifts*uplift/10000, extraCosts=extra*(pay+variable)/100;
  const contribution=extra-extraCosts;
  show("upliftAmount",yen(uplift));show("extraRevenue",man(extra));show("extraCost",man(extraCosts));
  show("extraProfit",man(contribution));show("contributionRate",pct(100-pay-variable));
  show("afterProfit",man(operating+contribution));show("annualExtra",man(contribution*12));
  $("extraCard").classList.toggle("negative",contribution<0);
}
buildRows("directCosts",directItems,"direct");buildRows("overheadCosts",overheadItems,"overhead");
for(const id of Object.keys(defaults))$(id).addEventListener("input",calculate);
$("reset").addEventListener("click",()=>{
 for(const [id,value] of Object.entries(defaults))$(id).value=value;
 directItems.forEach((x,i)=>$("direct"+i).value=x[2]);
 overheadItems.forEach((x,i)=>$("overhead"+i).value=x[2]);
 calculate();
});
$("print").addEventListener("click",()=>window.print());
const menu=$("site-nav"),btn=document.querySelector(".menu-btn");
btn.addEventListener("click",()=>{const opened=menu.classList.toggle("open");btn.setAttribute("aria-expanded",String(opened))});
calculate();
