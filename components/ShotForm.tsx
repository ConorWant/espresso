"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Bean } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, Resolver, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ImageUploader } from "./ImageUploader";

const schema = z.object({
  bean_id: z.string().optional(),
  dose_g: z.coerce.number().positive(),
  yield_g: z.coerce.number().positive(),
  duration_s: z.coerce.number().int().positive(),
  grind_setting: z.string().optional(),
  rating: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ShotFormProps {
  defaultValues?: Partial<FormValues & { id: number }>;
  editId?: number;
}

export function ShotForm({ defaultValues, editId }: ShotFormProps) {
  const router = useRouter();
  const [beans, setBeans] = useState<Bean[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      rating: 7,
      ...defaultValues,
    },
  });

  const dose = useWatch({ control, name: "dose_g" });
  const yieldVal = useWatch({ control, name: "yield_g" });
  const rating = useWatch({ control, name: "rating" }) ?? 7;
  const ratio =
    dose && yieldVal && Number(dose) > 0
      ? (Number(yieldVal) / Number(dose)).toFixed(2)
      : "—";

  useEffect(() => {
    fetch("/api/beans")
      .then((r) => r.json())
      .then(setBeans);
  }, []);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const url = editId ? `/api/shots/${editId}` : "/api/shots";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        bean_id: values.bean_id && values.bean_id !== "none" ? Number(values.bean_id) : null,
      }),
    });
    setLoading(false);
    router.push("/shots");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{editId ? "Edit Shot" : "Log New Shot"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Image Uploader */}
          {!editId && (
            <div className="space-y-1">
              <Label>Scale Photo (optional)</Label>
              <ImageUploader
                onParsed={(data) => {
                  if (data.yield_g != null) setValue("yield_g", data.yield_g);
                  if (data.duration_s != null)
                    setValue("duration_s", data.duration_s);
                }}
              />
            </div>
          )}

          {/* Bean */}
          <div className="space-y-1">
            <Label>Bean</Label>
            <Controller
              control={control}
              name="bean_id"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? "none"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bean…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No bean selected</SelectItem>
                    {beans.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                        {b.roaster ? ` — ${b.roaster}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Dose / Yield / Ratio */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Dose (g)</Label>
              <Input
                type="number"
                step="0.1"
                {...register("dose_g")}
                placeholder="18"
              />
              {errors.dose_g && (
                <p className="text-xs text-destructive">{errors.dose_g.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Yield (g)</Label>
              <Input
                type="number"
                step="0.1"
                {...register("yield_g")}
                placeholder="36"
              />
              {errors.yield_g && (
                <p className="text-xs text-destructive">{errors.yield_g.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Ratio</Label>
              <div className="h-10 px-3 py-2 rounded-md border bg-muted text-sm flex items-center font-mono">
                {ratio}
              </div>
            </div>
          </div>

          {/* Duration / Grind */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Duration (s)</Label>
              <Input
                type="number"
                {...register("duration_s")}
                placeholder="28"
              />
              {errors.duration_s && (
                <p className="text-xs text-destructive">
                  {errors.duration_s.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Grind Setting</Label>
              <Input {...register("grind_setting")} placeholder="e.g. 12" />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating: {rating}/10</Label>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value ?? 7]}
                  onValueChange={(vals: number | readonly number[]) =>
                    field.onChange(Array.isArray(vals) ? vals[0] : vals)
                  }
                />
              )}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              {...register("notes")}
              placeholder="Taste notes, observations…"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : editId ? "Update Shot" : "Log Shot"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
