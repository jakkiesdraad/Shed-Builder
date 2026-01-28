import { useMemo } from 'react';
import { getPanelById, PanelVisibility, PanelType, useShedStore } from '../store/shedStore';

const PANEL_LABELS: Record<PanelType, string> = {
  front: 'Front wall',
  back: 'Back wall',
  left: 'Left wall',
  right: 'Right wall',
  roof: 'Roof',
};

const nextVisibility = (visibility: PanelVisibility) =>
  visibility === 'visible' ? 'hidden' : 'visible';

const PanelsMenu = () => {
  const panels = useShedStore((state) => state.panels);
  const selectedId = useShedStore((state) => state.selectedId);
  const setSelectedId = useShedStore((state) => state.setSelectedId);
  const addPanel = useShedStore((state) => state.addPanel);
  const removePanel = useShedStore((state) => state.removePanel);
  const setPanelVisibility = useShedStore((state) => state.setPanelVisibility);

  const selectedPanel = useMemo(
    () => getPanelById(useShedStore.getState(), selectedId),
    [selectedId]
  );

  const panelOptions = panels.map((panel) => (
    <option key={panel.id} value={panel.id}>
      {PANEL_LABELS[panel.type]}
    </option>
  ));

  const activePanel = selectedPanel ?? panels[0];

  return (
    <section className="panel-section">
      <h2>Panels</h2>
      <select
        value={activePanel?.id ?? ''}
        onChange={(event) => setSelectedId(event.target.value)}
      >
        {panelOptions}
      </select>
      {activePanel && (
        <div className="label-row">
          <span>Status</span>
          <span className="badge">{activePanel.visibility}</span>
        </div>
      )}
      <div className="inline-controls">
        <button
          type="button"
          onClick={() => activePanel && addPanel(activePanel.type)}
        >
          Add panel
        </button>
        <button
          type="button"
          onClick={() => activePanel && removePanel(activePanel.id)}
        >
          Remove panel
        </button>
      </div>
      <button
        type="button"
        onClick={() =>
          activePanel &&
          setPanelVisibility(activePanel.id, nextVisibility(activePanel.visibility))
        }
      >
        {activePanel?.visibility === 'visible' ? 'Hide panel' : 'Show panel'}
      </button>
    </section>
  );
};

export default PanelsMenu;
