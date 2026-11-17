const storageKey = "brain-teaser-ctf-progress";
const answers = {
  "fib-next": 13, "fib-missing": 21, "fib-later": 55,
  "seq-next": 31, "seq-fib": 34, "seq-sum": 3,
  "est-round": 600, "est-product": 1200, "est-people": 50,
  "case-bus": 6, "case-jars": 10, "case-distance": 20
};
const hints = {
  "fib-next": "Add the two numbers immediately before the blank.",
  "fib-missing": "In Fibonacci, every term is the sum of the previous two.",
  "fib-later": "Continue one step at a time after 21.",
  "seq-next": "Look at the gaps: +2, +4, +6, +8...",
  "seq-fib": "Check whether 8 + 13 produces the missing term.",
  "seq-sum": "Find the next Fibonacci term first, then add its digits.",
  "est-round": "Round 397 to 400 and 204 to 200.",
  "est-product": "Round 39 to 40 before multiplying.",
  "est-people": "Use a nearby friendly total: 198 is close to 200.",
  "case-bus": "Estimate 238 as 240, then divide by 40.",
  "case-jars": "Estimate 487 as 500 and 52 as 50.",
  "case-distance": "Add the rounded distances: 12 + 8."
};
const stageQuestions = {
  "fibonacci": ["fib-next", "fib-missing", "fib-later"],
  "sequence": ["seq-next", "seq-fib", "seq-sum"],
  "estimate": ["est-round", "est-product", "est-people"],
  "case-file": ["case-bus", "case-jars", "case-distance"]
};
const attempts = {};
function getSolved(){try{return JSON.parse(localStorage.getItem(storageKey)||"{}");}catch{return {};}}
function stageComplete(stage,solved){return stageQuestions[stage].every(q=>solved[q]);}
function render(){
  const solved=getSolved(), stages=Object.keys(stageQuestions);
  const completed=stages.filter(s=>stageComplete(s,solved)).length;
  const dots=document.querySelector(".stage-dots"); dots.innerHTML="";
  stages.forEach(s=>{const d=document.createElement("span");if(stageComplete(s,solved)){d.className="cleared";d.textContent="✓";}dots.appendChild(d);});
  document.querySelector(".status-text").textContent=completed===4?"Challenge complete":completed?"Keep thinking":"Begin the challenge";
  document.querySelectorAll(".answer-card").forEach(form=>{const id=form.dataset.question,done=!!solved[id],input=form.querySelector("input"),button=form.querySelector("button"),feedback=form.querySelector(".feedback");form.classList.toggle("solved",done);input.disabled=done;button.disabled=done;button.textContent=done?"Correct":"Check";form.querySelector(".question-label span").textContent=done?"✓":"○";if(done){input.placeholder="Solved";feedback.textContent="Correct — lock opened.";feedback.classList.add("correct");}});
  document.querySelector(".stage-clear").hidden=!stageComplete(document.body.dataset.stage,solved);
  const flag=document.querySelector(".final-flag");if(flag)flag.hidden=completed!==4;
}
document.querySelectorAll(".answer-card").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();const id=form.dataset.question,input=form.querySelector("input"),feedback=form.querySelector(".feedback"),value=Number(input.value.trim());if(!input.value.trim()||!Number.isFinite(value)){feedback.textContent="Type a number before checking.";return;}if(value===answers[id]){const solved=getSolved();solved[id]=true;localStorage.setItem(storageKey,JSON.stringify(solved));render();return;}attempts[id]=(attempts[id]||0)+1;feedback.classList.remove("correct");feedback.textContent=attempts[id]>=2?`Not yet. Light hint: ${hints[id]}`:"Not yet — examine the pattern or estimate again.";}));
document.querySelector(".reset-button").addEventListener("click",()=>{localStorage.removeItem(storageKey);location.reload();});
render();
