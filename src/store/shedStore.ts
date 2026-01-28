import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type PanelType = 'front' | 'back' | 'left' | 'right' | 'roof';
export type PanelVisibility = 'visible' | 'hidden' | 'removed';
export type OpeningType = 'door' | 'window';

export interface PanelState {
  id: string;
  type: PanelType;
  visibility: PanelVisibility;
}

export interface OpeningState {
  id: string;
  panelId: string;
  type: OpeningType;
}

export interface ShedDimensions {
  width: number;
  depth: number;
  height: number;
  roofHeight: number;
}

interface ShedState {
  dimensions: ShedDimensions;
  panels: PanelState[];
  openings: OpeningState[];
  selectedId: string | null;
  hoveredId: string | null;
  shadedVisible: boolean;
  wireframeVisible: boolean;
  setDimensions: (dimensions: Partial<ShedDimensions>) => void;
  resetShed: () => void;
  setSelectedId: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
  toggleShadedVisible: () => void;
  setWireframeVisible: (visible: boolean) => void;
  setPanelVisibility: (panelId: string, visibility: PanelVisibility) => void;
  addPanel: (panelType: PanelType) => void;
  removePanel: (panelId: string) => void;
  addOpening: (panelId: string, type: OpeningType) => void;
  removeOpening: (openingId: string) => void;
}

let idCounter = 0;
const createId = (prefix: string) => `${prefix}-${idCounter++}`;

const createDefaultPanels = (): PanelState[] => (
  ['front', 'back', 'left', 'right', 'roof'] as PanelType[]
).map((type) => ({
  id: createId(`panel-${type}`),
  type,
  visibility: 'visible',
}));

const createInitialState = () => ({
  dimensions: {
    width: 3.2,
    depth: 2.6,
    height: 2.2,
    roofHeight: 0.3,
  },
  panels: createDefaultPanels(),
  openings: [],
  selectedId: null,
  hoveredId: null,
  shadedVisible: true,
  wireframeVisible: true,
});

export const useShedStore = create<ShedState>()(
  subscribeWithSelector((set, get) => ({
    ...createInitialState(),
    setDimensions: (dimensions) =>
      set((state) => ({
        dimensions: {
          ...state.dimensions,
          ...dimensions,
        },
      })),
    resetShed: () => {
      idCounter = 0;
      set(createInitialState());
    },
    setSelectedId: (id) => set({ selectedId: id }),
    setHoveredId: (id) => set({ hoveredId: id }),
    toggleShadedVisible: () =>
      set((state) => ({ shadedVisible: !state.shadedVisible })),
    setWireframeVisible: (visible) => set({ wireframeVisible: visible }),
    setPanelVisibility: (panelId, visibility) =>
      set((state) => ({
        panels: state.panels.map((panel) =>
          panel.id === panelId ? { ...panel, visibility } : panel
        ),
        openings:
          visibility === 'removed'
            ? state.openings.filter((opening) => opening.panelId !== panelId)
            : state.openings,
      })),
    addPanel: (panelType) =>
      set((state) => ({
        panels: state.panels.map((panel) =>
          panel.type === panelType
            ? { ...panel, visibility: 'visible' }
            : panel
        ),
      })),
    removePanel: (panelId) =>
      set((state) => ({
        panels: state.panels.map((panel) =>
          panel.id === panelId ? { ...panel, visibility: 'removed' } : panel
        ),
        openings: state.openings.filter((opening) => opening.panelId !== panelId),
      })),
    addOpening: (panelId, type) =>
      set((state) => {
        const panel = state.panels.find((item) => item.id === panelId);
        if (!panel || panel.type === 'roof') {
          return state;
        }
        return {
          openings: [
            ...state.openings,
            {
              id: createId(`opening-${type}`),
              panelId,
              type,
            },
          ],
        };
      }),
    removeOpening: (openingId) =>
      set((state) => ({
        openings: state.openings.filter((opening) => opening.id !== openingId),
      })),
  }))
);

export const getPanelById = (state: ShedState, panelId: string | null) =>
  panelId ? state.panels.find((panel) => panel.id === panelId) ?? null : null;

export const getOpeningById = (state: ShedState, openingId: string | null) =>
  openingId
    ? state.openings.find((opening) => opening.id === openingId) ?? null
    : null;
