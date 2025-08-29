import PageWrapper from '@/components/PageWrapper';
import Link from 'next/link';

export default function DashboardPage() {
  const dashboardCards = [
    {
      title: 'Usuarios',
      description: 'Gestionar usuarios del sistema',
      path: '/users',
      icon: '👥',
      requiredRole: 'ADMIN'
    },
    {
      title: 'Géneros',
      description: 'Administrar géneros literarios',
      path: '/genres',
      icon: '📚'
    },
    {
      title: 'Autores',
      description: 'Gestionar autores de libros',
      path: '/authors',
      icon: '✍️'
    },
    {
      title: 'Editoriales',
      description: 'Administrar casas editoriales',
      path: '/publishers',
      icon: '🏢'
    },
    {
      title: 'Auditoría',
      description: 'Ver logs del sistema',
      path: '/audit',
      icon: '📊',
      requiredRole: 'ADMIN'
    }
  ];

  // Por ahora simulamos que el usuario es ADMIN
  const userRole = 'ADMIN';

  const canAccess = (card: any) => {
    if (!card.requiredRole) return true;
    return userRole === 'ADMIN' || card.requiredRole === userRole;
  };

  return (
    <PageWrapper title="Dashboard" breadcrumbs={['Dashboard']}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {dashboardCards.filter(canAccess).map((card) => (
          <Link 
            key={card.path} 
            href={card.path}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: '24px',
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#212529',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {card.title}
              </h3>
              <p style={{
                color: '#6c757d',
                textAlign: 'center',
                margin: '0'
              }}>
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}