import { useEffect, useState } from "react";
import api from "@/lib/api";

const ApiTest = () => {
    const [apiUrl, setApiUrl] = useState("");
    const [testResult, setTestResult] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setApiUrl(import.meta.env.VITE_API_URL || "https://gnn-ecommerce-2.onrender.com/api");
    }, []);

    const testConnection = async () => {
        setLoading(true);
        try {
            const response = await api.get("/");
            setTestResult(`✅ Success: ${JSON.stringify(response.data)}`);
        } catch (error: any) {
            setTestResult(`❌ Error: ${error.message} - ${error.response?.data || 'No response'}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
            <div className="space-y-4">
                <div>
                    <strong>API Base URL:</strong> {apiUrl}
                </div>
                <button
                    onClick={testConnection}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {loading ? "Testing..." : "Test Connection"}
                </button>
                {testResult && (
                    <div className="p-4 bg-gray-100 rounded">
                        <pre>{testResult}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiTest;
