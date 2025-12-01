import { ChartDataPoint } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchChartData(id: number): Promise<ChartDataPoint[]> {
    const res = await fetch(`${API_BASE_URL}/api/reservatorios/${id}/chart/volume-data`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error("Failed to fetch chart data");
    }
    return res.json();
}
