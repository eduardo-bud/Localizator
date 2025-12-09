import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { OrderItemsTable } from "./OrderItemsTable";
import { MaterialsList } from "./MaterialsList";
import { ImportTableDialog } from "./ImportTableDialog";
import {
  Save,
  X,
  Send,
  Plus,
  FileText,
  Package,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Badge } from "./ui/badge";

export interface OrderItem {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  quantidadeDisponivel: number;
}

export interface Material {
  id: string;
  nome: string;
}

export function OrderForm() {
  const [orderType, setOrderType] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("Aberto");
  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [responsavel, setResponsavel] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Dados mockados
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: "1",
      codigo: "ITEM-001",
      descricao: "Parafuso M8 x 50mm",
      quantidade: 100,
      quantidadeDisponivel: 80,
    },
    {
      id: "2",
      codigo: "ITEM-002",
      descricao: "Porca M8",
      quantidade: 100,
      quantidadeDisponivel: 100,
    },
    {
      id: "3",
      codigo: "MAT-001",
      descricao: "Aço Inox 304",
      quantidade: 50,
      quantidadeDisponivel: 30,
    },
    {
      id: "4",
      codigo: "MAT-002",
      descricao: "Tinta Epóxi Branca",
      quantidade: 10,
      quantidadeDisponivel: 15,
    },
    {
      id: "5",
      codigo: "MAT-003",
      descricao: "Eletrodo E6013",
      quantidade: 25,
      quantidadeDisponivel: 0,
    },
  ]);

  const [materiaisDisponiveis] = useState<Material[]>([
    { id: "MAT-002", nome: "Tinta Epóxi Branca" },
    { id: "MAT-004", nome: "Chapa de Alumínio 3mm" },
    { id: "MAT-005", nome: "Parafuso Sextavado M10" },
    { id: "MAT-006", nome: "Arruela Lisa M10" },
  ]);

  const [materiaisSemEstoque] = useState<Material[]>([
    { id: "MAT-001", nome: "Aço Inox 304" },
    { id: "MAT-003", nome: "Eletrodo E6013" },
    { id: "MAT-007", nome: "Cola Epóxi Bicomponente" },
  ]);

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: String(Date.now()),
      codigo: `ITEM-${String(orderItems.length + 1).padStart(3, "0")}`,
      descricao: "Novo Item",
      quantidade: 1,
      quantidadeDisponivel: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleImportItems = (items: OrderItem[]) => {
    setOrderItems([...orderItems, ...items]);
  };

  const handleSave = () => {
    console.log("Pedido salvo");
  };

  const handleCancel = () => {
    console.log("Operação cancelada");
  };

  const handleSubmit = () => {
    console.log("Pedido enviado para aprovação");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aberto":
        return "default";
      case "Aguardando Materiais":
        return "secondary";
      case "Em Execução":
        return "default";
      case "Finalizado":
        return "default";
      case "Cancelado":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-slate-900">Geração de Pedido</h1>
          <p className="text-slate-600">
            Preencha as informações do pedido e adicione os itens necessários
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(orderStatus)} className="h-8 px-3">
          {orderStatus}
        </Badge>
      </div>

      {/* Informações do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pedido-id">ID do Pedido</Label>
              <Input
                id="pedido-id"
                value="PED-2025-001234"
                readOnly
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-criacao">Data da Criação</Label>
              <Input
                id="data-criacao"
                type="date"
                value="2025-11-15"
                readOnly
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-pedido">Tipo do Pedido</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger id="tipo-pedido">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="projeto">Para Projeto</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-pedido">Data do Pedido</Label>
              <Input
                id="data-pedido"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-pedido">Status do Pedido</Label>
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger id="status-pedido">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Aguardando Materiais">
                    Aguardando Materiais
                  </SelectItem>
                  <SelectItem value="Em Execução">Em Execução</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável pelo Pedido</Label>
              <Select value={responsavel} onValueChange={setResponsavel}>
                <SelectTrigger id="responsavel">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Oliveira</SelectItem>
                  <SelectItem value="ana">Ana Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Digite observações ou instruções especiais para este pedido..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Itens Vinculados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Itens e Materiais do Pedido
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setImportDialogOpen(true)}
                size="sm"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Tabela
              </Button>
              <Button onClick={handleAddItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OrderItemsTable items={orderItems} onDelete={handleDeleteItem} />
        </CardContent>
      </Card>

      <ImportTableDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportItems}
      />

      {/* Grid com Materiais Disponíveis e Sem Estoque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Materiais Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialsList materials={materiaisDisponiveis} variant="success" />
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-900">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Materiais Sem Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialsList materials={materiaisSemEstoque} variant="error" />
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3 justify-end pb-8">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button variant="default" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Pedido
        </Button>
        <Button onClick={handleSubmit}>
          <Send className="h-4 w-4 mr-2" />
          Enviar para Aprovação
        </Button>
      </div>
    </div>
  );
}