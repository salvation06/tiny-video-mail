import { Video, Play, Download, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface MessageCardProps {
  id: string;
  senderUsername: string;
  senderDisplayName: string | null;
  filename: string;
  messageText: string | null;
  sentAt: string;
  fileSizeMb: number | null;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessageCard = ({
  id,
  senderUsername,
  senderDisplayName,
  filename,
  messageText,
  sentAt,
  fileSizeMb,
  onView,
  onDownload,
  onDelete,
}: MessageCardProps) => {
  return (
    <div className="border-2 border-border bg-card p-4 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Video className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground">
              {senderDisplayName || senderUsername}
            </span>
            <span className="text-primary">@{senderUsername}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(sentAt), { addSuffix: true })}
            </span>
          </div>

          {messageText && (
            <p className="text-foreground mt-2 whitespace-pre-wrap">{messageText}</p>
          )}

          <div className="mt-3 bg-secondary rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {filename}
                </p>
                {fileSizeMb && (
                  <p className="text-xs text-muted-foreground">
                    {fileSizeMb.toFixed(1)} MB
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onView(id)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Play className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(id)}
                className="border-border text-foreground hover:bg-secondary"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(id)}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            ⚠️ Video will be deleted after viewing
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
