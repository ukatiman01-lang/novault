'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  FileCode2,
  Network,
  Code2,
  Eye,
  Menu,
  ArrowRight,
  ArrowUp,
  ExternalLink,
  CheckCircle2,
  Copy,
  Github,
  Coins,
  HeartPulse,
  Building2,
  Vote,
  Search,
  Star,
  Database,
  User,
  Clock,
  Tag,
  TerminalSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

/* S1: Hero entrance choreography variant */
const heroFadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Use Cases', href: '#usecases' },
  { label: 'Protocol', href: '#protocol' },
  { label: 'Developers', href: '#developers' },
  { label: 'FAQ', href: '#faq' },
];

const TECH_STACK = [
  'Ethereum',
  'Zero-Knowledge Proofs',
  'Solidity',
  'Rust',
  'Cryptographic Primitives',
];

const FEATURES = [
  { icon: Shield, title: 'Zero-Knowledge Proofs', desc: 'Prove statements without revealing underlying data. Mathematical guarantees of correctness with complete privacy.' },
  { icon: Lock, title: 'Encrypted Computation', desc: 'Compute on encrypted data, never decrypt. Your inputs remain confidential through every stage of processing.' },
  { icon: FileCode2, title: 'Private Smart Contracts', desc: 'Execute logic without exposing state. Smart contracts that keep transaction details hidden by default.' },
  { icon: Network, title: 'Cross-Chain Privacy', desc: 'Unified privacy layer across chains. Transfer and verify private state across heterogeneous networks.' },
  { icon: Code2, title: 'Developer SDK', desc: 'Tools and libraries to build privately. Integrate privacy primitives with a few lines of code.' },
  { icon: Eye, title: 'Audited & Open Source', desc: 'All code is public, audited by top firms. Transparency in our approach, privacy in your data.' },
];

const PROTOCOL_STEPS = [
  { num: '01', title: 'Encrypt', desc: 'Your data is encrypted client-side before it ever touches the network. No plaintext leaves your machine.', code: 'ZkCipher.encrypt(plaintext, userKey)', icon: Lock },
  { num: '02', title: 'Prove', desc: 'Zero-knowledge proofs verify correctness without revealing inputs. The network validates computation without learning anything.', code: 'ZkProver.generateProof(ciphertext, witness)', icon: Shield },
  { num: '03', title: 'Settle', desc: 'Results settle on-chain with cryptographic guarantees. Verifiable outcomes anchored to the base layer.', code: 'vault.settle(proof, commitment, recipient)', icon: FileCode2 },
];

const FAQ_DATA = [
  {
    q: 'What is zero-knowledge proof?',
    a: 'A cryptographic method that allows one party to prove to another that a statement is true, without revealing any information beyond the validity of the statement itself. In the context of noVault, this means your transactions can be verified without exposing amounts, addresses, or any other sensitive data.',
  },
  {
    q: 'Which blockchain networks does noVault support?',
    a: 'noVault currently supports Ethereum mainnet and testnet, with Polygon, Arbitrum, and Base integrations in active development. Our cross-chain privacy layer is designed to be chain-agnostic, enabling private state transfer across any EVM-compatible network.',
  },
  {
    q: "Is noVault really open source?",
    a: "Yes. All of noVault's core cryptographic libraries, protocol contracts, and SDKs are fully open source under MIT/Apache-2.0 dual license. You can review, audit, and contribute to our codebase on GitHub.",
  },
  {
    q: 'How does client-side encryption work?',
    a: "Before any data leaves your browser, noVault encrypts it using your private key. The encrypted data is then sent to the network where it is processed using advanced cryptographic techniques like fully homomorphic encryption (FHE) and secure multi-party computation (MPC). At no point is your data decrypted on any server.",
  },
  {
    q: 'What are the costs of using noVault?',
    a: "noVault's core privacy protocol is free to use. You only pay standard gas fees for on-chain transactions. Proof generation is optimized to minimize computational overhead, with most proofs generating in under 4ms at negligible cost.",
  },
  {
    q: 'How do I get started as a developer?',
    a: "Install our SDK via npm ('@novault/sdk'), check out our documentation, and explore the example contracts in our GitHub repository. Our developer Discord community is also available for real-time support and discussions.",
  },
];

const ROADMAP = [
  {
    phase: 'Phase 1',
    title: 'Testnet Launch',
    desc: 'Core ZK circuit library, encrypted state model, basic SDK',
    status: 'completed' as const,
  },
  {
    phase: 'Phase 2',
    title: 'Developer Preview',
    desc: 'Full SDK release, Solidity integrations, documentation',
    status: 'completed' as const,
  },
  {
    phase: 'Phase 3',
    title: 'Security Audits',
    desc: 'Independent audits by Trail of Bits and OpenZeppelin',
    status: 'active' as const,
  },
  {
    phase: 'Phase 4',
    title: 'Mainnet Launch',
    desc: 'Production deployment, cross-chain bridges, governance',
    status: 'upcoming' as const,
  },
];

const METRICS = [
  { value: '2.4M+', label: 'Proofs Generated' },
  { value: '$180M+', label: 'Value Secured' },
  { value: '12,400+', label: 'Developers' },
  { value: '99.97%', label: 'Uptime' },
];

/* ------------------------------------------------------------------ */
/*  Metric formatters                                                 */
/* ------------------------------------------------------------------ */

function formatProofs(n: number): string {
  const m = n / 1_000_000;
  return `${m.toFixed(1)}M+`;
}
function formatValue(n: number): string {
  const m = n / 1_000_000;
  return `$${Math.round(m)}M+`;
}
function formatDevs(n: number): string {
  return `${n.toLocaleString()}+`;
}
function formatUptime(n: number): string {
  return `${n.toFixed(2)}%`;
}

const TEAM_MEMBERS = [
  { name: 'Alex Chen', role: 'Co-Founder & CEO', bio: 'Former protocol engineer at Ethereum Foundation. ZK circuit design and cryptographic protocol architecture.', socials: { x: '#', github: '#' } },
  { name: 'Dr. Sarah Kim', role: 'Co-Founder & CTO', bio: 'PhD in cryptographic protocols from MIT. Led privacy research at Trail of Bits for 4 years.', socials: { x: '#', github: '#' } },
  { name: 'Marcus Webb', role: 'Lead Engineer', bio: 'Core contributor to PLONK proof system. Previously at Consensys and Polygon Zero.', socials: { x: '#', github: '#' } },
  { name: 'Yuki Tanaka', role: 'Head of Research', bio: 'Published 12 peer-reviewed papers on MPC and FHE. Former research scientist at DFINITY.', socials: { x: '#', github: '#' } },
];

const PARTNERS = [
  'Ethereum Foundation',
  'a16z Crypto',
  'Paradigm',
  'Polygon Labs',
  'Consensys',
  'Gitcoin',
];

const MARQUEE_ITEMS = [
  'Testnet Live',
  '2.4M+ Proofs Generated',
  'Audited by Trail of Bits',
  'Open Source MIT/Apache-2.0',
  '12,400+ Developers',
  '99.97% Uptime',
  'Ethereum + Polygon + Arbitrum',
];

