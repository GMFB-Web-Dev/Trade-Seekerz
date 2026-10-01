"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Camera, CheckCircle2, LoaderCircle, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/client";

type SettingsClientProps = {
  userId: string;
  role: "homeowner" | "tradesperson";
  displayName: string;
  city: string;
  avatarPath: string | null;
};

export function SettingsClient({ userId, role, displayName, city, avatarPath }: SettingsClientProps) {
  const [avatar, setAvatar] = useState(avatarPath);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();setSaving(true);setMessage("");setSuccess(false);
    try {const form=new FormData(event.currentTarget);const{error}=await createClient().from("profiles").update({display_name:String(form.get("displayName")).trim(),city:String(form.get("city")).trim()||null}).eq("id",userId);if(error)throw error;setSuccess(true)}catch(error){setMessage(error instanceof Error?error.message:"Could not save your profile.")}finally{setSaving(false)}
  }

  async function uploadAvatar(file: File | undefined) {
    if (!file) return;setUploading(true);setMessage("");setSuccess(false);
    try {const signed=await fetch("/api/uploads/sign",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scope:"avatar",fileName:file.name,contentType:file.type,size:file.size})});const prepared=await signed.json();if(!signed.ok)throw new Error(prepared.error??"Could not prepare image upload.");const uploaded=await fetch(prepared.uploadUrl,{method:"PUT",headers:{"Content-Type":file.type},body:file});if(!uploaded.ok)throw new Error("The profile image could not be uploaded.");const{error}=await createClient().from("profiles").update({avatar_path:prepared.key}).eq("id",userId);if(error)throw error;setAvatar(prepared.key);setSuccess(true)}catch(error){setMessage(error instanceof Error?error.message:"Could not upload your image.")}finally{setUploading(false)}
  }

  return <AppShell role={role} name={displayName || "Account"}><div className="mx-auto max-w-4xl"><p className="eyebrow">Account settings</p><h1 className="mt-2 text-4xl font-black tracking-[-.045em]">Your profile</h1><p className="mt-2 text-[#62708a]">Keep your marketplace identity and location up to date.</p><div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]"><aside className="card p-6 text-center"><div className="relative mx-auto grid h-36 w-36 place-items-center overflow-hidden rounded-2xl bg-[#eaf3ff] text-5xl font-black text-[#0b68ed]">{avatar?<Image src={`/api/uploads/read?key=${encodeURIComponent(avatar)}`} alt="Profile" fill unoptimized className="object-cover"/>:(displayName[0]?.toUpperCase()||"T")}</div><label className="btn-outline mt-5 cursor-pointer"><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>uploadAvatar(event.target.files?.[0])}/>{uploading?<LoaderCircle className="animate-spin" size={17}/>:<Camera size={17}/>} Change image</label><p className="mt-3 text-xs leading-5 text-[#7e899c]">JPG, PNG or WebP · maximum 5 MB<br/>Stored privately in Cloudflare R2.</p></aside><form onSubmit={saveProfile} className="card p-6 sm:p-8"><div className="grid gap-5"><label className="grid gap-2 text-sm font-bold">Display name<input className="field" name="displayName" defaultValue={displayName} minLength={2} required /></label><label className="grid gap-2 text-sm font-bold">City or service area<input className="field" name="city" defaultValue={city} placeholder="Auckland" /></label><label className="grid gap-2 text-sm font-bold">Account type<input className="field capitalize" value={role} readOnly /></label></div><button className="btn-primary mt-7" disabled={saving}>{saving?<LoaderCircle className="animate-spin" size={17}/>:<Save size={17}/>} Save changes</button>{success&&<p className="mt-5 flex items-center gap-2 rounded-xl bg-[#e9f8f1] p-4 text-sm font-bold text-[#0d8154]"><CheckCircle2 size={17}/>Your profile has been updated.</p>}{message&&<p className="mt-5 rounded-xl bg-[#fff0ef] p-4 text-sm text-[#a43d3d]">{message}</p>}</form></div></div></AppShell>;
}

