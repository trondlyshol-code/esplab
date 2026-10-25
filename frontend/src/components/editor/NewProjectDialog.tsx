/**
 * ESP-Lab V1 starter-template picker.
 *
 * The underlying emulator keeps broader board support, while the classroom UI
 * intentionally exposes only Arduino Uno and ESP32 DevKit V1.
 */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { BoardKind } from '../../types/board';
import { BOARD_KIND_LABELS } from '../../types/board';
import { useSimulatorStore, DEFAULT_BOARD_POSITION } from '../../store/useSimulatorStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useEditorStore } from '../../store/useEditorStore';
import { getLocaleFromPath, localizedPath } from '../../i18n/path';
import { loadExample } from '../../utils/loadExample';
import type { ExampleProject } from '../../data/examples';
import { ExampleThumbnail } from '../examples/ExampleThumbnail';
import { trackSelectBoard } from '../../utils/analytics';
import './NewProjectDialog.css';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BOARD_BLURBS: Record<string, string> = {
  'arduino-uno': 'Arduino Uno – simple and well suited for basic I/O',
  esp32: 'ESP32 DevKit V1 – GPIO, PWM, sensors, WiFi and Bluetooth',
};

const BOARD_BLURB_KEYS: Record<string, string> = {
  'arduino-uno': 'editor.newProject.arduinoDesc',
  esp32: 'editor.newProject.esp32Desc',
};

const PREFERRED_BLINK_EXAMPLE: Record<string, string> = {
  'arduino-uno': 'blink-led',
  esp32: 'esp32-blink-led',
};

function thumbStubFor(kind: string, label: string): ExampleProject {
  return {
    id: PREFERRED_BLINK_EXAMPLE[kind] ?? `starter-${kind}`,
    title: label,
    description: '',
    category: 'basics',
    difficulty: 'beginner',
    boardType: kind,
    code: '',
    components: [],
    wires: [],
  };
}

export function clearWorkspaceForStarter(): void {
  useProjectStore.getState().clearCurrentProject();

  const sim = useSimulatorStore.getState();
  sim.boards.forEach((board) => sim.stopBoard(board.id));
  sim.boards.map((board) => board.id).forEach((id) => sim.removeBoard(id));
  sim.setComponents([]);
  sim.setWires([]);

  const editor = useEditorStore.getState();
  Object.keys(editor.fileGroups).forEach((group) => editor.deleteFileGroup(group));
  editor.setActiveGroup('');
}

async function findBlinkExample(kind: string): Promise<ExampleProject | undefined> {
  const { exampleProjects } = await import('../../data/examples');
  const preferredId = PREFERRED_BLINK_EXAMPLE[kind];

  if (preferredId) {
    const preferred = exampleProjects.find((example) => example.id === preferredId);
    if (preferred) return preferred;
  }

  return exampleProjects.find(
    (example) =>
      !example.boards &&
      example.boardType === kind &&
      /blink/i.test(`${example.id} ${example.title}`),
  );
}

async function applyStarter(kind: string | 'blank'): Promise<void> {
  clearWorkspaceForStarter();

  if (kind !== 'blank') {
    let example: ExampleProject | undefined;
    try {
      example = await findBlinkExample(kind);
    } catch {
      example = undefined;
    }

    if (example) {
      await loadExample(example);
    } else {
      const simulator = useSimulatorStore.getState();
      const boardId = simulator.addBoard(
        kind as BoardKind,
        DEFAULT_BOARD_POSITION.x,
        DEFAULT_BOARD_POSITION.y,
      );
      simulator.setActiveBoardId(boardId);
    }
  }

  const locale = getLocaleFromPath(window.location.pathname);
  const editorPath = localizedPath('/editor', locale);
  if (window.location.pathname !== editorPath) {
    window.history.replaceState(null, '', editorPath);
  }
}

export interface StarterSection {
  title: string;
  entries: Array<{ kind: string; blurb: string }>;
}

/**
 * Kept as an exported helper for compatibility with the upstream component,
 * but ESP-Lab V1 only offers the two classroom boards.
 */
export function buildStarterSections(_defs: unknown[] = []): StarterSection[] {
  return [
    {
      title: 'Arduino',
      entries: [{ kind: 'arduino-uno', blurb: BOARD_BLURBS['arduino-uno'] }],
    },
    {
      title: 'ESP32',
      entries: [{ kind: 'esp32', blurb: BOARD_BLURBS.esp32 }],
    },
  ];
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const sections = buildStarterSections();

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (kind: string | 'blank') => {
    if (kind !== 'blank') trackSelectBoard(kind);
    onClose();

    applyStarter(kind).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn('[editor] starter template failed to load:', error);
    });
  };

  return createPortal(
    <div className="new-project-overlay" onClick={onClose}>
      <div
        className="new-project-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="new-project-head">
          <h3 className="new-project-title">{t('editor.newProject.title')}</h3>
          <p className="new-project-sub">{t('editor.newProject.subtitle')}</p>
        </div>

        <div className="new-project-body">
          <div className="new-project-grid">
            <button
              className="new-project-card new-project-card-blank"
              onClick={() => handleSelect('blank')}
            >
              <span className="new-project-card-thumb new-project-card-thumb-blank">+</span>
              <span className="new-project-card-info">
                <span className="new-project-card-name">
                  {t('editor.newProject.blankTitle')}
                </span>
                <span className="new-project-card-desc">
                  {t('editor.newProject.blankDesc')}
                </span>
              </span>
            </button>
          </div>

          {sections.map((section) => (
            <React.Fragment key={section.title}>
              <div className="new-project-section-title">{section.title}</div>
              <div className="new-project-grid">
                {section.entries.map(({ kind, blurb }) => {
                  const label = BOARD_KIND_LABELS[kind as BoardKind] ?? kind;
                  const blurbKey = BOARD_BLURB_KEYS[kind];
                  const localizedBlurb = blurbKey
                    ? t(blurbKey, { defaultValue: blurb })
                    : blurb;

                  return (
                    <button
                      key={kind}
                      className="new-project-card"
                      onClick={() => handleSelect(kind)}
                    >
                      <span className="new-project-card-thumb">
                        <ExampleThumbnail
                          example={thumbStubFor(kind, label)}
                          width={300}
                          height={180}
                        />
                      </span>
                      <span className="new-project-card-info">
                        <span className="new-project-card-name">{label}</span>
                        <span className="new-project-card-desc">{localizedBlurb}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="new-project-foot">
          <button className="new-project-cancel" onClick={onClose}>
            {t('editor.newProject.cancel')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
