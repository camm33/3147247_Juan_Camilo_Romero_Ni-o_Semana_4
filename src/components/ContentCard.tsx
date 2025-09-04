import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ContentCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent";
  badge?: string;
}

export const ContentCard = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  variant = "default",
  badge 
}: ContentCardProps) => {
  const variantStyles = {
    default: "border-border",
    primary: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary-glow/5",
    accent: "border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5"
  };

  return (
    <Card className={`shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in ${variantStyles[variant]}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                variant === "primary" ? "bg-primary text-primary-foreground" :
                variant === "accent" ? "bg-accent text-accent-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};