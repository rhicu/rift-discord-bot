import { RiftClass, RiftRoles } from '@src/db/models/character';

const riftClasses = {

  // WARRIOR
  warrior: RiftClass.WARRIOR,
  warri: RiftClass.WARRIOR,
  w: RiftClass.WARRIOR,
  krieger: RiftClass.WARRIOR,

  // ROGUE
  rogue: RiftClass.ROGUE,
  r: RiftClass.ROGUE,
  schurke: RiftClass.ROGUE,
  s: RiftClass.ROGUE,

  // PRIMALIST
  primalist: RiftClass.PRIMALIST,
  prima: RiftClass.PRIMALIST,
  p: RiftClass.PRIMALIST,

  // MAGE
  mage: RiftClass.MAGE,
  m: RiftClass.MAGE,
  magier: RiftClass.MAGE,

  // CLERIC
  cleric: RiftClass.CLERIC,
  cleri: RiftClass.CLERIC,
  c: RiftClass.CLERIC,
  kleriker: RiftClass.CLERIC,
  kleri: RiftClass.CLERIC,
  k: RiftClass.CLERIC,

};

const riftRoles = {

  // DAMAGE_DEALER
  dd: RiftRoles.DAMAGE_DEALER,
  damage: RiftRoles.DAMAGE_DEALER,
  'damage dealer': RiftRoles.DAMAGE_DEALER,
  damagedealer: RiftRoles.DAMAGE_DEALER,
  schaden: RiftRoles.DAMAGE_DEALER,
  dps: RiftRoles.DAMAGE_DEALER,

  // HEAL
  heal: RiftRoles.HEAL,
  healer: RiftRoles.HEAL,
  h: RiftRoles.HEAL,
  heiler: RiftRoles.HEAL,
  heilung: RiftRoles.HEAL,

  // SUPPORT
  support: RiftRoles.SUPPORT,
  sup: RiftRoles.SUPPORT,
  supp: RiftRoles.SUPPORT,
  unterstützung: RiftRoles.SUPPORT,
  s: RiftRoles.SUPPORT,

  // TANK
  tank: RiftRoles.TANK,
  t: RiftRoles.TANK,

};

export {
  riftClasses,
  riftRoles,
};
