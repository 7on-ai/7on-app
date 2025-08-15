"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Card, CardContent } from "@/components/ui/card";
import { type User } from "next-auth";
import { GithubIcon, MusicIcon } from "lucide-react";

// ----------------------
// Service Button
// ----------------------
interface ServiceButtonProps {
  service: "google" | "spotify" | "discord" | "github";
  label: string;
  icon: React.ReactNode;
  user: User | null;
}

function ServiceButton({ service, label, icon, user }: ServiceButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    if (!user) return;

    setIsConnecting(true);

    const state = btoa(
      JSON.stringify({
        user_id: user.id,
        service: service,
        timestamp: Date.now(),
      })
    );

    const clientIds = {
      google: process.env.NEXT_PUBLIC_AUTH0_GOOGLE_CLIENT_ID,
      spotify: process.env.NEXT_PUBLIC_AUTH0_SPOTIFY_CLIENT_ID,
      discord: process.env.NEXT_PUBLIC_AUTH0_DISCORD_CLIENT_ID,
      github: process.env.NEXT_PUBLIC_AUTH0_GITHUB_CLIENT_ID,
    };

    const scopes = {
      google: "profile email",
      spotify: "user-read-email user-read-private",
      discord: "identify email",
      github: "user:email",
    };

    const authUrl =
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/authorize?` +
      `response_type=code&` +
      `client_id=${clientIds[service]}&` +
      `redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1/oauth-callback"
      )}&` +
      `scope=${encodeURIComponent(scopes[service])}&` +
      `state=${state}`;

    window.location.href = authUrl;
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting || !user}
      className="w-full flex flex-col items-center justify-center gap-2 text-sm font-bold"
      variant="ghost"
    >
      {isConnecting ? <Icons.loader className="h-4 w-4" /> : icon}
      {isConnecting ? "Connecting..." : `Connect ${label}`}
    </Button>
  );
}

// ----------------------
// Icons
// ----------------------
function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26
           1.37-1.04 2.53-2.21 3.31v2.77h3.57
           c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77
           c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84
           C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18
           C1.43 8.55 1 10.22 1 12s.43 3.45 1.18
           4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09
           14.97 1 12 1 7.7 1 3.99 3.47 2.18
           7.07l3.66 2.84c.87-2.6 3.3-4.53
           6.16-4.53z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="h-4 w-4" fill="#5865F2" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 
      0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 
      18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 
      0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 
      0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 
      0 0 0 .031.057a19.9 19.9 0 0 0 5.993 
      3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 
      1.226-1.994a.076.076 0 0 0-.041-.106a13.107 
      13.107 0 0 1-1.872-.892a.077.077 
      0 0 1-.008-.128a10.2 10.2 0 0 0 
      .372-.292a.074.074 0 0 1 .077-.01c3.928 
      1.793 8.18 1.793 12.062 0a.074.074 
      0 0 1 .078.01c.12.098.246.198.373.292a.077.077 
      0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 
      0 0 0-.041.107c.36.698.772 1.362 
      1.225 1.993a.076.076 0 0 0 .084.028a19.839 
      19.839 0 0 0 6.002-3.03a.077.077 
      0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 
      0 0 0-.031-.03z" />
    </svg>
  );
}

// ----------------------
// Dashboard
// ----------------------
interface DashboardClientProps {
  user: User | null;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const connected = searchParams.get("connected");
    const status = searchParams.get("status");
    const error = searchParams.get("error");

    if (connected && status === "success") {
      setMessage(
        `✅ Successfully connected ${connected}! Check your N8N instance for new credentials.`
      );
      router.replace("/dashboard");
    } else if (error) {
      setMessage(`❌ Connection failed: ${error}`);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return (
    <>
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.includes("✅")
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-red-500 bg-red-50 text-red-700"
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { service: "google", label: "Google", icon: <GoogleIcon /> },
          { service: "spotify", label: "Spotify", icon: <MusicIcon className="h-4 w-4" /> },
          { service: "discord", label: "Discord", icon: <DiscordIcon /> },
          { service: "github", label: "GitHub", icon: <GithubIcon className="h-4 w-4" /> },
        ].map((s) => (
          <Card key={s.service}>
            <CardContent className="p-0 flex items-center justify-center h-24">
              <ServiceButton
                service={s.service as any}
                label={s.label}
                icon={s.icon}
                user={user}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
