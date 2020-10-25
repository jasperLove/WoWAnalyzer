import SPELLS from 'common/SPELLS';

const spells: number[] = [
  /**
   * This can consist of boss mechanics marked as casts, buff applications marked
   * as separate casts from the normal ability, toy casts that some people macro
   * into their abilities and so forth
   */
  SPELLS.MELEE.id, // Auto attack
  SPELLS.ASTRAL_VULNERABILITY.id, // Tomb of Sargeras - Sisters of the Moon: the "tick" when someone crosses moons
  SPELLS.ANNIHILATION_TRILLIAX.id, // The Nighthold - cake boss: the "tick" of the Annihilation beam
  SPELLS.CHI_BURST_HEAL.id, // this is the "tick" when you hit a player, the actual cast has a different id
  SPELLS.REFRESHING_JADE_WIND_HEAL.id, // this is the "tick" when you hit a player, the actual cast has a different id
  SPELLS.SHADOWY_APPARITION.id,
  SPELLS.SHADOWY_APPARITION_CAST.id, // Shadow priest shadow apparitions passive
  SPELLS.DEFILED_AUGMENT_RUNE.id,
  SPELLS.PRIMAL_FURY.id, // Feral Druid "extra CP on crit" proc causes a cast event
  SPELLS.GUSHING_LACERATIONS_PROC.id, // Feral Druid azerite trait causes a cast event when it procs a combo point
  SPELLS.BLOW_DARKMOON_WHISTLE.id, //Darkmoon Whistle active that some people macro into abilities
  SPELLS.DARKMOON_FIREWORK.id, //Darkmoon Firework toy
  SPELLS.BIG_RED_RAYS.id, //Big Red Raygun active effect
  SPELLS.FRACTURE_MAIN_HAND.id, // Fracture main hand damage ability
  SPELLS.FRACTURE_OFF_HAND.id, // Fracture off hand damage ability
  SPELLS.SOUL_FRAGMENT_KILLING_BLOW.id, // Soul Fragment that are sometimes generated by killing blows (it does not affect much of a rotation, because it's usually ~1:200, comparing to usual soul fragment generation)
  255724, // proc from a Legion Antorus trinket
  SPELLS.GALECALLERS_BOON_CAST.id, //This can be used off GCD
  SPELLS.MUTILATE_OFFHAND.id, // Mutilate off hand
  SPELLS.DIRE_BEAST_SUMMON.id, //A secondary cast event from Dire Beast talent
  SPELLS.DIVINE_HYMN_HEAL.id, //The heal component of divine hymn
  SPELLS.CHARGE_2.id, // The damage component of charge
  285503, // Lady Jaina Proudmoore boss mechanic (picking up munitions barrel)
  285347, // Plague of Fire - King Rastakhan mechanic
  SPELLS.CLOUDBURST_TOTEM_RECALL.id, // Cloudburst reactivation
  SPELLS.SPIRITWALKERS_GRACE.id,
  316944, // Dragon's Flight - Feather Fall (DNT)
  SPELLS.CELESTIAL_GUIDANCE_CAST.id, //Celestial Guidance enchant proc

  //region Hunter
  SPELLS.BARBED_SHOT_PET_BUFF.id, //The buff applied to BM Hunter pet when casting Barbed Shot
  SPELLS.DIRE_BEAST_SUMMON.id,
  //endregion

  //region Covenants
  SPELLS.RESONATING_ARROW_DEBUFF.id, //The debuff applied to mobs inside Kyrian hunter ability resonating arrow area of effect
  SPELLS.COMBAT_MEDITATION_TRIGGER.id, //The Spell ID when Combat Meditation from Kyrian Soulbind triggers, so that there is now a soul ready to pick up
  SPELLS.COMBAT_MEDITATION_PICK_UP.id, //The Spell ID that is "cast" when an orb is picked up
  SPELLS.WILD_MARK.id, //The debuff applied from enemies inside Wild Spirits
  //endregion
];

export default spells;
