import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { OrderItem } from "./OrderForm";

interface ImportTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: OrderItem[]) => void;
}

export function ImportTableDialog({
  open,
  onOpenChange,
  onImport,
}: ImportTableDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setFile(selectedFile);

    // Simulação de leitura de arquivo CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        
        // Remove header e linhas vazias
        const dataLines = lines.slice(1).filter((line) => line.trim());
        
        const items: OrderItem[] = dataLines.map((line, index) => {
          const [codigo, descricao, quantidade, quantidadeDisponivel] = line
            .split(/[,;\t]/)
            .map((val) => val.trim());
          
          const qtd = parseFloat(quantidade) || 0;
          const qtdDisp = parseFloat(quantidadeDisponivel) || 0;
          
          return {
            id: String(Date.now() + index),
            codigo: codigo || `ITEM-${String(index + 1).padStart(3, "0")}`,
            descricao: descricao || "Sem descrição",
            quantidade: qtd,
            quantidadeDisponivel: qtdDisp,
          };
        });

        setPreview(items);
      } catch (err) {
        setError("Erro ao processar o arquivo. Verifique o formato.");
        setPreview([]);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Tabela de Itens
          </DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV ou TXT com os itens do pedido. O arquivo
            deve conter as colunas: Código, Descrição, Quantidade Necessária, Quantidade Disponível.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Selecionar Arquivo</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="relative overflow-hidden"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {file ? "Alterar Arquivo" : "Escolher Arquivo"}
              </Button>
              {file && (
                <span className="text-slate-600 truncate">{file.name}</span>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Formato esperado */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-slate-700 mb-2">
              Formato esperado do arquivo:
            </p>
            <pre className="bg-white p-3 rounded border border-slate-200 overflow-x-auto">
              <code className="text-slate-800">
                Codigo,Descrição,Quantidade Necessária,Quantidade Disponível{"\n"}
                ITEM-001,Parafuso M8,100,80{"\n"}
                ITEM-002,Porca M8,100,100
              </code>
            </pre>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <p className="text-rose-800">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span>
                  {preview.length} {preview.length === 1 ? "item encontrado" : "itens encontrados"}
                </span>
              </div>

              <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-slate-700">
                        Código
                      </th>
                      <th className="px-4 py-2 text-left text-slate-700">
                        Descrição
                      </th>
                      <th className="px-4 py-2 text-right text-slate-700">
                        Qtd. Necessária
                      </th>
                      <th className="px-4 py-2 text-right text-slate-700">
                        Qtd. Disponível
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-slate-900">
                          {item.codigo}
                        </td>
                        <td className="px-4 py-2 text-slate-900">
                          {item.descricao}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-900">
                          {item.quantidade}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-900">
                          {item.quantidadeDisponivel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={preview.length === 0}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar {preview.length > 0 && `${preview.length} ${preview.length === 1 ? "Item" : "Itens"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}