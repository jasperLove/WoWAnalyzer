import SPELLS from 'common/SPELLS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { DamageEvent } from 'parser/core/Events';
import { encodeTargetString } from 'parser/shared/modules/Enemies';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import AverageTargetsHit from 'parser/ui/AverageTargetsHit';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

import { SURVIVAL_CHAKRAM_TYPES } from '@wowanalyzer/hunter-survival/src/constants';

/**
 * Throw a pair of chakrams at your target, slicing all enemies in the chakrams' path for (40% of Attack power) Physical damage. The chakrams will return to you, damaging enemies again.
 *
 * Example log:
 * https://www.warcraftlogs.com/reports/VGNkQ6BFbcdPvMDX#fight=20&type=damage-done&source=169&ability=-259391
 */

class Chakrams extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };
  casts = 0;
  targetsHit = 0;
  uniqueTargets: string[] = [];
  protected spellUsable!: SpellUsable;

  constructor(options: Options) {
    super(options);

    this.active = this.selectedCombatant.hasTalent(SPELLS.CHAKRAMS_TALENT.id);

    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.CHAKRAMS_TALENT),
      this.onCast,
    );
    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SURVIVAL_CHAKRAM_TYPES),
      this.onDamage,
    );
  }

  onCast() {
    this.uniqueTargets = [];
    this.casts += 1;
  }

  onDamage(event: DamageEvent) {
    if (this.casts === 0) {
      this.casts += 1;
      this.spellUsable.beginCooldown(SPELLS.CHAKRAMS_TALENT.id, event);
    }
    const damageTarget: string = encodeTargetString(event.targetID, event.targetInstance);
    if (!this.uniqueTargets.includes(damageTarget)) {
      this.targetsHit += 1;
      this.uniqueTargets.push(damageTarget);
    }
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(21)}
        size="flexible"
        category={STATISTIC_CATEGORY.TALENTS}
      >
        <BoringSpellValueText spellId={SPELLS.CHAKRAMS_TALENT.id}>
          <>
            <AverageTargetsHit casts={this.casts} hits={this.targetsHit} unique />
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Chakrams;
