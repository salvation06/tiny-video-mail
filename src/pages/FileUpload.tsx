import { Video, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FileUpload = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Link>

        <Card className="border-2 border-border bg-card">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Video className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-bold text-foreground">Upload & Compress Video</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Your video compression interface will go here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Placeholder for Video Upload
              </h3>
              <p className="text-muted-foreground mb-4">
                This is where you'll integrate your existing video upload and compression interface.
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 50MB
              </p>
            </div>

            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Integration Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Replace this placeholder with your compression interface</li>
                <li>After compression, redirect to the compose page</li>
                <li>Pass the filename and path to the compose form</li>
              </ul>
            </div>

            <Button asChild className="w-full mt-6 bg-primary text-primary-foreground">
              <Link to="/compose">Continue to Compose</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUpload;
