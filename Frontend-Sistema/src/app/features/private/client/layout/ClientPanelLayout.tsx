import { Outlet } from "react-router-dom";
import ClientPanelHeader from "./ClientPanelHeader";
import ClientPanelNav from "./ClientPanelNav";

export default function ClientPanelLayout() {
  return (
    <>
      <ClientPanelHeader />
      <div className="min-h-screen bg-slate-50 pt-[170px]">
        <ClientPanelNav />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}