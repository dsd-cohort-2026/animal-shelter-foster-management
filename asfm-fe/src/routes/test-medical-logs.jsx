import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/axios';

export const Route = createFileRoute('/test-medical-logs')({
  component: TestMedicalLogsPage,
});

function TestMedicalLogsPage() {
  const [logs, setLogs] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const fetchMedicalLogs = async () => {
    setLoading(true);
    setError(null);
    setLogs([]);

    try {
      // Fetch both medical logs and animals
      const [logsResponse, animalsResponse] = await Promise.all([
        apiClient.get('/medical-logs'),
        apiClient.get('/animals'),
      ]);

      // Safely extract data with fallbacks
      const rawLogs = logsResponse?.data || [];
      const rawAnimals = animalsResponse?.data || [];

      // Validate responses are arrays
      if (!Array.isArray(rawLogs)) {
        throw new Error('Unexpected response format: expected array of logs');
      }
      if (!Array.isArray(rawAnimals)) {
        throw new Error('Unexpected response format: expected array of animals');
      }

      // Set animals
      setAnimals(rawAnimals);

      // Enrich logs with animal names
      const enrichedLogs = rawLogs.map(log => ({
        ...log,
        animal_name: rawAnimals.find(a => a.id === log.animal_id)?.name || null,
      }));

      setLogs(enrichedLogs);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch medical logs');
    } finally {
      setLoading(false);
    }
  };

  const formatLogType = (category) => {
    const types = {
      MEDICAL: 'Medical',
      BEHAVIORAL: 'Behavioral',
      VETERINARY: 'Veterinary',
    };
    return types[category] || category;
  };

  const getLogTypeColor = (category) => {
    const colors = {
      MEDICAL: 'bg-green-500/10 text-green-700 border-green-500/20',
      BEHAVIORAL: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      VETERINARY: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-700';
  };

  const hasAnimalName = (log) => {
    return log.animal_name !== undefined && log.animal_name !== null;
  };

  const allLogsHaveAnimalNames = logs.length > 0 && logs.every(hasAnimalName);

  const medicalCount = logs.filter((l) => l.category === 'MEDICAL').length;
  const behavioralCount = logs.filter((l) => l.category === 'BEHAVIORAL').length;
  const veterinaryCount = logs.filter((l) => l.category === 'VETERINARY').length;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Medical Logs API Test</CardTitle>
          <CardDescription>
            Test the medical logs backend API integration directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Controls */}
          <div className="flex gap-4 items-center">
            <Button
              onClick={fetchMedicalLogs}
              disabled={loading}
              size="lg"
            >
              {loading ? 'Loading...' : 'Fetch Medical Logs'}
            </Button>

            {logs.length > 0 && (
              <Button
                onClick={() => setShowRaw(!showRaw)}
                variant="outline"
              >
                {showRaw ? 'Show Formatted' : 'Show Raw JSON'}
              </Button>
            )}
          </div>

          {/* Status Cards */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="font-semibold text-red-800">❌ Error</div>
                <div className="text-sm text-red-700 mt-1">{error}</div>
              </CardContent>
            </Card>
          )}

          {logs.length > 0 && !allLogsHaveAnimalNames && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="font-semibold text-amber-800">⚠️ Missing Animal Names</div>
                <div className="text-sm text-amber-700 mt-1">
                  Some logs are missing the animal_name field. If this is a direct API call,
                  this is expected. The frontend store slice will enrich with animal names.
                </div>
              </CardContent>
            </Card>
          )}

          {logs.length > 0 && allLogsHaveAnimalNames && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="font-semibold text-green-800">✓ Success</div>
                <div className="text-sm text-green-700 mt-1">
                  All logs have animal names! API integration is working correctly.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          {logs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold">{logs.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Logs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{medicalCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Medical</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{behavioralCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Behavioral</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{veterinaryCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Veterinary</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Raw JSON View */}
          {showRaw && logs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Raw JSON Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(logs, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Formatted Logs View */}
          {!showRaw && logs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Medical Logs ({logs.length})
              </h3>
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getLogTypeColor(log.category)}>
                        {formatLogType(log.category)}
                      </Badge>
                      <span className="font-semibold">
                        {hasAnimalName(log) ? (
                          <>
                            {log.animal_name}
                            <span className="text-muted-foreground text-sm ml-2">
                              (ID: {log.animal_id})
                            </span>
                          </>
                        ) : (
                          <span className="text-amber-600">
                            Animal ID: {log.animal_id}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(log.logged_at).toLocaleString()}
                      </span>
                    </div>

                    {log.general_notes && (
                      <p className="text-sm">{log.general_notes}</p>
                    )}
                    {log.behavior_notes && (
                      <p className="text-sm text-muted-foreground">
                        {log.behavior_notes}
                      </p>
                    )}
                    {log.prescription && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Rx:</span> {log.prescription}
                      </p>
                    )}
                    {log.dose && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Dose:</span> {log.dose}
                        {log.qty_administered != null && ` × ${log.qty_administered}`}
                      </p>
                    )}

                    {/* Debug Info */}
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:underline">
                        Show debug info
                      </summary>
                      <pre className="mt-2 text-xs bg-slate-100 p-2 rounded border">
                        {JSON.stringify(
                          {
                            id: log.id,
                            foster_user_id: log.foster_user_id,
                            animal_id: log.animal_id,
                            animal_name: log.animal_name,
                            category: log.category,
                            logged_at: log.logged_at,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && logs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  No logs loaded. Click "Fetch Medical Logs" to test the API.
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
