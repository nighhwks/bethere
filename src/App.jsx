import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDER_TEXT = "ここに文字が表示されます";
const APP_FONT = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif";

const menuMotion = {
  initial: { opacity: 0, y: 10, scale: 0.985, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 8, scale: 0.985, filter: "blur(2px)" },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
};

const MODES = {
  standard: {
    label: "標準モード",
    description: "入力中の内容をそのまま反映します。",
    icon: UnlockIcon,
  },
  lock: {
    label: "ロックモード",
    description: "Enterで確定した内容だけを反映します。",
    icon: LockIcon,
  },
  doubleLock: {
    label: "二段階ロックモード",
    description: "Enterで確認し、もう一度Enterで反映します。",
    icon: ShieldCheckIcon,
  },
};

const ALIGNMENTS = [
  { value: "left", label: "左", icon: AlignLeftIcon },
  { value: "center", label: "中央", icon: AlignCenterIcon },
  { value: "right", label: "右", icon: AlignRightIcon },
];

const styles = {
  page: {
    position: "relative",
    width: "100vw",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#ffffff",
    color: "#09090b",
    fontFamily: APP_FONT,
  },
  displaySurface: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "96px 64px 176px",
    boxSizing: "border-box",
  },
  displayText: {
    width: "100%",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    lineHeight: 1.35,
    letterSpacing: "-0.025em",
  },
  header: {
    position: "fixed",
    top: 18,
    left: 24,
    right: 24,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    border: "1px solid #e4e4e7",
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.92)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(12px)",
  },
  title: {
    margin: 0,
    padding: "0 10px",
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 650,
    letterSpacing: "-0.04em",
    whiteSpace: "nowrap",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  controlWrap: {
    position: "relative",
  },
  topButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: "0 14px",
    border: "1px solid #e4e4e7",
    borderRadius: 999,
    background: "#fafafa",
    color: "#3f3f46",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  menuPanel: {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 30,
    width: 320,
    marginTop: 16,
    padding: 14,
    border: "1px solid #e4e4e7",
    borderRadius: 20,
    background: "#ffffff",
    color: "#18181b",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.16)",
    boxSizing: "border-box",
    transformOrigin: "top right",
  },
  modeList: {
    display: "grid",
    gap: 9,
  },
  modeButton: {
    width: "100%",
    padding: "13px 15px",
    borderRadius: 14,
    textAlign: "left",
    cursor: "pointer",
    transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
  },
  modeButtonTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 650,
  },
  modeDescription: {
    display: "block",
    marginTop: 5,
    fontSize: 12,
    lineHeight: 1.55,
  },
  fieldGroup: {
    display: "grid",
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 650,
    color: "#3f3f46",
  },
  alignmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  alignButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    padding: "0 12px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  inputPanel: {
    position: "fixed",
    left: 24,
    right: 24,
    bottom: 18,
    zIndex: 20,
    maxWidth: 1040,
    margin: "0 auto",
    padding: 12,
    border: "1px solid #e4e4e7",
    borderRadius: 22,
    background: "rgba(255, 255, 255, 0.92)",
    boxShadow: "0 18px 50px rgba(0, 0, 0, 0.12)",
    backdropFilter: "blur(12px)",
    boxSizing: "border-box",
  },
  inputHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "0 8px 10px",
  },
  inputLabel: {
    margin: 0,
    fontSize: 12,
    fontWeight: 650,
    lineHeight: 1.4,
    minHeight: 16,
    display: "flex",
    alignItems: "center",
    color: "#71717a",
  },
  waitingText: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#3f3f46",
  },
  privacyText: {
    margin: 0,
    maxWidth: 520,
    textAlign: "right",
    fontSize: 11,
    lineHeight: 1.4,
    letterSpacing: "-0.02em",
    fontKerning: "normal",
    color: "#a1a1aa",
    display: "flex",
    alignItems: "center",
    minHeight: 16,
  },
  textarea: {
    display: "block",
    width: "100%",
    minHeight: 112,
    resize: "none",
    padding: "13px 16px",
    border: "1px solid #e4e4e7",
    borderRadius: 14,
    background: "#fafafa",
    color: "#18181b",
    fontSize: 16,
    lineHeight: 1.7,
    outline: "none",
    boxSizing: "border-box",
  },
};

