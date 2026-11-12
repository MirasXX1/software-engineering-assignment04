import { describe, it, expect } from 'vitest';
import { checkAvailability, toClock } from '../src/lib/availability';
const fixture = () => ({nowRaw:'540',startRaw:'660',endRaw:'720',blocked:false,bookings:[{start:600,end:660,label:'Calculus 101'}]});
const cases: [string,string,string,string,boolean?,boolean?][] = [
['T01 AC4 touching after','660','720','available'],
['T02 AC1 starts now','540','570','unavailable'],
['T03 AC1 zero duration','720','720','unavailable'],
['T04 AC1 reversed','750','720','unavailable'],
['T05 AC1 beyond day','1380','1441','unavailable'],
['T06 AC2 exactly 120','720','840','available'],
['T07 AC2 121 minutes','720','841','unavailable'],
['T08 AC4 touching before','570','600','available'],
['T09 AC4 partial overlap','630','690','unavailable'],
['T10 AC4 contains booking','570','690','unavailable'],
['T11 AC4 inside booking','615','645','unavailable'],
['T12 AC4 identical interval','600','660','unavailable'],
['T13 AC3 blocked','660','720','unavailable',true],
['T14 AC4 empty bookings','630','690','available',false,true],
];
describe('Improved suite',()=>{
 for(const [id,startRaw,endRaw,status,blocked=false,empty=false] of cases){
  it(id,()=>{const input={...fixture(),startRaw,endRaw,blocked}; if(empty)input.bookings=[]; const before=structuredClone(input.bookings); expect(checkAvailability(input).status).toBe(status); expect(input.bookings).toEqual(before);});
 }
 it('T15 AC5 preserves values order labels and references after repeated checks',()=>{
  const input=fixture(); input.bookings=[{start:900,end:930,label:'Later class'},{start:600,end:660,label:'Calculus 101'}];
  const before=structuredClone(input.bookings), refs=[...input.bookings], array=input.bookings;
  for(let i=0;i<3;i++) {expect(checkAvailability(input).status).toBe('available'); expect(checkAvailability({...input,startRaw:'630',endRaw:'650'}).status).toBe('unavailable');}
  expect(input.bookings).toBe(array);expect(input.bookings).toEqual(before);expect(input.bookings[0]).toBe(refs[0]);expect(input.bookings[1]).toBe(refs[1]);
 });
 it('T16 AC1 valid day endpoint and 24:00 feedback',()=>{const result=checkAvailability({...fixture(),startRaw:'1320',endRaw:'1440'}); expect(result).toEqual({status:'available',reason:'Free for 120 min (22:00-24:00).'});expect(toClock(1440)).toBe('24:00');});
 it('T17 AC1 fractional minute rejected',()=>{expect(checkAvailability({...fixture(),startRaw:'720.5',endRaw:'750'})).toEqual({status:'unavailable',reason:'Enter whole-number start and end minutes.'});});
 it('T18 AC6 missing input has exact useful feedback',()=>{expect(checkAvailability({...fixture(),startRaw:''})).toEqual({status:'unavailable',reason:'Enter whole-number start and end minutes.'});});
 it('T19 AC1 past start rejected',()=>{expect(checkAvailability({...fixture(),startRaw:'539',endRaw:'570'}).status).toBe('unavailable');});
 it('T20 AC1 invalid simulated now rejected',()=>{expect(checkAvailability({...fixture(),nowRaw:'1440'})).toEqual({status:'unavailable',reason:"Simulated 'now' must be a whole minute from 0 to 1439."});});
});
