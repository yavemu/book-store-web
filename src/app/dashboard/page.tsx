"use client";

import { useState, useEffect, useCallback, JSX } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, LoadingSpinner } from "@/components";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { logout } from "@/store/slices/authSlice";

// Dynamic content components
import SearchPage from "@/components/dashboard/pages/SearchPage";
import ProfilePage from "@/components/dashboard/pages/ProfilePage";
import GenericManagementPage from "@/components/dashboard/pages/GenericManagementPage";
import {
  booksManagementConfig,
  authorsManagementConfig,
  publishersManagementConfig,
  genresManagementConfig,
  usersManagementConfig,
  auditManagementConfig,
} from "@/components/dashboard/configs";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading: authLoading } = useAppSelector((state) => state.auth);
  const [activeMenuItem, setActiveMenuItem] = useState<string>(() => {
    // Initialize from URL parameter if available, otherwise default to "books"
    return searchParams.get("tab") || "books";
  });
  const [pageLoading, setPageLoading] = useState(false);

  // -----------------------
  // Auth redirect
  // -----------------------
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // -----------------------
  // Handle tab parameter from URL
  // -----------------------
  useEffect(() => {
    const tab = searchParams.get("tab");
    const validTabs = ["search", "profile", "books", "authors", "publishers", "genres", "users", "audit"];

    if (tab) {
      if (validTabs.includes(tab) && tab !== activeMenuItem) {
        setActiveMenuItem(tab);
      } else if (!validTabs.includes(tab)) {
        // If invalid tab, redirect to books
        router.push("/dashboard");
      }
    } else if (!tab && activeMenuItem !== "books") {
      // If no tab parameter, ensure URL has the current active tab
      router.push(`/dashboard?tab=${activeMenuItem}`);
    }
  }, [searchParams, activeMenuItem, router]);

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

      // Update URL with the tab parameter
      const newUrl = `/dashboard?tab=${menuItemId}`;
      router.push(newUrl);

      // Simulate loading for better UX
      setTimeout(() => {
        setActiveMenuItem(menuItemId);
        setPageLoading(false);
      }, 300);
    },
    [activeMenuItem, router],
  );

  // -----------------------
  // Page content mapping
  // -----------------------
  const userRole = user?.role?.name?.toLowerCase() || "user";

  const pageComponents: Record<string, JSX.Element> = {
    search: <SearchPage />,
    profile: <ProfilePage user={user} />,
    books: <GenericManagementPage config={booksManagementConfig} userRole={userRole} />,
    authors: <GenericManagementPage config={authorsManagementConfig} userRole={userRole} />,
    publishers: <GenericManagementPage config={publishersManagementConfig} userRole={userRole} />,
    genres: <GenericManagementPage config={genresManagementConfig} userRole={userRole} />,
    users: <GenericManagementPage config={usersManagementConfig} userRole={userRole} />,
    audit: <GenericManagementPage config={auditManagementConfig} userRole={userRole} />,
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
