import { trpc } from "@/lib/trpc";
import { ArrowRight, ImagePlus } from "lucide-react";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

type Notice = { tone: "success" | "error"; text: string } | null;
type Photo = { data: string; name: string; mime: "image/jpeg" | "image/png" | "image/webp" };

const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

export function CommunityStoryForm() {
  const mutation = trpc.captures.story.useMutation();
  const [values, setValues] = useState({ name: "", email: "", story: "", consent: false });
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhoto(null);
      setErrors((current) => ({ ...current, photo: "Use a JPG, PNG, or WebP photo." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhoto(null);
      setErrors((current) => ({ ...current, photo: "Keep the photo under 2 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : "";
      if (!data) {
        setErrors((current) => ({ ...current, photo: "Could not read that photo. Try another one." }));
        return;
      }
      setPhoto({ data, name: file.name, mime: file.type as Photo["mime"] });
      setErrors((current) => ({ ...current, photo: "" }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      name: values.name.trim().length >= 2 ? "" : "Enter your name.",
      email: validEmail(values.email) ? "" : "Enter a valid email address.",
      story: values.story.trim().length >= 50 ? "" : "Share at least 50 characters so we understand your story.",
      photo: photo ? "" : "Add one JPG, PNG, or WebP photo under 2 MB.",
      consent: values.consent ? "" : "Confirm permission before submitting your story.",
    };
    setErrors(nextErrors);
    setNotice(null);
    if (Object.values(nextErrors).some(Boolean) || !photo) return;
    try {
      await mutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim(),
        story: values.story.trim(),
        photoData: photo.data,
        photoName: photo.name,
        photoMime: photo.mime,
        consent: true,
      });
      setValues({ name: "", email: "", story: "", consent: false });
      setPhoto(null);
      if (fileInput.current) fileInput.current.value = "";
      setNotice({ tone: "success", text: "Story received. We’ll review it first and never publish it without your permission." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not save your story. Please try again." });
    }
  };

  return <form className="story-form" onSubmit={submit} noValidate>
    <div className="form-fields two">
      <label className="field"><span>Name</span><input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Your name" aria-invalid={Boolean(errors.name)} />{errors.name ? <small className="field-error">{errors.name}</small> : null}</label>
      <label className="field"><span>Email</span><input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@email.com" aria-invalid={Boolean(errors.email)} />{errors.email ? <small className="field-error">{errors.email}</small> : null}</label>
    </div>
    <label className="field"><span>Your story</span><textarea rows={5} value={values.story} onChange={(event) => setValues({ ...values, story: event.target.value })} placeholder="What changed? What did you keep doing when it got difficult?" aria-invalid={Boolean(errors.story)} />{errors.story ? <small className="field-error">{errors.story}</small> : null}</label>
    <div className="field story-photo-field"><span>Photo</span><label className="file-picker"><ImagePlus size={16} />{photo ? "Replace photo" : "Choose photo"}<input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} /></label><small className="photo-status">{photo ? `${photo.name} ready to send` : "JPG, PNG, or WebP · 2 MB max"}</small>{errors.photo ? <small className="field-error">{errors.photo}</small> : null}</div>
    <label className="consent-field"><input type="checkbox" checked={values.consent} onChange={(event) => setValues({ ...values, consent: event.target.checked })} /><span>I own this story and photo, and I give Build With Coach permission to review it for possible publication. Nothing is published automatically.</span></label>{errors.consent ? <small className="field-error">{errors.consent}</small> : null}
    <button className="black-button" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving story…" : "Share your story"}<ArrowRight size={16} /></button>
    {notice ? <p className={`form-notice ${notice.tone}`} role="status">{notice.text}</p> : null}
  </form>;
}