const USE_CASES = [
  {
    tab: 'DeFi',
    icon: Coins,
    title: 'Private DeFi',
    desc: 'Private swaps, lending, and yield strategies. Users can transact without exposing portfolio holdings, transaction amounts, or trading strategies to the public mempool.',
    stats: ['Private AMM pools', 'Shielded lending protocols', 'Confidential governance votes'],
  },
  {
    tab: 'Healthcare',
    icon: HeartPulse,
    title: 'Healthcare Data',
    desc: 'Enable HIPAA-compliant data sharing between institutions. Prove patient eligibility or treatment outcomes without exposing individual medical records.',
    stats: ['Encrypted patient records', 'Cross-institution verification', 'Compliance-ready audits'],
  },
  {
    tab: 'Enterprise',
    icon: Building2,
    title: 'Enterprise Solutions',
    desc: 'Private supply chain verification, confidential business analytics, and secure data collaboration between organizations without revealing proprietary information.',
    stats: ['Supply chain proof', 'Confidential analytics', 'Multi-party computation'],
  },
  {
    tab: 'Governance',
    icon: Vote,
    title: 'DAO Governance',
    desc: 'Commitment-based voting where preferences remain private until the reveal phase. Prevents vote buying and bandwagon effects in decentralized governance.',
    stats: ['Commit-reveal voting', 'Delegation privacy', 'Quadratic voting support'],
  },
];

const SECURITY_ITEMS = [
  { icon: Shield, title: 'End-to-End Encryption', desc: 'All data is encrypted before leaving the client. Our protocol never sees plaintext.' },
  { icon: Lock, title: 'Formally Verified Circuits', desc: 'Core ZK circuits verified using CirC and Lean 4 formal methods.' },
  { icon: CheckCircle2, title: 'Independent Audits', desc: 'Audited by Trail of Bits (2024) and OpenZeppelin (2025). Reports public.' },
  { icon: FileCode2, title: 'Bug Bounty Program', desc: 'Up to $500K bounty for critical vulnerabilities. Responsible disclosure.' },
];

const CHANGELOG = [
  { version: 'v0.3.0', date: 'Jun 2025', title: 'Developer Preview', items: ['Full SDK release with TypeScript support', 'Solidity integration library', 'Interactive documentation portal', 'GitHub CI/CD templates'] },
  { version: 'v0.2.0', date: 'Mar 2025', title: 'Testnet Expansion', items: ['Polygon and Arbitrum testnet support', 'Cross-chain proof verification', 'Developer dashboard beta', 'FHE module preview'] },
  { version: 'v0.1.0', date: 'Dec 2024', title: 'Initial Testnet', items: ['Core ZK circuit library', 'Encrypted state model', 'Basic REST API', 'Ethereum Sepolia deployment'] },
];

const CODE_STRING = `pragma solidity 0.8.24;
import {@noVault/sdk/"PrivateVault.sol"};

contract EncryptedAssetVault is PrivateVault {
    using ZkCipher for bytes32;

    function transfer(
        address to,
        uint256 amount
    ) external {
        // Encrypt inputs client-side
        Ciphertext ct = ZkCipher.encrypt(amount, msg.sender);
        // Generate ZK proof of valid transfer
        Proof proof = ZkProver.proveTransfer(ct, to);
        // Settle on-chain \u2014 amount never revealed
        _vault.settle(proof, ct, to);
    }
}`;

/* ------------------------------------------------------------------ */
/*  S1: Typewriter data                                               */
/* ------------------------------------------------------------------ */

const TYPEWRITER_PHRASES = [
  'user data stays encrypted',
  'computation never reveals secrets',
  'privacy is not optional',
];

/* ------------------------------------------------------------------ */
/*  F2: Pricing data                                                  */
/* ------------------------------------------------------------------ */

const PRICING = [
  { tier: 'Explorer', price: 'Free', period: '', desc: 'For individual developers exploring privacy primitives.', features: ['Up to 1,000 proofs/month', 'Testnet access', 'Community support', 'Basic SDK', 'Public documentation'], cta: 'Start Free', highlighted: false },
  { tier: 'Builder', price: '$49', period: '/mo', desc: 'For teams building production privacy applications.', features: ['Unlimited proofs', 'Mainnet access', 'Priority support', 'Full SDK + plugins', 'Private Slack channel', 'Custom circuit templates'], cta: 'Get Started', highlighted: true },
  { tier: 'Enterprise', price: 'Custom', period: '', desc: 'For organizations requiring institutional-grade privacy.', features: ['Dedicated proving network', 'SLA guarantees', '24/7 support', 'Custom integrations', 'On-premise deployment', 'Formal verification reports'], cta: 'Contact Sales', highlighted: false },
];

/* ------------------------------------------------------------------ */
/*  F3: Blog data                                                     */
/* ------------------------------------------------------------------ */

const BLOG_POSTS = [
  { title: 'Announcing noVault v0.3: Developer Preview', excerpt: 'Today we are releasing the full developer preview of noVault, including our TypeScript SDK, Solidity integration library, and interactive documentation.', date: 'Jun 12, 2025', readTime: '5 min read', tag: 'Release' },
  { title: 'How Zero-Knowledge Proofs Enable Private DeFi', excerpt: 'A deep dive into the cryptographic primitives behind noVault and how they enable a new class of private financial applications on Ethereum.', date: 'May 28, 2025', readTime: '8 min read', tag: 'Technical' },
  { title: 'Our Security Audit Journey with Trail of Bits', excerpt: 'A transparent look at our 3-month security audit process, findings, and how we achieved zero critical vulnerabilities.', date: 'Apr 15, 2025', readTime: '6 min read', tag: 'Security' },
];

/* ------------------------------------------------------------------ */
/*  F4: Terminal animation data                                       */
/* ------------------------------------------------------------------ */

const TERMINAL_LINES = [
  { type: 'system', text: '$ novault prove --circuit transfer --input encrypted_state.json' },
  { type: 'success', text: '✓ Circuit compiled (2.1ms)' },
  { type: 'system', text: '→ Generating witness...' },
  { type: 'success', text: '✓ Witness generated (0.8ms)' },
  { type: 'system', text: '→ Creating ZK proof...' },
  { type: 'success', text: '✓ Proof generated (3.2ms) — 847 bytes' },
  { type: 'success', text: '✓ Proof verified on-chain — tx: 0x7f3a...e2c1' },
  { type: 'dim', text: '' },
  { type: 'system', text: '$ novault status' },
  { type: 'info', text: '  Network:  testnet (Sepolia)' },
  { type: 'info', text: '  Proofs:   2,418,392 generated' },
  { type: 'info', text: '  Uptime:   99.97%' },
  { type: 'dim', text: '' },
  { type: 'prompt', text: '$ _' },
];

/* ------------------------------------------------------------------ */
/*  F1: Architecture nodes                                            */
/* ------------------------------------------------------------------ */

const ARCHITECTURE_NODES = [
  { icon: User, title: 'User Client', desc: 'Encrypts data client-side before it ever touches the network.' },
  { icon: Lock, title: 'Encryption Layer', desc: 'FHE + MPC encrypted computation engine processes data without decryption.' },
  { icon: Shield, title: 'ZK Prover Network', desc: 'Distributed zero-knowledge proof generation with sub-4ms latency.' },
  { icon: Database, title: 'On-Chain Settlement', desc: 'Verifiable results anchored to L1 with cryptographic guarantees.' },
];

