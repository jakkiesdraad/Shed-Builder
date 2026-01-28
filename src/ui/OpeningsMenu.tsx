import { useMemo, useState } from 'react';
import {
  getOpeningById,
  getPanelById,
  OpeningState,
  useShedStore,
} from '../store/shedStore';

const OpeningsMenu = () => {
  const openings = useShedStore((state) => state.openings);
  const selectedId = useShedStore((state) => state.selectedId);
  const addOpening = useShedStore((state) => state.addOpening);
  const removeOpening = useShedStore((state) => state.removeOpening);

  const [selectedOpeningId, setSelectedOpeningId] = useState<string>('');

  const selectedPanel = useMemo(
    () => getPanelById(useShedStore.getState(), selectedId),
    [selectedId]
  );

  const selectedOpening = useMemo(
    () => getOpeningById(useShedStore.getState(), selectedId),
    [selectedId]
  );

  const openingOptions = openings.map((opening: OpeningState) => (
    <option key={opening.id} value={opening.id}>
      {opening.type} ({opening.id})
    </option>
  ));

  const activeOpeningId = selectedOpening?.id ?? selectedOpeningId;

  return (
    <section className="panel-section">
      <h2>Openings</h2>
      <p className="notice">Doors and windows can only be placed on wall panels.</p>
      <div className="inline-controls">
        <button
          type="button"
          onClick={() => selectedPanel && addOpening(selectedPanel.id, 'door')}
          disabled={!selectedPanel || selectedPanel.type === 'roof'}
        >
          Add door
        </button>
        <button
          type="button"
          onClick={() => selectedPanel && addOpening(selectedPanel.id, 'window')}
          disabled={!selectedPanel || selectedPanel.type === 'roof'}
        >
          Add window
        </button>
      </div>
      <select
        value={activeOpeningId}
        onChange={(event) => setSelectedOpeningId(event.target.value)}
      >
        <option value="">Select opening</option>
        {openingOptions}
      </select>
      <button
        type="button"
        onClick={() => activeOpeningId && removeOpening(activeOpeningId)}
        disabled={!activeOpeningId}
      >
        Remove opening
      </button>
      <div className="label-row">
        <span>Total openings</span>
        <span className="badge">{openings.length}</span>
      </div>
    </section>
  );
};

export default OpeningsMenu;
