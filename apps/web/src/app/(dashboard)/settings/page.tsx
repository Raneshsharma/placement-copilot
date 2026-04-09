"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  Palette,
  Link2,
  Mail,
  Smartphone,
  Check,
  ExternalLink,
  Save,
  Trash2,
  LogOut,
  Github,
  Briefcase,
} from "lucide-react";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-[#1A1A2E]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#0D7377]" : "bg-[#E8E8E6]"
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 555 123 4567",
    location: "San Francisco, CA",
    headline: "Software Engineer | React & TypeScript | Building at scale",
    website: "alexjohnson.dev",
    github: "github.com/alexjohnson",
    linkedin: "linkedin.com/in/alexjohnson",
  });

  const [notifications, setNotifications] = useState({
    applicationUpdates: true,
    interviewReminders: true,
    newRoleMatches: true,
    weeklyDigest: true,
    marketingEmails: false,
    pushNotifications: true,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">Settings</h1>
          <p className="text-sm text-[#5C5C6D] mt-1">Manage your account, notifications, and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 grid grid-cols-4 w-fit bg-[#F4F4F2] p-1">
          <TabsTrigger value="profile" className="text-xs gap-1"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1"><Bell className="w-3.5 h-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs gap-1"><Link2 className="w-3.5 h-3.5" />Integrations</TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs gap-1"><Shield className="w-3.5 h-3.5" />Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">First Name</label>
                <Input value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Last Name</label>
                <Input value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#5C5C6D]">Professional Headline</label>
              <Input value={profile.headline} onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Email</label>
                <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Phone</label>
                <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#5C5C6D]">Location</label>
              <Input value={profile.location} onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#5C5C6D]">Website</label>
              <Input value={profile.website} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">GitHub</label>
                <Input value={profile.github} onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">LinkedIn</label>
                <Input value={profile.linkedin} onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Badge className="bg-[#22C55E]/10 text-[#22C55E]"><Check className="w-3 h-3 mr-1" />Profile 85% complete</Badge>
              <Button size="sm" className="bg-[#0D7377] hover:bg-[#0a5c5f]"><Save className="w-3.5 h-3.5 mr-1" />Save Changes</Button>
            </div>
          </Card>

          {/* Target Roles */}
          <Card className="p-6 space-y-3">
            <h2 className="font-semibold text-[#1A1A2E]">Target Roles</h2>
            <div className="flex flex-wrap gap-2">
              {["Software Engineer", "Frontend Engineer", "Full Stack Engineer", "Product Engineer"].map((r) => (
                <Badge key={r} className="bg-[#0D7377]/10 text-[#0D7377] cursor-pointer hover:bg-[#0D7377]/20">{r} ×</Badge>
              ))}
              <Button size="sm" variant="outline" className="text-xs h-6"><Briefcase className="w-3 h-3 mr-1" />Add Role</Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-[#EF4444]/20">
            <h2 className="font-semibold text-[#EF4444] mb-3">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1A2E]">Delete Account</p>
                <p className="text-xs text-[#5C5C6D]">Permanently delete your account and all data</p>
              </div>
              <Button size="sm" variant="outline" className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]">
                <Trash2 className="w-3.5 h-3.5 mr-1" />Delete Account
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] flex items-center gap-2"><Mail className="w-4 h-4" />Email Notifications</h2>
            <Separator />
            <div className="space-y-3">
              <Toggle checked={notifications.applicationUpdates} onChange={(v) => setNotifications((p) => ({ ...p, applicationUpdates: v }))} label="Application status updates" />
              <Toggle checked={notifications.interviewReminders} onChange={(v) => setNotifications((p) => ({ ...p, interviewReminders: v }))} label="Interview reminders (24h before)" />
              <Toggle checked={notifications.newRoleMatches} onChange={(v) => setNotifications((p) => ({ ...p, newRoleMatches: v }))} label="New role matches above 80%" />
              <Toggle checked={notifications.weeklyDigest} onChange={(v) => setNotifications((p) => ({ ...p, weeklyDigest: v }))} label="Weekly progress digest" />
              <Separator />
              <Toggle checked={notifications.marketingEmails} onChange={(v) => setNotifications((p) => ({ ...p, marketingEmails: v }))} label="Product updates and tips" />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] flex items-center gap-2"><Smartphone className="w-4 h-4" />Push Notifications</h2>
            <Separator />
            <div className="space-y-3">
              <Toggle checked={notifications.pushNotifications} onChange={(v) => setNotifications((p) => ({ ...p, pushNotifications: v }))} label="Enable push notifications" />
            </div>
          </Card>

          <Button size="sm" className="bg-[#0D7377] hover:bg-[#0a5c5f]"><Save className="w-3.5 h-3.5 mr-1" />Save Preferences</Button>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1A1A2E] flex items-center justify-center flex-shrink-0">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1A1A2E]">GitHub</p>
              <p className="text-xs text-[#5C5C6D]">Connect to showcase your repositories</p>
            </div>
            <Badge className="bg-[#22C55E]/10 text-[#22C55E]">Connected</Badge>
            <Button size="sm" variant="outline">Disconnect</Button>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1A1A2E]">LinkedIn</p>
              <p className="text-xs text-[#5C5C6D]">Sync profile and track shared connections</p>
            </div>
            <Badge className="bg-[#22C55E]/10 text-[#22C55E]">Connected</Badge>
            <Button size="sm" variant="outline">Disconnect</Button>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#4285F4] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1A1A2E]">Google</p>
              <p className="text-xs text-[#5C5C6D]">Sign in with Google and sync calendar</p>
            </div>
            <Badge className="bg-[#22C55E]/10 text-[#22C55E]">Connected</Badge>
            <Button size="sm" variant="outline">Disconnect</Button>
          </Card>

          <Card className="p-4 border-dashed">
            <p className="text-sm text-[#5C5C6D] text-center">More integrations coming soon — Calendly, Notion, Slack</p>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Profile Visibility</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">Public Profile</p>
                  <p className="text-xs text-[#5C5C6D]">Allow recruiters to discover your profile</p>
                </div>
                <Toggle checked={true} onChange={() => {}} label="" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">Show in Talent Pool</p>
                  <p className="text-xs text-[#5C5C6D]">Appear in Placement Copilot's employer network</p>
                </div>
                <Toggle checked={false} onChange={() => {}} label="" />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Data & Permissions</h2>
            <div className="space-y-3">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" /> Export My Data (JSON)
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" /> Download Resume
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-[#EF4444] border-[#EF4444] hover:bg-[#FEF2F2]">
                <Trash2 className="w-4 h-4 mr-2" /> Clear Conversation History
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-[#1A1A2E] mb-2">About</h2>
            <p className="text-xs text-[#5C5C6D]">Placement Copilot v1.0.0</p>
            <p className="text-xs text-[#5C5C6D]">Privacy Policy · Terms of Service</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
