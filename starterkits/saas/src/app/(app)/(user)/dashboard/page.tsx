import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardPageConfig } from "@/app/(app)/(user)/dashboard/_constants/page-config";
import { getUser } from "@/server/auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <AppPageShell
      title={dashboardPageConfig.title}
      description={dashboardPageConfig.description}
    >
      <div className="grid gap-6">
        <DashboardClient user={user} />
        {/* คุณสามารถเพิ่มการ์ดแสดง service descriptions ด้านล่างได้เหมือนเดิม */}
      </div>
    </AppPageShell>
  );
}
