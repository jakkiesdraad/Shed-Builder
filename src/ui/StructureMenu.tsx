import { useShedStore } from '../store/shedStore';

const StructureMenu = () => {
  const dimensions = useShedStore((state) => state.dimensions);
  const setDimensions = useShedStore((state) => state.setDimensions);
  const resetShed = useShedStore((state) => state.resetShed);

  return (
    <section className="panel-section">
      <h2>Structure</h2>
      <button type="button" onClick={resetShed}>
        Reset shed
      </button>
      <div className="label-row">
        <span>Width (m)</span>
        <span>{dimensions.width.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={2}
        max={6}
        step={0.1}
        value={dimensions.width}
        onChange={(event) =>
          setDimensions({ width: Number(event.target.value) })
        }
      />
      <div className="label-row">
        <span>Depth (m)</span>
        <span>{dimensions.depth.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={2}
        max={6}
        step={0.1}
        value={dimensions.depth}
        onChange={(event) =>
          setDimensions({ depth: Number(event.target.value) })
        }
      />
      <div className="label-row">
        <span>Wall height (m)</span>
        <span>{dimensions.height.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={2}
        max={4}
        step={0.1}
        value={dimensions.height}
        onChange={(event) =>
          setDimensions({ height: Number(event.target.value) })
        }
      />
      <div className="label-row">
        <span>Roof thickness (m)</span>
        <span>{dimensions.roofHeight.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={0.2}
        max={1}
        step={0.1}
        value={dimensions.roofHeight}
        onChange={(event) =>
          setDimensions({ roofHeight: Number(event.target.value) })
        }
      />
    </section>
  );
};

export default StructureMenu;
