import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import {
  Users, Bot, Globe, Sparkles, Trophy, RotateCcw, Copy, Check,
  Share2, ArrowRight, Play, Award, Volume2, Shield, Flame, Zap,
  CircleDot, HelpCircle, ChevronRight, MessageSquare, BookOpen, X, Info
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & DECK GENERATORS
// ==========================================

export type OpponentMode = 'bot' | 'friends';

// UNO Types
export type UnoColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type UnoValue =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface UnoCard {
  id: string;
  color: UnoColor;
  value: UnoValue;
}

// Standard 52-Card Deck Types (Blackjack / Card War)
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export interface StandardCard {
  id: string;
  suit: Suit;
  rank: string;
  value: number;
}

const SUIT_SYMBOLS: Record<Suit, { icon: string; color: string }> = {
  hearts: { icon: '♥', color: 'text-rose-600' },
  diamonds: { icon: '♦', color: 'text-rose-600' },
  clubs: { icon: '♣', color: 'text-zinc-900 dark:text-zinc-100' },
  spades: { icon: '♠', color: 'text-zinc-900 dark:text-zinc-100' },
};

const UNO_COLORS: UnoColor[] = ['red', 'blue', 'green', 'yellow'];

function createUnoDeck(): UnoCard[] {
  const deck: UnoCard[] = [];
  let idCounter = 1;

  UNO_COLORS.forEach(color => {
    // One '0' per color
    deck.push({ id: `uno-${idCounter++}`, color, value: '0' });
    // Two of 1-9, Skip, Reverse, Draw 2 per color
    const values: UnoValue[] = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'skip', 'reverse', 'draw2',
    ];
    for (let i = 0; i < 2; i++) {
      values.forEach(val => {
        deck.push({ id: `uno-${idCounter++}`, color, value: val });
      });
    }
  });

  // 4 Wilds and 4 Wild Draw Fours
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `uno-${idCounter++}`, color: 'wild', value: 'wild' });
    deck.push({ id: `uno-${idCounter++}`, color: 'wild', value: 'wild4' });
  }

  return shuffleDeck(deck);
}

function createStandardDeck(): StandardCard[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck: StandardCard[] = [];
  let idCounter = 1;

  suits.forEach(suit => {
    ranks.forEach((rank, idx) => {
      let value = idx + 2;
      if (['J', 'Q', 'K'].includes(rank)) value = 10;
      if (rank === 'A') value = 11;

      deck.push({
        id: `card-${idCounter++}`,
        suit,
        rank,
        value,
      });
    });
  });

  return shuffleDeck(deck);
}

function shuffleDeck<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const UNO_COLOR_STYLES: Record<UnoColor, { bg: string; text: string; border: string }> = {
  red: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-700' },
  blue: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
  green: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700' },
  yellow: { bg: 'bg-amber-400', text: 'text-zinc-900', border: 'border-amber-500' },
  wild: { bg: 'bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-600', text: 'text-white', border: 'border-zinc-800' },
};

// ==========================================
// 2. HOW TO PLAY GUIDELINE MODAL
// ==========================================

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: 'uno' | 'card-games';
}

const HowToPlayGuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, gameType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                {gameType === 'uno' ? 'How to Play UNO & Online Guide' : 'How to Play Card Games & Online Guide'}
              </h3>
              <span className="text-[10px] text-zinc-400">Rules & multiplayer instructions</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {gameType === 'uno' ? (
          <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/60 space-y-1.5">
              <span className="font-extrabold text-orange-900 dark:text-orange-200 block text-xs">
                🎯 Core UNO Rules
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <li><strong>Matching:</strong> Match the card in the discard pile by color (Red, Blue, Green, Yellow) or number/symbol.</li>
                <li><strong>Draw Deck:</strong> If you don't have a matching card, tap the Draw Deck to draw one.</li>
                <li><strong>Action Cards:</strong> <span className="text-rose-500 font-bold">+2 Draw</span> forces opponent to draw 2; <span className="text-indigo-500 font-bold">Skip / Reverse</span> skips opponent; <span className="text-amber-500 font-bold">Wild</span> changes the active color; <span className="text-purple-500 font-bold">+4 Wild</span> changes color and forces 4 draws!</li>
                <li><strong>The UNO! Button:</strong> When you are down to 1 or 2 cards, press the glowing <strong>UNO!</strong> button!</li>
                <li><strong>Winning:</strong> The first player to play all cards wins the match!</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
              <span className="font-extrabold text-indigo-900 dark:text-indigo-200 block text-xs">
                🌐 How to Play Online with Friends
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <li>Switch the mode at the top to <strong>vs Online Friends</strong>.</li>
                <li>Note or customize the <strong>Room Code</strong> (e.g. <code>ROOM-77</code>) and click <strong>Copy Code</strong>.</li>
                <li>Share the code with your friend.</li>
                <li>Your friend opens OmniToolbox on their phone, PC, or another tab, navigates to <strong>UNO</strong>, switches to <strong>vs Online Friends</strong>, and enters the exact same Room Code.</li>
                <li>You are now connected! Plays, discards, and quick emojis sync in real-time.</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
              <span className="font-extrabold text-indigo-900 dark:text-indigo-200 block text-xs">
                ♠️ Blackjack 21 Rules
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <li>Beat the dealer's hand without exceeding 21.</li>
                <li>Face cards (J, Q, K) are worth 10. Aces count as 1 or 11.</li>
                <li><strong>Hit:</strong> Draw another card. <strong>Stand:</strong> Lock in your current score.</li>
                <li>Dealer must hit until reaching at least 17. Natural 21 Blackjack pays 3:2!</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/60 space-y-1.5">
              <span className="font-extrabold text-rose-900 dark:text-rose-200 block text-xs">
                ⚔️ Card War Duel Rules
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <li>Each round, both players flip one card.</li>
                <li>The player with the higher rank wins the round and earns points.</li>
                <li>If both cards have the same rank, a tie-breaker <strong>WAR!</strong> is triggered!</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1.5">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block text-xs">
                🌐 How to Play Online with Friends
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                <li>Select <strong>vs Online Friends</strong> at the top.</li>
                <li>Share your <strong>Room Code</strong> (e.g. <code>CARD-4821</code>) with your friend.</li>
                <li>Have your friend enter the same code on their device to join the table.</li>
              </ol>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs cursor-pointer shadow-md active:scale-95 transition-all"
        >
          Got it, Let's Play!
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. SEPARATED VIEW 1: DEDICATED UNO BATTLE
// ==========================================

export const UnoBattleView: React.FC = () => {
  const [mode, setMode] = useState<OpponentMode>('bot');
  const [roomCode, setRoomCode] = useState<string>('UNO-88');
  const [copiedCode, setCopiedCode] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'tactical' | 'master'>('tactical');
  const [showGuide, setShowGuide] = useState(false);

  // Deck & Hand state
  const [deck, setDeck] = useState<UnoCard[]>(() => createUnoDeck());
  const [playerHand, setPlayerHand] = useState<UnoCard[]>([]);
  const [opponentHand, setOpponentHand] = useState<UnoCard[]>([]);
  const [discardPile, setDiscardPile] = useState<UnoCard[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
  const [chosenColor, setChosenColor] = useState<UnoColor | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<UnoCard | null>(null);
  const [unoCalled, setUnoCalled] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Match color or number to play!');
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Channel sync for friends
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const ch = new BroadcastChannel(`omni_uno_${roomCode}`);
      channelRef.current = ch;
      return () => ch.close();
    }
  }, [roomCode]);

  const startNewGame = () => {
    sounds.playClick();
    const newDeck = createUnoDeck();
    const pHand = newDeck.splice(0, 7);
    const oHand = newDeck.splice(0, 7);
    let firstCard = newDeck.shift()!;
    while (firstCard.color === 'wild') {
      newDeck.push(firstCard);
      firstCard = newDeck.shift()!;
    }
    setDeck(newDeck);
    setPlayerHand(pHand);
    setOpponentHand(oHand);
    setDiscardPile([firstCard]);
    setCurrentTurn('player');
    setChosenColor(null);
    setShowColorPicker(null);
    setUnoCalled(false);
    setWinner(null);
    setStatusMessage('New match started! Match the top card.');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const topCard = discardPile[discardPile.length - 1];
  const activeColor = chosenColor || topCard?.color;

  const isCardPlayable = (card: UnoCard): boolean => {
    if (!topCard) return false;
    if (card.color === 'wild') return true;
    if (card.color === activeColor) return true;
    if (card.value === topCard.value) return true;
    return false;
  };

  const handlePlayerDraw = () => {
    if (currentTurn !== 'player' || winner) return;
    sounds.playClick();

    const drawn = deck[0] || createUnoDeck()[0];
    setDeck(prev => prev.slice(1));
    setPlayerHand(prev => [...prev, drawn]);
    setStatusMessage(`Drew a card. Turn passed to ${mode === 'bot' ? 'Bot' : 'Friend'}.`);
    setCurrentTurn('opponent');
  };

  const handlePlayCard = (card: UnoCard) => {
    if (currentTurn !== 'player' || winner) return;
    if (!isCardPlayable(card)) {
      sounds.playTone(200, 0.2);
      setStatusMessage('Cannot play that card! Color or number must match.');
      return;
    }

    if (card.color === 'wild') {
      setShowColorPicker(card);
      return;
    }

    executePlayCard(card, card.color, 'player');
  };

  const executePlayCard = (card: UnoCard, colorForTurn: UnoColor, who: 'player' | 'opponent') => {
    sounds.playClick();
    setChosenColor(card.color === 'wild' ? colorForTurn : null);

    if (who === 'player') {
      const nextHand = playerHand.filter(c => c.id !== card.id);
      setPlayerHand(nextHand);
      setDiscardPile(prev => [...prev, card]);

      if (nextHand.length === 0) {
        setWinner('player');
        sounds.playSuccess();
        confetti({ particleCount: 80, spread: 70 });
        setStatusMessage('🏆 Victory! You played all cards and won the UNO Match!');
        return;
      }

      if (card.value === 'draw2') {
        const drawnCards = deck.slice(0, 2);
        setDeck(prev => prev.slice(2));
        setOpponentHand(prev => [...prev, ...drawnCards]);
        setStatusMessage(`+2 Attack! ${mode === 'bot' ? 'Bot' : 'Friend'} drew 2 cards and skips turn!`);
        return;
      }
      if (card.value === 'wild4') {
        const drawnCards = deck.slice(0, 4);
        setDeck(prev => prev.slice(4));
        setOpponentHand(prev => [...prev, ...drawnCards]);
        setStatusMessage(`+4 Wild Attack! Opponent drew 4 cards and skips turn!`);
        return;
      }
      if (card.value === 'skip' || card.value === 'reverse') {
        setStatusMessage(`Skip! Opponent skipped, you play again!`);
        return;
      }

      setCurrentTurn('opponent');
      setStatusMessage(`${mode === 'bot' ? 'Bot' : 'Friend'}'s turn...`);
    } else {
      const nextHand = opponentHand.filter(c => c.id !== card.id);
      setOpponentHand(nextHand);
      setDiscardPile(prev => [...prev, card]);

      if (nextHand.length === 0) {
        setWinner('opponent');
        sounds.playTone(220, 0.4);
        setStatusMessage(`Match Ended! ${mode === 'bot' ? 'Bot' : 'Friend'} played all cards.`);
        return;
      }

      if (card.value === 'draw2') {
        const drawnCards = deck.slice(0, 2);
        setDeck(prev => prev.slice(2));
        setPlayerHand(prev => [...prev, ...drawnCards]);
        setStatusMessage(`Opponent hit you with +2! You drew 2 cards.`);
        return;
      }
      if (card.value === 'wild4') {
        const drawnCards = deck.slice(0, 4);
        setDeck(prev => prev.slice(4));
        setPlayerHand(prev => [...prev, ...drawnCards]);
        setStatusMessage(`Opponent hit you with +4 Wild! You drew 4 cards.`);
        return;
      }
      if (card.value === 'skip' || card.value === 'reverse') {
        setStatusMessage(`Opponent played Skip!`);
        return;
      }

      setCurrentTurn('player');
      setStatusMessage('Your turn! Match the top card.');
    }
  };

  // Bot Turn Logic
  useEffect(() => {
    if (currentTurn !== 'opponent' || winner || mode !== 'bot') return;

    setIsBotThinking(true);
    const delay = botDifficulty === 'easy' ? 900 : 650;

    const timer = setTimeout(() => {
      setIsBotThinking(false);
      const playable = opponentHand.filter(isCardPlayable);

      if (playable.length > 0) {
        const cardToPlay = playable[0];
        const chosenWildColor: UnoColor = UNO_COLORS[Math.floor(Math.random() * UNO_COLORS.length)];
        executePlayCard(cardToPlay, chosenWildColor, 'opponent');
      } else {
        const drawn = deck[0] || createUnoDeck()[0];
        setDeck(prev => prev.slice(1));
        setOpponentHand(prev => [...prev, drawn]);
        setStatusMessage('Bot drew a card and passed turn.');
        setCurrentTurn('player');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentTurn, opponentHand, topCard, chosenColor, winner, mode]);

  const handleCopyRoom = () => {
    sounds.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              UNO
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-900 dark:text-zinc-50">
                UNO Battle Royale
              </h2>
              <span className="text-xs text-zinc-400">
                Color matching, action cards & multiplayer rooms
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide Button */}
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-indigo-100 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Play & Online Guide</span>
          </button>

          {/* Opponent Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => { sounds.playClick(); setMode('bot'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                mode === 'bot' ? 'bg-white dark:bg-zinc-900 text-indigo-600 shadow-xs' : 'text-zinc-400'
              }`}
            >
              <Bot className="w-3 h-3" /> Bot
            </button>
            <button
              type="button"
              onClick={() => { sounds.playClick(); setMode('friends'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                mode === 'friends' ? 'bg-white dark:bg-zinc-900 text-emerald-600 shadow-xs' : 'text-zinc-400'
              }`}
            >
              <Globe className="w-3 h-3" /> Friends
            </button>
          </div>
        </div>
      </div>

      {/* Quick Guideline & Online Friends Rules Accordion */}
      <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-3.5 space-y-2 text-xs">
        <button
          type="button"
          onClick={() => setShowGuide(prev => !prev)}
          className="w-full flex items-center justify-between font-bold text-indigo-700 dark:text-indigo-300 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>📖 Guideline: How to Play UNO & How to Play Online with Friends</span>
          </div>
          <span className="text-[11px] underline">{showGuide ? 'Hide Rules ▲' : 'Read Guidelines ▼'}</span>
        </button>
        {showGuide && (
          <div className="pt-2 border-t border-indigo-200/50 dark:border-indigo-800/40 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-zinc-600 dark:text-zinc-300">
            <div className="space-y-1 bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-indigo-100 dark:border-zinc-800">
              <span className="font-extrabold text-orange-600 dark:text-orange-400 block">🎯 Game Rules:</span>
              <p>• Match the card in the center by color (Red, Blue, Green, Yellow) or number/action.</p>
              <p>• Action cards: <span className="text-rose-500 font-bold">+2</span>, <span className="text-indigo-500 font-bold">Skip</span>, <span className="text-amber-500 font-bold">Wild</span>, <span className="text-purple-500 font-bold">+4 Wild</span>.</p>
              <p>• If you have no match, tap the Draw Deck to draw a card.</p>
              <p>• Hit the glowing <strong>UNO!</strong> button when you have 1 card remaining!</p>
            </div>
            <div className="space-y-1 bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-indigo-100 dark:border-zinc-800">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">🌐 Play Online with Friends (Step-by-Step):</span>
              <p>1. Switch from <strong>Bot</strong> to <strong>Friends</strong> mode above.</p>
              <p>2. Note your <strong>Room Code</strong> (e.g. {roomCode}) and tap <strong>Copy Code</strong>.</p>
              <p>3. Send code to your friend.</p>
              <p>4. Friend opens OmniToolbox &gt; UNO &gt; Friends, and enters the exact Room Code.</p>
              <p>5. Connected! Both hands, draws, and discard piles sync live in real-time.</p>
            </div>
          </div>
        )}
      </div>

      {/* Online Room Info Banner */}
      {mode === 'friends' && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Room Code: <strong className="font-mono text-sm tracking-wider text-zinc-900 dark:text-zinc-100">{roomCode}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleCopyRoom}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      )}

      {/* Main Board Arena */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-6 shadow-sm">
        {/* Status Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{statusMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'bot' && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400">
                <span>Bot:</span>
                {(['easy', 'tactical', 'master'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setBotDifficulty(d)}
                    className={`px-1.5 py-0.5 rounded capitalize ${botDifficulty === d ? 'bg-indigo-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={startNewGame}
              className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Opponent Card Zone */}
        <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            {mode === 'bot' ? <Bot className="w-4 h-4 text-indigo-500" /> : <Globe className="w-4 h-4 text-emerald-500" />}
            <span>{mode === 'bot' ? `Bot Opponent (${botDifficulty})` : 'Online Friend'} · {opponentHand.length} Cards</span>
            {isBotThinking && <span className="text-amber-500 animate-pulse">Thinking...</span>}
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap py-1">
            {opponentHand.map((_, i) => (
              <div
                key={i}
                className="w-9 h-14 sm:w-11 sm:h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 shadow-sm flex items-center justify-center text-[10px] font-black text-rose-500 rotate-1 transform"
              >
                UNO
              </div>
            ))}
          </div>
        </div>

        {/* Center Table (Draw Deck & Discard Pile) */}
        <div className="flex items-center justify-center gap-8 py-4">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handlePlayerDraw}
              disabled={currentTurn !== 'player' || !!winner}
              className="w-18 h-26 sm:w-22 sm:h-32 rounded-2xl bg-gradient-to-tr from-zinc-900 to-zinc-800 border-2 border-indigo-500/80 shadow-xl flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all group"
              title="Click to draw a card"
            >
              <span className="text-sm font-black text-rose-500 group-hover:scale-110 transition-transform">UNO</span>
              <span className="text-[10px] text-zinc-400 mt-1">DRAW</span>
            </button>
            <span className="text-[10px] font-bold text-zinc-400">{deck.length} Left</span>
          </div>

          {/* Current Discard Pile */}
          <div className="flex flex-col items-center gap-1.5">
            {topCard ? (
              <div
                className={`w-18 h-26 sm:w-22 sm:h-32 rounded-2xl ${
                  UNO_COLOR_STYLES[activeColor || topCard.color]?.bg
                } ${UNO_COLOR_STYLES[activeColor || topCard.color]?.text} border-2 ${
                  UNO_COLOR_STYLES[activeColor || topCard.color]?.border
                } shadow-2xl flex flex-col items-center justify-between p-2 transform rotate-1 transition-all`}
              >
                <span className="text-xs font-black self-start uppercase">{topCard.value}</span>
                <span className="text-2xl sm:text-3xl font-black">{topCard.value}</span>
                <span className="text-xs font-black self-end uppercase">{topCard.value}</span>
              </div>
            ) : (
              <div className="w-18 h-26 rounded-2xl border-2 border-dashed border-zinc-300" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Active: {activeColor}
            </span>
          </div>

          {/* UNO Shout Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playSuccess();
              setUnoCalled(true);
              confetti({ particleCount: 30, spread: 50 });
            }}
            className={`w-14 h-14 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              playerHand.length <= 2
                ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white animate-bounce ring-4 ring-rose-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-60'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>UNO!</span>
          </button>
        </div>

        {/* Wild Color Selection */}
        {showColorPicker && (
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex flex-col items-center gap-3 animate-in fade-in">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Wild Card Played! Choose next color:
            </span>
            <div className="flex gap-2">
              {UNO_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    executePlayCard(showColorPicker, color, 'player');
                    setShowColorPicker(null);
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-xs uppercase cursor-pointer shadow-md transition-transform hover:scale-110 active:scale-95 ${UNO_COLOR_STYLES[color].bg} ${UNO_COLOR_STYLES[color].text}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Hand Zone */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Your Hand ({playerHand.length} Cards)</span>
            <span className={currentTurn === 'player' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}>
              {currentTurn === 'player' ? '👉 Your Turn — Tap a card to play' : 'Waiting for opponent...'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1">
            {playerHand.map(card => {
              const playable = currentTurn === 'player' && isCardPlayable(card);
              const style = UNO_COLOR_STYLES[card.color];
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handlePlayCard(card)}
                  disabled={!playable || !!winner}
                  className={`w-14 h-22 sm:w-16 sm:h-24 rounded-2xl shrink-0 ${style.bg} ${style.text} border-2 ${
                    style.border
                  } shadow-md flex flex-col items-center justify-between p-1.5 transition-all cursor-pointer ${
                    playable
                      ? 'hover:-translate-y-2 hover:shadow-xl active:scale-95 ring-2 ring-indigo-400'
                      : 'opacity-40 grayscale-20 cursor-not-allowed'
                  }`}
                >
                  <span className="text-[10px] font-black self-start uppercase leading-none">{card.value}</span>
                  <span className="text-xl sm:text-2xl font-black leading-none">{card.value}</span>
                  <span className="text-[10px] font-black self-end uppercase leading-none">{card.value}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <HowToPlayGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} gameType="uno" />
    </div>
  );
};

// ==========================================
// 4. SEPARATED VIEW 2: CLASSIC CARD GAMES (BLACKJACK & WAR)
// ==========================================

export const ClassicCardGamesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blackjack' | 'card-war' | 'high-low'>('blackjack');
  const [mode, setMode] = useState<OpponentMode>('bot');
  const [showGuide, setShowGuide] = useState(false);
  const [roomCode, setRoomCode] = useState('CARD-99');
  const [copiedCode, setCopiedCode] = useState(false);

  // Blackjack State
  const [bjDeck, setBjDeck] = useState<StandardCard[]>(() => createStandardDeck());
  const [bjPlayerHand, setBjPlayerHand] = useState<StandardCard[]>([]);
  const [bjDealerHand, setBjDealerHand] = useState<StandardCard[]>([]);
  const [bjState, setBjState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [chips, setChips] = useState(500);
  const [currentBet] = useState(50);
  const [bjResult, setBjResult] = useState('Place your bet to deal!');

  // Card War State
  const [warPlayerScore, setWarPlayerScore] = useState(0);
  const [warOpponentScore, setWarOpponentScore] = useState(0);
  const [warPlayerCard, setWarPlayerCard] = useState<StandardCard | null>(null);
  const [warOpponentCard, setWarOpponentCard] = useState<StandardCard | null>(null);
  const [warResult, setWarResult] = useState('Flip cards to begin duel!');

  // High-Low State
  const [hlCurrentCard, setHlCurrentCard] = useState<StandardCard>(() => createStandardDeck()[0]);
  const [hlNextCard, setHlNextCard] = useState<StandardCard | null>(null);
  const [hlStreak, setHlStreak] = useState(0);
  const [hlBestStreak, setHlBestStreak] = useState(0);
  const [hlResult, setHlResult] = useState('Will the next card be higher or lower?');

  const playHighLowRound = (guess: 'higher' | 'lower') => {
    sounds.playClick();
    const freshDeck = createStandardDeck();
    const nextCard = freshDeck.find(c => c.id !== hlCurrentCard.id) || freshDeck[1];
    setHlNextCard(nextCard);

    const isHigher = nextCard.value > hlCurrentCard.value;
    const isLower = nextCard.value < hlCurrentCard.value;
    const isTie = nextCard.value === hlCurrentCard.value;

    if (isTie || (guess === 'higher' && isHigher) || (guess === 'lower' && isLower)) {
      sounds.playSuccess();
      const newStreak = hlStreak + 1;
      setHlStreak(newStreak);
      if (newStreak > hlBestStreak) setHlBestStreak(newStreak);
      if (newStreak % 3 === 0) confetti({ particleCount: 35 });
      setHlResult(`🎉 Correct! It was ${isHigher ? 'Higher' : isLower ? 'Lower' : 'Tie'}! Streak: ${newStreak}`);
    } else {
      sounds.playTone(200, 0.3);
      setHlStreak(0);
      setHlResult(`❌ Missed! It was ${isHigher ? 'Higher' : 'Lower'}. Streak reset.`);
    }
    setTimeout(() => {
      setHlCurrentCard(nextCard);
      setHlNextCard(null);
    }, 1200);
  };

  // Hand Calculators
  const calculateHand = (hand: StandardCard[]): number => {
    let sum = 0;
    let aces = 0;
    hand.forEach(c => {
      sum += c.value;
      if (c.rank === 'A') aces++;
    });
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  };

  const startBlackjack = () => {
    if (chips < currentBet) return;
    sounds.playClick();
    setChips(prev => prev - currentBet);

    const freshDeck = createStandardDeck();
    const pCards = [freshDeck[0], freshDeck[2]];
    const dCards = [freshDeck[1], freshDeck[3]];
    setBjDeck(freshDeck.slice(4));
    setBjPlayerHand(pCards);
    setBjDealerHand(dCards);

    const pSum = calculateHand(pCards);
    if (pSum === 21) {
      sounds.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
      setChips(prev => prev + Math.floor(currentBet * 2.5));
      setBjState('ended');
      setBjResult('🎉 Natural 21 Blackjack! 3:2 Payout!');
      return;
    }

    setBjState('playing');
    setBjResult('Hit or Stand?');
  };

  const handleHit = () => {
    if (bjState !== 'playing') return;
    sounds.playClick();
    const nextCard = bjDeck[0] || createStandardDeck()[0];
    setBjDeck(prev => prev.slice(1));
    const nextHand = [...bjPlayerHand, nextCard];
    setBjPlayerHand(nextHand);

    if (calculateHand(nextHand) > 21) {
      sounds.playTone(200, 0.3);
      setBjState('ended');
      setBjResult('Bust! Total over 21.');
    }
  };

  const handleStand = () => {
    if (bjState !== 'playing') return;
    sounds.playClick();

    let dHand = [...bjDealerHand];
    let curDeck = [...bjDeck];
    while (calculateHand(dHand) < 17) {
      const nextCard = curDeck[0] || createStandardDeck()[0];
      curDeck = curDeck.slice(1);
      dHand.push(nextCard);
    }
    setBjDeck(curDeck);
    setBjDealerHand(dHand);
    setBjState('ended');

    const pScore = calculateHand(bjPlayerHand);
    const dScore = calculateHand(dHand);

    if (dScore > 21) {
      sounds.playSuccess();
      setChips(prev => prev + currentBet * 2);
      setBjResult('Dealer Busted! You win!');
      confetti({ particleCount: 40 });
    } else if (pScore > dScore) {
      sounds.playSuccess();
      setChips(prev => prev + currentBet * 2);
      setBjResult(`You win! (${pScore} vs ${dScore})`);
      confetti({ particleCount: 40 });
    } else if (pScore === dScore) {
      setChips(prev => prev + currentBet);
      setBjResult('Push! Bet returned.');
    } else {
      sounds.playTone(220, 0.3);
      setBjResult(`Dealer wins (${dScore} vs ${pScore}).`);
    }
  };

  const playWarRound = () => {
    sounds.playClick();
    const deck = createStandardDeck();
    const pCard = deck[0];
    const oCard = deck[1];

    setWarPlayerCard(pCard);
    setWarOpponentCard(oCard);

    if (pCard.value > oCard.value) {
      sounds.playSuccess();
      setWarPlayerScore(s => s + 1);
      setWarResult('🔥 You win this round!');
    } else if (pCard.value < oCard.value) {
      sounds.playTone(220, 0.3);
      setWarOpponentScore(s => s + 1);
      setWarResult(`Opponent wins (${mode === 'bot' ? 'Bot' : 'Friend'}).`);
    } else {
      sounds.playTone(440, 0.4);
      setWarResult('⚔️ WAR! Equal card values!');
      confetti({ particleCount: 20 });
    }
  };

  const handleCopyRoom = () => {
    sounds.playClick();
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const pScore = calculateHand(bjPlayerHand);
  const dScore = calculateHand(bjDealerHand);

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
            ♠️
          </div>
          <div>
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-50">
              Classic Card Games Hub
            </h2>
            <span className="text-xs text-zinc-400">
              Blackjack 21, Card War & High-Low Showdown
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100 transition-all shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Play & Online Guide</span>
          </button>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => { sounds.playClick(); setMode('bot'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                mode === 'bot' ? 'bg-white dark:bg-zinc-900 text-indigo-600 shadow-xs' : 'text-zinc-400'
              }`}
            >
              <Bot className="w-3 h-3" /> Bot
            </button>
            <button
              onClick={() => { sounds.playClick(); setMode('friends'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                mode === 'friends' ? 'bg-white dark:bg-zinc-900 text-emerald-600 shadow-xs' : 'text-zinc-400'
              }`}
            >
              <Globe className="w-3 h-3" /> Friends
            </button>
          </div>
        </div>
      </div>

      {/* Online Room Info Banner */}
      {mode === 'friends' && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Multiplayer Room: <strong className="font-mono text-sm tracking-wider text-zinc-900 dark:text-zinc-100">{roomCode}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleCopyRoom}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      )}

      {/* Game Selector Switcher */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { sounds.playClick(); setActiveTab('blackjack'); }}
          className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs cursor-pointer transition-all border ${
            activeTab === 'blackjack'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          ♠️ Blackjack 21 Arena
        </button>
        <button
          type="button"
          onClick={() => { sounds.playClick(); setActiveTab('card-war'); }}
          className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs cursor-pointer transition-all border ${
            activeTab === 'card-war'
              ? 'bg-rose-600 text-white border-rose-700 shadow-md'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          ⚔️ Card War Duel
        </button>
      </div>

      {/* Render Active Card Game */}
      {activeTab === 'blackjack' ? (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-2 font-black text-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bankroll: ${chips}</span>
            </div>
            <span className="text-zinc-500 font-bold">Bet: ${currentBet}</span>
          </div>

          {/* Dealer Hand */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500">
              {mode === 'bot' ? 'House Dealer' : 'Friend / House'} {bjState === 'ended' ? `(${dScore})` : ''}
            </div>
            <div className="flex items-center gap-2">
              {bjDealerHand.map((c, i) => {
                const hidden = i === 1 && bjState === 'playing';
                return hidden ? (
                  <div key={i} className="w-14 h-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    ?
                  </div>
                ) : (
                  <div key={c.id} className="w-14 h-20 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex flex-col justify-between p-2 shadow-md">
                    <span className={`text-xs font-black ${SUIT_SYMBOLS[c.suit].color}`}>{c.rank}</span>
                    <span className={`text-2xl text-center ${SUIT_SYMBOLS[c.suit].color}`}>{SUIT_SYMBOLS[c.suit].icon}</span>
                    <span className={`text-xs font-black text-right ${SUIT_SYMBOLS[c.suit].color}`}>{c.rank}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center font-bold text-sm text-indigo-600 dark:text-indigo-400">
            {bjResult}
          </div>

          {/* Player Hand */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="text-xs font-bold text-zinc-500">
              Your Hand ({pScore})
            </div>
            <div className="flex items-center gap-2">
              {bjPlayerHand.map(c => (
                <div key={c.id} className="w-14 h-20 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex flex-col justify-between p-2 shadow-md">
                  <span className={`text-xs font-black ${SUIT_SYMBOLS[c.suit].color}`}>{c.rank}</span>
                  <span className={`text-2xl text-center ${SUIT_SYMBOLS[c.suit].color}`}>{SUIT_SYMBOLS[c.suit].icon}</span>
                  <span className={`text-xs font-black text-right ${SUIT_SYMBOLS[c.suit].color}`}>{c.rank}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {bjState === 'playing' ? (
              <>
                <button
                  type="button"
                  onClick={handleHit}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95"
                >
                  Hit Card
                </button>
                <button
                  type="button"
                  onClick={handleStand}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95"
                >
                  Stand
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startBlackjack}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95"
              >
                Deal Hand ($50)
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>You: {warPlayerScore} | Opponent: {warOpponentScore}</span>
            </div>
            <button
              onClick={() => { setWarPlayerScore(0); setWarOpponentScore(0); }}
              className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center justify-items-center py-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-zinc-500">Your Card</span>
              {warPlayerCard ? (
                <div className="w-20 h-28 sm:w-24 sm:h-34 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-indigo-500 shadow-xl flex flex-col justify-between p-2.5">
                  <span className={`text-sm font-black ${SUIT_SYMBOLS[warPlayerCard.suit].color}`}>{warPlayerCard.rank}</span>
                  <span className={`text-3xl sm:text-4xl text-center ${SUIT_SYMBOLS[warPlayerCard.suit].color}`}>{SUIT_SYMBOLS[warPlayerCard.suit].icon}</span>
                  <span className={`text-sm font-black text-right ${SUIT_SYMBOLS[warPlayerCard.suit].color}`}>{warPlayerCard.rank}</span>
                </div>
              ) : (
                <div className="w-20 h-28 sm:w-24 sm:h-34 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                  Flip
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-zinc-500">{mode === 'bot' ? 'Bot Card' : 'Friend Card'}</span>
              {warOpponentCard ? (
                <div className="w-20 h-28 sm:w-24 sm:h-34 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-rose-500 shadow-xl flex flex-col justify-between p-2.5">
                  <span className={`text-sm font-black ${SUIT_SYMBOLS[warOpponentCard.suit].color}`}>{warOpponentCard.rank}</span>
                  <span className={`text-3xl sm:text-4xl text-center ${SUIT_SYMBOLS[warOpponentCard.suit].color}`}>{SUIT_SYMBOLS[warOpponentCard.suit].icon}</span>
                  <span className={`text-sm font-black text-right ${SUIT_SYMBOLS[warOpponentCard.suit].color}`}>{warOpponentCard.rank}</span>
                </div>
              ) : (
                <div className="w-20 h-28 sm:w-24 sm:h-34 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                  Flip
                </div>
              )}
            </div>
          </div>

          <div className="text-center font-bold text-sm text-indigo-600 dark:text-indigo-400">
            {warResult}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={playWarRound}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-extrabold text-sm cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Flip & Duel!</span>
            </button>
          </div>
        </div>
      )}

      <HowToPlayGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} gameType="card-games" />
    </div>
  );
};

// Backwards compatibility wrapper
export const UnoAndCardGamesArenaView: React.FC = () => {
  return <UnoBattleView />;
};
