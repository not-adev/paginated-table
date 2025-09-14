// RowSelectionDialog.tsx
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';


type RowSelectionDialogProps = {
  visible: boolean;
  onHide: () => void;
  maxRows: number;
  selectedCount: number;
  onCountChange: (count: number) => void;
  onSelect: () => void;
};

function RowSelectionDialog({visible,onHide,selectedCount,onCountChange,onSelect,}: RowSelectionDialogProps) {
  return (
    <Dialog header="Select Rows" visible={visible} onHide={onHide}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>How many rows do you want to select?</label>
        <InputNumber
          value={selectedCount}
          onValueChange={(e) => onCountChange(e.value ?? 0)}
          min={1}
          showButtons
        />
        <Button
          label="Select"
          onClick={onSelect}
          disabled={selectedCount < 1 }
        />
      </div>
    </Dialog>
  );
}

export default RowSelectionDialog;