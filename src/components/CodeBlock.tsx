import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ code, language = "python", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Código copiado",
      description: "El código ha sido copiado al portapapeles",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && (
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-border border-b-0">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <pre className={`bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm leading-relaxed ${
          title ? 'rounded-b-lg' : 'rounded-lg'
        } border border-border`}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};