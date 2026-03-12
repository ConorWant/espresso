import { DoseVsYieldScatter } from "@/components/charts/DoseVsYieldScatter";
import { RatioOverTime } from "@/components/charts/RatioOverTime";
import { RatingOverTime } from "@/components/charts/RatingOverTime";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getShots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/shots`, { cache: "no-store" });
  return res.json();
}

export default async function DashboardPage() {
  const shots = await getShots();

  const chartData = [...shots].reverse().map((s: {
    created_at: number;
    yield_g: number;
    ratio: number | null;
    dose_g: number;
    rating: number | null;
  }) => ({
    date: new Date(s.created_at).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    }),
    yield_g: s.yield_g,
    ratio: s.ratio,
    dose_g: s.dose_g,
    rating: s.rating,
  }));

  const stats = shots.length
    ? {
        avgRatio:
          shots
            .filter((s: { ratio: number | null }) => s.ratio)
            .reduce((a: number, s: { ratio: number }) => a + s.ratio, 0) /
          shots.filter((s: { ratio: number | null }) => s.ratio).length,
        avgRating:
          shots
            .filter((s: { rating: number | null }) => s.rating)
            .reduce((a: number, s: { rating: number }) => a + s.rating, 0) /
          shots.filter((s: { rating: number | null }) => s.rating).length,
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your espresso at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Shots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shots.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? `1:${stats.avgRatio.toFixed(2)}` : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.avgRating.toFixed(1) : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                shots.filter(
                  (s: { created_at: number }) =>
                    s.created_at > Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {shots.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No data yet. Log your first shot to see charts.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Yield &amp; Ratio Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <RatioOverTime data={chartData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dose vs Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <DoseVsYieldScatter data={chartData} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Rating Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingOverTime data={chartData} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
