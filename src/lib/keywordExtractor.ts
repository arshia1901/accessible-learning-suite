/**
 * Keyword Extraction Module
 * Extracts important keywords from text for visual representation
 */

import { Book, Lightbulb, Users, Cog, Brain, Target, BarChart3, FileText, Globe, Shield, Zap, Heart, Star, Clock, CheckCircle, AlertTriangle, Info, HelpCircle, Bookmark, Tag, Folder, Database, Code, Terminal, Cpu, Server, Cloud, Lock, Key, Eye, Search, Filter, Settings, Edit, Trash, Plus, Minus, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, RefreshCw, Download, Upload, Share, Link, Mail, Phone, MapPin, Calendar, Bell, MessageSquare, User, Home, Menu, X, Check, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, MoreHorizontal, MoreVertical, ExternalLink, Copy, Clipboard, Save, Send, Play, Pause, Square, Volume2, VolumeX, Image, Video, Music, Camera, Mic, Headphones, Monitor, Smartphone, Tablet, Wifi, Bluetooth, Battery, Power, Sun, Moon, CloudRain, Wind, Thermometer, Droplet, Flame, Leaf, Trees, Mountain, Waves, Anchor, Compass, Map, Flag, Gift, Award, Trophy, Medal, Crown, Diamond, Gem, Coins, DollarSign, CreditCard, ShoppingCart, ShoppingBag, Package, Truck, Plane, Car, Bike, Train, Ship, Rocket, Satellite, Atom, Dna, Microscope, Stethoscope, Pill, Syringe, Scissors, Hammer, Wrench, Paintbrush, Pen, Pencil, Ruler, Calculator, Scale, Glasses, Watch, Umbrella, Briefcase, GraduationCap, BookOpen, Library, Newspaper, Radio, Tv, Film, Palette, Music2, Mic2, Speaker, Volume1, type LucideIcon } from 'lucide-react';

// Common stopwords to filter out
const stopwords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
  'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
  'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here',
  'there', 'then', 'once', 'if', 'because', 'until', 'while', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'any', 'many',
]);

// Keyword to icon mapping
const keywordIcons: Record<string, LucideIcon> = {
  // Education & Learning
  'learn': Book,
  'learning': Book,
  'education': GraduationCap,
  'study': BookOpen,
  'research': Search,
  'knowledge': Brain,
  'understand': Lightbulb,
  'idea': Lightbulb,
  'concept': Lightbulb,
  'theory': Brain,
  'practice': Target,
  'skill': Star,
  'course': BookOpen,
  'lesson': FileText,
  'class': Users,
  'student': User,
  'teacher': GraduationCap,
  'school': Library,
  'university': GraduationCap,
  'book': Book,
  'read': BookOpen,
  'write': Pen,
  'note': FileText,
  
  // Technology
  'computer': Monitor,
  'technology': Cpu,
  'software': Code,
  'program': Terminal,
  'code': Code,
  'data': Database,
  'system': Server,
  'network': Globe,
  'internet': Wifi,
  'website': Globe,
  'app': Smartphone,
  'application': Smartphone,
  'digital': Monitor,
  'online': Cloud,
  'algorithm': Cog,
  'process': RefreshCw,
  'function': Cog,
  
  // Science
  'science': Atom,
  'experiment': Microscope,
  'hypothesis': HelpCircle,
  'analysis': BarChart3,
  'result': CheckCircle,
  'conclusion': Target,
  'evidence': Search,
  'method': Cog,
  'variable': Settings,
  'test': CheckCircle,
  'measure': Scale,
  'observe': Eye,
  
  // Communication
  'communication': MessageSquare,
  'message': Mail,
  'speak': Mic,
  'listen': Headphones,
  'conversation': MessageSquare,
  'discuss': Users,
  'present': Monitor,
  'share': Share,
  'connect': Link,
  
  // Business & Work
  'business': Briefcase,
  'work': Briefcase,
  'project': Folder,
  'team': Users,
  'goal': Target,
  'success': Trophy,
  'achieve': Award,
  'strategy': Compass,
  'plan': Map,
  'manage': Settings,
  'lead': Flag,
  'organize': Folder,
  'meeting': Users,
  'deadline': Clock,
  
  // Health
  'health': Heart,
  'medical': Stethoscope,
  'care': Heart,
  'treatment': Pill,
  'patient': User,
  'doctor': Stethoscope,
  'hospital': Plus,
  'medicine': Pill,
  
  // Environment
  'environment': Leaf,
  'nature': Trees,
  'climate': Thermometer,
  'weather': CloudRain,
  'energy': Zap,
  'sustainable': RefreshCw,
  'green': Leaf,
  'water': Droplet,
  'air': Wind,
  'earth': Globe,
  
  // Security
  'security': Shield,
  'protect': Shield,
  'safe': Lock,
  'privacy': Lock,
  'password': Key,
  'encrypt': Lock,
  
  // Time
  'time': Clock,
  'schedule': Calendar,
  'date': Calendar,
  'day': Sun,
  'night': Moon,
  'hour': Clock,
  'minute': Clock,
  'second': Clock,
  'history': Clock,
  'future': ArrowRight,
  'past': ArrowLeft,
  
  // Actions
  'begin': Play,
  'stop': Square,
  'halt': Pause,
  'create': Plus,
  'delete': Trash,
  'edit': Edit,
  'save': Save,
  'send': Send,
  'download': Download,
  'upload': Upload,
  'copy': Copy,
  'search': Search,
  'find': Search,
  'filter': Filter,
  'refresh': RefreshCw,
  
  // Status
  'successful': CheckCircle,
  'error': AlertTriangle,
  'warning': AlertTriangle,
  'info': Info,
  'help': HelpCircle,
  'important': Star,
  'priority': Flag,
  
  // General
  'home': Home,
  'menu': Menu,
  'close': X,
  'open': ExternalLink,
  'next': ChevronRight,
  'previous': ChevronLeft,
  'up': ChevronUp,
  'down': ChevronDown,
  'more': MoreHorizontal,
  'settings': Settings,
  'profile': User,
  'account': User,
  'notification': Bell,
  'alert': Bell,
  
  // Default fallbacks by category
  'problem': AlertTriangle,
  'solution': CheckCircle,
  'question': HelpCircle,
  'answer': CheckCircle,
  'example': Bookmark,
  'definition': FileText,
  'summary': FileText,
  'overview': Eye,
  'detail': Info,
  'feature': Star,
  'benefit': CheckCircle,
  'advantage': Plus,
  'disadvantage': Minus,
  'challenge': Mountain,
  'opportunity': Lightbulb,
};

