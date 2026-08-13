import { NextResponse } from 'next/server';

// Simulated protocol metrics for the noVault testnet
const metrics = {
  proofsGenerated: 2437891,
  valueSecured: 182400000,
  developers: 12437,
  uptime: 99.97,
  networks: 4,
  audits: 3,
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  // Simulate small real-time fluctuations
  const jitter = () => 1 + (Math.random() - 0.5) * 0.002;
  return NextResponse.json({
    proofsGenerated: Math.floor(metrics.proofsGenerated * jitter()),
    valueSecured: Math.floor(metrics.valueSecured * jitter()),
    developers: metrics.developers + Math.floor(Math.random() * 5),
    uptime: +(metrics.uptime + (Math.random() - 0.5) * 0.02).toFixed(2),
    networks: metrics.networks,
    audits: metrics.audits,
    lastUpdated: metrics.lastUpdated,
  });
}
