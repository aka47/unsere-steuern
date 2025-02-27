"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Name</h3>
            <p>{session?.user?.name || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p>{session?.user?.email || "Not provided"}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full"
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}