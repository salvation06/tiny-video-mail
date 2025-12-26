import { Video, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EmptyInbox = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mb-6">
        <Video className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">No video messages yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Your inbox is empty. When someone sends you a video, it will appear here.
        Videos are automatically deleted after viewing.
      </p>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link to="/compose">
          <Send className="h-4 w-4 mr-2" />
          Send your first video
        </Link>
      </Button>
    </div>
  );
};

export default EmptyInbox;
