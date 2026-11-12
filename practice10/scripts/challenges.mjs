import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const file='src/lib/availability.ts';
const clean=fs.readFileSync(file,'utf8');
fs.mkdirSync('evidence',{recursive:true});
fs.writeFileSync('evidence/availability.clean.ts',clean);
const mutations={
 M1:s=>s.replace('duration > MAX_DURATION','duration >= MAX_DURATION'),
 M2:s=>s.replace('start < b.end && end > b.start','start <= b.end && end >= b.start'),
 M3:s=>s.replace('if (blocked) {','if (false && blocked) {'),
 'BUG-A':s=>s.replace('start < b.end && end > b.start','start <= b.end && end >= b.start'),
 'BUG-B':s=>s.replace(/^([ \t]*)for \(const b of bookings\) \{/m,(_,indent)=>`${indent}bookings.sort((a, b) => a.start - b.start);\n${indent}for (const b of bookings) {`)
};
const mode=process.argv[2]||'07';
const names=mode==='07'?['M1','M2','M3']:['BUG-A','BUG-B'];
let summary=[];
try{
 for(const name of names){
  const buggy=mutations[name](clean);
  if(buggy===clean)throw Error('Mutation did not change code: '+name);
  fs.writeFileSync(file,buggy);
  fs.writeFileSync(`evidence/${name}.ts`,buggy);
  const r=spawnSync('npx',['vitest','run','tests/availability.improved.test.ts','--reporter=verbose'],{encoding:'utf8'});
  fs.writeFileSync(`evidence/${name}.txt`,r.stdout+r.stderr);
  const failures=(r.stdout+r.stderr).split('\n').filter(l=>l.includes(' × ')||l.includes(' FAIL ')||l.includes('Tests '));
  console.log(name, 'exit', r.status, failures.join('\n'));
  summary.push({name,exit:r.status,failures});
  fs.writeFileSync(file,clean);
  const targeted=spawnSync('npx',['vitest','run','tests/availability.improved.test.ts','-t',name==='BUG-B'?'T15':name==='BUG-A'?'T01|T08':name==='M1'?'T06':name==='M2'?'T01|T08':'T13','--reporter=verbose'],{encoding:'utf8'});
  fs.writeFileSync(`evidence/${name}-restored-targeted.txt`,targeted.stdout+targeted.stderr);
  if(targeted.status!==0)throw Error('Restored targeted tests failed');
 }
}finally{fs.writeFileSync(file,clean);}
const final=spawnSync('npx',['vitest','run','--reporter=verbose'],{encoding:'utf8'});
fs.writeFileSync(`evidence/${mode}-final.txt`,final.stdout+final.stderr);
fs.writeFileSync(`evidence/${mode}-challenge-summary.json`,JSON.stringify(summary,null,2));
console.log('Restored full suite exit',final.status); console.log(final.stdout);
if(final.status!==0)process.exit(1);
