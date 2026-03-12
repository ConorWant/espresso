import { BeanManager } from "@/components/BeanManager";

async function getBeans() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/beans`, { cache: "no-store" });
  return res.json();
}

export default async function BeansPage() {
  const beans = await getBeans();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Beans</h1>
        <p className="text-muted-foreground">{beans.length} beans saved</p>
      </div>
      <BeanManager initialBeans={beans} />
    </div>
  );
}
