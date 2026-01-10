"use client";

import { Card } from "@/components/ui/card";
import { UploadCloud, FileText, X, Download } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UserImportPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setHeaders([]);
      setRows([]);
      setErrors([]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
    if (!data.length) return;

    const [headerRow, ...bodyRows] = data;
    setHeaders(headerRow as string[]);
    setRows(
      bodyRows.map((row) =>
        Object.fromEntries(headerRow.map((key, i) => [key, row[i]]))
      )
    );
    setErrors([]);
  };

  const handleSaveData = async () => {
    if (!file) return;

    setLoading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/users/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.data?.errors?.length) {
          setErrors(data.data.errors);
          toast.error("Validation errors found");
        } else {
          toast.error(data.message || "Error importing users");
        }
        return;
      }

      toast.success("Users imported successfully!");
      setFile(null);
      setRows([]);
      setHeaders([]);
      setErrors([]);
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ["Name", "Email", "Password", "Phone Number"];
    const csvContent = [headers.join(","), ""].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "user_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      {/* ===== Upload Card ===== */}
      {!rows.length && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upload Excel/CSV</h2>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Template
              </button>
            </div>

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <UploadCloud className="w-10 h-10 text-blue-600 mb-3" />
              <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-500 mt-1">CSV, XLS, XLSX (max 5MB)</p>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <div className="mt-4 flex items-center justify-between bg-gray-50 border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={!file}
                onClick={handleImport}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
              >
                Import File
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* ===== Data Preview ===== */}
      {rows.length > 0 && (
        <Card className="mb-6">
          <div className="p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Preview Users</h2>
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={errors.find((e) => e.row === i + 2) ? "bg-red-100" : ""}>
                    {headers.map((key, j) => (
                      <td key={j} className="px-4 py-2 text-sm text-gray-700 border-b">
                        {row[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setRows([]);
                  setHeaders([]);
                  setFile(null);
                  setErrors([]);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSaveData}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Users"}
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserImportPage;
