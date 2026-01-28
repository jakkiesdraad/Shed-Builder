import StructureMenu from './StructureMenu';
import PanelsMenu from './PanelsMenu';
import OpeningsMenu from './OpeningsMenu';
import VisibilityMenu from './VisibilityMenu';

const SidePanel = () => (
  <aside className="side-panel">
    <div className="panel-section">
      <h2>3D Shed Configurator</h2>
      <p className="notice">
        Visual-only tool with a fixed camera and a rotating shed reference.
      </p>
    </div>
    <StructureMenu />
    <PanelsMenu />
    <OpeningsMenu />
    <VisibilityMenu />
  </aside>
);

export default SidePanel;
