"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import type { User } from "next-auth";

interface ConnectServiceButtonProps {
    service: 'google' | 'spotify' | 'discord' | 'github';
    label: string;
    description: string;
    user: User;
}

export function ConnectServiceButton({ service, label, description, user }: ConnectServiceButtonProps) {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = () => {
        if (!user) return;
        
        setIsConnecting(true);
        
        // สร้าง state parameter
        const state = btoa(JSON.stringify({
            user_id: user.id,
            service: service,
            timestamp: Date.now()
        }));
        
        // Auth0 Client IDs
        const clientIds = {
            google: process.env.NEXT_PUBLIC_AUTH0_GOOGLE_CLIENT_ID,
            spotify: process.env.NEXT_PUBLIC_AUTH0_SPOTIFY_CLIENT_ID,
            discord: process.env.NEXT_PUBLIC_AUTH0_DISCORD_CLIENT_ID,
            github: process.env.NEXT_PUBLIC_AUTH0_GITHUB_CLIENT_ID
        };
        
        const scopes = {
            google: 'profile email',
            spotify: 'user-read-email user-read-private',
            discord: 'identify email',
            github: 'user:email'
        };
        
        const authUrl = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/authorize?` +
            `response_type=code&` +
            `client_id=${clientIds[service]}&` +
            `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SUPABASE_URL + '/functions/v1/oauth-callback')}&` +
            `scope=${encodeURIComponent(scopes[service])}&` +
            `state=${state}`;
        
        window.location.href = authUrl;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>{label}</span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button 
                    onClick={handleConnect}
                    disabled={isConnecting || !user}
                    className="gap-2 w-full"
                >
                    {isConnecting && <Icons.loader className="h-4 w-4" />}
                    {isConnecting ? 'Connecting...' : `Connect ${label}`}
                </Button>
            </CardFooter>
        </Card>
    );
}
