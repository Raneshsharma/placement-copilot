"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { applicationApi, resumeApi } from "@/lib/api";
import { useApplicationStore, AppStatus } from "@/stores/application-store";

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  company: string;
  role: string;
  url?: string;
  resumeId?: string;
  status: AppStatus;
  notes?: string;
}

interface Resume {
  id: string;
  name?: string;
  filename?: string;
  title?: string;
}

export function AddApplicationModal({ open, onClose }: AddApplicationModalProps) {
  const { addApplication } = useApplicationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      status: "WISHLIST",
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (open) {
      resumeApi.getAll()
        .then((res) => {
          const data = res.data?.data ?? res.data ?? [];
          setResumes(Array.isArray(data) ? data : []);
        })
        .catch(() => setResumes([]));
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        company: data.company,
        role: data.role,
        status: data.status,
      };
      if (data.url) {
        const urlValid = /^https?:\/\/.+/.test(data.url);
        if (!urlValid) {
          toast.error("Please enter a valid URL (e.g. https://example.com)");
          setIsSubmitting(false);
          return;
        }
        payload.url = data.url;
      }
      if (data.resumeId) payload.resumeId = data.resumeId;
      if (data.notes) payload.notes = data.notes;

      const res = await applicationApi.create(payload);
      const created = res.data?.data ?? res.data;

      addApplication({
        id: created.id,
        company: created.company,
        role: created.role,
        status: created.status as AppStatus,
        appliedAt: created.appliedAt ?? new Date().toISOString(),
        notes: created.notes,
        match: created.matchScore ?? created.match,
        location: created.location,
        salary: created.salary,
        companyLogo: created.companyLogo,
        interviewDate: created.interviewDate,
      });

      toast.success("Application added");
      reset();
      onClose();
    } catch {
      toast.error("Failed to add application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
          <DialogDescription>Track a new job application on your board.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">
              Company <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("company", { required: "Company name is required" })}
              placeholder="e.g. Google"
            />
            {errors.company && (
              <p className="text-xs text-red-500">{errors.company.message}</p>
            )}
          </div>

          {/* Position Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">
              Position <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("role", { required: "Position title is required" })}
              placeholder="e.g. Software Engineer"
            />
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Application URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Application URL</label>
            <Input
              {...register("url")}
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Resume Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Resume</label>
            <Select onValueChange={(val) => setValue("resumeId", val)} value={watch("resumeId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a resume (optional)" />
              </SelectTrigger>
              <SelectContent>
                {resumes.length === 0 && (
                  <SelectItem value="none" disabled>No resumes found</SelectItem>
                )}
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name || r.filename || r.title || r.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => setValue("status", val as AppStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WISHLIST">Wishlist</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
                <SelectItem value="OFFERED">Offer</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Notes</label>
            <Textarea
              {...register("notes")}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
