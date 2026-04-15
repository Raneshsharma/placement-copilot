"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Bell,
  Shield,
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
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api";

/* ── Shared Toggle ─────────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className={`text-sm text-[#1A1A2E]${disabled ? " opacity-50" : ""}`}>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-[#0D7377]" : "bg-[#E8E8E6]"
        }${disabled ? " cursor-not-allowed opacity-60" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

/* ── Integration Card ──────────────────────────────────────────── */
interface Integration {
  provider: "github" | "linkedin" | "google";
  name: string;
  description: string;
  connected: boolean;
}

function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
}: {
  integration: Integration;
  onConnect: (provider: string) => void;
  onDisconnect: (provider: string) => void;
}) {
  const colors: Record<string, string> = {
    github: "bg-[#1A1A2E]",
    linkedin: "bg-[#0A66C2]",
    google: "bg-[#4285F4]",
  };
  const initials: Record<string, string> = {
    github: "",
    linkedin: "in",
    google: "G",
  };

  return (
    <Card className="p-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[integration.provider]}`}
      >
        {integration.provider === "github" ? (
          <Github className="w-5 h-5 text-white" />
        ) : (
          <span className="text-white font-bold text-sm">{initials[integration.provider]}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#1A1A2E]">{integration.name}</p>
        <p className="text-xs text-[#5C5C6D]">{integration.description}</p>
      </div>
      {integration.connected ? (
        <>
          <Badge className="bg-[#22C55E]/10 text-[#22C55E]">Connected</Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDisconnect(integration.provider)}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          className="bg-[#0D7377] hover:bg-[#0a5c5f]"
          onClick={() => onConnect(integration.provider)}
        >
          Connect
        </Button>
      )}
    </Card>
  );
}

/* ── Avatar Upload ─────────────────────────────────────────────── */
function AvatarUpload({
  avatarUrl,
  onFileSelect,
  saving,
}: {
  avatarUrl?: string;
  onFileSelect: (file: File) => void;
  saving: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-[#0D7377]/10 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="w-8 h-8 text-[#0D7377]" />
          )}
        </div>
        {saving && (
          <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={saving}
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          Change Photo
        </Button>
        <p className="text-xs text-[#5C5C6D] mt-1">JPG, PNG, GIF up to 2MB</p>
      </div>
    </div>
  );
}

/* ── Delete Account Modal ──────────────────────────────────────── */
function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
    setConfirmText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-[#EF4444]">Delete Account</DialogTitle>
          <DialogDescription>
            This will permanently delete all your data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-[#1A1A2E]">
            Type <strong>DELETE</strong> to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="font-mono"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setConfirmText("");
            }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#EF4444] hover:bg-[#DC2626]"
            onClick={handleConfirm}
            disabled={confirmText !== "DELETE" || deleting}
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Disconnect Confirm Modal ───────────────────────────────────── */
function DisconnectModal({
  open,
  providerName,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  providerName: string;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConfirm = async () => {
    setDisconnecting(true);
    await onConfirm();
    setDisconnecting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Disconnect {providerName}?</DialogTitle>
          <DialogDescription>
            Your {providerName} account will be disconnected from Placement Copilot.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={disconnecting}>
            Cancel
          </Button>
          <Button variant="outline" className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]" onClick={handleConfirm} disabled={disconnecting}>
            {disconnecting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Settings Page ─────────────────────────────────────────── */
export default function SettingsPage() {
  /* ── Profile state ── */
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolioUrl: "",
    targetRole: "",
    industry: "",
    experienceYears: "",
    bio: "",
  });

  /* ── Notifications state ── */
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    applicationUpdates: false,
    interviewReminders: false,
    newJobRecommendations: false,
    skillGapInsights: false,
    tipsAndTricks: false,
  });
  const [pendingNotif, setPendingNotif] = useState<Record<string, boolean>>({});

  /* ── Integrations state ── */
  const [integrations, setIntegrations] = useState<Integration[]>([
    { provider: "github", name: "GitHub", description: "Connect to showcase your repositories", connected: false },
    { provider: "linkedin", name: "LinkedIn", description: "Sync profile and track shared connections", connected: false },
    { provider: "google", name: "Google", description: "Sign in with Google and sync calendar", connected: false },
  ]);
  const [disconnectTarget, setDisconnectTarget] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  /* ── Privacy state ── */
  const [exporting, setExporting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  /* ── Load profile ── */
  useEffect(() => {
    apiClient
      .get("/api/users/me")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setProfile({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          location: data.location ?? "",
          linkedIn: data.linkedIn ?? "",
          portfolioUrl: data.portfolioUrl ?? "",
          targetRole: data.targetRole ?? "",
          industry: data.industry ?? "",
          experienceYears: String(data.experienceYears ?? ""),
          bio: data.bio ?? "",
        });
        setAvatarUrl(data.avatarUrl ?? "");
        const connected: Record<string, boolean> = {};
        (data.integrations ?? []).forEach((p: string) => { connected[p] = true; });
        setIntegrations((prev) =>
          prev.map((i) => ({ ...i, connected: !!connected[i.provider] }))
        );
      })
      .catch(() => {
        toast.error("Failed to load profile");
      })
      .finally(() => setProfileLoading(false));
  }, []);

  /* ── Load notifications ── */
  useEffect(() => {
    apiClient
      .get("/api/users/me/notifications")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setNotifications({
          applicationUpdates: data.applicationUpdates ?? false,
          interviewReminders: data.interviewReminders ?? false,
          newJobRecommendations: data.newJobRecommendations ?? false,
          skillGapInsights: data.skillGapInsights ?? false,
          tipsAndTricks: data.tipsAndTricks ?? false,
        });
      })
      .catch(() => {
        toast.error("Failed to load notification preferences");
      })
      .finally(() => setNotifLoading(false));
  }, []);

  /* ── Save profile ── */
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const payload = {
        ...profile,
        experienceYears: profile.experienceYears ? Number(profile.experienceYears) : null,
      };
      await apiClient.put("/api/users/me", payload);
      toast.success("Profile saved successfully");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  };

  /* ── Avatar upload ── */
  const handleAvatarSelect = async (file: File) => {
    setAvatarSaving(true);
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post("/api/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.avatarUrl ?? res.data?.avatarUrl;
      if (url) setAvatarUrl(url);
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to upload avatar");
      URL.revokeObjectURL(preview);
    } finally {
      setAvatarSaving(false);
    }
  };

  /* ── Notification toggle ── */
  const handleNotifChange = async (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setPendingNotif((prev) => ({ ...prev, [key]: true }));
    try {
      await apiClient.put("/api/notifications", {
        ...notifications,
        [key]: value,
      });
      toast.success("Preference saved");
    } catch {
      setNotifications((prev) => ({ ...prev, [key]: !value }));
      toast.error("Failed to save preference");
    } finally {
      setPendingNotif((prev) => ({ ...prev, [key]: false }));
    }
  };

  /* ── Integrations ── */
  const handleConnect = (provider: string) => {
    console.log(`[OAuth] Connect ${provider} — coming soon`);
    toast("OAuth integration coming soon", { description: `${provider} connection will be available shortly.` });
  };

  const handleDisconnect = async () => {
    if (!disconnectTarget) return;
    setDisconnecting(true);
    try {
      await apiClient.delete(`/api/users/me/integrations/${disconnectTarget}`);
      setIntegrations((prev) =>
        prev.map((i) => (i.provider === disconnectTarget ? { ...i, connected: false } : i))
      );
      toast.success(`${disconnectTarget.charAt(0).toUpperCase() + disconnectTarget.slice(1)} disconnected`);
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setDisconnecting(false);
      setDisconnectTarget(null);
    }
  };

  /* ── Export data ── */
  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await apiClient.get("/api/export", {
        responseType: "blob",
      });
      const blob = res.data as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placement-copilot-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch {
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  /* ── Delete account ── */
  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await apiClient.delete("/api/users/me");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch {
      toast.error("Failed to delete account");
      setDeletingAccount(false);
    }
  };

  const disconnectingIntegration = disconnectTarget
    ? integrations.find((i) => i.provider === disconnectTarget)
    : null;

  const profileComplete = profile.firstName && profile.lastName && profile.email ? 85 : 50;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#1A1A2E]">Settings</h1>
          <p className="text-sm text-[#5C5C6D] mt-1">
            Manage your account, notifications, and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 grid grid-cols-4 w-fit bg-[#F4F4F2] p-1">
          <TabsTrigger value="profile" className="text-xs gap-1">
            <User className="w-3.5 h-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1">
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs gap-1">
            <Link2 className="w-3.5 h-3.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs gap-1">
            <Shield className="w-3.5 h-3.5" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Personal Information</h2>

            <AvatarUpload
              avatarUrl={avatarUrl}
              onFileSelect={handleAvatarSelect}
              saving={avatarSaving}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">First Name</label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Last Name</label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#5C5C6D]">Email</label>
              <Input
                type="email"
                value={profile.email}
                readOnly
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-[#5C5C6D]">Contact support to change your email address</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Phone</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Location</label>
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">LinkedIn</label>
                <Input
                  value={profile.linkedIn}
                  onChange={(e) => setProfile((p) => ({ ...p, linkedIn: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Portfolio URL</label>
                <Input
                  value={profile.portfolioUrl}
                  onChange={(e) => setProfile((p) => ({ ...p, portfolioUrl: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="yoursite.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Target Role</label>
                <Input
                  value={profile.targetRole}
                  onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Industry</label>
                <Input
                  value={profile.industry}
                  onChange={(e) => setProfile((p) => ({ ...p, industry: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="e.g. Technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5C5C6D]">Years of Experience</label>
                <Input
                  type="number"
                  value={profile.experienceYears}
                  onChange={(e) => setProfile((p) => ({ ...p, experienceYears: e.target.value }))}
                  disabled={profileLoading}
                  placeholder="5"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#5C5C6D]">Bio</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-[#E8E8E6] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D7377] focus:ring-offset-1 disabled:opacity-60"
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                disabled={profileLoading}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge className="bg-[#22C55E]/10 text-[#22C55E]">
                <Check className="w-3 h-3 mr-1" />
                Profile {profileComplete}% complete
              </Badge>
              <Button
                size="sm"
                className="bg-[#0D7377] hover:bg-[#0a5c5f]"
                onClick={handleSaveProfile}
                disabled={profileLoading || profileSaving}
              >
                {profileSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Save className="w-3.5 h-3.5 mr-1" />
                )}
                {profileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Notifications
            </h2>
            <Separator />
            <div className="space-y-3">
              <Toggle
                checked={notifications.applicationUpdates}
                onChange={(v) => handleNotifChange("applicationUpdates", v)}
                label="Application status updates"
                disabled={notifLoading}
              />
              <Toggle
                checked={notifications.interviewReminders}
                onChange={(v) => handleNotifChange("interviewReminders", v)}
                label="Interview reminders (24h before)"
                disabled={notifLoading}
              />
              <Toggle
                checked={notifications.newJobRecommendations}
                onChange={(v) => handleNotifChange("newJobRecommendations", v)}
                label="New job recommendations above 80% match"
                disabled={notifLoading}
              />
              <Toggle
                checked={notifications.skillGapInsights}
                onChange={(v) => handleNotifChange("skillGapInsights", v)}
                label="Skill gap insights and learning tips"
                disabled={notifLoading}
              />
              <Separator />
              <Toggle
                checked={notifications.tipsAndTricks}
                onChange={(v) => handleNotifChange("tipsAndTricks", v)}
                label="Product updates and tips"
                disabled={notifLoading}
              />
            </div>
          </Card>
        </TabsContent>

        {/* ── Integrations Tab ── */}
        <TabsContent value="integrations" className="space-y-4">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.provider}
              integration={integration}
              onConnect={handleConnect}
              onDisconnect={(provider) => setDisconnectTarget(provider)}
            />
          ))}
          <Card className="p-4 border-dashed">
            <p className="text-sm text-[#5C5C6D] text-center">
              More integrations coming soon — Calendly, Notion, Slack
            </p>
          </Card>
        </TabsContent>

        {/* ── Privacy Tab ── */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E]">Data & Permissions</h2>
            <div className="space-y-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                {exporting ? "Exporting..." : "Export My Data (JSON)"}
              </Button>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">Delete Account</p>
                  <p className="text-xs text-[#5C5C6D]">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-[#1A1A2E] mb-2">About</h2>
            <p className="text-xs text-[#5C5C6D]">Placement Copilot v1.0.0</p>
            <div className="flex gap-4 mt-2">
              <a
                href="/privacy"
                className="text-xs text-[#0D7377] hover:underline"
                target="_blank"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-xs text-[#0D7377] hover:underline"
                target="_blank"
              >
                Terms of Service
              </a>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Modals ── */}
      <DeleteAccountModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteAccount}
      />

      <DisconnectModal
        open={!!disconnectTarget}
        providerName={disconnectingIntegration?.name ?? ""}
        onOpenChange={(v) => { if (!v) setDisconnectTarget(null); }}
        onConfirm={handleDisconnect}
      />
    </div>
  );
}
