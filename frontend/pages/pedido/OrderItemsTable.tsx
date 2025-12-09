import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { OrderItem } from "./OrderForm";

interface OrderItemsTableProps {
  items: OrderItem[];
  onDelete: (id: string) => void;
}

export function OrderItemsTable({ items, onDelete }: OrderItemsTableProps) {
  const getStockStatus = (necessaria: number, disponivel: number) => {
    if (disponivel === 0) {
      return { label: "Sem Estoque", variant: "destructive" as const, icon: AlertCircle };
    }
    if (disponivel < necessaria) {
      return { label: "Estoque Parcial", variant: "secondary" as const, icon: AlertCircle };
    }
    return { label: "Disponível", variant: "default" as const, icon: CheckCircle2 };
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[140px] text-right">Qtd. Necessária</TableHead>
              <TableHead className="w-[140px] text-right">Qtd. Disponível</TableHead>
              <TableHead className="w-[150px] text-center">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500">
                  Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const status = getStockStatus(item.quantidade, item.quantidadeDisponivel);
                const StatusIcon = status.icon;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.codigo}
                        className="h-8"
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.descricao}
                        className="h-8"
                        placeholder="Descrição do item"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantidade}
                        className="h-8 text-right"
                        min="1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantidadeDisponivel}
                        className="h-8 text-right"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}