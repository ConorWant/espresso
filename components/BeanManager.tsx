"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bean } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  producer: string;
  region: string;
  varietal: string;
  process: string;
  altitude: string;
  roast_date: string;
  tasting_notes: string;
}

export function BeanManager({ initialBeans }: { initialBeans: Bean[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

  const processFile = (file: File) => {
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64(result.split(",")[1]);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleParse = async () => {
    if (!base64) return;
    setParsing(true);
    try {
      const res = await fetch("/api/parse-bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType }),
      });
      const data = await res.json();
      if (data.name) setValue("name", data.name);
      if (data.producer) setValue("producer", data.producer);
      if (data.region) setValue("region", data.region);
      if (data.varietal) setValue("varietal", data.varietal);
      if (data.process) setValue("process", data.process);
      if (data.altitude) setValue("altitude", data.altitude);
      if (data.roast_date) setValue("roast_date", data.roast_date);
      if (data.tasting_notes) setValue("tasting_notes", data.tasting_notes);
    } finally {
      setParsing(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    await fetch("/api/beans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setLoading(false);
    reset();
    setPreview(null);
    setBase64(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Bean</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bag image uploader */}
          <div className="space-y-1">
            <Label>Bag Photo (optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Bag preview"
                  className="max-h-48 mx-auto rounded object-contain"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Drop a photo of the bag here or click to upload
                </p>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
              />
            </div>
            {base64 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleParse}
                disabled={parsing}
                className="w-full"
              >
                {parsing ? "Parsing…" : "Parse Bag with AI"}
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <Label>Name *</Label>
                <Input {...register("name", { required: true })} placeholder="e.g. Ethiopia Yirgacheffe" />
              </div>
              <div className="space-y-1">
                <Label>Producer</Label>
                <Input {...register("producer")} placeholder="e.g. Worku Bikila" />
              </div>
              <div className="space-y-1">
                <Label>Region</Label>
                <Input {...register("region")} placeholder="e.g. Yirgacheffe, Ethiopia" />
              </div>
              <div className="space-y-1">
                <Label>Varietal</Label>
                <Input {...register("varietal")} placeholder="e.g. Heirloom" />
              </div>
              <div className="space-y-1">
                <Label>Process</Label>
                <Input {...register("process")} placeholder="e.g. Washed, Natural" />
              </div>
              <div className="space-y-1">
                <Label>Altitude</Label>
                <Input {...register("altitude")} placeholder="e.g. 1900–2200 masl" />
              </div>
              <div className="space-y-1">
                <Label>Roast Date</Label>
                <Input type="date" {...register("roast_date")} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Tasting Notes</Label>
              <Textarea {...register("tasting_notes")} placeholder="e.g. Blueberry, jasmine, bright acidity…" rows={2} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Add Bean"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {initialBeans.length === 0 && (
          <p className="text-muted-foreground text-sm">No beans yet.</p>
        )}
        {initialBeans.map((bean) => (
          <Card key={bean.id}>
            <CardContent className="py-4">
              <p className="font-semibold">{bean.name}</p>
              {bean.producer && (
                <p className="text-sm text-muted-foreground">{bean.producer}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                {bean.region && <span>{bean.region}</span>}
                {bean.varietal && <span>{bean.varietal}</span>}
                {bean.process && <span>{bean.process}</span>}
                {bean.altitude && <span>{bean.altitude}</span>}
                {bean.roast_date && <span>Roasted {bean.roast_date}</span>}
              </div>
              {bean.tasting_notes && (
                <p className="mt-1 text-sm italic">{bean.tasting_notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