/* ------------------------------------------------------------------ */
/*  F2: Testimonials                                                  */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  { quote: 'noVault changed how we think about on-chain privacy. The SDK is incredibly intuitive and the proof generation is lightning fast.', name: 'Sarah Mitchell', role: 'Lead Protocol Engineer', company: 'Lido', stars: 5 },
  { quote: 'We integrated noVault into our healthcare data pipeline in under a week. The FHE support is genuinely production-ready.', name: 'Dr. James Park', role: 'CTO', company: 'MediChain Labs', stars: 5 },
  { quote: 'The formal verification of their ZK circuits gives us confidence no other privacy protocol can match. This is institutional-grade infrastructure.', name: 'Elena Vasquez', role: 'Head of DeFi', company: 'Paradigm', stars: 5 },
];

/* ------------------------------------------------------------------ */
/*  F4: Comparison data                                               */
/* ------------------------------------------------------------------ */

const COMPARE_DATA = [
  { row: 'Privacy Level', novault: 'Full', zkBridges: 'Partial', basic: 'Basic' },
  { row: 'Proof Generation', novault: '<4ms', zkBridges: '30-60s', basic: 'N/A' },
  { row: 'Cross-Chain', novault: 'Native', zkBridges: 'Limited', basic: 'None' },
  { row: 'Open Source', novault: 'Yes', zkBridges: 'Varies', basic: 'No' },
  { row: 'Audit Status', novault: '3 Audits', zkBridges: '1 Audit', basic: 'None' },
];

/* ------------------------------------------------------------------ */
/*  F5: Protocol Activity Graph data (7 rows × 20 cols = 140)        */
/* ------------------------------------------------------------------ */

const ACTIVITY_DATA = Array.from({ length: 140 }, (_, i) => {
  const row = i % 7;
  const col = Math.floor(i / 7);
  return (row * 31 + col * 17 + 7) % 5;
});

const ACTIVITY_SHADES = [
  'bg-primary/10',
  'bg-primary/20',
  'bg-primary/35',
  'bg-primary/55',
  'bg-primary/75',
];

/* ------------------------------------------------------------------ */
/*  F3: Command Palette items                                         */
/* ------------------------------------------------------------------ */

const CMD_PALETTE_ITEMS = [
  ...NAV_LINKS.map(l => ({ label: l.label, href: l.href, type: 'scroll' as const })),
  { label: 'Waitlist', href: '#waitlist', type: 'scroll' as const },
  { label: 'Contact', href: '#contact', type: 'scroll' as const },
  { label: 'Architecture', href: '#architecture', type: 'scroll' as const },
  { label: 'Compare', href: '#compare', type: 'scroll' as const },
  { label: 'Pricing', href: '#pricing', type: 'scroll' as const },
  { label: 'Blog', href: '#blog', type: 'scroll' as const },
  { label: 'Terms of Service', type: 'terms' as const },
  { label: 'Privacy Policy', type: 'privacy' as const },
];

/* ------------------------------------------------------------------ */
/*  Terms & Privacy content                                           */
/* ------------------------------------------------------------------ */

