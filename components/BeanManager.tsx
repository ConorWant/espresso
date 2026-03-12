"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bean } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  roaster: string;
  origin: string;
  roast_date: string;
  notes: string;
}

export function BeanManager({ initialBeans }: { initialBeans: Bean[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    await fetch("/api/beans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setLoading(false);
    reset();
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Bean</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label>Name *</Label>
                <Input {...register("name", { required: true })} placeholder="e.g. Ethiopia Yirgacheffe" />
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label>Roaster</Label>
                <Input {...register("roaster")} placeholder="e.g. Hasbean" />
              </div>
              <div className="space-y-1">
                <Label>Origin</Label>
                <Input {...register("origin")} placeholder="e.g. Ethiopia" />
              </div>
              <div className="space-y-1">
                <Label>Roast Date</Label>
                <Input type="date" {...register("roast_date")} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea {...register("notes")} placeholder="Flavour profile, process…" rows={2} />
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
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{bean.name}</p>
                  {bean.roaster && (
                    <p className="text-sm text-muted-foreground">{bean.roaster}</p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {bean.origin && <span>{bean.origin}</span>}
                    {bean.roast_date && <span>Roasted {bean.roast_date}</span>}
                  </div>
                  {bean.notes && (
                    <p className="mt-1 text-sm">{bean.notes}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
