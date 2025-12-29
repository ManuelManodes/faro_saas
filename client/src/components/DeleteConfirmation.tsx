import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    studentName: string;
    isLoading?: boolean;
}

export function DeleteConfirmation({
    isOpen,
    onClose,
    onConfirm,
    studentName,
    isLoading,
}: DeleteConfirmationProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-destructive/10 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Confirmar Eliminación</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Esta acción cambiará el estado del estudiante a RETIRADO
                            </p>
                        </div>
                    </div>

                    <p className="text-sm mb-6">
                        ¿Estás seguro de que deseas marcar como retirado al estudiante{' '}
                        <span className="font-semibold">{studentName}</span>?
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                'Confirmar Eliminación'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
