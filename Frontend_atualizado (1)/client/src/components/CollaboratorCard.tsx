import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface CollaboratorCardProps {
  name: string;
  role: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CollaboratorCard({ name, role, onEdit, onDelete }: CollaboratorCardProps) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{role}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-accent hover:bg-accent/10 hover:text-accent"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
