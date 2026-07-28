import PhaseContentLayout from '../../../../components/trail/PhaseContentLayout';
import { HEALTH_CONSUMPTION_CONTENT } from '../../../../data/healthConsumptionContent';

export default function ConteudoIntroducao() {
  return (
    <PhaseContentLayout
      content={HEALTH_CONSUMPTION_CONTENT.introducao}
    />
  );
}