// Default icon for keywords without a specific mapping
const defaultIcon = Tag;

// Color palette for visual cards
const colorPalette = [
  'hsl(var(--accent-simplify))',
  'hsl(var(--accent-audio))',
  'hsl(var(--accent-visual))',
  'hsl(var(--accent-braille))',
  'hsl(var(--primary))',
  'hsl(150, 60%, 40%)', // Green
  'hsl(200, 70%, 50%)', // Blue
  'hsl(280, 60%, 50%)', // Purple
];

export interface ExtractedKeyword {
  word: string;
  count: number;
  importance: number; // 0-1 score
  icon: LucideIcon;
  color: string;
  context?: string; // Short phrase containing the keyword
}

export interface KeywordExtractionResult {
  keywords: ExtractedKeyword[];
  totalWords: number;
  uniqueWords: number;
  extractionNotes: string[];
}

function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

function findContext(text: string, keyword: string): string {
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(keyword.toLowerCase());
  
  if (index === -1) return '';
  
  // Extract a window of text around the keyword
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + keyword.length + 30);
  
  let context = text.slice(start, end).trim();
  
  // Clean up partial words at edges
  if (start > 0) context = '...' + context.slice(context.indexOf(' ') + 1);
  if (end < text.length) context = context.slice(0, context.lastIndexOf(' ')) + '...';
  
  return context;
}

export function extractKeywords(text: string, maxKeywords: number = 8): KeywordExtractionResult {
  if (!text || text.trim().length === 0) {
    return {
      keywords: [],
      totalWords: 0,
      uniqueWords: 0,
      extractionNotes: ['No text provided for keyword extraction.'],
    };
  }
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  
  // Count word frequencies
  const wordFreq: Record<string, number> = {};
  const uniqueWords = new Set<string>();
  
  for (const word of words) {
    const cleaned = cleanWord(word);
    if (cleaned.length < 3) continue; // Skip very short words
    if (stopwords.has(cleaned)) continue; // Skip stopwords
    
    uniqueWords.add(cleaned);
    wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
  }
  
  // Calculate importance scores
  const maxFreq = Math.max(...Object.values(wordFreq), 1);
  
  const scoredWords: Array<{ word: string; count: number; importance: number }> = 
    Object.entries(wordFreq).map(([word, count]) => ({
      word,
      count,
      importance: (count / maxFreq) * (keywordIcons[word] ? 1.5 : 1), // Boost words with icons
    }));
  
  // Sort by importance and take top keywords
  scoredWords.sort((a, b) => b.importance - a.importance);
  const topKeywords = scoredWords.slice(0, maxKeywords);
  
  // Map to ExtractedKeyword objects
  const keywords: ExtractedKeyword[] = topKeywords.map((kw, index) => ({
    word: kw.word,
    count: kw.count,
    importance: Math.min(1, kw.importance),
    icon: keywordIcons[kw.word] || defaultIcon,
    color: colorPalette[index % colorPalette.length],
    context: findContext(text, kw.word),
  }));
  
  const notes: string[] = [];
  notes.push(`Extracted ${keywords.length} key concepts from ${totalWords} words.`);
  
  if (keywords.length < 3) {
    notes.push('Text may be too short for comprehensive keyword extraction.');
  }
  
  return {
    keywords,
    totalWords,
    uniqueWords: uniqueWords.size,
    extractionNotes: notes,
  };
}
