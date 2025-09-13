import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Table, Download, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UploadState {
  template: File | null;
  excel: File | null;
}

const ReportGenerator = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    template: null,
    excel: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (type: 'template' | 'excel', file: File) => {
    setUploadState(prev => ({ ...prev, [type]: file }));
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded.`,
    });
  };

  const handleGenerate = async () => {
    if (!uploadState.template || !uploadState.excel) {
      toast({
        title: "Missing files",
        description: "Please upload both template and Excel files.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      toast({
        title: "Reports generated successfully!",
        description: "All student reports have been created and are ready for download.",
      });
    }, 3000);
  };

  const FileUploadZone = ({ 
    type, 
    accept, 
    icon: Icon, 
    title, 
    description 
  }: {
    type: 'template' | 'excel';
    accept: string;
    icon: React.ComponentType<any>;
    title: string;
    description: string;
  }) => {
    const file = uploadState[type];
    
    return (
      <div
        className={cn(
          "relative border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50",
          file && "border-success bg-success/5"
        )}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) handleFileUpload(type, droppedFile);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileUpload(type, selectedFile);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-4">
          {file ? (
            <CheckCircle className="h-12 w-12 text-success" />
          ) : (
            <Icon className="h-12 w-12 text-muted-foreground" />
          )}
          
          <div>
            <h3 className="font-semibold text-lg">
              {file ? file.name : title}
            </h3>
            <p className="text-muted-foreground">
              {file ? "File uploaded successfully" : description}
            </p>
          </div>
          
          {!file && (
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Bulk Report Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your template and student data to generate professional reports instantly. 
          Support for DOCX and PDF templates with Excel data integration.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="shadow-soft hover:shadow-elegant transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Template File
            </CardTitle>
            <CardDescription>
              Upload your report template (.docx or .pdf) with placeholders like {`{{nama}}, {{kelas}}, {{nilai}}, {{saran}}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              type="template"
              accept=".docx,.pdf"
              icon={FileText}
              title="Upload Template"
              description="Drag & drop or click to select template file"
            />
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elegant transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5 text-primary" />
              Student Data
            </CardTitle>
            <CardDescription>
              Upload Excel file (.xlsx) with columns: Nama, Kelas, Nilai, Saran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              type="excel"
              accept=".xlsx"
              icon={Table}
              title="Upload Excel Data"
              description="Drag & drop or click to select Excel file"
            />
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        {!isComplete ? (
          <Button
            onClick={handleGenerate}
            disabled={!uploadState.template || !uploadState.excel || isProcessing}
            size="lg"
            className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Generating Reports...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-success">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">Reports Generated Successfully!</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Individual Reports
              </Button>
              <Button size="lg" className="bg-gradient-primary">
                <Download className="h-4 w-4 mr-2" />
                Download All as ZIP
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <Card className="mt-12 shadow-soft">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">1. Upload Template</h3>
            <p className="text-sm text-muted-foreground">
              Create your report template with placeholders and upload it
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Table className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">2. Upload Data</h3>
            <p className="text-sm text-muted-foreground">
              Upload Excel file with student information and grades
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">3. Download Reports</h3>
            <p className="text-sm text-muted-foreground">
              Generate and download individual or bulk reports instantly
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;