import { useShedStore } from '../store/shedStore';

const VisibilityMenu = () => {
  const shadedVisible = useShedStore((state) => state.shadedVisible);
  const wireframeVisible = useShedStore((state) => state.wireframeVisible);
  const toggleShadedVisible = useShedStore((state) => state.toggleShadedVisible);
  const setWireframeVisible = useShedStore((state) => state.setWireframeVisible);

  return (
    <section className="panel-section">
      <h2>Visibility</h2>
      <button type="button" onClick={toggleShadedVisible}>
        {shadedVisible ? 'Hide shaded panels' : 'Show shaded panels'}
      </button>
      <button type="button" onClick={() => setWireframeVisible(!wireframeVisible)}>
        {wireframeVisible ? 'Dim wireframe' : 'Emphasize wireframe'}
      </button>
      <p className="notice">Wireframe outlines are always present.</p>
    </section>
  );
};

export default VisibilityMenu;
