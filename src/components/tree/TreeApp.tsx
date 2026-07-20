"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { TreeScene } from "@/components/tree/TreeScene";
import { RightPanel, type ModalState } from "@/components/tree/RightPanel";
import { Toast } from "@/components/tree/Toast";
import { WelcomeModal } from "@/components/tree/WelcomeModal";
import { ExampleModal } from "@/components/tree/ExampleModal";
import { BRANCH_LIMIT } from "@/lib/tree/constants";
import type { ZoneKey } from "@/lib/tree/types";
import { useTreeStore } from "@/store/useTreeStore";

const WELCOME_SEEN_KEY = "tree_intro_seen_v1";

// The flag only ever changes via this tab's own click (closeWelcome), never
// externally, so there's nothing to subscribe to — just a snapshot read.
const noopSubscribe = () => () => {};
const getWelcomeSeenSnapshot = () => localStorage.getItem(WELCOME_SEEN_KEY) !== null;
// SSR has no localStorage; assume "seen" server-side so the modal never
// flashes into markup that then has to be corrected after hydration.
const getWelcomeSeenServerSnapshot = () => true;

interface TreeAppProps {
  userId: string | null;
  userEmail: string | null;
}

export function TreeApp({ userId, userEmail }: TreeAppProps) {
  const items = useTreeStore((s) => s.items);
  const hasHydrated = useTreeStore((s) => s.hasHydrated);
  const initForUser = useTreeStore((s) => s.initForUser);
  const clearUser = useTreeStore((s) => s.clearUser);
  const addRoot = useTreeStore((s) => s.addRoot);
  const addTrunkItem = useTreeStore((s) => s.addTrunkItem);
  const addBranch = useTreeStore((s) => s.addBranch);
  const addFruit = useTreeStore((s) => s.addFruit);
  const updateItemText = useTreeStore((s) => s.updateItemText);

  const [modal, setModal] = useState<ModalState | null>(null);
  const [inputText, setInputText] = useState("");
  const [branchLimitToast, setBranchLimitToast] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [exampleZone, setExampleZone] = useState<ZoneKey | null>(null);

  const welcomeSeen = useSyncExternalStore(
    noopSubscribe,
    getWelcomeSeenSnapshot,
    getWelcomeSeenServerSnapshot,
  );
  const showWelcome = !welcomeSeen && !welcomeDismissed;

  useEffect(() => {
    useTreeStore.persist.rehydrate();
  }, []);

  function closeWelcome() {
    localStorage.setItem(WELCOME_SEEN_KEY, "1");
    setWelcomeDismissed(true);
  }

  useEffect(() => {
    // Wait for local rehydration first — initForUser reads current `items`
    // to decide whether anonymous data needs migrating into the account,
    // and that read would race an in-flight localStorage rehydration otherwise.
    if (!hasHydrated) return;
    if (userId) {
      initForUser(userId);
    } else {
      clearUser();
    }
  }, [userId, hasHydrated, initForUser, clearUser]);

  useEffect(() => {
    if (!branchLimitToast) return;
    const t = setTimeout(() => setBranchLimitToast(false), 3500);
    return () => clearTimeout(t);
  }, [branchLimitToast]);

  function openAdd(zone: ZoneKey) {
    if (zone === "branches" && items.branches.length >= BRANCH_LIMIT) {
      setBranchLimitToast(true);
      return;
    }
    setModal({ zone, mode: "new" });
    setInputText("");
  }

  function openEdit(zone: ZoneKey, id: string, text: string) {
    setModal({ zone, mode: "edit", id });
    setInputText(text);
  }

  function handleSave() {
    if (!modal || !inputText.trim()) return;
    if (modal.mode === "new") {
      if (modal.zone === "roots") addRoot(inputText);
      else if (modal.zone === "trunk") addTrunkItem(inputText);
      else if (modal.zone === "branches") {
        if (!addBranch(inputText)) {
          setBranchLimitToast(true);
          setModal(null);
          setInputText("");
          return;
        }
      } else if (modal.zone === "crown") addFruit(inputText);
    } else if (modal.id) {
      updateItemText(modal.zone, modal.id, inputText);
    }
    setModal(null);
    setInputText("");
  }

  function handleCancel() {
    setModal(null);
    setInputText("");
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="z-[100] flex h-10 flex-shrink-0 items-center justify-center border-b border-white/[0.08] bg-[rgba(15,20,35,0.85)] backdrop-blur-md">
        <span className="font-serif text-sm tracking-[0.01em] text-white/70 italic">
          Опора — не ресурс, а ресурс — не цель
        </span>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <TreeScene
          onEditRoot={(item) => openEdit("roots", item.id, item.text)}
          onEditTrunk={(item) => openEdit("trunk", item.id, item.text)}
          onEditBranch={(item) => openEdit("branches", item.id, item.text)}
          onEditFruit={(item) => openEdit("crown", item.id, item.text)}
        />
        {branchLimitToast && (
          <Toast
            title="Сейчас 5 из 5"
            body="Удали одну ветку, чтобы добавить новую — фокус не должен размываться."
            onClose={() => setBranchLimitToast(false)}
          />
        )}
        <RightPanel
          items={items}
          modal={modal}
          inputText={inputText}
          userEmail={userEmail}
          onInputChange={setInputText}
          onOpenAdd={openAdd}
          onSave={handleSave}
          onCancel={handleCancel}
          onShowExample={setExampleZone}
        />
      </div>

      {showWelcome && <WelcomeModal onClose={closeWelcome} />}
      {exampleZone && <ExampleModal zone={exampleZone} onClose={() => setExampleZone(null)} />}
    </div>
  );
}
