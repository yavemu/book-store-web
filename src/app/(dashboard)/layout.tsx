import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageTransition from '@/components/ui/PageTransition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Navigation />
        <main className="flex-1 min-h-0">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </ProtectedRoute>
  );
}