import SimpleTrailActivity from '../../../../components/trail/SimpleTrailActivity';
import { HEALTH_CONSUMPTION_ACTIVITIES } from '../../../../data/healthConsumptionActivities';

export default function AtividadeCaminhos() {
  return (
    <SimpleTrailActivity
      activity={HEALTH_CONSUMPTION_ACTIVITIES.ilusaoDinheiro}
    />
  );
}