function IconBase({ children, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function LockIcon() {
  return (
    <IconBase>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </IconBase>
  );
}

function UnlockIcon() {
  return (
    <IconBase>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </IconBase>
  );
}

function ShieldCheckIcon() {
  return (
    <IconBase>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-5" />
    </IconBase>
  );
}

function AlignLeftIcon() {
  return (
    <IconBase>
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h14" />
    </IconBase>
  );
}

function AlignCenterIcon() {
  return (
    <IconBase>
      <path d="M4 6h16" />
      <path d="M8 12h8" />
      <path d="M6 18h12" />
    </IconBase>
  );
}

function AlignRightIcon() {
  return (
    <IconBase>
      <path d="M4 6h16" />
      <path d="M10 12h10" />
      <path d="M6 18h14" />
    </IconBase>
  );
}

function ResetIcon() {
  return (
    <IconBase>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </IconBase>
  );
}

function SettingsIcon() {
  return (
    <IconBase>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06A2 2 0 1 1 7.03 3.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.51 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.39.66.93 1 1.6 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
    </IconBase>
  );
}

function calculateFontSize(text) {
  const length = Array.from(String(text).trim() || PLACEHOLDER_TEXT).length;
  if (length <= 8) return 76;
  if (length <= 16) return 64;
  if (length <= 28) return 52;
  if (length <= 48) return 42;
  if (length <= 80) return 34;
  if (length <= 130) return 28;
  return 24;
}

function MenuPanel({ children }) {
  return (
    <motion.div {...menuMotion} style={styles.menuPanel}>
      {children}
    </motion.div>
  );
}

function DisplaySurface({ visibleText, fontSize, align }) {
  return (
    <section style={styles.displaySurface}>
      <motion.div
        key={`${visibleText}-${fontSize}-${align}`}
        initial={{ opacity: 0.88, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          ...styles.displayText,
          textAlign: align,
          fontFamily: APP_FONT,
          fontSize,
        }}
      >
        {visibleText}
      </motion.div>
    </section>
  );
}

export default function BeThereApp() {
  const [mode, setMode] = useState("standard");
  const [draft, setDraft] = useState("");
  const [pendingDraft, setPendingDraft] = useState(null);
  const [display, setDisplay] = useState(PLACEHOLDER_TEXT);
  const [align, setAlign] = useState("center");
  const [openMenu, setOpenMenu] = useState(null);

  const normalizedDraft = draft.trim() ? draft : PLACEHOLDER_TEXT;
  const visibleText = mode === "standard" ? normalizedDraft : display;
  const fontSize = useMemo(() => calculateFontSize(visibleText), [visibleText]);
  const ActiveIcon = MODES[mode].icon;
  const isWaitingForSecondEnter = mode === "doubleLock" && pendingDraft !== null && pendingDraft === draft;

  const commitDraftToDisplay = () => {
    setDisplay(normalizedDraft);
    setPendingDraft(null);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setPendingDraft(null);
    setOpenMenu(null);
    if (nextMode === "standard") {
      setDisplay(normalizedDraft);
    }
  };

  const handleDraftChange = (event) => {
    const nextDraft = event.target.value;
    setDraft(nextDraft);

    if (mode === "standard") {
      setDisplay(nextDraft.trim() ? nextDraft : PLACEHOLDER_TEXT);
    }

    if (mode === "doubleLock" && pendingDraft !== null && pendingDraft !== nextDraft) {
      setPendingDraft(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();

    if (mode === "standard" || mode === "lock") {
      commitDraftToDisplay();
      return;
    }

    if (pendingDraft === draft) {
      commitDraftToDisplay();
      return;
    }

    setPendingDraft(draft);
  };

  const resetAll = () => {
    setDraft("");
    setPendingDraft(null);
    setDisplay(PLACEHOLDER_TEXT);
  };

  const toggleMenu = (menuName) => {
    setOpenMenu((current) => (current === menuName ? null : menuName));
  };

  return (
    <main style={styles.page}>
      <style>{`
        html, body, #root {
          width: 100%;
          min-width: 0;
          min-height: 100%;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }

        body {
          display: block;
          place-items: initial;
          overflow-x: hidden;
        }

        #root {
          max-width: none;
          text-align: initial;
        }

        button, textarea, select {
          font: inherit;
        }
      `}</style>

      <DisplaySurface visibleText={visibleText} fontSize={fontSize} align={align} />

      <header style={styles.header}>
        <h1 style={styles.title}>Be there</h1>

        <div style={styles.controls}>
          <div style={styles.controlWrap}>
            <motion.button
              type="button"
              onClick={() => toggleMenu("mode")}
              style={styles.topButton}
              key={mode}
              initial={{ opacity: 0.75, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveIcon />
              <span>{MODES[mode].label}</span>
            </motion.button>

            <AnimatePresence>
              {openMenu === "mode" && (
                <MenuPanel>
                  <div style={styles.modeList}>
                    {Object.entries(MODES).map(([key, item]) => {
                      const Icon = item.icon;
                      const selected = mode === key;
                      return (
                        <motion.button
                          key={key}
                          type="button"
                          onClick={() => handleModeChange(key)}
                          whileTap={{ scale: 0.985 }}
                          transition={{ duration: 0.14 }}
                          style={{
                            ...styles.modeButton,
                            border: selected ? "1px solid #18181b" : "1px solid #e4e4e7",
                            background: selected ? "#18181b" : "#fafafa",
                            color: selected ? "#ffffff" : "#18181b",
                          }}
                        >
                          <span style={styles.modeButtonTitle}>
                            <Icon />
                            {item.label}
                          </span>
                          <span
                            style={{
                              ...styles.modeDescription,
                              color: selected ? "#d4d4d8" : "#71717a",
                            }}
                          >
                            {item.description}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </MenuPanel>
              )}
            </AnimatePresence>
          </div>

          <div style={styles.controlWrap}>
            <button type="button" onClick={() => toggleMenu("settings")} style={styles.topButton}>
              <SettingsIcon />
              <span>表示設定</span>
            </button>

            <AnimatePresence>
              {openMenu === "settings" && (
                <MenuPanel>
                  <div style={styles.fieldGroup}>
                    <label style={styles.fieldLabel}>文字揃え</label>
                    <div style={styles.alignmentGrid}>
                      {ALIGNMENTS.map(({ value, label, icon: Icon }) => {
                        const selected = align === value;
                        return (
                          <motion.button
                            key={value}
                            type="button"
                            onClick={() => setAlign(value)}
                            whileTap={{ scale: 0.985 }}
                            transition={{ duration: 0.14 }}
                            style={{
                              ...styles.alignButton,
                              background: selected ? "#18181b" : "#fafafa",
                              color: selected ? "#ffffff" : "#3f3f46",
                              border: selected ? "1px solid #18181b" : "1px solid #e4e4e7",
                            }}
                          >
                            <Icon />
                            {label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </MenuPanel>
              )}
            </AnimatePresence>
          </div>

          <button type="button" onClick={resetAll} style={styles.topButton}>
            <ResetIcon />
            <span>リセット</span>
          </button>
        </div>
      </header>

      <section style={styles.inputPanel}>
        <div style={styles.inputHeader}>
          <div>
            <p style={styles.inputLabel}>入力エリア</p>
            {isWaitingForSecondEnter && <p style={styles.waitingText}>確認待ちです。もう一度Enterで反映します。</p>}
          </div>
          <p style={styles.privacyText}>Be there上で入力された内容が、無断で収集されたり、送信されることは一切ありません。</p>
        </div>

        <textarea
          value={draft}
          onChange={handleDraftChange}
          onKeyDown={handleKeyDown}
          placeholder="ここに伝えたいことを入力"
          style={{ ...styles.textarea, fontFamily: APP_FONT }}
        />
      </section>
    </main>
  );
}
