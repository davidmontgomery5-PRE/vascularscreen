import { useMemo } from 'react';
import { Disclaimer } from './components/Disclaimer';
import { MobileJumpBar } from './components/MobileJumpBar';
import { Scorecard } from './components/Scorecard';
import { TopBar } from './components/TopBar';
import { scoreAll } from './engine/score';
import { usePatientSession } from './hooks/usePatientSession';

export default function App() {
  const { session, toggle, setPayor, setAaaPriorSbe, reset } = usePatientSession();

  const scores = useMemo(
    () =>
      scoreAll({
        activeIds: session.activeIds,
        payor: session.payor,
        aaaPriorSbe: session.aaaPriorSbe,
      }),
    [session],
  );

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-brand-navy-tint via-white to-brand-green-tint/40">
      <TopBar scores={scores} onReset={reset} />
      <main className="flex-1">
        <Scorecard
          activeIds={session.activeIds}
          payor={session.payor}
          aaaPriorSbe={session.aaaPriorSbe}
          onToggle={toggle}
          onPayorChange={setPayor}
          onAaaPriorSbeChange={setAaaPriorSbe}
        />
      </main>
      <Disclaimer />
      <MobileJumpBar scores={scores} />
    </div>
  );
}
