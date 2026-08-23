'use strict';

const companyRoles=['owner','manager','technician','operator','viewer'];
const permissions={
  manageCompany:['owner','manager'],manageRoles:['owner'],editAssets:['owner','manager'],
  work:['owner','manager','technician'],operate:['owner','manager','technician','operator'],view:companyRoles
};

function finiteNumber(value,label='Değer'){
  const number=Number(value);
  if(!Number.isFinite(number))throw new RangeError(`${label} geçerli bir sayı olmalı`);
  return number;
}
function stockQuantityAfter(current,amount,type){
  const available=finiteNumber(current,'Mevcut stok'),quantity=finiteNumber(amount,'Miktar');
  if(!['in','out','count'].includes(type))throw new RangeError('Stok hareket tipi geçersiz');
  if(type==='count'){if(quantity<0)throw new RangeError('Sayım miktarı negatif olamaz');return quantity}
  if(!(quantity>0))throw new RangeError('Miktar 0’dan büyük olmalı');
  const next=type==='in'?available+quantity:available-quantity;
  if(next<0)throw new RangeError(`Stok yetersiz. Mevcut: ${available}`);
  return next;
}
function canCompanyRole(role,capability){return (permissions[capability]||[]).includes(role)}
function sessionStateValid({tokenVersion,userVersion,revokedAt,expiresAt,now=Date.now()}){
  return Number(tokenVersion)===Number(userVersion)&&!revokedAt&&new Date(expiresAt).getTime()>Number(now);
}
function nextCalendarDate(date,months){
  const count=Math.round(finiteNumber(months,'Ay aralığı'));
  if(count<1||count>120)throw new RangeError('Takvim periyodu 1–120 ay olmalı');
  const source=new Date(`${String(date).slice(0,10)}T12:00:00Z`);
  if(Number.isNaN(source.getTime()))throw new RangeError('Geçerli bakım tarihi gerekli');
  const day=source.getUTCDate();source.setUTCDate(1);source.setUTCMonth(source.getUTCMonth()+count);
  const lastDay=new Date(Date.UTC(source.getUTCFullYear(),source.getUTCMonth()+1,0)).getUTCDate();
  source.setUTCDate(Math.min(day,lastDay));return source.toISOString().slice(0,10);
}

module.exports={companyRoles,finiteNumber,stockQuantityAfter,canCompanyRole,sessionStateValid,nextCalendarDate};
