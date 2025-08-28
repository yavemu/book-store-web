"use client";

import { useState, useEffect, useCallback, JSX } from "react";
import { useRouter } from "next/navigation";
import { Layout, LoadingSpinner } from "@/components";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { logout } from "@/store/slices/authSlice";

// Dynamic content components
import SearchPage from "@/components/dashboard/pages/SearchPage";
import ProfilePage from "@/components/dashboard/pages/ProfilePage";
import GenericManagementPage from "@/components/dashboard/pages/GenericManagementPage";
import { CreateBookModal, EditBookModal, DeleteBookModal, ViewBookModal } from "@/components/dashboard/modals";
import {
  booksManagementConfig,
  authorsManagementConfig,
  publishersManagementConfig,
  genresManagementConfig,
  usersManagementConfig,
  auditManagementConfig,
} from "@/components/dashboard/configs";
import { BookCatalog } from "@/types/domain";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading: authLoading } = useAppSelector((state) => state.auth);
  const [activeMenuItem, setActiveMenuItem] = useState<string>("books");
  const [pageLoading, setPageLoading] = useState(false);

  // Modal states for books
  const [selectedBook, setSelectedBook] = useState<BookCatalog | null>(null);
  const [showCreateBookModal, setShowCreateBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [showViewBookModal, setShowViewBookModal] = useState(false);
  
  // Refresh key to force component updates after CRUD operations
  const [refreshKey, setRefreshKey] = useState(0);
  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // -----------------------
  // Auth redirect
  // -----------------------
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // -----------------------
  // Logout
  // -----------------------
  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/");
  }, [dispatch, router]);

  // -----------------------
  // Menu navigation
  // -----------------------
  const handleMenuItemClick = useCallback(
    (menuItemId: string) => {
      if (menuItemId === activeMenuItem) return;

      setPageLoading(true);

      // Simulate loading for better UX
      setTimeout(() => {
        setActiveMenuItem(menuItemId);
        setPageLoading(false);
      }, 300);
    },
    [activeMenuItem],
  );

  // -----------------------
  // Page content mapping
  // -----------------------
  const userRole = user?.role?.name?.toLowerCase() || "user";

  const pageComponents: Record<string, JSX.Element> = {
    search: <SearchPage />,
    profile: <ProfilePage user={user} />,
    books: (
      <>
        <GenericManagementPage
          key={`books-${refreshKey}`}
          config={booksManagementConfig}
          userRole={userRole}
          onCreateModal={() => setShowCreateBookModal(true)}
          onViewModal={(book) => {
            setSelectedBook(book);
            setShowViewBookModal(true);
          }}
          onEditModal={(book) => {
            setSelectedBook(book);
            setShowEditBookModal(true);
          }}
          onDeleteModal={(book) => {
            setSelectedBook(book);
            setShowDeleteBookModal(true);
          }}
        />

        <CreateBookModal 
          isOpen={showCreateBookModal} 
          onClose={() => setShowCreateBookModal(false)} 
          onSuccess={() => {
            setShowCreateBookModal(false);
            forceRefresh(); // Forzar actualización de la tabla
          }} 
        />

        <EditBookModal
          isOpen={showEditBookModal}
          onClose={() => {
            setShowEditBookModal(false);
            setSelectedBook(null);
          }}
          onSuccess={() => {
            setShowEditBookModal(false);
            setSelectedBook(null);
            forceRefresh(); // Forzar actualización de la tabla
          }}
          book={selectedBook}
        />

        <DeleteBookModal
          isOpen={showDeleteBookModal}
          onClose={() => {
            setShowDeleteBookModal(false);
            setSelectedBook(null);
          }}
          onSuccess={() => {
            setShowDeleteBookModal(false);
            setSelectedBook(null);
            forceRefresh(); // Forzar actualización de la tabla
          }}
          book={selectedBook}
        />

        <ViewBookModal
          isOpen={showViewBookModal}
          onClose={() => {
            setShowViewBookModal(false);
            setSelectedBook(null);
          }}
          onEdit={() => {
            setShowViewBookModal(false);
            setShowEditBookModal(true);
          }}
          book={selectedBook}
        />
      </>
    ),
    authors: <GenericManagementPage key={`authors-${refreshKey}`} config={authorsManagementConfig} userRole={userRole} />,
    publishers: <GenericManagementPage key={`publishers-${refreshKey}`} config={publishersManagementConfig} userRole={userRole} />,
    genres: <GenericManagementPage key={`genres-${refreshKey}`} config={genresManagementConfig} userRole={userRole} />,
    users: <GenericManagementPage key={`users-${refreshKey}`} config={usersManagementConfig} userRole={userRole} />,
    audit: <GenericManagementPage key={`audit-${refreshKey}`} config={auditManagementConfig} userRole={userRole} />,
  };

  const renderPageContent = () => {
    if (pageLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" message="Cargando..." />
        </div>
      );
    }

    return pageComponents[activeMenuItem] || pageComponents["books"];
  };

  // -----------------------
  // Render loading states
  // -----------------------
  if (authLoading) {
    return (
      <Layout>
        <div className="layout-flex-center">
          <LoadingSpinner size="large" message="Verificando autenticación..." />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect will handle navigation
  }

  // -----------------------
  // Main render
  // -----------------------
  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Navigation Top Menu */}
          <NavigationMenu user={user} onMenuItemClick={handleMenuItemClick} activeMenuItem={activeMenuItem} />

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-lg min-h-[24rem] p-4">{renderPageContent()}</div>
        </div>
      </div>
    </Layout>
  );
}
