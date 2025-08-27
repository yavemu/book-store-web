import { UserProfileResponseDto } from '@/types/auth';

interface UserDashboardProps {
  user: UserProfileResponseDto;
  onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const isAdmin = user.role.name.toLowerCase() === 'admin';

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="card-base p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="section-title">Bienvenido, {user.username}!</h2>
            <p className="text-muted">Email: {user.email}</p>
            <p className="text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isAdmin 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role.name.toUpperCase()}
              </span>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="btn-primary bg-red-600 hover:bg-red-700 text-sm"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Available for all users */}
        <div className="card-base card-hover text-center p-6">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="section-title">Catálogo de Libros</h3>
          <p className="text-sm text-muted mb-4">Explora nuestro catálogo completo</p>
          <button className="btn-secondary text-sm">Ver Catálogo</button>
        </div>

        <div className="card-base card-hover text-center p-6">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="section-title">Buscar Libros</h3>
          <p className="text-sm text-muted mb-4">Encuentra libros por título, autor o género</p>
          <button className="btn-secondary text-sm">Buscar</button>
        </div>

        <div className="card-base card-hover text-center p-6">
          <div className="text-3xl mb-3">👤</div>
          <h3 className="section-title">Mi Perfil</h3>
          <p className="text-sm text-muted mb-4">Gestiona tu información personal</p>
          <button className="btn-secondary text-sm">Ver Perfil</button>
        </div>

        {/* Admin only features */}
        {isAdmin && (
          <>
            <div className="card-base card-hover text-center p-6 border-purple-200">
              <div className="text-3xl mb-3">➕</div>
              <h3 className="section-title text-purple-700">Gestión de Libros</h3>
              <p className="text-sm text-muted mb-4">Administra el catálogo de libros</p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">Gestionar</button>
            </div>

            <div className="card-base card-hover text-center p-6 border-purple-200">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="section-title text-purple-700">Gestión de Autores</h3>
              <p className="text-sm text-muted mb-4">Administra autores del sistema</p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">Gestionar</button>
            </div>

            <div className="card-base card-hover text-center p-6 border-purple-200">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="section-title text-purple-700">Gestión de Editoriales</h3>
              <p className="text-sm text-muted mb-4">Administra casas editoriales</p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">Gestionar</button>
            </div>

            <div className="card-base card-hover text-center p-6 border-purple-200">
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="section-title text-purple-700">Gestión de Géneros</h3>
              <p className="text-sm text-muted mb-4">Administra géneros literarios</p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">Gestionar</button>
            </div>

            <div className="card-base card-hover text-center p-6 border-purple-200">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="section-title text-purple-700">Gestión de Usuarios</h3>
              <p className="text-sm text-muted mb-4">Administra usuarios del sistema</p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">Gestionar</button>
            </div>

            <div className="card-base card-hover text-center p-6 border-purple-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="section-title text-purple-700">Auditoría</h3>
              <p className="text-sm text-muted mb-4">Revisa logs y auditoría del sistema</p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">Ver Logs</button>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card-base p-6">
        <h3 className="section-title mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary text-sm">📖 Ver Libros Disponibles</button>
          <button className="btn-secondary text-sm">🔍 Búsqueda Avanzada</button>
          {isAdmin && (
            <>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">➕ Agregar Libro</button>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 text-sm">📋 Reportes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}