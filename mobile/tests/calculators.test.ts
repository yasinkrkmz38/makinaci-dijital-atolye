import {describe,expect,it} from 'vitest';
import {calculate,calculators} from '@/services/calculators';

describe('teknik hesaplayıcılar',()=>{
  it('on gerçek hesaplayıcı sunar',()=>expect(calculators).toHaveLength(10));
  it('kesme hızını doğru hesaplar',()=>expect(calculate('cutting_speed',{diameter:100,rpm:1000})).toBeCloseTo(314.159,3));
  it('hidrolik gücü doğru hesaplar',()=>expect(calculate('hydraulic_power',{pressure:180,flow:40})).toBeCloseTo(12));
  it('motor akımında verim ve güç faktörünü uygular',()=>expect(calculate('motor_current',{power:11,voltage:400,efficiency:.9,pf:.85})).toBeCloseTo(20.76,1));
  it.each([0,-1,Number.NaN,Number.POSITIVE_INFINITY])('geçersiz pozitif değeri reddeder: %s',diameter=>expect(()=>calculate('cutting_speed',{diameter,rpm:1000})).toThrow());
  it('eksik alanı reddeder',()=>expect(()=>calculate('bearing_life',{capacity:30,load:5})).toThrow());
});
