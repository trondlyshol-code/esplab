import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { BoardKind } from '../../types/board';
import { BOARD_KIND_LABELS } from '../../types/board';

const BOARD_DESCRIPTIONS: Partial<Record<BoardKind, string>> = {
  'arduino-uno': '8-bit AVR, 32KB flash, 14 digital I/O',
  esp32: 'Xtensa LX6 dual-core, WiFi+BT, 38 GPIO (QEMU)',
};

const BOARD_ICON: Partial<Record<BoardKind, string>> = {
  'arduino-uno': '⬤',
  esp32: '⬡',
};

interface BoardPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBoard: (kind: BoardKind) => void;
}

/**
 * ESP-Lab v1 deliberately exposes only the two boards used in the first
 * teaching release. Other Velxio boards remain in the codebase so they can
 * be enabled later without removing emulator support.
 */
const BOARDS: BoardKind[] = ['arduino-uno', 'esp32'];

export const BoardPickerModal = ({ isOpen, onClose, onSelectBoard }: BoardPickerModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--wb-2)',
          border: '1px solid var(--wb-7)',
          borderRadius: 8,
          padding: 24,
          minWidth: 380,
          maxWidth: 480,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: 'var(--wb-12)', margin: '0 0 6px 0', fontSize: 16 }}>
          {t('editor.boardPicker.title')}
        </h3>
        <div style={{ color: 'var(--wb-10)', fontSize: 12, marginBottom: 16 }}>
          ESP-Lab v1
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BOARDS.map((kind) => (
            <button
              key={kind}
              onClick={() => {
                onSelectBoard(kind);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: 'var(--wb-5)',
                border: '1px solid var(--wb-8)',
                borderRadius: 6,
                cursor: 'pointer',
                color: 'var(--wb-12)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--wb-7)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--wb-5)')}
            >
              <span
                style={{
                  fontSize: 20,
                  width: 28,
                  textAlign: 'center',
                  color: kind === 'esp32' ? '#e8a020' : '#4af',
                }}
              >
                {BOARD_ICON[kind]}
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{BOARD_KIND_LABELS[kind]}</div>
                <div style={{ fontSize: 11, color: 'var(--wb-10)', marginTop: 2 }}>
                  {BOARD_DESCRIPTIONS[kind]}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: '6px 14px',
            background: 'transparent',
            border: '1px solid var(--wb-8)',
            borderRadius: 4,
            color: 'var(--wb-10)',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Lukk
        </button>
      </div>
    </div>,
    document.body,
  );
};
