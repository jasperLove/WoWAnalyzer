import { t } from '@lingui/macro';
import SPELLS from 'common/SPELLS';
import { SpellIcon } from 'interface';
import { SpellLink } from 'interface';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { CastEvent, RemoveBuffEvent } from 'parser/core/Events';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Combatants from 'parser/shared/modules/Combatants';
import HealingDone from 'parser/shared/modules/throughput/HealingDone';
import BoringValue from 'parser/ui/BoringValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

const debug = false;

const REJUV_DURATION = 15000;
const MS_BUFFER = 200;
const PANDEMIC_THRESHOLD = 0.7;
const FLOURISH_EXTENSION = 8000;

/*
 * This module tracks early refreshments of rejuvenation.
 * TODO: Extend/refactor this module to include other HoTs/Spells as well such as lifebloom/efflorescence
 * TODO: Add this module to checklist
 * TODO: refactor to just use HotTracker rather than own logic
 */
class PrematureRejuvenations extends Analyzer {
  static dependencies = {
    healingDone: HealingDone,
    combatants: Combatants,
  };

  protected healingDone!: HealingDone;
  protected combatants!: Combatants;

  totalRejuvsCasts = 0;
  rejuvenations: Array<{ targetId: number | undefined; timestamp: number }> = [];
  earlyRefreshments = 0;
  timeLost = 0;

  constructor(options: Options) {
    super(options);
    // TODO - Extend this module to also support when using Germination.
    this.active = !this.selectedCombatant.hasTalent(SPELLS.GERMINATION_TALENT.id);
    this.addEventListener(
      Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.REJUVENATION),
      this.onRemoveBuff,
    );
    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.REJUVENATION),
      this.onRejuvCast,
    );
    this.addEventListener(
      Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.FLOURISH_TALENT),
      this.onFlourish,
    );
    this.addEventListener(
      Events.refreshbuff.by(SELECTED_PLAYER).spell(SPELLS.FLOURISH_TALENT),
      this.onFlourish,
    );
    this.addEventListener(Events.fightend, this.onFightend);
  }

  onRemoveBuff(event: RemoveBuffEvent) {
    const target = this.combatants.getEntity(event);
    if (!target) {
      return; // target wasn't important (a pet probably)
    }

    // Sanity check - Remove rejuvenation from array if it was removed from target player.
    this.rejuvenations = this.rejuvenations.filter((e) => e.targetId !== event.targetID);
  }

  onRejuvCast(event: CastEvent) {
    this.totalRejuvsCasts += 1;

    const oldRejuv = this.rejuvenations.find((e) => e.targetId === event.targetID);
    if (oldRejuv == null) {
      this.rejuvenations.push({ targetId: event.targetID, timestamp: event.timestamp });
      return;
    }

    const pandemicTimestamp =
      oldRejuv.timestamp + (REJUV_DURATION * PANDEMIC_THRESHOLD + MS_BUFFER);
    if (pandemicTimestamp > event.timestamp) {
      this.earlyRefreshments += 1;
      this.timeLost += pandemicTimestamp - event.timestamp;
    }

    // Account for pandemic time if hot was applied within the pandemic timeframe.
    let pandemicTime = 0;
    if (
      event.timestamp >= pandemicTimestamp &&
      event.timestamp <= oldRejuv.timestamp + REJUV_DURATION
    ) {
      pandemicTime = oldRejuv.timestamp + REJUV_DURATION - event.timestamp;
    } else if (event.timestamp <= pandemicTime) {
      pandemicTime = REJUV_DURATION - REJUV_DURATION * PANDEMIC_THRESHOLD;
    }
    debug && console.log('Extended within pandemic time frame: ' + pandemicTime);

    // Set the new timestamp
    oldRejuv.timestamp = event.timestamp + pandemicTime;
  }

  onFlourish() {
    // TODO - Flourish extends all active rejuvenations within 60 yards by 8 seconds. Add range check possible?
    this.rejuvenations = this.rejuvenations.map((o) => ({
      ...o,
      timestamp: o.timestamp + FLOURISH_EXTENSION,
    }));
  }

  onFightend() {
    debug && console.log('Finished: %o', this.rejuvenations);
    debug && console.log('Early refreshments: ' + this.earlyRefreshments);
    debug && console.log('Time lost: ' + this.timeLost);
  }

  get timeLostPerMinute() {
    return this.timeLost / (this.owner.fightDuration / 1000 / 60);
  }

  get timeLostInSeconds() {
    return this.timeLost / 1000;
  }

  get timeLostInSecondsPerMinute() {
    return this.timeLostPerMinute / 1000;
  }

  get earlyRefreshmentsPerMinute() {
    return this.earlyRefreshments / (this.owner.fightDuration / 1000 / 60);
  }

  get timeLostThreshold() {
    return {
      actual: this.timeLostInSecondsPerMinute,
      isGreaterThan: {
        minor: 0,
        average: 4,
        major: 9,
      },
      style: ThresholdStyle.NUMBER,
    };
  }

  suggestions(when: When) {
    when(this.timeLostThreshold).addSuggestion((suggest) =>
      suggest(
        <>
          Don't refresh <SpellLink id={SPELLS.REJUVENATION.id} /> if it's not within pandemic time
          frame (4.5s left on buff).
        </>,
      )
        .icon(SPELLS.REJUVENATION.icon)
        .actual(
          t({
            id: 'druid.restoration.suggestions.rejuvenation.wastedSeconds',
            message: `You refreshed early ${
              this.earlyRefreshments
            } times which made you waste ${this.timeLostInSeconds.toFixed(
              2,
            )} seconds of rejuvenation.`,
          }),
        )
        .recommended(`0 seconds lost is recommended`),
    );
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(18)}
        size="flexible"
        tooltip={
          <>
            You refreshed Rejuvenation early <strong>{this.earlyRefreshments} times</strong>, losing
            a total of <strong>{this.timeLostInSeconds.toFixed(1)}s</strong> of HoT duration (
            {this.timeLostInSecondsPerMinute.toFixed(1)}s per minute).
          </>
        }
      >
        <BoringValue
          label={
            <>
              <SpellIcon id={SPELLS.REJUVENATION.id} /> Early Rejuvenation refreshes
            </>
          }
        >
          <>
            {this.earlyRefreshmentsPerMinute.toFixed(1)} <small>per minute</small>
          </>
        </BoringValue>
      </Statistic>
    );
  }
}

export default PrematureRejuvenations;
