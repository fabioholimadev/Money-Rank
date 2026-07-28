import TrailPhaseSidebar from './TrailPhaseSidebar';

export default function TrailPageShell({ children }) {
  return (
    <div className="grid w-full items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <TrailPhaseSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
