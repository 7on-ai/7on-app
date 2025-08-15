"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface ServiceButtonProps {
  icon: React.ElementType;
  label: string;
  connected: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function ServiceButton({
  icon: Icon,
  label,
  connected,
  loading,
  onClick,
}: ServiceButtonProps) {
  return (
    <Card className="flex items-center justify-center border-2 border-dashed rounded-2xl p-4 hover:bg-accent transition">
      <CardContent className="p-0 w-full h-full">
        <Button
          onClick={onClick}
          variant="ghost" // ไม่มี border เอง
          className="flex flex-col items-center justify-center gap-2 h-full w-full"
          disabled={loading}
        >
          {loading ? (
            <Icons.spinner className="h-8 w-8 animate-spin" />
          ) : (
            <Icon className="h-8 w-8" />
          )}
          <span className="text-sm font-medium">{label}</span>
          <span
            className={`text-xs ${
              connected ? "text-green-500" : "text-gray-500"
            }`}
          >
            {connected ? "Connected" : "Not Connected"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardClient() {
  const [loadingService, setLoadingService] = React.useState<string | null>(
    null
  );
  const [connectedServices, setConnectedServices] = React.useState<
    Record<string, boolean>
  >({
    google: false,
    slack: true,
    line: false,
  });

  const handleConnect = (service: string) => {
    setLoadingService(service);
    setTimeout(() => {
      setConnectedServices((prev) => ({
        ...prev,
        [service]: !prev[service],
      }));
      setLoadingService(null);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <ServiceButton
        icon={Icons.google}
        label="Google"
        connected={connectedServices.google}
        loading={loadingService === "google"}
        onClick={() => handleConnect("google")}
      />
      <ServiceButton
        icon={Icons.slack}
        label="Slack"
        connected={connectedServices.slack}
        loading={loadingService === "slack"}
        onClick={() => handleConnect("slack")}
      />
      <ServiceButton
        icon={Icons.line}
        label="LINE"
        connected={connectedServices.line}
        loading={loadingService === "line"}
        onClick={() => handleConnect("line")}
      />
    </div>
  );
}
