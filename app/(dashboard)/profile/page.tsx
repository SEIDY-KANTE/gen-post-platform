"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User, Mail, Shield, Coins, Camera, Crown, Zap, BarChart3, Calendar, CreditCard, Loader2, X } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProfilePage() {
  const { user, setUser, posts } = useAppStore()
  const [name, setName] = useState(user?.name || "")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const supabase = createClient()

      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      setUser({ ...user, name })
      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const supabase = createClient()

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setUser({ ...user, avatar: publicUrl })
      toast.success("Profile picture updated!")
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error("Failed to upload profile picture")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user) return

    setIsCancelling(true)
    try {
      const response = await fetch('/api/payment/cancel-subscription', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      // Update local state
      setUser({ ...user, plan: 'free' })
      toast.success("Subscription cancelled successfully")
      setShowCancelDialog(false)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      toast.error("Failed to cancel subscription")
    } finally {
      setIsCancelling(false)
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-gradient-to-r from-violet-500 to-purple-500"
      case "enterprise":
        return "bg-gradient-to-r from-amber-500 to-orange-500"
      default:
        return "bg-muted"
    }
  }

  const getPlanCreditsMax = (plan: string) => {
    switch (plan) {
      case "pro":
        return 100
      case "enterprise":
        return 500
      default:
        return 10
    }
  }

  const creditsPercentage = user ? (user.credits / getPlanCreditsMax(user.plan)) * 100 : 0

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Profile" description="Manage your account settings" />

      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar with edit overlay */}
                  <div className="group relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-2xl font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleAvatarClick}
                      disabled={isUploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <h2 className="mt-4 text-xl font-semibold">{user?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>

                  {/* Plan Badge */}
                  <Badge className={`mt-3 ${getPlanColor(user?.plan || "free")} border-0 px-3 py-1 text-primary`}>
                    {user?.plan === "free" ? (
                      "Free Plan"
                    ) : (
                      <>
                        <Crown className="mr-1 h-3 w-3" />
                        {user?.plan === "premium" ? "Premium" : "Pro"} Plan
                      </>
                    )}
                  </Badge>

                  <Separator className="my-4 w-full" />

                  {/* Quick Stats */}
                  <div className="grid w-full grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{user?.credits || 0}</p>
                      <p className="text-xs text-muted-foreground">Credits Left</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{posts.length}</p>
                      <p className="text-xs text-muted-foreground">Posts Created</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6 md:col-span-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" value={user?.email || ""} disabled className="pl-10" />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription & Credits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Subscription & Credits
                </CardTitle>
                <CardDescription>Manage your plan and credits usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Plan */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${getPlanColor(user?.plan || "free")}`}
                      >
                        {user?.plan === "free" ? (
                          <Zap className="h-5 w-5 text-foreground" />
                        ) : (
                          <Crown className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {user?.plan === "free" ? "Free Plan" : user?.plan === "premium" ? "Premium Plan" : "Pro Plan"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.plan === "free"
                            ? "Basic features included"
                            : user?.plan === "premium"
                              ? "Premium features included"
                              : "Pro features included"}
                        </p>
                      </div>
                    </div>
                    {user?.plan === "free" && (
                      <Link href="/credits">
                        <Button size="sm" className="gap-1">
                          <Crown className="h-3 w-3" />
                          Upgrade
                        </Button>
                      </Link>
                    )}
                    {(user?.plan === "premium" || user?.plan === "pro") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive hover:bg-destructive/10"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        <X className="h-3 w-3" />
                        Cancel Plan
                      </Button>
                    )}
                  </div>
                </div>

                {/* Credits Usage */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-medium">AI Credits</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {user?.credits || 0}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Credits are used for AI-powered content generation</p>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/credits">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <CreditCard className="h-4 w-4" />
                      Buy More Credits
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <BarChart3 className="h-4 w-4" />
                      View Usage History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Account Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{posts.length}</p>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 text-center">
                    <p className="text-3xl font-bold">
                      {
                        posts.filter((p) => {
                          const date = new Date(p.createdAt)
                          const now = new Date()
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                        }).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 text-center">
                    <p className="text-3xl font-bold">
                      {
                        posts.filter((p) => {
                          const date = new Date(p.createdAt)
                          const now = new Date()
                          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                          return date >= weekAgo
                        }).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to premium features and your plan will be downgraded to Free.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="bg-destructive text-primary hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
