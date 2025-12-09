import { Badge } from "./ui/badge";
import { Material } from "./OrderForm";

interface MaterialsListProps {
  materials: Material[];
  variant: "success" | "error";
}

export function MaterialsList({ materials, variant }: MaterialsListProps) {
  return (
    <div className="space-y-2">
      {materials.length === 0 ? (
        <p className="text-slate-500 text-center py-4">
          Nenhum material {variant === "success" ? "disponível" : "sem estoque"}.
        </p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {materials.map((material) => (
            <div
              key={material.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                variant === "success"
                  ? "bg-white border-emerald-200 hover:border-emerald-300"
                  : "bg-white border-rose-200 hover:border-rose-300"
              } transition-colors`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Badge
                  variant="outline"
                  className={`shrink-0 ${
                    variant === "success"
                      ? "border-emerald-300 text-emerald-700"
                      : "border-rose-300 text-rose-700"
                  }`}
                >
                  {material.id}
                </Badge>
                <span
                  className={`truncate ${
                    variant === "success" ? "text-slate-900" : "text-slate-900"
                  }`}
                >
                  {material.nome}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
