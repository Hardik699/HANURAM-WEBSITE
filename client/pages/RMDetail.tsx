import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Edit2, Trash2, Plus, Eye, History } from "lucide-react";

interface RawMaterial {
  _id: string;
  code: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  unitId?: string;
  unitName?: string;
  hsnCode?: string;
  createdAt: string;
  lastAddedPrice?: number;
  lastVendorName?: string;
  lastPriceDate?: string;
}

interface VendorPrice {
  _id: string;
  rawMaterialId: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  unitName?: string;
  price: number;
  addedDate: string;
}

interface PriceLog {
  _id: string;
  rawMaterialId: string;
  vendorId: string;
  vendorName: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
  unitName?: string;
  changeDate: string;
  changedBy: string;
}

export default function RMDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rawMaterial, setRawMaterial] = useState<RawMaterial | null>(null);
  const [vendorPrices, setVendorPrices] = useState<VendorPrice[]>([]);
  const [priceLogs, setPriceLogs] = useState<PriceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPriceLogsTab, setShowPriceLogsTab] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }

    if (id) {
      fetchRawMaterialDetail();
    }
  }, [id, navigate]);

  const fetchRawMaterialDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/raw-materials`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const rm = data.data.find((m: RawMaterial) => m._id === id);
        if (rm) {
          setRawMaterial(rm);
          await Promise.all([
            fetchVendorPrices(id),
            fetchPriceLogs(id),
          ]);
        } else {
          navigate("/raw-materials");
        }
      }
    } catch (error) {
      console.error("Error fetching raw material:", error);
      navigate("/raw-materials");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorPrices = async (rmId: string) => {
    try {
      const response = await fetch(`/api/raw-materials/${rmId}/vendor-prices`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setVendorPrices(data.data);
      }
    } catch (error) {
      console.error("Error fetching vendor prices:", error);
    }
  };

  const fetchPriceLogs = async (rmId: string) => {
    try {
      const response = await fetch(`/api/raw-materials/${rmId}/price-logs`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setPriceLogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching price logs:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatUnit = (u?: string | null) => {
    if (!u) return null;
    const s = u.toLowerCase().trim();
    if (s.includes("kg") || s.includes("kilogram")) return "kg";
    if (s === "g" || s.includes("gram")) return "g";
    if (s.includes("lit") || s === "l" || s.includes("ltr") || s.includes("litre")) return "L";
    if (s.includes("ml")) return "ml";
    if (s.includes("piece") || s.includes("pc") || s === "pcs") return "pcs";
    return u;
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 ml-3 font-medium">Loading raw material...</p>
        </div>
      </Layout>
    );
  }

  if (!rawMaterial) {
    return (
      <Layout title="Not Found">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Raw material not found</p>
          <button
            onClick={() => navigate("/raw-materials")}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Back to Raw Materials
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${rawMaterial.code} - ${rawMaterial.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/raw-materials")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Back to Raw Materials"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {rawMaterial.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Code: <span className="font-semibold">{rawMaterial.code}</span>
            </p>
          </div>
        </div>

        {/* Material Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Category
              </label>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{rawMaterial.categoryName}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Sub Category
              </label>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{rawMaterial.subCategoryName}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Unit
              </label>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{rawMaterial.unitName || "-"}</p>
            </div>
            {rawMaterial.hsnCode && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                  HSN Code
                </label>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{rawMaterial.hsnCode}</p>
              </div>
            )}
            {typeof rawMaterial.lastAddedPrice === "number" && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Last Price
                </label>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                  ₹{rawMaterial.lastAddedPrice.toFixed(2)}{formatUnit(rawMaterial.unitName) ? ` / ${formatUnit(rawMaterial.unitName)}` : ""}
                </p>
                {rawMaterial.lastVendorName && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">from {rawMaterial.lastVendorName}</p>
                )}
              </div>
            )}
            {rawMaterial.lastPriceDate && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Last Purchase Date
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(rawMaterial.lastPriceDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex">
              <button
                onClick={() => setShowPriceLogsTab(false)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  !showPriceLogsTab
                    ? "border-teal-600 text-teal-600 dark:text-teal-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Vendor Prices
              </button>
              <button
                onClick={() => setShowPriceLogsTab(true)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  showPriceLogsTab
                    ? "border-teal-600 text-teal-600 dark:text-teal-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                }`}
              >
                <History className="w-4 h-4 inline mr-2" />
                Price History
              </button>
            </div>
          </div>

          {/* Vendor Prices Tab */}
          {!showPriceLogsTab && (
            <div className="p-6">
              {vendorPrices.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <p>No vendor prices recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vendor</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {vendorPrices.map((vp) => (
                        <tr key={vp._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{vp.vendorName}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
                            ₹{vp.price.toFixed(2)}{formatUnit(vp.unitName) ? ` / ${formatUnit(vp.unitName)}` : ""}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{vp.quantity}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(vp.addedDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Price History Tab */}
          {showPriceLogsTab && (
            <div className="p-6">
              {priceLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <p>No price history recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vendor</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Old Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">New Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Change Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Changed By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {priceLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{log.vendorName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            ₹{log.oldPrice.toFixed(2)}{formatUnit(log.unitName) ? ` / ${formatUnit(log.unitName)}` : ""}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                            ₹{log.newPrice.toFixed(2)}{formatUnit(log.unitName) ? ` / ${formatUnit(log.unitName)}` : ""}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(log.changeDate)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{log.changedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
