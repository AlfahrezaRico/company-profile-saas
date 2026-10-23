import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  useNotificationProvider,
  ThemedLayout,
  ThemedSider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerProvider, {
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";

import {
  DashboardOutlined,
  BankOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  TagsOutlined,
  TeamOutlined,
  MailOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

import { ArticlesPage } from "./pages/articles";
import { DashboardPage } from "./pages/dashboard";
import { CompanyProfilePage } from "./pages/company-profile";
import { ProductsPage } from "./pages/products";
import { ClientsPage } from "./pages/clients";
import { InquiriesPage } from "./pages/inquiries";
import { HeroSlidesPage } from "./pages/hero-slides";

import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";
import { AppTitle } from "./components/title";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/authProvider";
import { LoginPage } from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                authProvider={authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                dataProvider={dataProvider}
                resources={[
                  {
                    name: "dashboard",
                    list: "/",
                    meta: {
                      label: "Dashboard Ringkasan",
                      icon: <DashboardOutlined />,
                    },
                  },
                  {
                    name: "company-profile",
                    list: "/company-profile",
                    meta: {
                      label: "Profil Perusahaan",
                      icon: <BankOutlined />,
                    },
                  },
                  {
                    name: "hero-slides",
                    list: "/hero-slides",
                    meta: {
                      label: "Hero Banners / Slides",
                      icon: <SlidersOutlined />,
                    },
                  },
                  {
                    name: "products",
                    list: "/products",
                    meta: {
                      label: "Produk & Layanan",
                      icon: <AppstoreOutlined />,
                    },
                  },
                  {
                    name: "articles",
                    list: "/articles",
                    meta: {
                      label: "Artikel & Berita",
                      icon: <FileTextOutlined />,
                    },
                  },
                  {
                    name: "clients",
                    list: "/clients",
                    meta: {
                      label: "Klien & Portofolio",
                      icon: <TeamOutlined />,
                    },
                  },
                  {
                    name: "inquiries",
                    list: "/inquiries",
                    meta: {
                      label: "Pesan Masuk (Leads)",
                      icon: <MailOutlined />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "CZVdGk-CfG8n6-u5QOFf",
                  title: {
                    text: "Nusantara Admin",
                    icon: <BankOutlined style={{ color: "#9f1239", fontSize: 18 }} />,
                  },
                }}
              >
                <Routes>
                  {/* Public Auth Route */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* Authenticated Protected Routes */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={() => <Header sticky />}
                          Sider={(props) => (
                            <ThemedSider
                              {...props}
                              fixed
                              Title={({ collapsed }) => <AppTitle collapsed={collapsed} />}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<DashboardPage />} />
                    <Route path="/company-profile" element={<CompanyProfilePage />} />
                    <Route path="/hero-slides" element={<HeroSlidesPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/inquiries" element={<InquiriesPage />} />

                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/blog-posts" element={<ArticlesPage />} />

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
