import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

type Props = {};

const Dashboard = (props: Props) => {
  const [reportData, setReportData] = React.useState<any>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    const response = await fetch("/api/report");
    const data = await response.json();
    setReportData(data);
  };

  return (
    <div className="p-4 w-3/4 m-auto">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold">Welcome User</h1>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
      <div className="mx-auto p-8 bg-white rounded-lg shadow-lg mt-4">
        <h1 className="text-xl font-bold mb-4">Last 24 Hours Summary</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Total Records</h2>
            <p className="text-2xl">
              {reportData?.total_records_last_24_hours}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Average Battery Level</h2>
            <p className="text-2xl">
              {Number(reportData?.avg_battery_level_last_24_hours)?.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Average Humidity</h2>
            <p className="text-2xl">
              {Number(reportData?.avg_humidity_last_24_hours)?.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Average Temperature</h2>
            <p className="text-2xl">
              {Number(reportData?.avg_temperature_last_24_hours)?.toFixed(2)}°C
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Average Signal Strength</h2>
            <p className="text-2xl">
              {Number(reportData?.avg_signal_strength_last_24_hours)?.toFixed(
                2
              )}{" "}
              dBm
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Battery Level Range</h2>
            <p className="text-2xl">
              {reportData?.min_battery_level_last_24_hours}% -{" "}
              {reportData?.max_battery_level_last_24_hours}%
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Humidity Range</h2>
            <p className="text-2xl">
              {reportData?.min_humidity_last_24_hours}% -{" "}
              {reportData?.max_humidity_last_24_hours}%
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Temperature Range</h2>
            <p className="text-2xl">
              {reportData?.min_temperature_last_24_hours}°C to{" "}
              {reportData?.max_temperature_last_24_hours}°C
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Signal Strength Range</h2>
            <p className="text-2xl">
              {reportData?.min_signal_strength_last_24_hours} dBm -{" "}
              {reportData?.max_signal_strength_last_24_hours} dBm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
