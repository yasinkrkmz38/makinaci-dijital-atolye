'use strict';
(function(){
  const attributes=['onclick','onchange','oninput','onsubmit'];
  function split(source,separator){
    const parts=[];let current='',quote='',escaped=false,depth=0;
    for(const char of String(source||'')){
      if(escaped){current+=char;escaped=false;continue}
      if(char==='\\'){current+=char;escaped=true;continue}
      if(quote){current+=char;if(char===quote)quote='';continue}
      if(char==="'"||char==='"'){current+=char;quote=char;continue}
      if(char==='(')depth++;
      if(char===')')depth--;
      if(char===separator&&depth===0){if(current.trim())parts.push(current.trim());current='';continue}
      current+=char;
    }
    if(current.trim())parts.push(current.trim());return parts;
  }
  function argument(value,element,event){
    const token=String(value||'').trim();
    if(token==='this')return element;if(token==='event')return event;if(token==='this.value')return element.value;
    if(token==='true')return true;if(token==='false')return false;if(token==='null')return null;if(token==='undefined')return undefined;
    if(/^-?\d+(?:\.\d+)?$/.test(token))return Number(token);
    if((token.startsWith("'")&&token.endsWith("'"))||(token.startsWith('"')&&token.endsWith('"'))){return token.slice(1,-1).replace(/\\n/g,'\n').replace(/\\(['"\\])/g,'$1')}
    throw Error(`İzin verilmeyen olay argümanı: ${token}`);
  }
  function callArgs(source,element,event){return source.trim()?split(source,',').map(value=>argument(value,element,event)):[]}
  function executeStatement(statement,element,event){
    if(!statement||statement==='return false'||statement==='void(0)')return;
    let match=statement.match(/^location\.href\s*=\s*(['"])(.*?)\1$/);if(match){location.href=match[2];return}
    match=statement.match(/^window\.(open|print)\((.*)\)$/);if(match){window[match[1]](...callArgs(match[2],element,event));return}
    match=statement.match(/^navigator\.clipboard\.writeText\((.*)\)$/);if(match){navigator.clipboard.writeText(...callArgs(match[1],element,event));return}
    match=statement.match(/^\$\((['"])(.*?)\1\)\.(value)\s*=\s*(['"])(.*?)\4$/);if(match){const target=document.getElementById(match[2]);if(target)target[match[3]]=match[5];return}
    match=statement.match(/^\$\((['"])(.*?)\1\)\.(focus)\(\)$/);if(match){document.getElementById(match[2])?.focus();return}
    match=statement.match(/^\$\((['"])(.*?)\1\)\.classList\.(add|remove|toggle)\((.*)\)$/);if(match){const target=document.getElementById(match[2]);if(target)target.classList[match[3]](...callArgs(match[4],element,event));return}
    match=statement.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/);if(match){const fn=window[match[1]];if(typeof fn!=='function')throw Error(`Olay işlevi bulunamadı: ${match[1]}`);return fn(...callArgs(match[2],element,event))}
    throw Error(`İzin verilmeyen olay ifadesi: ${statement}`);
  }
  function bind(element,attribute){
    if(element.dataset[`bound${attribute}`])return;
    const source=element.getAttribute(attribute);if(!source)return;
    element.removeAttribute(attribute);element.dataset[`bound${attribute}`]='1';
    if((element.closest('#authGate')&&attribute==='onclick')||(element.classList.contains('adminNav')&&attribute==='onclick'))return;
    const eventName=attribute.slice(2);
    element.addEventListener(eventName,event=>{
      if(source.includes('return false'))event.preventDefault();
      try{for(const statement of split(source,';')){const result=executeStatement(statement,element,event);if(result&&typeof result.catch==='function')result.catch(error=>console.error('UI action:',error))}}
      catch(error){console.error('UI action:',error)}
    });
  }
  function scan(root){if(root.nodeType!==1&&root.nodeType!==9)return;const elements=root.nodeType===1?[root,...root.querySelectorAll('*')]:[...root.querySelectorAll('*')];for(const element of elements)for(const attribute of attributes)if(element.hasAttribute?.(attribute))bind(element,attribute)}
  scan(document);
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)scan(node)}).observe(document.documentElement,{childList:true,subtree:true});
})();
