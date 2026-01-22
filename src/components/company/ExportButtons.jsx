import { Button } from "@/components/ui/button";
import { Download, FileText, Table, Building } from "lucide-react";
import { toast } from "sonner";

const ExportButtons = ({ companyId, companyName, isAdmin = false, className = "" }) => {
  const handleExportPDF = () => {
    if (!companyId) {
      toast.error("Company ID is required");
      return;
    }
    
    const token = localStorage.getItem("token");
    const url = `/api/v1/company/export/pdf/${companyId}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `company-${companyName || 'details'}-${Date.now()}.pdf`;
    
    // Add authorization header if token exists
    if (token) {
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to download PDF: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        toast.success("PDF download started");
      })
      .catch(error => {
        console.error("PDF download error:", error);
        toast.error("Failed to download PDF");
        // Fallback to direct link
        link.click();
      });
    } else {
      // Direct link without auth (will fail if backend requires auth)
      link.click();
    }
  };

  const handleExportExcel = () => {
    if (!companyId) {
      toast.error("Company ID is required");
      return;
    }
    
    const token = localStorage.getItem("token");
    const url = `/api/v1/company/export/excel/${companyId}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `company-${companyName || 'details'}-${Date.now()}.xlsx`;
    
    if (token) {
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to download Excel: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        toast.success("Excel download started");
      })
      .catch(error => {
        console.error("Excel download error:", error);
        toast.error("Failed to download Excel");
        link.click();
      });
    } else {
      link.click();
    }
  };

  const handleExportAllCompanies = () => {
    if (!isAdmin) {
      toast.error("Admin access required");
      return;
    }
    
    const token = localStorage.getItem("token");
    const url = `/api/v1/company/admin/export/excel`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-companies-${Date.now()}.xlsx`;
    
    if (token) {
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Admin access required");
          }
          throw new Error(`Failed to download: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        toast.success("All companies export started");
      })
      .catch(error => {
        console.error("Export all companies error:", error);
        toast.error(error.message || "Failed to download companies data");
        link.click();
      });
    } else {
      link.click();
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        onClick={handleExportPDF}
        variant="outline"
        size="sm"
        className="gap-2 hover:bg-red-50 hover:text-red-600"
        disabled={!companyId}
      >
        <FileText size={16} />
        Export PDF
      </Button>
      
      <Button 
        onClick={handleExportExcel}
        variant="outline"
        size="sm"
        className="gap-2 hover:bg-green-50 hover:text-green-600"
        disabled={!companyId}
      >
        <Table size={16} />
        Export Excel
      </Button>
      
      {isAdmin && (
        <Button 
          onClick={handleExportAllCompanies}
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-blue-50 hover:text-blue-600"
        >
          <Building size={16} />
          Export All Companies
        </Button>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        {companyName && `Exporting: ${companyName}`}
      </div>
    </div>
  );
};

export default ExportButtons;j