const TERMS_CONTENT = (
  <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
    <p><strong className="text-foreground">1. Acceptance of Terms</strong><br />
    By accessing or using the noVault platform, services, or any associated software (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Services. We reserve the right to modify these Terms at any time, and continued use of the Services constitutes acceptance of such modifications.</p>
    <p><strong className="text-foreground">2. Description of Services</strong><br />
    noVault provides decentralized privacy infrastructure for Web3 applications, including but not limited to zero-knowledge proof generation, encrypted computation services, developer SDKs, and cross-chain privacy protocols. The Services are provided on an "as is" and "as available" basis. We make no guarantees regarding uptime, availability, or fitness for any particular purpose.</p>
    <p><strong className="text-foreground">3. User Responsibilities</strong><br />
    You are solely responsible for maintaining the security of any private keys, credentials, or authentication mechanisms you use in connection with the Services. You agree not to: (a) use the Services for any unlawful purpose; (b) attempt to gain unauthorized access to any portion of the Services; (c) interfere with or disrupt the integrity or performance of the Services; (d) attempt to reverse-engineer, decompile, or disassemble any portion of the Services, except as permitted by applicable law.</p>
    <p><strong className="text-foreground">4. Intellectual Property</strong><br />
    All intellectual property rights in the Services, including but not limited to software, documentation, trademarks, and trade secrets, are owned by or licensed to noVault. The open-source components of our codebase are released under their respective licenses, as documented in our public repositories. Nothing in these Terms grants you any rights to the noVault name, logo, or trademarks.</p>
    <p><strong className="text-foreground">5. Disclaimer of Warranties</strong><br />
    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM NOVAULT OR THROUGH THE SERVICES WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS.</p>
    <p><strong className="text-foreground">6. Limitation of Liability</strong><br />
    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL NOVAULT, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS ($100) OR THE AMOUNT YOU PAID TO NOVAULT IN THE TWELVE MONTHS PRECEDING THE CLAIM.</p>
    <p><strong className="text-foreground">7. Governing Law</strong><br />
    These Terms shall be governed by and construed in accordance with applicable federal laws and the laws of the jurisdiction in which noVault is organized, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved through binding arbitration in accordance with the rules of the applicable arbitration body.</p>
    <p><strong className="text-foreground">8. Contact Information</strong><br />
    For questions about these Terms, please contact us at legal@novault.io or through our official channels on X (@novaultech).</p>
  </div>
);

const PRIVACY_CONTENT = (
  <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
    <p><strong className="text-foreground">1. Information We Collect</strong><br />
    noVault is designed with a privacy-first architecture. We collect minimal data necessary to operate our Services. This may include: (a) anonymized usage metrics such as API call volumes and error rates; (b) public on-chain transaction data that is inherently visible on the blockchain; (c) information you voluntarily provide when contacting our team. We do not collect, store, or have access to the plaintext content of your encrypted data or private keys.</p>
    <p><strong className="text-foreground">2. Use of Information</strong><br />
    Any information collected is used solely for the purposes of: (a) maintaining and improving the reliability and performance of the Services; (b) detecting and preventing security incidents or abuse; (c) complying with applicable legal obligations; (d) communicating with you regarding the Services when necessary. We will never sell your personal information to third parties.</p>
    <p><strong className="text-foreground">3. Data Protection</strong><br />
    We implement industry-standard security measures to protect any data we process. This includes encryption at rest and in transit, access controls, and regular security audits by independent third-party firms. Our zero-knowledge architecture ensures that sensitive user data remains encrypted and is never exposed to our servers or any third party.</p>
    <p><strong className="text-foreground">4. Cookies and Tracking</strong><br />
    Our website may use strictly necessary cookies for basic functionality. We do not use advertising trackers, third-party analytics cookies, or any tracking pixels. Any cookies used are essential for the operation of the site and are not used for behavioral profiling or targeted advertising.</p>
    <p><strong className="text-foreground">5. Third-Party Services</strong><br />
    The Services may integrate with or link to third-party blockchain networks, RPC providers, and infrastructure services. Each third-party service is governed by its own privacy policy. We encourage you to review the privacy practices of any third-party services you interact with through our platform. We are not responsible for the data practices of third-party services.</p>
    <p><strong className="text-foreground">6. Your Rights</strong><br />
    Depending on your jurisdiction, you may have the right to: (a) access any personal data we hold about you; (b) request correction or deletion of your personal data; (c) object to or restrict processing of your data; (d) request data portability. To exercise any of these rights, please contact us at privacy@novault.io. We will respond to all legitimate requests within thirty (30) days.</p>
    <p><strong className="text-foreground">7. Changes to This Policy</strong><br />
    We may update this Privacy Policy from time to time. Material changes will be communicated through our official channels. Your continued use of the Services after any changes constitutes acceptance of the updated policy. We encourage you to review this page periodically for the latest information on our privacy practices.</p>
    <p><strong className="text-foreground">8. Contact Information</strong><br />
    For privacy-related inquiries, please contact us at privacy@novault.io or through our official channels on X (@novaultech).</p>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [liveMetrics, setLiveMetrics] = useState<null | Record<string, unknown>>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSending, setContactSending] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  /* S1: Typewriter state */
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterPhraseIdx, setTypewriterPhraseIdx] = useState(0);
  const [typewriterDeleting, setTypewriterDeleting] = useState(false);

  /* S4: Active nav section */
  const [activeSection, setActiveSection] = useState('');

  /* F3: Command Palette state */
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [cmdPaletteSearch, setCmdPaletteSearch] = useState('');

  /* F1: Cookie consent state */
  const [cookieConsent, setCookieConsent] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('novault-cookies') === 'accepted';
    } catch {
      return false;
    }
  });
  const [terminalLineIdx, setTerminalLineIdx] = useState(0);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Expose dialog openers to window
  useEffect(() => {
    (window as unknown as Record<string, unknown>).openTermsDialog = () => setTermsOpen(true);
    (window as unknown as Record<string, unknown>).openPrivacyDialog = () => setPrivacyOpen(true);
  }, []);

  // Navbar scroll detection + scroll progress + back-to-top
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 20);
      setShowBackToTop(sy > 400);
      const docH = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (sy / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch live metrics
  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.json())
      .then(setLiveMetrics)
      .catch(() => {}); // Silently fail, use defaults
  }, []);

  // Fetch waitlist count
  useEffect(() => {
    fetch('/api/waitlist')
      .then(r => r.json())
      .then(d => setWaitlistCount(d.count ?? null))
      .catch(() => {});
  }, []);

  /* S1: Typewriter effect */
  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[typewriterPhraseIdx];
    const timeout = setTimeout(() => {
      if (!typewriterDeleting) {
        if (typewriterText.length < currentPhrase.length) {
          setTypewriterText(currentPhrase.slice(0, typewriterText.length + 1));
        } else {
          setTimeout(() => setTypewriterDeleting(true), 1800);
          return;
        }
      } else {
        if (typewriterText.length > 0) {
          setTypewriterText(typewriterText.slice(0, -1));
        } else {
          setTypewriterDeleting(false);
          setTypewriterPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, typewriterDeleting ? 40 : 70);
    return () => clearTimeout(timeout);
  }, [typewriterText, typewriterPhraseIdx, typewriterDeleting]);

  /* S4: Active nav section tracking */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  /* F3: Command Palette keyboard shortcut */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(prev => {
          if (!prev) setCmdPaletteSearch('');
          return !prev;
        });
      }
      if (e.key === 'Escape' && cmdPaletteOpen) {
        setCmdPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cmdPaletteOpen]);

  /* F4: Terminal IntersectionObserver */
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTerminalVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* F4: Terminal line increment */
  useEffect(() => {
    if (!terminalVisible) return;
    if (terminalLineIdx >= TERMINAL_LINES.length) return;
    const timer = setInterval(() => {
      setTerminalLineIdx(prev => {
        if (prev >= TERMINAL_LINES.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [terminalVisible, terminalLineIdx]);

  /* F5: Notification toast on page load */
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info('New proof verified on testnet', {
        description: 'Transfer proof #2,418,393 settled in 3.1ms',
        duration: 5000,
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll handler
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(CODE_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setContactSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message sent!', { description: "We'll get back to you within 24 hours." });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
    setContactSending(false);
  };

  const handleWaitlist = useCallback(async () => {
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setWaitlistCount(data.count);
        toast.success("You're on the list!", { description: `You're #${data.count} on the list!` });
        setWaitlistEmail('');
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch {
      toast.error('Failed to join waitlist. Please try again.');
    }
  }, [waitlistEmail]);

  /* F3: Command Palette item selection handler */
  const handleCmdSelect = useCallback((item: typeof CMD_PALETTE_ITEMS[number]) => {
    setCmdPaletteOpen(false);
    setCmdPaletteSearch('');
    if (item.type === 'scroll' && item.href) {
      setTimeout(() => {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (item.type === 'terms') {
      setTermsOpen(true);
    } else if (item.type === 'privacy') {
      setPrivacyOpen(true);
    }
  }, []);

  const filteredCmdItems = CMD_PALETTE_ITEMS.filter(item =>
    item.label.toLowerCase().includes(cmdPaletteSearch.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden flex flex-col min-h-screen">
      {/* ===== SCROLL PROGRESS BAR ===== */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <Image src="/novault-logo.png" alt="noVault" width={32} height={32} className="rounded-sm" />
            <span className="font-mono font-bold text-lg tracking-tight">
              no<span className="text-primary">Vault</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const sectionId = l.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'text-foreground border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
            {/* F3: ⌘K hint */}
            <button
              onClick={() => { setCmdPaletteSearch(''); setCmdPaletteOpen(true); }}
              className="ml-2 px-2 py-1 text-xs text-muted-foreground/50 hover:text-muted-foreground border border-border rounded-md hover:border-primary/30 transition-colors hidden lg:inline-flex items-center gap-1.5"
            >
              <Search className="size-3" />
              <span className="font-mono">⌘K</span>
            </button>
            <Button size="sm" className="ml-2">
              Launch App <ArrowRight className="size-3.5" />
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="font-mono font-bold">
                    no<span className="text-primary">Vault</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 px-4 mt-4">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    >
                      {l.label}
                    </a>
                  ))}
                  <Separator className="my-2" />
                  <Button className="mt-1">
                    Launch App <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center noise-overlay">
        {/* Background image */}
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background z-[1]" />
        {/* S2: Particle/Mesh Network Canvas (now interactive) */}
        <ParticleMesh className="absolute inset-0 z-[2] pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,oklch(0.72_0.17_162/0.08),transparent)]" />
        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-[20%] left-[10%] size-[300px] md:size-[500px] rounded-full bg-primary/5 blur-[80px] pointer-events-none z-[5]"
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] size-[200px] md:size-[400px] rounded-full bg-primary/8 blur-[60px] pointer-events-none z-[5]"
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[60%] left-[50%] size-[150px] rounded-full bg-emerald-500/5 blur-[40px] pointer-events-none z-[5]"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          {/* Testnet Active Badge */}
          <motion.div
            variants={heroFadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8"
          >
            <span className="animate-pulse-dot size-2 rounded-full bg-primary" />
            <span className="text-xs font-mono text-primary">Testnet Active</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            className="font-bold tracking-tight leading-[1.08]"
          >
            <motion.span
              variants={heroFadeUp}
              custom={1}
              className="block text-4xl md:text-6xl lg:text-7xl"
            >
              Private-by-Default
            </motion.span>
            <motion.span
              variants={heroFadeUp}
              custom={2}
              className="block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent mt-1"
            >
              Infrastructure
            </motion.span>
            <motion.span
              variants={heroFadeUp}
              custom={3}
              className="block text-4xl md:text-6xl lg:text-7xl text-muted-foreground mt-1"
            >
              for the Next Internet
            </motion.span>
          </motion.h1>

          {/* S1: Typewriter subtitle */}
          <motion.p
            variants={heroFadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Cryptographic privacy primitives for Web3.{' '}
            <span className="text-foreground/90">{typewriterText}</span>
            <span className="border-r-2 border-primary animate-pulse" />
          </motion.p>

          {/* S3: CTA buttons with animated gradient border */}
          <motion.div
            variants={heroFadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <span className="animate-cta-glow">
              <Button size="lg" className="relative z-10 text-base px-8">
                Start Building <ArrowRight className="size-4" />
              </Button>
            </span>
            <span className="animate-cta-glow">
              <Button variant="outline" size="lg" className="relative z-10 text-base px-8">
                Read the Docs <ExternalLink className="size-4" />
              </Button>
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== MARQUEE TICKER BAR ===== */}
      <div className="border-b border-border bg-card/30 py-2 text-xs font-mono text-muted-foreground/70 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="size-1 rounded-full bg-primary/40" />
            </span>
          ))}
        </div>
      </div>

      {/* ===== TECH STACK BAR ===== */}
      <SectionWrapper>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8"
          >
            Built on Proven Technology
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {TECH_STACK.map((t, i) => (
              <span key={t} className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground/80 font-mono">{t}</span>
                {i < TECH_STACK.length - 1 && (
                  <span className="hidden sm:inline-block size-1 rounded-full bg-muted-foreground/30" />
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* ===== PROTOCOL METRICS BAR ===== */}
      <SectionWrapper>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader
            label="Protocol"
            title="By the Numbers"
            subtitle="Real-time metrics from the noVault testnet."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-14">
            {([
              {
                value: liveMetrics
                  ? formatProofs(liveMetrics.proofsGenerated as number)
                  : METRICS[0].value,
                label: METRICS[0].label,
              },
              {
                value: liveMetrics
                  ? formatValue(liveMetrics.valueSecured as number)
                  : METRICS[1].value,
                label: METRICS[1].label,
              },
              {
                value: liveMetrics
                  ? formatDevs(liveMetrics.developers as number)
                  : METRICS[2].value,
                label: METRICS[2].label,
              },
              {
                value: liveMetrics
                  ? formatUptime(liveMetrics.uptime as number)
                  : METRICS[3].value,
                label: METRICS[3].label,
              },
            ] as const).map((m, i) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-border bg-card/50 p-4 sm:p-6 text-center hover:-translate-y-1 hover:shadow-[0_4px_20px_oklch(0.72_0.17_162/0.08)] transition-all duration-300"
              >
                <div className="text-xl sm:text-2xl font-bold font-mono text-primary">
                  {m.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
          {liveMetrics && (
            <div className="flex items-center justify-center mt-6 gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-primary" />
              </span>
              <span className="text-xs font-mono text-primary">Live</span>
            </div>
          )}

          {/* F5: Protocol Activity Graph */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="mt-14"
          >
            <p className="text-xs font-mono text-muted-foreground mb-4 text-center">Protocol Activity (20 weeks)</p>
            <div className="overflow-x-auto">
              <div
                className="grid gap-[3px] mx-auto"
                style={{
                  gridTemplateRows: 'repeat(7, 1fr)',
                  gridTemplateColumns: 'repeat(20, 1fr)',
                  width: 'fit-content',
                }}
              >
                {ACTIVITY_DATA.map((level, i) => (
                  <div
                    key={i}
                    className={`rounded-[2px] ${ACTIVITY_SHADES[level]} size-2 sm:size-[8px]`}
                    title={`Activity level: ${level}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* ===== FEATURES (S8: staggered children) ===== */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Features"
            title="Privacy That Doesn't Compromise"
            subtitle="Every component is designed so you never have to choose between functionality and privacy."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16"
          >
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} variants={staggerItem}>
                <FeatureCard {...f} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <SectionDivider />
      <section id="usecases" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Use Cases"
            title="Privacy for Every Industry"
            subtitle="From DeFi to healthcare — noVault enables confidential computation across sectors."
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mt-14"
          >
            <Tabs defaultValue="DeFi">
              <TabsList className="bg-card/50 border border-border rounded-lg p-1 h-auto flex flex-wrap">
                {USE_CASES.map((uc) => (
                  <TabsTrigger
                    key={uc.tab}
                    value={uc.tab}
                    className="text-xs font-mono px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md"
                  >
                    {uc.tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {USE_CASES.map((uc) => (
                <TabsContent key={uc.tab} value={uc.tab} className="mt-8 rounded-lg border border-border bg-card p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="size-10 shrink-0 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                      <uc.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{uc.desc}</p>
                      <ul className="mt-4 space-y-2">
                        {uc.stats.map((stat) => (
                          <li key={stat} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                            <span>{stat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== PROTOCOL ===== */}
      <section id="protocol" className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Protocol"
            title="How noVault Works"
            subtitle="Three steps. Zero plaintext exposure. Cryptographic certainty."
          />

          <div className="mt-16 relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-16">
              {PROTOCOL_STEPS.map((step, i) => (
                <ProtocolStep key={step.num} {...step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== F1: ARCHITECTURE ===== */}
      <section id="architecture" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Architecture"
            title="End-to-End Privacy Pipeline"
            subtitle="A visual overview of how data flows through noVault's privacy stack."
          />

          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex items-stretch mt-16 gap-0">
            {ARCHITECTURE_NODES.map((node, i) => (
              <Fragment key={node.title}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex-1 rounded-lg border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <node.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{node.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{node.desc}</p>
                </motion.div>
                {i < ARCHITECTURE_NODES.length - 1 && (
                  <div className="flex items-center px-2 shrink-0">
                    <div className="flex-1 h-px dash-line-h" />
                    <ArrowRight className="size-4 text-primary/40 -ml-1" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Mobile: vertical layout */}
          <div className="md:hidden flex flex-col items-center mt-16 gap-0">
            {ARCHITECTURE_NODES.map((node, i) => (
              <Fragment key={node.title}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="w-full rounded-lg border border-border bg-card p-6 text-center"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <node.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{node.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{node.desc}</p>
                </motion.div>
                {i < ARCHITECTURE_NODES.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <div className="w-px h-8 dash-line-v" />
                    <ArrowRight className="size-4 text-primary/40 -mt-1 rotate-90" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== ROADMAP ===== */}
      <section id="roadmap" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Roadmap"
            title="The Path Forward"
            subtitle="Our public development milestones. Every commitment, on-chain."
          />

          <div className="mt-16">
            {/* Desktop: horizontal card timeline */}
            <div className="hidden md:block relative">
              {/* Connecting line */}
              <div className="absolute top-8 left-[calc(12.5%+10px)] right-[calc(12.5%+10px)] h-px bg-border" />
              <div className="grid grid-cols-4 gap-5">
                {ROADMAP.map((m, i) => (
                  <motion.div
                    key={m.phase}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className={`rounded-lg border bg-card p-5 text-center relative ${
                      m.status === 'completed'
                        ? 'border-primary/20 bg-primary/5'
                        : m.status === 'active'
                          ? 'border-primary/40 shadow-[0_0_15px_oklch(0.72_0.17_162/0.1)]'
                          : 'opacity-70'
                    }`}
                  >
                    {/* Status dot above card */}
                    <div className="absolute -top-[9px] left-1/2 -translate-x-1/2">
                      {m.status === 'completed' && (
                        <CheckCircle2 className="size-[18px] text-primary bg-card rounded-full" />
                      )}
                      {m.status === 'active' && (
                        <span className="animate-pulse-dot block size-[18px] rounded-full bg-primary ring-4 ring-primary/20" />
                      )}
                      {m.status === 'upcoming' && (
                        <span className="block size-[18px] rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mb-2">{m.phase}</p>
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{m.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: vertical card timeline */}
            <div className="md:hidden relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {ROADMAP.map((m, i) => (
                  <motion.div
                    key={m.phase}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className="relative pl-14"
                  >
                    <div className="absolute left-[14px] top-4 -translate-x-1/2">
                      {m.status === 'completed' && (
                        <CheckCircle2 className="size-5 text-primary" />
                      )}
                      {m.status === 'active' && (
                        <span className="animate-pulse-dot block size-3 rounded-full bg-primary ring-4 ring-primary/20" />
                      )}
                      {m.status === 'upcoming' && (
                        <span className="block size-3 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    <div className={`rounded-lg border bg-card p-5 ${
                      m.status === 'completed'
                        ? 'border-primary/20 bg-primary/5'
                        : m.status === 'active'
                          ? 'border-primary/40 shadow-[0_0_15px_oklch(0.72_0.17_162/0.1)]'
                          : 'opacity-70'
                    }`}>
                      <p className="text-xs font-mono text-muted-foreground mb-1">{m.phase}</p>
                      <h3 className="font-semibold text-sm">{m.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CHANGELOG ===== */}
      <SectionDivider />
      <section id="changelog" className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Changelog"
            title="Recent Updates"
            subtitle="Every release is documented. Every change is auditable."
          />

          <div className="mt-14 space-y-8">
            {CHANGELOG.map((entry, i) => (
              <motion.div
                key={entry.version}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="relative rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-md">{entry.version}</span>
                  <span className="text-xs font-mono text-muted-foreground">{entry.date}</span>
                </div>
                <h3 className="font-semibold text-base">{entry.title}</h3>
                <ul className="mt-3 space-y-2">
                  {entry.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-primary/60 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== F3: BLOG ===== */}
      <SectionDivider />
      <section id="blog" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Blog"
            title="Latest from noVault"
            subtitle="Stay up to date with our latest releases, research, and security updates."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
            {BLOG_POSTS.map((post, i) => (
              <motion.div
                key={post.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors duration-300"
              >
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-mono mb-4">
                  <Tag className="size-3 mr-1" />
                  {post.tag}
                </Badge>
                <h3 className="font-semibold text-base leading-snug">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {post.readTime}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== DEVELOPERS ===== */}
      <section id="developers" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Developers"
            title="Built for Developers"
            subtitle="Integrate privacy into your application with a few lines of code."
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mt-14 rounded-lg border border-border bg-card overflow-hidden scan-line"
          >
            {/* Code block header with copy button */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <span className="size-3 rounded-full bg-muted-foreground/30" />
              <span className="size-3 rounded-full bg-muted-foreground/20" />
              <span className="size-3 rounded-full bg-muted-foreground/10" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">PrivateVault.sol</span>
              <button
                onClick={handleCopyCode}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                aria-label="Copy code"
              >
                {copied ? <CheckCircle2 className="size-4 text-primary" /> : <Copy className="size-4" />}
              </button>
            </div>
            {/* Code content with S6: line numbers */}
            <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-7 overflow-x-auto">
              <CodeLine indent={0} lineNum={1}><KW>pragma</KW> solidity <Num>0.8.24</Num>;</CodeLine>
              <CodeLine indent={0} lineNum={2}><KW>import</KW> {"{@noVault/sdk/"}<Str>"PrivateVault.sol"</Str>;</CodeLine>
              <CodeLine lineNum={3} />
              <CodeLine indent={0} lineNum={4}><KW>contract</KW> <Fn>EncryptedAssetVault</Fn> <KW>is</KW> <Type>PrivateVault</Type> {'{'}</CodeLine>
              <CodeLine indent={1} lineNum={5}><KW>using</KW> <Type>ZkCipher</Type> <KW>for</KW> <Type>bytes32</Type>;</CodeLine>
              <CodeLine lineNum={6} />
              <CodeLine indent={1} lineNum={7}><Fn>function</Fn> <Fn>transfer</Fn>(
                <Type>address</Type> <Var>to</Var>,
                <Type>uint256</Type> <Var>amount</Var>
              ) <KW>external</KW> {'{'}</CodeLine>
              <CodeLine indent={2} lineNum={8}><Com>{'// Encrypt inputs client-side'}</Com></CodeLine>
              <CodeLine indent={2} lineNum={9}><Type>Ciphertext</Type> <Var>ct</Var> = <Type>ZkCipher</Type>.<Fn>encrypt</Fn>(<Var>amount</Var>, <Var>msg.sender</Var>);</CodeLine>
              <CodeLine indent={2} lineNum={10}><Com>{'// Generate ZK proof of valid transfer'}</Com></CodeLine>
              <CodeLine indent={2} lineNum={11}><Type>Proof</Type> <Var>proof</Var> = <Type>ZkProver</Type>.<Fn>proveTransfer</Fn>(<Var>ct</Var>, <Var>to</Var>);</CodeLine>
              <CodeLine indent={2} lineNum={12}><Com>{'// Settle on-chain \u2014 amount never revealed'}</Com></CodeLine>
              <CodeLine indent={2} lineNum={13}><Type>_vault</Type>.<Fn>settle</Fn>(<Var>proof</Var>, <Var>ct</Var>, <Var>to</Var>);</CodeLine>
              <CodeLine indent={1} lineNum={14}>{'}'}</CodeLine>
              <CodeLine indent={0} lineNum={15}>{'}'}</CodeLine>
            </div>
          </motion.div>

          {/* F4: Live Terminal Animation */}
          <div ref={terminalRef} className="mt-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={4}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <span className="size-3 rounded-full bg-muted-foreground/30" />
                <span className="size-3 rounded-full bg-muted-foreground/20" />
                <span className="size-3 rounded-full bg-muted-foreground/10" />
                <span className="ml-3 text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <TerminalSquare className="size-3" />
                  noVault Terminal
                </span>
              </div>
              {/* Terminal content */}
              <div className="p-4 font-mono text-xs sm:text-sm leading-6 min-h-[200px] bg-background">
                {TERMINAL_LINES.slice(0, terminalLineIdx + 1).map((line, li) => (
                  <div
                    key={li}
                    className={`terminal-line ${
                      line.type === 'success' ? 'text-primary' :
                      line.type === 'info' ? 'text-muted-foreground' :
                      line.type === 'dim' ? 'text-muted-foreground/40' :
                      'text-foreground'
                    }`}
                  >
                    {line.text || ' '}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats with Animated Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { value: 4, suffix: 'ms', label: 'Proof Latency' },
              { value: 1, prefix: '<', suffix: 'kb', label: 'Proof Size' },
              { value: 10, suffix: 'M+', label: 'Operations Supported' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                className="rounded-lg border border-border bg-card p-6 text-center hover:-translate-y-1 hover:shadow-[0_4px_20px_oklch(0.72_0.17_162/0.08)] transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold font-mono text-primary">
                  <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <SectionDivider />
      <section id="security" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,oklch(0.72_0.17_162/0.06),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Security"
            title="Security First, Always"
            subtitle="Multiple layers of protection from formally verified circuits to independent audits."
          />

          {/* Security stat counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-14 mb-10">
            {[
              { value: 3, suffix: '', label: 'Audits Completed' },
              { value: 500, prefix: '$', suffix: 'K', label: 'Max Bounty' },
              { value: 0, suffix: '', label: 'Critical Findings' },
              { value: 24, suffix: '/7', label: 'Monitoring' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-border bg-card/50 p-4 sm:p-5 text-center"
              >
                <div className="text-xl sm:text-2xl font-bold font-mono text-primary">
                  <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Security cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SECURITY_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about building with noVault."
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mt-14"
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQ_DATA.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-border data-[state=open]:border-l-2 data-[state=open]:border-l-primary"
                >
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-foreground py-5">
                    <span className="flex items-center">
                      <span className="text-xs font-mono text-primary/50 mr-3">{String(i + 1).padStart(2, '0')}</span>
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== F4: COMPARISON TABLE ===== */}
      <section id="compare" className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Compare"
            title="Why noVault?"
            subtitle="See how noVault stacks up against other privacy approaches."
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mt-14 overflow-x-auto"
          >
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Feature</th>
                  <th className="text-center px-4 py-3 font-mono text-xs uppercase tracking-wider text-primary">noVault</th>
                  <th className="text-center px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Traditional ZK Bridges</th>
                  <th className="text-center px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Basic Encryption</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_DATA.map((row, i) => (
                  <tr key={row.row} className={i < COMPARE_DATA.length - 1 ? 'border-b border-border' : ''}>
                    <td className="px-4 py-3 text-muted-foreground font-medium">{row.row}</td>
                    <td className="px-4 py-3 text-center text-primary font-semibold">{row.novault}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{row.zkBridges}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{row.basic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <SectionDivider />

      {/* ===== WAITLIST ===== */}
      <section id="waitlist" className="py-24 md:py-32">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl p-px bg-gradient-to-br from-primary/20 via-border to-primary/10 overflow-hidden">
            <div className="absolute -inset-px rounded-2xl bg-primary/5 blur-xl -z-10" />
            <div className="absolute inset-0 rounded-2xl animate-border-dance opacity-20 pointer-events-none" />
            <div className="relative rounded-2xl bg-background p-8 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="size-10 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <Shield className="size-5 text-primary" />
                </div>
              </div>
              <SectionHeader
                label="Waitlist"
                title="Join the Waitlist"
                subtitle="Be the first to access noVault's mainnet. Early adopters get priority SDK access."
              />

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="mt-10 flex flex-col sm:flex-row items-center gap-3"
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleWaitlist(); }}
                  className="bg-card border-border flex-1 w-full sm:w-auto"
                />
                <Button onClick={handleWaitlist} className="w-full sm:w-auto whitespace-nowrap">
                  Join Waitlist <ArrowRight className="size-3.5" />
                </Button>
              </motion.div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="mt-4 text-xs text-muted-foreground"
              >
                {waitlistCount !== null
                  ? `Join ${(waitlistCount + 1).toLocaleString()}+ builders on the waitlist`
                  : 'No spam. We only send major protocol updates.'}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,oklch(0.72_0.17_162/0.07),transparent)]" />
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Ready to Build with Privacy?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto"
          >
            Join the developers building the next generation of Web3 applications with
            privacy at the foundation.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <span className="animate-cta-glow">
              <Button size="lg" className="relative z-10 text-base px-8">
                Get Started <ArrowRight className="size-4" />
              </Button>
            </span>
            <Button variant="outline" size="lg" className="text-base px-8">
              Follow us on X <ExternalLink className="size-4" />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              Audited by Trail of Bits
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              Open Source
            </span>
          </motion.div>
        </div>
      </section>

      {/* ===== BACKED BY ===== */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <SectionHeader
            label="Backed By"
            title="Trusted by Leading Teams"
            subtitle="Supported by the best in Web3."
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="flex flex-wrap items-center justify-center gap-3 mt-14"
          >
            {PARTNERS.map((p, i) => (
              <motion.span
                key={p}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="inline-flex items-center px-5 py-3 rounded-lg border border-border bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.72_0.17_162/0.05)] text-sm text-muted-foreground/50 hover:text-foreground transition-colors duration-300 font-mono cursor-default"
              >
                {p}
              </motion.span>
            ))}
          </motion.div>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-6 text-xs text-muted-foreground"
          >
            Strategic partners and advisors. For a complete list, see our documentation.
          </motion.p>
        </div>
      </SectionWrapper>

      {/* ===== F2: TESTIMONIALS ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Community"
            title="Trusted by Builders"
            subtitle="Hear from the teams building with noVault."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-border bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors duration-300"
              >
                {/* Star rating */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}, {t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== F2: PRICING ===== */}
      <SectionDivider />
      <section id="pricing" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Pricing"
            title="Simple, Transparent Pricing"
            subtitle="Start free. Scale as you grow. No hidden fees."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.tier}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className={`rounded-lg border p-6 flex flex-col ${
                  plan.highlighted
                    ? 'border-primary/40 bg-primary/5 shadow-[0_0_30px_oklch(0.72_0.17_162/0.08)] relative'
                    : 'border-border bg-card'
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-mono">Popular</Badge>
                )}
                <h3 className="font-semibold text-base">{plan.tier}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-primary">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{plan.desc}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                  {plan.cta} <ArrowRight className="size-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Team"
            title="Built by Cryptographers"
            subtitle="A lean team of researchers and engineers building the future of private computation."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-16">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 hover:shadow-[0_0_20px_oklch(0.72_0.17_162/0.15)] transition-shadow duration-500 transition-colors duration-300"
              >
                <div className="size-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-base mt-4">{member.name}</h3>
                <p className="text-xs font-mono text-primary uppercase tracking-wider mt-1">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{member.bio}</p>
                <div className="flex items-center gap-4 mt-4">
                  <a href={member.socials.x} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${member.name} on X`}>
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href={member.socials.github} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${member.name} on GitHub`}>
                    <Github className="size-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Contact"
            title="Get in Touch"
            subtitle="Have questions about integrating noVault? Our team is here to help."
          />
          <div className="mt-14 space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Name *</label>
              <Input
                placeholder="Your name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="bg-card border-border w-full"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Email *</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="bg-card border-border w-full"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Subject</label>
              <Input
                placeholder="What is this about?"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="bg-card border-border w-full"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Message *</label>
              <Textarea
                placeholder="Tell us about your project..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="bg-card border-border w-full min-h-[120px] resize-none"
              />
            </div>
            <Button onClick={handleContact} disabled={contactSending} className="w-full sm:w-auto">
              {contactSending ? 'Sending...' : 'Send Message'} <ArrowRight className="size-3.5" />
            </Button>
            <p className="text-xs text-muted-foreground">We typically respond within 24 hours.</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/novault-logo.png" alt="noVault" width={24} height={24} className="rounded-sm" />
                <span className="font-mono font-bold text-sm">no<span className="text-primary">Vault</span></span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Private-by-default infrastructure for the next internet.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#protocol" onClick={(e) => handleNavClick(e, '#protocol')} className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors">Protocol</a></li>
                <li><a href="#developers" onClick={(e) => handleNavClick(e, '#developers')} className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors">SDK</a></li>
                <li><span className="text-sm text-muted-foreground/50 cursor-default">Changelog</span></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><a href='#developers' onClick={(e) => handleNavClick(e, '#developers')} className='footer-link text-sm text-muted-foreground hover:text-foreground transition-colors'>Documentation</a></li>
                <li><a href='https://github.com/novaultech' target='_blank' rel='noopener noreferrer' className='footer-link text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5'>
                  <Github className='size-3.5' /> GitHub
                </a></li>
                <li><a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#roadmap" onClick={(e) => handleNavClick(e, '#roadmap')} className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="footer-link text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <Separator className="mt-12 mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; 2025 noVault. All rights reserved.
            </p>
            <a
              href="https://x.com/novaultech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @novaultech
            </a>
          </div>

          {/* Community / Social Links */}
          <Separator className="mt-6 mb-4" />
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Github className="size-4" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* ===== TERMS DIALOG ===== */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>Last updated: June 2025</DialogDescription>
          </DialogHeader>
          {TERMS_CONTENT}
        </DialogContent>
      </Dialog>

      {/* ===== PRIVACY DIALOG ===== */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>Last updated: June 2025</DialogDescription>
          </DialogHeader>
          {PRIVACY_CONTENT}
        </DialogContent>
      </Dialog>

      {/* ===== F3: COMMAND PALETTE DIALOG ===== */}
      <Dialog open={cmdPaletteOpen} onOpenChange={setCmdPaletteOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          <div className="flex items-center border-b border-border px-4">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <Input
              autoFocus
              value={cmdPaletteSearch}
              onChange={(e) => setCmdPaletteSearch(e.target.value)}
              placeholder="Search sections..."
              className="border-0 focus-visible:ring-0 bg-transparent h-12 text-sm"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredCmdItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No results found.</p>
            )}
            {filteredCmdItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleCmdSelect(item)}
                className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-3"
              >
                {item.type === 'scroll' && <ArrowRight className="size-3.5 text-primary/50" />}
                {item.type === 'terms' && <FileCode2 className="size-3.5 text-primary/50" />}
                {item.type === 'privacy' && <Shield className="size-3.5 text-primary/50" />}
                {item.label}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== F1: COOKIE CONSENT BANNER ===== */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[55] bg-card/95 backdrop-blur-xl border-t border-border"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                We use essential cookies only. No tracking. No ads. Your privacy is our protocol.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrivacyOpen(true)}
                >
                  Learn More
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    try { localStorage.setItem('novault-cookies', 'accepted'); } catch {}
                    setCookieConsent(true);
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== BACK TO TOP ===== */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-all cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-border">{children}</div>;
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
        <span className="size-1.5 rounded-full bg-primary/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
      </div>
    </div>
  );
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="text-xs font-mono uppercase tracking-widest bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-text_4s_ease-in-out_infinite] mb-4"
      >
        {label}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        className="text-3xl md:text-4xl font-bold tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        className="mt-4 text-muted-foreground"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

/* S7: FeatureCard with icon bounce on hover */
function FeatureCard({ icon: Icon, title, desc, index }: { icon: React.ElementType; title: string; desc: string; index: number }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="group relative rounded-lg p-px"
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/50 via-transparent to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Shimmer overlay */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="animate-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="relative rounded-lg border border-border bg-card p-6">
        {/* Numbered indicator */}
        <span className="absolute top-6 left-6 text-xs font-mono text-muted-foreground/30 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* Hover arrow */}
        <ArrowRight className="absolute top-6 right-6 size-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Icon with S7: bounce on hover */}
        <div className="size-10 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
          <Icon className="size-5 text-primary" />
        </div>
        <h3 className="font-semibold text-base mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function ProtocolStep({ num, title, desc, index, code, icon: StepIcon }: { num: string; title: string; desc: string; index: number; code?: string; icon?: React.ElementType }) {
  const isCompleted = index < 2;
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="relative pl-16 md:pl-24"
    >
      {/* Icon circle replacing the dot */}
      <div className={`absolute left-[22px] md:left-[30px] top-1.5 size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center ${isCompleted ? 'bg-primary/5 ring-2 ring-primary/10' : ''}`}>
        {StepIcon && <StepIcon className="size-3 text-primary" />}
      </div>
      <span className="font-mono text-4xl md:text-5xl font-bold text-muted-foreground/15 leading-none select-none">
        {num}
      </span>
      <h3 className="text-xl font-semibold mt-1">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">{desc}</p>
      {code && (
        <code className="inline-block mt-3 text-xs font-mono text-primary/70 bg-primary/5 border border-primary/10 rounded px-2 py-1">
          {code}
        </code>
      )}
    </motion.div>
  );
}

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const { ref, inView } = useInView(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* S6: CodeLine with line numbers */
function CodeLine({ indent = 0, lineNum, children }: { indent?: number; lineNum?: number; children?: React.ReactNode }) {
  return (
    <div className="min-h-[1.75rem] flex">
      {lineNum !== undefined && (
        <span className="w-8 shrink-0 text-right pr-3 text-xs font-mono text-muted-foreground/30 select-none leading-7">
          {lineNum}
        </span>
      )}
      <div style={{ paddingLeft: `${indent * 1.5}rem` }} className="flex-1">
        {children}
      </div>
    </div>
  );
}

function KW({ children }: { children: React.ReactNode }) {
  return <span className="text-primary">{children}</span>;
}
function Type({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-300">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-400/80">{children}</span>;
}
function Num({ children }: { children: React.ReactNode }) {
  return <span className="text-purple-400">{children}</span>;
}
function Com({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground/60">{children}</span>;
}
function Var({ children }: { children: React.ReactNode }) {
  return <span className="text-sky-300">{children}</span>;
}

/* ------------------------------------------------------------------ */
/*  S2: ParticleMesh Component (interactive with mouse)                 */
/* ------------------------------------------------------------------ */

function ParticleMesh({
  className = '',
  particleCount = 40,
  maxDistance = 150,
  color = 'oklch(0.72 0.17 162',
}: {
  className?: string;
  particleCount?: number;
  maxDistance?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((w: number, h: number) => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }, [particleCount]);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const particles = particlesRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const attractRadius = 200;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // S2: Attract particles toward mouse
      if (mx > 0 && my > 0) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < attractRadius && dist > 0) {
          const force = 0.015 * (1 - dist / attractRadius);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      // Clamp position
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `${color} / 0.15)`;
      ctx.fill();

      // Draw lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const ddx = p.x - p2.x;
        const ddy = p.y - p2.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `${color} / 0.06)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // S2: Draw mouse glow
    if (mx > 0 && my > 0) {
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
      gradient.addColorStop(0, `${color} / 0.08)`);
      gradient.addColorStop(1, `${color} / 0)`);
      ctx.beginPath();
      ctx.arc(mx, my, 200, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [maxDistance, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    initParticles(w, h);

    const animate = () => {
      draw(ctx, w, h);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [initParticles, draw]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      initParticles(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // S2: Track mouse position via window events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
