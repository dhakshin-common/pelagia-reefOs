import { CoralReefSurvey, BiodiversitySighting, RestorationActivity, OceanographicStation } from '../types/marine';

export function exportToCSV(filename: string, rows: object[]): void {
  if (!rows || rows.length === 0) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = (row as Record<string, unknown>)[k];
            if (cell === null || cell === undefined) {
              cell = '';
            } else if (typeof cell === 'object') {
              cell = JSON.stringify(cell).replace(/"/g, '""');
            } else {
              cell = String(cell).replace(/"/g, '""');
            }
            if (String(cell).search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(filename: string, data: unknown): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateAgencyReportSummary(
  surveys: CoralReefSurvey[],
  sightings: BiodiversitySighting[],
  restorations: RestorationActivity[],
  stations: OceanographicStation[]
) {
  const avgHardCoral = (
    surveys.reduce((acc, s) => acc + s.benthicComposition.hardCoralCover, 0) / (surveys.length || 1)
  ).toFixed(1);

  const avgBleaching = (
    surveys.reduce((acc, s) => acc + s.bleachedCoralPercentage, 0) / (surveys.length || 1)
  ).toFixed(1);

  const totalFragments = restorations.reduce((acc, r) => acc + r.fragmentsOutplanted, 0);
  const avgSurvival90d = (
    restorations.reduce((acc, r) => acc + r.survivalRate90d, 0) / (restorations.length || 1)
  ).toFixed(1);

  const maxDHW = Math.max(...stations.map(s => s.degreeHeatingWeeks), 0);

  return {
    metadata: {
      agency: 'International Coral Reef Monitoring Network (GCRMN) Partner Node',
      system: 'Pelagia ReefOS',
      reportGenerated: new Date().toISOString(),
      activeMPASurveyCount: surveys.length,
      censusSightingsCount: sightings.length,
      restorationBatchesCount: restorations.length,
      telemetryStationsCount: stations.length,
    },
    executiveSummary: {
      averageHardCoralCoverPct: Number(avgHardCoral),
      averageBleachingIncidencePct: Number(avgBleaching),
      totalFragmentsOutplanted: totalFragments,
      averageOutplant90dSurvivalPct: Number(avgSurvival90d),
      peakThermalStressDHW: maxDHW,
    },
    surveys,
    biodiversitySightings: sightings,
    restorationProjects: restorations,
    sensorStations: stations,
  };
}
