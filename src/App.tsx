import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Navbar } from './components/common/Navbar';
import { SearchModal } from './components/common/SearchModal';
import { FloatingNotesButton } from './components/common/FloatingNotesButton';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingModal } from './components/common/OnboardingModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ExitConfirmModal } from './components/common/ExitConfirmModal';
import { CategoryExplorer } from './components/views/CategoryExplorer';
import { FavoritesView } from './components/views/FavoritesView';
import { NotesView } from './components/views/NotesView';
import { ToolDispatcher } from './components/tools/ToolDispatcher';
import { GameZone } from './components/tools/GameZone';
import { CategoryId, ToolItem } from './types';
import { TOOLS, CATEGORIES } from './data/toolsRegistry';
import { getStoredFavorites, saveStoredFavorites, getStoredRecents, addStoredRecent } from './utils/storage';
import { sounds } from './utils/audio';
import { ArrowLeft, Trophy, Gift, BarChart3 } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { admobService } from './services/admobService';
import { AdMobBanner } from './components/ads/AdMobBanner';
import { AdMobInterstitialModal } from './components/ads/AdMobInterstitialModal';
import { AdMobRewardedModal } from './components/ads/AdMobRewardedModal';
import { AdMobPerformanceModal } from './components/ads/AdMobPerformanceModal';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const toolId = params.get('tool');
        if (toolId) {
          const found = TOOLS.find(t => t.id === toolId);
          if (found) return found;
        }
      } catch {}
    }
    return null;
  });
  const [toolSessionId, setToolSessionId] = useState<number>(() => Date.now());
  const [lastOpenedToolId, setLastOpenedToolId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('omni_last_tool') || null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && ['categories', 'favorites', 'notes', 'games'].includes(tab)) {
          return tab;
        }
      } catch {}
    }
    return 'categories';
  });
  const [toolReturnTab, setToolReturnTab] = useState<string>('categories');
  const [starredSelectedToolId, setStarredSelectedToolId] = useState<string | null>(null);
  const [toolFilter, setToolFilter] = useState<'all' | 'offline' | 'online'>('all');
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);
  const [recents, setRecents] = useState<string[]>(getStoredRecents);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [navbarSearchQuery, setNavbarSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [savedScrollPos, setSavedScrollPos] = useState<number>(0);
  const savedScrollPosRef = useRef<number>(0);

  // Return origin tracker: remembers exactly where user came from (tab, scrollY, search state & query, and suite)
  interface ToolReturnOrigin {
    tab: string;
    scrollY: number;
    fromSearch: boolean;
    searchQuery: string;
    searchMode: 'navbar' | 'modal' | 'none';
    selectedCategoryId?: CategoryId;
    tier?: 'all' | 'basic' | 'pro';
  }
  const [toolReturnOrigin, setToolReturnOrigin] = useState<ToolReturnOrigin | null>(null);
  const toolReturnOriginRef = useRef<ToolReturnOrigin | null>(null);
  toolReturnOriginRef.current = toolReturnOrigin;

  // Active suite filter: 'all' | 'basic' | 'pro' (persisted so entering a tool returns to the suite)
  const [tierFilter, setTierFilter] = useState<'all' | 'basic' | 'pro'>('all');
  const tierFilterRef = useRef<'all' | 'basic' | 'pro'>('all');
  tierFilterRef.current = tierFilter;

  // Set browser scroll restoration to manual so mobile browsers do not force scroll to top on back
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {}
    }
  }, []);

  // Continuous real-time scroll tracking for the overview screen (when no tool is active)
  const overviewScrollRef = useRef<number>(0);
  useEffect(() => {
    const handleOverviewScroll = () => {
      if (!activeToolRef.current) {
        overviewScrollRef.current = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      }
    };
    window.addEventListener('scroll', handleOverviewScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleOverviewScroll);
  }, []);

  // Pending scroll restoration target queue
  const pendingRestoreScrollRef = useRef<{ scrollY: number; toolId?: string | null } | null>(null);

  // Expanded sub-overlays & animation state
  const [isNavbarSearchOpen, setIsNavbarSearchOpen] = useState(false);
  const [closeNavbarSearchTrigger, setCloseNavbarSearchTrigger] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [closeDrawerTrigger, setCloseDrawerTrigger] = useState(0);
  const [isFABExpanded, setIsFABExpanded] = useState(false);
  const [closeFABTrigger, setCloseFABTrigger] = useState(0);
  const [isReturningFromTool, setIsReturningFromTool] = useState(false);
  const isTransitioningRef = useRef(false);

  // Rock-Solid Instant Scroll Restoration on Tool Exit:
  // Runs synchronously in useLayoutEffect before the browser paints frame 0,
  // ensuring the overview is ALREADY at the user's exact scroll position with zero jump or trip to top!
  useLayoutEffect(() => {
    if (!activeTool && pendingRestoreScrollRef.current) {
      const { scrollY, toolId } = pendingRestoreScrollRef.current;

      const performRestore = () => {
        const html = document.documentElement;
        const body = document.body;
        html.style.scrollBehavior = 'auto';
        body.style.scrollBehavior = 'auto';

        if (scrollY > 0) {
          window.scrollTo({ top: scrollY, behavior: 'instant' });
          html.scrollTop = scrollY;
          body.scrollTop = scrollY;
        }

        // Secondary guarantee: if tool card exists in DOM and scroll was slightly offset, align tool card
        if (toolId && (scrollY === 0 || Math.abs((window.scrollY || 0) - scrollY) > 80)) {
          const cardEl = document.getElementById(`tool-card-${toolId}`);
          if (cardEl) {
            cardEl.scrollIntoView({ block: 'center', behavior: 'instant' });
          }
        }
      };

      // 1. Synchronously before initial paint
      performRestore();

      // 2. Next animation frames to confirm layout stability
      const raf1 = requestAnimationFrame(() => {
        performRestore();
        const raf2 = requestAnimationFrame(() => {
          performRestore();
          pendingRestoreScrollRef.current = null;
        });
        return () => cancelAnimationFrame(raf2);
      });

      return () => cancelAnimationFrame(raf1);
    }
  }, [activeTool]);

  // Splash Screen & Professional Onboarding
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);

  // Google AdMob Test Ads Integration & Inspector
  const [isAdMobPerformanceOpen, setIsAdMobPerformanceOpen] = useState<boolean>(false);
  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(false);
  const [showRewardedAd, setShowRewardedAd] = useState<boolean>(false);
  const [rewardedRewardDetails, setRewardedRewardDetails] = useState<{ type: string; amount: number }>({
    type: 'Arcade Perk',
    amount: 1,
  });
  const toolExitCountRef = useRef<number>(0);

  useEffect(() => {
    admobService.initialize();

    const unsubModals = admobService.subscribeModalState((state) => {
      setShowInterstitialAd(state.showInterstitial);
      setShowRewardedAd(state.showRewarded);
      if (state.rewardedReward) {
        setRewardedRewardDetails(state.rewardedReward);
      }
    });

    return () => unsubModals();
  }, []);

  const handleFinishSplash = React.useCallback(() => {
    setShowSplash(false);
    try {
      const onboarded = localStorage.getItem('omni_onboarded');
      if (!onboarded) {
        setShowOnboarding(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // In the beginning of the app keep all categories collapsed; expand when user clicks
  const [expandedCatIds, setExpandedCatIds] = useState<Set<CategoryId>>(() => {
    return new Set<CategoryId>();
  });

  const handleToggleCategory = (catId: CategoryId) => {
    sounds.playClick();
    setExpandedCatIds(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    sounds.playClick();
    setExpandedCatIds(new Set(CATEGORIES.map(c => c.id)));
  };

  const handleCollapseAll = () => {
    sounds.playClick();
    setExpandedCatIds(new Set());
  };

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('omni_theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return false;
      }
    }
    return false;
  });

  // Synchronize state in refs for backButton and gesture handlers to guarantee freshness
  const activeToolRef = useRef<ToolItem | null>(activeTool);
  activeToolRef.current = activeTool;

  const activeTabRef = useRef<string>(activeTab);
  activeTabRef.current = activeTab;

  const isSearchOpenRef = useRef<boolean>(isSearchOpen);
  isSearchOpenRef.current = isSearchOpen;

  const isNavbarSearchOpenRef = useRef<boolean>(isNavbarSearchOpen);
  isNavbarSearchOpenRef.current = isNavbarSearchOpen;

  const navbarSearchQueryRef = useRef<string>(navbarSearchQuery);
  navbarSearchQueryRef.current = navbarSearchQuery;

  const modalSearchQueryRef = useRef<string>(modalSearchQuery);
  modalSearchQueryRef.current = modalSearchQuery;

  const toolFilterRef = useRef<string>(toolFilter);
  toolFilterRef.current = toolFilter;

  const isDrawerOpenRef = useRef<boolean>(isDrawerOpen);
  isDrawerOpenRef.current = isDrawerOpen;

  const isFABExpandedRef = useRef<boolean>(isFABExpanded);
  isFABExpandedRef.current = isFABExpanded;

  const showOnboardingRef = useRef<boolean>(showOnboarding);
  showOnboardingRef.current = showOnboarding;

  const showExitDialogRef = useRef<boolean>(showExitDialog);
  showExitDialogRef.current = showExitDialog;

  const toolReturnTabRef = useRef<string>(toolReturnTab);
  toolReturnTabRef.current = toolReturnTab;

  // Navigation guard refs to completely prevent exit alert when returning from tools or tabs
  const justNavigatedToHomeRef = useRef<boolean>(false);
  const lastBackActionTimeRef = useRef<number>(0);

  // Apply dark mode class and sync Capacitor StatusBar natively
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('omni_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('omni_theme', 'light');
      }
    } catch {}

    if (Capacitor.isNativePlatform()) {
      try {
        StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light });
        StatusBar.setBackgroundColor({ color: darkMode ? '#09090b' : '#ffffff' });
        StatusBar.setOverlaysWebView({ overlay: false });
      } catch {
        // ignore
      }
    }
  }, [darkMode]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for search, Cmd+J for notes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        sounds.playClick();
        if (activeTab === 'notes') {
          setActiveTab('categories');
        } else {
          setActiveTab('notes');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // If user selected something and touched anywhere of the app, the selection vanishes immediately
  useEffect(() => {
    const handleGlobalDeselect = (e: MouseEvent | TouchEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      selection.removeAllRanges();
    };

    window.addEventListener('pointerdown', handleGlobalDeselect, { passive: true });
    window.addEventListener('touchstart', handleGlobalDeselect, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGlobalDeselect);
      window.removeEventListener('touchstart', handleGlobalDeselect);
    };
  }, []);

  // Initialize root and home history entries so Android system back won't immediately exit app
  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.__omniApp) {
        window.history.replaceState({ __omniApp: true, level: 'root' }, '');
        window.history.pushState({ __omniApp: true, level: 'home' }, '');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectTool = (
    tool: ToolItem,
    originMeta?: { fromSearch?: boolean; searchQuery?: string; searchMode?: 'navbar' | 'modal'; categoryId?: CategoryId }
  ) => {
    sounds.playClick();
    // Immediately close any search dropdown or modal so the opened tool is displayed cleanly without suggestions
    setIsNavbarSearchOpen(false);
    setIsSearchOpen(false);
    setCloseNavbarSearchTrigger(prev => prev + 1);
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;

    // Record current scroll position with maximum precision across all devices
    const currentY = Math.max(
      window.scrollY || 0,
      document.documentElement.scrollTop || 0,
      window.pageYOffset || 0,
      overviewScrollRef.current || 0
    );
    savedScrollPosRef.current = currentY;
    setSavedScrollPos(currentY);

    // Save origin location: active tab, scroll position, search query & mode
    const sourceTab = activeTab;
    setToolReturnTab(sourceTab);

    const origin: ToolReturnOrigin = {
      tab: sourceTab,
      scrollY: currentY,
      fromSearch: !!originMeta?.fromSearch,
      searchQuery: originMeta?.searchQuery || (originMeta?.searchMode === 'navbar' ? navbarSearchQuery : originMeta?.searchMode === 'modal' ? modalSearchQuery : ''),
      searchMode: originMeta?.searchMode || (originMeta?.fromSearch ? 'navbar' : 'none'),
      selectedCategoryId: originMeta?.categoryId || tool.categoryId,
      tier: tierFilterRef.current,
    };
    setToolReturnOrigin(origin);
    toolReturnOriginRef.current = origin;

    setLastOpenedToolId(tool.id);
    try {
      localStorage.setItem('omni_last_tool', tool.id);
    } catch {
      // ignore
    }
    setActiveTool(tool);
    addStoredRecent(tool.id);
    setRecents(getStoredRecents());
    try {
      window.history.pushState(
        { __omniApp: true, level: 'tool', toolId: tool.id, returnTab: sourceTab, origin },
        '',
        `?tool=${tool.id}`
      );
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToOverview = (pushState: boolean = true, overrideTab?: string) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    justNavigatedToHomeRef.current = true;
    lastBackActionTimeRef.current = Date.now();

    const closedToolId = activeToolRef.current?.id || lastOpenedToolId;
    if (closedToolId) {
      setLastOpenedToolId(closedToolId);
      const closedTool = TOOLS.find(t => t.id === closedToolId);
      if (closedTool) {
        setExpandedCatIds(prev => new Set([...prev, closedTool.categoryId]));
      }
    }

    // Capture target scroll, tab, and suite from origin
    const origin = toolReturnOriginRef.current;
    const targetPos = (origin && typeof origin.scrollY === 'number' && origin.scrollY >= 0)
      ? origin.scrollY
      : (overviewScrollRef.current > 0 ? overviewScrollRef.current : savedScrollPosRef.current);

    // Restore suite (Basic or Pro) if user came from a suite
    if (origin?.tier) {
      setTierFilter(origin.tier);
      tierFilterRef.current = origin.tier;
    }

    let finalTab = 'categories';
    if (overrideTab) {
      finalTab = overrideTab;
      setActiveTab(overrideTab);
      activeTabRef.current = overrideTab;
      setStarredSelectedToolId(null);
    } else {
      finalTab = origin?.tab || toolReturnTabRef.current || 'categories';
      setActiveTab(finalTab);
      activeTabRef.current = finalTab;
      if (finalTab === 'favorites') {
        setStarredSelectedToolId(closedToolId || null);
      } else {
        setStarredSelectedToolId(null);
      }
    }

    // Always reset any open search popups or dropdowns cleanly
    setIsNavbarSearchOpen(false);
    isNavbarSearchOpenRef.current = false;
    setNavbarSearchQuery('');
    navbarSearchQueryRef.current = '';
    setIsSearchOpen(false);
    isSearchOpenRef.current = false;
    setModalSearchQuery('');
    modalSearchQueryRef.current = '';
    setCloseNavbarSearchTrigger(prev => prev + 1);
    (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;

    if (pushState) {
      try {
        window.history.pushState(
          {
            __omniApp: true,
            level: finalTab === 'categories' ? 'home' : 'tab',
            tab: finalTab,
          },
          '',
          finalTab === 'categories' ? '/' : `?tab=${finalTab}`
        );
      } catch {
        // ignore
      }
    }

    // Set pending scroll restoration target so useLayoutEffect restores it before paint!
    pendingRestoreScrollRef.current = {
      scrollY: targetPos,
      toolId: closedToolId,
    };

    // Immediately close the active tool and trigger the exact entering animation on the destination view
    setActiveTool(null);
    activeToolRef.current = null;
    setIsReturningFromTool(true);

    // Natural non-annoying AdMob Interstitial check:
    // Every 4 tool visits, checks frequency cap (min 3 mins interval) after return transition completes
    toolExitCountRef.current += 1;
    if (toolExitCountRef.current % 4 === 0) {
      setTimeout(() => {
        admobService.showInterstitial({ force: false, context: 'Natural tool exit' });
      }, 450);
    }

    setTimeout(() => {
      setIsReturningFromTool(false);
      isTransitioningRef.current = false;
    }, 220);

    setTimeout(() => {
      justNavigatedToHomeRef.current = false;
    }, 1500);
  };

  const replenishHistoryBuffer = (level: string, tab: string = 'categories') => {
    try {
      window.history.pushState(
        { __omniApp: true, level, tab },
        '',
        tab === 'categories' ? '/' : `?tab=${tab}`
      );
    } catch {
      // ignore
    }
  };

  const handleGoHome = (pushState: boolean = true) => {
    sounds.playClick();
    if (activeToolRef.current) {
      handleBackToOverview(pushState);
      return;
    }
    isTransitioningRef.current = true;
    justNavigatedToHomeRef.current = true;
    lastBackActionTimeRef.current = Date.now();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 350);
    setTimeout(() => {
      justNavigatedToHomeRef.current = false;
    }, 1500);

    setActiveTool(null);
    activeToolRef.current = null;
    setStarredSelectedToolId(null);
    setActiveTab('categories');
    activeTabRef.current = 'categories';
    setToolReturnTab('categories');
    toolReturnTabRef.current = 'categories';
    setToolFilter('all');
    toolFilterRef.current = 'all';
    setTierFilter('all');
    tierFilterRef.current = 'all';
    try {
      if (pushState) {
        window.history.pushState({ __omniApp: true, level: 'home', tab: 'categories' }, '', '/');
      } else {
        window.history.replaceState({ __omniApp: true, level: 'home', tab: 'categories' }, '', '/');
      }
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Unified Step-by-Step Back Handler:
  // 1. If Exit Dialog is open: close it
  // 2. If Onboarding is open: close it
  // 3. If a tool is open: animate tool slide-out and return to origin (search suggestions, starred, home, etc.), DO NOT EXIT!
  // 4. If FAB menu is open: close it
  // 5. If Search Suggestions or Search Bar is active: close suggestions bar ONLY, remain on current screen! DO NOT EXIT!
  // 6. If Navigation Drawer is open: close drawer ONLY, remain on current screen! DO NOT EXIT!
  // 7. If on any sub-tab or filtered view (Starred, Notes, Games, Online/Offline filter): return to Home screen from everywhere! DO NOT EXIT!
  // 8. If ON HOME SCREEN with clean state: ONLY HERE show the exit confirmation dialogue!
  const handleBackAction = (viaHistoryPop: boolean = false) => {
    const now = Date.now();
    if (isTransitioningRef.current || now - lastBackActionTimeRef.current < 250) {
      if (viaHistoryPop) replenishHistoryBuffer('home', activeTabRef.current);
      return;
    }
    lastBackActionTimeRef.current = now;

    // 1. If Exit Dialog is open: close it
    if (showExitDialogRef.current) {
      setShowExitDialog(false);
      showExitDialogRef.current = false;
      if (viaHistoryPop) replenishHistoryBuffer('home', 'categories');
      return;
    }

    // 2. If Onboarding is open: close it
    if (showOnboardingRef.current) {
      setShowOnboarding(false);
      showOnboardingRef.current = false;
      if (viaHistoryPop) replenishHistoryBuffer('home', activeTabRef.current);
      return;
    }

    // 3. A tool is currently active -> Close tool and return!
    if (activeToolRef.current) {
      sounds.playClick();
      const origin = toolReturnOriginRef.current;
      const targetTab = origin?.tab || toolReturnTabRef.current || 'categories';
      handleBackToOverview(false);
      if (viaHistoryPop) {
        replenishHistoryBuffer(targetTab === 'categories' ? 'home' : 'tab', targetTab);
      }
      return;
    }

    // 4. If FAB menu is open: close it
    if (isFABExpandedRef.current) {
      sounds.playClick();
      setIsFABExpanded(false);
      isFABExpandedRef.current = false;
      setCloseFABTrigger(prev => prev + 1);
      if (viaHistoryPop) replenishHistoryBuffer('home', activeTabRef.current);
      return;
    }

    // 5. If Search Suggestions or Search is active (modal, navbar, or query present):
    // Closes suggestion bar, clears search query, blurs search input, remains on current page! DO NOT QUIT!
    const isSearchActive =
      isSearchOpenRef.current ||
      isNavbarSearchOpenRef.current ||
      Boolean(navbarSearchQueryRef.current && navbarSearchQueryRef.current.trim()) ||
      Boolean(modalSearchQueryRef.current && modalSearchQueryRef.current.trim()) ||
      Boolean((window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen);

    if (isSearchActive) {
      sounds.playClick();
      setIsSearchOpen(false);
      isSearchOpenRef.current = false;
      setIsNavbarSearchOpen(false);
      isNavbarSearchOpenRef.current = false;
      setNavbarSearchQuery('');
      navbarSearchQueryRef.current = '';
      setModalSearchQuery('');
      modalSearchQueryRef.current = '';
      setCloseNavbarSearchTrigger(prev => prev + 1);
      (window as unknown as { __omniSearchOpen?: boolean }).__omniSearchOpen = false;
      justNavigatedToHomeRef.current = true;
      setTimeout(() => { justNavigatedToHomeRef.current = false; }, 1200);
      isTransitioningRef.current = true;
      setTimeout(() => { isTransitioningRef.current = false; }, 300);
      replenishHistoryBuffer(
        activeTabRef.current === 'categories' ? 'home' : 'tab',
        activeTabRef.current
      );
      return;
    }

    // 6. If Navigation Drawer is open: close drawer ONLY!
    if (isDrawerOpenRef.current) {
      sounds.playClick();
      setIsDrawerOpen(false);
      isDrawerOpenRef.current = false;
      setCloseDrawerTrigger(prev => prev + 1);
      isTransitioningRef.current = true;
      setTimeout(() => { isTransitioningRef.current = false; }, 300);
      replenishHistoryBuffer(
        activeTabRef.current === 'categories' ? 'home' : 'tab',
        activeTabRef.current
      );
      return;
    }

    // 7. Sub-tab / Sub-page is open (Starred, Notes, Games, filter, or suite) -> Return to Home screen from everywhere!
    if (activeTabRef.current !== 'categories' || toolFilterRef.current !== 'all' || tierFilterRef.current !== 'all') {
      sounds.playClick();
      if (tierFilterRef.current !== 'all') {
        setTierFilter('all');
        tierFilterRef.current = 'all';
        replenishHistoryBuffer('home', 'categories');
        return;
      }
      handleGoHome(false);
      setToolFilter('all');
      toolFilterRef.current = 'all';
      replenishHistoryBuffer('home', 'categories');
      return;
    }

    // 8. User is on home screen:
    // If the app JUST arrived at home within the safety window, DO NOT show exit alert!
    if (justNavigatedToHomeRef.current) {
      if (viaHistoryPop) {
        replenishHistoryBuffer('home', 'categories');
      }
      return;
    }

    // ONLY SHOW EXIT ALERT when user is already settled on the clean home screen!
    sounds.playClick();
    setShowExitDialog(true);
    showExitDialogRef.current = true;
    if (viaHistoryPop) {
      replenishHistoryBuffer('home', 'categories');
    }
  };

  // Browser back button / popstate handler
  useEffect(() => {
    const handlePopState = () => {
      handleBackAction(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Native Android & Capacitor Back Button Listener
  useEffect(() => {
    let removeListener: (() => void) | null = null;

    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', () => {
        handleBackAction(false);
      }).then(handle => {
        removeListener = () => handle.remove();
      }).catch(() => {});
    }

    const handleNativeBack = (e: Event) => {
      e.preventDefault();
      handleBackAction(false);
    };

    document.addEventListener('backbutton', handleNativeBack);
    window.addEventListener('ionBackButton', handleNativeBack);

    return () => {
      if (removeListener) removeListener();
      document.removeEventListener('backbutton', handleNativeBack);
      window.removeEventListener('ionBackButton', handleNativeBack);
    };
  }, []);

  // Universal Edge Slide Gesture (swiping back from left or right screen edge):
  // When in a tool: returns to home/overview
  // When in another tab: returns to home
  // When on home screen: shows the exit confirmation dialogue!
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isIgnoredTarget = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      const touchX = e.touches[0].clientX;
      const isEdgeZone = touchX <= 65 || touchX >= window.innerWidth - 65;

      // Only ignore touch if inside an active editable input field (not when swiping from edge)
      if (
        !isEdgeZone &&
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea'))
      ) {
        isIgnoredTarget = true;
        return;
      }

      isIgnoredTarget = false;
      startX = touchX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isIgnoredTarget || !e.changedTouches || e.changedTouches.length === 0) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Deliberate inward swipe from the edge (standard mobile back gesture):
      // Left edge swipe (swiping right from screen left) OR Right edge swipe (swiping left from screen right)
      const isLeftEdgeSwipe = startX <= 65 && deltaX > 40 && Math.abs(deltaY) < 60;
      const isRightEdgeSwipe = startX >= window.innerWidth - 65 && deltaX < -40 && Math.abs(deltaY) < 60;

      if (isLeftEdgeSwipe || isRightEdgeSwipe) {
        handleBackAction(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleToggleFavorite = (toolId: string) => {
    const updated = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(updated);
    saveStoredFavorites(updated);
  };

  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  const handleToggleDarkMode = () => {
    sounds.playClick();
    setDarkMode(prev => !prev);
  };

  const handleSelectTab = (tab: string) => {
    sounds.playClick();
    setStarredSelectedToolId(null);
    if (tab === 'categories') {
      handleGoHome();
      return;
    }
    if (activeToolRef.current) {
      handleBackToOverview(true, tab);
      return;
    }
    setActiveTool(null);
    activeToolRef.current = null;
    setActiveTab(tab);
    activeTabRef.current = tab;
    setToolReturnTab(tab);
    toolReturnTabRef.current = tab;
    justNavigatedToHomeRef.current = false;
    try {
      window.history.pushState({ __omniApp: true, level: 'tab', tab }, '', `?tab=${tab}`);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleToggleFloatingNotes = () => {
    sounds.playClick();
    setStarredSelectedToolId(null);
    if (activeTab === 'notes') {
      handleGoHome();
    } else {
      handleSelectTab('notes');
    }
  };

  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 ${isDrawerOpen ? 'overflow-hidden max-h-[100dvh]' : ''}`}>
      {/* Top Bar with Expandable Search & Live Suggestions */}
      <Navbar
        onOpenSearch={() => {
          sounds.playClick();
          setIsSearchOpen(true);
          try {
            window.history.pushState({ __omniApp: true, level: 'search' }, '');
          } catch {
            // ignore
          }
        }}
        onClearSearch={() => {
          setIsSearchOpen(false);
          setIsNavbarSearchOpen(false);
          setNavbarSearchQuery('');
          setModalSearchQuery('');
        }}
        searchQuery={navbarSearchQuery}
        onSearchQueryChange={setNavbarSearchQuery}
        isSearchOpen={isNavbarSearchOpen}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onSelectTool={handleSelectTool}
        onOpenOnboarding={() => setShowOnboarding(true)}
        toolFilter={toolFilter}
        onSelectToolFilter={setToolFilter}
        onOpenExitDialog={() => setShowExitDialog(true)}
        onSearchOpenChange={open => {
          setIsNavbarSearchOpen(open);
          isNavbarSearchOpenRef.current = open;
          if (!open) {
            setNavbarSearchQuery('');
            navbarSearchQueryRef.current = '';
          }
        }}
        closeSearchTrigger={closeNavbarSearchTrigger}
        onDrawerOpenChange={open => {
          setIsDrawerOpen(open);
          if (open) {
            try {
              window.history.pushState({ __omniApp: true, level: 'drawer' }, '');
            } catch {
              // ignore
            }
          }
        }}
        closeDrawerTrigger={closeDrawerTrigger}
        favorites={favorites}
        recents={recents}
        hasActiveTool={!!activeTool}
        onOpenAdMobPerformance={() => setIsAdMobPerformanceOpen(true)}
      />

      {/* Main Content Area — fully responsive across mobile phones, tablets, laptops & PCs */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-[calc(3.5rem+max(env(safe-area-inset-top,0px),26px)+0.75rem)] sm:pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 ${isDrawerOpen ? 'pointer-events-none select-none overflow-hidden max-h-[100dvh]' : ''}`}>
        {/* Destination View: Kept mounted in DOM and hidden when activeTool is open, so all DOM nodes & layout are ready immediately on exit */}
        <div
          className={`${activeTool ? 'hidden' : isReturningFromTool ? 'animate-tool-slide-in' : 'w-full'}`}
          aria-hidden={!!activeTool}
        >
            {activeTab === 'notes' ? (
              <div className="space-y-4">
                <NotesView onBackToHome={handleGoHome} />
              </div>
            ) : activeTab === 'favorites' ? (
              <div className="space-y-4">
                <FavoritesView
                  favorites={favorites}
                  onSelectTool={handleSelectTool}
                  onToggleFavorite={handleToggleFavorite}
                  onBrowseAll={handleGoHome}
                  selectedToolId={starredSelectedToolId}
                />
              </div>
            ) : activeTab === 'games' ? (
              <div className="space-y-6 max-w-4xl mx-auto pb-24">
                <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800 flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleGoHome()}
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors shadow-xs cursor-pointer"
                    title="Back to Home"
                    aria-label="Back to Home"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                      <span>Offline Arcade</span>
                      <span aria-hidden="true">·</span>
                      <span>Brain & Reflex Challenges</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      Lightweight Game Zone
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Zero lag, 100% offline mini-games: 2048, Tic-Tac-Toe AI, Minesweeper, Memory Match, reaction time reflex tests & mental math.
                    </p>
                  </div>
                </div>

                {/* Rewarded Ad Sponsor Perk Card (Non-annoying, 100% opt-in for testing) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50">
                          Arcade Champion Perk
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[9px] border border-emerald-500/30">
                          Rewarded Ad Test
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Watch a 5s test sponsor video to earn a VIP Arcade Champion badge and test ad callbacks.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      admobService.showRewardedAd(
                        () => {},
                        { type: 'Arcade Champion Badge', amount: 1 }
                      );
                    }}
                    className="shrink-0 w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Watch Test Ad</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {TOOLS.filter(t => t.categoryId === 'games').map(tool => {
                    const isSelected = tool.id === lastOpenedToolId;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => {
                          sounds.playClick();
                          handleSelectTool(tool);
                        }}
                        className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.98] ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-xl bg-indigo-50/40 dark:bg-indigo-950/40'
                            : 'border-zinc-200/90 bg-white hover:border-zinc-400 hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800/90 dark:bg-zinc-900 dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs animate-pulse">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{tool.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Google AdMob Test Banner in Arcade */}
                <div className="pt-4">
                  <AdMobBanner onOpenPerformance={() => setIsAdMobPerformanceOpen(true)} variant="inline" />
                </div>
              </div>
            ) : (
              <div>
                <CategoryExplorer
                  onSelectTool={handleSelectTool}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  recents={recents}
                  expandedCatIds={expandedCatIds}
                  onToggleCategory={handleToggleCategory}
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                  toolFilter={toolFilter}
                  onSelectToolFilter={setToolFilter}
                  tierFilter={tierFilter}
                  onSelectTierFilter={setTierFilter}
                  selectedToolId={lastOpenedToolId}
                  onOpenAdMobPerformance={() => setIsAdMobPerformanceOpen(true)}
                />
              </div>
            )}
        </div>

        {/* Tool View: Smooth slide-in on entry */}
        {activeTool && (
          <div className="animate-tool-slide-in">
            <ToolDispatcher
              tool={activeTool}
              onBack={() => handleBackToOverview(true)}
              isFavorite={favorites.includes(activeTool.id)}
              onToggleFavorite={() => handleToggleFavorite(activeTool.id)}
              onSelectTool={handleSelectTool}
              onOpenAdMobPerformance={() => setIsAdMobPerformanceOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB): Circular Speed Dial for Home, Starred & Notes */}
      <FloatingNotesButton
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onGoHome={handleGoHome}
        onBackToOverview={handleBackToOverview}
        favoriteCount={favorites.length}
        activeToolName={activeTool?.name}
        onExpandedChange={setIsFABExpanded}
        closeTrigger={closeFABTrigger}
        isDrawerOpen={isDrawerOpen}
      />

      {/* Keyboard Quick Search Modal (preserved via ⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        initialQuery={modalSearchQuery}
        onClose={() => {
          setIsSearchOpen(false);
          setModalSearchQuery('');
        }}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* High-Performance Splash Screen on Launch */}
      {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

      {/* Professional Multi-Device Onboarding Tour */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Network Connectivity & Offline Indicator */}
      <OfflineIndicator />

      {/* Exit App Confirmation Dialogue */}
      <ExitConfirmModal
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
      />

      {/* Google AdMob Modals (Interstitial, Rewarded, and Performance Inspector) */}
      <AdMobInterstitialModal
        isOpen={showInterstitialAd}
        onClose={() => admobService.dismissInterstitial()}
      />

      <AdMobRewardedModal
        isOpen={showRewardedAd}
        onClose={() => admobService.dismissRewarded(false)}
        rewardDetails={rewardedRewardDetails}
      />

      <AdMobPerformanceModal
        isOpen={isAdMobPerformanceOpen}
        onClose={() => setIsAdMobPerformanceOpen(false)}
      />
    </div>
  );
}
