'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
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
  { label: 'Protocol', href: '#protocol' },
  { label: 'Developers', href: '#developers' },
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
  { num: '01', title: 'Encrypt', desc: 'Your data is encrypted client-side before it ever touches the network. No plaintext leaves your machine.', code: 'ZkCipher.encrypt(plaintext, userKey)' },
  { num: '02', title: 'Prove', desc: 'Zero-knowledge proofs verify correctness without revealing inputs. The network validates computation without learning anything.', code: 'ZkProver.generateProof(ciphertext, witness)' },
  { num: '03', title: 'Settle', desc: 'Results settle on-chain with cryptographic guarantees. Verifiable outcomes anchored to the base layer.', code: 'vault.settle(proof, commitment, recipient)' },
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

/* ------------------------------------------------------------------ */
/*  Terms & Privacy content                                           */
/* ------------------------------------------------------------------ */

const TERMS_CONTENT = (
  <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
    <p><strong className="text-foreground">1. Acceptance of Terms</strong><br />
    By accessing or using the noVault platform, services, or any associated software (collectively, the \"Services\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, you may not access or use the Services. We reserve the right to modify these Terms at any time, and continued use of the Services constitutes acceptance of such modifications.</p>
    <p><strong className="text-foreground">2. Description of Services</strong><br />
    noVault provides decentralized privacy infrastructure for Web3 applications, including but not limited to zero-knowledge proof generation, encrypted computation services, developer SDKs, and cross-chain privacy protocols. The Services are provided on an \"as is\" and \"as available\" basis. We make no guarantees regarding uptime, availability, or fitness for any particular purpose.</p>
    <p><strong className="text-foreground">3. User Responsibilities</strong><br />
    You are solely responsible for maintaining the security of any private keys, credentials, or authentication mechanisms you use in connection with the Services. You agree not to: (a) use the Services for any unlawful purpose; (b) attempt to gain unauthorized access to any portion of the Services; (c) interfere with or disrupt the integrity or performance of the Services; (d) attempt to reverse-engineer, decompile, or disassemble any portion of the Services, except as permitted by applicable law.</p>
    <p><strong className="text-foreground">4. Intellectual Property</strong><br />
    All intellectual property rights in the Services, including but not limited to software, documentation, trademarks, and trade secrets, are owned by or licensed to noVault. The open-source components of our codebase are released under their respective licenses, as documented in our public repositories. Nothing in these Terms grants you any rights to the noVault name, logo, or trademarks.</p>
    <p><strong className="text-foreground">5. Disclaimer of Warranties</strong><br />
    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED \"AS IS\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM NOVAULT OR THROUGH THE SERVICES WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THESE TERMS.</p>
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
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');

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

  // Smooth scroll handler
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Button size="sm" className="ml-3">
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
        {/* Radial glow */}
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,oklch(0.72_0.17_162/0.08),transparent)]" />
        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          {/* Testnet Active Badge */}
          <motion.div
            variants={fadeUp}
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
              variants={fadeUp}
              custom={1}
              className="block text-4xl md:text-6xl lg:text-7xl"
            >
              Private-by-Default
            </motion.span>
            <motion.span
              variants={fadeUp}
              custom={2}
              className="block text-4xl md:text-6xl lg:text-7xl text-primary mt-1"
            >
              Infrastructure
            </motion.span>
            <motion.span
              variants={fadeUp}
              custom={3}
              className="block text-4xl md:text-6xl lg:text-7xl text-muted-foreground mt-1"
            >
              for the Next Internet
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Cryptographic privacy primitives for Web3. Build applications where
            user data stays encrypted, provable, and completely yours.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="text-base px-8">
              Start Building <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              Read the Docs <ExternalLink className="size-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

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

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Features"
            title="Privacy That Doesn't Compromise"
            subtitle="Every component is designed so you never have to choose between functionality and privacy."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="flex items-center gap-4 max-w-xs mx-auto py-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-primary text-xs">◆</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ===== PROTOCOL ===== */}
      <section id="protocol" className="py-24 md:py-32 border-t border-border">
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

      {/* ===== ROADMAP ===== */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Roadmap"
            title="The Path Forward"
            subtitle="Our public development milestones. Every commitment, on-chain."
          />

          <div className="mt-16">
            {/* Desktop: horizontal timeline */}
            <div className="hidden md:block relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-[calc(12.5%+10px)] right-[calc(12.5%+10px)] h-px bg-border" />
              <div className="grid grid-cols-4 gap-6">
                {ROADMAP.map((m, i) => (
                  <motion.div
                    key={m.phase}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className="relative pt-12 text-center"
                  >
                    {/* Dot */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2">
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
                    <p className="text-xs font-mono text-muted-foreground mb-1">{m.phase}</p>
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{m.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-10">
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
                    <div className="absolute left-[14px] top-1 -translate-x-1/2">
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
                    <p className="text-xs font-mono text-muted-foreground mb-0.5">{m.phase}</p>
                    <h3 className="font-semibold text-sm">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEVELOPERS ===== */}
      <section id="developers" className="py-24 md:py-32 border-t border-border">
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
            className="mt-14 rounded-lg border border-border bg-card overflow-hidden"
          >
            {/* Code block header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <span className="size-3 rounded-full bg-muted-foreground/30" />
              <span className="size-3 rounded-full bg-muted-foreground/20" />
              <span className="size-3 rounded-full bg-muted-foreground/10" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">PrivateVault.sol</span>
            </div>
            {/* Code content */}
            <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-7 overflow-x-auto">
              <CodeLine indent={0}><KW>pragma</KW> solidity <Num>0.8.24</Num>;</CodeLine>
              <CodeLine indent={0}><KW>import</KW> {"{@noVault/sdk/"}<Str>"PrivateVault.sol"</Str>;</CodeLine>
              <CodeLine />
              <CodeLine indent={0}><KW>contract</KW> <Fn>EncryptedAssetVault</Fn> <KW>is</KW> <Type>PrivateVault</Type> {'{'}</CodeLine>
              <CodeLine indent={1}><KW>using</KW> <Type>ZkCipher</Type> <KW>for</KW> <Type>bytes32</Type>;</CodeLine>
              <CodeLine />
              <CodeLine indent={1}><Fn>function</Fn> <Fn>transfer</Fn>(
                <Type>address</Type> <Var>to</Var>,
                <Type>uint256</Type> <Var>amount</Var>
              ) <KW>external</KW> {'{'}</CodeLine>
              <CodeLine indent={2}><Com>{'// Encrypt inputs client-side'}</Com></CodeLine>
              <CodeLine indent={2}><Type>Ciphertext</Type> <Var>ct</Var> = <Type>ZkCipher</Type>.<Fn>encrypt</Fn>(<Var>amount</Var>, <Var>msg.sender</Var>);</CodeLine>
              <CodeLine indent={2}><Com>{'// Generate ZK proof of valid transfer'}</Com></CodeLine>
              <Type>Proof</Type> <Var>proof</Var> = <Type>ZkProver</Type>.<Fn>proveTransfer</Fn>(<Var>ct</Var>, <Var>to</Var>);
              <CodeLine indent={2}><Com>{'// Settle on-chain \u2014 amount never revealed'}</Com></CodeLine>
              <CodeLine indent={2}><Type>_vault</Type>.<Fn>settle</Fn>(<Var>proof</Var>, <Var>ct</Var>, <Var>to</Var>);</CodeLine>
              <CodeLine indent={1}>{'}'}</CodeLine>
              <CodeLine indent={0}>{'}'}</CodeLine>
            </div>
          </motion.div>

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
                className="rounded-lg border border-border bg-card p-6 text-center"
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

      {/* ===== FAQ ===== */}
      <section className="py-24 md:py-32 border-t border-border">
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
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-foreground py-5">
                    {faq.q}
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

      {/* ===== WAITLIST ===== */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
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
              className="bg-card border-border flex-1 w-full sm:w-auto"
            />
            <Button className="w-full sm:w-auto whitespace-nowrap">
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
            No spam. We only send major protocol updates.
          </motion.p>
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
            <Button size="lg" className="text-base px-8">
              Get Started <ArrowRight className="size-4" />
            </Button>
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
                <li><a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#protocol" onClick={(e) => handleNavClick(e, '#protocol')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Protocol</a></li>
                <li><a href="#developers" onClick={(e) => handleNavClick(e, '#developers')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">SDK</a></li>
                <li><span className="text-sm text-muted-foreground/50 cursor-default">Changelog</span></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><span className="text-sm text-muted-foreground/50 cursor-default">Documentation</span></li>
                <li><span className="text-sm text-muted-foreground/50 cursor-default">GitHub</span></li>
                <li><span className="text-sm text-muted-foreground/50 cursor-default">Blog</span></li>
                <li><span className="text-sm text-muted-foreground/50 cursor-default">Status</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              © 2025 noVault. All rights reserved.
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

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="text-xs font-mono uppercase tracking-widest text-primary mb-4"
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

function FeatureCard({ icon: Icon, title, desc, index }: { icon: React.ElementType; title: string; desc: string; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
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
        {/* Hover arrow */}
        <ArrowRight className="absolute top-6 right-6 size-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Icon with gradient bg */}
        <div className="size-10 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4">
          <Icon className="size-5 text-primary" />
        </div>
        <h3 className="font-semibold text-base mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function ProtocolStep({ num, title, desc, index, code }: { num: string; title: string; desc: string; index: number; code?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="relative pl-16 md:pl-24"
    >
      {/* Dot on the line with pulse */}
      <div className="absolute left-[22px] md:left-[30px] top-1.5 size-[7px] rounded-full bg-primary ring-4 ring-primary/20 animate-pulse-dot" />
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

/* Code syntax helpers */
function CodeLine({ indent = 0, children }: { indent?: number; children?: React.ReactNode }) {
  return (
    <div className="min-h-[1.75rem]" style={{ paddingLeft: `${indent * 1.5}rem` }}>
      {children}
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
